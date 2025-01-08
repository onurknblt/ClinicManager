//Dashboard kartları
fetch('/api/dashboard/summary')
    .then(response => response.json())
    .then(data => {
        // DOM elementlerini seçiyoruz
        const activeAppointments = document.getElementById('activeAppointments');
        const totalPayments = document.getElementById('totalPayments');
        const pendingPayments = document.getElementById('pendingPayments');
        const totalStaff = document.getElementById('totalStaff');

        // DOM elementleri varsa verileri güncelliyoruz
        if (activeAppointments && totalPayments && pendingPayments && totalStaff) {
            activeAppointments.textContent = data.activeAppointments || 0;
            totalPayments.textContent = `${data.totalPayments || 0}₺`;
            pendingPayments.textContent = `${data.pendingPayments || 0}₺`;
            totalStaff.textContent = data.totalStaff || 0;
        } else {
            console.error('Gerekli DOM elementleri bulunamadı.');
        }
    })
    .catch(err => console.error('Dashboard özeti alınırken hata:', err));




// Personel İş Yükü Grafiği
fetch('/api/dashboard/personel-chart')
    .then(response => response.json())
    .then(chartData => {
        const ctx = document.getElementById('appointmentChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.map(row => row.personel), // Personel isimleri
                datasets: [{
                    label: 'Hasta Sayısı',
                    data: chartData.map(row => row.hasta_sayisi), // Hasta sayıları
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Personel',
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1 // Tam sayılar arasında gezinme
                        },
                        title: {
                            display: true,
                            text: 'Hasta Sayısı',
                        },
                    }
                }
            }
        });
    })
    .catch(err => console.error('Personel grafiği alınırken hata:', err));


// Aktif Randevular Tablosu
fetch('/api/dashboard/active-appointments')
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#activeAppointmentsTable tbody');
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = `
                <tr>
                    <td>${item.hasta_ad}</td>
                    <td>${item.tarih} ${item.saat}</td>
                    <td>${item.hizmet}</td>
                    <td>${item.personel || 'Atanmamış'}</td>
                </tr>`;
            tbody.innerHTML += row;
        });
    })
    .catch(err => console.error('Aktif randevular alınırken hata:', err));

// Bekleyen Ödemeler Tablosu
fetch('/api/dashboard/pending-payments')
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#pendingPaymentsTable tbody');
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = `
                <tr>
                    <td>${item.hasta_ad}</td>
                    <td>${item.odenen_tutar}₺</td>
                    <td>${item.fatura_tarihi}</td>
                    <td>${item.islem_tarihi || 'Bekliyor'}</td>
                    <td>${item.personel || 'Atanmamış'}</td>
                </tr>`;
            tbody.innerHTML += row;
        });
    })
    .catch(err => console.error('Bekleyen ödemeler alınırken hata:', err));


// Gelir-Gider Grafiği
fetch('/api/dashboard/gelir-gider-chart')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('serviceChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Gelir', 'Gider'],
                datasets: [{
                    data: [data.gelir, data.gider],
                    backgroundColor: ['#4caf50', '#f44336']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });
    })
    .catch(err => console.error('Gelir-Gider grafiği alınırken hata:', err));








