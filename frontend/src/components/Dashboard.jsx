import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AndroidStatusBar, AndroidTopBar, AndroidBottomNav } from './AndroidHeaderNav'
import localDb from '../utils/localDb'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ animals: 0, records: 0, drafts: 0, avgMilk: 0, totalExpenses: 0 })
  const [recentAnimals, setRecentAnimals] = useState([])
  const [recentRecords, setRecentRecords] = useState([])

  const loadData = () => {
    const s = localDb.getStats()
    setStats(s.stats)
    setRecentAnimals(localDb.getAnimals().slice(0, 5))
    setRecentRecords(s.recent || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <AndroidStatusBar />
      <AndroidTopBar title="Dashboard" showBack={false} />

      <div className="android-content animate-slide-up">
        {/* Welcome Officer Card */}
        <div style={{
          background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
          borderRadius: '24px',
          padding: '20px',
          color: '#ffffff',
          marginBottom: '16px',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-15px', top: '-15px', fontSize: '80px', opacity: 0.15, pointerEvents: 'none' }}>
            🐄
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                Field Officer
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px', marginBottom: '2px' }}>
                Pralhad Patil 👋
              </h2>
              <p style={{ fontSize: '12px', opacity: 0.9 }}>
                Offline Local Phone Storage Ready
              </p>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px'
            }}>
              📋
            </div>
          </div>

          {/* Quick Metrics Bar inside Hero */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>{stats.animals}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Animals</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>{stats.records}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Logs</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>{stats.avgMilk} L</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Avg Milk</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '10px' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
          <div
            onClick={() => navigate('/new-entry?new=true')}
            className="android-card"
            style={{ cursor: 'pointer', borderLeft: '4px solid #059669', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              ➕
            </div>
            <div style={{ fontWeight: '800', fontSize: '14px' }}>Register Animal</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tag, owner & breed</div>
          </div>

          <div
            onClick={() => navigate('/new-entry')}
            className="android-card"
            style={{ cursor: 'pointer', borderLeft: '4px solid #6366f1', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              🥛
            </div>
            <div style={{ fontWeight: '800', fontSize: '14px' }}>Log Production</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Milk, fat, health entry</div>
          </div>

          <div
            onClick={() => navigate('/feeding')}
            className="android-card"
            style={{ cursor: 'pointer', borderLeft: '4px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              🌾
            </div>
            <div style={{ fontWeight: '800', fontSize: '14px' }}>Feed Calculator</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cost & ration schedule</div>
          </div>

          <div
            onClick={() => navigate('/search')}
            className="android-card"
            style={{ cursor: 'pointer', borderLeft: '4px solid #0284c7', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(2,132,199,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              🔍
            </div>
            <div style={{ fontWeight: '800', fontSize: '14px' }}>Tag Search</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Instant animal lookup</div>
          </div>
        </div>

        {/* Registered Animals List */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Registered Animals ({stats.animals})</h3>
          <button
            onClick={() => navigate('/search')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
          >
            View All →
          </button>
        </div>

        {recentAnimals.length === 0 ? (
          <div className="android-card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏷️</div>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>No Animals Registered</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Tap '+ Register Animal' to add your first animal.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {recentAnimals.map(animal => (
              <div
                key={animal.tag_no}
                onClick={() => navigate(`/history/${animal.tag_no}`)}
                className="android-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '14px'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: animal.animal_type === 'Buffalo' ? 'rgba(99,102,241,0.12)' : 'rgba(16,185,129,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  {animal.animal_type === 'Buffalo' ? '🐃' : '🐄'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: '800', fontSize: '15px' }}>{animal.tag_no}</span>
                    <span className="badge badge-emerald">{animal.animal_type}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {animal.owner_name} • {animal.village}
                  </div>
                  {animal.breed && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Breed: {animal.breed} {animal.age ? `• ${animal.age}` : ''}
                    </div>
                  )}
                </div>

                <div style={{ color: 'var(--text-muted)', fontSize: '18px' }}>›</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Quick New Entry */}
      <button
        onClick={() => navigate('/new-entry?new=true')}
        className="android-fab"
        title="Register New Animal"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      <AndroidBottomNav />
    </div>
  )
}
