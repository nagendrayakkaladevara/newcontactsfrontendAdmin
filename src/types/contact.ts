export interface Contact {
  id: string
  name: string
  phone: string
  bloodGroup?: string
  lobby?: string
  designation?: string
  createdAt: string
  updatedAt: string
}

export interface CreateContactData {
  name: string
  phone: string
  bloodGroup?: string
  lobby?: string
  designation?: string
}

export interface UpdateContactData {
  name?: string
  phone?: string
  bloodGroup?: string
  lobby?: string
  designation?: string
}

export interface ApiError {
  field?: string
  message: string
  type?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: ApiError[]
  pagination?: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface BulkUploadResponse {
  success: boolean
  message: string
  created: number
  errors: BulkError[]
  hasErrors: boolean
  partialUpload?: boolean
  connectionLost?: boolean
  report?: BulkReport
}

export interface BulkError {
  row: number
  error: string
  type?: string
  field?: string
}

export interface BulkReport {
  total: number
  created: number
  failed: number
  errorsByType?: Record<string, number>
  errorsByField?: Record<string, number>
  connectionLost?: boolean
  partialUpload?: boolean
  processedContacts?: number
  notProcessedContacts?: number
  message?: string
}

export interface BulkCreateResponse {
  success: boolean
  message: string
  created: number
  errors: BulkError[]
  hasErrors: boolean
}

export interface DeleteAllResponse {
  success: boolean
  message: string
  count: number
}

