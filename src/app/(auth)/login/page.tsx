import { redirect } from 'next/navigation'

// The web login = exactly the design provided by the user (public/auth/).
export default function LoginPage() {
  redirect('/auth/web-login.html')
}
