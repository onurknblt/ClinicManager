
let odemeData = []; // Tüm ödeme verilerini tutmak için global değişken

// -------------------- Ödeme İşlemleri --------------------

function parseDate(tarih) {
    const [day, month, year] = tarih.split('-');
    return new Date(`${year}-${month}-${day}`); // YYYY-MM-DD formatına dönüştür
}


function fetchOdemeler() {
    fetch('http://localhost:3000/api/odemeler')
        .then(response => response.json())
        .then(data => {
            odemeData = data;
            renderOdemeTable(odemeData);
            attachSearchFilters(odemeData);
        })
        .catch(err => console.error('Ödemeler alınırken hata oluştu:', err));
}

function renderOdemeTable(data) {
    const tableBody = document.querySelector('#odemeTable tbody');
    if (!tableBody) {
        console.error('Table body not found. Check #odemeTable in HTML.');
        return;
    }

    tableBody.innerHTML = ''; // Mevcut tabloyu temizle
    data.forEach(odeme => {
        const row = `
            <tr>
                <td>${odeme.id}</td>
                <td>${odeme.hasta_ad}</td>
                <td>${odeme.odenen_tutar}</td>
                <td>${odeme.odeme_turu}</td>
                <td>${odeme.fatura_tarihi}</td>
                <td>${odeme.islem_tarihi || 'Bekliyor'}</td>
                <td>${odeme.personel || 'Atanmamış'}</td>
                <td>
                    <button onclick="updateOdeme(${odeme.id}, '${odeme.hasta_ad}', ${odeme.odenen_tutar}, '${odeme.odeme_turu}', '${odeme.fatura_tarihi}', '${odeme.islem_tarihi || ''}')">Güncelle</button>
                    <button onclick="deleteOdeme(${odeme.id})">Sil</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}





document.querySelectorAll('.sort-icons .sort-asc').forEach(icon => {
    icon.addEventListener('click', () => {
        const column = icon.getAttribute('data-column');
        const sortedData = [...odemeData].sort((a, b) => {
            if (column === 'fatura_tarihi' || column === 'islem_tarihi') {
                const dateA = parseDate(a[column]);
                const dateB = parseDate(b[column]);
                return dateA - dateB; // Tarihler için artan sıralama
            }
            if (column === 'odenen_tutar') {
                return parseFloat(a[column]) - parseFloat(b[column]); // Tutar için artan sıralama
            }
            return a[column] > b[column] ? 1 : -1; // Diğer sütunlar için artan sıralama
        });
        renderOdemeTable(sortedData);
        attachSearchFilters(sortedData); // Güncellenmiş veriyle filtrelemeyi bağla
    });
});

document.querySelectorAll('.sort-icons .sort-desc').forEach(icon => {
    icon.addEventListener('click', () => {
        const column = icon.getAttribute('data-column');
        const sortedData = [...odemeData].sort((a, b) => {
            if (column === 'fatura_tarihi' || column === 'islem_tarihi') {
                const dateA = parseDate(a[column]);
                const dateB = parseDate(b[column]);
                return dateB - dateA; // Tarihler için azalan sıralama
            }
            if (column === 'odenen_tutar') {
                return parseFloat(b[column]) - parseFloat(a[column]); // Tutar için azalan sıralama
            }
            return a[column] < b[column] ? 1 : -1; // Diğer sütunlar için azalan sıralama
        });
        renderOdemeTable(sortedData);
        attachSearchFilters(sortedData); // Güncellenmiş veriyle filtrelemeyi bağla
    });
});



function attachSearchFilters(data) {
    const inputs = {
        hasta_ad: document.getElementById('search-hasta-ad'),
        tutar: document.getElementById('search-tutar'),
        tarih: document.getElementById('search-tarih'),
        islem_tarihi: document.getElementById('search-islem-tarihi'),
        personel: document.getElementById('search-personel')
    };

    Object.keys(inputs).forEach(key => {
        const inputElement = inputs[key];
        if (!inputElement) {
            console.warn(`Input for ${key} not found.`);
            return;
        }

        inputElement.addEventListener('input', () => {
            const filteredData = data.filter(item => {
                return Object.keys(inputs).every(filterKey => {
                    const inputValue = inputs[filterKey]?.value?.toLowerCase()?.trim() || '';
                    if (!inputValue) return true;
                    if (filterKey === 'tarih') {
                        return item.fatura_tarihi.includes(inputValue);
                    }
                    if (filterKey === 'islem_tarihi') {
                        return item.islem_tarihi && item.islem_tarihi.includes(inputValue);
                    }
                    if (filterKey === 'tutar') {
                        return item.odenen_tutar.toString().includes(inputValue);
                    }
                    if (filterKey === 'odeme_turu') {
                        return item.odeme_turu.toLowerCase().includes(inputValue);
                    }
                    return item[filterKey]?.toLowerCase().includes(inputValue);
                });
            });
            renderOdemeTable(filteredData);
        });
    });
}









//  Ödeme Ekleme
function addOdeme() {
    const hasta_ad = document.getElementById('hasta_ad').value;
    const odenen_tutar = document.getElementById('odenen_tutar').value;
    const odeme_turu = document.getElementById('odeme_turu').value;
    const fatura_tarihi = document.getElementById('fatura_tarihi').value;
    const islem_tarihi = document.getElementById('islem_tarihi').value;

    if (!hasta_ad || !odenen_tutar || !odeme_turu || !fatura_tarihi || !islem_tarihi) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }

    fetch('http://localhost:3000/api/odemeler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ödeme eklenemedi.');
        }
        return response.json();
    })
    .then(() => {
        fetchOdemeler(); // Ödemeleri yeniden yükle
        alert('Ödeme başarıyla eklendi!');
    })
    .catch(err => {
        console.error(err);
        alert('Bir hata oluştu.');
    });
}

// Ödeme Silme
function deleteOdeme(id) {
    if (!confirm('Bu ödemeyi silmek istediğinizden emin misiniz?')) {
        return;
    }

    fetch(`/api/odemeler/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Ödeme silinemedi.');
            return response.json();
        })
        .then(() => {
            alert('Ödeme başarıyla silindi!');
            fetchOdemeler(); // Tabloyu yeniden yükle
        })
        .catch(err => {
            console.error('Hata:', err);
            alert('Bir hata oluştu. Ödeme silinemedi.');
        });
}


