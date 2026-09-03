# Personal Expense Tracker: Project Report

## 1. Project Overview
The Personal Expense Tracker is a full-stack financial management platform designed to help users track incomes, log expenses, manage debts, and set category-based budgets. Built with a focus on delivering a premium, "dashboard-first" user experience, the application bridges the gap between raw financial data and actionable insights through high-end visualizations and intuitive layouts.

**Tech Stack:**
* **Frontend:** React, Vite, React Router, Recharts (Data Visualization), Lucide React (Iconography).
* **Backend:** Django, Django REST Framework, SQLite (Database).
* **Styling:** Vanilla CSS built on custom CSS variables, responsive grid systems, and a modern design language.

---

## 2. UI/UX Design Philosophy
The application was systematically redesigned from standard list-views into a professional-grade software suite. 

* **Dashboard-First Approach:** Pages like `Budgets`, `Transactions`, and `History` utilize a split-column layout (2/3 main content, 1/3 sticky sidebar) so users never lose context of their overall statistics while performing actions.
* **Component Aesthetics:**
  * Adopted a **Card-Based UI** with subtle shadows (`var(--shadow-sm)`), frosted glass overlays, and rounded corners (`var(--radius-lg)`).
  * Color-coded semantic feedback (Green for Incomes/Success, Red for Expenses/Danger) enforced universally across all modules.
  * Replaced generic dropdowns and tables with interactive, icon-driven "pill-buttons" and scrollable feed cards.
* **Responsive Architecture:** Built using CSS Grid (`responsive-grid-3`, `responsive-grid-2-1`) ensuring the application scales elegantly from mobile phones to ultra-wide desktop monitors without breaking layout integrity.

---

## 3. Core Features & Implementations

### A. Dashboard & Analytics (`Dashboard.jsx`)
The central command hub of the application.
* **Cash Flow Analysis:** A dual-layer Area Chart built with Recharts, dynamically plotting overlapping Income and Expense curves against an exact daily timeline.
* **Interactive Calendar:** A full-screen, Google Calendar-style overlay allowing users to view a 7x5 month grid. It features independent scrolling cells that aggregate daily transaction math dynamically.
* **Mini-Widgets:** Includes a "Recent Activity" feed and a "Top Budgets Health" tracker for instant oversight.

### B. Transaction Logging & History (`LogTransaction.jsx` & `History.jsx`)
* **Rapid Entry:** Features a prominent, centered number input and a grid of interactive category icons for frictionless data entry.
* **Live Feeds:** Both pages replaced standard HTML tables with aesthetic, scrollable stacks of transaction cards.
* **Dynamic Filtering:** The History module calculates "Filtered Income" and "Filtered Expense" instantly as the user types in the search bar or selects different category pills.

### C. Budgeting Engine (`Budget.jsx`)
* Users can set monthly spending limits per category.
* Implemented SVG circular progress rings (`stroke-dashoffset` math) to visually represent percentage spent, turning from primary colors to red when a budget limit is breached.

### D. Debt Tracking (`Debts.jsx`)
* A dedicated ledger for tracking money "Borrowed" vs "Lent".
* Features one-click "Mark as Settled" actions that automatically adjust the user's overarching Net Worth calculation.

---

## 4. Backend Infrastructure
The Django REST framework powers the application through stateless, JWT/Session-authenticated endpoints.

* **Models:** `UserProfile`, `Income`, `Expense`, `Budget`, and `Debt`.
* **API Aggregation:** Instead of forcing the frontend to stitch complex data together, a dedicated `DashboardDataView` calculates `total_income`, `total_expense`, `balance` (accounting for unsettled debts), and `expenses_by_day` utilizing Django's `Sum` and `TruncDay` ORM functions.
* **Dependency Management:** Maintained a strict `requirements.txt` ensuring reliable environment setup.

---

## 5. Development Journey & Evolution
1. **Foundation Phase:** Established the core CRUD (Create, Read, Update, Delete) operations across Django and React. Basic forms and tables were functional but lacked aesthetic polish.
2. **Layout Overhaul:** Migrated from a scrolling vertical page to a fixed-height layout (`100vh`) with an independent scrolling main container. This eliminated awkward full-page scrolling and locked the sidebar navigation in place.
3. **Component Polish:** Replaced basic inputs with custom grid interfaces. Typography was refined globally (`Plus Jakarta Sans`), and spacing was tightened to prevent layouts from feeling "blown out" on large monitors.
4. **Data Visualization:** Integrated Recharts and custom math algorithms to build the Pie Charts, Cash Flow Area charts, and the interactive Calendar Grid.
5. **Final Refinements:** Ensured edge-case handling, such as applying `overflowY: 'auto'` to individual calendar days to prevent heavy-transaction days from breaking the grid layout.

## Conclusion
The Personal Expense Tracker has evolved from a standard data-entry tool into a premium financial analysis suite. By prioritizing real-time data visualization, interactive components, and a cohesive design language, the project successfully delivers an enterprise-quality user experience.
