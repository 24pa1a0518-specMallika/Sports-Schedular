import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import SessionCard from '../components/SessionCard';
import Toast from '../components/Toast';
import { Search, Filter, Calendar } from 'lucide-react';

const FindSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchSports = async () => {
    try {
      const res = await API.get('/sports');
      setSports(res.data);
    } catch (err) {
      console.error('Failed to load sports:', err);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      let url = '/sessions?status=upcoming';
      if (selectedSport) {
        url += `&sport=${selectedSport}`;
      }
      const res = await API.get(url);
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setToast({ message: 'Error loading sessions.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [selectedSport]);

  const handleJoin = async (sessionId) => {
    try {
      const res = await API.post(`/sessions/${sessionId}/join`);
      setToast({ message: res.data.message || 'You joined the session successfully.', type: 'success' });
      fetchSessions();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to join session.',
        type: 'error',
      });
    }
  };

  const handleCancel = async (sessionId, cancellationReason) => {
    try {
      const res = await API.patch(`/sessions/${sessionId}/cancel`, { cancellationReason });
      setToast({ message: res.data.message || 'Session cancelled successfully.', type: 'success' });
      fetchSessions();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to cancel session.',
        type: 'error',
      });
    }
  };

  return (
    <div>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            Available Sessions
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            Browse active sports matches and join players in your area.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          <Filter size={16} color="var(--color-muted)" />
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
          >
            <option value="">All Sports</option>
            {sports.map((sp) => (
              <option key={sp._id} value={sp._id}>
                {sp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>No upcoming sessions available</h3>
          <p>There are no sessions matching your selected criteria.</p>
        </div>
      ) : (
        <div className="sessions-grid">
          {sessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onJoin={handleJoin}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindSessions;
