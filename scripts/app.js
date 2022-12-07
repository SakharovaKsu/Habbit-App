// 'use strict'

// let habbits = []; // Массив наших привычек
// const HABBIT_KEY = 'HABBIT_KEY';
// const page = {
//   menu: document.querySelector('.menu__list'),
// };

// // utils
// // функция для получения данных от пользователя
// function loadData() {
//   const habbitString = localStorage.getItem(HABBIT_KEY); // getItem - получить данные по ключу
//   const habbitArray = JSON.parse(habbitString); // Чтобы декодировать JSON-строку

//   // Проверяем что мы получаем именно массив
//   if(Array.isArray(habbitArray)) {
//     habbits = habbitArray;
//   }
// };

// // функция для сохранения данных
// function saveData() {
//   localStorage.getItem(HABBIT_KEY, JSON.stringify(habbits));
// };

// // render
// function renderMenu(activeHabbit) {
//   if(!activeHabbit){
//     return; //Если у нас нет активной привычки, то на этом заканчиваем
//   }
//   for(const habbit of habbits) {
//     const existed = document.querySelector(`[menu-habbit-id = ${habbit.id}]`);
//     if(!existed) {
//       // создание индефекатор, если его нет у элемента
//       const element = document.createElement('button'); // создаем кнопку
//       element.setAttribute('menu-habbit-id', habbit.id); // добавляем атрибут и значение id
//       element.classList.add('menu__item'); // добавляем класс

//       element.addEventListener('click', () => render(habbit.ad));

//       element.innerHTML = `<img src = "./images/${habbit.icon}.svg" alt = "${habbit.name}">`;

//       if(activeHabbit.id === habbit.id) {
//         element.classList.add('menu__item_active');
//       };

//       page.menu.appendChild(element); // добавляем элемент в разметку

//       continue; // прекращает выполнения цикла, в нашем случае не переходит в следующие условие ниже
//     }
//     if(activeHabbit.id === habbit.id) { // если мы нашли элмент и он совпадает с идефектором активным, то
//       existed.classList.add('menu__item_active'); // добавляем класс активного элемента
//     } else {
//       existed.classList.remove('menu__item_active');
//     }
//   }
// }

// function render(activeHabbitId) {
//   const activeHabbit = habbits.find(habbit => habbit.id === activeHabbit); // ищем по всему массиву и если находится, то равен activeHabbit
//   renderMenu(activeHabbit);
// };

// // init
// (() => {
//   loadData();
//   render(habbits[0].id);
// })();


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
	if (!activeHabbit) {
		return;
	}

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
  if (!activeHabbit) {
		return;
	}

  page.header.titleH1.innerText = activeHabbit.name; // Меняем заголовок

  const progress = activeHabbit.days.length / activeHabbit.target > 1 
    ? 100 
    : activeHabbit.days.length / activeHabbit.target * 100; // Считаем прогресс (берем длину дней, делим на цели, если больше 1, то 100%, если меньше, то еще полученное число умножаем на 100, дабы перевести в процент)

  page.header.progressPercent.innerText = progress.toFixed(0) + '%'; // Добавляем полученное значение в прогресс, через toFixed округляем значение до целого значения
  page.header.progressCoverBar.setAttribute('style', `width ${progress}%`); // Меняем ползунок у прогресса
};

function rerender(activeHabbitId) {
	const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
	rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
}

/* init */
(() => {
	loadData();
	rerender(habbits[0].id)
})();