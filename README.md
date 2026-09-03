# Personal Expense Tracker

A full-stack application for tracking personal income and expenses. The backend is powered by Python/Django and the frontend is built with React/Vite.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
*   **Python 3.10+** (For the Django backend)
*   **Node.js & npm** (For the React frontend)

---

## 🛠️ Step 1: Setting up the Backend

The backend runs on Django and handles the API, database, and user authentication.

1. **Open a new terminal** and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. **Activate the Virtual Environment**:
   *   **On Windows:**
       ```bash
       .\venv\Scripts\activate
       ```
   *   **On Mac/Linux:**
       ```bash
       source venv/bin/activate
       ```
   *(You should see `(venv)` appear at the start of your terminal prompt.)*

3. **Install Dependencies** (If you haven't already):
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: If you don't have a requirements.txt, ensure `django`, `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers` are installed).*

4. **Apply Database Migrations** (To ensure your SQLite database is up to date):
   ```bash
   python manage.py migrate
   ```

5. **Start the Backend Server**:
   The React frontend expects the API to be running on port `8001`. Run the server specifically on this port:
   ```bash
   python manage.py runserver 8001
   ```
   *Leave this terminal window running.* The backend is now accessible at `http://127.0.0.1:8001`.

---

## 🎨 Step 2: Setting up the Frontend

The frontend is a modern React application built with Vite.

1. **Open a second, new terminal window** (keep the backend terminal running).

2. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

3. **Install Node Modules**:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open the App**:
   The terminal will output a local URL (usually `http://localhost:5173`). Ctrl+Click (or Cmd+Click) that link to open the Expense Tracker in your browser!

---

## 🚀 How to use the app
1. When you first open the app, you will be redirected to the Login page.
2. Click **Register** to create a new account.
3. Once logged in, you can add new transactions (Income or Expenses) from the **Log Transaction** page.
4. View your financial health, charts, and balances on the **Dashboard**!
