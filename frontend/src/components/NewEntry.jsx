import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AndroidStatusBar, AndroidTopBar, AndroidBottomNav } from './AndroidHeaderNav'
import localDb from '../utils/localDb'

export default function NewEntry() {
  const [searchParams] = useSearchParams()
  const initialTag = searchParams.get('tag') || ''
  const [tagNo, setTagNo] = useState(initialTag)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleContinue = (e) => {
    e?.preventDefault()
    const tag = tagNo.trim().toUpperCase()
    if (!tag) {
      setError('Please enter a valid Tag Number')
      return
    }

    const existing = localDb.getAnimalByTag(tag)
    if (existing) {
      // Animal exists, navigate directly to add monthly record or view history
      navigate(`/form/${tag}?new=false`)
    } else {
      // Animal does not exist yet, navigate to register new animal form
      navigate(`/form/${tag}?new=true`)
    }
  }

  return (
    <div>
      <AndroidStatusBar />
      <AndroidTopBar title="New Entry & Register" showBack={false} />

      <div className="android-content animate-slide-up">
        {/* Banner */}
        <div className="android-card" style={{ textAlign: 'center', padding: '24px 16px', marginBottom: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            background: 'rgba(16,185,129,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 12px'
          }}>
            🏷️
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>
            Animal Ear Tag Number
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Enter or scan ear tag to register or log monthly production records.
          </p>
        </div>

        {/* Input Form */}
        <div className="android-card" style={{ marginBottom: '16px' }}>
          <form onSubmit={handleContinue}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
              TAG NUMBER
            </label>
            <input
              type="text"
              value={tagNo}
              onChange={e => {
                setTagNo(e.target.value.toUpperCase())
                setError('')
              }}
              placeholder="e.g. TAG-1004"
              className="android-input"
              style={{
                fontSize: '18px',
                fontWeight: '800',
                letterSpacing: '1px',
                textAlign: 'center',
                textTransform: 'uppercase',
                padding: '14px',
                marginBottom: '12px'
              }}
              autoFocus
            />

            {error && (
              <div style={{
                color: '#dc2626',
                background: '#fef2f2',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                marginBottom: '12px',
                fontWeight: '600'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!tagNo.trim()}
              className="android-btn-primary"
              style={{ opacity: !tagNo.trim() ? 0.6 : 1 }}
            >
              Continue to Form →
            </button>
          </form>
        </div>

        {/* Quick Suggestions / Existing Animals */}
        <div className="android-card">
          <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '10px' }}>
            Recently Added Animals
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {localDb.getAnimals().map(a => (
              <button
                key={a.tag_no}
                onClick={() => navigate(`/form/${a.tag_no}?new=false`)}
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                {a.tag_no} ({a.owner_name})
              </button>
            ))}
          </div>
        </div>
      </div>

      <AndroidBottomNav />
    </div>
  )
}
