import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [etkinlikler, setEtkinlikler] = useState([])
  const [kullanici, setKullanici] = useState({ adsoyad: 'Anıl Arda Kılıç', bakiye: 0 })
  const [biletlerim, setBiletlerim] = useState([])
  const [modalData, setModalData] = useState({ visible: false, title: '', message: '', type: '' });
  const [analiz, setAnaliz] = useState([]);
  const [loglar, setLoglar] = useState([]);
  const [yorumlar, setYorumlar] = useState([]);
  
  const [secilenFilm, setSecilenFilm] = useState(null);
  
  // YENİ: Hangi sekmede olduğumuzu tutan state (Varsayılan: Ana Sayfa)
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
        .catch(() => alert("yüklerken hata oldu"));
    }
  };

  const biletSatinAl = (id, fiyat, ad, adet) => {
    const toplamFiyat = fiyat * adet;
    if (kullanici.bakiye < toplamFiyat) {
      setModalData({
        visible: true,
        title: 'Yetersiz Bakiye',
        message: `${ad} filminden ${adet} adet bilet için bakiyeniz yetersiz. Gerekli: ${toplamFiyat} TL, Mevcut: ${kullanici.bakiye} TL`,
        type: 'error'
      });
      return;
    }

    axios.post('http://127.0.0.1:8000/api/bilet-al/', { etkinlik_id: id, adet: adet })
      .then(res => {
        setModalData({ visible: true, title: 'İşlem Başarılı', message: res.data.message, type: 'success' });
        setTimeout(() => { verileriGuncelle(); }, 300);
      })
      .catch(err => {
        const hataMesaji = err.response?.data?.error || 'Hata olustu';
        setModalData({ visible: true, title: 'Hata', message: hataMesaji, type: 'error' });
      });
  }

  const biletIptalEt = (etkinlik_id, tarih) => {
    if (!window.confirm("Bu biletleri iptal etmek istediğinize emin misiniz? Ücret iade edilecektir.")) return;
    
    axios.post('http://127.0.0.1:8000/api/bilet-iptal/', { etkinlik_id, tarih })
      .then(res => {
        alert(res.data.message);
        setTimeout(() => verileriGuncelle(), 300);
      })
      .catch(err => alert("Hata: " + (err.response?.data?.error || "Bilinmeyen hata")));
  };  

  const yorumGonder = (id, puan, metin) => {
    axios.post('http://127.0.0.1:8000/api/yorum-yap/', { etkinlik_id: id, puan: puan, yorum_metni: metin })
    .then(res => {
      alert(res.data.message);
      verileriGuncelle();
    })
    .catch(() => alert("Yorum yaparken bir hata oluştu."));
  };

  // Sekme butonları için stil fonksiyonu
  const getTabStyle = (sekmeAdi) => ({
    backgroundColor: aktifSekme === sekmeAdi ? '#e50914' : 'transparent',
    color: '#fff',
    border: aktifSekme === sekmeAdi ? 'none' : '1px solid #444',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.2s'
  });

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#fff', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      
      <style>{`
        .film-card { transition: all 0.3s ease; cursor: pointer; }
        .film-card:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(229, 9, 20, 0.2); border-color: #e50914 !important; }
      `}</style>

      {/* Mesaj Modalı */}
      {modalData.visible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '20px', textAlign: 'center', border: `2px solid ${modalData.type === 'success' ? '#2ecc71' : '#e50914'}`, minWidth: '350px' }}>
            <h2 style={{ color: modalData.type === 'success' ? '#2ecc71' : '#e50914', marginTop: 0 }}>{modalData.title}</h2>
            <p style={{ margin: '25px 0', fontSize: '18px' }}>{modalData.message}</p>
            <button onClick={closeModal} style={{ backgroundColor: '#e50914', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer' }}>Kapat</button>
          </div>
        </div>
      )}

      {/* Film İnceleme ve Bilet Alma Modalı */}
      {secilenFilm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9998 }}>
          <div style={{ backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '15px', border: '1px solid #333', width: '400px', maxWidth: '90%' }}>
            <h2 style={{ color: '#fff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '15px' }}>{secilenFilm.etkinlikadi}</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div style={{ color: '#c084fc', fontSize: '14px' }}>📍 {secilenFilm.salon_adi}</div>
                <div style={{ color: '#f1c40f', fontSize: '14px' }}>⏰ {secilenFilm.seans_saati ? secilenFilm.seans_saati.slice(0,5) : "-"}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '20px' }}>{secilenFilm.fiyat} TL</span>
              <span style={{ color: '#aaa' }}>{secilenFilm.kapasite} Boş Koltuk</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
              <input type="number" min="1" max={secilenFilm.kapasite} defaultValue="1" id={`adet-${secilenFilm.etkinlikid}`} style={{ width: '60px', padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', textAlign: 'center' }} />
              <button 
                onClick={() => {
                  const adet = parseInt(document.getElementById(`adet-${secilenFilm.etkinlikid}`).value) || 1;
                  biletSatinAl(secilenFilm.etkinlikid, secilenFilm.fiyat, secilenFilm.etkinlikadi, adet);
                  setSecilenFilm(null);
                }}
                disabled={secilenFilm.kapasite <= 0}
                style={{ flexGrow: 1, padding: '12px', backgroundColor: secilenFilm.kapasite > 0 ? '#e50914' : '#444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {secilenFilm.kapasite > 0 ? 'Bilet Satın Al' : 'Tükendi'}
              </button>
            </div>

            <div style={{ borderTop: '1px solid #333', paddingTop: '20px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#aaa' }}>Filmi Değerlendir</h4>
              <input type="text" placeholder="Yorumunuzu buraya yazın..." id={`yorum-${secilenFilm.etkinlikid}`} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <select id={`puan-${secilenFilm.etkinlikid}`} style={{ padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', flexGrow: 1 }}>
                  <option value="5">5 ⭐ Harika</option><option value="4">4 ⭐ İyi</option><option value="3">3 ⭐ İdare Eder</option><option value="2">2 ⭐ Kötü</option><option value="1">1 ⭐ Berbat</option>
                </select>
                <button 
                  onClick={() => {
                    const metin = document.getElementById(`yorum-${secilenFilm.etkinlikid}`).value;
                    const puan = document.getElementById(`puan-${secilenFilm.etkinlikid}`).value;
                    if(!metin.trim()) return alert("Lütfen yorum metni yazın!");
                    yorumGonder(secilenFilm.etkinlikid, puan, metin);
                    setSecilenFilm(null);
                  }}
                  style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >Paylaş</button>
              </div>
            </div>

            <button onClick={() => setSecilenFilm(null)} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '6px', cursor: 'pointer' }}>Kapat</button>
          </div>
        </div>
      )}

      {/* GÜNCELLENMİŞ MENÜ (NAVBAR) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', alignItems: 'center' }}>
        
        {/* LOGO ve SEKME BUTONLARI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <h1 onClick={() => setAktifSekme('ana_sayfa')} style={{ color: '#e50914', margin: 0, cursor: 'pointer' }}>CINEBILET</h1>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => setAktifSekme('ana_sayfa')} style={getTabStyle('ana_sayfa')}>🏠 Ana Sayfa</button>
            <button onClick={() => setAktifSekme('biletlerim')} style={getTabStyle('biletlerim')}>🎟️ Biletlerim</button>
            <button onClick={() => setAktifSekme('admin')} style={getTabStyle('admin')}>⚙️ Admin Paneli</button>
          </div>
        </div>

        {/* KULLANICI BİLGİLERİ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Hoş geldin, <b style={{ color: '#e50914' }}>{kullanici.adsoyad}</b></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#2ecc71', padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold', color: '#000' }}>{kullanici.bakiye} TL</span>
            <button onClick={bakiyeYukle} style={{ cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px', fontWeight: 'bold' }}>+</button>
          </div>
        </div>
      </nav>

      {/* İÇERİK ALANI - SEÇİLEN SEKMEYE GÖRE DEĞİŞİR */}
      <div style={{ padding: '40px 50px' }}>
        
        {/* ================= 1. ANA SAYFA SEKMESİ ================= */}
        {aktifSekme === 'ana_sayfa' && (
          <>
            <h2 style={{ borderLeft: '5px solid #e50914', paddingLeft: '15px', marginBottom: '30px' }}>Vizyondaki Filmler</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
              {etkinlikler.map((etk) => (
                <div key={etk.etkinlikid} className="film-card" onClick={() => setSecilenFilm(etk)} style={{ backgroundColor: '#1a1a1a', borderRadius: '15px', border: '1px solid #333', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{etk.etkinlikadi}</h3>
                      <div style={{ color: '#3498db', fontSize: '13px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>🏷️</span> {etk.kategoriler}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '22px' }}>{etk.fiyat} TL</span>
                      <span style={{ color: '#aaa', fontSize: '13px', borderBottom: '1px solid #555' }}>Detay & Bilet ➔</span>
                    </div>
                </div>
              ))}
            </div>

            {/* Yorumlar Herkese Açık */}
            <div style={{ marginTop: '50px', backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #333' }}>
              <h2 style={{ color: '#c084fc', borderLeft: '5px solid #c084fc', paddingLeft: '15px' }}>Film Yorumları & Değerlendirmeler</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                {yorumlar.length > 0 ? yorumlar.map((y) => (
                  <div key={y.id} style={{ backgroundColor: '#111', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #c084fc', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <b style={{ color: '#fff' }}>{y.film_adi} <span style={{ color: '#f1c40f', marginLeft: '10px' }}>{"⭐".repeat(y.puan)}</span></b>
                      <small style={{ color: '#555' }}>{new Date(y.tarih).toLocaleString('tr-TR')}</small>
                    </div>
                    <p style={{ margin: 0, color: '#bbb' }}><i style={{ color: '#c084fc' }}>{y.yazan}:</i> "{y.metin}"</p>
                  </div>
                )) : <p style={{ color: '#555', textAlign: 'left' }}>Henüz yorum yapılmamış.</p>}
              </div>
            </div>
          </>
        )}

        {/* ================= 2. BİLETLERİM SEKMESİ ================= */}
        {aktifSekme === 'biletlerim' && (
          <div style={{ backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #333' }}>
            <h2 style={{ borderLeft: '5px solid #2ecc71', paddingLeft: '15px', color: '#2ecc71', margin: '0 0 20px 0' }}>Biletlerim</h2>
            {biletlerim.length > 0 ? (
              <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#1a1a1a', zIndex: 1 }}>
                    <tr style={{ borderBottom: '2px solid #333', color: '#aaa' }}>
                      <th style={{ padding: '12px' }}>Film</th><th>Tarih</th><th>Saat</th><th>Salon</th><th>Adet</th><th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biletlerim.map((b, i) => (
                      <tr key={b.etkinlik_adi + b.tarih + i} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{b.etkinlik_adi}</td>
                        <td style={{ color: '#aaa' }}>{new Date(b.tarih).toLocaleDateString('tr-TR')}</td>
                        <td style={{ color: '#f1c40f', fontWeight: 'bold' }}>{b.seans_saati && b.seans_saati !== "None" ? b.seans_saati.slice(0,5) : "-"}</td>
                        <td style={{ color: '#c084fc' }}>{b.salon_adi}</td>
                        <td><span style={{ backgroundColor: '#2ecc71', color: '#000', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' }}>{b.adet} Adet</span></td>
                        <td><button onClick={() => biletIptalEt(b.etkinlik_id, b.tarih)} style={{ backgroundColor: '#e50914', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>İptal</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#aaa' }}>Henüz alınmış bir biletiniz bulunmuyor.</p>
            )}
          </div>
        )}

        {/* ================= 3. ADMIN PANELİ SEKMESİ ================= */}
        {aktifSekme === 'admin' && (
          <>
            <div style={{ backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #333', marginBottom: '50px' }}>
              <h2 style={{ color: '#e50914' }}>📊 Satis Analizi (SQL View)</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Film Adi</th><th>Satilan</th><th>Hasilat</th><th>Doluluk</th>
                  </tr>
                </thead>
                <tbody>
                  {analiz.map((a, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px' }}>{a.ad}</td><td>{a.satis} Adet</td><td style={{ color: '#2ecc71' }}>{a.hasilat} TL</td><td>{a.doluluk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #333' }}>
              <h2 style={{ borderLeft: '5px solid #f1c40f', paddingLeft: '15px', color: '#f1c40f' }}>⚙️ Sistem Logları (Trigger)</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                {loglar.map((l, i) => (
                  <div key={i} style={{ backgroundColor: '#111', padding: '12px', borderRadius: '8px', border: '1px solid #333', textAlign: 'left' }}>
                    <span style={{ color: l.tip === 'BAKIYE_YUKLEME' ? '#2ecc71' : '#e50914', fontWeight: 'bold' }}>{l.tip}</span> 
                    {' | '} {l.tutar} TL | Eski: {l.eski} {"->"} Yeni: {l.yeni}
                    <br/> <small style={{ color: '#555' }}>{new Date(l.tarih).toLocaleString('tr-TR')}</small>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default App