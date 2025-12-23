document.addEventListener('DOMContentLoaded', async () => {

    const newsFeed = document.getElementById('news-feed')
    console.log(newsFeed);

    try {
        const response = await fetch ('http://46.226.123.216:8080/v1/news');

        if (!response.ok) {
            newsFeed.textContent = 'Не удалось загрузить новости';
            return;
        }
        
        const result = await response.json();
        console.log('Новости с сервера:', result);

        const publishedNews = result.filter(news => news.status === 'Опубликовано');

        newsFeed.innerHTML = '';

        if (publishedNews.length === 0) {
            newsFeed.innerHTML = '<p>Новостей пока нет</p>';
            return;
        }

        publishedNews.forEach(news => {
            const article = document.createElement('article');
            article.classList.add('news-item');

            article.innerHTML = `
            ${news.image ? `<img class="news-image" src="http://46.226.123.216:8080/v1/images/news/show/${news.image}" alt="${news.title}">` : ''}
            <span class="news-category--preview">${news.category}</span>
            <h3 class="news-title">${news.title}</h3>
            <p class="news-summary">${news.summary}</p>
            `;

            article.addEventListener('click', () => {
                window.location.href = `news-public.html?id=${news.id}`;
            } )

            newsFeed.appendChild(article);
        });
        
    } catch (error) {
        console.error('Ошибка запроса: ', error);
        newsFeed.textContent = 'Ошибка загрузки новостей';
    }
})