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

import { useState, useEffect } from 'react';
import { fetchToday, fetchSlots } from './api.js';

const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS_OF_WEEK = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function App() {
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState('');

  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  useEffect(() => {
    let ignore = false;
    setTodayLoading(true);
    setTodayError('');

    fetchToday()
      .then((data) => {
        if (ignore) return;
        const todayObj = { day: data.day, month: data.month, year: data.year };
        setToday(todayObj);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(todayObj);
        setTodayLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        setTodayError(err.message || 'Не удалось загрузить календарь');
        setTodayLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedDay) return;

    let ignore = false;
    const { day, month, year } = selectedDay;

    setSlotsLoading(true);
    setSlotsError('');
    setSelectedTime('');

    fetchSlots(day, month, year)
      .then((data) => {
        if (ignore) return;
        setSlots(data.slots || []);
        setSlotsLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        setSlotsError(err.message || 'Не удалось загрузить слоты');
        setSlotsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedDay]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
    setSelectedTime('');
    setSlots([]);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
    setSelectedTime('');
    setSlots([]);
  };

  const handleNextStep = () => {
    if (!selectedDay || !selectedTime) return;
    const monthName = MONTHS_GENITIVE[selectedDay.month];
    alert(`Вы записаны на ${selectedDay.day} ${monthName} ${selectedDay.year} в ${selectedTime}`);
  };
  const renderMainContent = () => {
    if (todayLoading) {
      return <div className="status-box">Загрузка...</div>;
    }

    if (todayError || !today) {
      return <div className="status-box error">{todayError || 'Ошибка загрузки данных'}</div>;
    }

    const todayDate = new Date(today.year, today.month, today.day);

    let firstDay = new Date(currentYear, currentMonth, 1).getDay() - 1;
    if (firstDay < 0) firstDay = 6;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push({ type: 'empty', key: `e-${i}` });
    }
    for (let d = 1; d <= totalDays; d++) {
      const cellDate = new Date(currentYear, currentMonth, d);
      const isPast = cellDate < todayDate;
      const isSelected =
        Boolean(selectedDay) &&
        selectedDay.day === d &&
        selectedDay.month === currentMonth &&
        selectedDay.year === currentYear;

      cells.push({
        type: 'day',
        key: `d-${d}`,
        day: d,
        isPast,
        isSelected,
      });
    }

    let summaryText = 'Выберите дату и время';
    if (selectedDay) {
      const selectedDateObj = new Date(selectedDay.year, selectedDay.month, selectedDay.day);
      const dayName = DAYS_OF_WEEK[selectedDateObj.getDay()];
      const monthName = MONTHS_GENITIVE[selectedDay.month];
      summaryText = `Выбрано: ${dayName}, ${selectedDay.day} ${monthName} ${selectedDay.year}${selectedTime ? `, ${selectedTime}` : ''}`;
    }

    const isNextDisabled = !selectedDay || !selectedTime;

    return (
      <>
        <div className="grid">
          <section className="card">
            <div className="cal-top">
              <button type="button" onClick={handlePrevMonth}>‹</button>
              <span>{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</span>
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
                    disabled={cell.isPast}
                    onClick={() =>
                      setSelectedDay({ day: cell.day, month: currentMonth, year: currentYear })
                    }
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card">
            <h2 className="subtitle">Доступное время</h2>

            {!selectedDay && <div className="status-box">Сначала выберите дату в календаре</div>}
            {selectedDay && slotsLoading && <div className="status-box">Загрузка слотов...</div>}
            {selectedDay && !slotsLoading && slotsError && <div className="status-box error">{slotsError}</div>}

            {selectedDay && !slotsLoading && !slotsError && (
              <div className="slots">
                {slots.map((slot) => {
                  const isBusy = !slot.available;
                  const isSelected = slot.time === selectedTime;
                  const cls = isBusy ? 'slot busy' : isSelected ? 'slot selected' : 'slot';

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      className={cls}
                      disabled={isBusy}
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                    </button>
                  );
                })}
                </div>
            )}
          </section>
        </div>

        <div className="bottom-bar">
          <div>{summaryText}</div>
          <button
            className="btn-dark"
            type="button"
            disabled={isNextDisabled}
            onClick={handleNextStep}
          >
            Далее
          </button>
        </div>
      </>
    );
  };

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

        {renderMainContent()}
      </main>

      <footer className="footer">
        <div className="container">LOGO — Барбершоп © 2026</div>
      </footer>
    </div>
  );
}