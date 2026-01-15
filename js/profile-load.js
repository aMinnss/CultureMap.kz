document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Access token not found!');
        return;
    }

    try {
        const response = await fetch('http://46.226.123.216:8080/v1/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
            console.warn('Профиль временно недоступен:', response.status);
            return; // ВАЖНО — не бросаем ошибку
        }

        const data = await response.json();
        console.log('User profile data:', data);

        // --- Common fields ---
        const fullNameElem = document.getElementById('profile-fullname') || document.getElementById('profile-username');
        if (fullNameElem) fullNameElem.textContent = data.fio || 'Не указано';

        const orgElem = document.getElementById('personal-organization') || document.getElementById('profile-organization');
        if (orgElem) orgElem.textContent = data.organization ? `Организация: ${data.organization}` : '';

        const roleMap = {
            admin: 'Супер Админ',
            akimat: 'Акимат',
            organizer: 'Организатор'
        };

        const roleElem = document.getElementById('user-personal') || document.getElementById('profile-role');
        if (roleElem) {
            roleElem.textContent = roleMap[data.role] || data.role || 'Пользователь';
        } // подставляем готовую роль

        // --- Location fields ---
        const districtElem = document.getElementById('personal-district');
        if (districtElem) {
            districtElem.textContent = data.district && data.city 
                ? `Район: ${data.district}, г. ${data.city.name_rus}` 
                : '';
        }

        const cityElem = document.getElementById('profile-city');
        if (cityElem) {
            cityElem.textContent = data.city ? `Город: ${data.city.name_rus}` : '';
        }

        // --- SuperAdmin specific example ---
        const superAdminOrg = document.getElementById('profile-organization');
        if (superAdminOrg && data.role === 'SuperAdmin') {
            superAdminOrg.textContent = `Организация: ${data.organization || 'CultureMap HQ'}`;
        }

    } catch (error) {
        console.error('Failed to load profile:', error);
    }
});
