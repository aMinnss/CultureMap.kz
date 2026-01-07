document.addEventListener('DOMContentLoaded', () => {
    console.log('survey-create.js loaded');

    const form = document.getElementById('survey-editor-form');
    const draftBtn = document.querySelector('.draft-btn');
    
    if(!form) {
        console.warn('Форма создания опроса не найдена');
        return;
    }

     // функция для сборки payload / Сбор данных опроса
    function buildPayload(status = 'Опубликовано') {
        // const titleInput = form.querySelector('input[name="survey_title"]'); //Мы ищем поля ТОЛЬКО внутри формы, а не по всей странице
        // const subtitleInput = form.querySelector('input[name="survey_subtitle"]');

        const title = document.getElementById('survey-title').value.trim();
        const subtitle = document.getElementById('survey-subtitle').value.trim();

        if(!title || !subtitle) {
            alert('Пожалуйста, заполните все обязательные поля!');
            return;
        }

        console.log('Заголовок:', title);
        console.log('Подзаголовок:', subtitle);

        const sections = [];
        const sectionElements = document.querySelectorAll('.survey-section');

        //ЧИТАЕМ КАЖДУЮ СЕКЦИЮ
        sectionElements.forEach(sectionEl => { //sectionIndex — просто счётчик
            const sectionTitleInput = sectionEl.querySelector('.section-title');
            const sectionTitle = sectionTitleInput?.value.trim(); //? — защита от ошибок

            if (!sectionTitle) return;

            const questions = []; //объявляем массив вопросов. questions живёт внутри секции
            //ЧИТАЕМ ВОПРОСЫ В СЕКЦИИ
            const questionElement = sectionEl.querySelectorAll('.survey-question');

            questionElement.forEach((questionEl) => {
                const text = questionEl.querySelector('.question-text')?.value.trim(); //текст вопроса
                const type = questionEl.querySelector('.question-type')?.value; //тип (radio / checkbox / text)
                if (!text) return;

                const options = []; //варианты — только если нужны
                //ВАРИАНТЫ ОТВЕТА (ТОЛЬКО ЕСЛИ НЕ text)
                if (type !== 'text') {
                    const optionInputs = questionEl.querySelectorAll('.option-text-input');
                    optionInputs.forEach(optionInput => {
                        const value = optionInput.value.trim();
                        if (value) options.push(value);
                    });
                }

                //СОБИРАЕМ ОБЪЕКТ ВОПРОСА
                questions.push({
                    text,
                    type,
                    options
                });
            });

            //СОБИРАЕМ СЕКЦИЮ
            sections.push({
                title: sectionTitle,
                questions
            });
        });
        
        return { 
            title, 
            subtitle, 
            status, 
            sections 
        };
    }


    // функция для отправки payload на сервер
    async function sendSurvey(payload) {
        if(!payload) return;
        //frontend “разговаривает” с backend - через объект данных, который отправляется в запросе. Этот объект и есть payload.
        //payload — это просто объект, который описывает опрос. Пример (человеческий): «Я отправляю на сервер опрос с таким заголовком, подзаголовком, статусом и структурой»

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://46.226.123.216:8080/v1/surveys', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log('Ответ сервера: ', result);

            if(response.ok) {
                alert(`Опрос успешно ${payload.status === 'Черновик' ? 'сохранен как черновик' : 'создан'}!`);
                window.location.href = 'survey.html';
            } else {
                alert('Ошибка: ' + (result.message || 'Что-то пошло не так'));
            }
        } catch (error) {
            console.error('Ошибка при отправке опроса', error);
            alert('Ошибка при обращении к серверу');
        }
    }

    function createQuestionElement() {
        const div = document.createElement('div');
        div.classList.add('survey-question');

        div.innerHTML = `
            <div class="form-group">
                <label>Текст вопроса</label>
                <input 
                    type="text" 
                    name="q_text_1" 
                    class="q-edit-text question-text" 
                    placeholder="Текст вопроса"
                >
            </div>
            <div class="form-group q-type-select-wrapper">
                <select class="q-type-select question-type">
                    <option value="radio">Один вариант (Radio)</option>
                    <option value="checkbox">Несколько (Checkbox)</option>
                    <option value="text">Текстовый ответ</option>
                </select>
            </div>

            <div class="form-group flex-group align-center gap-8px">
                <div class="options-container">
                    <input 
                        type="text" 
                        name="option_1_1" 
                        class="option-text-input"
                        placeholder="Текст варианта ответа"
                    >
                </div>
                <div class="question-actions">
                    <button type="button" class="add-option-btn add-btn">
                        <span class="symbol-btn">+</span>
                        <span class="btn-text">Добавить вариант</span>
                    </button>
                    <button type="button" class="delete-option-btn delete-btn">
                        <span class="symbol-btn">×</span>
                        <span class="btn-text">Удалить вариант</span>
                    </button>
                </div>
            </div>
        `;
        return div;
    }

    function createSectionElement() {
        const div = document.createElement('div');
        div.classList.add('full-panel', 'survey-section');

        div.innerHTML = `
            <div class="form-group full-panel">
                <label>Название секции</label>
                <input 
                class="section-title"
                type="text"
                name="section_title"
                placeholder="Название секции" 
                required>
            </div>

            <div class="questions-container">
                <div class="survey-question">
                    <div class="form-group">
                        <label>Текст вопроса</label>
                        <input 
                            type="text" 
                            name="q_text_1" 
                            class="q-edit-text question-text" 
                            placeholder="Текст вопроса"
                        >
                    </div>
                    <div class="form-group q-type-select-wrapper">
                        <select class="q-type-select question-type">
                            <option value="radio">Один вариант (Radio)</option>
                            <option value="checkbox">Несколько (Checkbox)</option>
                            <option value="text">Текстовый ответ</option>
                        </select>
                    </div>

                    <div class="form-group flex-group align-center gap-8px">
                        <div class="options-container">
                            <input 
                                type="text" 
                                name="option_1_1" 
                                class="option-text-input"
                                placeholder="Текст варианта ответа"
                            >
                        </div>
                        <div class="question-actions">
                            <button type="button" class="add-option-btn add-btn">
                                <span class="symbol-btn">+</span>
                                <span class="btn-text">Добавить вариант</span>
                            </button>
                            <button type="button" class="delete-option-btn delete-btn">
                                <span class="symbol-btn">×</span>
                                <span class="btn-text">Удалить вариант</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button" class="delete-question-btn btn">
                        Удалить вопрос
                    </button>
                    <button type="button" class="add-question-btn btn">
                        Добавить вопрос в секцию
                    </button>
                </div>
            </div>
        `;
        return div;
    }

    document.addEventListener('click', (event) => {
        // ===== Добавление варианта =====
        if(event.target.closest('.add-option-btn')) { //нажали Добавить вариант
            const questionEl = event.target.closest('.survey-question'); //нашли свой вопрос
            const optionsContainer = questionEl.querySelector('.options-container'); //нашли options-container

            // ===== Добавление варианта =====
            const optionItem = document.createElement('div');
            optionItem.classList.add('option-item');

            // Создаём input
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('option-text-input');
            input.placeholder = 'Текст варианта ответа';

            // Создаём кнопку удаления
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.classList.add('delete-option-btn', 'btn');
            deleteBtn.innerHTML = '<span class="symbol-btn">×</span>';

            // Добавляем input и кнопку в option-item
            optionItem.appendChild(input);
            optionItem.appendChild(deleteBtn);

            // Добавляем option-item в options-container
            optionsContainer.appendChild(optionItem);
        }

        if(event.target.closest('.delete-option-btn')) {
            const optionItem = event.target.closest('.option-item');
            if(optionItem) optionItem.remove();
        }
    })

    document.addEventListener('click', (event) => { //нажали кнопку, создали секцию, вставили в контейнер
        if(event.target.closest('.add-section-btn')) {            
            const container = section.querySelector('.section-container');
            const newSection = createSectionElement();
            container.appendChild(newSection);
        }
    });

    document.addEventListener('click', (event) => { //Никаких индексов, никаких ID, удаляется ровно та секция, где нажали кнопку
        if(event.target.closest('.delete-section-btn')) {            
            const section = event.target.closest('.survey-section');
            section.remove();
        }
    });

    document.addEventListener('click', (event) => {
        if(event.target.closest('.add-question-btn')) {              //«Найди кнопку добавления вопроса (или её потомка)»
            const section = event.target.closest('.survey-section'); //«Пойми, В КАКОЙ секции мы сейчас»
            const container = section.querySelector('.questions-container');
            
            const newQuestion = createQuestionElement();
            container.insertBefore(                                 //«Вставь вопрос ПЕРЕД кнопками»
                newQuestion,
                container.lastElementChild // перед кнопками
            )
        }
    });

    document.addEventListener('click', (event) => {
        if(event.target.closest('.delete-question-btn')) {
            const question = event.target.closest('.survey-question'); //мы удаляем ТОТ, по которому кликнули
            question.remove();
        }
    })

    // ===== обычная отправка (Публикация) ===== / Нажала «Добавить опрос»
    form.addEventListener('submit', async(event) => {
        event.preventDefault();
        console.log('Отправка формы создания опроса (ПУБЛИКАЦИЯ)');
        const payload = buildPayload('Опубликовано');
        sendSurvey(payload);
    });

    // ===== кнопка Черновик =====
    draftBtn.addEventListener('click', () => {
        console.log('Сохранение опроса как черновик');
        const payload = buildPayload('Черновик');
        sendSurvey(payload);
    });
});

// Что делает этот код:
// Считывает заголовок, подзаголовок, секции и вопросы.
// Формирует объект payload.
// Отправляет на сервер через fetch POST-запросом.
// Обрабатывает ответ:
// Если response.ok → опрос создан, переходим на страницу со списком опросов.
// Если ошибка → выводим сообщение.

// ✅ Что изменилось:
// Вынес сборку данных в функцию buildPayload(status).
// Можно передавать 'Опубликовано' или 'Черновик' для статуса опроса.
// Вынес отправку на сервер в функцию sendSurvey(payload).
// Кнопка “Черновик” вызывает эти функции с status: 'Черновик'.
// Форма по умолчанию отправляет с status: 'Опубликовано'.