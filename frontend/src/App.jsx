import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import NewEntry from './components/NewEntry'
import SearchAnimal from './components/SearchAnimal'
import AnimalForm from './components/AnimalForm'
import HistoryViewer from './components/HistoryViewer'
import FeedingManagement from './components/FeedingManagement'
import Settings from './components/Settings'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/"               element={<Dashboard />} />
        <Route path="/search"         element={<SearchAnimal />} />
        <Route path="/new-entry"      element={<NewEntry />} />
        <Route path="/form/:tagNo"    element={<AnimalForm />} />
        <Route path="/history/:tagNo" element={<HistoryViewer />} />
        <Route path="/feeding"        element={<FeedingManagement />} />
        <Route path="/settings"       element={<Settings />} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
