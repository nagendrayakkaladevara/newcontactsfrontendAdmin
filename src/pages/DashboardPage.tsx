import { useNavigate } from "react-router-dom"
import { LogOut, User, Users } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
      
      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
              Dashboard
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
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="backdrop-blur-xl bg-gray-900/50 border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-700/50 col-span-full md:col-span-2 lg:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 backdrop-blur-sm border border-blue-500/30">
                  <User className="h-7 w-7 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white mb-1">
                    Welcome, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.username}</span>!
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    You have successfully logged in to your account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed mb-6">
                This is your dashboard. You can start building your application from here. 
                Manage your contacts, view analytics, and access all administrative features.
              </p>
              <Button
                onClick={() => navigate("/contacts")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Contacts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

