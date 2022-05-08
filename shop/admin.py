from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import SubCategory, Category, Item, \
    Slide, OrderItem, Order, Payment, Coupon, Refund,\
    Address, Images, Bookmark, Comment, Brand, Color


class BrandAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('title', 'is_active')
    list_editable = ('is_active',)
    list_per_page = 10
    search_fields = ('title', 'is_active')


class ColorAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('title', 'is_active')
    list_editable = ('is_active',)
    list_per_page = 10
    search_fields = ('title', 'is_active')

class ItemAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('title', 'is_active', 'category', 'subcategory', 'brand')
    list_editable = ('is_active',)
    list_per_page = 10
    search_fields = ('title', 'is_active', 'category', 'subcategory', 'brand')
    list_filter = ('is_active', 'category', 'subcategory', 'brand')


admin.site.register(Item, ItemAdmin)
admin.site.register(Color, ColorAdmin)
admin.site.register(Comment)
admin.site.register(Bookmark)
admin.site.register(Images)
admin.site.register(SubCategory)
admin.site.register(Category)
admin.site.register(Slide)
admin.site.register(OrderItem)
admin.site.register(Order)
admin.site.register(Payment)
admin.site.register(Coupon)
admin.site.register(Refund)
admin.site.register(Address)
admin.site.register(Brand, BrandAdmin)
