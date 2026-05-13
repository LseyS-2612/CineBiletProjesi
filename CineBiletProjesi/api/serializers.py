from rest_framework import serializers
from .models import Etkinlikler

class EtkinlikSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etkinlikler
        fields = '__all__'