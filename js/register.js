// 1. найти форму регистрации
const form = document.querySelector('.js-register-form');

// 4. собрать данные из полей (HTML-элемент и его значение — это разные вещи)
const emailInput = document.querySelector('#email'); // emailInput - это само поле
const passwordInput = document.querySelector('#password');

if(!form) {
    console.error('Форма не найдена')
}

// 2. повесить обработчик submit
// 3. остановить стандартную отправку формы
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Форма отправлена')

    const email = emailInput.value.trim(); // значение (строка)
    const password = passwordInput.value.trim();

    console.log(email, password) //ПОКА ТОЛЬКО email, password, ТАК КАК НЕТ СВАГГЕРА

    if(!email || !password) {
        alert('Пожалусйта, заполните все поля!')
        return;  // останавливаем дальнейшую обработку
    }

    const data = {
        email: email, // (ключ) → как зовётся свойство в объекте \ (значение) → содержимое переменной, которую мы получили из input
        password: password
    };

    console.log(data);

    try {
        console.log('Отправляем данные: ', data)

        await new Promise(resolve => setTimeout(resolve, 1000));
        // ПОКА НЕТ РЕАЛЬНОГО API

        // const response = await fetch('/register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type' : 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // });

        // const result = await response.json();

        // console.log('Ответ сервера:', result);

        // // здесь мы можем обработать результат
        // if (Response.ok) {
        //     throw new Error('Ошибка регистрации');
        // }

        // emailInput.value = '';
        // passwordInput.value = '';

        console.log('Регистрация прошла успешно!')

    } catch (error) {
        console.error('Ошибка при отправке ', error);
    }
});



async function name(params) {
    
}




// 5. проверить обязательные поля

// 6. подготовить данные для отправки

// 7. отправить данные на сервер
// fetch — это встроенная функция браузера для отправки HTTP-запросов и получения ответа с сервера.

// 8. обработать ответ сервера