const container = document.getElementById('pending-users');
const token = localStorage.getItem('token')
console.log('TOKEN:', token);

async function fetchPendingUsers() {
    // const token = localStorage.getItem('token');
    if (!token) {
        console.error('Нет токена в localStorage');
        return;
    }

    try {
        const response = await fetch('http://46.226.123.216:8080/v1/users/pending', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {  // ===== ДОбавляем защиту на статус ответа =====
            console.error('Ошибка запроса к серверу, статус:', response.status);
            container.textContent = 'Не удалось загрузить пользователей';
            return;
        }

        const result = await response.json();
        console.log(result)

        container.innerHTML = '';

        const roleNames = {
            manager: 'Организатор',
            akimat: 'Акимат',
            admin: 'Супер Админ' // на всякий случай
        };
        const cityNames = {
            konayev : 'Конаев',
            almaty: 'Алматы'
        };


        if(result && Array.isArray(result)) {
            result.forEach(user => {
                console.log(user);

                // ===== Проверка, что поля существуют =====
                const displayRole = user.role ? roleNames[user.role] || user.role : 'Неизвестная роль';
                const displayCity = user.city && user.city.name_rus ? user.city.name_rus : 'Город не указан'; //cityNames[user.city];
                const displayDistrict = user.district || 'Район не указан';
                const displayOrganization = user.organization || 'Организация не указана';
                const displayFio = user.fio || 'Имя не указано';
                const displayPhone = user.phone || 'Телефон не указан';
                const displayEmail = user.email || 'Email не указан'
            

                // let organizationHTML = '';
                // if(user.role !== 'akimat') {
                //     organizationHTML = `<div>Организация: ${user.organization}</div>`
                // }
                // // Бэк должен добавить !!!organization!!!

                const userDiv = document.createElement('div');
                userDiv.classList.add('user-card');

                const header = document.createElement('div');
                header.classList.add('user-header');
                header.textContent = `> ${user.fio} | ${displayRole}`;

                const details = document.createElement('div');
                details.classList.add('user-details');
                details.innerHTML = `
                    <div class="city">Город: ${displayCity}</div>
                    <div class="organization">${organizationHTML}</div>
                    <div class="district">Район: ${user.district}</div>
                    <div class="phone">Телефон: ${user.phone}</div>
                    <div class="email">Email: ${user.email}</div>
                `;

                const confirmBtn = document.createElement('button');
                confirmBtn.textContent = 'Подтвердить';
                confirmBtn.classList.add('cotfirm-btn');

                const denyBtn = document.createElement('button');
                denyBtn.textContent = 'Отклонить';
                denyBtn.classList.add('deny-btn');

                confirmBtn.addEventListener('click', () => confirmUser(user.id));
                denyBtn.addEventListener('click', () => denyUser(user.id));

                details.appendChild(confirmBtn);
                details.appendChild(denyBtn);
                

                header.addEventListener('click', () => {
                    if(details.style.display === 'none') {
                        details.style.display = 'block';
                        header.textContent = `v ${user.fio} | ${displayRole}`
                    } else {
                        details.style.display = 'none';
                        header.textContent = `> ${user.fio} | ${displayRole}`
                    }
                });

                userDiv.appendChild(header);
                userDiv.appendChild(details);
                container.appendChild(userDiv);
            });
        } else {
            container.textContent = 'Нет пользователей'
        }
    } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
        container.textContent = 'Ошибка при обращении к серверу';
    }
    
}

fetchPendingUsers();

async function confirmUser(id) {
    const token = localStorage.getItem('token');
    const response = await fetch (`http://46.226.123.216:8080/v1/users/${id}/confirm`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        }
    });

    if(response.ok) {
        alert('Пользователь подтверждён');
        fetchPendingUsers();
    } else {
        alert('Ошибка подтверждения');
    }
}

async function denyUser(id) {
    const token = localStorage.getItem('token');
    const response = await fetch (`http://46.226.123.216:8080/v1/users/${id}/deny`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        }
    });

    if(response.ok) {
        alert('Пользователь отклонен');
        fetchPendingUsers();
    } else {
        alert('Ошибка отклонения');
    }
}