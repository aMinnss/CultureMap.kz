const container = document.getElementById('confirmed-users');
const token = localStorage.getItem('token')
console.log('TOKEN:', token);

async function fetchConfirmedUsers() {
    // const token = localStorage.getItem('token');
    if (!token) {
        console.error('Нет токена в localStorage');
        return;
    }

    const response = await fetch('http://46.226.123.216:8080/v1/users', {
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
        akimat: 'Акимат',
        admin: 'Админ'
    };
    const cityNames = {
        konayev : 'Конаев',
        almaty: 'Алматы'
    };

    if (result && Array.isArray(result)) {
        result.forEach(user => {
            console.log(user)

            const displayRole = roleNames[user.role];
            const displayCity = cityNames[user.city];

            let organizationHTML = '';
            if(user.role !== 'akimat' && user.role !== 'admin') {
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

fetchConfirmedUsers();