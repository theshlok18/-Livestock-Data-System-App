import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { AndroidStatusBar, AndroidTopBar, AndroidBottomNav } from './AndroidHeaderNav'
import localDb from '../utils/localDb'

export default function AnimalForm() {
  const { tagNo } = useParams()
  const [searchParams] = useSearchParams()
  const isNew = searchParams.get('new') === 'true'
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(isNew ? 'animal' : 'record')
  const [successMsg, setSuccessMsg] = useState('')

  // Animal Profile Data
  const [animalData, setAnimalData] = useState({
    tag_no: tagNo || '',
    animal_type: 'Cow',
    breed: 'HF Cross',
    age: '3 Yrs',
    body_weight: '400',
    owner_name: '',
    village: 'Arjunwada',
    contact: '',
    mobile_no: '',
    aadhar_no: '',
    image_path: ''
  })

  // Production & Monthly Record Data
  const [recordData, setRecordData] = useState({
    record_date: new Date().toISOString().split('T')[0],
    milk_per_day: '15.0',
    fat: '4.2',
    snf: '8.6',
    rate: '38.0',
    expenses: '150',
    health_status: 'Healthy',
    vaccination: 'FMD',
    deworming: 'Albendazole',
    pregnancy_status: 'Non-Pregnant',
    pregnancy_month: '0',
    lactation_no: '2',
    calving_date: '',
    calf_tag: '',
    calf_sex: 'Female',
    notes: ''
  })

  // Feeding Rows
  const [feedRows, setFeedRows] = useState([
    { feed_name: 'Cattle Feed 20%', quantity: '4.0', cost_per_kg: '28.0', feed_type: 'Concentrates' },
    { feed_name: 'Green Grass / Maize', quantity: '20.0', cost_per_kg: '2.5', feed_type: 'Green Fodder' }
  ])

  useEffect(() => {
    const existing = localDb.getAnimalByTag(tagNo)
    if (existing) {
      setAnimalData(existing)
    }
  }, [tagNo])

  const handleAnimalChange = (key, value) => {
    setAnimalData(p => ({ ...p, [key]: value }))
  }

  const handleRecordChange = (key, value) => {
    setRecordData(p => ({ ...p, [key]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAnimalData(p => ({ ...p, image_path: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (isDraft = false) => {
    if (!animalData.tag_no.trim()) {
      alert('Tag Number is required!')
      return
    }

    // 1. Save Animal to Local Storage
    localDb.saveAnimal(animalData)

    // 2. Save Monthly Record if in record tab or logging record
    const recordPayload = {
      ...recordData,
      tag_no: animalData.tag_no.toUpperCase(),
      feeding_data: feedRows.map(r => ({
        ...r,
        total_cost: ((parseFloat(r.quantity) || 0) * (parseFloat(r.cost_per_kg) || 0)).toFixed(1)
      })),
      is_draft: isDraft ? 1 : 0
    }
    localDb.saveRecord(recordPayload)

    if (navigator.vibrate) navigator.vibrate([40, 60, 40])
    setSuccessMsg(isDraft ? 'Saved as Local Draft! 📝' : 'Record Saved into Phone Storage! ✓')

    setTimeout(() => {
      navigate(`/history/${animalData.tag_no}`)
    }, 1200)
  }

  // Calculated estimates
  const dailyMilkLiters = parseFloat(recordData.milk_per_day) || 0
  const milkPrice = parseFloat(recordData.rate) || 0
  const dailyIncome = dailyMilkLiters * milkPrice
  const totalFeedCost = feedRows.reduce((sum, r) => sum + ((parseFloat(r.quantity) || 0) * (parseFloat(r.cost_per_kg) || 0)), 0)

  return (
    <div>
      <AndroidStatusBar />
      <AndroidTopBar title={`Animal ${tagNo}`} showBack={true} />

      <div className="android-content animate-slide-up">
        {/* Success Banner */}
        {successMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontWeight: '700',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {successMsg}
          </div>
        )}

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          background: 'var(--surface-subtle)',
          borderRadius: '14px',
          padding: '4px',
          marginBottom: '16px',
          border: '1px solid var(--border)'
        }}>
          <button
            onClick={() => setActiveTab('animal')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'animal' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'animal' ? '#ffffff' : 'var(--text-main)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Animal Profile
          </button>
          <button
            onClick={() => setActiveTab('record')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'record' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'record' ? '#ffffff' : 'var(--text-main)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Milk & Health Record
          </button>
        </div>

        {/* Tab 1: Animal Profile Details */}
        {activeTab === 'animal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Animal Photo Preview & Picker */}
            <div className="android-card" style={{ textAlign: 'center' }}>
              {animalData.image_path ? (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                  <img
                    src={animalData.image_path}
                    alt="Animal"
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '16px', border: '2px solid var(--primary)' }}
                  />
                  <button
                    onClick={() => setAnimalData(p => ({ ...p, image_path: '' }))}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'var(--surface-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  margin: '0 auto 8px'
                }}>
                  📸
                </div>
              )}

              <label style={{
                display: 'inline-block',
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
                📷 {animalData.image_path ? 'Change Photo' : 'Upload Animal Photo'}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Animal Fields */}
            <div className="android-card">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>TAG NUMBER *</label>
              <input
                type="text"
                value={animalData.tag_no}
                onChange={e => handleAnimalChange('tag_no', e.target.value.toUpperCase())}
                className="android-input"
                style={{ marginBottom: '12px' }}
                disabled={!isNew}
              />

              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>SPECIES / ANIMAL TYPE</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {['Cow', 'Buffalo', 'Goat', 'Sheep'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleAnimalChange('animal_type', type)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: animalData.animal_type === type ? '#059669' : 'var(--border)',
                      background: animalData.animal_type === type ? '#059669' : 'var(--surface-subtle)',
                      color: animalData.animal_type === type ? '#fff' : 'var(--text-main)',
                      fontWeight: '700',
                      fontSize: '12px'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>BREED</label>
                  <input
                    type="text"
                    value={animalData.breed}
                    onChange={e => handleAnimalChange('breed', e.target.value)}
                    placeholder="e.g. Gir, Murrah"
                    className="android-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>AGE</label>
                  <input
                    type="text"
                    value={animalData.age}
                    onChange={e => handleAnimalChange('age', e.target.value)}
                    placeholder="e.g. 3 Yrs 4 Mos"
                    className="android-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>BODY WEIGHT (KG)</label>
                <input
                  type="number"
                  value={animalData.body_weight}
                  onChange={e => handleAnimalChange('body_weight', e.target.value)}
                  placeholder="e.g. 450"
                  className="android-input"
                />
              </div>
            </div>

            {/* Owner Details */}
            <div className="android-card">
              <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '10px' }}>Owner & Location</h3>

              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>FARMER / OWNER NAME *</label>
              <input
                type="text"
                value={animalData.owner_name}
                onChange={e => handleAnimalChange('owner_name', e.target.value)}
                placeholder="e.g. Pralhad Patil"
                className="android-input"
                style={{ marginBottom: '12px' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>VILLAGE</label>
                  <input
                    type="text"
                    value={animalData.village}
                    onChange={e => handleAnimalChange('village', e.target.value)}
                    className="android-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>MOBILE NO.</label>
                  <input
                    type="tel"
                    value={animalData.mobile_no}
                    onChange={e => handleAnimalChange('mobile_no', e.target.value)}
                    placeholder="10 Digits"
                    className="android-input"
                  />
                </div>
              </div>

              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>AADHAAR NO.</label>
              <input
                type="text"
                value={animalData.aadhar_no}
                onChange={e => handleAnimalChange('aadhar_no', e.target.value)}
                placeholder="12 Digit Aadhaar"
                className="android-input"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Monthly Record & Production */}
        {activeTab === 'record' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Live Financial Summary */}
            <div className="android-card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(99,102,241,0.1) 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Milk Value</span>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>₹{dailyIncome.toFixed(1)}/day</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Feed Cost</span>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#f59e0b' }}>₹{totalFeedCost.toFixed(1)}/day</div>
                </div>
              </div>
            </div>

            {/* Milk Production Inputs */}
            <div className="android-card">
              <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '10px' }}>Milk & Milk Quality</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>MILK (L/DAY)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={recordData.milk_per_day}
                    onChange={e => handleRecordChange('milk_per_day', e.target.value)}
                    className="android-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>FAT %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={recordData.fat}
                    onChange={e => handleRecordChange('fat', e.target.value)}
                    className="android-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>SNF %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={recordData.snf}
                    onChange={e => handleRecordChange('snf', e.target.value)}
                    className="android-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>RATE (₹/L)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={recordData.rate}
                    onChange={e => handleRecordChange('rate', e.target.value)}
                    className="android-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>MONTHLY EXPENSES (₹)</label>
                <input
                  type="number"
                  value={recordData.expenses}
                  onChange={e => handleRecordChange('expenses', e.target.value)}
                  className="android-input"
                />
              </div>
            </div>

            {/* Health & Reproduction */}
            <div className="android-card">
              <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '10px' }}>Health & Pregnancy</h3>

              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>HEALTH STATUS</label>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {['Healthy', 'Sick', 'Under Treatment', 'Vaccinated'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleRecordChange('health_status', st)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: recordData.health_status === st ? '#059669' : 'var(--border)',
                      background: recordData.health_status === st ? '#059669' : 'var(--surface-subtle)',
                      color: recordData.health_status === st ? '#fff' : 'var(--text-main)',
                      fontWeight: '700',
                      fontSize: '11px'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>PREGNANCY</label>
                  <select
                    value={recordData.pregnancy_status}
                    onChange={e => handleRecordChange('pregnancy_status', e.target.value)}
                    className="android-input"
                  >
                    <option value="Non-Pregnant">Non-Pregnant</option>
                    <option value="Pregnant">Pregnant</option>
                    <option value="Inseminated">Inseminated</option>
                  </select>
                </div>
                {recordData.pregnancy_status === 'Pregnant' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>MONTH (1-10)</label>
                    <input
                      type="number"
                      value={recordData.pregnancy_month}
                      onChange={e => handleRecordChange('pregnancy_month', e.target.value)}
                      className="android-input"
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>VACCINATION</label>
                  <input
                    type="text"
                    value={recordData.vaccination}
                    onChange={e => handleRecordChange('vaccination', e.target.value)}
                    placeholder="e.g. FMD, HS"
                    className="android-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>DEWORMING</label>
                  <input
                    type="text"
                    value={recordData.deworming}
                    onChange={e => handleRecordChange('deworming', e.target.value)}
                    placeholder="e.g. Albendazole"
                    className="android-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>NOTES / OBSERVATIONS</label>
                <textarea
                  value={recordData.notes}
                  onChange={e => handleRecordChange('notes', e.target.value)}
                  className="android-input"
                  rows="2"
                  placeholder="Appetite, behavior, treatment notes..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', marginBottom: '30px' }}>
          <button
            onClick={() => handleSave(true)}
            className="android-btn-secondary"
            style={{ flex: 1, padding: '12px' }}
          >
            📝 Save Draft
          </button>
          <button
            onClick={() => handleSave(false)}
            className="android-btn-primary"
            style={{ flex: 2, padding: '12px' }}
          >
            ✓ Save to Phone Storage
          </button>
        </div>
      </div>

      <AndroidBottomNav />
    </div>
  )
}
