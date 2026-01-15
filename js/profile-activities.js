///v1/profile/activities пока не отдаёт реальные счётчики
//mockStats — временная заглушка
//КОГДА БЭК ДОБАВИТ ДАННЫЕ ЗАМЕНИТЬ mockStats!!!

// ====== ROLE MAP ======
const roleMap = {
    admin: 'Супер Админ',
    akimat: 'Акимат',
    organizer: 'Организатор'
};

// ====== MOCK ACTIVITY (временно) ======
const mockStats = {
    'Входы в систему': 0,
    'AI-анализы': 0,
    'Создано проектов': 0,
    'Обновлено проектов': 0
};

// ====== FETCH ACTIVITY ======
async function fetchUserActivity() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Нет токена');
        return;
    }    

    try {
        const response = await fetch('http://46.226.123.216:8080/v1/profile/activities', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.warn('Активность недоступна:', response.status);
            return;
        }

        const user = await response.json();

        const activityData = [
            {
                fio: user.fio,
                role: roleMap[user.role] || user.role,
                stats: mockStats
            }
        ];

        renderActivities(activityData)

    } catch (error) {
        console.error('Ошибка загрузки активности:', error);
    }
}

// ====== RENDER ======
function renderActivities(activities) {
    const container = document.getElementById('activities');
    if (!container) return;

    container.innerHTML = '';

    activities.forEach(user => {
        const card = document.createElement('div');
        card.style.border = '1px solid #ccc';
        card.style.padding = '12px';
        card.style.marginBottom = '12px';

        const name = document.createElement('h3');
        name.textContent = user.fio;
        card.appendChild(name);

        const role = document.createElement('p');
        role.textContent = `Роль: ${user.role}`;
        card.appendChild(role);

        Object.entries(user.stats).forEach(([title, value]) => {
            const stat = document.createElement('p');
            stat.textContent = `${title}: ${value}`;
            card.appendChild(stat);
        });

        container.appendChild(card);
    });
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
    fetchUserActivity();
});