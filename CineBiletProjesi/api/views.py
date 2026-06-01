from datetime import datetime, timedelta
from django.db import connection, transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password

# Sadece kullanılan modeli import ediyoruz
from .models import Kullanicilar

@api_view(['GET'])
def etkinlikler(request):
    with connection.cursor() as cursor:
        # Sadece 'Aktif' filmleri getir ve Kapasiteyi Salonlar'dan çek
        cursor.execute("""
            SELECT 
                e.EtkinlikID, e.EtkinlikAdi, e.Fiyat, s.ToplamKapasite, s.SalonAdi, e.seans_saati, e.EtkinlikTarihi,
                GROUP_CONCAT(k.KategoriAdi SEPARATOR ', ') as Kategoriler
            FROM etkinlikler e
            LEFT JOIN Salonlar s ON e.SalonID = s.SalonID
            LEFT JOIN EtkinlikKategori ek ON e.EtkinlikID = ek.EtkinlikID
            LEFT JOIN Kategoriler k ON ek.KategoriID = k.KategoriID
            WHERE e.Durum = 'Aktif'
            GROUP BY e.EtkinlikID, s.SalonAdi, s.ToplamKapasite
        """)
        rows = cursor.fetchall()
        
    result = [{
        "etkinlikid": row[0],
        "etkinlikadi": row[1],
        "fiyat": row[2],
        "kapasite": row[3], # Artık salon tablosundan geliyor
        "salon_adi": row[4] or "Belirtilmemiş",
        "seans_saati": str(row[5]) if row[5] else None,
        "tarih": str(row[6]),
        "kategoriler": row[7] or "Kategori Yok"
    } for row in rows]
    return Response(result)

@api_view(['GET'])
def kullanici_detay(request, pk):
    try:
        kullanici = Kullanicilar.objects.get(pk=pk)
        return Response({
            "adsoyad": kullanici.adsoyad,
            "bakiye": kullanici.bakiye
        })
    except Kullanicilar.DoesNotExist:
        return Response({"error": "Kullanıcı bulunamadı."}, status=404)


