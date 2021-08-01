from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from accounts.models import UserAccount

User = get_user_model()


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'email', 'name', 'password', 'is_seller', 'is_active')


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'email', 'name', 'account_no',
                  'phone_no', 'birth_date', 'id_code', 'is_seller', 'join_date')
