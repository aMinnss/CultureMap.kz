document.addEventListener('DOMContentLoaded', () => {
    console.log('news-admin-list.js loaded!')

    const publishedList = document.getElementById('published-news-list');
    const draftList = document.getElementById('draft-news-list');

    if(!publishedList || !draftList) {
        console.warn('Контейнеры новостей не найдены');
        return;
    }

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

            newsList.forEach(news => {
                container.appendChild(createNewsCard(news));
            });

        } catch (error) {
            console.error('Ошибка загрузки опубликованных новостей:', error);
            container.textContent = 'Ошибка загрузки данных';
        }
    }

    async function loadDraftList(container) {
        try {

            const token = localStorage.getItem('token');

            const response = await fetch('http://46.226.123.216:8080/v1/news/pending', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                container.textContent = 'Не удалось загрузить черновики';
                return;
            }

            const drafts = await response.json();
            console.log(drafts)

            if(drafts.length === 0) {
                container.textContent = 'Черновиков пока нет';
                return;
            }

            container.innerHTML = '';

            drafts.forEach(news => {
                container.appendChild(createNewsCard(news, true));
            });
            

        } catch (error) {
            console.error('Ошибка загрузки черновиков:', error);
            container.textContent = 'Ошибка загрузки данных';
        }
    }

    function createNewsCard(news, isDraft = false) {
        const card = document.createElement('article');
        card.classList.add('admin-news-card');
        
        // Если это черновик — добавляем отдельный класс
        if (isDraft) {
            card.classList.add('admin-news-card-draft');
        }

        card.innerHTML = `
        <img 
            class="admin-news-image"
            src="http://46.226.123.216:8080/uploads/${news.image || 'placeholder.png'}"
            alt="${news.title}"
        >

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
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const newsId = e.target.dataset.id;

            window.location.href = `news-edit.html?id=${newsId}`;
        }
    });

    async function deleteNews(newsId) {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://46.226.123.216:8080/v1/news/${newsId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
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

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const newsId = e.target.dataset.id;

            const confirmDelete = confirm('Вы уверены, что хотите удалить новость?');
            if(!confirmDelete) return;

            deleteNews(newsId)
        }
    })


    loadPublishedList(publishedList);
    loadDraftList(draftList);
});