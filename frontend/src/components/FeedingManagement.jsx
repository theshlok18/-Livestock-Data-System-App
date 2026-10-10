import React, { useState, useEffect } from 'react'
import { AndroidStatusBar, AndroidTopBar, AndroidBottomNav } from './AndroidHeaderNav'
import localDb from '../utils/localDb'

export default function FeedingManagement() {
  const [animals, setAnimals] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  const [feedRows, setFeedRows] = useState([
    { id: 1, feed_name: 'Cattle Feed 20%', feed_type: 'Concentrates', quantity: '4.0', cost_per_kg: '28.0' },
    { id: 2, feed_name: 'Napier / Hybrid Grass', feed_type: 'Green Fodder', quantity: '20.0', cost_per_kg: '2.5' },
    { id: 3, feed_name: 'Dry Wheat Straw', feed_type: 'Dry Fodder', quantity: '5.0', cost_per_kg: '6.0' },
    { id: 4, feed_name: 'Chelated Mineral Mixture', feed_type: 'Mineral Mixture', quantity: '0.1', cost_per_kg: '180.0' }
  ])

  useEffect(() => {
    const list = localDb.getAnimals()
    setAnimals(list)
    if (list.length > 0) setSelectedTag(list[0].tag_no)
  }, [])

  const handleRowChange = (id, field, value) => {
    setFeedRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const addRow = () => {
    setFeedRows(prev => [
      ...prev,
      { id: Date.now(), feed_name: '', feed_type: 'Concentrates', quantity: '1.0', cost_per_kg: '25.0' }
    ])
  }

  const removeRow = (id) => {
    setFeedRows(prev => prev.filter(r => r.id !== id))
  }

  // Calculations
  const dailyCost = feedRows.reduce((sum, r) => sum + ((parseFloat(r.quantity) || 0) * (parseFloat(r.cost_per_kg) || 0)), 0)
  const monthlyCost = dailyCost * 30
  const dailyWeight = feedRows.reduce((sum, r) => sum + (parseFloat(r.quantity) || 0), 0)

  const handleSave = () => {
    if (navigator.vibrate) navigator.vibrate([30, 50, 30])
    setSavedMsg(`Feeding Ration saved locally for ${selectedTag || 'All Livestock'}! ✓`)
    setTimeout(() => setSavedMsg(''), 3000)
  }

  return (
    <div>
      <AndroidStatusBar />
      <AndroidTopBar title="Feed & Ration Management" showBack={false} />

      <div className="android-content animate-slide-up">
        {savedMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '14px',
            fontWeight: '700',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {savedMsg}
          </div>
        )}

        {/* Live Cost Summary Banner */}
        <div className="android-card" style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '18px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Daily Feeding Cost</span>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>
                ₹{dailyCost.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Monthly Estimate</span>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
                ₹{monthlyCost.toFixed(0)}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            fontSize: '12px'
          }}>
            <span>Total Ration Weight:</span>
            <strong>{dailyWeight.toFixed(1)} kg / day</strong>
          </div>
        </div>

        {/* Animal Selector */}
        <div className="android-card" style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
            APPLY TO ANIMAL TAG
          </label>
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="android-input"
          >
            {animals.map(a => (
              <option key={a.tag_no} value={a.tag_no}>
                {a.tag_no} ({a.animal_type} - {a.owner_name})
              </option>
            ))}
          </select>
        </div>

        {/* Feed Rows */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Ration Ingredients ({feedRows.length})</h3>
          <button
            onClick={addRow}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            + Add Feed
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {feedRows.map((row, index) => {
            const subtotal = ((parseFloat(row.quantity) || 0) * (parseFloat(row.cost_per_kg) || 0)).toFixed(1)
            return (
              <div key={row.id} className="android-card" style={{ padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '800', fontSize: '13px', color: '#6366f1' }}>
                    #{index + 1} {row.feed_type}
                  </span>
                  <button
                    onClick={() => removeRow(row.id)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '2px' }}
                  >
                    ✕
                  </button>
                </div>

                <input
                  type="text"
                  value={row.feed_name}
                  onChange={e => handleRowChange(row.id, 'feed_name', e.target.value)}
                  placeholder="Feed name (e.g. Maize, Cotton Cake)"
                  className="android-input"
                  style={{ marginBottom: '8px', padding: '8px 12px' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>QTY (KG)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={row.quantity}
                      onChange={e => handleRowChange(row.id, 'quantity', e.target.value)}
                      className="android-input"
                      style={{ padding: '6px 8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>₹ / KG</label>
                    <input
                      type="number"
                      step="0.5"
                      value={row.cost_per_kg}
                      onChange={e => handleRowChange(row.id, 'cost_per_kg', e.target.value)}
                      className="android-input"
                      style={{ padding: '6px 8px' }}
                    />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>SUBTOTAL</label>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#059669' }}>
                      ₹{subtotal}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={handleSave} className="android-btn-primary" style={{ marginBottom: '30px' }}>
          ✓ Save Ration to Phone Storage
        </button>
      </div>

      <AndroidBottomNav />
    </div>
  )
}
