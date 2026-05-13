# 🎬 CineBilet - Full-Stack Etkinlik & Bilet Yönetim Sistemi

CineBilet, modern web teknolojileri kullanılarak geliştirilmiş, uçtan uca çalışan bir biletleme platformudur. Bu proje; veritabanı yönetimi, transaction güvenliği ve asenkron veri iletişimi gibi kritik yazılım konseptlerini uygulamalı olarak sergilemektedir.

## 🚀 Kullanılan Teknolojiler

* **Frontend:** React.js, Vite, Axios (State management ve API entegrasyonu)
* **Backend:** Django, Django REST Framework (RESTful API mimarisi)
* **Veritabanı:** MySQL (İlişkisel veritabanı tasarımı)
* **Middleware:** CORS Headers (Güvenli veri paylaşımı)

## 🛠️ Veritabanı Özellikleri & Uygulanan Konular

Proje kapsamında aşağıdaki veritabanı yönetim konuları aktif olarak kullanılmıştır:

1.  **DCL (Data Control Language):** Veritabanı kullanıcı yetkilendirmeleri.
2.  **TCL (Transaction Control Language):** Bilet satın alma işlemlerinde bakiye ve kapasite tutarlılığını sağlamak için `START TRANSACTION`, `COMMIT` ve `ROLLBACK` mekanizmaları kullanılmıştır.
3.  **Stored Procedures:** `sp_BiletSatinAl` prosedürü ile satın alma mantığı veritabanı seviyesinde optimize edilmiştir.
4.  **Views & Aggregate Functions:** Etkinlik listeleme ve bakiye hesaplamalarında kullanılmıştır.
5.  **Triggers:** Veri değişikliklerini izlemek ve log tutmak amacıyla tetikleyiciler tanımlanmıştır.

## 📋 Kurulum Adımları

### 1. Veritabanı Hazırlığı
* MySQL Workbench üzerinden yeni bir şema oluşturun: `CREATE DATABASE CineBilet;`
* Proje klasöründeki `cinebilet.sql` dosyasını içeri aktarın (Import).

### 2. Backend Kurulumu
```bash
cd backend
python -m venv venv
# Windows için:
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
