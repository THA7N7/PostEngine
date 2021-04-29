from rest_framework.serializers import ModelSerializer

from .models import DataAddress

class AddressSerializer(ModelSerializer):

	class Meta:
		model = DataAddress
		fields = ['post_index', 'network', 'region', 'city', 'address', 'screen_qnty', 'workdays', 'reach']