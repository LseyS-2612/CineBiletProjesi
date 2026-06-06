CineBilet - Sinema Biletleme ve Otomasyon Sistemi
CineBilet, modern web teknolojileri ve ilişkisel veritabanı (RDBMS) standartları kullanılarak geliştirilmiş full-stack bir sinema/etkinlik biletleme platformudur. Bu proje, temel CRUD işlemlerinin ötesine geçerek; veri bütünlüğü, eşzamanlılık (concurrency), algoritma yönetimi ve veritabanı optimizasyonları gibi ileri seviye mühendislik pratiklerini uygulamak amacıyla geliştirilmiştir.

Temel Özellikler
Dinamik Koltuk Haritası: Kullanıcıların bilet alım ekranındaki koltuk planı (grid), veritabanından çekilen 'Salon Kapasitesi' verisine göre dinamik olarak çizdirilir. Dolu koltuklar sistem tarafından anlık olarak engellenir.

Rol Tabanlı Erişim Kontrolü (RBAC): Sistemde yetkilendirme mimarisi kurgulanmıştır. Yönetici (Admin) fonksiyonları, satış raporları ve log ekranları sadece yetkili oturumlara gösterilir; API seviyesinde korunur.

Algoritmik Çakışma Kontrolü: Yönetici sisteme yeni bir film eklerken; seçilen salon, mevcut seans saatleri ve standart temizlik süreleri arka planda hesaplanır. Aynı salonda fiziken çakışacak etkinliklerin eklenmesi algoritma ile engellenir.

Geçmiş Veri Koruması (Soft Delete): Silinen veya vizyondan kalkan etkinlikler veritabanından kalıcı olarak silinmez (Hard Delete). Bunun yerine durumları 'Pasif'e çekilir. Bu sayede uygulamanın ana sayfasından kalkarlar ancak geçmişe dönük muhasebe ve hasılat analizleri bozulmaz.

Veritabanı Mimarisi ve Optimizasyonlar
Sistemin arka planı, veri güvenliğini ve performansı maksimize edecek şekilde tasarlanmıştır:

3NF Normalizasyon: Veri tekrarını engellemek için Salonlar, Etkinlikler ve Kategoriler bağımsız tablolara ayrılmıştır. Filmlerin birden fazla kategoriye sahip olabilmesi gibi çoka çok (N:M) ilişkiler, köprü tablolar kullanılarak çözülmüştür.

TCL & İşlem Güvenliği (ACID): Bilet satın alma ve iade gibi finansal risk taşıyan işlemler transaction.atomic() bloğu ile sarmallanmıştır. İşlem sırasında bakiye yetersizliği veya sistem hatası yaşanırsa otomatik ROLLBACK çalışır; veri tutarsızlığı önlenir.

Sanal Tablolar (View): Yönetici panelindeki "Satış Analizi" verileri (satılan bilet sayısı, toplam gelir, doluluk oranları), backend'i yormamak adına MySQL üzerinde bir View aracılığıyla hesaplanıp tek sorguda çekilmektedir.

Merkezi Loglama ve Tetikleyiciler (Trigger): Bakiyede veya biletlerde yaşanan tüm değişimler, kod tarafında ve veritabanı seviyesindeki tetikleyiciler aracılığıyla merkezi SistemLoglari tablosuna zaman damgalı olarak işlenir.

Kullanılan Teknolojiler
Frontend: React.js, Vite, Axios, Custom CSS (Dark Theme UI)

Backend: Python, Django, Django REST Framework (DRF)

Veritabanı: MySQL

Kurulum ve Çalıştırma
Projeyi lokalinizde çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

1. Veritabanı Hazırlığı
MySQL Workbench veya terminal aracılığıyla, projenin ana dizininde bulunan CineBiletDatabase.sql dosyasını içe aktararak (import) veritabanı şemasını oluşturun. Ayarlardan veritabanı bağlantı şifrenizi Django settings.py dosyasına girmeyi unutmayın.

2. Backend (API) Kurulumu
```Bash
# Proje dizinine gidin
cd CineBiletProjesi

# Sanal ortam oluşturun ve aktif edin
python -m venv venv
venv\Scripts\activate  # Windows için
# source venv/bin/activate  # macOS/Linux için

# Gerekli paketleri yükleyin
pip install -r requirements.txt

# Sunucuyu başlatın
python manage.py runserver
```
3. Frontend (UI) Kurulumu
```Bash
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```
