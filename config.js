// Berry Fansite API Configuration
export const API_CONFIG = {
  // Hyperdrive API base URL (will be updated when deployed)
  BASE_URL: 'http://localhost:8785', // Local development - hyperdrive
  // BASE_URL: 'https://your-hyperdrive-worker.workers.dev', // Production (to be updated)

  // API endpoints
  ENDPOINTS: {
    songlist: '/songlist',
    songlistArtists: '/songlist/artists',
    streamlist: '/streamlist',
    setlist: '/setlist',
    health: '/health'
  },

  // Request timeout (ms)
  TIMEOUT: 10000,

  // Retry configuration
  RETRY: {
    attempts: 3,
    delay: 1000 // Base delay, will be multiplied by attempt number
  }
}

// API request helper with error handling and retry
export async function apiRequest(method, endpoint, data = null, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  const config = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')) {
    config.body = JSON.stringify(data)
  }

  let lastError = null

  // Retry logic
  for (let attempt = 1; attempt <= API_CONFIG.RETRY.attempts; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result

    } catch (error) {
      lastError = error
      console.warn(`API request attempt ${attempt} failed:`, error.message)

      // Don't retry on client errors (4xx)
      if (error.message.includes('HTTP 4')) {
        break
      }

      // Wait before retrying (except on last attempt)
      if (attempt < API_CONFIG.RETRY.attempts) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY.delay * attempt))
      }
    }
  }

  throw lastError
}

// Loading state management
export class LoadingManager {
  constructor() {
    this.activeRequests = new Set()
  }

  start(requestId) {
    this.activeRequests.add(requestId)
    this.updateUI()
  }

  end(requestId) {
    this.activeRequests.delete(requestId)
    this.updateUI()
  }

  updateUI() {
    const isLoading = this.activeRequests.size > 0
    const loadingElements = document.querySelectorAll('.loading-indicator')

    loadingElements.forEach(el => {
      el.style.display = isLoading ? 'inline-block' : 'none'
    })

    // Update button states
    const buttons = document.querySelectorAll('button')
    buttons.forEach(btn => {
      if (btn.dataset.disableOnLoading) {
        btn.disabled = isLoading
      }
    })
  }
}

export const loadingManager = new LoadingManager()

// Error display helper
export function showError(message, type = 'danger') {
  const alertDiv = document.createElement('div')
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `

  const container = document.getElementById('setTableMsg') || document.getElementById('content')
  if (container) {
    container.appendChild(alertDiv)

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove()
      }
    }, 5000)
  }
}