const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

// Veritabanı bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'klinik'
});

db.connect(err => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err);
    } else {
        console.log('MySQL veritabanına başarıyla bağlandı!');
    }
});

// --------------------- API ENDPOINTLERİ ----------------------------------------------------------------------------------------------------------------------

// Personelleri Listeleme
router.get('/personeller', (req, res) => {
    const query = `
        SELECT id, ad_soyad, telefon, email, maas 
        FROM personeller
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Personeller alınırken hata oluştu:', err);
            res.status(500).send('Personeller alınamadı.');
        } else {
            res.json(results);
        }
    });
});



// Yeni Personel Ekleme
router.post('/personeller', (req, res) => {
    const { ad_soyad, telefon, email, maas } = req.body;

    const query = 'INSERT INTO personeller (ad_soyad, telefon, email, maas) VALUES (?, ?, ?, ?)';
    db.query(query, [ad_soyad, telefon, email, maas], (err, result) => {
        if (err) {
            console.error('Personel eklenirken hata oluştu:', err);
            res.status(500).send('Personel eklenemedi.');
        } else {
            res.json({ message: 'Personel başarıyla eklendi!', id: result.insertId });
        }
    });
});


// Personel Güncelleme
router.put('/personeller/:id', (req, res) => {
    const { id } = req.params;
    const { ad_soyad, telefon, email, maas } = req.body;

    const query = `
        UPDATE personeller 
        SET ad_soyad = ?, telefon = ?, email = ?, maas = ? 
        WHERE id = ?
    `;
    db.query(query, [ad_soyad, telefon, email, maas, id], (err) => {
        if (err) {
            console.error('Personel güncellenirken hata oluştu:', err);
            res.status(500).send('Personel güncellenemedi.');
        } else {
            res.json({ message: 'Personel başarıyla güncellendi!' });
        }
    });
});



// Personel Silme
router.delete('/personeller/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM personeller WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Personel silinirken hata oluştu:', err);
            res.status(500).send('Personel silinemedi.');
        } else {
            res.json({ message: 'Personel başarıyla silindi!' });
        }
    });
});


// Randevuları Listeleme
router.get('/randevular', (req, res) => {
    const query = `
        SELECT 
            r.id, 
            r.hasta_ad, 
            r.email, 
            r.telefon, 
            DATE_FORMAT(r.randevu_tarihi, '%d-%m-%Y') AS randevu_tarihi, 
            DATE_FORMAT(r.randevu_saati, '%H:%i') AS randevu_saati,  
            h.ad AS hizmet,
            p.ad_soyad AS personel
        FROM randevular r
        LEFT JOIN hizmetler h ON r.hizmet_id = h.id
        LEFT JOIN personeller p ON r.personel_id = p.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Randevular alınırken hata oluştu:', err);
            res.status(500).send('Randevular alınamadı.');
        } else {
            res.json(results);
        }
    });
});




// Randevu Silme
router.delete('/randevular/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM randevular WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Randevu silinirken hata oluştu:', err);
            res.status(500).send('Randevu silinemedi.');
        } else {
            res.json({ message: 'Randevu başarıyla silindi!' });
        }
    });
});

//Randevu Güncelleme
router.put('/randevular/:id', (req, res) => {
    const { id } = req.params;
    const { hasta_ad, email, telefon, randevu_tarihi, randevu_saati, hizmet, personel } = req.body;

    const query = `
        UPDATE randevular 
        SET hasta_ad = ?, 
            email = ?, 
            telefon = ?, 
            randevu_tarihi = ?, 
            randevu_saati = ?, 
            hizmet_id = (SELECT id FROM hizmetler WHERE ad = ?), 
            personel_id = (SELECT id FROM personeller WHERE ad_soyad = ?)
        WHERE id = ?
    `;

    db.query(query, [hasta_ad, email, telefon, randevu_tarihi, randevu_saati, hizmet, personel, id], (err, result) => {
        if (err) {
            console.error('Randevu güncellenirken hata oluştu:', err);
            res.status(500).send('Randevu güncellenemedi.');
        } else {
            res.json({ message: 'Randevu başarıyla güncellendi!' });
        }
    });
});






