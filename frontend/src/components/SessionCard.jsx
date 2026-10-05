import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SessionCard = ({ session, onJoin, onCancel }) => {
  const { user } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCreator = user && session.createdBy?._id === user.id;
  const isJoined = user && session.players?.some((p) => (p._id || p) === user.id);
  const isFull = session.additionalPlayersRequired <= 0;
  const isUpcoming = session.status === 'upcoming';
  const isCancelled = session.status === 'cancelled';

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;
    setIsSubmitting(true);
    await onCancel(session._id, cancelReason);
    setIsSubmitting(false);
    setShowCancelModal(false);
    setCancelReason('');
  };

  return (
    <div className={`session-card ${session.status}`}>
      <div>
        <div className="session-header">
          <div className="sport-name">{session.sport?.name || 'Sport'}</div>
          <span className={`status-badge ${session.status}`}>{session.status}</span>
        </div>

        <div className="session-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{session.date}</span>
          </div>

          <div className="detail-item">
            <Clock size={16} />
            <span>{session.time}</span>
          </div>

          <div className="detail-item">
            <MapPin size={16} />
            <span>{session.venue}</span>
          </div>

          <div className="detail-item">
            <User size={16} />
            <span>Created by: <strong>{session.createdBy?.name || 'Unknown'}</strong></span>
          </div>

          <div className="detail-item">
            <Users size={16} />
            <span>
              Players Needed: <strong>{session.additionalPlayersRequired}</strong>
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
            Joined Players ({session.players?.length || 0}):
          </div>
          <div className="player-avatars">
            {session.players?.map((player) => (
              <span key={player._id || player} className="player-chip">
                {player.name || 'Player'} {player._id === user?.id ? '(You)' : ''}
              </span>
            ))}
          </div>
        </div>

        {isCancelled && session.cancellationReason && (
          <div className="cancellation-reason-box">
            <strong>Cancellation Reason:</strong>
            <p style={{ marginTop: '0.2rem' }}>{session.cancellationReason}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        {isUpcoming && !isJoined && !isFull && (
          <button onClick={() => onJoin(session._id)} className="btn btn-success">
            <CheckCircle size={18} />
            Join Session
          </button>
        )}

        {isUpcoming && isJoined && (
          <button disabled className="btn btn-outline" style={{ background: '#DCFCE7', color: '#15803D', borderColor: '#86EFAC' }}>
            <CheckCircle size={18} />
            Joined
          </button>
        )}

        {isUpcoming && !isJoined && isFull && (
          <button disabled className="btn btn-outline">
            Session Full
          </button>
        )}

        {isUpcoming && isCreator && onCancel && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="btn btn-danger"
            style={{ marginTop: '0.5rem', padding: '0.45rem' }}
          >
            <AlertCircle size={16} />
            Cancel Session
          </button>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)' }}>Cancel Session</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
              Please state the reason for cancelling this session. All joined players will be able to view this reason.
            </p>
            <form onSubmit={handleCancelSubmit}>
              <div className="form-group">
                <label className="form-label">Reason for Cancellation</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Rainy weather, venue unavailable..."
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="btn btn-outline"
                  style={{ width: '50%' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-danger"
                  style={{ width: '50%' }}
                >
                  {isSubmitting ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionCard;
