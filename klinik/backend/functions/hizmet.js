// -------------------- Hizmet İşlemleri --------------------

// Hizmetleri Listeleme
function fetchHizmetler() {
    fetch('http://localhost:3000/api/hizmetler')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#hizmetTable tbody');
            tableBody.innerHTML = '';

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4">Hiç hizmet bulunamadı.</td></tr>';
                return;
            }

            data.forEach(hizmet => {
                const row = `
                    <tr>
                        <td>${hizmet.id}</td>
                        <td>${hizmet.ad}</td>
                        <td>${hizmet.ucret}</td>
                        <td>
                            <button class="update" onclick="updateHizmet(${hizmet.id}, '${hizmet.ad}', ${hizmet.ucret})">Güncelle</button>
                            <button class="delete" onclick="deleteHizmet(${hizmet.id})">Sil</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(err => console.error('Hizmetler alınırken hata oluştu:', err));
}




// Yeni Hizmet Ekleme
function addHizmet() {
    const ad = document.getElementById('ad').value;
    const ucret = document.getElementById('ucret').value;

    if (!ad || !ucret) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }

    fetch('http://localhost:3000/api/hizmetler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad, ucret })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hizmet eklenemedi.');
            }
            return response.json();
        })
        .then(() => {
            fetchHizmetler(); // Hizmetleri yeniden yükle
            alert('Hizmet başarıyla eklendi!');
        })
        .catch(err => {
            console.error(err);
            alert('Bir hata oluştu.');
        });
}

function deleteHizmet(id) {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
        return;
    }

    fetch(`http://localhost:3000/api/hizmetler/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hizmet silinemedi.');
            }
            return response.json();
        })
        .then(() => {
            fetchHizmetler(); // Hizmetleri yeniden yükle
            alert('Hizmet başarıyla silindi!');
        })
        .catch(err => {
            console.error('Hizmet silinirken hata oluştu:', err);
            alert('Bir hata oluştu. Hizmet silinemedi.');
        });
}


//Hizmet Güncelleme
function updateHizmet(id, mevcutAd, mevcutUcret) {
    const yeniAd = prompt('Hizmet Adı:', mevcutAd) || mevcutAd;
    const yeniUcret = prompt('Hizmet Ücreti:', mevcutUcret) || mevcutUcret;

    fetch(`http://localhost:3000/api/hizmetler/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad: yeniAd, ucret: yeniUcret })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hizmet güncellenemedi.');
            }
            return response.json();
        })
        .then(() => {
            fetchHizmetler(); // Hizmetleri yeniden yükle
            alert('Hizmet başarıyla güncellendi!');
        })
        .catch(err => {
            console.error('Hizmet güncellenirken hata oluştu:', err);
            alert('Bir hata oluştu. Hizmet güncellenemedi.');
        });
}






// Dinamik Hasta Dropdown
function fetchHastaDropdown() {
    fetch('http://localhost:3000/api/randevular')
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('hasta_ad');
            dropdown.innerHTML = '<option value="" disabled selected>Hasta Seçin</option>'; // Temizle

            data.forEach(randevu => {
                const option = document.createElement('option');
                option.value = randevu.hasta_ad;
                option.textContent = randevu.hasta_ad;
                dropdown.appendChild(option);
            });
        })
        .catch(err => console.error('Hasta isimleri alınırken hata oluştu:', err));
}


// Dinamik Hizmet Dropdown
function fetchHizmetDropdown() {
    fetch('http://localhost:3000/api/hizmetler')
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('hizmet');
            data.forEach(hizmet => {
                const option = document.createElement('option');
                option.value = hizmet.ad;
                option.textContent = hizmet.ad;
                dropdown.appendChild(option);
            });
        });
}



