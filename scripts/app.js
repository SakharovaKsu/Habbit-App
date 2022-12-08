'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbit;

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
  },
  popup: {
    index: document.getElementById('add-habbit-popup'),
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

// Функция закрытия и открытия попапа
function togglePopup() {
  if(page.popup.index.classList.contains('cover_hidden')) { // Проверяем наличие класса
    page.popup.index.classList.remove('cover_hidden');
  } else {
    page.popup.index.classList.add('cover_hidden');
  }
};

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
    <button class="habbit__delete" onclick="deleteDay(${index})">
      <img src="./images/delete.svg" alt="Удалить день ${index + 1}">
    </button>`;
    page.content.daysConteiner.appendChild(element); // добавляем элемент
  }

  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`; // Добавляем следующий день
};

function rerender(activeHabbitId) {
  globalActiveHabbit = activeHabbitId; // Индефикатор приввычки
	const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);

  if (!activeHabbit) {
		return;
	}

	rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderContent(activeHabbit);
}

// функция для добавления дня
function addDays(event) {
  const form = event.target;
  event.preventDefault(); // отменить действие браузера по умолчанию (Отменяем переход по ссылке)

  const data = new FormData(form); // FormData - объект, представляющий данные HTML формы
  const comment = data.get('comment'); // Получаем комментарий
  form['comment'].classList.remove('error');

  if(!comment) {
    form['comment'].classList.add('error'); // Если нет комментария, красим инпут в красный
  }

  habbits = habbits.map(habbit => {
    if(habbit.id === globalActiveHabbit) { // Если id совпадают, то
      return {
        ...habbit, //берем все поля хаббита и модифицируем
        days: habbit.days.concat([{comment}]) // concat созд. новый массив, в который копирует данные из др. массивов и доп-ые значения
      }
    }
    return habbit;
  });

  form['comment'].value = ''; // Очищаем
  rerender(globalActiveHabbit);
  saveData() // Сохраняем данные (что бы при перезагрузки они сохранились)
};

// функция удаления дня
function deleteDay(index) {
  habbits = habbits.map(habbit => {
    if(habbit.id === globalActiveHabbit) { // Если id совпадают, то
      habbit.days.splice(index, 1) // Удаляем привычку (массив) через splice
      return {
        ... habbit,
        days: habbit.days
      };
    }
    return habbit;
  });

  rerender(globalActiveHabbit);
  saveData()
};

/* init */
(() => {
	loadData();
	rerender(habbits[0].id)
})();