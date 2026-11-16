from django.contrib import admin
from .models import Category, Motorcycle, Accessory, Order, Service

admin.site.register(Category)
admin.site.register(Motorcycle)
admin.site.register(Accessory)
admin.site.register(Order)
admin.site.register(Service)