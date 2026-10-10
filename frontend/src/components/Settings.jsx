import React, { useState, useEffect } from 'react'
import { AndroidStatusBar, AndroidTopBar, AndroidBottomNav } from './AndroidHeaderNav'
import localDb from '../utils/localDb'

export default function Settings() {
  const [stats, setStats] = useState({ animals: 0, records: 0, drafts: 0 })
  const [importText, setImportText] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [storageSize, setStorageSize] = useState('0 KB')

  const refreshData = () => {
    const s = localDb.getStats()
    setStats(s.stats)

    // Calculate approx local storage size
    const raw = (localStorage.getItem('livestock_animals_v2') || '') + (localStorage.getItem('livestock_records_v2') || '')
    const bytes = new Blob([raw]).size
    setStorageSize(`${(bytes / 1024).toFixed(1)} KB`)
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleExport = () => {
    const json = localDb.exportBackupJson()
    navigator.clipboard.writeText(json)
    setMessage({ text: 'Full Database Backup copied to clipboard! ✓', type: 'success' })
    if (navigator.vibrate) navigator.vibrate([30, 50, 30])
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const handleDownload = () => {
    const json = localDb.exportBackupJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `livestock_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage({ text: 'Backup file downloaded to your phone! 📥', type: 'success' })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const handleImport = () => {
    if (!importText.trim()) {
      setMessage({ text: 'Please paste valid JSON backup content.', type: 'error' })
      return
    }
    const res = localDb.importBackupJson(importText.trim())
    if (res.success) {
      setMessage({ text: `Successfully restored ${res.count} records into Phone Storage! ✓`, type: 'success' })
      setImportText('')
      refreshData()
    } else {
      setMessage({ text: `Import failed: ${res.error}`, type: 'error' })
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset local phone database to initial sample dataset?')) {
      localDb.resetToDefault()
      refreshData()
      setMessage({ text: 'Database reset to default sample records! ✓', type: 'success' })
    }
  }

  return (
    <div>
      <AndroidStatusBar />
      <AndroidTopBar title="Storage & Settings" showBack={false} />

      <div className="android-content animate-slide-up">
        {/* Toast Alert */}
        {message.text && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '600',
            background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
          }}>
            {message.text}
          </div>
        )}

        {/* Local Storage Card */}
        <div className="android-card" style={{ marginBottom: '16px', background: 'linear-gradient(135deg, rgba(5,150,105,0.06) 0%, rgba(99,102,241,0.06) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>📱</span>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800' }}>Phone Local Storage</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>100% Offline • Zero Server Dependency</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', margin: '14px 0' }}>
            <div style={{ background: 'var(--surface)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>{stats.animals}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Animals</div>
            </div>
            <div style={{ background: 'var(--surface)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1' }}>{stats.records}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Records</div>
            </div>
            <div style={{ background: 'var(--surface)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b' }}>{storageSize}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Storage Used</div>
            </div>
          </div>
        </div>

        {/* Backup & Export */}
        <div className="android-card" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '6px' }}>Backup & Export Data</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Safely backup all registered livestock records to your phone storage or share with other officers.
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleExport} className="android-btn-primary" style={{ flex: 1, padding: '10px', fontSize: '13px' }}>
              📋 Copy JSON
            </button>
            <button onClick={handleDownload} className="android-btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '13px' }}>
              📥 Download File
            </button>
          </div>
        </div>

        {/* Restore & Import */}
        <div className="android-card" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '6px' }}>Restore Database from Backup</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Paste a backup JSON below to restore records on this device.
          </p>

          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder='Paste JSON backup code here (e.g. {"animals": [...]})'
            style={{
              width: '100%',
              height: '80px',
              padding: '10px',
              borderRadius: '10px',
              border: '1.5px solid var(--border)',
              background: 'var(--surface-subtle)',
              color: 'var(--text-main)',
              fontSize: '12px',
              fontFamily: 'monospace',
              resize: 'none',
              marginBottom: '10px'
            }}
          />

          <button onClick={handleImport} className="android-btn-secondary" style={{ width: '100%', fontSize: '13px' }}>
            📤 Restore Backup to Device
          </button>
        </div>

        {/* Reset Database */}
        <div className="android-card" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#dc2626', marginBottom: '6px' }}>Reset Database</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Reset phone storage back to the initial sample animals and feeding records.
          </p>

          <button
            onClick={handleReset}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #fecaca',
              background: '#fef2f2',
              color: '#dc2626',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            🔄 Reset to Default Sample Data
          </button>
        </div>

        {/* App Info */}
        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px' }}>Livestock Android App v1.0.0</div>
          <div>Field Officer Edition • Offline SQLite Storage</div>
        </div>
      </div>

      <AndroidBottomNav />
    </div>
  )
}
