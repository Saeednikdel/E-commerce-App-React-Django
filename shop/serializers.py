from rest_framework import serializers
from .models import Item, Images, Address, OrderItem, Order, Slide, Bookmark, Comment
from accounts .models import UserAccount


class CartSerializer(serializers.ModelSerializer):
    item_title = serializers.ReadOnlyField(source='item.title')
    item_price = serializers.ReadOnlyField(source='item.price')
    image = serializers.ImageField(source='item.image')

    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    address = serializers.ReadOnlyField(source='shipping_address.address')

    class Meta:
        model = Order
        fields = ('id', 'ordered', 'ordered_date',
                  'being_delivered', 'received', 'address')


class OrderFullSerializer(serializers.Serializer):
    order = OrderSerializer(many=False)
    items = CartSerializer(many=True)


class BookmarkSerializer(serializers.ModelSerializer):
    item_title = serializers.ReadOnlyField(source='item.title')
    item_price = serializers.ReadOnlyField(source='item.price')
    image = serializers.ImageField(source='item.image')

    class Meta:
        model = Bookmark
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Comment
        fields = ('user_name', 'star', 'title', 'description', 'date')


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'email', 'name', 'account_no',
                  'phone_no', 'birth_date', 'id_code')


class UserSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'name', 'account_no',
                  'phone_no', 'birth_date', 'id_code')


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ('image',)


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = '__all__'


class ItemsSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Item
        fields = ('id', 'user_name', 'title', 'price', 'star', 'discount_price', 'image')


class Item1Serializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Item
        fields = ('id', 'user_name', 'title', 'price', 'star', 'discount_price', 'label', 'stock_no',
                  'description_short', 'description_long', )


class ItemSerializer(serializers.Serializer):
    item = Item1Serializer(many=False)
    images = ImageSerializer(many=True)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
