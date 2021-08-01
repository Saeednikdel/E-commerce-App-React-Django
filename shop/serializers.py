from rest_framework import serializers
from .models import Item, Address, OrderItem, Order, Slide, \
    Bookmark, Comment, Category, SubCategory, Brand, Color, Images
from accounts.models import UserAccount


class CartSerializer(serializers.ModelSerializer):
    item_title = serializers.ReadOnlyField(source='item.title')
    image = serializers.ImageField(source='item.image')
    item_discount = serializers.ReadOnlyField(source='item.discount_price')
    item_price = serializers.ReadOnlyField(source='item.price')
    item_user = serializers.ReadOnlyField(source='item.user.name')
    total_item_price = serializers.FloatField(source='get_total_item_price')
    total_discount_item_price = serializers.FloatField(source='get_total_discount_item_price')
    amount_saved = serializers.FloatField(source='get_amount_saved')
    final_price = serializers.FloatField(source='get_final_price')
    color_title = serializers.ReadOnlyField(source='color.title')
    color_hex = serializers.ReadOnlyField(source='color.color')

    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    address = serializers.ReadOnlyField(source='shipping_address.address')
    total = serializers.FloatField(source='get_total')
    cart_items = CartSerializer(source="items", read_only=True, many=True)

    class Meta:
        model = Order
        fields = ('id', 'ordered', 'ordered_date',
                  'being_delivered', 'received', 'address', 'total', 'seller', 'cart_items')


class BookmarkSerializer(serializers.ModelSerializer):
    item_title = serializers.ReadOnlyField(source='item.title')
    item_price = serializers.ReadOnlyField(source='item.price')
    image = serializers.ImageField(source='item.image')
    item_discount = serializers.ReadOnlyField(source='item.discount_price')
    item_user = serializers.ReadOnlyField(source='item.user.name')
    item_star = serializers.ReadOnlyField(source='item.star')
    item_stock = serializers.ReadOnlyField(source='item.stock_no')

    class Meta:
        model = Bookmark
        fields = ('item_title', 'item_price', 'image', 'item_discount', 'item_user',
                  'item_star', 'item_stock', 'item')


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Comment
        fields = ('user_name', 'star', 'title', 'description', 'date')


class UserSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'name', 'account_no',
                  'phone_no', 'birth_date', 'id_code')


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = '__all__'


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ('id', 'title', 'color')


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = '__all__'


class ItemsSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')
    discount_percent = serializers.FloatField(source='get_discount_percent')

    class Meta:
        model = Item
        fields = ('id', 'user_name', 'title', 'price', 'star', 'discount_price', 'image',
                  'stock_no', 'discount_percent')


class ItemSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')
    brand_name = serializers.ReadOnlyField(source='brand.title')
    discount_percent = serializers.FloatField(source='get_discount_percent')
    colors = ColorSerializer(source="color", read_only=True, many=True)
    images = ImageSerializer(source="image_list", read_only=True, many=True)

    class Meta:
        model = Item
        fields = ('id', 'user_name', 'title', 'price', 'star', 'discount_price', 'label', 'stock_no',
                  'description_short', 'description_long', 'brand_name', 'discount_percent', 'colors', 'images')


class SubCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = SubCategory
        fields = ('title',)


class CategorySerializer(serializers.ModelSerializer):
    sub_category = SubCategorySerializer(source="subcategory", read_only=True, many=True)

    class Meta:
        model = Category
        fields = ('title', 'sub_category')


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ('id', 'title', 'description', 'image')
