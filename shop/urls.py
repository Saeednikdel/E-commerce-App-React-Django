from django.urls import path
from . import views

urlpatterns = [
    path('items-list/<str:pk>/', views.itemList, name="items-list"),
    path('item-detail/<str:pk>/', views.itemDetail, name="item-detail"),
    path('item-create/', views.itemCreate, name="items-create"),

    path('slides/', views.slide, name="slide"),
    path('menu-list/', views.menuList, name="menu-list"),
    path('brand-list/', views.brandList, name="brand-list"),

    path('comment-list/<str:pk>/<str:sk>/', views.commentList, name="comment-list"),
    path('comment/', views.comment, name="comment"),

    path('order-detail/<str:pk>/', views.orderDetail, name="order-detail"),

    # path('user-detail/<str:pk>/', views.userDetail, name="user-detail"),
    path('user-set/', views.userSet, name="user-set"),

    path('address-list/<str:pk>/', views.addressList, name="address-list"),
    path('address/', views.address, name="address"),

    path('bookmark-list/<str:pk>/<str:sk>/', views.bookmarkList, name="bookmark-list"),
    path('bookmark/', views.bookmark, name="bookmark"),

    path('cart-add/<str:pk>/', views.cartAdd, name="cart-add"),
    path('cart-remove/<str:pk>/', views.cartRemove, name="cart-remove"),
    path('cart-remove-one/<str:pk>/', views.cartRemoveOne, name="cart-remove-one"),

]
