document.addEventListener('DOMContentLoaded', () => {
    const codeForm = document.querySelector('.one-time-code');
const codeValue = document.querySelector('#code'); 

const userIdStr = sessionStorage.getItem('userId');
const numericUserId = parseInt(userIdStr?.trim(),10);
const role = sessionStorage.getItem('role');

if (isNaN(numericUserId)) {
    console.error('userId из sessionStorage не является числом!', userIdStr);
    alert('Ошибка: некорректный userId');
    return;
}

codeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Форма отправлена!');

    const code = codeValue.value;

    console.log(code)

    if(!code) {
        alert('Пожалуйста, введите код.')
        return;
    }

    const data = {
        code: code,
        id: numericUserId
    }

    console.log(data)

    try {
        console.log('Отправляем данные: ', data)

        const response = await fetch('http://46.226.123.216:8080/v1/auth', {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(data)
        })
        console.log('Статус:', response.status);

        const result = await response.json();

        console.log('Ответ сервера:', result);

        if(response.ok) {
            if (role === 'manager') {
                window.location.href = 'dashboard-organizer.html'
            } else if (role === 'akimat') {
                window.location.href = 'dashboard-akimat.html'
            } else if (role === 'admin') {
                window.location.href = 'dashboard-superadmin.html'
            } else {
                alert(result.message)
            } 
        }
    } catch (error) {
        console.error('Ошибка при отправке ', error);
    }

})
})