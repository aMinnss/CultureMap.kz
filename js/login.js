const form = document.querySelector('.login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Форма отправлена')

    const email = emailInput.value.trim(); // значение (строка)
    const password = passwordInput.value.trim();

    console.log(email, password) 

    if(!email || !password) {
        alert('Пожалуйста, заполните все поля!')
        return;  // останавливаем дальнейшую обработку
    }

    const data = { email, password };
    console.log('Данные для отправки:', data);
    
    console.log(data);

    try {   
        console.log('Логин:', data);
    
        // await new Promise(resolve => setTimeout(resolve,1000));
        const response = await fetch('http://46.226.123.216:8080/v1/auth', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        

        const result = await response.json();
        console.log('Полный ответ сервера:', result);

        if(response.ok) {   
            sessionStorage.setItem('userId', result.id);
            sessionStorage.setItem('role', result.role);
            window.location.href = 'confirm.html';
        } else {
            alert('Ошибка: ' + result.message);
        }

        console.log('Успешный вход!');
        
    } catch (error) {
        console.error('Ошибка при отправке ', error);
    }
})