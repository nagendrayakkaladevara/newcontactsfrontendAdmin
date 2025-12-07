# Contacts Management Admin Frontend

A modern, clean React + TypeScript admin interface for managing contacts with full CRUD operations, bulk upload, and bulk create functionality.

## Features

- ✅ **Modern UI** - Clean, dark-themed interface with glassmorphism effects
- ✅ **Contact Management** - Create, read, update, and delete contacts
- ✅ **Bulk Operations** - Upload CSV/Excel files or create multiple contacts via JSON
- ✅ **Search & Filter** - Search contacts by name, phone, lobby, or designation
- ✅ **Authentication** - Secure login with protected routes
- ✅ **Error Handling** - Comprehensive error handling with user-friendly messages
- ✅ **Responsive Design** - Works on all screen sizes

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_KEY=your-api-key-here
VITE_API_USERNAME=your-username-here
VITE_API_PASSWORD=your-password-here
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Configuration

The application requires the following environment variables:

- `VITE_API_BASE_URL` - Base URL of your API (default: `http://localhost:3000`)
- `VITE_API_KEY` - API key for authentication
- `VITE_API_USERNAME` - Username for Basic Auth
- `VITE_API_PASSWORD` - Password for Basic Auth

**Note:** The API must support the endpoints documented in the admin API documentation. All endpoints require both API Key (via `X-API-Key` header) and Basic Authentication.

## Features Overview

### 1. Contact Management

- **Create Contact**: Add new contacts with name, phone, blood group, lobby, and designation
- **Update Contact**: Edit existing contact information
- **Delete Contact**: Remove individual contacts
- **View Contacts**: Browse all contacts in a searchable table

### 2. Bulk Upload

Upload CSV or Excel files to import multiple contacts at once:

- Supports `.csv`, `.xlsx`, and `.xls` formats
- Option to replace all existing contacts
- Detailed error reporting for failed imports
- Handles connection loss gracefully

**CSV Format:**
```csv
name,phone,bloodGroup,lobby,designation
John Doe,+1234567890,O+,Engineering,Senior Developer
Jane Smith,+0987654321,A-,Marketing,Manager
```

### 3. Bulk Create

Create multiple contacts from a JSON array:

- Maximum 1000 contacts per request
- Option to replace all existing contacts
- Detailed error reporting

**JSON Format:**
```json
[
  {
    "name": "John Doe",
    "phone": "+1234567890",
    "bloodGroup": "A+",
    "lobby": "Engineering",
    "designation": "Senior Developer"
  }
]
```

### 4. Delete All Contacts

⚠️ **Warning**: This operation permanently deletes all contacts and cannot be undone.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Table, etc.)
│   ├── ContactForm.tsx  # Form for creating/editing contacts
│   ├── BulkUploadDialog.tsx
│   └── BulkCreateDialog.tsx
├── config/
│   └── api.ts          # API configuration and auth helpers
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── ContactsPage.tsx # Main contacts management page
├── services/
│   ├── authService.ts
│   └── contactService.ts # API service for contacts
└── types/
    ├── auth.ts
    └── contact.ts       # TypeScript interfaces
```

## API Endpoints Used

- `POST /api/contacts/admin/createContact` - Create contact
- `PUT /api/contacts/admin/updateContact/:id` - Update contact
- `DELETE /api/contacts/admin/deleteContact/:id` - Delete contact
- `GET /api/contacts/admin/` - Get all contacts (if available)
- `POST /api/contacts/admin/bulk-upload` - Bulk upload CSV/Excel
- `POST /api/contacts/admin/bulk` - Bulk create from JSON
- `DELETE /api/contacts/admin/?confirm=DELETE_ALL` - Delete all contacts

## Authentication

The application uses a simple mock authentication for the login page. In production, you should integrate with your actual authentication system.

**Default Credentials:**
- Username: `prabhu`
- Password: `8978280654`

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Notes

- The `getAllContacts()` method in `contactService.ts` assumes a GET endpoint exists. If your API doesn't have this endpoint, you may need to implement a different approach or add the endpoint to your backend.
- All API requests include both API Key and Basic Authentication headers automatically.
- Error messages are displayed to users in a user-friendly format.
- The UI uses a dark theme optimized for the black background.

## License

MIT
