import customtkinter as ctk
import mysql.connector

# Veritabanı Bağlantısı
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="26122003Arda.3513", # XAMPP şifresi genelde boştur
    database="CineBilet"
)
cursor = db.cursor()

# Arayüz Ayarları
ctk.set_appearance_mode("dark")
app = ctk.CTk()
app.geometry("500x400")
app.title("CineBilet Masaüstü")

title = ctk.CTkLabel(app, text="Vizyondaki Etkinlikler", font=("Arial", 20, "bold"))
title.pack(pady=20)

# Veritabanından Etkinlikleri Çekme
cursor.execute("SELECT EtkinlikAdi, Fiyat FROM Etkinlikler")
etkinlikler = cursor.fetchall()

# Etkinlikleri Ekrana Yazdırma
for etkinlik in etkinlikler:
    metin = f"{etkinlik[0]} - {etkinlik[1]} TL"
    label = ctk.CTkLabel(app, text=metin, font=("Arial", 14))
    label.pack(pady=5)

app.mainloop()