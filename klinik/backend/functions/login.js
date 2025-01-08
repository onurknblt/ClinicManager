document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Formun sayfayı yenilemesini engelle

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Giriş başarısız.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            window.location.href = 'index.html'; // Başarılı girişten sonra yönlendirme
        } else {
            document.getElementById('loginError').textContent = 'Hatalı kullanıcı adı veya şifre.';
        }
    })
    .catch(err => {
        console.error('Giriş sırasında hata oluştu:', err);
        document.getElementById('loginError').textContent = 'Bir hata oluştu. Lütfen tekrar deneyin.';
    });
});
