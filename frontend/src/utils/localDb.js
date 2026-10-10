/**
 * Livestock Local Storage Engine
 * 100% Offline Local Phone Storage Database
 */

const STORAGE_KEYS = {
  ANIMALS: 'livestock_animals_v2',
  RECORDS: 'livestock_records_v2',
  FEEDING: 'livestock_feeding_v2',
  USER: 'livestock_active_user',
  SETTINGS: 'livestock_settings'
}

// Initial Sample Data for instant out-of-the-box offline experience
const INITIAL_ANIMALS = [
  {
    tag_no: 'TAG-1001',
    animal_type: 'Cow',
    breed: 'HF Cross',
    age: '3 Yrs 6 Mos',
    body_weight: 420,
    owner_name: 'Pralhad Patil',
    village: 'Arjunwada',
    contact: '9876543210',
    mobile_no: '9876543210',
    aadhar_no: '1234 5678 9012',
    image_path: '',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    tag_no: 'TAG-1002',
    animal_type: 'Buffalo',
    breed: 'Murrah',
    age: '4 Yrs 2 Mos',
    body_weight: 550,
    owner_name: 'Ramesh Shinde',
    village: 'Kagal',
    contact: '9823456789',
    mobile_no: '9823456789',
    aadhar_no: '9876 5432 1098',
    image_path: '',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    tag_no: 'TAG-1003',
    animal_type: 'Cow',
    breed: 'Gir',
    age: '2 Yrs 8 Mos',
    body_weight: 380,
    owner_name: 'Sunil Gaikwad',
    village: 'Arjunwada',
    contact: '9765432190',
    mobile_no: '9765432190',
    aadhar_no: '4567 8901 2345',
    image_path: '',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
]

const INITIAL_RECORDS = [
  {
    id: 'rec-1',
    tag_no: 'TAG-1001',
    record_date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    milk_per_day: 16.5,
    fat: 4.2,
    snf: 8.6,
    rate: 38.5,
    expenses: 180,
    health_status: 'Healthy',
    vaccination: 'FMD (Done)',
    deworming: 'Albendazole (Done)',
    pregnancy_status: 'Pregnant',
    pregnancy_month: 4,
    lactation_no: 2,
    dry_date: '',
    calving_date: '2026-02-14',
    calf_tag: 'CLF-089',
    calf_sex: 'Female',
    body_weight: 420,
    body_condition_score: '3.5',
    notes: 'High production, healthy appetite',
    feeding_data: [
      { feed_name: 'Cattle Feed 20%', quantity: '4.0', cost_per_kg: '28.0', total_cost: '112.0', feed_type: 'Concentrates' },
      { feed_name: 'Maize / Napier Grass', quantity: '20.0', cost_per_kg: '2.5', total_cost: '50.0', feed_type: 'Green Fodder' },
      { feed_name: 'Chelated Agrimin', quantity: '0.1', cost_per_kg: '180.0', total_cost: '18.0', feed_type: 'Mineral Mixture' }
    ],
    is_draft: 0,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'rec-2',
    tag_no: 'TAG-1002',
    record_date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    milk_per_day: 12.0,
    fat: 7.1,
    snf: 9.2,
    rate: 62.0,
    expenses: 210,
    health_status: 'Healthy',
    vaccination: 'HS & BQ (Done)',
    deworming: 'Ivermectin',
    pregnancy_status: 'Inseminated',
    pregnancy_month: 1,
    lactation_no: 3,
    dry_date: '',
    calving_date: '',
    calf_tag: '',
    calf_sex: '',
    body_weight: 550,
    body_condition_score: '4.0',
    notes: 'Excellent fat percentage recorded',
    feeding_data: [
      { feed_name: 'Cottonseed Cake', quantity: '3.5', cost_per_kg: '34.0', total_cost: '119.0', feed_type: 'Concentrates' },
      { feed_name: 'Lucerne Grass', quantity: '25.0', cost_per_kg: '3.0', total_cost: '75.0', feed_type: 'Green Fodder' }
    ],
    is_draft: 0,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
]

// Initialize Local Phone Storage
export function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.ANIMALS)) {
    localStorage.setItem(STORAGE_KEYS.ANIMALS, JSON.stringify(INITIAL_ANIMALS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
      username: 'field_officer',
      full_name: 'Pralhad Patil (Field Officer)',
      role: 'field_officer',
      isLoggedIn: true
    }))
  }
}

// Call on module load
initLocalStorage()

