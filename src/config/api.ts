// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  apiKey: import.meta.env.VITE_API_KEY || "",
  username: import.meta.env.VITE_API_USERNAME || "",
  password: import.meta.env.VITE_API_PASSWORD || "",
}

// Helper to create Basic Auth header
export function createBasicAuthHeader(username: string, password: string): string {
  const credentials = btoa(`${username}:${password}`)
  return `Basic ${credentials}`
}

// Get authentication headers
export function getAuthHeaders() {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  // Add API Key
  if (API_CONFIG.apiKey) {
    headers["X-API-Key"] = API_CONFIG.apiKey
  }

  // Add Basic Auth
  if (API_CONFIG.username && API_CONFIG.password) {
    headers["Authorization"] = createBasicAuthHeader(
      API_CONFIG.username,
      API_CONFIG.password
    )
  }

  return headers
}

// Get multipart headers (for file uploads)
export function getMultipartAuthHeaders() {
  const headers: HeadersInit = {}

  // Add API Key
  if (API_CONFIG.apiKey) {
    headers["X-API-Key"] = API_CONFIG.apiKey
  }

  // Add Basic Auth
  if (API_CONFIG.username && API_CONFIG.password) {
    headers["Authorization"] = createBasicAuthHeader(
      API_CONFIG.username,
      API_CONFIG.password
    )
  }

  return headers
}