// Randevu Ekleme
router.post('/randevular', (req, res) => {
    const { hasta_ad, email, telefon, randevu_tarihi, randevu_saati, hizmet, personel } = req.body;

    const randevuQuery = `
        INSERT INTO randevular (hasta_ad, email, telefon, hizmet_id, randevu_tarihi, randevu_saati, personel_id)
        VALUES (?, ?, ?, 
            (SELECT id FROM hizmetler WHERE ad = ?), ?, ?, 
            (SELECT id FROM personeller WHERE ad_soyad = ?))
    `;

    db.query(randevuQuery, [hasta_ad, email, telefon, hizmet, randevu_tarihi, randevu_saati, personel], (err, result) => {
        if (err) {
            console.error('Randevu eklenirken hata oluştu:', err);
            return res.status(500).send('Randevu eklenemedi.');
        }

        const randevuId = result.insertId;

        // Hizmetin ücretini al
        const hizmetQuery = `SELECT ucret FROM hizmetler WHERE ad = ?`;
        db.query(hizmetQuery, [hizmet], (err, hizmetResult) => {
            if (err || hizmetResult.length === 0) {
                console.error('Hizmet bulunamadı veya ücret alınamadı.', err);
                return res.status(500).send('Hizmet bilgisi alınamadı.');
            }

            const ucret = hizmetResult[0].ucret;

            // Ödeme kaydı ekle
            const odemeQuery = `
                INSERT INTO odemeler (hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi)
                VALUES (?, ?, 'Ödenmemiş', ?, NULL)
            `;
            db.query(odemeQuery, [hasta_ad, ucret, randevu_tarihi], (err) => {
                if (err) {
                    console.error('Ödeme kaydedilemedi:', err);
                    return res.status(500).send('Ödeme kaydı eklenemedi.');
                }

                res.json({ message: 'Randevu ve ödeme başarıyla eklendi!', randevuId });
            });
        });
    });
});





// Yeni Hizmet Ekleme
router.post('/hizmetler', (req, res) => {
    const { ad, ucret } = req.body;

    const query = 'INSERT INTO hizmetler (ad, ucret) VALUES (?, ?)';
    db.query(query, [ad, ucret], (err, result) => {
        if (err) {
            console.error('Hizmet eklenirken hata oluştu:', err);
            res.status(500).send('Hizmet eklenemedi.');
        } else {
            res.json({ message: 'Hizmet başarıyla eklendi!', id: result.insertId });
        }
    });
});


// Hizmetleri Listeleme
router.get('/hizmetler', (req, res) => {
    const query = 'SELECT * FROM hizmetler';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Hizmetleri çekerken hata oluştu:', err);
            res.status(500).send('Hizmetler alınamadı.');
        } else {
            res.json(results);
        }
    });
});

// Hizmet Silme
router.delete('/hizmetler/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM hizmetler
        WHERE id = ?
    `;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Hizmet silinirken hata oluştu:', err);
            res.status(500).send('Hizmet silinemedi.');
        } else {
            res.json({ message: 'Hizmet başarıyla silindi!' });
        }
    });
});

// Hizmet Güncelleme
router.put('/hizmetler/:id', (req, res) => {
    const { id } = req.params;
    const { ad, ucret } = req.body;

    const query = `
        UPDATE hizmetler
        SET ad = ?, ucret = ?
        WHERE id = ?
    `;
    db.query(query, [ad, ucret, id], (err, result) => {
        if (err) {
            console.error('Hizmet güncellenirken hata oluştu:', err);
            res.status(500).send('Hizmet güncellenemedi.');
        } else {
            res.json({ message: 'Hizmet başarıyla güncellendi!' });
        }
    });
});



// Ödeme Ekleme
router.post('/odemeler', (req, res) => {
    const { hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi } = req.body;

    const query = `
        INSERT INTO odemeler (hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi], (err, result) => {
        if (err) {
            console.error('Ödeme eklenirken hata oluştu:', err);
            res.status(500).send('Ödeme eklenemedi.');
        } else {
            res.json({ message: 'Ödeme başarıyla eklendi!', id: result.insertId });
        }
    });
});

