from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from .models import Etkinlikler, Kullanicilar, Biletler
from .serializers import EtkinlikSerializer


@api_view(['GET'])
def etkinlikler(request):
    with connection.cursor() as cursor:
        # GROUP_CONCAT ve LEFT JOIN ile kategorileri çektik
        cursor.execute("""
            SELECT 
                e.EtkinlikID, e.EtkinlikAdi, e.Fiyat, e.Kapasite, s.SalonAdi, e.seans_saati,
                GROUP_CONCAT(k.KategoriAdi SEPARATOR ', ') as Kategoriler
            FROM etkinlikler e
            LEFT JOIN Salonlar s ON e.SalonID = s.SalonID
            LEFT JOIN EtkinlikKategori ek ON e.EtkinlikID = ek.EtkinlikID
            LEFT JOIN Kategoriler k ON ek.KategoriID = k.KategoriID
            GROUP BY e.EtkinlikID, s.SalonAdi
        """)
        rows = cursor.fetchall()
        
    result = []
    for row in rows:
        result.append({
            "etkinlikid": row[0],
            "etkinlikadi": row[1],
            "fiyat": row[2],
            "kapasite": row[3],
            "salon_adi": row[4] or "Belirtilmemiş",
            "seans_saati": str(row[5]) if row[5] else None,
            "kategoriler": row[6] or "Kategori Yok" # Yeni alan
        })
    return Response(result)

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
    with connection.cursor() as cursor:
        # Sorguya e.seans_saati eklendi
        cursor.execute("""
            SELECT e.EtkinlikID, e.EtkinlikAdi, b.SatinAlmaTarihi, COUNT(b.BiletID) as Adet, s.SalonAdi, e.seans_saati
            FROM biletler b 
            JOIN etkinlikler e ON b.EtkinlikID = e.EtkinlikID
            LEFT JOIN Salonlar s ON e.SalonID = s.SalonID
            WHERE b.KullaniciID = %s AND b.Durum = 'Aktif'
            GROUP BY e.EtkinlikID, e.EtkinlikAdi, b.SatinAlmaTarihi, s.SalonAdi, e.seans_saati
            ORDER BY b.SatinAlmaTarihi DESC
        """, [kullanici_id])
        rows = cursor.fetchall()
        
    sonuc = [{
        "etkinlik_id": r[0], 
        "etkinlik_adi": r[1], 
        "tarih": r[2].strftime('%Y-%m-%d %H:%M:%S'), 
        "adet": r[3], 
        "salon_adi": r[4], 
        # Saat verisi eklendi
        "seans_saati": str(r[5]) if r[5] else None
    } for r in rows]
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




@api_view(['GET'])
def tum_yorumlar(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT y.YorumID, e.EtkinlikAdi, k.AdSoyad, y.Puan, y.YorumMetni, y.YorumTarihi 
            FROM FilmYorumlari y
            JOIN etkinlikler e ON y.EtkinlikID = e.EtkinlikID
            JOIN kullanicilar k ON y.KullaniciID = k.KullaniciID
            ORDER BY y.YorumTarihi DESC
        """)
        rows = cursor.fetchall()
        
    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "film_adi": row[1],
            "yazan": row[2],
            "puan": row[3],
            "metin": row[4],
            "tarih": row[5]
        })
    return Response(result)

@api_view(['POST'])
def yorum_yap(request):
    kullanici_id = 1  # Projedeki sabit kullanıcı ID'si
    etkinlik_id = request.data.get('etkinlik_id')
    puan = request.data.get('puan')
    yorum_metni = request.data.get('yorum_metni')
    
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO FilmYorumlari (KullaniciID, EtkinlikID, Puan, YorumMetni)
            VALUES (%s, %s, %s, %s)
        """, [kullanici_id, etkinlik_id, puan, yorum_metni])
        
    return Response({"message": "Yorum başarıyla eklendi!"})




@api_view(['POST'])
def bilet_al(request):
    kullanici_id = 1
    etkinlik_id = request.data.get('etkinlik_id')
    # Arayüzden gelen 'adet' bilgisini yakalıyoruz (Gelmezse varsayılan 1)
    adet = int(request.data.get('adet', 1)) 
    
    try:
        with connection.cursor() as cursor:
            # Stored Procedure'e artık 3 parametre (ID, Etkinlik, Adet) gönderiyoruz
            cursor.callproc('sp_BiletSatinAl', [kullanici_id, etkinlik_id, adet])
        return Response({"message": f"{adet} adet bilet başarıyla alındı!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    


@api_view(['POST'])
def bilet_iptal(request):
    try:
        with connection.cursor() as cursor:
            cursor.callproc('sp_BiletIptalGrubu', [1, request.data.get('etkinlik_id'), request.data.get('tarih')])
        return Response({"message": "Bilet iptal edildi ve ücret iade edildi!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)