import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Document, CreateDocumentData } from "@/types/document"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const documentSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title must be less than 500 characters"),
  link: z.string().url("Invalid URL format").min(1, "Link is required"),
  uploadedBy: z.string().optional(),
})

type DocumentFormValues = z.infer<typeof documentSchema>

interface DocumentFormProps {
  initialData?: Document
  onSubmit: (data: CreateDocumentData) => void
  onCancel: () => void
  loading: boolean
}

export function DocumentForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: DocumentFormProps) {
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: initialData?.title || "",
      link: initialData?.link || "",
      uploadedBy: initialData?.uploadedBy || "",
    },
  })

  const handleSubmit = (values: DocumentFormValues) => {
    onSubmit({
      title: values.title,
      link: values.link,
      uploadedBy: values.uploadedBy || undefined,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter document title"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Document title (1-500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Link</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                URL to the document (e.g., Google Drive link)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="uploadedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Uploaded By (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter username"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription className="text-gray-500">
                Username of the person who uploaded the document
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

