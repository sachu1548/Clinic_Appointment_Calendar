import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm';
import { useMediaQuery } from 'react-responsive';

export default function CalendarView() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterPatient, setFilterPatient] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
    setEditingIndex(null);
  };

  const addAppointment = (appt) => {
    const updated = [...appointments];
    const newAppt = { ...appt, date: selectedDate.toISOString() };

    if (editingIndex !== null) {
      updated[editingIndex] = newAppt;
    } else {
      updated.push(newAppt);
    }

    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    setShowForm(false);
    setEditingIndex(null);
  };

  const handleDeleteAppointment = (indexToRemove) => {
    const filtered = appointments.filter((_, i) => i !== indexToRemove);
    setAppointments(filtered);
    localStorage.setItem('appointments', JSON.stringify(filtered));
  };

  const handleEditAppointment = (index) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const appointmentsForDay = appointments.filter(
    (a) => {
      const dateStr = new Date(a.date).toISOString().split('T')[0];
      const selectedStr = selectedDate.toISOString().split('T')[0];
      return (
        dateStr === selectedStr &&
        (filterDoctor === '' || a.doctor === filterDoctor) &&
        (filterPatient === '' || a.patient === filterPatient)
      );
    }
  );

  return (
    <div className="calendar-view">
      <div className="calendar-glass-container">
        <div className="calendar-header-container">
          <h2 className="calendar-main-title">
            <span className="calendar-icon">📅</span>
            Appointment Calendar
          </h2>
          
          <div className="filter-section">
            <div className="filter-group">
              <label className="filter-label">Filter by Doctor</label>
              <select 
                value={filterDoctor} 
                onChange={e => setFilterDoctor(e.target.value)} 
                className="filter-select"
              >
                <option value="">All Doctors</option>
                {Array.from(new Set(appointments.map(a => a.doctor))).map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Filter by Patient</label>
              <select 
                value={filterPatient} 
                onChange={e => setFilterPatient(e.target.value)} 
                className="filter-select"
              >
                <option value="">All Patients</option>
                {Array.from(new Set(appointments.map(a => a.patient))).map(p => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="calendar-content">
          {isMobile ? (
            <div className="mobile-date-section">
              <div className="date-picker-container">
                <label className="date-picker-label">Select Date</label>
                <input
                  type="date"
                  value={selectedDate.toISOString().substr(0, 10)}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="date-input-mobile"
                />
              </div>
              <button 
                className="add-appt-btn" 
                onClick={() => { setShowForm(true); setEditingIndex(null); }}
              >
                <span className="btn-icon">+</span> Add Appointment
              </button>
            </div>
          ) : (
            <div className="desktop-calendar-container">
              <Calendar 
                onClickDay={handleDayClick} 
                value={selectedDate}
                className="styled-calendar"
              />
              <button 
                className="floating-add-btn"
                onClick={() => { setShowForm(true); setEditingIndex(null); }}
              >
                +
              </button>
            </div>
          )}

          {showForm && (
            <AppointmentForm
              date={selectedDate}
              onSave={addAppointment}
              initialData={editingIndex !== null ? appointments[editingIndex] : null}
            />
          )}

          <div className="appointments-section">
            <div className="section-header">
              <h3 className="appointments-title">
                Appointments for <span className="highlight-date">{selectedDate.toDateString()}</span>
              </h3>
              <div className="appointment-count-badge">
                {appointmentsForDay.length}
              </div>
            </div>
            
            {appointmentsForDay.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📌</div>
                <p className="empty-state-text">No appointments scheduled</p>
                <p className="empty-state-subtext">Click on a date to add an appointment</p>
              </div>
            ) : (
              <div className="appointments-grid">
                {appointmentsForDay.map((a, i) => (
                  <div key={i} className="appointment-card">
                    <div className="card-header">
                      <span className="time-badge">{a.time}</span>
                      <div className="card-actions">
                        <button className="action-btn edit" onClick={() => handleEditAppointment(i)}>
                          <svg className="action-icon" viewBox="0 0 24 24">
                            <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                          </svg>
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteAppointment(i)}>
                          <svg className="action-icon" viewBox="0 0 24 24">
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <span className="info-label">Patient:</span>
                        <span className="info-value">{a.patient}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Doctor:</span>
                        <span className="info-value doctor-name">{a.doctor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}