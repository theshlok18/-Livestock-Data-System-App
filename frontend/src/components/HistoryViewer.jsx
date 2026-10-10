import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AndroidStatusBar, AndroidTopBar, AndroidBottomNav } from './AndroidHeaderNav'
import localDb from '../utils/localDb'

export default function HistoryViewer() {
  const { tagNo } = useParams()
  const navigate = useNavigate()

  const [animal, setAnimal] = useState(null)
  const [records, setRecords] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  const loadData = () => {
    const a = localDb.getAnimalByTag(tagNo)
    setAnimal(a)
    const r = localDb.getRecordsForAnimal(tagNo)
    setRecords(r)
    if (r.length > 0) setExpandedId(r[0].id)
  }

  useEffect(() => {
    loadData()
  }, [tagNo])

  const handleDeleteRecord = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this record from local phone storage?')) {
      localDb.deleteRecord(id)
      loadData()
    }
  }

  const handleDeleteAnimal = () => {
    if (window.confirm(`Delete animal ${tagNo} and all associated records permanently from local storage?`)) {
      localDb.deleteAnimal(tagNo)
      navigate('/search')
    }
  }

  return (
    <div>
      <AndroidStatusBar />
      <AndroidTopBar title={`Profile: ${tagNo}`} showBack={true} />

      <div className="android-content animate-slide-up">
        {/* Animal Summary Card */}
        {animal ? (
          <div className="android-card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: animal.animal_type === 'Buffalo' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                flexShrink: 0
              }}>
                {animal.image_path ? (
                  <img src={animal.image_path} alt="Tag" style={{ width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover' }} />
                ) : (
                  animal.animal_type === 'Buffalo' ? '🐃' : '🐄'
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: '800', fontSize: '17px' }}>{animal.tag_no}</span>
                  <span className="badge badge-emerald">{animal.animal_type}</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>
                  {animal.owner_name} • {animal.village}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Breed: {animal.breed || 'N/A'} • {animal.body_weight ? `${animal.body_weight} kg` : ''}
                </div>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => navigate(`/form/${tagNo}`)}
                className="android-btn-primary"
                style={{ flex: 1, padding: '9px', fontSize: '12px' }}
              >
                ➕ Add Monthly Log
              </button>
              <button
                onClick={handleDeleteAnimal}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="android-card" style={{ marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontWeight: '700' }}>Animal {tagNo} not registered</div>
            <button onClick={() => navigate(`/new-entry?new=true&tag=${tagNo}`)} className="android-btn-primary" style={{ marginTop: '10px' }}>
              Register {tagNo} Now
            </button>
          </div>
        )}

        {/* History Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Production History ({records.length})</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tap card to expand</span>
        </div>

        {records.length === 0 ? (
          <div className="android-card" style={{ textAlign: 'center', padding: '30px 16px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontWeight: '800', fontSize: '14px' }}>No Production Logs Yet</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '14px' }}>
              Log milk, fat %, feed rations, and health status for this animal.
            </p>
            <button
              onClick={() => navigate(`/form/${tagNo}`)}
              className="android-btn-primary"
              style={{ margin: '0 auto', maxWidth: '200px', fontSize: '13px', padding: '10px' }}
            >
              Add First Log
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
            {records.map(record => {
              const isExpanded = expandedId === record.id
              return (
                <div
                  key={record.id}
                  className="android-card"
                  onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '800', fontSize: '15px' }}>{record.record_date}</span>
                        {record.is_draft ? (
                          <span className="badge badge-amber">Draft</span>
                        ) : (
                          <span className="badge badge-emerald">{record.health_status || 'Healthy'}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        🥛 <strong>{record.milk_per_day || 0} L/day</strong> • Fat: {record.fat}% • SNF: {record.snf}%
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={(e) => handleDeleteRecord(record.id, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        🗑️
                      </button>
                      <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '14px' }}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)', fontSize: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '10px' }}>
                        <div><strong>Rate:</strong> ₹{record.rate || 0}/L</div>
                        <div><strong>Expenses:</strong> ₹{record.expenses || 0}</div>
                        <div><strong>Reproduction:</strong> {record.pregnancy_status} {record.pregnancy_month ? `(${record.pregnancy_month} mo)` : ''}</div>
                        <div><strong>Lactation No:</strong> #{record.lactation_no || 1}</div>
                      </div>

                      {record.vaccination && (
                        <div style={{ marginBottom: '4px' }}>
                          💉 <strong>Vaccination:</strong> {record.vaccination}
                        </div>
                      )}
                      {record.deworming && (
                        <div style={{ marginBottom: '4px' }}>
                          💊 <strong>Deworming:</strong> {record.deworming}
                        </div>
                      )}
                      {record.notes && (
                        <div style={{ background: 'var(--surface-subtle)', padding: '8px', borderRadius: '8px', marginTop: '6px', color: 'var(--text-muted)' }}>
                          📝 {record.notes}
                        </div>
                      )}

                      {/* Feeding rows */}
                      {record.feeding_data && record.feeding_data.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <strong>🌾 Daily Feed Rations:</strong>
                          <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {record.feeding_data.map((f, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11px' }}>
                                <span>• {f.feed_name} ({f.quantity} kg)</span>
                                <span>₹{f.total_cost || ((parseFloat(f.quantity) || 0) * (parseFloat(f.cost_per_kg) || 0)).toFixed(1)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AndroidBottomNav />
    </div>
  )
}
