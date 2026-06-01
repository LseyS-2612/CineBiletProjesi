import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api';

function App() {
  // --- AUTHENTICATION & LOCALSTORAGE ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('kullanici'));
  const [authMode, setAuthMode] = useState('login'); 
  const [authForm, setAuthForm] = useState({ adsoyad: '', email: '', sifre: '' });

  const [kullanici, setKullanici] = useState(() => {
    const saved = localStorage.getItem('kullanici');
    return saved ? JSON.parse(saved) : { id: null, adsoyad: '', bakiye: 0, rol: 'kullanici' };
  });

  const [profilForm, setProfilForm] = useState({ adsoyad: kullanici?.adsoyad || '', sifre: '' });

  // --- UYGULAMA STATELERİ ---
  const [etkinlikler, setEtkinlikler] = useState([])
  const [biletlerim, setBiletlerim] = useState([])
  const [modalData, setModalData] = useState({ visible: false, title: '', message: '', type: '' });
  const [analiz, setAnaliz] = useState([]);
  const [loglar, setLoglar] = useState([]);
  const [yorumlar, setYorumlar] = useState([]);
  
  const [secilenFilm, setSecilenFilm] = useState(null);
  const [aktifSekme, setAktifSekme] = useState('ana_sayfa'); 

  const [seciliKoltuklar, setSeciliKoltuklar] = useState([]);
  const [doluKoltuklar, setDoluKoltuklar] = useState([]);

  const closeModal = () => setModalData({ ...modalData, visible: false });
  
  const [salonlar, setSalonlar] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [yeniFilm, setYeniFilm] = useState({ ad: '', fiyat: '', kapasite: '', seans: '', tarih: '', salon_id: '', kategoriler: [] });

  // --- GİRİŞ / KAYIT / ÇIKIŞ ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const url = authMode === 'login' ? `${API_BASE}/giris-yap/` : `${API_BASE}/kayit-ol/`;
    
    try {
      const res = await axios.post(url, authForm);
      if (authMode === 'login') {
        const user = res.data.kullanici;
        setKullanici(user);
        setProfilForm({ adsoyad: user.adsoyad, sifre: '' });
        setIsLoggedIn(true);
        localStorage.setItem('kullanici', JSON.stringify(user));
        setAuthForm({ adsoyad: '', email: '', sifre: '' });
      } else {
        setModalData({ visible: true, title: 'Başarılı', message: res.data.message, type: 'success' });
        setAuthMode('login');
      }
    } catch (err) {
      setModalData({ visible: true, title: 'Hata', message: err.response?.data?.error || "İşlem başarısız", type: 'error' });
    }
  };

  const cikisYap = () => {
    setIsLoggedIn(false);
    setKullanici({ id: null, adsoyad: '', bakiye: 0, rol: 'kullanici' });
    localStorage.removeItem('kullanici');
    setAktifSekme('ana_sayfa');
  };

  // --- PROFİL GÜNCELLEME ---
  const profilGuncelle = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/profil-guncelle/`, { 
        kullanici_id: kullanici.id, adsoyad: profilForm.adsoyad, sifre: profilForm.sifre 
      });
      setModalData({ visible: true, title: 'Başarılı', message: res.data.message, type: 'success' });
      setProfilForm({ ...profilForm, sifre: '' });
      verileriGuncelle();
    } catch (err) {
      setModalData({ visible: true, title: 'Hata', message: err.response?.data?.error || 'Güncelleme başarısız', type: 'error' });
    }
  };

  const handleSalonDegisimi = (e) => {
    const secilenSalonId = e.target.value;
    const secilenSalon = salonlar.find(s => s.salon_id.toString() === secilenSalonId);
    setYeniFilm({ ...yeniFilm, salon_id: secilenSalonId, kapasite: secilenSalon ? secilenSalon.kapasite : '' });
  };

  const handleKategoriSecimi = (e) => {
    const seciliKategoriler = Array.from(e.target.selectedOptions, option => option.value);
    setYeniFilm({ ...yeniFilm, kategoriler: seciliKategoriler });
  };

  const filmEkle = async (e) => {
    e.preventDefault();
    if(!yeniFilm.ad || !yeniFilm.fiyat || !yeniFilm.seans || !yeniFilm.tarih || !yeniFilm.salon_id) {
      return alert("Lütfen gerekli alanları doldurun.");
    }
    try {
      const res = await axios.post(`${API_BASE}/etkinlik-ekle/`, yeniFilm);
      setModalData({ visible: true, title: 'Başarılı', message: res.data.message, type: 'success' });
      setYeniFilm({ ad: '', fiyat: '', kapasite: salonlar.length > 0 ? salonlar[0].kapasite : '', seans: '', tarih: '', salon_id: salonlar.length > 0 ? salonlar[0].salon_id : '', kategoriler: [] });
      verileriGuncelle();
    } catch (err) {
      setModalData({ visible: true, title: 'Hata', message: err.response?.data?.error, type: 'error' });
    }
  };

  const filmSil = async (id) => {
    if(!window.confirm("Bu filmi, ona ait tüm biletleri ve yorumları silmek istediğinize emin misiniz?")) return;
    try {
      const res = await axios.post(`${API_BASE}/etkinlik-sil/`, { etkinlik_id: id });
      alert(res.data.message);
      verileriGuncelle();
    } catch {
      alert("Hata oluştu.");
    }
  };

  // --- VERİ ÇEKME ---
  const verileriGuncelle = async () => {
    if (!kullanici.id) return; 
    const ts = new Date().getTime(); 

    axios.get(`${API_BASE}/etkinlikler/?t=${ts}`).then(res => setEtkinlikler(res.data)).catch(console.error);
    axios.get(`${API_BASE}/yorumlar/?t=${ts}`).then(res => setYorumlar(res.data)).catch(console.error);
    
    axios.get(`${API_BASE}/kullanici/${kullanici.id}/?t=${ts}`).then(res => {
      setKullanici(prev => {
        const updated = { ...prev, ...res.data };
        localStorage.setItem('kullanici', JSON.stringify(updated));
        return updated;
      });
    }).catch(console.error);

    axios.get(`${API_BASE}/biletlerim/${kullanici.id}/?t=${ts}`)
      .then(res => setBiletlerim(res.data)).catch(() => setBiletlerim([]));

    if (kullanici.rol === 'admin') {
      axios.get(`${API_BASE}/salonlar/?t=${ts}`).then(res => {
        setSalonlar(res.data);
        if (res.data.length > 0 && yeniFilm.salon_id === '') {
          setYeniFilm(prev => ({ ...prev, salon_id: res.data[0].salon_id, kapasite: res.data[0].kapasite }));
        }
      }).catch(console.error);
      
      axios.get(`${API_BASE}/kategoriler/?t=${ts}`).then(res => setKategoriler(res.data)).catch(console.error);
      axios.get(`${API_BASE}/analiz/?t=${ts}`).then(res => setAnaliz(res.data)).catch(console.error);
      axios.get(`${API_BASE}/loglar/${kullanici.id}/?t=${ts}`).then(res => setLoglar(res.data)).catch(console.error);
    }
  }

  useEffect(() => {
    if (isLoggedIn && kullanici.id) {
      verileriGuncelle();
      setProfilForm({ adsoyad: kullanici.adsoyad, sifre: '' });
    }
  }, [isLoggedIn, kullanici.id]);

  useEffect(() => {
    if (secilenFilm) {
      axios.get(`${API_BASE}/dolu-koltuklar/${secilenFilm.etkinlikid}/`)
        .then(res => setDoluKoltuklar(res.data))
        .catch(() => setDoluKoltuklar([]));
    } else {
      setSeciliKoltuklar([]);
      setDoluKoltuklar([]);
      verileriGuncelle();
    }
  }, [secilenFilm]);

  // --- KULLANICI İŞLEMLERİ ---
  const bakiyeYukle = async () => {
    const miktar = prompt("Yüklemek istediğiniz tutarı giriniz:");
    if (miktar && !isNaN(miktar) && miktar > 0) {
      try {
        const res = await axios.post(`${API_BASE}/bakiye-ekle/`, { kullanici_id: kullanici.id, tutar: miktar });
        setModalData({ visible: true, title: 'Bakiye Yüklendi', message: res.data.message, type: 'success' });
        verileriGuncelle();
      } catch {
        alert("İşlem başarısız.");
      }
    }
  };

  const biletSatinAl = async (id, fiyat, ad, koltukDizisi) => {
    const adet = koltukDizisi.length;
    if (adet === 0) return setModalData({ visible: true, title: 'Uyarı', message: 'Koltuk seçiniz.', type: 'error' });
    
    const toplamFiyat = fiyat * adet;
    if (kullanici.bakiye < toplamFiyat) {
      return setModalData({ visible: true, title: 'Yetersiz Bakiye', message: `Mevcut: ${kullanici.bakiye} TL`, type: 'error' });
    }

    try {
      const res = await axios.post(`${API_BASE}/bilet-al/`, { kullanici_id: kullanici.id, etkinlik_id: id, koltuklar: koltukDizisi });
      setModalData({ visible: true, title: 'Başarılı', message: res.data.message, type: 'success' });
      setSeciliKoltuklar([]); 
      setTimeout(() => verileriGuncelle(), 300);
    } catch (err) {
      setModalData({ visible: true, title: 'Hata', message: err.response?.data?.error || 'Hata oluştu', type: 'error' });
    }
  }

  const biletIptalEt = async (etkinlik_id, tarih) => {
    if (!window.confirm("Bileti iptal etmek istediğinize emin misiniz?")) return;
    try {
      const res = await axios.post(`${API_BASE}/bilet-iptal/`, { kullanici_id: kullanici.id, etkinlik_id, tarih });
      alert(res.data.message); 
      setTimeout(() => verileriGuncelle(), 300);
    } catch (err) {
      alert("Hata: " + (err.response?.data?.error || "Bilinmeyen hata"));
    }
  };  

  const yorumGonder = async (id, puan, metin) => {
    try {
      const res = await axios.post(`${API_BASE}/yorum-yap/`, { kullanici_id: kullanici.id, etkinlik_id: id, puan, yorum_metni: metin });
      alert(res.data.message); 
      verileriGuncelle();
    } catch {
      alert("Yorum yapılamadı.");
    }
  };

  const getTabStyle = (sekmeAdi) => ({
    backgroundColor: aktifSekme === sekmeAdi ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
    color: aktifSekme === sekmeAdi ? '#e50914' : '#a1a1aa',
    border: 'none', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
  });

  // --- DİNAMİK KOLTUK HESAPLAMASI ---
  let toplamKapasite = 0;
  let dinamikSatirlar = [];
  const dinamikSutunlar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 
  
  if (secilenFilm) {
    toplamKapasite = secilenFilm.kapasite + doluKoltuklar.length;
    dinamikSatirlar = Array.from({ length: Math.ceil(toplamKapasite / 10) }, (_, i) => String.fromCharCode(65 + i)); 
  }

  // ==========================================
  // LOGİN EKRANI
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#09090b', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {modalData.visible && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
            <div style={{ backgroundColor: '#18181b', padding: '32px', borderRadius: '12px', textAlign: 'center', border: '1px solid #27272a', minWidth: '320px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <h2 style={{ color: modalData.type === 'success' ? '#10b981' : '#ef4444', margin: '0 0 16px 0', fontSize: '20px' }}>{modalData.title}</h2>
              <p style={{ margin: '0 0 24px 0', color: '#a1a1aa', fontSize: '15px' }}>{modalData.message}</p>
              <button onClick={closeModal} style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Kapat</button>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: '#18181b', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid #27272a', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <h2 style={{ textAlign: 'center', color: '#e50914', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>CINEBILET</h2>
          <h3 style={{ textAlign: 'center', margin: '0 0 32px 0', fontWeight: '500', color: '#a1a1aa', fontSize: '16px' }}>
            {authMode === 'login' ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
          </h3>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {authMode === 'register' && (
              <input required type="text" placeholder="Ad Soyad" value={authForm.adsoyad} onChange={e => setAuthForm({...authForm, adsoyad: e.target.value})} style={{ padding: '14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', fontSize: '14px' }} />
            )}
            <input required type="email" placeholder="E-posta Adresi" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} style={{ padding: '14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', fontSize: '14px' }} />
            <input required type="password" placeholder="Şifre" value={authForm.sifre} onChange={e => setAuthForm({...authForm, sifre: e.target.value})} style={{ padding: '14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', fontSize: '14px' }} />

            <button type="submit" style={{ padding: '14px', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '8px', fontSize: '15px', transition: '0.2s' }}>
              {authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#a1a1aa' }}>
            {authMode === 'login' ? 'Hesabınız yok mu? ' : 'Zaten hesabınız var mı? '}
            <span style={{ color: '#fff', cursor: 'pointer', fontWeight: '500' }} onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ANA UYGULAMA EKRANI
  // ==========================================
  return (
    <div style={{ backgroundColor: '#09090b', color: '#fafafa', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      <style>{`
        .film-card { transition: all 0.2s ease; cursor: pointer; }
        .film-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border-color: #3f3f46 !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #18181b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        input:focus, select:focus { outline: none; border-color: #52525b !important; }
      `}</style>

      {/* Mesaj Modalı */}
      {modalData.visible && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#18181b', padding: '32px', borderRadius: '12px', textAlign: 'center', border: '1px solid #27272a', minWidth: '320px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h2 style={{ color: modalData.type === 'success' ? '#10b981' : '#ef4444', margin: '0 0 16px 0', fontSize: '20px' }}>{modalData.title}</h2>
            <p style={{ margin: '0 0 24px 0', color: '#a1a1aa', fontSize: '15px' }}>{modalData.message}</p>
            <button onClick={closeModal} style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Kapat</button>
          </div>
        </div>
      )}

      {/* Film İnceleme ve Bilet Alma Modalı */}
      {secilenFilm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9998, backdropFilter: 'blur(4px)' }}>
          <div className="custom-scrollbar" style={{ backgroundColor: '#18181b', padding: '32px', borderRadius: '16px', border: '1px solid #27272a', width: '500px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '22px' }}>{secilenFilm.etkinlikadi}</h2>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#a1a1aa' }}>
                  <span><b style={{color: '#71717a', fontWeight: 'normal'}}>Tarih:</b> {secilenFilm.tarih ? new Date(secilenFilm.tarih).toLocaleDateString('tr-TR') : "-"}</span>
                  <span><b style={{color: '#71717a', fontWeight: 'normal'}}>Salon:</b> {secilenFilm.salon_adi}</span>
                  <span><b style={{color: '#71717a', fontWeight: 'normal'}}>Seans:</b> {secilenFilm.seans_saati ? secilenFilm.seans_saati.slice(0,5) : "-"}</span>
                </div>
              </div>
              <button onClick={() => setSecilenFilm(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>

            {/* DİNAMİK KOLTUK HARİTASI */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', backgroundColor: '#09090b', padding: '20px 10px', borderRadius: '8px', border: '1px solid #27272a' }}>
                <div style={{ width: '80%', height: '4px', backgroundColor: '#3f3f46', borderRadius: '2px', marginBottom: '16px', boxShadow: '0 4px 10px rgba(255,255,255,0.1)' }}></div>
                <span style={{ fontSize: '10px', color: '#71717a', marginBottom: '8px', letterSpacing: '2px' }}>PERDE</span>
                
                {dinamikSatirlar.map((satir, satirIndex) => (
                  <div key={satir} style={{ display: 'flex', gap: '6px' }}>
                    {dinamikSutunlar.map((sutun, sutunIndex) => {
                      const globalIndex = satirIndex * 10 + sutunIndex;
                      if (globalIndex >= toplamKapasite) return null; 

                      const koltukNo = `${satir}${sutun}`;
                      const isDolu = doluKoltuklar.includes(koltukNo);
                      const isSecili = seciliKoltuklar.includes(koltukNo);
                      return (
                        <button
                          key={koltukNo}
                          disabled={isDolu}
                          onClick={() => {
                            if (isSecili) setSeciliKoltuklar(seciliKoltuklar.filter(k => k !== koltukNo));
                            else setSeciliKoltuklar([...seciliKoltuklar, koltukNo]);
                          }}
                          style={{
                            width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #3f3f46',
                            fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: isDolu ? 'not-allowed' : 'pointer',
                            backgroundColor: isDolu ? '#ef4444' : isSecili ? '#10b981' : 'transparent',
                            color: isDolu || isSecili ? '#fff' : '#a1a1aa', transition: 'all 0.2s'
                          }}
                        >
                          {satir}{sutun}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px', fontSize: '12px', color: '#a1a1aa' }}>
                <span style={{display: 'flex', alignItems: 'center', gap:'6px'}}><div style={{width:'12px', height:'12px', border:'1px solid #3f3f46', borderRadius:'3px'}}></div> Boş</span>
                <span style={{display: 'flex', alignItems: 'center', gap:'6px'}}><div style={{width:'12px', height:'12px', backgroundColor:'#10b981', borderRadius:'3px'}}></div> Seçili</span>
                <span style={{display: 'flex', alignItems: 'center', gap:'6px'}}><div style={{width:'12px', height:'12px', backgroundColor:'#ef4444', borderRadius:'3px'}}></div> Dolu</span>
              </div>
            </div>

            {/* FİYAT VE SATIN ALMA BÖLÜMÜ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #27272a' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#71717a', marginBottom: '4px' }}>Toplam Tutar</div>
                <div style={{ color: '#fff', fontWeight: '600', fontSize: '24px' }}>
                  {seciliKoltuklar.length * secilenFilm.fiyat} ₺
                </div>
              </div>
              <button 
                onClick={() => {
                  biletSatinAl(secilenFilm.etkinlikid, secilenFilm.fiyat, secilenFilm.etkinlikadi, seciliKoltuklar);
                  setSecilenFilm(null);
                }}
                disabled={secilenFilm.kapasite <= 0 || seciliKoltuklar.length === 0}
                style={{ padding: '12px 32px', backgroundColor: seciliKoltuklar.length > 0 ? '#e50914' : '#3f3f46', color: '#fff', border: 'none', borderRadius: '8px', cursor: seciliKoltuklar.length > 0 ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '15px', transition: '0.2s' }}
              >
                {secilenFilm.kapasite > 0 ? 'Satın Al' : 'Tükendi'}
              </button>
            </div>

            {/* YORUM BÖLÜMÜ */}
            <div style={{ backgroundColor: '#09090b', padding: '16px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#e4e4e7', fontSize: '14px', fontWeight: '500' }}>Değerlendirme Yap</h4>
              <input type="text" placeholder="Düşünceleriniz..." id={`yorum-${secilenFilm.etkinlikid}`} style={{ width: '100%', padding: '10px 12px', marginBottom: '8px', backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', boxSizing: 'border-box', fontSize: '13px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <select id={`puan-${secilenFilm.etkinlikid}`} style={{ padding: '10px 12px', backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', flexGrow: 1, fontSize: '13px' }}>
                  <option value="5">5 Yıldız</option><option value="4">4 Yıldız</option><option value="3">3 Yıldız</option><option value="2">2 Yıldız</option><option value="1">1 Yıldız</option>
                </select>
                <button 
                  onClick={() => {
                    const metin = document.getElementById(`yorum-${secilenFilm.etkinlikid}`).value;
                    const puan = document.getElementById(`puan-${secilenFilm.etkinlikid}`).value;
                    if(!metin.trim()) return alert("Yorum metni boş olamaz.");
                    yorumGonder(secilenFilm.etkinlikid, puan, metin);
                    setSecilenFilm(null);
                  }}
                  style={{ padding: '0 20px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                >Gönder</button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 40px', backgroundColor: '#09090b', borderBottom: '1px solid #27272a', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <h1 style={{ color: '#e50914', margin: 0, fontSize: '24px', letterSpacing: '-0.5px', fontWeight: '800' }}>CINEBILET</h1>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button title="Ana Sayfa" onClick={() => setAktifSekme('ana_sayfa')} style={getTabStyle('ana_sayfa')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </button>
            <button title="Biletlerim" onClick={() => setAktifSekme('biletlerim')} style={getTabStyle('biletlerim')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><line x1="13" x2="13" y1="7" y2="17"/><line x1="9" x2="9" y1="7" y2="17"/></svg>
            </button>
            {kullanici.rol === 'admin' && (
              <button title="Admin Paneli" onClick={() => setAktifSekme('admin')} style={getTabStyle('admin')}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div onClick={() => setAktifSekme('hesabim')} title="Profil Ayarları" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '6px 12px', borderRadius: '8px', backgroundColor: aktifSekme === 'hesabim' ? 'rgba(229, 9, 20, 0.1)' : 'transparent', transition: '0.2s' }}>
            <span style={{ fontSize: '13px', color: aktifSekme === 'hesabim' ? '#e50914' : '#a1a1aa', transition: '0.2s' }}>
              {kullanici.rol === 'admin' ? 'Yönetici' : 'Hoş geldin'}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: aktifSekme === 'hesabim' ? '#e50914' : '#fafafa', transition: '0.2s' }}>
              {kullanici.adsoyad}
            </span>
          </div>

          <div style={{ height: '32px', width: '1px', backgroundColor: '#27272a' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
               <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bakiye</span>
               <span style={{ fontSize: '15px', fontWeight: '600', color: '#10b981' }}>{kullanici.bakiye} ₺</span>
            </div>
            <button onClick={bakiyeYukle} title="Bakiye Yükle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', cursor: 'pointer', transition: '0.2s' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button onClick={cikisYap} title="Çıkış Yap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#18181b', color: '#ef4444', border: '1px solid #3f3f46', cursor: 'pointer', transition: '0.2s', marginLeft: '4px' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* İÇERİK */}
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ANA SAYFA */}
        {aktifSekme === 'ana_sayfa' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Vizyondaki Filmler</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {etkinlikler.map((etk) => (
                <div key={etk.etkinlikid} className="film-card" onClick={() => setSecilenFilm(etk)} style={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '500', color: '#fff', lineHeight: '1.3' }}>{etk.etkinlikadi}</h3>
                      
                      <div style={{ color: '#a1a1aa', fontSize: '13px', marginBottom: '12px' }}>
                        {etk.tarih ? new Date(etk.tarih).toLocaleDateString('tr-TR') : '-'} • {etk.seans_saati ? etk.seans_saati.slice(0,5) : '-'}
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {etk.kategoriler && etk.kategoriler.split(',').map((cat, idx) => (
                          <span key={idx} style={{ backgroundColor: '#27272a', color: '#a1a1aa', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '500', letterSpacing: '0.3px' }}>
                            {cat.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <span style={{ color: '#fff', fontWeight: '600', fontSize: '22px' }}>{etk.fiyat} <span style={{fontSize:'16px', color:'#71717a'}}>₺</span></span>
                      <span style={{ color: '#e50914', opacity: 0.8 }}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
                    </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '64px' }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '500', color: '#a1a1aa' }}>Son Değerlendirmeler</h2>
              <div className="custom-scrollbar" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
                {yorumlar.length > 0 ? yorumlar.map((y) => (
                  <div key={y.id} style={{ minWidth: '300px', backgroundColor: '#18181b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ color: '#fff', fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>{y.film_adi}</div>
                        <div style={{ color: '#71717a', fontSize: '12px' }}>{y.yazan}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="12" height="12" fill={i < y.puan ? "#f59e0b" : "#3f3f46"} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ))}
                      </div>
                    </div>
                    <p style={{ margin: 0, color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5' }}>"{y.metin}"</p>
                  </div>
                )) : <p style={{ color: '#71717a', fontSize: '14px' }}>Henüz yorum yapılmamış.</p>}
              </div>
            </div>
          </>
        )}

        {/* BİLETLERİM */}
        {aktifSekme === 'biletlerim' && (
          <div style={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #27272a' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>Bilet Geçmişi</h2>
            </div>
            {biletlerim.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#09090b', color: '#a1a1aa' }}>
                      <th style={{ padding: '16px 24px', fontWeight: '500' }}>Etkinlik</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500' }}>Tarih</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500' }}>Saat</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500' }}>Salon</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500', textAlign: 'center' }}>Adet</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500' }}>Koltuklar</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500', textAlign: 'right' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biletlerim.map((b, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #27272a' }}>
                        <td style={{ padding: '16px 24px', color: '#fff', fontWeight: '500' }}>{b.etkinlik_adi}</td>
                        <td style={{ padding: '16px 24px', color: '#a1a1aa' }}>{new Date(b.tarih).toLocaleDateString('tr-TR')}</td>
                        <td style={{ padding: '16px 24px', color: '#a1a1aa' }}>{b.seans_saati && b.seans_saati !== "None" ? b.seans_saati.slice(0,5) : "-"}</td>
                        <td style={{ padding: '16px 24px', color: '#a1a1aa' }}>{b.salon_adi}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>{b.adet}</span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {b.koltuklar && b.koltuklar !== "-" ? (
                              b.koltuklar.split(',').map((koltuk, idx) => (
                                <span key={idx} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>
                                  {koltuk.trim()}
                                </span>
                              ))
                            ) : (
                              <span style={{ color: '#71717a' }}>-</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button onClick={() => biletIptalEt(b.etkinlik_id, b.tarih)} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: '0.2s' }}>İptal</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#71717a' }}>Kayıtlı bilet bulunamadı.</div>
            )}
          </div>
        )}

        {/* HESABIM SEKMESİ */}
        {aktifSekme === 'hesabim' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#18181b', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid #27272a' }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '600' }}>Profil Bilgileri</h2>
              <form onSubmit={profilGuncelle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>Ad Soyad</label>
                  <input required type="text" value={profilForm.adsoyad} onChange={e => setProfilForm({...profilForm, adsoyad: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>Yeni Şifre (İsteğe Bağlı)</label>
                  <input type="password" placeholder="Değiştirmek istemiyorsanız boş bırakın" value={profilForm.sifre} onChange={e => setProfilForm({...profilForm, sifre: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" style={{ padding: '14px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '16px', fontSize: '15px', transition: '0.2s' }}>
                  Bilgileri Kaydet
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ADMIN PANELI */}
        {aktifSekme === 'admin' && kullanici.rol === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* FİLM YÖNETİMİ */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', padding: '24px' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '500', color: '#fff' }}>Yeni Film Ekle</h2>
                <form onSubmit={filmEkle} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" placeholder="Film Adı" value={yeniFilm.ad} onChange={e => setYeniFilm({...yeniFilm, ad: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff' }} />
                  
                  <select value={yeniFilm.salon_id} onChange={handleSalonDegisimi} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff' }}>
                    {salonlar.map(salon => (
                      <option key={salon.salon_id} value={salon.salon_id}>
                        {salon.salon_adi} ({salon.kapasite} Kişilik)
                      </option>
                    ))}
                  </select>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="number" placeholder="Fiyat (₺)" value={yeniFilm.fiyat} onChange={e => setYeniFilm({...yeniFilm, fiyat: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff' }} />
                    <input type="number" placeholder="Kapasite" value={yeniFilm.kapasite} readOnly title="Seçilen salona göre veritabanından otomatik belirlenir" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: '#a1a1aa', cursor: 'not-allowed' }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="date" value={yeniFilm.tarih} onChange={e => setYeniFilm({...yeniFilm, tarih: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', colorScheme: 'dark' }} />
                    <input type="time" placeholder="Seans Saati" value={yeniFilm.seans} onChange={e => setYeniFilm({...yeniFilm, seans: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', colorScheme: 'dark' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px', textAlign: 'left' }}>Kategoriler (Ctrl/Cmd basılı tutarak çoklu seçebilirsiniz)</label>
                    <select multiple value={yeniFilm.kategoriler} onChange={handleKategoriSecimi} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#09090b', color: '#fff', minHeight: '80px', colorScheme: 'dark' }}>
                      {kategoriler.map(kat => (
                        <option key={kat.kategori_id} value={kat.kategori_id} style={{ padding: '4px' }}>
                          {kat.kategori_adi}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button type="submit" style={{ padding: '12px', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Filmi Vizyona Sok</button>
                </form>
              </div>

              <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', padding: '24px', maxHeight: '420px', overflowY: 'auto' }} className="custom-scrollbar">
                <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '500', color: '#fff' }}>Mevcut Filmleri Yönet</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {etkinlikler.map(etk => (
                    <div key={etk.etkinlikid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090b', padding: '12px 16px', borderRadius: '8px', border: '1px solid #27272a' }}>
                      <div>
                        <div style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>{etk.etkinlikadi}</div>
                        <div style={{ color: '#71717a', fontSize: '12px' }}>{etk.seans_saati ? etk.seans_saati.slice(0,5) : '-'} • {etk.fiyat} ₺</div>
                      </div>
                      <button onClick={() => filmSil(etk.etkinlikid)} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Sil</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ANALİZ VE LOG TABLOLARI */}
            <div style={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #27272a' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#a1a1aa' }}>Satış Analizi Verileri</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#09090b', color: '#71717a' }}>
                      <th style={{ padding: '12px 24px', fontWeight: '500' }}>Etkinlik</th>
                      <th style={{ padding: '12px 24px', fontWeight: '500' }}>Bilet</th>
                      <th style={{ padding: '12px 24px', fontWeight: '500' }}>Hasılat</th>
                      <th style={{ padding: '12px 24px', fontWeight: '500' }}>Doluluk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analiz.map((a, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #27272a' }}>
                        <td style={{ padding: '12px 24px', color: '#fff' }}>{a.ad}</td>
                        <td style={{ padding: '12px 24px', color: '#a1a1aa' }}>{a.satis}</td>
                        <td style={{ padding: '12px 24px', color: '#10b981' }}>{a.hasilat} ₺</td>
                        <td style={{ padding: '12px 24px', color: '#a1a1aa' }}>{a.doluluk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #27272a' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#a1a1aa' }}>Sistem Logları (Trigger)</h2>
              </div>
              <div className="custom-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto', padding: '12px' }}>
                {loglar.map((l, i) => (
                  <div key={i} style={{ padding: '12px', borderBottom: i !== loglar.length -1 ? '1px solid #27272a' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#fff', fontSize: '13px', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                         <span style={{ color: l.tip === 'BAKIYE_YUKLEME' ? '#10b981' : '#e50914', marginRight:'8px' }}>●</span>
                         {l.tip}
                      </div>
                      <div style={{ color: '#71717a', fontSize: '12px' }}>{l.aciklama}</div>
                    </div>
                    <div style={{ color: '#71717a', fontSize: '12px' }}>{new Date(l.tarih).toLocaleString('tr-TR')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App