from django.contrib import admin
from .models import UserAccount
from import_export.admin import ImportExportModelAdmin


class UserAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'phone_no', 'is_staff', 'is_seller')
    list_editable = ('is_active',)
    list_per_page = 10
    search_fields = ('email', 'name')
    list_filter = ('is_active', 'is_staff', 'is_seller', 'join_date')


admin.site.register(UserAccount, UserAdmin)
