import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '3rem',
        }}
      >
        <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', marginBottom: '1.5rem' }}>
          <Activity size={40} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          SPORTS SCHEDULER
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Find your game. Find your team. Organize, join, and track sports matches effortlessly.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn btn-primary" style={{ width: 'auto', padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: '9999px' }}>
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ width: 'auto', padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: '9999px', color: 'white', borderColor: '#334155' }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* Feature Highlights */}
      <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-navy)' }}>
        Why Use Sports Scheduler?
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-light-blue)', color: 'var(--color-primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Calendar size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Sports Sessions</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            Easily set up upcoming games for football, basketball, badminton, and more. Set date, time, venue, and required players.
          </p>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Join Other Players</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            Discover active sessions around your area looking for players. One click to sign up and start playing.
          </p>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Manage Your Games</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            Keep track of your upcoming, completed, and cancelled games with transparent cancellation reasons.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
