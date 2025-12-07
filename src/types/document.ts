export interface Document {
  id: string
  title: string
  link: string
  uploadedBy?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDocumentData {
  title: string
  link: string
  uploadedBy?: string
}

export interface UpdateDocumentData {
  title?: string
  link?: string
  uploadedBy?: string
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
  count?: number
}

export interface BulkCreateResponse {
  success: boolean
  message: string
  created: number
  errors: BulkError[]
  hasErrors: boolean
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
}

export interface DeleteAllResponse {
  success: boolean
  message: string
  count: number
}

