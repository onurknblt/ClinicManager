// Ortak Fonksiyonlar ve Yapılar

// 1. Dinamik Dropdown Doldurma
function populateDropdown(apiUrl, dropdownId) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById(dropdownId);
            dropdown.innerHTML = '<option value="" disabled selected>Seçim Yapın</option>';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.ad;
                option.textContent = item.ad;
                dropdown.appendChild(option);
            });
        })
        .catch(err => console.error(`Dropdown Hatası (${dropdownId}):`, err));
}

// 2. API'den Veri Çekme
function fetchData(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(callback)
        .catch(err => console.error(`Hata (${url}):`, err));
}

// 3. Tablo Güncelleme Yardımcı Fonksiyonu
function updateTable(tableId, data, rowGenerator) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = '';
    data.forEach(item => {
        tableBody.innerHTML += rowGenerator(item);
    });
}

// 4. Genel Hata Yönetimi
function handleError(error) {
    console.error('Hata:', error);
    alert('Bir hata oluştu. Lütfen tekrar deneyin.');
}

// 5. Form Verilerini Toplama
function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    return data;
}

// 6. Yeni Veri Eklerken Form Temizleme
function clearForm(formId) {
    const form = document.getElementById(formId);
    form.reset();
}

// 7. Tabloya Hiç Veri Yok Mesajı Ekleme
function showEmptyTableMessage(tableId, columnCount, message = 'Hiç veri bulunamadı.') {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = `<tr><td colspan="${columnCount}" style="text-align: center;">${message}</td></tr>`;
}

// 8. Genel Fetch POST İsteği
function postData(url, data, successCallback) {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) throw new Error('Sunucu hatası');
            return response.json();
        })
        .then(successCallback)
        .catch(err => handleError(err));
}

// 9. Genel Fetch DELETE İsteği
function deleteData(url, successCallback) {
    fetch(url, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Silme işlemi başarısız');
            return response.json();
        })
        .then(successCallback)
        .catch(err => handleError(err));
}

function showDateTime() {
    const dateTimeElement = document.getElementById('datetime'); // HTML'de bu ID'ye sahip bir element olmalı
    if (!dateTimeElement) return; // Eğer element bulunmazsa fonksiyon sonlanır

    const now = new Date();
    const formattedDate = now.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDay = now.toLocaleDateString('tr-TR', { weekday: 'long' }); // Gün bilgisi

    dateTimeElement.innerHTML = `
        <div>${formattedDate}</div>
        <div>${formattedTime}</div>
        <div style="font-size: 12px; font-weight: normal; margin-top: 5px;">${formattedDay}</div>
    `;
}

// Her saniye güncelle
setInterval(showDateTime,0);
