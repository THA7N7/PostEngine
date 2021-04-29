from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import *
from . import views

router = SimpleRouter()

router.register('api/filter', AddressView)

urlpatterns = [
	path('', index, name = 'home'),
	path('n/', get_network, name = 'n'),
	path('nr/', get_region, name = 'nr'),
	path('nrc/', get_city, name = 'nrc'),
	path('nrca/', get_area, name = 'nrca'),
	path('nrcad/', get_district, name = 'nrcad'),
]

urlpatterns += router.urls