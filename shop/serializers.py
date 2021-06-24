from rest_framework import serializers
from .models import Item, Images, BillingAddress, OrderItem, Order
from accounts .models import UserAccount


class CartSerializer(serializers.ModelSerializer):
    item_title = serializers.ReadOnlyField(source='item.title')
    item_price = serializers.ReadOnlyField(source='item.price')

    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'email', 'name', 'account_no',
                  'phone_no', 'birth_date', 'id_code',
                  'is_seller', 'is_staff', 'join_date')


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = '__all__'


class ItemsSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Item
        fields = '__all__'


class ItemSerializer(serializers.Serializer):
    item = ItemsSerializer(many=False)
    images = ImageSerializer(many=True)


class OrderFullSerializer(serializers.Serializer):
    order = OrderSerializer(many=False)
    items = CartSerializer(many=True)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingAddress
        fields = '__all__'
