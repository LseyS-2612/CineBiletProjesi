# 🎬 CineBilet | Full-Stack Biletleme & Etkinlik Yönetim Platformu

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

CineBilet, modern web teknolojileri ve gelişmiş ilişkisel veritabanı mimarisi kullanılarak geliştirilmiş profesyonel bir sinema/etkinlik biletleme sistemidir. Bu proje; interaktif arayüz tasarımı, katmanlı mimari, Rol Bazlı Yetkilendirme (RBAC) ve transaction güvenliği gibi ileri seviye yazılım mühendisliği pratiklerini tek bir çatı altında toplamaktadır.

---

## ✨ Öne Çıkan Özellikler

* 💺 **İnteraktif Koltuk Seçimi:** Kullanıcılar sinema salonu planı üzerinden (Grid yapısı) istedikleri boş koltukları seçebilir. Dolu koltuklar gerçek zamanlı olarak engellenir ve toplam tutar anlık hesaplanır.
* 🔐 **Üyelik & Profil Yönetimi:** Kullanıcı kayıt/giriş sistemi (`LocalStorage` destekli kalıcı oturum). Kullanıcılar kendi bilet geçmişlerini görebilir ve profil bilgilerini güncelleyebilir.
* 🛡️ **Rol Bazlı Yetkilendirme (RBAC):** Sistemde `Admin` ve `Kullanıcı` olmak üzere iki farklı rol bulunur. Satış analizleri ve sistem loglarını barındıran Admin Paneli, sadece yetkili hesaplara gösterilir.
* 🎨 **Modern SPA & Karanlık Tema:** Tek Sayfa Uygulaması (SPA) prensipleriyle tasarlanmış, Zinc-900 renk paletine sahip, göz yormayan, premium bir UI/UX deneyimi. Animasyonlu modallar ve şık SVG ikonlar içerir.
* ⚡ **Güvenli Biletleme İşlemleri:** Bakiye kontrolü, kapasite düşümü ve bilet oluşturma işlemleri veritabanı tarafında (Stored Procedures & TCL) tek bir `Transaction` olarak yürütülür.

---

## 🛠️ Teknoloji Yığını

**Frontend:** React.js, Vite, Axios, Modern CSS (Flexbox/Grid, Micro-interactions)  
**Backend:** Django, Django REST Framework (DRF)  
**Veritabanı:** MySQL (RDBMS)  
**Mimari:** RESTful API, 3-Tier Architecture  

---

## 📊 Gelişmiş Veritabanı Mimarisi

CineBilet, arka planda yüksek performanslı ve veri tutarlılığını garanti eden bir veritabanı yapısına sahiptir:

1. **Normalizasyon (3NF):** Veri tekrarını önlemek için Salonlar, Filmler ve Kategoriler bağımsız tablolara ayrılmış, N:M (Çoka Çok) ilişkiler optimize edilmiştir.
2. **Transaction Güvenliği (TCL):** Bilet alma işlemleri `START TRANSACTION`, `COMMIT` ve `ROLLBACK` ile korunur. Yetersiz bakiye veya aynı anda koltuk alınması durumunda işlem geri alınır.
3. **Stored Procedures (Saklı Yordamlar):** `sp_BiletSatinAl` gibi prosedürler sayesinde iş mantığı (business logic) veritabanı katmanında güvenle işlenir.
4. **Triggers (Tetikleyiciler):** Bakiye yükleme, bilet alım ve iade gibi tüm kritik işlemler anlık olarak tetiklenerek `IslemLoglari` tablosuna kaydedilir.
5. **SQL Views:** Toplam hasılat, bilet satışı ve salon doluluk oranları `View_EtkinlikAnalizi` üzerinden anlık olarak hesaplanıp Admin paneline sunulur.

---

## 🚀 Kurulum Adımları

### 1. Veritabanı Hazırlığı
Proje kök dizininde bulunan `cinebilet.sql` dosyasını MySQL Workbench veya terminal aracılığıyla veritabanınıza import edin.

### 2. Backend (API) Kurulumu
```bash
cd CineBiletProjesi
python -m venv venv

# Windows için:
venv\Scripts\activate
# macOS/Linux için:
# source venv/bin/activate

pip install -r requirements.txt
python manage.py runserver
```

### 3. Frontend (UI) Kurulumu
```Bash
cd frontend
npm install
npm run dev
```

Not: Test etmek için hazır Yönetici (Admin) hesabı bilgileri:
Email: yonetici@cinebilet.com | Şifre: 123456

💡 Geliştiren: Anıl Arda Kılıç
