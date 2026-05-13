from django.contrib import admin
from django.urls import path
from api import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/etkinlikler/', views.EtkinlikListesi.as_view()),
    path('api/bilet-al/', views.bilet_al),
    path('api/kullanici/<int:pk>/', views.kullanici_detay),
    path('api/biletlerim/<int:kullanici_id>/', views.biletlerim),
    path('api/bakiye-ekle/', views.bakiye_ekle),
    path('api/analiz/', views.etkinlik_analizi),
    path('api/loglar/<int:kullanici_id>/', views.islem_gecmisi),
]