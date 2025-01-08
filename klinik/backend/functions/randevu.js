
let randevuData = []; 

// -------------------- Randevu İşlemleri --------------------
function convertToSQLDate(dateString) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`; // YYYY-MM-DD formatına dönüştür
}

function parseDate(tarih) {
    const [day, month, year] = tarih.split('-');
    return new Date(`${year}-${month}-${day}`); // YYYY-MM-DD formatına dönüştür
}


// Randevuları Listeleme
function fetchRandevular() {
    fetch('http://localhost:3000/api/randevular')
        .then(response => response.json())
        .then(data => {
            randevuData = data; // Gelen veriyi global değişkene kaydet
            renderRandevuTable(randevuData); // Tabloyu oluştur
            attachSearchFilters(randevuData); // Filtrelemeyi bağla
        })
        .catch(err => console.error('Randevular alınırken hata oluştu:', err));
}


function renderRandevuTable(data) {
    const tableBody = document.querySelector('#randevuTable tbody');
    tableBody.innerHTML = ''; // Tabloyu temizle

    data.forEach(randevu => {
        const row = `
            <tr>
                <td>${randevu.id}</td>
                <td>${randevu.hasta_ad}</td>
                <td>${randevu.email}</td>
                <td>${randevu.telefon}</td>
                <td>${randevu.randevu_tarihi}</td>
                <td>${randevu.randevu_saati}</td>
                <td>${randevu.hizmet}</td>
                <td>${randevu.personel || 'Atanmamış'}</td>
                <td>
                    <button onclick="updateRandevu(${randevu.id}, '${randevu.hasta_ad}', '${randevu.email}', '${randevu.telefon}', '${randevu.randevu_tarihi}', '${randevu.randevu_saati}', '${randevu.hizmet}', '${randevu.personel || ''}')">Güncelle</button>
                    <button onclick="deleteRandevu(${randevu.id})">Sil</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

document.querySelectorAll('.sort-icons .sort-asc').forEach(icon => {
    icon.addEventListener('click', () => {
        const column = icon.getAttribute('data-column');
        const sortedData = [...randevuData].sort((a, b) => {
            if (column === 'randevu_tarihi') {
                const dateA = parseDate(a[column]);
                const dateB = parseDate(b[column]);
                return dateA - dateB; // Tarihler için artan sıralama
            }
            return a[column] > b[column] ? 1 : -1; // Diğer sütunlar için artan sıralama
        });
        renderRandevuTable(sortedData);
        attachSearchFilters(sortedData); // Güncellenmiş veriyi filtrelemeye bağla
    });
});

document.querySelectorAll('.sort-icons .sort-desc').forEach(icon => {
    icon.addEventListener('click', () => {
        const column = icon.getAttribute('data-column');
        const sortedData = [...randevuData].sort((a, b) => {
            if (column === 'randevu_tarihi') {
                const dateA = parseDate(a[column]);
                const dateB = parseDate(b[column]);
                return dateB - dateA; // Tarihler için azalan sıralama
            }
            return a[column] < b[column] ? 1 : -1; // Diğer sütunlar için azalan sıralama
        });
        renderRandevuTable(sortedData);
        attachSearchFilters(sortedData); // Güncellenmiş veriyi filtrelemeye bağla
    });
});



function attachSearchFilters(data) {
    const inputs = {
        hasta_ad: document.getElementById('search-hasta-ad'),
        email: document.getElementById('search-email'),
        telefon: document.getElementById('search-telefon'),
        tarih: document.getElementById('search-tarih'),
        saat: document.getElementById('search-saat'),
        hizmet: document.getElementById('search-hizmet'),
        personel: document.getElementById('search-personel')
    };

    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('input', () => {
            const filteredData = data.filter(item => {
                return Object.keys(inputs).every(filterKey => {
                    const inputValue = inputs[filterKey].value.toLowerCase();
                    if (filterKey === 'tarih') {
                        return item.randevu_tarihi.includes(inputValue); // Tarih araması
                    }
                    if (filterKey === 'saat') {
                        return item.randevu_saati.includes(inputValue); // Saat araması
                    }
                    return item[filterKey] ? item[filterKey].toString().toLowerCase().includes(inputValue) : true;
                });
            });
            renderRandevuTable(filteredData);
        });
    });
}




