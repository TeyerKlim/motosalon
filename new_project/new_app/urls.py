from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('motorcycles', MotorcycleViewSet)
router.register('accessories', AccessoryViewSet)
router.register('orders', OrderViewSet)
router.register('service', ServiceViewSet)
router.register('brands', BrandViewSet)

urlpatterns = router.urls