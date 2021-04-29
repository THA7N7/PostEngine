from django.http import HttpResponse, HttpResponseNotFound, Http404
from django.shortcuts import render
from django.db.models import Q

from rest_framework.viewsets import ModelViewSet

from .models import *
from .serializers import *

def index(request):
	main_table = DataAddress.objects.filter(status = 1)
	flt_network = DataAddress.objects.filter(status = 1).values('network').distinct().order_by('network')
	flt_region = DataAddress.objects.filter(status = 1).values('region').distinct().order_by('region')
	flt_city = DataAddress.objects.filter(status = 1).exclude(city__exact='').values('city').distinct()
	flt_area = DataAddress.objects.filter(status = 1).exclude(area__exact='').values('area').distinct()
	flt_district = DataAddress.objects.filter(status = 1).exclude(district__exact='').values('district').distinct()
	context = {
		'Addresses': main_table,
		'Networks': flt_network,
		'Regions': flt_region,
		'Cities': flt_city,
		'Areas': flt_area,
		'Districts': flt_district,
	}
	return render(request, 'filter/index.html', context = context)

def get_network(request):
	main_table = DataAddress.objects.filter(Q(network = 'МРФ Москва') | Q(network = 'МРФ Северо-Запад')).filter(status = 1)
	flt_region = DataAddress.objects.filter(Q(network = 'МРФ Москва') | Q(network = 'МРФ Северо-Запад')).filter(status = 1).values('region').distinct().order_by('region')
	
	context = {
		'Addresses': main_table,
		'Regions': flt_region,
	}
	return render(request, 'filter/index.html', context = context)

def get_region(request):
	main_table = DataAddress.objects.filter(Q(region = 'Московская обл.') | Q(region = 'Москва')).filter(status = 1)
	flt_city = DataAddress.objects.filter(Q(region = 'Московская обл.') | Q(region = 'Москва')).filter(status = 1).exclude(city__exact='').values('city').distinct()

	context = {
		'Addresses': main_table,
		'Cities': flt_city,
	}
	return render(request, 'filter/index.html', context = context)

def get_city(request):
	main_table = DataAddress.objects.filter(Q(city = 'Чехов') | Q(city = 'Москва')).filter(status = 1)
	flt_area = DataAddress.objects.filter(Q(city = 'Чехов') | Q(city = 'Москва')).filter(status = 1).exclude(area__exact='').values('area').distinct()

	context = {
		'Addresses': main_table,
		'Areas': flt_area,
	}
	return render(request, 'filter/index.html', context = context)

def get_area(request):
	main_table = DataAddress.objects.filter(Q(area = 'ЮВАО') | Q(area = 'ЮАО')).filter(status = 1)
	flt_district = DataAddress.objects.filter(Q(area = 'ЮВАО') | Q(area = 'ЮАО')).filter(status = 1).exclude(district__exact='').values('district').distinct()

	context = {
		'Addresses': main_table,
		'Districts': flt_district,
	}
	return render(request, 'filter/index.html', context = context)

def get_district(request):
	main_table = DataAddress.objects.filter(Q(district = 'Южнопортовый') | Q(district = 'Таганский')).filter(status = 1)

	context = {
		'Addresses': main_table,
	}
	return render(request, 'filter/index.html', context = context)

class AddressView(ModelViewSet):
	queryset = DataAddress.objects.all() 
	serializer_class = AddressSerializer
