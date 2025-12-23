document.addEventListener('DOMContentLoaded', async() => {
    
    const titleEl = document.querySelector('.news-title');
    const summaryEl = document.querySelector('.news-summary');
    const authorEl = document.querySelector('.news-author');
    const dateEl = document.querySelector('.news-date');
    const categoryEl = document.querySelector('.news-category--details');
    const imageEl = document.querySelector('.news-image');
    const contenteEl = document.querySelector('.news-content');

    const params = new URLSearchParams(window.location.search);
    const newsId = params.get('id');
    

    if (!newsId) {
        titleEl.textContent = 'Новость не найдена';
        return;
    }

    try {
        const response = await fetch(`http://46.226.123.216:8080/v1/news/${newsId}`)

        if(!response.ok) {
            titleEl.textContent = 'Ошибка загрузки новости';
            return;
        }

        const news = await response.json();
        console.log('Новость:', news);

        titleEl.textContent = news.title;
        summaryEl.textContent = news.summary;
        authorEl.textContent = news.author ? `Автор: ${news.author}` : '';
        categoryEl.textContent = `Категория: ${news.category}`;
        contenteEl.textContent = news.content;

        if(news.created_at) {
            const date = new Date (news.created_at);
            dateEl.textContent = `Дата: ${date.toLocaleDateString()}`;
        }

        if(news.image) {
            imageEl.src = `http://46.226.123.216:8080/v1/images/news/show/${news.image}`;
            imageEl.hidden = false;
        }

    } catch (error) {
        console.error('Ошибка: ', error);
        titleEl.textContent = 'Ошибка загрузки новости';
    }
})