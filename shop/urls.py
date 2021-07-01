from django.urls import path
from . import views

urlpatterns = [
    path('items-list/<str:pk>/', views.itemList, name="items-list"),
    path('slides/', views.slide, name="slide"),
    path('item-detail/<str:pk>/', views.itemDetail, name="item-detail"),
    path('item-create/', views.itemCreate, name="items-create"),
    path('order-detail/<str:pk>/', views.orderDetail, name="order-detail"),

    path('user-detail/<str:pk>/', views.userDetail, name="user-detail"),
    path('address-list/<str:pk>/', views.addressList, name="address-list"),
    path('cart/<str:pk>/', views.cart, name="cart"),
    path('bookmark/<str:pk>/', views.bookmark, name="bookmark"),

    path('cart-add/<str:pk>/', views.cartAdd, name="cart-add"),
    path('cart-remove/<str:pk>/', views.cartRemove, name="cart-remove"),
    path('cart-remove-one/<str:pk>/', views.cartRemoveOne, name="cart-remove-one"),

]
