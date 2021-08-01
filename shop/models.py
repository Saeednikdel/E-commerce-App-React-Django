from django.db import models
from accounts.models import UserAccount

LABEL_CHOICES = (
    ('S', 'sale'),
    ('N', 'new'),
    ('P', 'promotion')
)


class SubCategory(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Category(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(blank=True)
    is_active = models.BooleanField(default=True)
    subcategory = models.ManyToManyField(SubCategory, blank=True, null=True)

    def __str__(self):
        return self.title


class Brand(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(blank=True)
    is_active = models.BooleanField(default=True)
    category = models.ManyToManyField(Category)
    subcategory = models.ManyToManyField(SubCategory)

    def __str__(self):
        return self.title


class Color(models.Model):
    title = models.CharField(max_length=100)
    color = models.CharField(blank=True, max_length=20)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Images(models.Model):
    image = models.ImageField()


class Item(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    price = models.FloatField()
    star = models.FloatField(default=5)
    discount_price = models.FloatField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, blank=True)
    color = models.ManyToManyField(Color, blank=True, null=True)
    label = models.CharField(choices=LABEL_CHOICES, max_length=1)
    add_date = models.DateTimeField(auto_now_add=True)
    stock_no = models.IntegerField(default=0)
    sold_no = models.IntegerField(default=0)
    view = models.IntegerField(default=0)
    description_short = models.TextField()
    description_long = models.TextField()
    image = models.ImageField()
    is_active = models.BooleanField(default=True)  # it should be change to false
    image_list = models.ManyToManyField(Images, blank=True, null=True)

    def __str__(self):
        return self.title

    def get_discount_percent(self):
        return (self.price - self.discount_price) / self.price * 100


class Bookmark(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.email


class Comment(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    star = models.FloatField(default=5)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email


class OrderItem(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    color = models.ForeignKey(Color, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_total_discount_item_price(self):
        return self.quantity * self.item.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount_price and self.item.discount_price > 0:
            return self.get_total_discount_item_price()
        return self.get_total_item_price()


class Address(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    zip_code = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)

    def __str__(self):
        return self.user.email


class Order(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    seller = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='seller')
    ref_code = models.CharField(max_length=20)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    shipping_address = models.ForeignKey(Address, default=None, on_delete=models.SET_NULL, null=True)
    payment = models.ForeignKey(
        'Payment', on_delete=models.SET_NULL, blank=True, null=True)
    coupon = models.ForeignKey(
        'Coupon', on_delete=models.SET_NULL, blank=True, null=True)
    being_delivered = models.BooleanField(default=False)
    received = models.BooleanField(default=False)
    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        if self.coupon:
            total -= self.coupon.amount
        return total


class Slide(models.Model):
    caption1 = models.CharField(max_length=100)
    caption2 = models.CharField(max_length=100)
    link = models.CharField(max_length=100)
    image = models.ImageField(help_text="Size: 1920x570")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "{} - {}".format(self.caption1, self.caption2)


class Payment(models.Model):
    stripe_charge_id = models.CharField(max_length=50)
    user = models.ForeignKey(UserAccount, on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email


class Coupon(models.Model):
    code = models.CharField(max_length=15)
    amount = models.FloatField()

    def __str__(self):
        return self.code


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()

    def __str__(self):
        return f"{self.pk}"
