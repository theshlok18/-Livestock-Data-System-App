/**
 * Offline-First API Adapter for Android Phone Local Storage
 * Replaces network HTTP requests with instant local storage operations
 */
import localDb from './localDb'

export const api = {
  get: async (url) => {
    // Simulate instantaneous local response
    if (url === '/stats') {
      return { data: localDb.getStats() }
    }
    if (url === '/animals' || url.startsWith('/animals?')) {
      return { data: { animals: localDb.getAnimals() } }
    }
    if (url.startsWith('/animal/')) {
      const tag = url.split('/animal/')[1].split('?')[0]
      const found = localDb.getAnimalByTag(tag)
      return { data: { found: !!found, animal: found } }
    }
    if (url.startsWith('/search?')) {
      const params = new URLSearchParams(url.split('?')[1])
      const q = params.get('q') || ''
      const results = localDb.searchAnimals(q)
      return { data: { results } }
    }
    if (url.startsWith('/records/')) {
      const tag = url.split('/records/')[1].split('?')[0]
      const records = localDb.getRecordsForAnimal(tag)
      return { data: { records } }
    }
    return { data: {} }
  },

  post: async (url, data) => {
    if (url === '/animal') {
      // Handle FormData or JSON object
      let animalData = data
      if (data instanceof FormData) {
        animalData = {}
        for (let [k, v] of data.entries()) {
          animalData[k] = v
        }
      }
      const saved = localDb.saveAnimal(animalData)
      return { data: { success: true, animal: saved } }
    }
    if (url === '/record') {
      const saved = localDb.saveRecord(data)
      return { data: { success: true, record: saved } }
    }
    if (url === '/login') {
      return { data: { token: 'offline-local-token', user: { username: 'field_officer', full_name: 'Pralhad Patil' } } }
    }
    return { data: { success: true } }
  },

  put: async (url, data) => {
    return api.post(url, data)
  },

  delete: async (url) => {
    if (url.startsWith('/animal/')) {
      const tag = url.split('/animal/')[1]
      localDb.deleteAnimal(tag)
      return { data: { success: true } }
    }
    if (url.startsWith('/record/')) {
      const id = url.split('/record/')[1]
      localDb.deleteRecord(id)
      return { data: { success: true } }
    }
    return { data: { success: true } }
  }
}

export default api
