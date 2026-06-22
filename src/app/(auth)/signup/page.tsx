import { redirect } from 'next/navigation'

// Sign-up zit in hetzelfde design (login/sign-up toggle).
export default function SignupPage() {
  redirect('/auth/web-login.html')
}
