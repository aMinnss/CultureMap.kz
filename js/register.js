// 1. найти форму регистрации
const form = document.querySelector('.js-register-form');

// 4. собрать данные из полей (HTML-элемент и его значение — это разные вещи)
const citylInput = document.querySelector('#city'); // emailInput - это само поле
const districtInput = document.querySelector('#district');
const emailInput = document.querySelector('#email');
const fioInput = document.querySelector('#fio');
const organizationlInput = document.querySelector('#organization');
const passwordInput = document.querySelector('#password');
const phoneInput = document.querySelector('#phone');
const roledInput = document.querySelector('#role');

if(!form) {
    console.error('Форма не найдена')
}

// 2. повесить обработчик submit
// 3. остановить стандартную отправку формы
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Форма отправлена')

    const city = citylInput.value.trim();
    const district = districtInput.value.trim();
    const email = emailInput.value.trim();
    const fio = fioInput.value.trim();
    const organization = organizationlInput.value.trim();
    const password = passwordInput.value.trim();
    const phone = phoneInput.value.trim();
    const role = roledInput.value.trim();

    console.log(city, district, email, fio, organization, password, phone, role)

    if(!city || !email || !fio || !organization || !password || !phone || !role) {
        alert('Пожалуйста, заполните все поля!')
        return;  // останавливаем дальнейшую обработку
    }

    if (role === 'manager' && !district) {
        alert('Для роли "Организатор" необходимо указать район');
        return;
    }

    const data = {
        city: city, // (ключ) → как зовётся свойство в объекте \ (значение) → содержимое переменной, которую мы получили из input
        district: district,
        email: email,
        fio: fio,
        organization: organization,
        password: password,
        phone: phone,
        role: role,
    };

    console.log(data);

    try {
        console.log('Отправляем данные: ', data)

        // await new Promise(resolve => setTimeout(resolve, 1000));
        // ПОКА НЕТ РЕАЛЬНОГО API

        const response = await fetch('http://46.226.123.216:8080/v1/auth', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log('Ответ сервера:', result);

        // здесь мы можем обработать результат
        if (response.ok) {
            alert('Ваша регистрация прошла успешно! Пожалуйста, ожидайте подтверждения админа');
            window.location.href = 'index.html'
            return
        } else {
            throw new Error(result.error || 'Ошибка регистрации');
        } 

        citylInput.value = '';
        districtInput.value = '';
        emailInput.value = '';
        fioInput.value = '';
        organizationlInput.value = '';
        passwordInput.value = '';
        phoneInput.value = '';
        roledInput.value = '';

    } catch (error) {
        console.error('Ошибка при отправке ', error);
    }
});

// 5. проверить обязательные поля

// 6. подготовить данные для отправки

// 7. отправить данные на сервер
// fetch — это встроенная функция браузера для отправки HTTP-запросов и получения ответа с сервера.

// 8. обработать ответ сервера