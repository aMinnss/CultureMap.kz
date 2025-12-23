document.addEventListener('DOMContentLoaded', () => {          //JS ждёт, пока HTML загрузится, гарантирует, что .news-create уже существует в DOM
    const newsCreate = document.querySelector('.news-create');
    console.log(newsCreate);

    newsCreate.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Форма отправлена');

        const title = newsCreate.querySelector('#title').value.trim(); // emailInput - это само поле
        const summary = newsCreate.querySelector('#summary').value.trim();
        const content = newsCreate.querySelector('#content').value.trim();
        const author = newsCreate.querySelector('#author').value.trim();
        const category = newsCreate.querySelector('#category').value;
        const status = newsCreate.querySelector('#status').value;
        // const project_id = newsCreate.querySelector('#project_id').value; зачем она нужна то
        const imageInput = newsCreate.querySelector('#image');
        const imageFile = imageInput.files[0];

        if(!title || !summary || !content || !author || !category || !status) {
        alert('Пожалуйста, заполните все обязательные    поля!')
        return;  // останавливаем дальнейшую обработку
    }

        const formData = new FormData(newsCreate);   // автоматически берёт все поля <input>, <textarea>, <select> внутри формы
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', content);
        if(author) formData.append('author', author);
        formData.append('category', category);
        formData.append('status', status);
        // formData.append('project_id', project_id);
        if(imageFile) formData.append('image', imageFile);


        try {
            const token = localStorage.getItem('token')
            console.log('Content:', newsCreate.querySelector('#content').value);
            console.log('FormData entries:');
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }


            const response = await fetch ('http://46.226.123.216:8080/v1/news', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            console.log('Ответ от сервера:', result);

            if(response.status === 401 || result.error?.includes('token is expired')) {
                alert('Сессия истекла. Пожалуйста, войдите снова.')
                return;
            }

            if(response.ok) {
                alert('Новость успешно добавлена!')
            } else {
                alert('Ошибка: ' + result.message || 'Что-то пошло не так')
            }
        } catch (error) {
            console.error('Ошибка при отправке: ', error);
            
        }

    })
})