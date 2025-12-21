const container = document.getElementById('pending-users');
const token = localStorage.getItem('token')
console.log('TOKEN:', token);

async function fetchPendingUsers() {
    // const token = localStorage.getItem('token');
    if (!token) {
        console.error('Нет токена в localStorage');
        return;
    }

    const response = await fetch('http://46.226.123.216:8080/v1/users/pending', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();
    console.log(result)

    container.innerHTML = '';

    const roleNames = {
        manager: 'Организатор',
        akimat: 'Акимат'
    };
    const cityNames = {
        konayev : 'Конаев',
        almaty: 'Алматы'
    };


    if(result && Array.isArray(result)) {
        result.forEach(user => {
            console.log(user);
            
            const displayRole = roleNames[user.role];
            const displayCity = cityNames[user.city];

            let organizationHTML = '';
            if(user.role !== 'akimat') {
                organizationHTML = `<div>Организация: ${user.organization}</div>`
            }
            // Бэк должен добавить !!!organization!!!

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