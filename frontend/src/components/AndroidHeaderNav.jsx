import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'

export function AndroidStatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="android-status-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{time || '13:30'}</span>
        <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#059669', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
          OFFLINE STORAGE
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12.55a11 11 0 0 1 14.08 0 M1.42 9a16 16 0 0 1 21.16 0 M8.53 16.11a6 6 0 0 1 6.95 0 M12 20h.01" />
        </svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="18" height="11" rx="2" ry="2" />
          <line x1="22" y1="11" x2="22" y2="14" />
          <path d="M6 11h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}

export function AndroidTopBar({ title = 'Livestock App', showBack = false, onBack, rightAction }) {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('livestock_theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('livestock_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    if (navigator.vibrate) navigator.vibrate(20)
  }

  return (
    <div className="android-app-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showBack ? (
          <button
            onClick={onBack || (() => navigate(-1))}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🐄
          </div>
        )}
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: '800', lineHeight: 1.1 }}>{title}</h1>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Livestock Manager</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {rightAction}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '7px',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex'
          }}
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          onClick={() => navigate('/settings')}
          style={{
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '7px',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex'
          }}
          title="Settings & Storage Backup"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

export function AndroidBottomNav() {
  const tabs = [
    {
      to: '/',
      label: 'Home',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      to: '/search',
      label: 'Animals',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8M12 8v8" />
        </svg>
      )
    },
    {
      to: '/new-entry',
      label: 'New Entry',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      )
    },
    {
      to: '/feeding',
      label: 'Feeding',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      )
    },
    {
      to: '/settings',
      label: 'Storage',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      )
    }
  ]

  return (
    <nav className="android-bottom-nav">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(15)
          }}
        >
          <div className="nav-icon-wrapper">
            {tab.icon}
          </div>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
