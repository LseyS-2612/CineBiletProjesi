from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from .models import Etkinlikler, Kullanicilar, Biletler
from .serializers import EtkinlikSerializer
from django.contrib.auth.hashers import make_password, check_password


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
        cursor.execute("""
            SELECT e.EtkinlikID, e.EtkinlikAdi, b.SatinAlmaTarihi, COUNT(b.BiletID) as Adet, s.SalonAdi, e.seans_saati,
                   GROUP_CONCAT(b.koltuk_no SEPARATOR ', ') as koltuklar
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
        "seans_saati": str(r[5]) if r[5] else None,
        "koltuklar": r[6] if r[6] else "-" # Koltuklar eklendi
    } for r in rows]
    return Response(sonuc)


@api_view(['POST'])
def bakiye_ekle(request):
    kullanici_id = request.data.get('kullanici_id')
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
    kullanici_id = request.data.get('kullanici_id') # Projedeki sabit kullanıcı ID'si
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
    kullanici_id = request.data.get('kullanici_id') # Artık sabit 1 değil, giriş yapan kullanıcı
    etkinlik_id = request.data.get('etkinlik_id')
    secilen_koltuklar = request.data.get('koltuklar', []) 
    adet = len(secilen_koltuklar)
    
    if adet == 0:
        return Response({"error": "Lütfen en az 1 koltuk seçin."}, status=400)

    try:
        with connection.cursor() as cursor:
            for koltuk in secilen_koltuklar:
                cursor.callproc('sp_BiletSatinAl', [kullanici_id, etkinlik_id, 1, koltuk])
                
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
    


@api_view(['GET'])
def dolu_koltuklar(request, etkinlik_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT koltuk_no FROM biletler 
            WHERE EtkinlikID = %s AND Durum = 'Aktif' AND koltuk_no IS NOT NULL
        """, [etkinlik_id])
        rows = cursor.fetchall()
        
    koltuklar = [row[0] for row in rows]
    return Response(koltuklar)





@api_view(['POST'])
def kayit_ol(request):
    adsoyad = request.data.get('adsoyad')
    email = request.data.get('email')
    sifre = request.data.get('sifre')
    
    if not adsoyad or not email or not sifre:
        return Response({"error": "Lütfen tüm alanları doldurun."}, status=400)
        
    hashed_sifre = make_password(sifre) # Şifreyi şifreliyoruz
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO kullanicilar (AdSoyad, Bakiye, email, sifre, rol) 
                VALUES (%s, 0, %s, %s, 'kullanici')
            """, [adsoyad, email, hashed_sifre])
        return Response({"message": "Kayıt başarılı! Giriş yapabilirsiniz."})
    except Exception as e:
     
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def giris_yap(request):
    email = request.data.get('email')
    sifre = request.data.get('sifre')
    
    with connection.cursor() as cursor:
        cursor.execute("SELECT KullaniciID, AdSoyad, Bakiye, sifre, rol FROM kullanicilar WHERE email = %s", [email])
        row = cursor.fetchone()
        
    if row:
        db_sifre = row[3]
        # Eğer şifre uyuşuyorsa (veya test için düz metin 123456 girdiysek)
        if check_password(sifre, db_sifre) or sifre == db_sifre:
            kullanici_bilgisi = {
                "id": row[0],
                "adsoyad": row[1],
                "bakiye": row[2],
                "rol": row[4]
            }
            return Response({"message": "Giriş başarılı", "kullanici": kullanici_bilgisi})
            
    return Response({"error": "E-posta veya şifre hatalı."}, status=400)


@api_view(['POST'])
def profil_guncelle(request):
    kullanici_id = request.data.get('kullanici_id')
    adsoyad = request.data.get('adsoyad')
    sifre = request.data.get('sifre')

    try:
        with connection.cursor() as cursor:
            if sifre:
                hashed_sifre = make_password(sifre)
                cursor.execute("UPDATE kullanicilar SET AdSoyad = %s, sifre = %s WHERE KullaniciID = %s", [adsoyad, hashed_sifre, kullanici_id])
            else:
                cursor.execute("UPDATE kullanicilar SET AdSoyad = %s WHERE KullaniciID = %s", [adsoyad, kullanici_id])
        return Response({"message": "Profil başarıyla güncellendi!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    


@api_view(['POST'])
def etkinlik_ekle(request):
    ad = request.data.get('ad')
    fiyat = request.data.get('fiyat')
    kapasite = request.data.get('kapasite')
    seans = request.data.get('seans')
    salon_id = 1 # Varsayılan olarak 1. salona ekleyelim

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO etkinlikler (EtkinlikAdi, Fiyat, Kapasite, SalonID, seans_saati)
                VALUES (%s, %s, %s, %s, %s)
            """, [ad, fiyat, kapasite, salon_id, seans])
        return Response({"message": "Film başarıyla eklendi!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def etkinlik_sil(request):
    etkinlik_id = request.data.get('etkinlik_id')
    try:
        with connection.cursor() as cursor:
            # Önce filme ait biletleri ve yorumları siliyoruz (Foreign Key hatası almamak için)
            cursor.execute("DELETE FROM biletler WHERE EtkinlikID = %s", [etkinlik_id])
            cursor.execute("DELETE FROM FilmYorumlari WHERE EtkinlikID = %s", [etkinlik_id])
            cursor.execute("DELETE FROM EtkinlikKategori WHERE EtkinlikID = %s", [etkinlik_id])
            # En son filmi siliyoruz
            cursor.execute("DELETE FROM etkinlikler WHERE EtkinlikID = %s", [etkinlik_id])
        return Response({"message": "Film başarıyla silindi!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)