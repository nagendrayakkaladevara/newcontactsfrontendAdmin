import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Contact, CreateContactData } from "@/types/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(15, "Phone number is too long")
    .regex(/^\+?[0-9]{1,15}$/, "Invalid phone number format"),
  bloodGroup: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val),
      "Invalid blood group"
    ),
  lobby: z.string().max(255, "Lobby is too long").optional(),
  designation: z.string().max(255, "Designation is too long").optional(),
})

type ContactFormValues = z.infer<typeof contactSchema>

interface ContactFormProps {
  initialData?: Contact
  onSubmit: (data: CreateContactData) => void
  onCancel: () => void
  loading?: boolean
}

export function ContactForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: ContactFormProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      bloodGroup: initialData?.bloodGroup || "",
      lobby: initialData?.lobby || "",
      designation: initialData?.designation || "",
    },
  })

  const handleSubmit = (values: ContactFormValues) => {
    onSubmit({
      name: values.name,
      phone: values.phone,
      bloodGroup: values.bloodGroup || undefined,
      lobby: values.lobby || undefined,
      designation: values.designation || undefined,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter name"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Phone *</FormLabel>
              <FormControl>
                <Input
                  placeholder="+1234567890"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Blood Group</FormLabel>
              <FormControl>
                <Input
                  placeholder="A+, A-, B+, B-, AB+, AB-, O+, O-"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lobby"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Lobby</FormLabel>
              <FormControl>
                <Input
                  placeholder="Department/Division"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Designation</FormLabel>
              <FormControl>
                <Input
                  placeholder="Job title/Position"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  {...field}
                />
              </FormControl>
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

