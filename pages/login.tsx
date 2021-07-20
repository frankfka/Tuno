import {Magic} from "magic-sdk";
import { useState } from 'react'
import Router from 'next/router'
import {useUser} from "../client/hooks/auth/useUser";

const Login = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [email, setEmail] = useState('')

  async function handleSubmit() {

    const body = {
      email,
    }

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? '')
      const didToken = await magic.auth.loginWithMagicLink({
        email: body.email,
      })
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
        body: JSON.stringify(body),
      })
      if (res.status === 200) {
        console.log("Login success")
        Router.push('/')
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)

    }
  }

  return (
    <div>
      <label>
        <span>Email</span>
        <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
      </label>
      <div className="submit">
        <button type="submit" onClick={handleSubmit}>Sign Up / Login</button>
      </div>
    </div>
  )
}

export default Login
