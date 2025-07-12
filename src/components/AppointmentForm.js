import patients from '../data/patients.json';
import doctors from '../data/doctors.json';
import { useState, useEffect } from 'react';

export default function AppointmentForm({ date, onSave, initialData }) {
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (initialData) {
      setPatient(initialData.patient);
      setDoctor(initialData.doctor);
      setTime(initialData.time);
    }
  }, [initialData]);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ patient, doctor, time, date });
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <h3 className="form-title">{initialData ? 'Edit Appointment' : 'New Appointment'}</h3>
      
      <div className="form-group">
        <label className="form-label">Patient</label>
        <select
          className="form-select"
          value={patient}
          onChange={e => setPatient(e.target.value)}
          required
        >
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Doctor</label>
        <select
          className="form-select"
          value={doctor}
          onChange={e => setDoctor(e.target.value)}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map(d => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Time</label>
        <input
          type="time"
          className="form-time-input"
          value={time}
          onChange={e => setTime(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="form-submit-btn">
        {initialData ? 'Update Appointment' : 'Save Appointment'}
      </button>
    </form>
  );
}