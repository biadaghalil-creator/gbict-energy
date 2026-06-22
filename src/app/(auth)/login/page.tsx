import { redirect } from 'next/navigation'

// De web-login = exact het door de gebruiker aangeleverde design (public/auth/).
export default function LoginPage() {
  redirect('/auth/web-login.html')
}