/// Ödemeleri Listeleme (Personel Bilgisiyle)
router.get('/odemeler', (req, res) => {
    const query = `
        SELECT 
            o.id, 
            o.hasta_ad, 
            o.odenen_tutar, 
            o.odeme_turu, 
            DATE_FORMAT(o.fatura_tarihi, '%d-%m-%Y') AS fatura_tarihi,
            DATE_FORMAT(o.islem_tarihi, '%d-%m-%Y') AS islem_tarihi,
            p.ad_soyad AS personel
        FROM odemeler o
        LEFT JOIN randevular r ON o.hasta_ad = r.hasta_ad
        LEFT JOIN personeller p ON r.personel_id = p.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Ödemeler alınırken hata oluştu:', err);
            res.status(500).send('Ödemeler alınamadı.');
        } else {
            res.json(results);
        }
    });
});


// Ödeme Silme
router.delete('/odemeler/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM odemeler WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Ödeme silinirken hata oluştu:', err);
            res.status(500).send('Ödeme silinemedi.');
        } else {
            res.json({ message: 'Ödeme başarıyla silindi!' });
        }
    });
});

// Ödeme Güncelleme
router.put('/odemeler/:id', (req, res) => {
    const { id } = req.params;
    const { hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi } = req.body;

    console.log('Gelen Veriler:', { id, hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi });

    // Eksik veya hatalı parametre kontrolü
    if (!hasta_ad || !odenen_tutar || !odeme_turu || !fatura_tarihi || !islem_tarihi) {
        console.error('Eksik veya hatalı parametreler:', { hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi });
        return res.status(400).send('Tüm alanlar doldurulmalıdır.');
    }

    const query = `
        UPDATE odemeler
        SET hasta_ad = ?, 
            odenen_tutar = ?, 
            odeme_turu = ?, 
            fatura_tarihi = STR_TO_DATE(?, '%d-%m-%Y'), 
            islem_tarihi = STR_TO_DATE(?, '%d-%m-%Y')
        WHERE id = ?
    `;

    db.query(query, [hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi, id], (err, result) => {
        if (err) {
            console.error('Ödeme güncellenirken hata oluştu:', err);
            res.status(500).send('Ödeme güncellenemedi.');
        } else {
            res.json({ message: 'Ödeme başarıyla güncellendi!' });
        }
    });
});

// Hastaları Listeleme
router.get('/hastalar', (req, res) => {
    const query = `SELECT DISTINCT hasta_ad FROM randevular`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Hastalar alınırken hata oluştu:', err);
            res.status(500).send('Sunucu hatası');
        } else {
            res.json(results);
        }
    });
});


router.get('/personel-yukleri', (req, res) => {
    const query = `
        SELECT p.ad_soyad, COUNT(r.id) AS hasta_sayisi
        FROM personeller p
        LEFT JOIN randevular r ON p.id = r.personel_id
        GROUP BY p.id, p.ad_soyad
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Personel iş yükleri alınırken hata oluştu:', err);
            res.status(500).send('Personel iş yükleri alınamadı.');
        } else {
            res.json(results);
        }
    });
});


//Dashboard Endpointleri'i---------------------------------------------------------
//Özet
router.get('/dashboard/summary', (req, res) => {
    const query = `
        SELECT 
            (SELECT SUM(odenen_tutar) FROM odemeler WHERE odeme_turu IN ('Nakit', 'Kredi Kartı')) AS totalPayments,
            (SELECT SUM(odenen_tutar) FROM odemeler WHERE odeme_turu = 'Ödenmemiş') AS pendingPayments,
            (SELECT COUNT(*) FROM randevular WHERE randevu_tarihi >= CURDATE()) AS activeAppointments,
            (SELECT COUNT(*) FROM personeller) AS totalStaff
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Dashboard özeti alınırken hata oluştu:', err);
            res.status(500).send('Dashboard özeti alınamadı.');
        } else {
            res.json(results[0]);
        }
    });
});




// Randevu Dağılımı
router.get('/dashboard/appointment-chart', (req, res) => {
    const query = `
        SELECT DATE_FORMAT(randevu_tarihi, '%Y-%m') AS month, COUNT(*) AS count
        FROM randevular
        GROUP BY DATE_FORMAT(randevu_tarihi, '%Y-%m')
        ORDER BY DATE_FORMAT(randevu_tarihi, '%Y-%m');
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Randevu grafiği verileri alınırken hata oluştu:', err);
            res.status(500).send('Randevu grafiği verileri alınamadı.');
        } else {
            res.json(results);
        }
    });
});