// Yeni Randevu Ekleme
function addRandevu() {
    const hasta_ad = document.getElementById('hasta_ad').value;
    const email = document.getElementById('email').value;
    const telefon = document.getElementById('telefon').value;
    const randevu_tarihi = document.getElementById('randevu_tarihi').value;
    const randevu_saati = document.getElementById('randevu_saati').value;
    const hizmet = document.getElementById('hizmet').value;
    const personel = document.getElementById('personel').value;

    if (!hasta_ad || !email || !telefon || !randevu_tarihi || !randevu_saati || !hizmet || !personel) {
        alert('Tüm alanları doldurunuz!');
        return;
    }

    fetch('http://localhost:3000/api/randevular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasta_ad, email, telefon, randevu_tarihi, randevu_saati, hizmet, personel })
    })
        .then(response => {
            if (!response.ok) throw new Error('Randevu eklenemedi.');
            return response.json();
        })
        .then(() => {
            alert('Randevu başarıyla eklendi!');
            fetchRandevular();
        })
        .catch(err => console.error('Hata:', err));
}








// Randevu Silme
function deleteRandevu(id) {
    fetch(`http://localhost:3000/api/randevular/${id}`, { method: 'DELETE' })
        .then(() => {
            fetchRandevular(); // Randevular tekrar yüklenecek
            alert('Randevu silindi!');
        });
}

//Randevu güncelleme
function updateRandevu(id, mevcutHastaAd, mevcutEmail, mevcutTelefon, mevcutTarih, mevcutSaat, mevcutHizmet, mevcutPersonel) {
    const yeniHastaAd = prompt('Hasta Adı:', mevcutHastaAd) || mevcutHastaAd;
    const yeniEmail = prompt('Email:', mevcutEmail) || mevcutEmail;
    const yeniTelefon = prompt('Telefon:', mevcutTelefon) || mevcutTelefon;
    const yeniTarih = prompt('Tarih (DD-MM-YYYY):', mevcutTarih) || mevcutTarih;
    const yeniSaat = prompt('Saat (HH:MM):', mevcutSaat) || mevcutSaat;
    const yeniHizmet = prompt('Hizmet Adı:', mevcutHizmet) || mevcutHizmet;
    const yeniPersonel = prompt('Personel Adı:', mevcutPersonel) || mevcutPersonel;

    const tarihSQL = convertToSQLDate(yeniTarih); 

    fetch(`http://localhost:3000/api/randevular/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hasta_ad: yeniHastaAd,
            email: yeniEmail,
            telefon: yeniTelefon,
            randevu_tarihi: tarihSQL,
            randevu_saati: yeniSaat,
            hizmet: yeniHizmet,
            personel: yeniPersonel // Personel adını gönderiyoruz
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Randevu güncellenemedi.');
            }
            return response.json();
        })
        .then(() => {
            fetchRandevular(); // Güncellenmiş listeyi yeniden yükle
            alert('Randevu başarıyla güncellendi!');
        })
        .catch(err => console.error('Randevu güncellenirken hata oluştu:', err));
}




// Dinamik Hizmet Dropdown
function fetchHizmetDropdown() {
    populateDropdown('http://localhost:3000/api/hizmetler', 'hizmet');
}

function fetchPersoneller() {
    fetch('http://localhost:3000/api/personeller')
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('personel');
            dropdown.innerHTML = '<option value="" disabled selected>Personel Seçin</option>';
            data.forEach(personel => {
                const option = document.createElement('option');
                option.value = personel.ad_soyad; // Gönderilecek olan değer personel adı
                option.textContent = personel.ad_soyad; // Görüntülenecek değer personel adı
                dropdown.appendChild(option);
            });
        })
        .catch(err => console.error('Personeller alınırken hata oluştu:', err));
}
