import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AndroidStatusBar, AndroidTopBar, AndroidBottomNav } from './AndroidHeaderNav'
import localDb from '../utils/localDb'

export default function SearchAnimal() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [animals, setAnimals] = useState([])
  const [filterType, setFilterType] = useState('All')

  const filterOptions = ['All', 'Cow', 'Buffalo', 'Goat', 'Sheep']

  const fetchResults = () => {
    let list = localDb.searchAnimals(query)
    if (filterType !== 'All') {
      list = list.filter(a => a.animal_type?.toLowerCase() === filterType.toLowerCase())
    }
    setAnimals(list)
  }

  useEffect(() => {
    fetchResults()
  }, [query, filterType])

  return (
    <div>
      <AndroidStatusBar />
      <AndroidTopBar title="Animal Database" showBack={false} />

      <div className="android-content animate-slide-up">
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '13px', fontSize: '16px', color: 'var(--text-muted)' }}>
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Tag, Owner, Village, Breed..."
            className="android-input"
            style={{ paddingLeft: '40px', paddingRight: query ? '36px' : '14px' }}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Chips Horizontal Scroll */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
          {filterOptions.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: filterType === type ? '#059669' : 'var(--border)',
                background: filterType === type ? '#059669' : 'var(--surface)',
                color: filterType === type ? '#ffffff' : 'var(--text-main)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Found {animals.length} {animals.length === 1 ? 'animal' : 'animals'}
          </span>
          <button
            onClick={() => navigate('/new-entry?new=true')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            + Register New
          </button>
        </div>

        {/* Animals List */}
        {animals.length === 0 ? (
          <div className="android-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔍</div>
            <div style={{ fontWeight: '800', fontSize: '15px' }}>No Animals Found</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
              No livestock matches "{query || filterType}".
            </p>
            <button
              onClick={() => navigate(`/new-entry?new=true&tag=${encodeURIComponent(query)}`)}
              className="android-btn-primary"
              style={{ margin: '0 auto', maxWidth: '200px', fontSize: '13px', padding: '10px' }}
            >
              Register Tag: {query || 'New'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {animals.map(animal => (
              <div
                key={animal.tag_no}
                className="android-card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div
                  onClick={() => navigate(`/history/${animal.tag_no}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: '800', fontSize: '15px' }}>{animal.tag_no}</span>
                      <span className="badge badge-emerald">{animal.animal_type}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>
                      {animal.owner_name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      📍 {animal.village} {animal.breed ? `• Breed: ${animal.breed}` : ''}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons for this animal */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border)'
                }}>
                  <button
                    onClick={() => navigate(`/form/${animal.tag_no}`)}
                    className="android-btn-secondary"
                    style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                  >
                    📝 Log Entry
                  </button>
                  <button
                    onClick={() => navigate(`/history/${animal.tag_no}`)}
                    className="android-btn-primary"
                    style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                  >
                    📊 View History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AndroidBottomNav />
    </div>
  )
}