@api_view(['GET'])
def biletlerim(request, kullanici_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT e.EtkinlikID, e.EtkinlikAdi, e.EtkinlikTarihi, COUNT(b.BiletID) as Adet, s.SalonAdi, e.seans_saati,
                   GROUP_CONCAT(b.koltuk_no SEPARATOR ', ') as koltuklar
            FROM biletler b 
            JOIN etkinlikler e ON b.EtkinlikID = e.EtkinlikID
            LEFT JOIN Salonlar s ON e.SalonID = s.SalonID
            WHERE b.KullaniciID = %s AND b.Durum = 'Aktif'
            GROUP BY e.EtkinlikID, e.EtkinlikAdi, e.EtkinlikTarihi, s.SalonAdi, e.seans_saati
            ORDER BY e.EtkinlikTarihi DESC, e.seans_saati DESC
        """, [kullanici_id])
        rows = cursor.fetchall()
        
    sonuc = [{
        "etkinlik_id": r[0], 
        "etkinlik_adi": r[1], 
        "tarih": str(r[2]) if r[2] else "-", 
        "adet": r[3], 
        "salon_adi": r[4], 
        "seans_saati": str(r[5]) if r[5] else "-",
        "koltuklar": r[6] if r[6] else "-"
    } for r in rows]
    return Response(sonuc)


@api_view(['POST'])
def bakiye_ekle(request):
    kullanici_id = request.data.get('kullanici_id')
    tutar = request.data.get('tutar', 0)
    
    try:
        # 1. Kullanıcının bakiyesini güncelle
        kullanici = Kullanicilar.objects.get(pk=kullanici_id)
        kullanici.bakiye = float(kullanici.bakiye) + float(tutar)
        kullanici.save()
        
        # 2. Yeni sisteme göre log kaydını ekle
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO SistemLoglari (KullaniciID, IslemTipi, Aciklama) VALUES (%s, 'BAKIYE_YUKLEME', %s)", 
                [kullanici_id, f"Hesaba bakiye yüklendi (+{tutar} ₺)"]
            )
            
        return Response({"message": f"{tutar} ₺ başarıyla eklendi."})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
def etkinlik_analizi(request):
    with connection.cursor() as cursor:
        # YENİ: ORDER BY satis DESC ekleyerek en çok bilet satandan en aza doğru sıralıyoruz
        cursor.execute("SELECT * FROM View_EtkinlikAnalizi ORDER BY satis DESC")
        rows = cursor.fetchall()
        
    result = [{
        "id": row[0],
        "ad": row[1],
        "satis": row[2],
        "hasilat": row[3],
        "doluluk": row[4]
    } for row in rows]
    return Response(result)


@api_view(['GET'])
def islem_gecmisi(request, kullanici_id):
    with connection.cursor() as cursor:
        # Yeni tekil tabloya sorgu
        cursor.execute("SELECT IslemTipi, Aciklama, IslemTarihi FROM SistemLoglari WHERE KullaniciID = %s ORDER BY IslemTarihi DESC", [kullanici_id])
        rows = cursor.fetchall()
        
    result = [{
        "tip": row[0],
        "aciklama": row[1],
        "tarih": row[2]
    } for row in rows]
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
        
    result = [{
        "id": row[0],
        "film_adi": row[1],
        "yazan": row[2],
        "puan": row[3],
        "metin": row[4],
        "tarih": row[5]
    } for row in rows]
    return Response(result)


@api_view(['POST'])
def yorum_yap(request):
    kullanici_id = request.data.get('kullanici_id')
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
    kullanici_id = request.data.get('kullanici_id')
    etkinlik_id = request.data.get('etkinlik_id')
    secilen_koltuklar = request.data.get('koltuklar', []) 
    adet = len(secilen_koltuklar)
    
    if adet == 0:
        return Response({"error": "Lütfen en az 1 koltuk seçin."}, status=400)

    try:
        with transaction.atomic():
            with connection.cursor() as cursor:
                # 1. Biletleri ekle
                for koltuk in secilen_koltuklar:
                    cursor.execute("""
                        INSERT INTO biletler (KullaniciID, EtkinlikID, koltuk_no, Durum)
                        VALUES (%s, %s, %s, 'Aktif')
                    """, [kullanici_id, etkinlik_id, koltuk])
                    
                # 2. Kullanıcının bakiyesinden düş
                cursor.execute("SELECT Fiyat FROM etkinlikler WHERE EtkinlikID = %s", [etkinlik_id])
                fiyat = cursor.fetchone()[0]
                toplam_tutar = fiyat * adet
                
                cursor.execute("UPDATE kullanicilar SET Bakiye = Bakiye - %s WHERE KullaniciID = %s", [toplam_tutar, kullanici_id])
                
                # 3. İsteğe bağlı: Satın alma logu
                cursor.execute("INSERT INTO SistemLoglari (KullaniciID, IslemTipi, Aciklama) VALUES (%s, 'BİLET_ALIMI', %s)", 
                               [kullanici_id, f"{adet} adet bilet alındı (-{toplam_tutar} ₺)"])
                
        return Response({"message": f"{adet} adet bilet başarıyla alındı!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    

@api_view(['POST'])
def bilet_iptal(request):
    kullanici_id = request.data.get('kullanici_id')
    etkinlik_id = request.data.get('etkinlik_id')

    try:
        with transaction.atomic():
            with connection.cursor() as cursor:
                # 1. İptal edilecek biletlerin sayısını ve birim fiyatını bul
                cursor.execute("""
                    SELECT COUNT(*), e.Fiyat 
                    FROM biletler b 
                    JOIN etkinlikler e ON b.EtkinlikID = e.EtkinlikID 
                    WHERE b.KullaniciID = %s AND b.EtkinlikID = %s AND b.Durum = 'Aktif'
                    GROUP BY e.Fiyat
                """, [kullanici_id, etkinlik_id])
                
                row = cursor.fetchone()
                
                if not row:
                    return Response({"error": "İptal edilecek bilet bulunamadı."}, status=400)
                    
                adet = row[0]
                fiyat = row[1]
                iade_tutari = adet * fiyat
                
                # 2. Biletlerin durumunu iptal yap
                cursor.execute("""
                    UPDATE biletler SET Durum = 'İptal' 
                    WHERE KullaniciID = %s AND EtkinlikID = %s AND Durum = 'Aktif'
                """, [kullanici_id, etkinlik_id])
                
                # 3. Parayı iade et
                cursor.execute("UPDATE kullanicilar SET Bakiye = Bakiye + %s WHERE KullaniciID = %s", [iade_tutari, kullanici_id])

                # 4. İsteğe bağlı: İptal logu
                cursor.execute("INSERT INTO SistemLoglari (KullaniciID, IslemTipi, Aciklama) VALUES (%s, 'BİLET_İPTAL', %s)", 
                               [kullanici_id, f"{adet} adet bilet iptal edildi (+{iade_tutari} ₺)"])

        return Response({"message": f"Bilet iptal edildi ve {iade_tutari} ₺ iade edildi!"})
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
        
    hashed_sifre = make_password(sifre)
    
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
    seans = request.data.get('seans')
    tarih = request.data.get('tarih')
    salon_id = request.data.get('salon_id')
    kategoriler = request.data.get('kategoriler', []) # YENİ: Seçilen kategoriler listesi

    if not salon_id or not seans or not tarih:
        return Response({"error": "Lütfen tarih, salon ve seans saati seçin."}, status=400)

    STANDART_BLOKAJ_DK = 135 
    yeni_baslangic = datetime.strptime(seans, '%H:%M')
    yeni_bitis = yeni_baslangic + timedelta(minutes=STANDART_BLOKAJ_DK)

    try:
        with transaction.atomic(): #Hem film hem kategori ekleme işlemlerini transaction içine aldık
            with connection.cursor() as cursor:
                # Çakışma kontrolü (Eski kodunuzdaki gibi)
                cursor.execute("""
                    SELECT seans_saati FROM etkinlikler 
                    WHERE SalonID = %s AND EtkinlikTarihi = %s AND Durum = 'Aktif' AND seans_saati IS NOT NULL
                """, [salon_id, tarih])
                mevcut_seanslar = cursor.fetchall()

                for row in mevcut_seanslar:
                    mevcut_saat_str = str(row[0])[:5]
                    mevcut_baslangic = datetime.strptime(mevcut_saat_str, '%H:%M')
                    mevcut_bitis = mevcut_baslangic + timedelta(minutes=STANDART_BLOKAJ_DK)

                    if (yeni_baslangic < mevcut_bitis) and (yeni_bitis > mevcut_baslangic):
                        return Response({"error": f"Çakışma! Bu salonda saat {mevcut_saat_str} seansında film var."}, status=400)

                # 1. Filmi ekle
                cursor.execute("""
                    INSERT INTO etkinlikler (EtkinlikAdi, Fiyat, SalonID, seans_saati, EtkinlikTarihi)
                    VALUES (%s, %s, %s, %s, %s)
                """, [ad, fiyat, salon_id, seans, tarih])
                
                yeni_etkinlik_id = cursor.lastrowid # Eklenen filmin ID'sini al
                
                # 2. Seçilen kategorileri EtkinlikKategori tablosuna ekle
                if kategoriler:
                    for kategori_id in kategoriler:
                        cursor.execute("""
                            INSERT INTO EtkinlikKategori (EtkinlikID, KategoriID)
                            VALUES (%s, %s)
                        """, [yeni_etkinlik_id, kategori_id])
                
        return Response({"message": "Film başarıyla eklendi!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def etkinlik_sil(request):
    etkinlik_id = request.data.get('etkinlik_id')
    try:
        with connection.cursor() as cursor:
            # HARD DELETE YERİNE SOFT DELETE: Sadece durumu pasife çekiyoruz
            cursor.execute("UPDATE etkinlikler SET Durum = 'Pasif' WHERE EtkinlikID = %s", [etkinlik_id])
            
            # Log tutalım (İsteğe bağlı)
            cursor.execute("INSERT INTO SistemLoglari (KullaniciID, IslemTipi, Aciklama) VALUES (1, 'FİLM_SİLME', CONCAT(%s, ' IDli film silindi'))", [etkinlik_id])
            
        return Response({"message": "Film gösterimden kaldırıldı (Geçmiş satış verileri korundu)!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
def salonlar_listesi(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT SalonID, SalonAdi, ToplamKapasite FROM salonlar")
        rows = cursor.fetchall()
        
    result = [{
        "salon_id": row[0],
        "salon_adi": row[1],
        "kapasite": row[2]
    } for row in rows]
    return Response(result)


# YENİ: Kategorileri listelemek için view
@api_view(['GET'])
def kategoriler_listesi(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT KategoriID, KategoriAdi FROM kategoriler")
        rows = cursor.fetchall()
        
    result = [{"kategori_id": row[0], "kategori_adi": row[1]} for row in rows]
    return Response(result)



