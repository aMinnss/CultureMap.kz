// Админская часть
// survey.html

// publishedList — это HTML-элемент, например: <section id="published-surveys-list"></section>
// Мы хотим вставлять карточки именно туда. Чтобы функция была универсальной, мы называем это: container = куда вставлять

document.addEventListener('DOMContentLoaded', async () => {
    console.log('surveys-admin-list.js loaded');

    const publishedList = document.getElementById('published-surveys-list');
    const draftList = document.getElementById('draft-surveys-list');

    if(!publishedList || !draftList) {
        console.warn('Контейнеры опросов не найдены');
        return;
    }

    // ===== ЗАГРУЗКА =====
    async function loadPublishedSurveys(container) { // писать container, чтобы функция была универсальной. чтобы она не зависела от конкретного HTML (dependency injection)
        try {
            const response = await fetch('http://46.226.123.216:8080/v1/surveys');

            if(!response.ok) {
                container.textContent = 'Не удалось загрузить актуальные опросы';
                return;
            }

            const surveys = await response.json(); //читает тело ответа. превращает JSON в JS-объект. данные внутри него

            if(surveys.length === 0) { //length — количество элементов в массиве
                container.textContent = 'Актуальных опросов пока нет';
                return;
            }

            container.innerHTML = '';

            surveys.forEach(survey => { //survey - переменная
                container.appendChild(createSurveyCard(survey)); // createSurveyCard(survey) Это функция, которая: берёт ОДИН опрос, берёт ОДИН опрос возвращает его    
            }); // appendChild = вставить элемент в HTML. «Добавь ЭТО внутрь container»

        } catch (error) {
            console.error('Ошибка загрузки опросов:', error); // для меня
            container.textContent = 'Ошибка загрузки данных'; // для пользователя
        }
    }

    async function loadDraftSurveys(container) {
        try {
            const token = localStorage.getItem('token'); //обычные актуальных опросы - публичные. черновики - только для админа

            const response = await fetch('http://46.226.123.216:8080/v1/surveys/pending', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok) {
                container.textContent = 'Не удалось загрузить черновики';
                return;
            }

            const drafts = await response.json();

            if(drafts.length === 0) {
                container.textContent = 'Черновиков пока нет';
                return;
            }

            container.innerHTML = '';

            drafts.forEach(draft => {
                container.appendChild(createSurveyCard(draft, true)); //true - ЭТО черновик.
            })
        } catch (error) {
            console.error('Ошибка загрузки черновиков:', error);
            container.textContent = 'Ошибка загрузки данных';
        }
    }

    // ===== КАРТОЧКА =====
    function createSurveyCard(survey, isDraft = false) { // здесь мы пишем именно survey, потому что функция работает С ОДНИМ элементом
        const card = document.createElement('article');
        card.classList.add('admin-survey-card');

        if(isDraft) {
            card.classList.add('admin-survey-card-draft');
        }

        card.innerHTML = `
            <h3 class="admin-survey-title">${survey.title}</h3>
            <p class="admin-survey-description">${survey.description || ''}</p>
            <p class="admin-survey-status">Статус: ${survey.status}</p>

            <div class="admin-survey-actions">
                <button class="edit-survey-btn" data-id="${survey.id}">Редактировать</button>
                <button class="delete-survey-btn" data-id="${surveyId.id}">Удалить</button>
            </div>    
        `;

        return card; // Функция создаёт элемент, но: сама НЕ знает, куда его вставлять.
    }

    //Редактирование
    document.addEventListener('click', (e) => { // (e) — это объект события. он содержит ВСЮ инфу о клике. «Браузер, когда произойдёт клик — дай мне объект с информацией об этом клике»
        if(e.target.classList.contains('edit-survey-btn')) { // e.target - элемент, по которому кликнули
            const surveyId = e.target.dataset.id; // html: <button data-id="5">. js: e.target.dataset.id === '5'. dataset = все data-* атрибуты. id = data-id
            window.location.href = `survey-edit.html?id=${surveyId}`; // «Перейти на страницу редактирования ЭТОГО опроса»
        }
    });

    async function deleteSurvey(surveyId) {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://46.226.123.216:8080/v1/surveys/${surveyId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok) {
                const result = await response.json();
                alert(result.message || 'Ошибка при удалении опроса');
                return;
            }

            alert('Опрос успешно удален');

            loadPublishedSurveys(publishedList); // еще раз здесь объявляем, потому что мы удалили элемент, UI устарел, нужно перезагрузить данные.
            loadDraftSurveys(draftList);
        } catch (error) {
            console.error('Ошибка удаления опроса:', error);
            alert('Ошибка при обращении к серверу');
        }
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-survey-btn')) {
            const surveyId = e.target.dataset.id;

            const confirmDelete = confirm('Вы уверены, что хотите удалить опрос?');
            if(!confirmDelete) return;

            deleteSurvey(surveyId)
        }
    })

    loadPublishedSurveys(publishedList);
    loadDraftSurveys(draftList);
})