export const localDb = {
  // Animals
  getAnimals: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANIMALS) || '[]')
    } catch {
      return []
    }
  },

  getAnimalByTag: (tagNo) => {
    const list = localDb.getAnimals()
    return list.find(a => a.tag_no.toUpperCase() === tagNo.toUpperCase()) || null
  },

  saveAnimal: (animalData) => {
    const list = localDb.getAnimals()
    const index = list.findIndex(a => a.tag_no.toUpperCase() === animalData.tag_no.toUpperCase())
    const updatedAnimal = {
      ...animalData,
      tag_no: animalData.tag_no.toUpperCase(),
      updated_at: new Date().toISOString()
    }

    if (index >= 0) {
      list[index] = { ...list[index], ...updatedAnimal }
    } else {
      updatedAnimal.created_at = new Date().toISOString()
      list.unshift(updatedAnimal)
    }

    localStorage.setItem(STORAGE_KEYS.ANIMALS, JSON.stringify(list))
    return updatedAnimal
  },

  deleteAnimal: (tagNo) => {
    let list = localDb.getAnimals()
    list = list.filter(a => a.tag_no.toUpperCase() !== tagNo.toUpperCase())
    localStorage.setItem(STORAGE_KEYS.ANIMALS, JSON.stringify(list))

    // Cascade delete animal records
    let records = localDb.getRecords()
    records = records.filter(r => r.tag_no.toUpperCase() !== tagNo.toUpperCase())
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records))
    return true
  },

  searchAnimals: (query) => {
    const list = localDb.getAnimals()
    if (!query || !query.trim()) return list
    const q = query.trim().toLowerCase()
    return list.filter(a => 
      (a.tag_no && a.tag_no.toLowerCase().includes(q)) ||
      (a.owner_name && a.owner_name.toLowerCase().includes(q)) ||
      (a.village && a.village.toLowerCase().includes(q)) ||
      (a.breed && a.breed.toLowerCase().includes(q)) ||
      (a.mobile_no && a.mobile_no.includes(q))
    )
  },

  // Records
  getRecords: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]')
    } catch {
      return []
    }
  },

  getRecordsForAnimal: (tagNo) => {
    const records = localDb.getRecords()
    return records
      .filter(r => r.tag_no.toUpperCase() === tagNo.toUpperCase())
      .sort((a, b) => new Date(b.record_date || b.created_at) - new Date(a.record_date || a.created_at))
  },

  saveRecord: (recordData) => {
    const list = localDb.getRecords()
    const id = recordData.id || `rec-${Date.now()}`
    const newRecord = {
      ...recordData,
      id,
      tag_no: recordData.tag_no.toUpperCase(),
      updated_at: new Date().toISOString(),
      created_at: recordData.created_at || new Date().toISOString()
    }

    const index = list.findIndex(r => r.id === id)
    if (index >= 0) {
      list[index] = newRecord
    } else {
      list.unshift(newRecord)
    }

    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(list))
    return newRecord
  },

  deleteRecord: (id) => {
    let list = localDb.getRecords()
    list = list.filter(r => r.id !== id)
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(list))
    return true
  },

  // Stats
  getStats: () => {
    const animals = localDb.getAnimals()
    const records = localDb.getRecords()
    const activeRecords = records.filter(r => !r.is_draft)
    const drafts = records.filter(r => r.is_draft)

    const totalMilk = activeRecords.reduce((acc, r) => acc + (parseFloat(r.milk_per_day) || 0), 0)
    const avgMilk = activeRecords.length > 0 ? (totalMilk / activeRecords.length).toFixed(1) : 0
    const totalExpenses = activeRecords.reduce((acc, r) => acc + (parseFloat(r.expenses) || 0), 0)

    return {
      stats: {
        animals: animals.length,
        records: activeRecords.length,
        drafts: drafts.length,
        avgMilk: parseFloat(avgMilk),
        totalExpenses: Math.round(totalExpenses)
      },
      recent: activeRecords.slice(0, 5)
    }
  },

  // Backup Export & Import
  exportBackupJson: () => {
    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      animals: localDb.getAnimals(),
      records: localDb.getRecords()
    }
    return JSON.stringify(data, null, 2)
  },

  importBackupJson: (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      if (Array.isArray(data.animals)) {
        localStorage.setItem(STORAGE_KEYS.ANIMALS, JSON.stringify(data.animals))
      }
      if (Array.isArray(data.records)) {
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(data.records))
      }
      return { success: true, count: (data.animals?.length || 0) + (data.records?.length || 0) }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  // Reset database with samples
  resetToDefault: () => {
    localStorage.setItem(STORAGE_KEYS.ANIMALS, JSON.stringify(INITIAL_ANIMALS))
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS))
    return true
  }
}

export default localDb
