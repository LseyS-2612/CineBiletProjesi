
from django.db import models


class Biletler(models.Model):
    biletid = models.AutoField(db_column='BiletID', primary_key=True)  
    kullaniciid = models.IntegerField(db_column='KullaniciID', blank=True, null=True)  
    etkinlikid = models.IntegerField(db_column='EtkinlikID', blank=True, null=True)  
    durum = models.CharField(db_column='Durum', max_length=5, blank=True, null=True)  
    satinalmatarihi = models.DateTimeField(db_column='SatinAlmaTarihi', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'biletler'


class Etkinlikler(models.Model):
    etkinlikid = models.AutoField(db_column='EtkinlikID', primary_key=True) 
    etkinlikadi = models.CharField(db_column='EtkinlikAdi', max_length=100, blank=True, null=True)  
    fiyat = models.DecimalField(db_column='Fiyat', max_digits=10, decimal_places=2, blank=True, null=True)  
    kapasite = models.IntegerField(db_column='Kapasite', blank=True, null=True)  
    class Meta:
        managed = False
        db_table = 'etkinlikler'


class Iptalloglari(models.Model):
    logid = models.AutoField(db_column='LogID', primary_key=True)  
    biletid = models.IntegerField(db_column='BiletID', blank=True, null=True)  
    iptaltarihi = models.DateTimeField(db_column='IptalTarihi', blank=True, null=True)  

    class Meta:
        managed = False
        db_table = 'iptalloglari'


class Kullanicilar(models.Model):
    kullaniciid = models.AutoField(db_column='KullaniciID', primary_key=True)  
    adsoyad = models.CharField(db_column='AdSoyad', max_length=100, blank=True, null=True)  
    bakiye = models.DecimalField(db_column='Bakiye', max_digits=10, decimal_places=2, blank=True, null=True)  

    class Meta:
        managed = False
        db_table = 'kullanicilar'