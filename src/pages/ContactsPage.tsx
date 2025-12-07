import { useState, useEffect, useRef, startTransition } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Upload,
  FileText,
  Trash2,
  Edit,
  Search,
  AlertTriangle,
  LogOut,
  Home,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { contactService } from "@/services/contactService"
import type { Contact, CreateContactData } from "@/types/contact"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ContactForm } from "@/components/ContactForm"
import { BulkUploadDialog } from "@/components/BulkUploadDialog"
import { BulkCreateDialog } from "@/components/BulkCreateDialog"
import { useToast } from "@/components/ui/toast"
import { Loader, PageLoader } from "@/components/ui/loader"

export function ContactsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false)
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)

  const { success, error, ToastContainer } = useToast()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  useEffect(() => {
    loadContacts()
  }, [])


  // Debounce search term with 1.5 second delay for filtering
  useEffect(() => {
    // If searchTerm is empty, update debouncedSearchTerm immediately
    if (searchTerm === "") {
      setDebouncedSearchTerm("")
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      return
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 1500)

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [searchTerm])

  // Check if search is in progress (when searchTerm differs from debouncedSearchTerm)
  const isSearching = searchTerm !== debouncedSearchTerm && searchTerm.length > 0

  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await contactService.getAllContacts()
      if (response.success && response.data) {
        setContacts(response.data)
      }
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Failed to load contacts"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CreateContactData) => {
    try {
      setActionLoading("create")
      const response = await contactService.createContact(data)
      if (response.success) {
        success("Contact created successfully")
        setIsCreateDialogOpen(false)
        await loadContacts()
      }
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Failed to create contact"
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdate = async (id: string, data: CreateContactData) => {
    try {
      setActionLoading(`update-${id}`)
      const response = await contactService.updateContact(id, data)
      if (response.success) {
        success("Contact updated successfully")
        setIsEditDialogOpen(false)
        setSelectedContact(null)
        await loadContacts()
      }
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Failed to update contact"
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!selectedContact) return
    try {
      setActionLoading(`delete-${selectedContact.id}`)
      await contactService.deleteContact(selectedContact.id)
      success("Contact deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedContact(null)
      await loadContacts()
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Failed to delete contact"
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteAll = async () => {
    try {
      setActionLoading("delete-all")
      await contactService.deleteAllContacts()
      success("All contacts deleted successfully")
      setIsDeleteAllDialogOpen(false)
      await loadContacts()
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Failed to delete all contacts"
      )
    } finally {
      setActionLoading(null)
    }
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      contact.phone.includes(debouncedSearchTerm) ||
      (contact.lobby &&
        contact.lobby.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
      (contact.designation &&
        contact.designation.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  )


  return (
    <div className="min-h-screen bg-black">
      <ToastContainer />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />

          <div className="relative container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                  Contacts Management
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage your contacts database
                </p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600 transition-all duration-200 backdrop-blur-sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              disabled={actionLoading !== null}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsBulkUploadOpen(true)}
              disabled={actionLoading !== null}
              className="border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsBulkCreateOpen(true)}
              disabled={actionLoading !== null}
              className="border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              Bulk Create
            </Button>
            {contacts.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setIsDeleteAllDialogOpen(true)}
                disabled={actionLoading !== null}
                className="border-red-700 bg-red-900/20 text-red-400 hover:bg-red-900/30 disabled:opacity-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6 backdrop-blur-xl bg-gray-900/50 border-gray-800/50">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search contacts by name, phone, lobby, or designation..."
                onInput={(e) => {
                  // Input updates immediately via native browser behavior
                  // Use startTransition to mark state update as non-urgent (doesn't block input)
                  const target = e.target as HTMLInputElement
                  startTransition(() => {
                    setSearchTerm(target.value)
                  })
                }}
                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 pl-10 pr-24 text-base text-white placeholder:text-gray-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <Loader size="sm" className="text-blue-400" />
                  <span className="text-xs text-gray-400">Searching...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card className="backdrop-blur-xl bg-gray-900/50 border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">
              Contacts ({contacts.length} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <PageLoader message="Loading contacts..." />
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? "No contacts match your search" : "No contacts found"}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-800/50">
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300">Phone</TableHead>
                        <TableHead className="text-gray-300">Blood Group</TableHead>
                        <TableHead className="text-gray-300">Lobby</TableHead>
                        <TableHead className="text-gray-300">Designation</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.map((contact) => (
                        <TableRow
                          key={contact.id}
                          className="border-gray-700 hover:bg-gray-800/50"
                        >
                          <TableCell className="text-white font-medium">
                            {contact.name}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {contact.phone}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {contact.bloodGroup || "-"}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {contact.lobby || "-"}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {contact.designation || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedContact(contact)
                                  setIsEditDialogOpen(true)
                                }}
                                disabled={actionLoading !== null}
                                className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                              >
                                {actionLoading === `update-${contact.id}` ? (
                                  <Loader size="sm" />
                                ) : (
                                  <Edit className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedContact(contact)
                                  setIsDeleteDialogOpen(true)
                                }}
                                disabled={actionLoading !== null}
                                className="border-red-700 bg-red-900/20 text-red-400 hover:bg-red-900/30 disabled:opacity-50"
                              >
                                {actionLoading === `delete-${contact.id}` ? (
                                  <Loader size="sm" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent onClose={() => setIsCreateDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Create New Contact</DialogTitle>
              <DialogDescription>
                Add a new contact to the database
              </DialogDescription>
            </DialogHeader>
            <ContactForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              loading={actionLoading === "create"}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent onClose={() => setIsEditDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
              <DialogDescription>
                Update contact information
              </DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <ContactForm
                initialData={selectedContact}
                onSubmit={(data) => handleUpdate(selectedContact.id, data)}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedContact(null)
                }}
                loading={actionLoading === `update-${selectedContact.id}`}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent onClose={() => setIsDeleteDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Delete Contact</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedContact?.name}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedContact(null)
                }}
                disabled={actionLoading !== null}
                className="border-gray-700 bg-gray-800/50 text-gray-300 disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={actionLoading !== null}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {actionLoading === `delete-${selectedContact?.id}` ? (
                  <Loader size="sm" className="mr-2" />
                ) : null}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete All Dialog */}
        <Dialog
          open={isDeleteAllDialogOpen}
          onOpenChange={setIsDeleteAllDialogOpen}
        >
          <DialogContent onClose={() => setIsDeleteAllDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Delete All Contacts
              </DialogTitle>
              <DialogDescription>
                This will permanently delete all {contacts.length} contacts from
                the database. This action cannot be undone. Are you absolutely
                sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteAllDialogOpen(false)}
                disabled={actionLoading !== null}
                className="border-gray-700 bg-gray-800/50 text-gray-300 disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAll}
                disabled={actionLoading !== null}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {actionLoading === "delete-all" ? (
                  <Loader size="sm" className="mr-2" />
                ) : null}
                Delete All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <BulkUploadDialog
          open={isBulkUploadOpen}
          onOpenChange={setIsBulkUploadOpen}
          onSuccess={() => {
            loadContacts()
            setIsBulkUploadOpen(false)
          }}
        />

        {/* Bulk Create Dialog */}
        <BulkCreateDialog
          open={isBulkCreateOpen}
          onOpenChange={setIsBulkCreateOpen}
          onSuccess={() => {
            loadContacts()
            setIsBulkCreateOpen(false)
          }}
        />
      </div>
    </div>
  )
}