// Ödeme Güncelleme
function updateOdeme(id, hasta_ad, odenen_tutar, odeme_turu, fatura_tarihi, islem_tarihi) {
    const yeniHastaAd = prompt('Hasta Adı:', hasta_ad) || hasta_ad;
    const yeniOdenenTutar = prompt('Ödenen Tutar:', odenen_tutar) || odenen_tutar;
    const yeniOdemeTuru = prompt('Ödeme Türü (Nakit/Kredi Kartı):', odeme_turu) || odeme_turu;

    // Tarihleri kullanıcıdan al ve doğrula
    const yeniFaturaTarihi = prompt('Fatura Tarihi (DD-MM-YYYY):', fatura_tarihi) || fatura_tarihi;
    const yeniIslemTarihi = prompt('İşlem Tarihi (DD-MM-YYYY):', islem_tarihi) || islem_tarihi;



    fetch(`/api/odemeler/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hasta_ad: yeniHastaAd,
            odenen_tutar: yeniOdenenTutar,
            odeme_turu: yeniOdemeTuru,
            fatura_tarihi: yeniFaturaTarihi,
            islem_tarihi: yeniIslemTarihi
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Ödeme güncellenemedi.');
        return response.json();
    })
    .then(() => {
        alert('Ödeme başarıyla güncellendi!');
        fetchOdemeler(); // Tabloyu yeniden yükle
    })
    .catch(err => console.error('Hata:', err));
}


function markAsPaid(id, hasta_ad, odenen_tutar, fatura_tarihi) {
    let islemTarihi = prompt('İşlem Tarihi (DD-MM-YYYY):');

    // Kullanıcı tarih girmemişse veya yanlış formatta girmişse işlemi iptal edin
    if (!islemTarihi || !/^\d{4}-\d{2}-\d{2}$/.test(islemTarihi)) {
        alert('Geçerli bir işlem tarihi girilmelidir. İşlem iptal edildi.');
        return; // İşlem iptal edilir
    }

    const odemeTuru = prompt('Ödeme Türünü Giriniz (Kredi Kartı veya Nakit):');
    if (!odemeTuru || (odemeTuru !== 'Kredi Kartı' && odemeTuru !== 'Nakit')) {
        alert('Geçerli bir ödeme türü giriniz (Kredi Kartı veya Nakit)!');
        return; // İşlem iptal edilir
    }

    console.log('Gönderilen Veriler:', {
        id,
        hasta_ad,
        odenen_tutar,
        odeme_turu: odemeTuru,
        fatura_tarihi,
        islem_tarihi
    });

    fetch(`/api/odemeler/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hasta_ad,
            odenen_tutar,
            odeme_turu: odemeTuru,
            fatura_tarihi,
            islem_tarihi
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Ödeme güncellenemedi.');
        return response.json();
    })
    .then(() => {
        alert('Ödeme başarıyla güncellendi!');
        fetchOdemeler(); // Tabloyu yeniden yükle
    })
    .catch(err => console.error('Hata:', err));
}

