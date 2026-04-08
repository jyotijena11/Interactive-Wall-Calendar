import React, { useEffect, useMemo, useState } from 'react';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const scenicImages = [
  {
    title: 'Alpine Edge',
    subtitle: 'Adventure Collection',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    accent: ['#0ea5e9', '#06b6d4', '#34d399'],
  },
  {
    title: 'Winter Peaks',
    subtitle: 'Cold Light Series',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    accent: ['#6366f1', '#0ea5e9', '#67e8f9'],
  },
  {
    title: 'Golden Summit',
    subtitle: 'Sunrise Trails',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    accent: ['#f59e0b', '#f97316', '#fb7185'],
  },
  {
    title: 'Forest Escape',
    subtitle: 'Nature Journal',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    accent: ['#10b981', '#14b8a6', '#06b6d4'],
  },
];

const holidayMap = {
  '01-01': 'New Year',
  '02-14': "Valentine's Day",
  '10-31': 'Halloween',
  '12-25': 'Christmas',
};

const pad = (n) => String(n).padStart(2, '0');
const formatDateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const formatMdKey = (date) => `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const sameDay = (a, b) => !!a && !!b && a.toDateString() === b.toDateString();

const isBetween = (date, start, end) => {
  if (!start || !end) return false;
  const t = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return t > Math.min(s, e) && t < Math.max(s, e);
};

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

function createCalendarCells(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);
  const cells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  while (cells.length < 42) {
    const nextDay = cells.length - (firstDay + daysInMonth) + 1;
    cells.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false,
    });
  }

  return cells;
}

function App() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [rangeStart, setRangeStart] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [rangeEnd, setRangeEnd] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      Math.min(today.getDate() + 3, getDaysInMonth(today.getFullYear(), today.getMonth()))
    )
  );
  const [selectedDay, setSelectedDay] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [monthNote, setMonthNote] = useState(
    'Prepare recruiter-ready demo notes, polish micro-interactions, and highlight responsive range selection.'
  );
  const [dateNotes, setDateNotes] = useState({});
  const [themeIndex, setThemeIndex] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const [monthNoteSavedMessage, setMonthNoteSavedMessage] = useState('');

  const storageKey = useMemo(
    () => `wall-calendar-${currentYear}-${currentMonth}`,
    [currentMonth, currentYear]
  );

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw);
      setMonthNote(saved.monthNote ?? '');
      setDateNotes(saved.dateNotes ?? {});
      setThemeIndex(saved.themeIndex ?? 0);
      setShowTips(saved.showTips ?? true);
      setRangeStart(saved.rangeStart ? new Date(saved.rangeStart) : null);
      setRangeEnd(saved.rangeEnd ? new Date(saved.rangeEnd) : null);
      setSelectedDay(saved.selectedDay ? new Date(saved.selectedDay) : null);
    } catch (error) {
      console.error('Invalid saved state:', error);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        monthNote,
        dateNotes,
        themeIndex,
        showTips,
        rangeStart: rangeStart ? rangeStart.toISOString() : null,
        rangeEnd: rangeEnd ? rangeEnd.toISOString() : null,
        selectedDay: selectedDay ? selectedDay.toISOString() : null,
      })
    );
  }, [storageKey, monthNote, dateNotes, themeIndex, showTips, rangeStart, rangeEnd, selectedDay]);

  const activeTheme = scenicImages[themeIndex % scenicImages.length];
  const cells = useMemo(
    () => createCalendarCells(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const totalSelectedDays = useMemo(() => {
    if (!rangeStart || !rangeEnd) return rangeStart ? 1 : 0;
    const s = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()).getTime();
    const e = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()).getTime();
    return Math.floor(Math.abs(e - s) / 86400000) + 1;
  }, [rangeStart, rangeEnd]);

  const selectionLabel = useMemo(() => {
    if (!rangeStart && !rangeEnd) return 'Select a date range';
    if (rangeStart && !rangeEnd) return `Starting ${rangeStart.toLocaleDateString()}`;
    if (rangeStart && rangeEnd) return `${rangeStart.toLocaleDateString()} → ${rangeEnd.toLocaleDateString()}`;
    return 'Select a date range';
  }, [rangeStart, rangeEnd]);

  const selectedKey = selectedDay ? formatDateKey(selectedDay) : '';
  const selectedDateNote = selectedKey ? dateNotes[selectedKey] || '' : '';

  const handleDayClick = (date) => {
    const clicked = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDay(clicked);

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(clicked);
      setRangeEnd(null);
      return;
    }

    if (clicked.getTime() < rangeStart.getTime()) {
      setRangeEnd(rangeStart);
      setRangeStart(clicked);
      return;
    }

    setRangeEnd(clicked);
  };

  const updateSelectedDateNote = (value) => {
    if (!selectedDay) return;
    const key = formatDateKey(selectedDay);
    setDateNotes((prev) => ({ ...prev, [key]: value }));
  };

  const saveMonthNoteToSelectedDay = () => {
    if (!selectedDay || !monthNote.trim()) return;

    const key = formatDateKey(selectedDay);
    const cleanedMonthNote = monthNote.trim();

    setDateNotes((prev) => ({
      ...prev,
      [key]: cleanedMonthNote,
    }));

    setMonthNoteSavedMessage(`Saved to ${selectedDay.toLocaleDateString()}.`);
  };

  const moveMonth = (offset) => {
    const next = new Date(currentYear, currentMonth + offset, 1);
    setCurrentMonth(next.getMonth());
    setCurrentYear(next.getFullYear());
  };

  const quickSelectWeekend = () => {
    const firstSaturday = cells.find((cell) => cell.currentMonth && cell.date.getDay() === 6)?.date;
    if (!firstSaturday) return;
    setRangeStart(firstSaturday);
    setRangeEnd(new Date(firstSaturday.getFullYear(), firstSaturday.getMonth(), firstSaturday.getDate() + 1));
    setSelectedDay(firstSaturday);
  };

  const clearSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelectedDay(null);
  };

  const accent = `linear-gradient(135deg, ${activeTheme.accent.join(', ')})`;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Inter, Arial, Helvetica, sans-serif;
          background:
            radial-gradient(circle at top, rgba(59, 130, 246, 0.08), transparent 30%),
            linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
          color: #0f172a;
        }
        button, input, textarea { font: inherit; }
        .app-shell {
          min-height: 100vh;
          padding: 24px;
        }
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }
        .top-card {
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(15,23,42,0.08);
          backdrop-filter: blur(14px);
          margin-bottom: 24px;
        }
        .top-row {
          display: flex;
          gap: 20px;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        .eyebrow {
          color: #0284c7;
          text-transform: uppercase;
          letter-spacing: 0.28em;
          font-size: 12px;
          font-weight: 800;
          margin: 0 0 10px;
        }
        .hero-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          margin: 0;
        }
        .hero-copy {
          margin-top: 14px;
          max-width: 850px;
          color: #475569;
          line-height: 1.7;
        }
        .action-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn {
          border: 0;
          border-radius: 18px;
          padding: 14px 18px;
          font-weight: 700;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary {
          background: #0f172a;
          color: white;
          box-shadow: 0 12px 24px rgba(148,163,184,0.45);
        }
        .btn-light {
          background: white;
          color: #334155;
          border: 1px solid #e2e8f0;
        }
        .btn:disabled {
          opacity: .58;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .btn-danger {
          background: white;
          color: #e11d48;
          border: 1px solid #fecdd3;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 1.45fr .9fr;
          gap: 24px;
        }
        .calendar-wrap, .side-panel {
          background: white;
          border-radius: 34px;
          padding: 24px;
          box-shadow: 0 24px 80px rgba(15,23,42,0.14);
        }
        .calendar-frame {
          overflow: hidden;
          border-radius: 30px;
          border: 1px solid #e2e8f0;
          background: white;
          box-shadow: 0 20px 80px rgba(2,6,23,0.12);
        }
        .rings {
          display: flex;
          justify-content: center;
          gap: 12px;
          background: #f1f5f9;
          padding: 16px;
        }
        .ring {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          border: 2px solid #94a3b8;
          background: white;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);
        }
        .calendar-body {
          display: grid;
          grid-template-columns: 1.05fr .95fr;
        }
        .photo-panel {
          position: relative;
          min-height: 720px;
          overflow: hidden;
        }
        .photo-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .photo-overlay {
          position: absolute;
          inset: 0;
          opacity: .52;
        }
        .photo-dark {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(2,6,23,.82), rgba(15,23,42,.18), transparent);
        }
        .badge {
          position: absolute;
          top: 28px;
          left: 28px;
          display: inline-flex;
          border-radius: 999px;
          background: rgba(255,255,255,0.18);
          padding: 10px 16px;
          color: white;
          text-transform: uppercase;
          letter-spacing: .25em;
          font-size: 11px;
          font-weight: 800;
          backdrop-filter: blur(10px);
        }
        .photo-bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 28px;
          color: white;
        }
        .subtitle {
          text-transform: uppercase;
          letter-spacing: .28em;
          font-size: 11px;
          color: rgba(255,255,255,.85);
          font-weight: 700;
        }
        .month-big {
          margin: 10px 0 4px;
          font-size: clamp(2.4rem, 5vw, 4.4rem);
          font-weight: 900;
          line-height: 1;
        }
        .year-big {
          font-size: 1.25rem;
          color: rgba(255,255,255,.92);
          font-weight: 600;
        }
        .stats {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .stat-card {
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 22px;
          padding: 14px;
          backdrop-filter: blur(10px);
        }
        .stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .18em;
          color: rgba(255,255,255,.75);
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 1.05rem;
          font-weight: 800;
        }
        .calendar-panel {
          padding: 26px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }
        .month-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .month-nav h3 {
          margin: 0;
          font-size: clamp(1.4rem, 2.8vw, 2rem);
          font-weight: 900;
        }
        .nav-buttons {
          display: flex;
          gap: 8px;
        }
        .icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 20px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
        }
        .icon-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(148,163,184,.28);
        }
        .weekday-row, .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
        }
        .weekday {
          text-align: center;
          padding: 10px 4px;
          color: #64748b;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .1em;
        }
        .day {
          min-height: 94px;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          background: white;
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: .18s ease;
          position: relative;
          overflow: hidden;
        }
        .day:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(148,163,184,.25);
        }
        .day.muted {
          opacity: .48;
          background: #f8fafc;
        }
        .day.today {
          border-color: #38bdf8;
        }
        .day.selected {
          border-color: #0f172a;
          box-shadow: 0 10px 24px rgba(15,23,42,.12);
        }
        .day.rangeStart, .day.rangeEnd {
          color: white;
          border-color: transparent;
        }
        .day.rangeStart::before, .day.rangeEnd::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--accent-gradient);
          z-index: 0;
        }
        .day.inRange {
          background: #e0f2fe;
          border-color: #bae6fd;
        }
        .day-top, .day-bottom {
          position: relative;
          z-index: 1;
        }
        .day-number {
          font-size: 15px;
          font-weight: 800;
        }
        .mini-label {
          display: inline-flex;
          align-self: flex-start;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          padding: 5px 8px;
        }
        .mini-label.holiday {
          background: rgba(255,255,255,.22);
          color: inherit;
          border: 1px solid rgba(255,255,255,.24);
        }
        .day:not(.rangeStart):not(.rangeEnd) .mini-label.holiday {
          background: #fff7ed;
          color: #c2410c;
          border: 1px solid #fed7aa;
        }
        .mini-label.note {
          background: #eef2ff;
          color: #4338ca;
        }
        .summary-card {
          margin-top: 18px;
          border-radius: 22px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: grid;
          gap: 12px;
        }
        .summary-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 700;
          color: #334155;
        }
        .panel-block {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 26px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          margin-bottom: 18px;
        }
        .panel-title {
          margin: 0 0 6px;
          font-size: 1.2rem;
          font-weight: 900;
        }
        .panel-copy {
          margin: 0 0 16px;
          color: #64748b;
          line-height: 1.6;
        }
        .input, .textarea {
          width: 100%;
          border-radius: 18px;
          border: 1px solid #cbd5e1;
          background: white;
          padding: 14px 16px;
          outline: none;
          transition: .2s ease;
        }
        .input:focus, .textarea:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 4px rgba(56,189,248,.15);
        }
        .textarea {
          resize: vertical;
          min-height: 130px;
        }
        .tips {
          display: grid;
          gap: 10px;
        }
        .tip {
          border-radius: 18px;
          background: white;
          border: 1px solid #e2e8f0;
          padding: 14px;
          color: #334155;
        }
        .inline-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .helper-text {
          font-size: 13px;
          color: #0284c7;
          font-weight: 700;
        }
        .footer-note {
          font-size: 13px;
          color: #64748b;
          line-height: 1.7;
        }
        @media (max-width: 1180px) {
          .main-grid { grid-template-columns: 1fr; }
          .calendar-body { grid-template-columns: 1fr; }
          .photo-panel { min-height: 420px; }
        }
        @media (max-width: 760px) {
          .app-shell { padding: 14px; }
          .top-card, .calendar-wrap, .side-panel { padding: 16px; border-radius: 24px; }
          .calendar-panel { padding: 16px; }
          .month-nav { align-items: flex-start; flex-direction: column; }
          .day { min-height: 80px; border-radius: 18px; padding: 8px; }
          .weekday-row, .calendar-grid { gap: 6px; }
          .stats { grid-template-columns: 1fr; }
          .action-group { width: 100%; }
          .action-group .btn { flex: 1 1 calc(50% - 12px); }
        }
      `}</style>

      <main className="app-shell">
        <div className="container">
          <div className="top-card">
            <div className="top-row">
              <div>
                <h1 className="hero-title">Wall Calendar Planner</h1>
                <p className="hero-copy">
                  A physical wall-calendar aesthetic, date-range selection,
                  integrated notes, local persistence, holiday markers, theme switching, and responsive design.
                </p>
                <p>Developed By @JP Jena</p>
              </div>
            </div>
          </div>

          <section className="main-grid">
            <div className="calendar-wrap">
              <div className="calendar-frame">
                <div className="calendar-body">
                  <div className="photo-panel">
                    <img className="photo-img" src={activeTheme.url} alt={activeTheme.title} />
                    <div className="photo-overlay" style={{ background: accent }} />
                    <div className="photo-dark" />

                    <div className="badge">
                    <div className="action-group">
                <button className="btn btn-primary" onClick={() => setThemeIndex((prev) => (prev + 1) % scenicImages.length)}>
                  Switch Theme
                </button>
                <button className="btn btn-light" onClick={quickSelectWeekend}>
                  Pick Weekend
                </button>
                <button className="btn btn-danger" onClick={clearSelection}>
                  Clear
                </button>
              </div>
              </div>


                    <div className="photo-bottom">
                      <div className="subtitle">{activeTheme.subtitle}</div>
                      <div className="month-big">{monthNames[currentMonth]}</div>
                      <div className="year-big">{currentYear}</div>

                      <div className="stats">
                        <div className="stat-card">
                          <div className="stat-label">Selected Range</div>
                          <div className="stat-value">{selectionLabel}</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-label">Duration</div>
                          <div className="stat-value">{totalSelectedDays} day{totalSelectedDays !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-label">Active Theme</div>
                          <div className="stat-value">{activeTheme.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="calendar-panel" style={{ '--accent-gradient': accent }}>
                    <div className="month-nav">
                      <h3>{monthNames[currentMonth]} {currentYear}</h3>
                      <div className="nav-buttons">
                        <button className="icon-btn" onClick={() => moveMonth(-1)} aria-label="Previous month">‹</button>
                        <button className="icon-btn" onClick={() => moveMonth(1)} aria-label="Next month">›</button>
                      </div>
                    </div>

                    <div className="weekday-row">
                      {weekdayNames.map((day) => (
                        <div className="weekday" key={day}>{day}</div>
                      ))}
                    </div>

                    <div className="calendar-grid">
                      {cells.map(({ date, currentMonth }, index) => {
                        const isToday = sameDay(date, today);
                        const isSelected = sameDay(date, selectedDay);
                        const isStart = sameDay(date, rangeStart);
                        const isEnd = sameDay(date, rangeEnd);
                        const inRange = isBetween(date, rangeStart, rangeEnd);
                        const holiday = holidayMap[formatMdKey(date)];
                        const noteExists = !!dateNotes[formatDateKey(date)];

                        const classes = [
                          'day',
                          currentMonth ? '' : 'muted',
                          isToday ? 'today' : '',
                          isSelected ? 'selected' : '',
                          isStart ? 'rangeStart' : '',
                          isEnd ? 'rangeEnd' : '',
                          inRange ? 'inRange' : '',
                        ].filter(Boolean).join(' ');

                        return (
                          <button
                            type="button"
                            key={index}
                            className={classes}
                            onClick={() => handleDayClick(date)}
                            title={holiday || 'Select date'}
                          >
                            <div className="day-top">
                              <div className="day-number">{date.getDate()}</div>
                            </div>
                            <div className="day-bottom" style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                              {holiday ? <span className="mini-label holiday">{holiday}</span> : null}
                              {noteExists ? <span className="mini-label note">Note</span> : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="summary-card">
                      <div className="summary-pill">📅 {selectionLabel}</div>
                      <div className="summary-pill">📝 {Object.keys(dateNotes).length} saved date note{Object.keys(dateNotes).length !== 1 ? 's' : ''}</div>
                      <div className="summary-pill">💾 Auto-saves with localStorage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>   

            <aside className="side-panel">
              <div className="panel-block">
                <h2 className="panel-title">Month Notes</h2>
                <p className="panel-copy">
                  Save general notes, reminders, goals for this month.
                </p>

                <textarea
                  className="textarea"
                  placeholder="Write monthly notes..."
                  onChange={(e) => {
                    setMonthNote(e.target.value);
                    if (monthNoteSavedMessage) setMonthNoteSavedMessage('');
                  }}
                />

                <div className="inline-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveMonthNoteToSelectedDay}
                    disabled={!selectedDay || !monthNote.trim()}
                  >
                    Save to Selected Day Note
                  </button>

                  <span className="helper-text">
                    {selectedDay
                      ? monthNoteSavedMessage || `Selected day: ${selectedDay.toLocaleDateString()}`
                      : 'Choose a day from the calendar first.'}
                  </span>
                </div>
              </div>

              <div className="panel-block">
                <h2 className="panel-title">Selected Day Note</h2>

                <p className="panel-copy">
                  {selectedDay
                    ? `Note for ${selectedDay.toLocaleDateString()}`
                    : 'Choose a day from the calendar to attach a note.'}
                </p>

                <textarea
                  className="textarea"
                  value={selectedDateNote}
                  readOnly
                  placeholder="Saved note will appear here..."
                  disabled={!selectedDay}
                />
              </div>

              <div className="panel-block">
                <h2 className="panel-title">Selection Insights</h2>
                <p className="panel-copy">
                  Range, duration, and selected day information.
                </p>

                <div className="tips">
                  <div className="tip">
                    <strong>Range:</strong> {selectionLabel}
                  </div>
                  <div className="tip">
                    <strong>Duration:</strong> {totalSelectedDays} day{totalSelectedDays !== 1 ? 's' : ''}
                  </div>
                  <div className="tip">
                    <strong>Selected day:</strong> {selectedDay ? selectedDay.toDateString() : 'None'}
                  </div>
                </div>
              </div>

              <p className="footer-note">
                Designed and developed with precision using React and Vite,
                this interactive calendar reflects a focus on intuitive user
                experience, clean design, and functional elegance.
              </p>

              <p>Developed By @JP</p>
            </aside>
            
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
