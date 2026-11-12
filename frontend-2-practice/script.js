// JavaScript для страницы выбора даты и времени.
//
// ЗАДАНИЕ
// ========
// Оживить свою свёрстанную страницу. Скорее всего на ней будет работать:
//   1. При открытии страницы выбрать день по умолчанию.
//   2. По клику на день — день становится выбранным,
//      слоты обновляются.
//   3. По клику на слот — время становится выбранным,
//      попадает в нижнюю панель.
//   4. Стрелки «‹» и «›» листают месяцы.
//   5. Дни раньше «сегодня» нельзя выбрать.
//   6. Нижняя панель обновляется при выборе дня и времени.
//
// ГДЕ ЖИВУТ ДАННЫЕ
// ----------------
// Слотов пока нет с сервера. Захардкодьте массив в этом файле.
// Формат слота: { time: "10:00", available: true }.
// «Сегодня» можно взять из new Date() или захардкодить —
// как удобнее для проверки.
//
// СТРУКТУРА КОДА
// --------------
// Разделите код на смысловые части комментариями:
//   1. Данные (слоты, «сегодня»).
//   2. Состояние (месяц, день, время, слоты).
//   3. Чистые функции (для работы с датами).
//   4. Отрисовка и обработчики.
//   5. Инициализация.
//
// ЧИСТЫЕ ФУНКЦИИ
// --------------
// Если понадобится строить сетку календаря — вот функция,
// которую можно использовать. Она не зависит от DOM,
// просто принимает год и месяц и возвращает массив недель.
//
// function buildCalendarGrid(year, month) {
//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);
//   const daysInMonth = lastDay.getDate();
//   const startDayOfWeek = firstDay.getDay();
//   const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
//   const prevMonthLastDay = new Date(year, month, 0).getDate();
//
//   const cells = [];
//
//   for (let i = offset - 1; i >= 0; i--) {
//     cells.push({ day: prevMonthLastDay - i, otherMonth: true });
//   }
//   for (let d = 1; d <= daysInMonth; d++) {
//     cells.push({ day: d, otherMonth: false });
//   }
//   const totalCells = Math.ceil(cells.length / 7) * 7;
//   let nextDay = 1;
//   while (cells.length < totalCells) {
//     cells.push({ day: nextDay, otherMonth: true });
//     nextDay++;
//   }
//
//   const weeks = [];
//   for (let i = 0; i < cells.length; i += 7) {
//     weeks.push(cells.slice(i, i + 7));
//   }
//   return weeks;
// }

// Начните писать код здесь.
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_WEEK = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = new Date(today);
let selectedTime = '10:00';

const monthLabel = document.getElementById('month-label');
const daysBox = document.getElementById('days-box');
const slotsBox = document.getElementById('slots-box');
const resultText = document.getElementById('result-text');

function updateBottomBar() {
  const dayName = DAYS_WEEK[selectedDate.getDay()];
  const day = selectedDate.getDate();
  const month = MONTHS_GEN[selectedDate.getMonth()];
  const year = selectedDate.getFullYear();
  resultText.textContent = `Выбрано: ${dayName}, ${day} ${month} ${year}, ${selectedTime}`;
}

function renderSlots() {
  const busy = selectedDate.getDate() % 2 === 0 ? ['11:00', '15:00'] : ['12:00', '16:00'];
  if (busy.includes(selectedTime)) {
    selectedTime = TIMES.find(t => !busy.includes(t));
  }

  slotsBox.innerHTML = TIMES.map(time => {
    const isBusy = busy.includes(time);
    const isSelected = time === selectedTime;
    const cls = isBusy ? 'slot busy' : (isSelected ? 'slot selected' : 'slot');
    return `<button type="button" class="${cls}" data-time="${time}" ${isBusy ? 'disabled' : ''}>${time}</button>`;
  }).join('');

  slotsBox.querySelectorAll('.slot:not(.busy)').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedTime = btn.dataset.time;
      renderSlots();
      updateBottomBar();
    });
  });
}

function renderCalendar() {
  monthLabel.textContent = `${MONTHS[currentMonth]} ${currentYear}`;
  let firstDay = new Date(currentYear, currentMonth, 1).getDay() - 1;
  if (firstDay < 0) firstDay = 6;
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  let html = '';
  for (let i = 0; i < firstDay; i++) {
    html += `<span class="day empty"></span>`;
  }

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(currentYear, currentMonth, d);
    const isPast = date < today;
    const isSelected = date.getTime() === selectedDate.getTime();
    const cls = isPast ? 'day disabled' : (isSelected ? 'day selected' : 'day');
    html += `<button type="button" class="${cls}" data-day="${d}" ${isPast ? 'disabled' : ''}>${d}</button>`;
  }

  daysBox.innerHTML = html;

  daysBox.querySelectorAll('.day:not(.disabled):not(.empty)').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDate = new Date(currentYear, currentMonth, Number(btn.dataset.day));
      renderCalendar();
      renderSlots();
      updateBottomBar();
    });
  });
}

document.getElementById('prev-btn').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
});

document.getElementById('next-btn').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
});

renderCalendar();
renderSlots();
updateBottomBar();