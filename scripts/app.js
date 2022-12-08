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
    nextDay: document.querySelector('.habbit__day'),
  },
  popup: {
    index: document.getElementById('add-habbit-popup'),
    iconField: document.querySelector('.popup__form input[name="icon"]'),
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

function resetForm(form, fields) {
  for(const field of fields) {
    form[field].value = ''; // Очищаем поле
  }
};

function validateAndGetFormData(form, fields) { // Передаем в качестве параметров форму и поля формы
  const formData = new FormData(form); // FormData - объект, представляющий данные HTML формы
  const res = {}; // Объект полей

  for(const field of fields) { // Проходимся по всем полям формы
    const fieldValue = formData.get(field); // Получаем форму
    form[field].classList.remove('error');

    if(!fieldValue) { // Если не находим, то удаляем класс error
      form[field].classList.add('error');
    }

    res[field] = fieldValue; // Заполняем форму (комментарием)
  }

  // Проверяем валидность формы
  let isValid = true;
  for(const field of fields) {
    if(!res[field]) {
      isValid = false;
    }
  }

  if(!isValid) { // Если форма не воалидна, то
    return; // возвращаем undefined
  }

  return res;
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

  const data = validateAndGetFormData(event.target, ['comment']); // Получаем данные, комментария

  if(!data) {
    return;
  }

  habbits = habbits.map(habbit => {
    if(habbit.id === globalActiveHabbit) { // Если id совпадают, то
      return {
        ...habbit, //берем все поля хаббита и модифицируем
        days: habbit.days.concat([{comment: data.comment}]) // concat созд. новый массив, в который копирует данные из др. массивов и доп-ые значения
      }
    }
    return habbit;
  });

  resetForm(event.target, ['comment']);
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

// функция для работы с иконками привычек в попапе
function setIcon(context, icon) {
  page.popup.iconField.value = icon; // поставили в форму
  const activeIcon = document.querySelector('.icon.icon_active'); // Находим активную иконку
  activeIcon.classList.remove('icon_active'); // у активной иконки удаляем класс
  context.classList.add('icon_active');// и добавляем этот класс на нажатую иконку в попапе
};

// функция для добавления привычек
function addHabbit(event) {
  event.preventDefault();

  const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']); // Получаем данные (имени, иконки, цели(таргет))

  if(!data) {
    return;
  }

  // Ищем id
  const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0);

  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: [],
  })

  resetForm(event.target, ['name', 'target']);
  togglePopup(); // Скрываем попап
  saveData();
  rerender(maxId + 1);
};

/* init */
(() => {
	loadData();
	rerender(habbits[0].id)
})();