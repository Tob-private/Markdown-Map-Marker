import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { access_token, expires_at } = await req.json()

  const cookieStore = await cookies()

  if (!access_token) {
    // Logout: clear cookie
    cookieStore.delete('sb-access-token')
    return NextResponse.json({ ok: true })
  }

  // Set secure, HTTP-only cookie
  cookieStore.set('sb-access-token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: expires_at
      ? expires_at - Math.floor(Date.now() / 1000)
      : 60 * 60 * 24 * 7
  })

  return NextResponse.json({ ok: true })
}
