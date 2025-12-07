import { useNavigate } from "react-router-dom"
import { LogOut, Users, FileText } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function HomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
      
      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
              Home
            </h1>
            <p className="text-gray-400 text-sm">Welcome to your admin panel</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-gray-700 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600 transition-all duration-200 backdrop-blur-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {/* Contacts Card */}
          <Card 
            className="backdrop-blur-xl bg-gray-900/50 border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-700/50 cursor-pointer"
            onClick={() => navigate("/contacts")}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 backdrop-blur-sm border border-blue-500/30">
                  <Users className="h-7 w-7 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white mb-1">
                    Contacts
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    Manage your contacts database
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed mb-4">
                View, create, update, and delete contacts. Upload contacts in bulk via CSV/Excel or JSON.
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate("/contacts")
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full"
              >
                <Users className="mr-2 h-4 w-4" />
                Go to Contacts
              </Button>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card 
            className="backdrop-blur-xl bg-gray-900/50 border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-700/50 cursor-pointer"
            onClick={() => navigate("/documents")}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-green-500/20 to-teal-500/20 p-4 backdrop-blur-sm border border-green-500/30">
                  <FileText className="h-7 w-7 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white mb-1">
                    Documents
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    Manage your documents
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed mb-4">
                Upload, view, and manage your documents. Organize and access all your files in one place.
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate("/documents")
                }}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Go to Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

