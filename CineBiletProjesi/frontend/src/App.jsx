import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [etkinlikler, setEtkinlikler] = useState([])
  const [kullanici, setKullanici] = useState({ adsoyad: '', bakiye: 0 })
  const [biletlerim, setBiletlerim] = useState([])
  const [modalData, setModalData] = useState({ visible: false, title: '', message: '', type: '' });
  const [analiz, setAnaliz] = useState([]);
  const [loglar, setLoglar] = useState([]);
  const [yorumlar, setYorumlar] = useState([]);
  
  const [secilenFilm, setSecilenFilm] = useState(null);
  const [aktifSekme, setAktifSekme] = useState('ana_sayfa'); 

  const closeModal = () => setModalData({ ...modalData, visible: false });

  const verileriGuncelle = () => {
    const ts = new Date().getTime(); 
    
    axios.get(`http://127.0.0.1:8000/api/etkinlikler/?t=${ts}`).then(res => setEtkinlikler(res.data))
    axios.get(`http://127.0.0.1:8000/api/kullanici/1/?t=${ts}`).then(res => setKullanici(res.data))
    axios.get(`http://127.0.0.1:8000/api/biletlerim/1/?t=${ts}`)
      .then(res => setBiletlerim(res.data))
      .catch(() => console.log("bilet yok henüz"))

    axios.get(`http://127.0.0.1:8000/api/analiz/?t=${ts}`).then(res => setAnaliz(res.data));
    axios.get(`http://127.0.0.1:8000/api/loglar/1/?t=${ts}`).then(res => setLoglar(res.data));
    axios.get(`http://127.0.0.1:8000/api/yorumlar/?t=${ts}`).then(res => setYorumlar(res.data));
  }

  useEffect(() => {
    verileriGuncelle()
  }, [])

  const bakiyeYukle = () => {
    const miktar = prompt("Yüklemek istediğiniz tutarı giriniz:");
    if (miktar && !isNaN(miktar) && miktar > 0) {
      axios.post('http://127.0.0.1:8000/api/bakiye-ekle/', { tutar: miktar })
        .then(res => {
          setModalData({ visible: true, title: 'Bakiye Yüklendi', message: res.data.message, type: 'success' });
          verileriGuncelle();
        })
        .catch(() => alert("İşlem başarısız."));
    }
  };

  const biletSatinAl = (id, fiyat, ad, adet) => {
    const toplamFiyat = fiyat * adet;
    if (kullanici.bakiye < toplamFiyat) {
      setModalData({ visible: true, title: 'Yetersiz Bakiye', message: `Bakiyeniz yetersiz. Gerekli: ${toplamFiyat} TL, Mevcut: ${kullanici.bakiye} TL`, type: 'error' });
      return;
    }

    axios.post('http://127.0.0.1:8000/api/bilet-al/', { etkinlik_id: id, adet: adet })
      .then(res => {
        setModalData({ visible: true, title: 'Başarılı', message: res.data.message, type: 'success' });
        setTimeout(() => verileriGuncelle(), 300);
      })
      .catch(err => {
        setModalData({ visible: true, title: 'Hata', message: err.response?.data?.error || 'Hata oluştu', type: 'error' });
      });
  }

  const biletIptalEt = (etkinlik_id, tarih) => {
    if (!window.confirm("Bileti iptal etmek istediğinize emin misiniz?")) return;
    axios.post('http://127.0.0.1:8000/api/bilet-iptal/', { etkinlik_id, tarih })
      .then(res => { alert(res.data.message); setTimeout(() => verileriGuncelle(), 300); })
      .catch(err => alert("Hata: " + (err.response?.data?.error || "Bilinmeyen hata")));
  };  

  const yorumGonder = (id, puan, metin) => {
    axios.post('http://127.0.0.1:8000/api/yorum-yap/', { etkinlik_id: id, puan: puan, yorum_metni: metin })
    .then(res => { alert(res.data.message); verileriGuncelle(); })
    .catch(() => alert("Yorum yapılamadı."));
  };

  const getTabStyle = (sekmeAdi) => ({
    backgroundColor: aktifSekme === sekmeAdi ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
    color: aktifSekme === sekmeAdi ? '#e50914' : '#a1a1aa',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

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
          <div style={{ backgroundColor: '#18181b', padding: '32px', borderRadius: '16px', border: '1px solid #27272a', width: '420px', maxWidth: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '22px' }}>{secilenFilm.etkinlikadi}</h2>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#a1a1aa' }}>
                  <span><b style={{color: '#71717a', fontWeight: 'normal'}}>Salon:</b> {secilenFilm.salon_adi}</span>
                  <span><b style={{color: '#71717a', fontWeight: 'normal'}}>Seans:</b> {secilenFilm.seans_saati ? secilenFilm.seans_saati.slice(0,5) : "-"}</span>
                </div>
              </div>
              <button onClick={() => setSecilenFilm(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #27272a' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '4px' }}>Fiyat</div>
                <div style={{ color: '#fff', fontWeight: '600', fontSize: '24px' }}>{secilenFilm.fiyat} ₺</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '4px' }}>Durum</div>
                 <div style={{ color: secilenFilm.kapasite > 0 ? '#10b981' : '#ef4444', fontSize: '14px', fontWeight: '500' }}>{secilenFilm.kapasite} Koltuk Kaldı</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <input type="number" min="1" max={secilenFilm.kapasite} defaultValue="1" id={`adet-${secilenFilm.etkinlikid}`} style={{ width: '70px', padding: '12px', backgroundColor: '#09090b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '8px', textAlign: 'center', fontSize: '15px' }} />
              <button 
                onClick={() => {
                  const adet = parseInt(document.getElementById(`adet-${secilenFilm.etkinlikid}`).value) || 1;
                  biletSatinAl(secilenFilm.etkinlikid, secilenFilm.fiyat, secilenFilm.etkinlikadi, adet);
                  setSecilenFilm(null);
                }}
                disabled={secilenFilm.kapasite <= 0}
                style={{ flexGrow: 1, padding: '12px', backgroundColor: secilenFilm.kapasite > 0 ? '#e50914' : '#3f3f46', color: '#fff', border: 'none', borderRadius: '8px', cursor: secilenFilm.kapasite > 0 ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '15px', transition: '0.2s' }}
              >
                {secilenFilm.kapasite > 0 ? 'Satın Al' : 'Tükendi'}
              </button>
            </div>

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
            <button title="Admin Paneli" onClick={() => setAktifSekme('admin')} style={getTabStyle('admin')}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Hoş geldin</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#fafafa' }}>{kullanici.adsoyad}</span>
          </div>
          <div style={{ height: '32px', width: '1px', backgroundColor: '#27272a' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
               <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bakiye</span>
               <span style={{ fontSize: '15px', fontWeight: '600', color: '#10b981' }}>{kullanici.bakiye} ₺</span>
            </div>
            <button onClick={bakiyeYukle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46', cursor: 'pointer', transition: '0.2s' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
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
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Vizyondaki Filmler</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {etkinlikler.map((etk) => (
                <div key={etk.etkinlikid} className="film-card" onClick={() => setSecilenFilm(etk)} style={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '500', color: '#fff', lineHeight: '1.3' }}>{etk.etkinlikadi}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {etk.kategoriler.split(',').map((cat, idx) => (
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
                      <th style={{ padding: '16px 24px', fontWeight: '500' }}>Adet</th>
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
                        <td style={{ padding: '16px 24px' }}><span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{b.adet}</span></td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button onClick={() => biletIptalEt(b.etkinlik_id, b.tarih)} style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: '0.2s' }}>İptal</button>
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

        {/* ADMIN */}
        {aktifSekme === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                      <div style={{ color: '#fff', fontSize: '13px', marginBottom: '4px' }}>
                         <span style={{ color: l.tip === 'BAKIYE_YUKLEME' ? '#10b981' : '#e50914', marginRight:'8px' }}>●</span>
                         {l.tip} işlemi gerçekleşti ({l.tutar} ₺)
                      </div>
                      <div style={{ color: '#71717a', fontSize: '12px' }}>Bakiye: {l.eski} ➔ {l.yeni}</div>
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