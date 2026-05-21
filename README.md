"""# 🎬 CineBilet - Full-Stack Etkinlik & Bilet Yönetim Sistemi

CineBilet, ilişkisel veritabanı mimarisi ve modern web teknolojileri (Full-Stack) kullanılarak geliştirilmiş, uçtan uca çalışan profesyonel bir etkinlik ve sinema biletleme platformudur. Bu proje; katmanlı mimari tasarımı, veritabanı normalizasyonu (3NF), transaction güvenliği, Rol Bazlı Yetkilendirme (RBAC) ve asenkron veri iletişimi gibi kritik yazılım mühendisliği konseptlerini uygulamalı olarak sergilemektedir.

---

## 🚀 Öne Çıkan Gelişmiş Özellikler

* **Modern Tasarım & UX Mimarisi:** Arayüz, tek sayfa uygulaması (SPA) prensiplerine sadık kalınarak tamamen sade, göz yormayan, premium bir karanlık tema tasarımıyla (Zinc 900) baştan aşağı yenilenmiştir. Film kartları tıklanabilir yüzeylere dönüştürülmüş, mikro etkileşimler (hover-scale efekti) eklenmiş ve karmaşıklığı önlemek adına tüm işlemler (Bilet alma, değerlendirme yapma) şık Pop-up (Modal) pencerelere taşınmıştır.
* **Sekmeli Dashboard Düzeni:** Kullanıcı deneyimini maksimize etmek amacıyla arayüz; yazısız, temiz ve minimalist SVG ikonlara sahip sekmeli (Tab-based) bir dashboard sistemine ayrılmıştır (Ana Sayfa, Bilet Geçmişi, Admin Paneli).
* **Rol Bazlı Yetkilendirme (RBAC):** Veritabanı seviyesinde desteklenen yetkilendirme modeli sayesinde kullanıcılar `Admin` ve `Kullanici` rolleriyle sisteme dahil olur. Admin paneli, satış analizleri ve sistem logları sadece `Admin` yetkisine sahip hesaplara dinamik olarak gösterilir ve backend katmanında (403 Forbidden) sıkı bir şekilde korunur.
* **Çoka Çok (N:M) İlişki Deseni:** Filmler ve Kategoriler arasında kurulan çoka çok ilişki yapısı, optimize edilmiş bir ara tablo (Junction Table) üzerinden yönetilmektedir. Bir film birden fazla kategoriye (Örn: Aksiyon, Bilim Kurgu) sahip olabilir ve bu veriler backend katmanında `GROUP_CONCAT` kullanılarak tek sorguda asenkron olarak taşınır.
* **Zaman Tabanlı Seans Yönetimi:** Her bir etkinlik, veritabanında `TIME` tipinde tutulan dinamik seans saatleriyle gerçekçi bir sinema programı yapısında simüle edilir.

---

## 🛠️ Kullanılan Teknolojiler

* **Frontend:** React.js, Vite, Axios, SVG-based Icons, CSS Micro-interactions.
* **Backend:** Django, Django REST Framework (RESTful API katmanı, Fonksiyonel API Views).
* **Veritabanı:** MySQL (İlişkisel Veritabanı Yönetim Sistemi - RDBMS).
* **Middleware & Güvenlik:** Django CORS Headers (Güvenli kökenler arası veri paylaşımı).

---

## 📊 Veritabanı Mimarisi & Uygulanan İleri Seviye Konular

Proje mimarisinde veritabanı tutarlılığı, performans ve güvenlik en üst düzeyde tutulmuştur:

1.  **Veritabanı Normalizasyonu (3NF):** Veri tekrarını önlemek ve ilişkisel bütünlüğü korumak amacıyla `Salonlar` ve `Kategoriler` bağımsız tablolar haline getirilerek mimari 3. Normal Form (3NF) kurallarına tam uyumlu hale getirilmiştir.
2.  **TCL (Transaction Control Language):** Eşzamanlı bilet satın alma işlemlerinde bakiye ve salon kapasite tutarlılığını garanti altına almak amacıyla `START TRANSACTION`, `COMMIT` ve `ROLLBACK` mekanizmaları aktif olarak işletilmektedir.
3.  **Stored Procedures (`sp_BiletSatinAl` & `sp_BiletIptalGrubu`):** Satın alma ve iade mantığının tamamı, ağ trafiğini azaltmak ve güvenliği artırmak amacıyla veritabanı tarafında saklı yordamlar (Procedures) olarak optimize edilmiştir.
4.  **SQL Views (`View_EtkinlikAnalizi`):** Karmaşık aggregate fonksiyonları (`SUM`, `COUNT`) içeren doluluk oranı ve ciro hesaplama sorguları, performansı artırmak adına bir veritabanı görünümü (View) üzerinden canlı olarak çekilir ve Admin paneline aktarılır.
5.  **Triggers (Tetikleyiciler - `IslemLoglari`):** Kullanıcıların bakiye değişiklikleri, bilet alım ve iptal gibi tüm kritik adımları, veritabanı seviyesinde çalışan Trigger'lar vasıtasıyla otomatik olarak izlenir ve log tablosuna tarih damgasıyla kaydedilir.
6.  **DCL (Data Control Language):** Veritabanı kullanıcı rolleri ve şema üzerindeki erişim/yazma yetkilendirmeleri DCL komutlarıyla sınırlandırılmıştır.

---

## 📋 Kurulum Adımları

### 1. Veritabanı Hazırlığı
1. MySQL Workbench veya terminal üzerinden yeni bir şema oluşturun:
2. Projenin kök dizininde yer alan güncel cinebilet.sql dosyasını veritabanınıza içeri aktarın (Import).

2. Backend (API) Kurulumu
```Bash
cd backend
python -m venv venv

# Windows için aktifleştirme:
venv\\Scripts\\activate
# macOS/Linux için aktifleştirme:
# source venv/bin/activate

pip install -r requirements.txt
python manage.py runserver
```
3. Frontend (UI) Kurulumu
```Bash
cd frontend
npm install
npm run dev
```
💡 Geliştiren: Anıl Arda Kılıç
