import React from 'react'
import feedData from '../config/feedData.json'
import { t } from './DynamicForm'

const CLASSES   = feedData.feed_data
const getSubs   = fc     => CLASSES.find(c => c.feed_class === fc)?.subclasses || []
const getFeeds  = (fc, sc) => getSubs(fc).find(s => s.feed_subclass === sc)?.feeds || []

let _id = 100
export const emptyFeedRow = () => ({
  id: _id++, feed_class: '', feed_subclass: '', feed_name: '', feed_weight: ''
})

// ── Inline cell inputs (paper-form style) ─────────────────────────────────────
function CellSelect({ value, onChange, options, placeholder, disabled }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      className={`w-full text-xs border-0 outline-none bg-transparent py-1 px-1 focus:bg-yellow-50 rounded transition
        ${disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 cursor-pointer'}`}>
      <option value="">{placeholder || '—'}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function CellNum({ value, onChange, readOnly, highlight }) {
  return (
    <input type="number" min="0" step="0.01" value={value}
      onChange={e => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder="0"
      className={`w-full text-xs border-0 outline-none py-1 px-1 focus:bg-yellow-50 rounded transition text-right
        ${readOnly
          ? highlight ? 'bg-green-50 text-green-800 font-bold cursor-default' : 'bg-slate-50 text-slate-500 cursor-default'
          : 'bg-transparent text-slate-700'}`} />
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FeedingSection({ rows, onChange, viewOnly = false, lang = 'en' }) {

  const updateRow = (id, field, value) => {
    const updated = rows.map(row => {
      if (row.id !== id) return row
      const u = { ...row, [field]: value }
      if (field === 'feed_class')    { u.feed_subclass = ''; u.feed_name = '' }
      if (field === 'feed_subclass') { u.feed_name = '' }
      return u
    })
    onChange(updated)
  }

  const addRow    = () => onChange([...rows, emptyFeedRow()])
  const removeRow = id => onChange(rows.filter(r => r.id !== id))

  // ── VIEW-ONLY mode (history viewer) ──────────────────────────────────────────
  if (viewOnly) {
    if (!rows || rows.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="border border-slate-200 px-3 py-2 text-xs text-slate-400 italic text-center">
            No feeding data recorded
          </td>
        </tr>
      )
    }
    return (
      <>
        {/* Sub-header */}
        <tr>
          <td colSpan={4} className="border border-slate-200 bg-orange-50 px-3 py-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 font-bold uppercase tracking-wide">
                  <th className="text-left py-1 pr-2 w-[32%]">Feed Class</th>
                  <th className="text-left py-1 pr-2 w-[26%]">Sub Class</th>
                  <th className="text-left py-1 pr-2 w-[30%]">Feed Name</th>
                  <th className="text-left py-1 w-[12%]">Weight (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {rows.map((r, i) => (
                  <tr key={r.id || i} className="text-slate-700">
                    <td className="py-1 pr-2">{r.feed_class || '—'}</td>
                    <td className="py-1 pr-2">{r.feed_subclass || '—'}</td>
                    <td className="py-1 pr-2 font-medium">{r.feed_name || '—'}</td>
                    <td className="py-1 text-right font-medium">{r.feed_weight || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      </>
    )
  }

  // ── EDIT mode ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Column headers row */}
      <tr className="bg-orange-50/80">
        <td className="border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500 uppercase tracking-wide w-[22%]">#</td>
        <td colSpan={3} className="border border-slate-200 px-2 py-1">
          <div className="grid grid-cols-[1.5fr_1.3fr_2fr_1.2fr_28px] gap-1 text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span>{t('feed_class', lang)}</span>
            <span>{t('feed_subclass', lang)}</span>
            <span>{t('feed_name', lang)}</span>
            <span>{t('feed_weight', lang)}</span>
            <span></span>
          </div>
        </td>
      </tr>

      {/* Feed rows */}
      {rows.map((row, idx) => (
        <tr key={row.id} className={idx % 2 === 1 ? 'bg-orange-50/30' : 'bg-white'}>
          {/* Row number */}
          <td className="border border-slate-200 px-2 py-1 text-xs font-bold text-slate-400 text-center align-middle w-[22%]">
            {idx + 1}
          </td>
          {/* All fields in one wide cell */}
          <td colSpan={3} className="border border-slate-200 px-1 py-1 align-middle">
            <div className="grid grid-cols-[1.5fr_1.3fr_2fr_1.2fr_28px] gap-1 items-center">
              {/* Feed Class */}
              <CellSelect
                value={row.feed_class}
                onChange={v => updateRow(row.id, 'feed_class', v)}
                options={CLASSES.map(c => c.feed_class)}
                placeholder="Class"
              />
              {/* Sub Class */}
              <CellSelect
                value={row.feed_subclass}
                onChange={v => updateRow(row.id, 'feed_subclass', v)}
                options={getSubs(row.feed_class).map(s => s.feed_subclass)}
                placeholder="Sub Class"
                disabled={!row.feed_class}
              />
              {/* Feed Name */}
              <CellSelect
                value={row.feed_name}
                onChange={v => updateRow(row.id, 'feed_name', v)}
                options={getFeeds(row.feed_class, row.feed_subclass).map(f => f.feed_name)}
                placeholder="Feed Name"
                disabled={!row.feed_subclass}
              />
              {/* Feed Weight */}
              <CellNum
                value={row.feed_weight}
                onChange={v => updateRow(row.id, 'feed_weight', v)}
              />
              {/* Remove */}
              <div className="flex items-center justify-center">
                {rows.length > 1 ? (
                  <button type="button" onClick={() => removeRow(row.id)}
                    className="w-5 h-5 rounded flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition text-xs font-bold leading-none">
                    ✕
                  </button>
                ) : <div className="w-5 h-5" />}
              </div>
            </div>
          </td>
        </tr>
      ))}

      {/* Add row */}
      <tr className="bg-orange-50/60">
        <td className="border border-slate-200 px-2 py-1.5 align-middle">
          <button type="button" onClick={addRow}
            className="flex items-center gap-1 text-xs font-bold transition hover:opacity-70"
            style={{ color: '#c4622d' }}>
            <span className="w-4 h-4 rounded-full text-white flex items-center justify-center text-xs leading-none"
              style={{ background: '#c4622d' }}>+</span>
            {t('add_row', lang)}
          </button>
        </td>
        <td colSpan={3} className="border border-slate-200 px-1 py-1.5 align-middle">
        </td>
      </tr>
    </>
  )
}
