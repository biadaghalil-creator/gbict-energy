import { redirect } from 'next/navigation'

// Sign-up is part of the same design (login/sign-up toggle).
export default function SignupPage() {
  redirect('/auth/web-login.html')
}
