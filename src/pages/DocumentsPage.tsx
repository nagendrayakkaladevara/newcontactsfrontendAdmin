import { useState, useEffect, useRef, startTransition } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  FileText,
  Trash2,
  Edit,
  Search,
  AlertTriangle,
  LogOut,
  Home,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { documentService } from "@/services/documentService"
import type { Document, CreateDocumentData } from "@/types/document"
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
import { DocumentForm } from "@/components/DocumentForm"
import { BulkCreateDocumentDialog } from "@/components/BulkCreateDocumentDialog"
import { useToast } from "@/components/ui/toast"
import { Loader, PageLoader } from "@/components/ui/loader"

export function DocumentsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)

  const { success, error, ToastContainer } = useToast()

  useEffect(() => {
    loadDocuments()
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

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const response = await documentService.getAllDocuments()
      if (response.success && response.data) {
        setDocuments(response.data)
      }
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Failed to load documents"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CreateDocumentData) => {
    try {
      setActionLoading("create")
      const response = await documentService.createDocument(data)
      if (response.success) {
        success("Document created successfully")
        setIsCreateDialogOpen(false)
        await loadDocuments()
      }
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to create document")
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdate = async (id: string, data: CreateDocumentData) => {
    try {
      setActionLoading(`update-${id}`)
      const response = await documentService.updateDocument(id, data)
      if (response.success) {
        success("Document updated successfully")
        setIsEditDialogOpen(false)
        setSelectedDocument(null)
        await loadDocuments()
      }
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to update document")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!selectedDocument) return
    try {
      setActionLoading(`delete-${selectedDocument.id}`)
      await documentService.deleteDocument(selectedDocument.id)
      success("Document deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedDocument(null)
      await loadDocuments()
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to delete document")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteAll = async () => {
    try {
      setActionLoading("delete-all")
      await documentService.deleteAllDocuments()
      success("All documents deleted successfully")
      setIsDeleteAllDialogOpen(false)
      await loadDocuments()
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Failed to delete all documents"
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const filteredDocuments = documents.filter(
    (document) =>
      document.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (document.uploadedBy &&
        document.uploadedBy.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
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
              Documents Management
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your documents database
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
              onClick={() => navigate("/")}
              variant="outline"
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
              Add Document
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
            {documents.length > 0 && (
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
                placeholder="Search documents by title or uploaded by..."
                onInput={(e) => {
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

        {/* Documents Table */}
        <Card className="backdrop-blur-xl bg-gray-900/50 border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">
              Documents ({documents.length} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <PageLoader message="Loading documents..." />
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? "No documents match your search" : "No documents found"}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-800/50">
                        <TableHead className="text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-300">Link</TableHead>
                        <TableHead className="text-gray-300">Uploaded By</TableHead>
                        <TableHead className="text-gray-300">Created At</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((document) => (
                        <TableRow
                          key={document.id}
                          className="border-gray-700 hover:bg-gray-800/50"
                        >
                          <TableCell className="text-white font-medium">
                            {document.title}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <a
                              href={document.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              <span className="truncate max-w-xs">{document.link}</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {document.uploadedBy || "-"}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(document.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDocument(document)
                                  setIsEditDialogOpen(true)
                                }}
                                disabled={actionLoading !== null}
                                className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                              >
                                {actionLoading === `update-${document.id}` ? (
                                  <Loader size="sm" />
                                ) : (
                                  <Edit className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDocument(document)
                                  setIsDeleteDialogOpen(true)
                                }}
                                disabled={actionLoading !== null}
                                className="border-red-700 bg-red-900/20 text-red-400 hover:bg-red-900/30 disabled:opacity-50"
                              >
                                {actionLoading === `delete-${document.id}` ? (
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
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>
                Add a new document to the database
              </DialogDescription>
            </DialogHeader>
            <DocumentForm
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
              <DialogTitle>Edit Document</DialogTitle>
              <DialogDescription>
                Update document information
              </DialogDescription>
            </DialogHeader>
            {selectedDocument && (
              <DocumentForm
                initialData={selectedDocument}
                onSubmit={(data) => handleUpdate(selectedDocument.id, data)}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedDocument(null)
                }}
                loading={actionLoading === `update-${selectedDocument.id}`}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent onClose={() => setIsDeleteDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Delete Document</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedDocument?.title}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedDocument(null)
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
                {actionLoading === `delete-${selectedDocument?.id}` ? (
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
                Delete All Documents
              </DialogTitle>
              <DialogDescription>
                This will permanently delete all {documents.length} documents from
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

        {/* Bulk Create Dialog */}
        <BulkCreateDocumentDialog
          open={isBulkCreateOpen}
          onOpenChange={setIsBulkCreateOpen}
          onSuccess={() => {
            loadDocuments()
            setIsBulkCreateOpen(false)
          }}
        />
      </div>
    </div>
  )
}
