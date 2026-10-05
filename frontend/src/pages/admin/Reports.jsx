import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Toast from '../../components/Toast';
import { BarChart2, Calendar, Filter, Users, Award, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

const Reports = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = '/reports';
      const params = [];
      if (fromDate) params.push(`fromDate=${fromDate}`);
      if (toDate) params.push(`toDate=${toDate}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await API.get(url);
      setReportData(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setToast({ message: 'Failed to generate reports.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const maxSessions = reportData?.sportPopularity?.reduce(
    (max, item) => (item.sessionCount > max ? item.sessionCount : max),
    1
  );

  return (
    <div>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)' }}>
          Reports & Player Analytics (Admin)
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
          Analyze sport popularity, registered players, and match registrations across custom time ranges.
        </p>
      </div>

      {/* Date Filter Bar */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '180px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} /> From Date
            </label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div style={{ flex: '1', minWidth: '180px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} /> To Date
            </label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0.65rem 1.5rem' }}>
            <Filter size={16} /> Filter Date
          </button>
          
          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={() => { setFromDate(''); setToDate(''); setTimeout(fetchReports, 50); }}
              className="btn btn-outline"
              style={{ width: 'auto', padding: '0.65rem 1rem' }}
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : reportData ? (
        <div>
          {/* Key Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>Total Registered Players</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={28} color="var(--color-primary-blue)" /> {reportData.totalPlayersCount}
              </div>
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>Total Sessions</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.2rem' }}>
                {reportData.totalSessions}
              </div>
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>Upcoming Matches</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-blue)', marginTop: '0.2rem' }}>
                {reportData.upcomingSessions}
              </div>
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>Completed Matches</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-green)', marginTop: '0.2rem' }}>
                {reportData.completedSessions}
              </div>
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>Cancelled Matches</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '0.2rem' }}>
                {reportData.cancelledSessions}
              </div>
            </div>
          </div>

          {/* Sport Popularity Bar Chart */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={20} color="var(--color-primary-blue)" /> Sport Popularity Breakdown
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Number of scheduled games and player participation count by sport.
            </p>

            {reportData.sportPopularity?.length === 0 ? (
              <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '2rem' }}>No sports data available.</p>
            ) : (
              <div className="chart-bar-container">
                {reportData.sportPopularity.map((item) => {
                  const percentage = maxSessions > 0 ? (item.sessionCount / maxSessions) * 100 : 0;
                  return (
                    <div key={item.sportName} className="chart-bar-item">
                      <div className="chart-bar-label">
                        <span>{item.sportName}</span>
                        <span>{item.sessionCount} session{item.sessionCount !== 1 ? 's' : ''} ({item.playerCount} total player slots)</span>
                      </div>
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill"
                          style={{ width: `${Math.max(percentage, 6)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Registered Players & Game Registrations Section */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <UserCheck size={20} color="var(--color-green)" /> Registered Players & Games Overview
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              See all registered users and the sports/games they have joined.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {reportData.registeredPlayersOverview?.map((player) => {
                const isExpanded = expandedUser === player.id;
                return (
                  <div
                    key={player.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      onClick={() => setExpandedUser(isExpanded ? null : player.id)}
                      style={{
                        padding: '1rem 1.25rem',
                        background: isExpanded ? '#F8FAFC' : 'white',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-navy)' }}>
                          {player.name}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>({player.email})</span>
                        <span className={`role-badge ${player.role === 'ADMIN' ? 'admin' : 'player'}`}>{player.role}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-blue)' }}>
                          {player.totalSessionsJoined} Games Registered
                        </div>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--color-border)', background: 'white' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                          Sports Registered For: {player.registeredSports.length > 0 ? player.registeredSports.join(', ') : 'None'}
                        </div>

                        {player.sessions.length === 0 ? (
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>No game registrations yet.</p>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                            {player.sessions.map((sess) => (
                              <div
                                key={sess.id}
                                style={{
                                  padding: '0.75rem',
                                  background: '#F8FAFC',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--color-border)',
                                  fontSize: '0.85rem',
                                }}
                              >
                                <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{sess.sportName || 'Sport'}</div>
                                <div>📅 {sess.date} at {sess.time}</div>
                                <div style={{ color: 'var(--color-muted)' }}>📍 {sess.venue}</div>
                                <span className={`status-badge ${sess.status}`} style={{ marginTop: '0.3rem', display: 'inline-block' }}>
                                  {sess.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Reports;
