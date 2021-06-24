from django.contrib import admin
from .models import SubCategory, Category, Item, Slide, OrderItem, Order, Payment, Coupon, Refund, BillingAddress,Images

# Register your models here.
admin.site.register(Item)
admin.site.register(Images)
admin.site.register(SubCategory)
admin.site.register(Category)
admin.site.register(Slide)
admin.site.register(OrderItem)
admin.site.register(Order)
admin.site.register(Payment)
admin.site.register(Coupon)
admin.site.register(Refund)
admin.site.register(BillingAddress)
