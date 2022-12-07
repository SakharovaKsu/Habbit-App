'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

/* page */
const page = {
	menu: document.querySelector('.menu__list'),
  header: {
    titleH1: document.querySelector('.title-h1'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
    progressPercent: document.querySelector('.progress__percent'),
  },
  content: {
    daysConteiner: document.getElementById('days'),
    nextDay: document.querySelector('.habbit__day')
  }
}

/* utils */
function loadData() {
	const habbitsString = localStorage.getItem(HABBIT_KEY);
	const habbitArray = JSON.parse(habbitsString);
	if (Array.isArray(habbitArray)) {
		habbits = habbitArray;
	}
}

function saveData() {
	localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* render */
function rerenderMenu(activeHabbit) {
	for (const habbit of habbits) {
		const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);

		if (!existed) {
			const element = document.createElement('button');

			element.setAttribute('menu-habbit-id', habbit.id);
			element.classList.add('menu__item');
			element.addEventListener('click', () => rerender(habbit.id));
			element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;

			if (activeHabbit.id === habbit.id) {
				element.classList.add('menu__item_active');
			}

			page.menu.appendChild(element);
			continue;
		}

		if (activeHabbit.id === habbit.id) {
			existed.classList.add('menu__item_active');
		} else {
			existed.classList.remove('menu__item_active');
		}
	}
}

// функция для рендера горизонтельного меню
function rerenderHead(activeHabbit) {
  page.header.titleH1.innerText = activeHabbit.name; // Меняем заголовок

  const progress = activeHabbit.days.length / activeHabbit.target > 1 
    ? 100 
    : activeHabbit.days.length / activeHabbit.target * 100; // Считаем прогресс (берем длину дней, делим на цели, если больше 1, то 100%, если меньше, то еще полученное число умножаем на 100, дабы перевести в процент)

  page.header.progressPercent.innerText = progress.toFixed(0) + '%'; // Добавляем полученное значение в прогресс, через toFixed округляем значение до целого значения
  page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`); // Меняем ползунок у прогресса
};

// функция для рендера контента (комментария)
function rerenderContent(activeHabbit) {
  page.content.daysConteiner.innerHTML = ''; // Обнуляем контейнер

  // Циклом проходимся по дням
  for (const index in activeHabbit.days) {
    const element = document.createElement('div'); // Создаем div
    element.classList.add('habbit');
    element.innerHTML = `<div class="habbit__day">День ${Number(index) + 1}</div>
    <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
    <button class="habbit__delete">
      <img src="./images/delete.svg" alt="Удалить день ${index + 1}">
    </button>`;
    page.content.daysConteiner.appendChild(element); // добавляем элемент
  }

  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`; // Добавляем следующий день
};

function rerender(activeHabbitId) {
	const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);

  if (!activeHabbit) {
		return;
	}

	rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderContent(activeHabbit);
}

/* init */
(() => {
	loadData();
	rerender(habbits[0].id)
})();