from django.contrib import admin
from django.urls import path
from api.views import EtkinlikListesi
from api.views import bakiye_ekle

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/etkinlikler/', EtkinlikListesi.as_view()),
]

from api.views import EtkinlikListesi, bilet_al, kullanici_detay, biletlerim

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/etkinlikler/', EtkinlikListesi.as_view()),
    path('api/bilet-al/', bilet_al),
    path('api/kullanici/<int:pk>/', kullanici_detay), 
    path('api/biletlerim/<int:kullanici_id>/', biletlerim), 
    path('api/bakiye-ekle/', bakiye_ekle),
]