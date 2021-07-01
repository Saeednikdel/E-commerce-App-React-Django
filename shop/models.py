from django.db import models
from accounts.models import UserAccount


LABEL_CHOICES = (
    ('S', 'sale'),
    ('N', 'new'),
    ('P', 'promotion')
)
ADDRESS_CHOICES = (
    ('B', 'Billing'),
    ('S', 'Shipping'),
)


class Category(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class SubCategory(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField()
    is_active = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Item(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
    label = models.CharField(choices=LABEL_CHOICES, max_length=1)
    add_date = models.DateTimeField(auto_now_add=True)
    stock_no = models.CharField(max_length=10)
    description_short = models.CharField(max_length=50)
    description_long = models.TextField()
    image = models.ImageField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Images(models.Model):
    image = models.ImageField()
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="images")

    def __str__(self):
        return self.item.title


class Bookmark(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.email


class OrderItem(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"


class Order(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=20)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    shipping_address = models.ForeignKey(
        'BillingAddress', related_name='shipping_address', on_delete=models.SET_NULL, blank=True, null=True)
    billing_address = models.ForeignKey(
        'BillingAddress', related_name='billing_address', on_delete=models.SET_NULL, blank=True, null=True)
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


class BillingAddress(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    address = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email

    class Meta:
        verbose_name_plural = 'BillingAddresses'


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
