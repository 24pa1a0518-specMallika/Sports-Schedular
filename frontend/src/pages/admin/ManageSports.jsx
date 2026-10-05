import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Toast from '../../components/Toast';
import { PlusCircle, Award, User, Calendar, ExternalLink } from 'lucide-react';

const ManageSports = () => {
  const [sports, setSports] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const fetchSports = async () => {
    try {
      const res = await API.get('/sports');
      setSports(res.data);
    } catch (err) {
      console.error('Error fetching sports:', err);
      setToast({ message: 'Failed to load sports list.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const handleCreateSport = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setToast(null);

    try {
      const res = await API.post('/sports', { name: name.trim() });
      setToast({ message: 'Sport created successfully.', type: 'success' });
      setName('');
      fetchSports();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to create sport.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSportClick = (sportId) => {
    navigate(`/sessions?sport=${sportId}`);
  };

  return (
    <div>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)' }}>
          Manage Sports (Admin)
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
          Add sports or click any sport card to view its scheduled sessions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Create Sport Form */}
        <div style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-navy)' }}>
            Create New Sport
          </h2>

          <form onSubmit={handleCreateSport}>
            <div className="form-group">
              <label className="form-label">Sport Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Badminton, Football, Cricket..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <PlusCircle size={18} />
              {submitting ? 'Creating...' : 'Create Sport'}
            </button>
          </form>
        </div>

        {/* Existing Sports List */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-navy)' }}>
            Available Sports ({sports.length})
          </h2>

          {loading ? (
            <div className="spinner"></div>
          ) : sports.length === 0 ? (
            <div className="empty-state">
              <Award size={48} />
              <h3>No sports created yet</h3>
              <p>Use the form on the left to add your first sport.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {sports.map((sp) => (
                <div
                  key={sp._id}
                  onClick={() => handleSportClick(sp._id)}
                  style={{
                    background: 'white',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-blue)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'var(--color-light-blue)', color: 'var(--color-primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-navy)' }}>
                        {sp.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                        Created by: {sp.createdBy?.name || 'Admin'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary-blue)', fontSize: '0.85rem', fontWeight: 600 }}>
                    View Sessions <ExternalLink size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSports;
