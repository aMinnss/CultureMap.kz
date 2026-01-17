console.log(llll);
document.addEventListener('DOMContentLoaded', async () => {

    // 1️⃣ Подгружаем sidebar
    try {
        const sidebarContainer = document.createElement('div');
        document.body.prepend(sidebarContainer); // вставляем в начало body

        const response = await fetch('sidebar.html');
        const html = await response.text();
        sidebarContainer.innerHTML = html;

        // 2️⃣ Выделяем активную ссылку
        const links = sidebarContainer.querySelectorAll('.sidebar-nav a');
        const currentPath = window.location.pathname.split('/').pop(); // например "news.html"

        links.forEach(link => {
            if (link.getAttribute('href')?.includes(currentPath)) {
                link.parentElement.classList.add('active');
            } else {
                link.parentElement.classList.remove('active');
            }
        });

        // 3️⃣ Загружаем профиль
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await fetch('http://46.226.123.216:8080/v1/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const profile = await res.json();
                    document.getElementById('profile-username').textContent = profile.fio || 'Глобальный Админ';
                    document.getElementById('profile-organization').textContent = `Организация: ${profile.organization || 'CultureMap HQ'}`;
                    document.getElementById('profile-role').textContent = roleMap[profile.role] || profile.role;
                }
            } catch (err) {
                console.warn('Не удалось загрузить профиль:', err);
            }
        }

        // 4️⃣ Logout через делегирование
        sidebarContainer.addEventListener('click', (event) => {
            if (event.target.id === 'logout-btn') {
                event.preventDefault(); // важно для <a>
                console.log('Клик по выходу пойман!');
                
                const token = localStorage.getItem('token');
                if (!token) return;

                // 4.1 Отправляем запрос на сервер (если нужен)
                fetch('http://46.226.123.216:8080/v1/auth/sign-out', {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                .then(res => {
                    if (res.ok) {
                        localStorage.removeItem('token');
                        window.location.href = 'index.html';
                    } else {
                        console.error('Ошибка выхода:', res.status);
                        alert('Не удалось выйти. Попробуйте ещё раз.');
                    }
                })
                .catch(err => {
                    console.error('Ошибка сети при выходе:', err);
                    alert('Не удалось соединиться с сервером.');
                });
            }
        });

    } catch (err) {
        console.error('Ошибка при подгрузке sidebar:', err);
    }

});

// маппинг ролей
const roleMap = {
    admin: 'Супер Админ',
    akimat: 'Акимат',
    organizer: 'Организатор'
};


// Подгружаем sidebar динамически.
// Выделяем активную ссылку.
// Загружаем профиль пользователя.
// Ловим клик по кнопке выхода даже если она подгружается динамически.
// Отправляем запрос на /v1/auth/sign-out с токеном.
// Удаляем токен из localStorage и делаем редирект на index.html.