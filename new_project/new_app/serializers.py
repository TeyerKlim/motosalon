from rest_framework import serializers
from .models import Category, Motorcycle, Accessory, Order, Service, Brand

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category; 
        fields = '__all__'

class MotorcycleSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Motorcycle; 
        fields = '__all__'

class AccessorySerializer(serializers.ModelSerializer):
    class Meta: 
        model = Accessory; 
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Order; 
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Service; 
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'