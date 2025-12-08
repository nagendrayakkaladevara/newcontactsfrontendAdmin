import { useState } from "react"
import { Upload, File, AlertCircle, CheckCircle2 } from "lucide-react"
import { contactService } from "@/services/contactService"
import type { BulkUploadResponse, BulkError } from "@/types/contact"
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
import { MultiStepLoader } from "@/components/ui/multi-step-loader"

interface BulkUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const uploadLoadingStates = [
  { text: "Preparing your file for upload..." },
  { text: "Validating file format and structure..." },
  { text: "Uploading contacts to the server..." },
  { text: "Processing contact data..." },
  { text: "Validating contact information..." },
  { text: "Creating contacts in database..." },
  { text: "Finalizing upload process..." },
  { text: "Almost done! Please wait..." },
]

export function BulkUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [replaceAll, setReplaceAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BulkUploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validExtensions = [".csv", ".xlsx", ".xls"]
      const fileExtension = selectedFile.name
        .substring(selectedFile.name.lastIndexOf("."))
        .toLowerCase()

      if (validExtensions.includes(fileExtension)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Only CSV and Excel files (.csv, .xlsx, .xls) are allowed")
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await contactService.bulkUpload(file, replaceAll)
      setResult(response)
      if (response.success && !response.hasErrors) {
        setTimeout(() => {
          onSuccess()
          handleClose()
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) {
      // Don't allow closing during upload
      return
    }
    setFile(null)
    setReplaceAll(false)
    setResult(null)
    setError(null)
    setLoading(false)
    onOpenChange(false)
  }

  const handleCancelUpload = () => {
    setLoading(false)
    setError("Upload cancelled by user")
  }

  return (
    <>
      <MultiStepLoader
        loadingStates={uploadLoadingStates}
        loading={loading}
        duration={2000}
        loop={true}
        onCancel={handleCancelUpload}
      />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent onClose={handleClose} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Contacts</DialogTitle>
          <DialogDescription>
            <p className="text-red-500 text-sm mb-2 font-bold">Make sure you internet connection is stable. It will take some time to upload the file.</p>
            <p>Upload a CSV or Excel file to import multiple contacts</p>
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select File (CSV, XLSX, XLS)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                    {file ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <File className="h-5 w-5" />
                        <span>{file.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Upload className="h-8 w-8" />
                        <span>Click to select file</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="replaceAll"
                checked={replaceAll}
                onChange={(e) => setReplaceAll(e.target.checked)}
                className="rounded border-gray-700 bg-gray-800"
              />
              <label
                htmlFor="replaceAll"
                className="text-sm text-gray-300 cursor-pointer"
              >
                Replace all existing contacts (delete all before uploading)
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
                onClick={handleUpload}
                disabled={!file || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Uploading...
                  </span>
                ) : (
                  "Upload"
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
              {result.report && (
                <div className="text-sm text-gray-300 mt-2 space-y-1">
                  <div>Total: {result.report.total}</div>
                  <div>Created: {result.report.created}</div>
                  {result.report.failed > 0 && (
                    <div>Failed: {result.report.failed}</div>
                  )}
                </div>
              )}
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
    </>
  )
}

