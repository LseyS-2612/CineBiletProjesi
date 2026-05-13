# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Biletler(models.Model):
    biletid = models.AutoField(db_column='BiletID', primary_key=True)  # Field name made lowercase.
    kullaniciid = models.IntegerField(db_column='KullaniciID', blank=True, null=True)  # Field name made lowercase.
    etkinlikid = models.IntegerField(db_column='EtkinlikID', blank=True, null=True)  # Field name made lowercase.
    durum = models.CharField(db_column='Durum', max_length=5, blank=True, null=True)  # Field name made lowercase.
    satinalmatarihi = models.DateTimeField(db_column='SatinAlmaTarihi', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'biletler'


class Etkinlikler(models.Model):
    etkinlikid = models.AutoField(db_column='EtkinlikID', primary_key=True)  # Field name made lowercase.
    etkinlikadi = models.CharField(db_column='EtkinlikAdi', max_length=100, blank=True, null=True)  # Field name made lowercase.
    fiyat = models.DecimalField(db_column='Fiyat', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    kapasite = models.IntegerField(db_column='Kapasite', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'etkinlikler'


class Iptalloglari(models.Model):
    logid = models.AutoField(db_column='LogID', primary_key=True)  # Field name made lowercase.
    biletid = models.IntegerField(db_column='BiletID', blank=True, null=True)  # Field name made lowercase.
    iptaltarihi = models.DateTimeField(db_column='IptalTarihi', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'iptalloglari'


class Kullanicilar(models.Model):
    kullaniciid = models.AutoField(db_column='KullaniciID', primary_key=True)  # Field name made lowercase.
    adsoyad = models.CharField(db_column='AdSoyad', max_length=100, blank=True, null=True)  # Field name made lowercase.
    bakiye = models.DecimalField(db_column='Bakiye', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'kullanicilar'