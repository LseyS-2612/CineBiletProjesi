import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [etkinlikler, setEtkinlikler] = useState([])
  const [kullanici, setKullanici] = useState({ adsoyad: 'Anıl Arda Kılıç', bakiye: 0 })
  const [biletlerim, setBiletlerim] = useState([])
  const [modalData, setModalData] = useState({ visible: false, title: '', message: '', type: '' });
  const [analiz, setAnaliz] = useState([]);
  const [loglar, setLoglar] = useState([]);

  const closeModal = () => setModalData({ ...modalData, visible: false });

  // herseyi tek fonksiyonda topladim ki bilet alinca hepsini yenileyebileyim
  const verileriGuncelle = () => {
    axios.get('http://127.0.0.1:8000/api/etkinlikler/').then(res => setEtkinlikler(res.data))
    axios.get('http://127.0.0.1:8000/api/kullanici/1/').then(res => setKullanici(res.data))
    axios.get('http://127.0.0.1:8000/api/biletlerim/1/')
      .then(res => setBiletlerim(res.data))
      .catch(() => console.log("bilet yok henüz"))

    // burası sql viewdan cekiyor
    axios.get('http://127.0.0.1:8000/api/analiz/').then(res => setAnaliz(res.data));
    // burasıda trigger loglari icin
    axios.get('http://127.0.0.1:8000/api/loglar/1/').then(res => setLoglar(res.data));
  }

  useEffect(() => {
    verileriGuncelle()
  }, [])

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
        .catch(() => alert("yüklerken hata oldu"));
    }
  };

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

    // backenddeki stored procedure burdan tetikleniyor
    axios.post('http://127.0.0.1:8000/api/bilet-al/', { etkinlik_id: id })
      .then(res => {
        setModalData({
          visible: true,
          title: 'İşlem Başarılı',
          message: `${ad} biletiniz alındı.`,
          type: 'success'
        });
        verileriGuncelle(); 
      })
      .catch(err => {
        const hataMesaji = err.response?.data?.error || 'Hata olustu';
        setModalData({
          visible: true,
          title: 'Hata',
          message: hataMesaji,
          type: 'error'
        });
      });
  }

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#fff', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {modalData.visible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '20px', textAlign: 'center', border: `2px solid ${modalData.type === 'success' ? '#2ecc71' : '#e50914'}`, minWidth: '350px' }}>
            <h2 style={{ color: modalData.type === 'success' ? '#2ecc71' : '#e50914', marginTop: 0 }}>{modalData.title}</h2>
            <p style={{ margin: '25px 0', fontSize: '18px' }}>{modalData.message}</p>
            <button 
              onClick={closeModal}
              style={{ backgroundColor: '#e50914', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <h1 style={{ color: '#e50914', margin: 0 }}>CINEBILET</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Hoş geldin, <b style={{ color: '#e50914' }}>{kullanici.adsoyad}</b></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#2ecc71', padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold' }}>
              {kullanici.bakiye} TL
            </span>
            <button onClick={bakiyeYukle} style={{ cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px' }}>+</button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px 50px' }}>
        <h2 style={{ borderLeft: '5px solid #e50914', paddingLeft: '15px', marginBottom: '30px' }}>Vizyondaki Filmler</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {etkinlikler.map((etk) => (
            <div key={etk.etkinlikid} style={{ backgroundColor: '#1a1a1a', borderRadius: '15px', border: '1px solid #333', padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{etk.etkinlikadi}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '20px' }}>{etk.fiyat} TL</span>
                  <span style={{ color: '#aaa' }}>{etk.kapasite} Koltuk</span>
                </div>
                <button 
                  onClick={() => biletSatinAl(etk.etkinlikid, etk.fiyat, etk.etkinlikadi)}
                  disabled={etk.kapasite <= 0}
                  style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: etk.kapasite > 0 ? '#e50914' : '#444', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  {etk.kapasite > 0 ? 'Bilet Al' : 'Tükendi'}
                </button>
            </div>
          ))}
        </div>

        {biletlerim.length > 0 && (
           <div style={{ marginTop: '50px' }}>
             <h2 style={{ borderLeft: '5px solid #2ecc71', paddingLeft: '15px' }}>Biletlerim</h2>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
                {biletlerim.map((b, i) => (
                  <div key={i} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #2ecc71' }}>
                    <b>{b.etkinlik_adi}</b> <br />
                    <small style={{ color: '#aaa' }}>{new Date(b.tarih).toLocaleDateString('tr-TR')}</small>
                  </div>
                ))}
             </div>
           </div>
        )}

        {/*sql view kullanimi burası */}
        <div style={{ marginTop: '50px', backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #333' }}>
          <h2 style={{ color: '#e50914' }}>Satis Analizi (SQL View)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Film Adi</th>
                <th>Satilan</th>
                <th>Hasilat</th>
                <th>Doluluk</th>
              </tr>
            </thead>
            <tbody>
              {analiz.map((a, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '10px' }}>{a.ad}</td>
                  <td>{a.satis} Adet</td>
                  <td style={{ color: '#2ecc71' }}>{a.hasilat} TL</td>
                  <td>{a.doluluk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* burasıda loglarin ciktigi yer trigger kaniti icin */}
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ borderLeft: '5px solid #f1c40f', paddingLeft: '15px' }}>Hesap Gecmisi (Trigger Loglari)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            {loglar.map((l, i) => (
              <div key={i} style={{ backgroundColor: '#111', padding: '12px', borderRadius: '8px', border: '1px solid #333' }}>
                <span style={{ color: l.tip === 'BAKIYE_YUKLEME' ? '#2ecc71' : '#e50914', fontWeight: 'bold' }}>
                  {l.tip}
                </span> 
                {' | '} {l.tutar} TL | Eski: {l.eski} {"->"} Yeni: {l.yeni}
                <br/> <small style={{ color: '#555' }}>{new Date(l.tarih).toLocaleString('tr-TR')}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App