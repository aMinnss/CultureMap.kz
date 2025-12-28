const mockActivities = [
    {
        fio: 'Жангелдина А.К.',
        role: 'Организатор',
        stats: {
            'Входы в систему': 12,
            'AI-анализы': 3,
            'Создано проектов': 2,
            'Обновлено проектов': 5
        }
    },
    {
        fio: 'Ербол Б.Е.',
        role: 'Акимат',
        stats: {
            'Входы в систему': 7,
            'AI-анализы': 1,
            'Создано проектов': 1,
            'Обновлено проектов': 2
        }
    }
];

function renderActivities(activities) {
    const container = document.getElementById('activities');
    container.innerHTML = '';

    activities.forEach(user => {
            const card = document.createElement('div');
            card.style.border = '1px solid #ccc';
            card.style.padding = '10px';
            card.style.marginBottom = '10px';

            const name = document.createElement('h3');
            name.textContent = user.fio;
            card.appendChild(name);

            Object.entries(user.stats).forEach(([title, value]) => {
                const stat = document.createElement('p');
                stat.textContent = `${title}: ${value}`;
                card.appendChild(stat);
            });

            container.appendChild(card);
    });
}

renderActivities(mockActivities);