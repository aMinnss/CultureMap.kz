// публичные опросы (главная, выбор языка, прохождения)
// index.html, survey-select.html, survey-ru.html, survey-kz.html

const SURVEYS = [ //Когда появится бэк — этого массива не будет, вместо него будет fetch()
    {
        id: 1,
        slug: 'culture-disctrict', //slug — строка-идентификатор для URL. id ничего не говорит, slug понятен и человеку, и SEO, и URL
        title: 'Культура глазами жителей',
        description: 'Анонимный опрос о культурной жизни районов',
        languages: ['ru', 'kz'], //какие языки доступны
        isActive: true //показываем или нет
    }
];

// что такое INIT? 

document.addEventListener('DOMContentLoaded', () => {  //DOMContentLoaded - JS, подожди, пока HTML полностью загрузится, и только потом работай
    renderSurveyList();
    initSurveyLanguageSelect();
    initSurveyFormSubmit(); // внутри DOMContentLoaded вызываются функции, а сами функции объявляются отдельно
});

/**************************************************
 * 1. Главная страница — список опросов
 * index.html
 **************************************************/

function renderSurveyList() {
    const container = document.getElementById('surveys-feed'); // Контейнер — это HTML-элемент, куда мы будем вставлять карточки. JS не рисует сам — он вставляет элементы ВНУТРЬ HTML
    if (!container) return; // Если элемента НЕТ — просто выходим из функции. Это значит: мы не на index.html, эта функция не нужна, ошибок не будет

    const activeSurveys = SURVEYS.filter(survey => survey.isActive); // filter — это: «оставь только те элементы, которые подходят под условие»
                                                            // survey — это: Каждый объект из массива SURVEYS (SURVEYS — массив)
                                                            // survey => survey.isActive — это: «оставь те опросы, у которых isActive === true»
    container.innerHTML = '';

    activeSurveys.forEach(survey => {
        const card = document.createElement('div');
        card.className = 'card event-card p-25 card-blue-border';

        card.innerHTML = `
            <h3>${survey.title}</h3>
            <p>${survey.description}</p>
            <a 
                href="survey-select.html?survey=${survey.slug}" 
                class="login-btn btn-survey-accent "
            >
                Пройти опрос →
            </a>
        ` // ?survey=${survey.slug} - Это передача данных через URL. Мы говорим: «Открой страницу выбора языка ДЛЯ КОНКРЕТНОГО ОПРОСА»

        container.appendChild(card);
    });
}

/**************************************************
 * 2. Страница выбора языка
 * survey-select.html
 **************************************************/

function initSurveyLanguageSelect() {
    const container = document.getElementById('language-buttons') //language-buttons -  КУДА ДОБАВИТЬ???
    if (!container) return; 

    const params = new URLSearchParams(window.location.search); //Это значит: «Разбери всё, что после ?» (survey-select.html?survey=culture-district)
    const slug = params.get('survey'); // Это значит: «Дай мне значение параметра с именем survey». Почему именно survey? Потому что: ты так назвала в URL, имя параметра = ключ
    if (!slug) return;

    const survey = SURVEYS.find(s => s.slug === slug); // find: «найди ПЕРВЫЙ элемент, который подходит» (find - ищет ОДИН элемент)
    if (!survey) return;                                // s: один объект из массива SURVEYS. 
                                                        // s.slug === slug: «slug объекта равен slug из URL» (сравнение)
    container.innerHTML = '';

    survey.languages.forEach(lang => {
        const link = document.createElement('a');
        link.className = 'btn';

        link.textContent = lang === 'ru' ? 'Русский' : 'Қазақша';
        link.href = `survey-${lang}.html?survey=${survey.slug}`;  // ??? Это динамическое формирование ссылки. Но как понять, что нужно именно так формировать, почему мы так решили сделать и тп?

        container.appendChild(link);
    });
}


/**************************************************
 * 3. Отправка опроса
 * survey-ru.html
 **************************************************/

function initSurveyFormSubmit() {
    const form  = document.querySelector('.survey-wrapper form') // Это: «найди form, который находится ВНУТРИ .survey-wrapper»
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(form); //FormData — это встроенный объект браузера. Он: сам собирает все поля формы. input, radio, checkbox, select
        const answers = {}; // FormData — это не JSON, а серверу нужен объект. Поэтому мы создаём: const answers = {}; Это будет контейнер, куда мы сложим всё аккуратно

        formData.forEach((value, key) => {  //key → name поля, value → значение. Пример: <input name="hobby[]" value="sport">
            if(key.endsWith('[]')) {  // [] означает: у одного вопроса может быть НЕСКОЛЬКО ответов. (key.endsWith('[]') -«если имя поля заканчивается на []»)
                const cleanKey = key.replace('[]', '');  //Было: hobby[]. Стало: hobby. чистим имя, чтобы в JSON было красиво

                if (!answers[cleanKey]) {
                    answers[cleanKey] = [];
                }  // «Если массива для hobby ещё нет — создай его»

                answers[cleanKey].push(value);  // (.push(value) - «добавь значение в список»)
            }   else {
                answers[key] = value; // А ЕСЛИ [] НЕТ - Обычное поле. Результат: answers.age = '25';
            }
        });

        const payload = {  // payload — это: «пакет данных, который мы отправим на сервер» 
            survey: new URLSearchParams(window.location.search).get('survey'),
            language: document.documentElement.lang,
            answers: answers,
            submittedAt: new Date().toISOString()
        };

        console.log('Ответы опроса:', payload); // payload - Это объект, который мы бы отправили на сервер.

        alert('Спасибо за участие! Ваши ответы отправлены.');
        form.reset();  // Очищает форму после отправки.
    });
}