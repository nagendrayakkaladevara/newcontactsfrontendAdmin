import type {
  Contact,
  CreateContactData,
  UpdateContactData,
  ApiResponse,
  BulkUploadResponse,
  BulkCreateResponse,
  DeleteAllResponse,
} from "@/types/contact"
import { API_CONFIG, getAuthHeaders, getMultipartAuthHeaders } from "@/config/api"

class ContactService {
  private baseURL = `${API_CONFIG.baseURL}/api/contacts`
  private adminBaseURL = `${API_CONFIG.baseURL}/api/contacts/admin`

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useAdmin: boolean = false
  ): Promise<T> {
    const baseURL = useAdmin ? this.adminBaseURL : this.baseURL
    const url = `${baseURL}${endpoint}`
    const headers = getAuthHeaders()

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  }

  // Get all contacts
  async getAllContacts(): Promise<ApiResponse<Contact[]>> {
    return this.request<ApiResponse<Contact[]>>(
      `/all`,
      {
        method: "GET",
      },
      false
    )
  }

  // Create a single contact
  async createContact(data: CreateContactData): Promise<ApiResponse<Contact>> {
    return this.request<ApiResponse<Contact>>("/createContact", {
      method: "POST",
      body: JSON.stringify(data),
    }, true)
  }

  // Update a contact
  async updateContact(
    id: string,
    data: UpdateContactData
  ): Promise<ApiResponse<Contact>> {
    return this.request<ApiResponse<Contact>>(`/updateContact/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, true)
  }

  // Delete a contact
  async deleteContact(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/deleteContact/${id}`, {
      method: "DELETE",
    }, true)
  }

  // Bulk upload (CSV/Excel)
  async bulkUpload(
    file: File,
    replaceAll: boolean = false
  ): Promise<BulkUploadResponse> {
    const formData = new FormData()
    formData.append("file", file)

    const url = `${this.adminBaseURL}/bulk-upload?replaceAll=${replaceAll}`
    const headers = getMultipartAuthHeaders()

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })

    const data = await response.json()

    if (!response.ok && response.status !== 206) {
      // 206 is Partial Content (connection lost), which is still a valid response
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  }

  // Bulk create (JSON)
  async bulkCreate(
    contacts: CreateContactData[],
    replaceAll: boolean = false
  ): Promise<BulkCreateResponse> {
    return this.request<BulkCreateResponse>(
      `/bulk?replaceAll=${replaceAll}`,
      {
        method: "POST",
        body: JSON.stringify(contacts),
      },
      true
    )
  }

  // Delete all contacts
  async deleteAllContacts(): Promise<DeleteAllResponse> {
    return this.request<DeleteAllResponse>(
      `/deleteAllContacts?confirm=DELETE_ALL`,
      {
        method: "DELETE",
      },
      true
    )
  }
}

export const contactService = new ContactService()

