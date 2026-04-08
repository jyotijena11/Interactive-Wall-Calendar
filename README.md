# Interactive Wall Calendar Planner

A visually Interactive calendar application that combines a physical wall-calendar look with practical planning tools such as date-range selection, monthly notes, day-specific notes, holiday labels, theme switching, and localStorage persistence.

This project is built as a single-page React app with most of the logic and styling contained in `src/App.jsx`, making it easy to review, demo, and extend.

---

## Demo Highlights

- Wall-calendar inspired UI.
- Scenic hero panel with switchable themes.
- Monthly calendar grid with previous/next month navigation.
- Date-range selection with visual start, end, and in-between states.
- Monthly note section.
- Save monthly note into the currently selected day.
- Day note indicator inside calendar cells.
- Holiday badges for selected fixed dates.
- Selection summary with duration tracking.
- Auto-save with `localStorage`.
- Responsive layout for desktop and mobile screens.

---

## Tech Stack

- **React 19**
- **Vite 7**
- **JavaScript (ES Modules)**
- **Inline CSS + base stylesheet**

---

## Project Structure

```bash
interactive-calendar-react-js/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── dist/
└── README.md
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

---

## Available Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates an optimized production build |
| `npm run preview` | Runs a local preview of the production build |

---

## Core Features

### 1. Wall Calendar Layout
The app is designed in modern wall calendar with two main sections:

- Left side: scenic image panel, active month/year, selection summary, theme actions.
- Right side of calendar frame: interactive monthly calendar grid.
- Sidebar: month notes, selected day note display, selection insights.


### 2. Interactive Month Navigation
Users can move between months using the previous and next buttons.

- `‹` moves to the previous month.
- `›` moves to the next month.
- The month/year header updates automatically.
- A fresh `localStorage` key is used for each month/year combination.

### 3. Date Range Selection
The app supports selecting a date range directly from the calendar.

Behavior:

- First click sets the range start.
- Second click sets the range end.
- If both start and end already exist, a new click starts a fresh selection.
- If the second clicked date is earlier than the first, the dates are swapped logically so the earlier date becomes the start.

Visual states:

- Selected day.
- Range start.
- Range end.
- Dates inside the range.
- Today marker.
- Muted cells for leading/trailing dates from adjacent months.

### 4. Quick Weekend Picker
A convenience action lets the user auto-select the first weekend of the visible month.

- Finds the first Saturday in the current month.
- Sets Saturday as the range start.
- Sets Sunday as the range end.
- Updates the selected day to that Saturday.

### 5. Theme Switching
The scenic header area can rotate through multiple preset visual themes.

Each theme includes:

- title
- subtitle
- background image URL
- accent gradient colors

### 6. Month Notes
Users can maintain a general note for the currently active month.

Typical use cases:

- goals
- reminders
- planning notes
- demo talking points
- monthly priorities

### 7. Save Month Note to a Selected Day
A shortcut button allows the current month note to be copied into the selected day’s note.

This helps users quickly convert a general monthly note into a date-specific note.

### 8. Day Note Indicator
If a note exists for a date, the calendar cell shows a Note badge.

This provides quick visual feedback without opening a modal or separate details page.

### 9. Auto-Save with Local Storage
The app automatically saves monthly state in the browser.

Persisted values include:

- month note
- day notes
- active theme index
- tip visibility state
- selected range start
- selected range end
- selected day

### 10. Responsive Design
The layout adapts to smaller screen sizes.

Responsive behavior includes:

- stacked layout on smaller screens.
- smaller day cells on mobile.
- adjusted spacing and padding.
- single-column stat cards on narrow widths.
- wrapped action buttons for better tap usability.

## Functional Breakdown

This section explains the main functions in `src/App.jsx`.


## Author

Developed by **JP Jena**.

---
