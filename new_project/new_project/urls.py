from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('new_app.urls')),
    path('', TemplateView.as_view(template_name='1.html'), name='home'),
]