import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Toast from '../components/Toast';
import { PlusCircle, Calendar, Clock, MapPin, Users, Award } from 'lucide-react';

const CreateSession = () => {
  const [sports, setSports] = useState([]);
  const [sportId, setSportId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [additionalPlayersRequired, setAdditionalPlayersRequired] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await API.get('/sports');
        setSports(res.data);
        if (res.data.length > 0) {
          setSportId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching sports:', err);
        setToast({ message: 'Error loading sports list.', type: 'error' });
      }
    };

    fetchSports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sportId) {
      setToast({ message: 'Please select a sport.', type: 'error' });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const res = await API.post('/sessions', {
        sportId,
        date,
        time,
        venue,
        additionalPlayersRequired: parseInt(additionalPlayersRequired, 10),
      });

      setToast({ message: 'Session created successfully.', type: 'success' });
      setTimeout(() => {
        navigate('/sessions/my');
      }, 700);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to create session.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="form-card" style={{ maxWidth: '560px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
          Create a Sport Session
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Schedule a match and invite players to join you.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} /> Select Sport
            </label>
            {sports.length === 0 ? (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem' }}>
                No sports have been created by the admin yet. Please ask an admin to add sports.
              </p>
            ) : (
              <select
                className="form-control"
                value={sportId}
                onChange={(e) => setSportId(e.target.value)}
                required
              >
                {sports.map((sp) => (
                  <option key={sp._id} value={sp._id}>
                    {sp.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} /> Date
              </label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} /> Time
              </label>
              <input
                type="time"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} /> Venue Location
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. City Sports Complex - Court 2"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={16} /> Additional Players Required
            </label>
            <input
              type="number"
              min="1"
              max="50"
              className="form-control"
              value={additionalPlayersRequired}
              onChange={(e) => setAdditionalPlayersRequired(e.target.value)}
              required
            />
            <small style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>
              You will automatically be added as the first participant.
            </small>
          </div>

          <button
            type="submit"
            disabled={loading || sports.length === 0}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            <PlusCircle size={18} />
            {loading ? 'Creating Session...' : 'Create Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSession;
