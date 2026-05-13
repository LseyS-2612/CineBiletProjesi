import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [etkinlikler, setEtkinlikler] = useState([])
  const [kullanici, setKullanici] = useState({ adsoyad: 'Anıl Arda Kılıç', bakiye: 0 })
  const [biletlerim, setBiletlerim] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState({ visible: false, title: '', message: '', type: '' });

  const closeModal = () => setModalData({ ...modalData, visible: false });

  // Veritabanından güncel bilgileri çeken fonksiyon
  const verileriGuncelle = () => {
    axios.get('http://127.0.0.1:8000/api/etkinlikler/').then(res => setEtkinlikler(res.data))
    axios.get('http://127.0.0.1:8000/api/kullanici/1/').then(res => setKullanici(res.data))
    axios.get('http://127.0.0.1:8000/api/biletlerim/1/')
      .then(res => setBiletlerim(res.data))
      .catch(() => console.log("Biletler henüz yok."))
  }

  useEffect(() => {
    verileriGuncelle()
    setLoading(false)
  }, [])

  // PARA EKLEME FONKSİYONU
  const bakiyeYukle = () => {
    const miktar = prompt("Yüklemek istediğiniz tutarı giriniz:");
    if (miktar && !isNaN(miktar) && miktar > 0) {
      axios.post('http://127.0.0.1:8000/api/bakiye-ekle/', { tutar: miktar })
        .then(res => {
          setModalData({
            visible: true,
            title: 'Bakiye Yüklendi',
            message: res.data.message,
            type: 'success'
          });
          verileriGuncelle();
        })
        .catch(() => alert("Yükleme sırasında hata oluştu."));
    }
  };

  // BİLET SATIN ALMA FONKSİYONU
  const biletSatinAl = (id, fiyat, ad) => {
    if (kullanici.bakiye < fiyat) {
      setModalData({
        visible: true,
        title: 'Yetersiz Bakiye',
        message: `${ad} bileti için bakiyeniz yetersiz. Mevcut: ${kullanici.bakiye} TL`,
        type: 'error'
      });
      return;
    }

    axios.post('http://127.0.0.1:8000/api/bilet-al/', { etkinlik_id: id })
      .then(res => {
        setModalData({
          visible: true,
          title: 'İşlem Başarılı',
          message: `${ad} biletiniz alındı. İyi seyirler!`,
          type: 'success'
        });
        verileriGuncelle();
      })
      .catch(err => {
        setModalData({
          visible: true,
          title: 'Hata',
          message: err.response?.data?.error || 'İşlem başarısız.',
          type: 'error'
        });
      });
  }

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#fff', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* MODERN MODAL (POP-UP) */}
      {modalData.visible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '20px', textAlign: 'center', border: `2px solid ${modalData.type === 'success' ? '#2ecc71' : '#e50914'}`, minWidth: '350px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
            <h2 style={{ color: modalData.type === 'success' ? '#2ecc71' : '#e50914', marginTop: 0 }}>{modalData.title}</h2>
            <p style={{ margin: '25px 0', fontSize: '18px', lineHeight: '1.5' }}>{modalData.message}</p>
            <button 
              onClick={closeModal}
              style={{ backgroundColor: '#e50914', color: '#fff', border: 'none', padding: '12px 35px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* NAV BAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: '#e50914', margin: 0, letterSpacing: '2px' }}>CINEBILET</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <span>Hoş geldin, <b style={{ color: '#e50914' }}>{kullanici.adsoyad}</b></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#2ecc71', padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 0 10px rgba(46, 204, 113, 0.3)' }}>
              {kullanici.bakiye} TL
            </span>
            <button 
              onClick={bakiyeYukle}
              style={{ backgroundColor: '#fff', color: '#000', border: 'none', width: '30px', height: '30px', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer', fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              +
            </button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px 50px' }}>
        <h2 style={{ borderLeft: '5px solid #e50914', paddingLeft: '15px', marginBottom: '40px' }}>Vizyondaki Etkinlikler</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {etkinlikler.map((etkinlik) => (
            <div key={etkinlik.etkinlikid} style={{ backgroundColor: '#1a1a1a', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>
                 🎬
              </div>
              <div style={{ padding: '25px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '22px' }}>{etkinlik.etkinlikadi}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '26px', color: '#2ecc71', fontWeight: 'bold' }}>{etkinlik.fiyat} TL</span>
                  <span style={{ color: '#aaa', fontSize: '14px' }}>💺 {etkinlik.kapasite} Koltuk Kaldı</span>
                </div>
                <button 
                  onClick={() => biletSatinAl(etkinlik.etkinlikid, etkinlik.fiyat, etkinlik.etkinlikadi)}
                  disabled={etkinlik.kapasite <= 0}
                  style={{ 
                    width: '100%', marginTop: '25px', padding: '15px', borderRadius: '10px', border: 'none',
                    backgroundColor: etkinlik.kapasite > 0 ? '#e50914' : '#444',
                    color: '#fff', fontWeight: 'bold', cursor: etkinlik.kapasite > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '16px', transition: '0.2s'
                  }}
                >
                  {etkinlik.kapasite > 0 ? 'Hemen Bilet Al' : 'Tükendi'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ALINAN BİLETLER SEKMESİ */}
        {biletlerim.length > 0 && (
           <div style={{ marginTop: '60px' }}>
             <h2 style={{ borderLeft: '5px solid #2ecc71', paddingLeft: '15px', marginBottom: '30px' }}>Aldığım Biletler</h2>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {biletlerim.map((b, i) => (
                  <div key={i} style={{ backgroundColor: '#1a1a1a', padding: '15px 25px', borderRadius: '10px', borderLeft: '4px solid #2ecc71', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                    <b>{b.etkinlik_adi}</b> <br />
                    <small style={{ color: '#aaa' }}>{new Date(b.tarih).toLocaleDateString('tr-TR')}</small>
                  </div>
                ))}
             </div>
           </div>
        )}
      </div>
    </div>
  )
}

export default App