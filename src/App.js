import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import CalendarView from './components/CalendarView';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="app-container">
      <Router>
        {isAuthenticated && (
          <header className="app-header">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="logout-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="logout-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </header>
        )}
        <Routes>
          <Route path="/" element={<LoginForm setAuth={setIsAuthenticated} />} />
          <Route 
            path="/calendar" 
            element={isAuthenticated ? <CalendarView /> : <Navigate to="/" />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;