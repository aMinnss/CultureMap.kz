document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get('id');
    let projectId = null;

    if (!newsId) {
        alert('ID новости не найден');    // НЕ РАБОТАЕТ РЕДАКТИРОВАНИЕ, НЕ ПОНИМАЮ ОШИБКУ
        return;
    }

    const form = document.querySelector('.news-edit');

    const titleInput = document.getElementById('title');
    const summaryInput = document.getElementById('summary');
    const contentInput = document.getElementById('content');
    const authorInput = document.getElementById('author');
    const categoryInput = document.getElementById('category');
    const statusInput = document.getElementById('status');
    const imageInput = document.getElementById('image');
    const currentImage = document.getElementById('current-image'); 

    async function loadNewsForEdit(id) {
        const token = localStorage.getItem('token');
console.log('TOKEN:', token);

        try {
            let response = await fetch(`http://46.226.123.216:8080/v1/news/pending/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                response = await fetch(`http://46.226.123.216:8080/v1/news/${id}`);
            }

            if (!response.ok) {
                alert('Новость не найдена');
                return;
            }

            const news = await response.json();
            console.log('Ответ сервера (news):', news);

            titleInput.value = news.title || '';
            summaryInput.value = news.summary || '';
            contentInput.value = news.content || '';
            authorInput.value = news.author || '';
            categoryInput.value = news.category || '';
            statusInput.value = news.status || 'Черновик';
            // projectId = news.project_id;
            // console.log('projectId:', projectId);


            if (news.image) {
                currentImage.src = currentImage.src = `http://46.226.123.216:8080/v1/images/news/show/${news.image}`;;
                currentImage.style.display = 'block';
            } else {
                currentImage.style.display = 'none';
            }

        } catch (error) {
            console.error('Ошибка загрузки новости:', error);
        }
    }

    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('summary', summaryInput.value);
    formData.append('content', contentInput.value);
    formData.append('author', authorInput.value);
    formData.append('category', categoryInput.value);
    formData.append('status', statusInput.value);

    const imageFile = imageInput.files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://46.226.123.216:8080/v1/news/${newsId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}` // ❗ Content-Type НЕ ставим
        },
        body: formData
        });

        if (response.ok) {
        alert('Новость обновлена');
        window.location.href = 'dashboard-superadmin.html';
        } else {
        const result = await response.json();
        alert('Ошибка при сохранении: ' + (result.message || 'Ошибка'));
        }

    } catch (error) {
        console.error('Ошибка обновления:', error);
        alert('Ошибка при отправке запроса');
    }
    });

    loadNewsForEdit(newsId);
});
