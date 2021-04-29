from django.db import models
from django.urls import reverse

class DataAddress(models.Model):
    post_name = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    network = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    post_index = models.CharField(max_length=50)
    address = models.CharField(max_length=1000)
    latitude = models.CharField(max_length=50)
    longitude = models.CharField(max_length=50)
    screen_qnty = models.IntegerField()
    base_price= models.DecimalField(max_digits=8, decimal_places=2)
    reach= models.IntegerField()
    post_class= models.IntegerField()
    schedule = models.CharField(max_length=50)
    workdays = models.CharField(max_length=50)
    status = models.IntegerField()


    def __str__(self):
        return self.post_index

    class Meta:
        db_table = '[dbo].[data_address]'
