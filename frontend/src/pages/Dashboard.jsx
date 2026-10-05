import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import HeroSlider from '../components/HeroSlider';
import SessionCard from '../components/SessionCard';
import Toast from '../components/Toast';
import { PlusCircle, Search, Calendar, ShieldCheck, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchUpcomingSessions = async () => {
    try {
      const res = await API.get('/sessions?status=upcoming');
      setUpcomingSessions(res.data);
    } catch (err) {
      console.error('Failed to load upcoming sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const handleJoinSession = async (sessionId) => {
    try {
      const res = await API.post(`/sessions/${sessionId}/join`);
      setToast({ message: res.data.message || 'You joined the session successfully.', type: 'success' });
      fetchUpcomingSessions();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to join session.',
        type: 'error',
      });
    }
  };

  const handleCancelSession = async (sessionId, cancellationReason) => {
    try {
      const res = await API.patch(`/sessions/${sessionId}/cancel`, { cancellationReason });
      setToast({ message: res.data.message || 'Session cancelled successfully.', type: 'success' });
      fetchUpcomingSessions();
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

      {/* Hero Slider */}
      <HeroSlider />

      {/* Quick Actions */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-navy)' }}>
          Quick Actions
        </h2>
        <div className="quick-actions-grid">
          <div className="action-card" onClick={() => navigate('/sessions/create')}>
            <div className="action-icon">
              <PlusCircle size={22} />
            </div>
            <div className="action-title">Create Session</div>
          </div>

          <div className="action-card" onClick={() => navigate('/sessions')}>
            <div className="action-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <Search size={22} />
            </div>
            <div className="action-title">Find Sessions</div>
          </div>

          <div className="action-card" onClick={() => navigate('/sessions/my')}>
            <div className="action-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <Calendar size={22} />
            </div>
            <div className="action-title">My Sessions</div>
          </div>

          {isAdmin && (
            <>
              <div className="action-card" onClick={() => navigate('/admin/sports')}>
                <div className="action-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}>
                  <ShieldCheck size={22} />
                </div>
                <div className="action-title">Admin: Manage Sports</div>
              </div>

              <div className="action-card" onClick={() => navigate('/admin/reports')}>
                <div className="action-icon" style={{ background: '#E0F2FE', color: '#0284C7' }}>
                  <BarChart2 size={22} />
                </div>
                <div className="action-title">Admin: Reports</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upcoming Sessions Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)' }}>
            Upcoming Sessions
          </h2>
          <button
            onClick={() => navigate('/sessions')}
            className="btn btn-outline"
            style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : upcomingSessions.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No upcoming sessions available</h3>
            <p>Be the first to create a sports session!</p>
            <button
              onClick={() => navigate('/sessions/create')}
              className="btn btn-primary"
              style={{ width: 'auto', marginTop: '1rem' }}
            >
              Create a Session
            </button>
          </div>
        ) : (
          <div className="sessions-grid">
            {upcomingSessions.slice(0, 6).map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onJoin={handleJoinSession}
                onCancel={handleCancelSession}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
