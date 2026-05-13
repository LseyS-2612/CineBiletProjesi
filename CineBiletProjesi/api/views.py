from django.shortcuts import render

from rest_framework.generics import ListAPIView
from .models import Etkinlikler
from .serializers import EtkinlikSerializer

class EtkinlikListesi(ListAPIView):
    queryset = Etkinlikler.objects.all()
    serializer_class = EtkinlikSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection

@api_view(['POST'])
def bilet_al(request):
    kullanici_id = 1 # Şimdilik sabit, senin kullanıcın
    etkinlik_id = request.data.get('etkinlik_id')
    
    try:
        with connection.cursor() as cursor:
            # MySQL'de yazdığımız SP'yi tetikliyoruz
            cursor.callproc('sp_BiletSatinAl', [kullanici_id, etkinlik_id])
        return Response({"message": "Bilet başarıyla alındı!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    


    from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Kullanicilar, Biletler, Etkinlikler
from .serializers import EtkinlikSerializer # Daha önce oluşturmuştuk

@api_view(['GET'])
def kullanici_detay(request, pk):
    kullanici = Kullanicilar.objects.get(pk=pk)
    return Response({
        "adsoyad": kullanici.adsoyad,
        "bakiye": kullanici.bakiye
    })

@api_view(['GET'])
def biletlerim(request, kullanici_id):
    # Kullanıcının aldığı aktif biletleri getiriyoruz
    biletler = Biletler.objects.filter(kullaniciid=kullanici_id, durum='Aktif')
    sonuc = []
    for bilet in biletler:
        etkinlik = Etkinlikler.objects.get(pk=bilet.etkinlikid)
        sonuc.append({
            "bilet_id": bilet.biletid,
            "etkinlik_adi": etkinlik.etkinlikadi,
            "tarih": bilet.satinalmatarihi
        })
    return Response(sonuc)

@api_view(['POST'])
def bakiye_ekle(request):
    kullanici_id = 1  # Senin ID'n
    tutar = request.data.get('tutar', 0)
    
    try:
        kullanici = Kullanicilar.objects.get(pk=kullanici_id)
        # Gelen tutarı sayıya çevirip ekliyoruz
        kullanici.bakiye = float(kullanici.bakiye) + float(tutar)
        kullanici.save()
        return Response({"message": f"{tutar} TL başarıyla yüklendi!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)