// Gelir-Gider Grafiği
router.get('/dashboard/gelir-gider-chart', (req, res) => {
    const queryGelir = `SELECT SUM(odenen_tutar) AS gelir FROM odemeler WHERE odeme_turu IN ('Nakit', 'Kredi Kartı')`;
    const queryGider = `SELECT SUM(maas) AS gider FROM personeller`;

    db.query(queryGelir, (err, gelirResult) => {
        if (err) {
            console.error('Gelir hesaplanırken hata:', err);
            return res.status(500).send('Gelir verileri alınamadı.');
        }

        db.query(queryGider, (err, giderResult) => {
            if (err) {
                console.error('Gider hesaplanırken hata:', err);
                return res.status(500).send('Gider verileri alınamadı.');
            }

            const gelir = gelirResult[0].gelir || 0;
            const gider = giderResult[0].gider || 0;
            res.json({ gelir, gider });
        });
    });
});


// Aktif Randevular
router.get('/dashboard/active-appointments', (req, res) => {
    const query = `
        SELECT 
            r.hasta_ad, 
            DATE_FORMAT(r.randevu_tarihi, '%d-%m-%Y') AS tarih,
            DATE_FORMAT(r.randevu_saati, '%H:%i') AS saat, 
            h.ad AS hizmet,
            p.ad_soyad AS personel
        FROM randevular r
        LEFT JOIN hizmetler h ON r.hizmet_id = h.id
        LEFT JOIN personeller p ON r.personel_id = p.id
        WHERE CONCAT(r.randevu_tarihi, ' ', r.randevu_saati) >= NOW()
        ORDER BY r.randevu_tarihi ASC, r.randevu_saati ASC
        LIMIT 10;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Aktif randevular alınırken hata oluştu:', err);
            res.status(500).send('Aktif randevular alınamadı.');
        } else {
            res.json(results);
        }
    });
});

// Bekleyen Ödemeler
router.get('/dashboard/pending-payments', (req, res) => {
    const query = `
        SELECT 
            o.hasta_ad, 
            o.odenen_tutar, 
            DATE_FORMAT(o.fatura_tarihi, '%d-%m-%Y') AS fatura_tarihi,
            DATE_FORMAT(o.islem_tarihi, '%d-%m-%Y') AS islem_tarihi,
            p.ad_soyad AS personel
        FROM odemeler o
        LEFT JOIN randevular r ON o.hasta_ad = r.hasta_ad
        LEFT JOIN personeller p ON r.personel_id = p.id
        WHERE o.odeme_turu = 'Ödenmemiş'
        ORDER BY o.fatura_tarihi ASC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Bekleyen ödemeler alınırken hata oluştu:', err);
            res.status(500).send('Bekleyen ödemeler alınamadı.');
        } else {
            res.json(results);
        }
    });
});



// Personel İş Yükü Grafiği
router.get('/dashboard/personel-chart', (req, res) => {
    const query = `
        SELECT 
            p.ad_soyad AS personel, 
            COUNT(r.id) AS hasta_sayisi
        FROM personeller p
        LEFT JOIN randevular r ON p.id = r.personel_id
        GROUP BY p.id, p.ad_soyad
        ORDER BY hasta_sayisi DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Personel grafiği alınırken hata oluştu:', err);
            res.status(500).send('Personel grafiği alınamadı.');
        } else {
            res.json(results.map(row => ({ 
                personel: row.personel, 
                hasta_sayisi: Math.round(row.hasta_sayisi) // Tam sayı olmasını sağlar
            })));
        }
    });
});

//Login paneli
router.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM admins WHERE username = ? AND password = ?'; 
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Giriş sırasında hata oluştu:', err);
            return res.status(500).send('Sunucu hatası');
        }

        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});



module.exports = router;
