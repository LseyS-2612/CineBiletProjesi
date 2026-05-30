from django.contrib import admin
from django.urls import path
from api import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/etkinlikler/', views.etkinlikler),
    path('api/bilet-al/', views.bilet_al),
    path('api/kullanici/<int:pk>/', views.kullanici_detay),
    path('api/biletlerim/<int:kullanici_id>/', views.biletlerim),
    path('api/bakiye-ekle/', views.bakiye_ekle),
    path('api/analiz/', views.etkinlik_analizi),
    path('api/loglar/<int:kullanici_id>/', views.islem_gecmisi),
    path('api/yorumlar/', views.tum_yorumlar),
    path('api/yorum-yap/', views.yorum_yap),
    path('api/bilet-iptal/', views.bilet_iptal),
    path('api/dolu-koltuklar/<int:etkinlik_id>/', views.dolu_koltuklar),
    path('api/kayit-ol/', views.kayit_ol),
    path('api/giris-yap/', views.giris_yap),
    path('api/profil-guncelle/', views.profil_guncelle),
]