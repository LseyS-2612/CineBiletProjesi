# CineBilet - Sinema Biletleme ve Otomasyon Sistemi

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

CineBilet, modern web teknolojileri ve ilişkisel veritabanı (RDBMS) standartları kullanılarak geliştirilmiş full-stack bir sinema/etkinlik biletleme platformudur. Bu proje; veri bütünlüğü, algoritmik kapasite yönetimi, rol tabanlı yetkilendirme ve veritabanı optimizasyonları gibi ileri seviye mühendislik pratiklerini uygulamak amacıyla geliştirilmiştir.

---

## 📌 Temel Özellikler

* **Dinamik Koltuk Haritası:** Kullanıcıların bilet alım ekranındaki koltuk planı, veritabanından çekilen 'Salon Kapasitesi' verisine göre algoritmik olarak çizdirilir. Dolu koltuklar sistem tarafından anlık olarak engellenir.
* **Rol Tabanlı Erişim Kontrolü (RBAC):** Sistemde yetkilendirme mimarisi kurgulanmıştır. Yönetici (Admin) fonksiyonları, satış raporları ve log ekranları sadece yetkili oturumlara gösterilir; API seviyesinde korunur.
* **Algoritmik Çakışma Kontrolü:** Yeni bir film eklenirken; seçilen salon, mevcut seans saatleri ve temizlik süreleri arka planda hesaplanır. Aynı salonda fiziken çakışacak etkinliklerin eklenmesi engellenir.
* **Geçmiş Veri Koruması (Soft Delete):** Silinen veya vizyondan kalkan etkinlikler veritabanından kalıcı olarak silinmez. Durumları *Pasif*'e çekilerek ana sayfadan gizlenir, ancak muhasebe ve hasılat analizleri bozulmaz.

---

## 🗄️ Veritabanı Mimarisi ve Optimizasyonlar

Sistemin arka planı, veri güvenliğini ve performansı maksimize edecek şekilde tasarlanmıştır:

* **3NF Normalizasyon:** Veri tekrarını engellemek için `Salonlar`, `Etkinlikler` ve `Kategoriler` bağımsız tablolara ayrılmıştır. Çoka çok (N:M) ilişkiler köprü tablolar ile çözülmüştür.
* **TCL & İşlem Güvenliği (ACID):** Bilet satın alma ve iade gibi finansal risk taşıyan işlemler `transaction.atomic()` bloğu ile sarmallanmıştır. İşlem sırasında hata yaşanırsa otomatik `ROLLBACK` çalışır.
* **Sanal Tablolar (View):** Yönetici panelindeki "Satış Analizi" verileri, backend'i yormamak adına MySQL üzerinde bir `View` aracılığıyla hesaplanıp tek sorguda çekilmektedir.
* **Merkezi Loglama (Trigger):** Bakiyede veya biletlerde yaşanan tüm değişimler, kod tarafında ve veritabanı seviyesindeki tetikleyiciler aracılığıyla merkezi `SistemLoglari` tablosuna işlenir.

---

## 💻 Kullanılan Teknolojiler

| Katman | Teknolojiler |
| :--- | :--- |
| **Frontend** | React.js, Vite, Axios, Custom CSS (Dark Theme) |
| **Backend** | Python, Django, Django REST Framework |
| **Veritabanı** | MySQL (Views, Triggers, Stored Procedures) |

---

## 🚀 Kurulum ve Çalıştırma

Projeyi lokalinizde çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### 1. Veritabanı Hazırlığı
Projenin ana dizininde bulunan `CineBiletDatabase.sql` dosyasını MySQL Workbench üzerinden içe aktararak (import) şemayı oluşturun. Django `settings.py` dosyasından veritabanı bağlantı şifrenizi güncelleyin.

### 2. Backend (API) Kurulumu
```bash
# Proje dizinine gidin ve sanal ortam oluşturun
cd CineBiletProjesi
python -m venv venv

# Sanal ortamı aktif edin (Windows)
venv\Scripts\activate  
# macOS/Linux için: source venv/bin/activate

# Gerekli paketleri yükleyin ve sunucuyu başlatın
pip install -r requirements.txt
python manage.py runserver
```
3. Frontend (UI) Kurulumu
```Bash
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin ve sunucuyu başlatın
npm install
npm run dev
```

Not: Yönetici özelliklerini test etmek için veritabanındaki kullanicilar tablosundan kendi hesabınızın rol sütununu admin olarak güncelleyebilirsiniz.
