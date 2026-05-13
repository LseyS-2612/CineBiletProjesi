from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from .models import Etkinlikler, Kullanicilar, Biletler
from .serializers import EtkinlikSerializer

# ana sayfadaki filmleri listeler
class EtkinlikListesi(ListAPIView):
    queryset = Etkinlikler.objects.all()
    serializer_class = EtkinlikSerializer

@api_view(['POST'])
def bilet_al(request):
    kullanici_id = 1 # hoca sorarsa burayi ilerde auth sistemine baglicam dersin
    etkinlik_id = request.data.get('etkinlik_id')
    
    try:
        with connection.cursor() as cursor:
            # mysql tarafındaki procedure tetikleniyor
            cursor.callproc('sp_BiletSatinAl', [kullanici_id, etkinlik_id])
        return Response({"message": "Bilet başarıyla alındı!"})
    except Exception as e:
        # sql'den gelen hata mesajini doner
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
def kullanici_detay(request, pk):
    try:
        kullanici = Kullanicilar.objects.get(pk=pk)
        return Response({
            "adsoyad": kullanici.adsoyad,
            "bakiye": kullanici.bakiye
        })
    except:
        return Response({"error": "kullanici bulunamadi"}, status=404)

@api_view(['GET'])
def biletlerim(request, kullanici_id):
    # durumu aktif olan biletleri listeleyelim
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
    kullanici_id = 1
    tutar = request.data.get('tutar', 0)
    
    try:
        kullanici = Kullanicilar.objects.get(pk=kullanici_id)
        kullanici.bakiye = float(kullanici.bakiye) + float(tutar)
        kullanici.save()
        return Response({"message": f"{tutar} TL eklendi."})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# sql view verisini ceken yer burasi
@api_view(['GET'])
def etkinlik_analizi(request):
    with connection.cursor() as cursor:
        # view zaten sirali geliyor o yuzden direkt cektim
        cursor.execute("SELECT * FROM View_EtkinlikAnalizi")
        rows = cursor.fetchall()
        
    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "ad": row[1],
            "satis": row[2],
            "hasilat": row[3],
            "doluluk": row[4]
        })
    return Response(result)

# trigger loglarini ceken yer
@api_view(['GET'])
def islem_gecmisi(request, kullanici_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM IslemLoglari WHERE KullaniciID = %s ORDER BY IslemTarihi DESC", [kullanici_id])
        rows = cursor.fetchall()
        
    result = []
    for row in rows:
        result.append({
            "tip": row[2],
            "eski": row[3],
            "yeni": row[4],
            "tutar": row[5],
            "tarih": row[6]
        })
    return Response(result)