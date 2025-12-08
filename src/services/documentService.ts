import type {
  Document,
  CreateDocumentData,
  UpdateDocumentData,
  ApiResponse,
  BulkCreateResponse,
  DeleteAllResponse,
} from "@/types/document"
import { API_CONFIG, getAuthHeaders } from "@/config/api"

class DocumentService {
  private baseURL = `${API_CONFIG.baseURL}/api/documents`

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = getAuthHeaders()

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok && response.status !== 206) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    // Check if API returned success: false even with HTTP 200
    if (data && typeof data === 'object' && 'success' in data && data.success === false) {
      throw new Error(data.message || "Operation failed")
    }

    return data
  }

  // Get all documents (no pagination)
  async getAllDocuments(): Promise<ApiResponse<Document[]>> {
    return this.request<ApiResponse<Document[]>>("/all", {
      method: "GET",
    })
  }

  // Get document by ID
  async getDocumentById(id: string): Promise<ApiResponse<Document>> {
    return this.request<ApiResponse<Document>>(`/${id}`, {
      method: "GET",
    })
  }

  // Search documents
  async searchDocuments(query: string): Promise<ApiResponse<Document[]>> {
    return this.request<ApiResponse<Document[]>>(`/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
    })
  }

  // Get document count
  async getDocumentCount(): Promise<ApiResponse<{ count: number }>> {
    return this.request<ApiResponse<{ count: number }>>("/count", {
      method: "GET",
    })
  }

  // Create a single document
  async createDocument(data: CreateDocumentData): Promise<ApiResponse<Document>> {
    return this.request<ApiResponse<Document>>("/admin/createDocument", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Update a document
  async updateDocument(
    id: string,
    data: UpdateDocumentData
  ): Promise<ApiResponse<Document>> {
    return this.request<ApiResponse<Document>>(`/admin/updateDocument/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Delete a document
  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/admin/deleteDocument/${id}`, {
      method: "DELETE",
    })
  }

  // Bulk create (JSON)
  async bulkCreate(
    documents: CreateDocumentData[],
    replaceAll: boolean = false
  ): Promise<BulkCreateResponse> {
    return this.request<BulkCreateResponse>(
      `/admin/bulk?replaceAll=${replaceAll}`,
      {
        method: "POST",
        body: JSON.stringify(documents),
      }
    )
  }

  // Delete all documents
  async deleteAllDocuments(): Promise<DeleteAllResponse> {
    return this.request<DeleteAllResponse>("/admin/deleteAllDocuments?confirm=DELETE_ALL", {
      method: "DELETE",
    })
  }
}

export const documentService = new DocumentService()

