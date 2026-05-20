from django.contrib import admin
from .models import Region, GrapeVariety, Wine, Order, OrderItem

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(GrapeVariety)
class GrapeVarietyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Wine)
class WineAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'color', 'region', 'grape_variety')
    list_filter = ('color', 'region', 'grape_variety')
    search_fields = ('title', 'description')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'total_price', 'status')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'wine', 'quantity', 'price')