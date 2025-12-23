document.addEventListener('DOMContentLoaded', () => {

    const codeForm = document.querySelector('.one-time-code');
    const codeValue = document.querySelector('#code');
    const resendBtn  = document.querySelector('#resendCode');

    const userIdStr = sessionStorage.getItem('userId');
    const role = sessionStorage.getItem('role');

    if (!userIdStr || !role) {
        alert('Сессия истекла. Войдите снова.');
        window.location.href = 'login.html';
        return;
    }

    const userId  = parseInt(userIdStr?.trim(),10);
    if (isNaN(userId )) {
        alert('Некорректный пользователь');
        window.location.href = 'login.html';
        return;
    }

    let timer = null;
    function startResendTimer() {
        let seconds = 60;
        resendBtn.disabled = true;
        resendBtn.textContent = `Отправить повторно (${seconds})`;

        clearInterval(timer);
        
        timer = setInterval(() => {
            seconds--;
            resendBtn.textContent = `Отправить повторно (${seconds})`;

            if (seconds <= 0) {
                clearInterval(timer);
                resendBtn.disabled = false;
                resendBtn.textContent = 'Отправить повторно'
            }
        }, 1000);
    }

    startResendTimer();

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
            id: userId 
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

            localStorage.setItem('token', result.access_token);
            localStorage.setItem('refreshToken', result.refresh_token);
            localStorage.setItem('role', result.role);

            console.log('token', result.access_token);
            console.log(localStorage.getItem('role'));

            const role = result.role;

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

    });

    resendBtn.addEventListener('click', async () => {

        if (!userId) {
            alert('Не найден ID пользователя');
            return;
        }

        try {
            const response = await fetch ('http://46.226.123.216:8080/v1/auth/resend-code', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({id: userId})
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.error || 'Ошибка отправки кода');
                resendBtn.disabled = false;
                result;
            }

            alert(result.message || 'Код отправлен повторно');
            
            startResendTimer();

        } catch (error) {
            console.error(error);
            alert('Ошибка сети');
        }
    });
})