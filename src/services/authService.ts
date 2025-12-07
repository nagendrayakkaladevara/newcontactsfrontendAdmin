import type { User, LoginCredentials } from "@/types/auth"

class AuthService {
  private readonly VALID_USERNAME = "prabhu"
  private readonly VALID_PASSWORD = "8978280654"

  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (
      credentials.username === this.VALID_USERNAME &&
      credentials.password === this.VALID_PASSWORD
    ) {
      return {
        username: credentials.username,
      }
    }

    throw new Error("Invalid username or password")
  }

  async logout(): Promise<void> {
    // In a real app, this would call an API endpoint
    return Promise.resolve()
  }
}

export const authService = new AuthService()

