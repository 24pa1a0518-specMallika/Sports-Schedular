import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import SessionCard from '../components/SessionCard';
import Toast from '../components/Toast';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchMySessions = async () => {
    setLoading(true);
    try {
      const res = await API.get('/sessions/my');
      setSessions(res.data);
    } catch (err) {
      console.error('Error loading user sessions:', err);
      setToast({ message: 'Failed to load your sessions.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySessions();
  }, []);

  const handleCancelSession = async (sessionId, cancellationReason) => {
    try {
      const res = await API.patch(`/sessions/${sessionId}/cancel`, { cancellationReason });
      setToast({ message: res.data.message || 'Session cancelled successfully.', type: 'success' });
      fetchMySessions();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to cancel session.',
        type: 'error',
      });
    }
  };

  const filteredSessions = sessions.filter((s) => s.status === activeTab);

  return (
    <div>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)' }}>
          My Sessions
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
          Manage games you created or joined.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
          style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
        >
          <Clock size={16} /> Upcoming ({sessions.filter((s) => s.status === 'upcoming').length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline'}`}
          style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
        >
          <CheckCircle2 size={16} /> Completed ({sessions.filter((s) => s.status === 'completed').length})
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`btn ${activeTab === 'cancelled' ? 'btn-primary' : 'btn-outline'}`}
          style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
        >
          <XCircle size={16} /> Cancelled ({sessions.filter((s) => s.status === 'cancelled').length})
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : filteredSessions.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>
            {activeTab === 'upcoming' && "You haven't joined or created any upcoming sessions yet."}
            {activeTab === 'completed' && 'No completed sessions found.'}
            {activeTab === 'cancelled' && 'No cancelled sessions.'}
          </h3>
        </div>
      ) : (
        <div className="sessions-grid">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onCancel={handleCancelSession}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessions;
