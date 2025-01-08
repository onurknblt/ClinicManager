// -------------------- Personel İşlemleri --------------------

let personelData = []; // Tüm personel verilerini tutacak global değişken


// Personelleri Listeleme
function fetchPersoneller() {
    fetch('http://localhost:3000/api/personeller')
        .then(response => response.json())
        .then(data => {
            personelData = data; // Gelen veriyi global değişkene kaydet
            renderPersonelTable(personelData); // Tabloyu oluştur
            attachSearchFilters(personelData); // Filtreleme işlevlerini bağla
        })
        .catch(err => console.error('Personeller alınırken hata oluştu:', err));
}


function renderPersonelTable(data) {
    const tableBody = document.querySelector('#personelTable tbody');
    if (!tableBody) {
        console.error('Table body not found. Check #personelTable in HTML.');
        return;
    }

    tableBody.innerHTML = ''; // Tabloyu temizle

    data.forEach(personel => {
        const row = `
            <tr>
                <td>${personel.id}</td>
                <td>${personel.ad_soyad}</td>
                <td>${personel.telefon || 'Bilinmiyor'}</td>
                <td>${personel.email || 'Bilinmiyor'}</td>
                <td>${personel.maas || 'Bilinmiyor'}</td>
                <td>
                    <button onclick="updatePersonel(${personel.id}, '${personel.ad_soyad}', '${personel.telefon}', '${personel.email}', ${personel.maas})">Güncelle</button>
                    <button onclick="deletePersonel(${personel.id})">Sil</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

document.querySelectorAll('.sort-icons .sort-asc').forEach(icon => {
    icon.addEventListener('click', () => {
        const column = icon.getAttribute('data-column');
        const sortedData = [...personelData].sort((a, b) => {
            if (column === 'maas') {
                return parseFloat(a[column]) - parseFloat(b[column]); // Maaş için artan sıralama
            }
            return a[column] > b[column] ? 1 : -1; // Diğer sütunlar için artan sıralama
        });
        renderPersonelTable(sortedData);
        attachSearchFilters(sortedData); // Güncellenmiş veriyi filtrelemeye bağla
    });
});

document.querySelectorAll('.sort-icons .sort-desc').forEach(icon => {
    icon.addEventListener('click', () => {
        const column = icon.getAttribute('data-column');
        const sortedData = [...personelData].sort((a, b) => {
            if (column === 'maas') {
                return parseFloat(b[column]) - parseFloat(a[column]); // Maaş için azalan sıralama
            }
            return a[column] < b[column] ? 1 : -1; // Diğer sütunlar için azalan sıralama
        });
        renderPersonelTable(sortedData);
        attachSearchFilters(sortedData); // Güncellenmiş veriyi filtrelemeye bağla
    });
});


function attachSearchFilters(data) {
    const inputs = {
        ad_soyad: document.getElementById('search-ad-soyad'),
        telefon: document.getElementById('search-telefon'),
        email: document.getElementById('search-email'),
        maas: document.getElementById('search-maas')
    };

    Object.keys(inputs).forEach(key => {
        const inputElement = inputs[key];
        if (!inputElement) {
            console.warn(`Input for ${key} not found.`);
            return; // Eğer input bulunamazsa atla
        }

        inputElement.addEventListener('input', () => {
            const filteredData = data.filter(item => {
                return Object.keys(inputs).every(filterKey => {
                    const inputValue = inputs[filterKey]?.value?.toLowerCase()?.trim() || '';
                    if (!inputValue) return true; // Input boşsa filtreleme yapma
                    if (filterKey === 'maas') {
                        return item[filterKey].toString().includes(inputValue); // Maaş araması
                    }
                    return item[filterKey]?.toLowerCase()?.includes(inputValue);
                });
            });
            renderPersonelTable(filteredData); // Güncellenmiş tabloyu oluştur
        });
    });
}




// Yeni Personel Ekleme
function addPersonel() {
    const ad_soyad = document.getElementById('ad_soyad').value;
    const telefon = document.getElementById('telefon').value;
    const email = document.getElementById('email').value;
    const maas = document.getElementById('maas').value;

    if (!ad_soyad || !telefon || !email || !maas) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }

    fetch('http://localhost:3000/api/personeller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad_soyad, telefon, email, maas })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Personel eklenemedi.');
        }
        return response.json();
    })
    .then(() => {
        fetchPersoneller(); // Personelleri yeniden yükle
        alert('Personel başarıyla eklendi!');
    })
    .catch(err => {
        console.error(err);
        alert('Bir hata oluştu.');
    });
}


// Personel Silme
function deletePersonel(id) {
    if (!confirm('Bu personeli silmek istediğinizden emin misiniz?')) {
        return;
    }

    fetch(`http://localhost:3000/api/personeller/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Personel silinemedi.');
            }
            return response.json();
        })
        .then(() => {
            fetchPersoneller(); // Tabloyu yeniden yükle
            alert('Personel başarıyla silindi!');
        })
        .catch(err => {
            console.error(err);
            alert('Bir hata oluştu. Silme işlemi başarısız.');
        });
}


// Personel Güncelleme
function updatePersonel(id, ad_soyad, telefon, email, maas) {
    const yeniAdSoyad = prompt('Ad Soyad:', ad_soyad) || ad_soyad;
    const yeniTelefon = prompt('Telefon:', telefon) || telefon;
    const yeniEmail = prompt('Email:', email) || email;
    const yeniMaas = prompt('Maaş:', maas) || maas;

    fetch(`http://localhost:3000/api/personeller/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ad_soyad: yeniAdSoyad,
            telefon: yeniTelefon,
            email: yeniEmail,
            maas: yeniMaas
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Personel güncellenemedi.');
        }
        return response.json();
    })
    .then(() => {
        fetchPersoneller(); // Tabloyu yeniden yükle
        alert('Personel başarıyla güncellendi!');
    })
    .catch(err => {
        console.error(err);
        alert('Bir hata oluştu. Güncelleme başarısız.');
    });
}


function fetchPersonelYukleri() {
    fetch('http://localhost:3000/api/personel-yukleri')
        .then(response => response.json())
        .then(data => {
            // İş yüklerini görselleştir
        })
        .catch(err => console.error('Personel iş yükleri alınırken hata oluştu:', err));
}
