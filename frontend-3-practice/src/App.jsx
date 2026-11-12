// App — корневой компонент приложения.
//
// ЗАДАНИЕ
// --------
// Перенесите свою страницу выбора даты и времени из нативного JS
// на React. У вас уже есть:
//   - готовая вёрстка (HTML);
//   - готовые стили (CSS);
//   - рабочий код на нативном JS (валидация дат, рендер календаря,
//     обработчики кликов, выбор слота).
//
// Теперь нужно то же самое сделать в React.
//
// ЧТО НУЖНО СДЕЛАТЬ
// ------------------
// 1. Разбить страницу на компоненты. Как именно — решайте сами.
//    Обычно выделяют: шапку, подвал, календарь, сетку слотов,
//    нижнюю панель.
//
// 2. Перенести вёрстку из HTML в JSX. Стили оставить как есть,
//    просто положить их в тот же проект (например, в src/styles/
//    или рядом с компонентами).
//
// 3. Заменить нативное состояние (переменные + прямые манипуляции
//    с DOM) на useState. Какие именно данные должны жить в состоянии —
//    подумайте сами. Скорее всего: текущий месяц, выбранный день,
//    выбранное время, массив слотов.
//
// 4. Рендер календаря и слотов делать через JSX и .map(),
//    без innerHTML и querySelector.
//
// 5. Обработчики кликов — через onClick прямо в JSX,
//    без addEventListener.
//
// 6. Функции для работы с датами, которые вы уже написали
//    на нативном JS (построение сетки календаря, сравнение дат,
//    проверка «не раньше сегодня»), можно переиспользовать.
//    Они чистые — не зависят от React. Создайте файл
//    src/utils/date.js и перенесите их туда.
//
//
// ПОДСКАЗКА
// ---------
// Если что-то не работает или непонятно, как перевести нативный
// код на React — вернитесь к лекции. Там разбирались все
// основные приёмы: состояние, пропсы, рендер списков, колбэки.
//
// Ниже — пустой каркас. Здесь можно начать писать.
import { useState } from 'react';

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_WEEK = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function App() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState('10:00');

  const busyTimes = selectedDate.getDate() % 2 === 0 ? ['11:00', '15:00'] : ['12:00', '16:00'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDay = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  let firstDay = new Date(currentYear, currentMonth, 1).getDay() - 1;
  if (firstDay < 0) firstDay = 6;
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ type: 'empty', key: `e-${i}` });
  }
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(currentYear, currentMonth, d);
    cells.push({
      type: 'day',
      key: `d-${d}`,
      day: d,
      date,
      isPast: date < today,
      isSelected: date.getTime() === selectedDate.getTime(),
    });
  }

  const dayName = DAYS_WEEK[selectedDate.getDay()];
  const dayNum = selectedDate.getDate();
  const monthName = MONTHS_GEN[selectedDate.getMonth()];
  const yearNum = selectedDate.getFullYear();

  return (
    <div className="page">
      <header className="header">
        <div className="container header-inner">
          <div className="logo">LOGO</div>
          <nav className="nav">
            <a href="#">Услуги</a>
            <a href="#">Мастера</a>
            <a href="#">Отзывы</a>
          </nav>
          <button className="btn-dark" type="button">Войти</button>
        </div>
      </header>

      <main className="main container">
        <div className="steps">
          <span className="step">1. Услуга</span>
          <span className="step">2. Мастер</span>
          <span className="step active">3. Дата и время</span>
          <span className="step">4. Контакты</span>
        </div>

        <h1 className="title">Выберите дату и время</h1>

        <div className="grid">
          <section className="card">
            <div className="cal-top">
              <button type="button" onClick={handlePrevMonth}>‹</button>
              <span>{MONTHS[currentMonth]} {currentYear}</span>
              <button type="button" onClick={handleNextMonth}>›</button>
            </div>

            <div className="weekdays">
              {WEEKDAYS_SHORT.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>

            <div className="days">
              {cells.map((cell) => {
                if (cell.type === 'empty') {
                  return <span key={cell.key} className="day empty" />;
                }
                const cls = cell.isPast ? 'day disabled' : cell.isSelected ? 'day selected' : 'day';
                return (
                  <button
                    key={cell.key}
                    type="button"
                    className={cls}
                    disabled={cellisPast}
                    onClick={() => handleSelectDay(cell.date)}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card">
            <h2 className="subtitle">Доступное время</h2>
            <div className="slots">
              {TIMES.map((time) => {
                const isBusy = busyTimes.includes(time);
                const isSelected = time === selectedTime;
                const cls = isBusy ? 'slot busy' : isSelected ? 'slot selected' : 'slot';
                return (
                  <button
                    key={time}
                    type="button"
                    className={cls}
                    disabled={isBusy}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="bottom-bar">
          <div>
            Выбрано: {dayName}, {dayNum} {monthName} {yearNum}{selectedTime ? `, ${selectedTime}` : ''}
          </div>
          <button className="btn-dark" type="button">Далее</button>
        </div>
      </main>

      <footer className="footer">
        <div className="container">LOGO — Барбершоп © 2026</div>
      </footer>
    </div>
  );
}