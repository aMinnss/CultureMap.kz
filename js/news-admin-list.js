document.addEventListener('DOMContentLoaded', () => {
    console.log('news-admin-list.js loaded!');

    const publishedList = document.getElementById('published-news-list');
    const draftList = document.getElementById('draft-news-list');

    if(!publishedList || !draftList) {
        console.warn('Контейнеры новостей не найдены');
        return;
    }

    // ======== ЗАГРУЗКА ПУБЛИКОВАННЫХ НОВОСТЕЙ ========
    async function loadPublishedList(container) {
        try {
            const response = await fetch('http://46.226.123.216:8080/v1/news');
            if(!response.ok) {
                container.textContent = 'Не удалось загрузить актуальные новости';
                return;
            }

            const newsList = await response.json();
            if(newsList.length === 0) {
                container.textContent = 'Актуальных новостей пока нет';
                return;
            }

            container.innerHTML = '';

            for (const news of newsList) {
                const card = await createNewsCard(news, false);
                container.appendChild(card);
            }

        } catch (error) {
            console.error('Ошибка загрузки опубликованных новостей:', error);
            container.textContent = 'Ошибка загрузки данных';
        }
    }

    // ======== ЗАГРУЗКА ЧЕРНОВИКОВ ========
    async function loadDraftList(container) {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://46.226.123.216:8080/v1/news/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                container.textContent = 'Не удалось загрузить черновики';
                return;
            }

            const drafts = await response.json();
            if(drafts.length === 0) {
                container.textContent = 'Черновиков пока нет';
                return;
            }

            container.innerHTML = '';

            for (const news of drafts) {
                const card = await createNewsCard(news, true); // isDraft = true
                container.appendChild(card);
            }

        } catch (error) {
            console.error('Ошибка загрузки черновиков:', error);
            container.textContent = 'Ошибка загрузки данных';
        }
    }

    // ======== СОЗДАНИЕ КАРТОЧКИ НОВОСТИ ========
    async function createNewsCard(news, isDraft = false) {
        const card = document.createElement('article');
        card.classList.add('admin-news-card');
        if (isDraft) card.classList.add('admin-news-card-draft');

        // ==== Получаем URL картинки ====
        let imgSrc = './img/nofoto.png';
        try {
            if(news.image) {
                if(isDraft) {
                    // Для черновиков — через fetch + токен
                    imgSrc = await getPendingImage(news.image);
                } else {
                    // Для опубликованных — прямой URL
                    imgSrc = `http://46.226.123.216:8080/v1/images/news/show/${news.image}`;
                }
            }
        } catch (err) {
            console.warn('Не удалось загрузить изображение:', err);
        }

        card.innerHTML = `
            <img class="admin-news-image" src="${imgSrc}" alt="${news.title}">
            <span class="admin-news-category">${news.category}</span>
            <h3 class="admin-news-title">${news.title}</h3>
            <p class="admin-news-summary">${news.summary || ''}</p>
            <p class="admin-news-status">Статус: ${news.status}</p>
            <div class="admin-news-actions">
                <button class="edit-btn" data-id="${news.id}">Редактировать</button>
                <button class="delete-btn" data-id="${news.id}">Удалить</button>
            </div>
        `;

        return card;
    }

    // ======== ПОЛУЧЕНИЕ ИЗОБРАЖЕНИЯ ЧЕРНОВИКА ========
    async function getPendingImage(imageName) {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://46.226.123.216:8080/v1/images/news/pending/show/${imageName}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if(!response.ok) throw new Error('Не удалось получить изображение');
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    // ======== ОБРАБОТЧИКИ КЛИКОВ ========
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const newsId = e.target.dataset.id;
            window.location.href = `news-edit.html?id=${newsId}`;
        }

        if (e.target.classList.contains('delete-btn')) {
            const newsId = e.target.dataset.id;
            const confirmDelete = confirm('Вы уверены, что хотите удалить новость?');
            if(!confirmDelete) return;
            deleteNews(newsId);
        }
    });

    async function deleteNews(newsId) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://46.226.123.216:8080/v1/news/${newsId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if(!response.ok) {
                const result = await response.json();
                alert(result.message || 'Ошибка при удалении новости');
                return;
            }
            alert('Новость успешно удалена');
            loadPublishedList(publishedList);
            loadDraftList(draftList);
        } catch (error) {
            console.error('Ошибка удаления новости:', error);
            alert('Ошибка при обращении к серверу');
        }
    }

    // ======== ЗАГРУЗКА СРАЗУ ========
    loadPublishedList(publishedList);
    loadDraftList(draftList);
});
