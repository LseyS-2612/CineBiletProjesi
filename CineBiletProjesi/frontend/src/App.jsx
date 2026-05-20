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

  const closeModal = () => setModalData({ ...modalData, visible: false });

  // Tüm verileri tek fonksiyon üzerinden güncelliyoruz
  const verileriGuncelle = () => {
    const ts = new Date().getTime(); // Cache kırmak için zaman damgası
    
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

  // İPTAL FONKSİYONU DIŞARI ALINDI
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

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#fff', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {modalData.visible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '20px', textAlign: 'center', border: `2px solid ${modalData.type === 'success' ? '#2ecc71' : '#e50914'}`, minWidth: '350px' }}>
            <h2 style={{ color: modalData.type === 'success' ? '#2ecc71' : '#e50914', marginTop: 0 }}>{modalData.title}</h2>
            <p style={{ margin: '25px 0', fontSize: '18px' }}>{modalData.message}</p>
            <button onClick={closeModal} style={{ backgroundColor: '#e50914', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer' }}>Kapat</button>
          </div>
        </div>
      )}

      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <h1 style={{ color: '#e50914', margin: 0 }}>CINEBILET</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Hoş geldin, <b style={{ color: '#e50914' }}>{kullanici.adsoyad}</b></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#2ecc71', padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold' }}>{kullanici.bakiye} TL</span>
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
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <input type="number" min="1" max={etk.kapasite} defaultValue="1" id={`adet-${etk.etkinlikid}`} style={{ width: '60px', padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', textAlign: 'center' }} />
                  <button 
                    onClick={() => {
                      const adet = parseInt(document.getElementById(`adet-${etk.etkinlikid}`).value) || 1;
                      biletSatinAl(etk.etkinlikid, etk.fiyat, etk.etkinlikadi, adet);
                    }}
                    disabled={etk.kapasite <= 0}
                    style={{ flexGrow: 1, padding: '12px', backgroundColor: etk.kapasite > 0 ? '#e50914' : '#444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {etk.kapasite > 0 ? 'Bilet Al' : 'Tükendi'}
                  </button>
                </div>

                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
                  <input type="text" placeholder="Film hakkında yorumunuz..." id={`yorum-${etk.etkinlikid}`} style={{ width: '70%', padding: '8px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', boxSizing: 'border-box' }} />
                  <select id={`puan-${etk.etkinlikid}`} style={{ width: '25%', padding: '8px', marginLeft: '5%', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', boxSizing: 'border-box' }}>
                    <option value="5">5 ⭐</option><option value="4">4 ⭐</option><option value="3">3 ⭐</option><option value="2">2 ⭐</option><option value="1">1 ⭐</option>
                  </select>
                  <button 
                    onClick={() => {
                      const metin = document.getElementById(`yorum-${etk.etkinlikid}`).value;
                      const puan = document.getElementById(`puan-${etk.etkinlikid}`).value;
                      if(!metin.trim()) return alert("Lütfen yorum metni yazın!");
                      yorumGonder(etk.etkinlikid, puan, metin);
                      document.getElementById(`yorum-${etk.etkinlikid}`).value = '';
                    }}
                    style={{ width: '100%', marginTop: '10px', padding: '8px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >Yorum Paylaş</button>
                </div>
            </div>
          ))}
        </div>

        {biletlerim.length > 0 && (
           <div style={{ marginTop: '50px', backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #333' }}>
             <h2 style={{ borderLeft: '5px solid #2ecc71', paddingLeft: '15px', color: '#2ecc71', margin: '0 0 20px 0' }}>Biletlerim</h2>
             <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                 <thead style={{ position: 'sticky', top: 0, backgroundColor: '#1a1a1a', zIndex: 1 }}>
                   <tr style={{ borderBottom: '2px solid #333', color: '#aaa' }}>
                     <th style={{ padding: '12px' }}>Film / Etkinlik Adı</th><th>Tarih</th><th>Bilet Adedi</th><th>İşlem</th>
                   </tr>
                 </thead>
                 <tbody>
                   {biletlerim.map((b, i) => (
                     <tr key={b.etkinlik_adi + b.tarih + i} style={{ borderBottom: '1px solid #222' }}>
                       <td style={{ padding: '12px', fontWeight: 'bold' }}>{b.etkinlik_adi}</td>
                       <td style={{ color: '#aaa' }}>{new Date(b.tarih).toLocaleString('tr-TR')}</td>
                       <td><span style={{ backgroundColor: '#2ecc71', color: '#000', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' }}>{b.adet} Adet</span></td>
                       <td><button onClick={() => biletIptalEt(b.etkinlik_id, b.tarih)} style={{ backgroundColor: '#e50914', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>İptal Et</button></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        <div style={{ marginTop: '50px', backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #333' }}>
          <h2 style={{ color: '#e50914' }}>Satis Analizi (SQL View)</h2>
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

        <div style={{ marginTop: '50px' }}>
          <h2 style={{ borderLeft: '5px solid #f1c40f', paddingLeft: '15px' }}>Hesap Gecmisi (Trigger Loglari)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
            {loglar.map((l, i) => (
              <div key={i} style={{ backgroundColor: '#111', padding: '12px', borderRadius: '8px', border: '1px solid #333', textAlign: 'left' }}>
                <span style={{ color: l.tip === 'BAKIYE_YUKLEME' ? '#2ecc71' : '#e50914', fontWeight: 'bold' }}>{l.tip}</span> 
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