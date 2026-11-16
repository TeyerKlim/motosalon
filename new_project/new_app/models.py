from django.db import models

class Brand(models.Model):
    name = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    description = models.TextField()
    
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
            return self.name
    
class Motorcycle(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    model = models.CharField(max_length=50)
    price = models.IntegerField()
    image = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.model

class Accessory(models.Model):
    name = models.CharField(max_length=50)
    price = models.IntegerField()
    image = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    client_name = models.CharField(max_length=50)
    motorcycle = models.ForeignKey(Motorcycle, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.client_name

class Service(models.Model):
    client_name = models.CharField(max_length=50)
    bike = models.CharField(max_length=50)
    service = models.TextField()

    def __str__(self):
        return self.client_name
