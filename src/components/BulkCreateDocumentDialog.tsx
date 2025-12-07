import { useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { documentService } from "@/services/documentService"
import type { BulkCreateResponse, CreateDocumentData, BulkError } from "@/types/document"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"

interface BulkCreateDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function BulkCreateDocumentDialog({
  open,
  onOpenChange,
  onSuccess,
}: BulkCreateDocumentDialogProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [replaceAll, setReplaceAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BulkCreateResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { success, error: toastError } = useToast()

  const handleCreate = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!jsonInput.trim()) {
        setError("JSON input is required")
        return
      }

      const documents: CreateDocumentData[] = JSON.parse(jsonInput)

      if (!Array.isArray(documents)) {
        setError("JSON must be an array of documents")
        return
      }

      if (documents.length === 0) {
        setError("Documents array cannot be empty")
        return
      }

      if (documents.length > 1000) {
        setError("Maximum 1000 documents allowed per request")
        return
      }

      const response = await documentService.bulkCreate(documents, replaceAll)
      setResult(response)
      if (response.success && !response.hasErrors) {
        success(response.message)
        setTimeout(() => {
          onSuccess()
          handleClose()
        }, 2000)
      } else if (response.hasErrors) {
        toastError(response.message || "Bulk create completed with errors")
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format")
        toastError("Invalid JSON format")
      } else {
        const errorMessage = err instanceof Error ? err.message : "Bulk create failed"
        setError(errorMessage)
        toastError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setJsonInput("")
    setReplaceAll(false)
    setResult(null)
    setError(null)
    onOpenChange(false)
  }

  const exampleJson = `[
  {
    "title": "Railway service rules",
    "link": "https://drive.google.com/file/d/1gWtQvFkoaLmr8eFv-sqWbtWol73Qx0pi/view?usp=sharing",
    "uploadedBy": "mipm2534"
  },
  {
    "title": "Prolong failure of Automatic Signals",
    "link": "https://drive.google.com/file/d/1ikaXEMGi63o-B_Ft4-YROaw_lflw7MSu/view?usp=sharing",
    "uploadedBy": "mipm2534"
  }
]`

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Create Documents</DialogTitle>
          <DialogDescription>
            Create multiple documents from JSON array (max 1000 documents)
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                JSON Array of Documents
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={exampleJson}
                className="w-full h-64 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 font-mono text-sm focus:border-blue-500 focus:outline-none resize-none"
              />
              <button
                type="button"
                onClick={() => setJsonInput(exampleJson)}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                Load example
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="replaceAllBulk"
                checked={replaceAll}
                onChange={(e) => setReplaceAll(e.target.checked)}
                className="rounded border-gray-700 bg-gray-800"
              />
              <label
                htmlFor="replaceAllBulk"
                className="text-sm text-gray-300 cursor-pointer"
              >
                Replace all existing documents (delete all before creating)
              </label>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-gray-700 bg-gray-800/50 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!jsonInput.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </span>
                ) : (
                  "Create Documents"
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`rounded-lg p-4 ${
                result.success && !result.hasErrors
                  ? "bg-green-500/10 border border-green-500/30"
                  : "bg-yellow-500/10 border border-yellow-500/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.success && !result.hasErrors ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                )}
                <span
                  className={`font-medium ${
                    result.success && !result.hasErrors
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {result.message}
                </span>
              </div>
            </div>

            {result.hasErrors && result.errors.length > 0 && (
              <Card className="backdrop-blur-xl bg-gray-900/50 border-gray-800/50">
                <CardContent className="pt-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Errors ({result.errors.length}):
                  </h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {result.errors.slice(0, 50).map((error: BulkError, index) => (
                      <div
                        key={index}
                        className="text-xs bg-red-500/10 border border-red-500/30 rounded p-2 text-red-400"
                      >
                        Row {error.row}: {error.error}
                      </div>
                    ))}
                    {result.errors.length > 50 && (
                      <div className="text-xs text-gray-400 text-center">
                        ... and {result.errors.length - 50} more errors
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter>
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

