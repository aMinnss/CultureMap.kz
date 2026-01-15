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
        const currentPath = window.location.pathname.split('/').pop(); // "news.html"

        links.forEach(link => {
            if (link.getAttribute('href').includes(currentPath)) {
                link.parentElement.classList.add('active');
            } else {
                link.parentElement.classList.remove('active');
            }
        });

        // 3️⃣ Загружаем профиль (как в profile-load.js)
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

        // 4️⃣ Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            });
        }

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
