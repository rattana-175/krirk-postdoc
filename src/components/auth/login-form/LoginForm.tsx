'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLoginForm } from '@/components/auth/login-form/useLoginForm'
import Link from 'next/link'

export function LoginForm() {
    const {
      formData,
      showPassword,
      isLoading,
      error,
      setShowPassword,
      handleSubmit,
      handleInputChange,
    } = useLoginForm()
  
    return (
      <div className="w-full max-w-md">
        <div className="mb-8">
        <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Return to HomePage
        </Link>
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-600 mt-2">Welcome back! Please login to continue.</p>
        </div>
  
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
  
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {/* Icon for show/hide password */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d={showPassword ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65" : "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"} />
                <path strokeLinecap="round" strokeLinejoin="round" d={showPassword ? "" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
              </svg>
            </button>
          </div>
        </div>
  
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                จดจำฉันไว้
              </label>
            </div>
  
            <Link href="/forgot-password" className="text-sm text-green-500 hover:text-green-600">
              ลืมรหัสผ่าน?
            </Link> */}
          </div>
  
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing Login...' : 'Login'}
          </Button>
  
          {/* <div className="mt-6 flex flex-col gap-4">
            <SocialButton provider="line" type="button">
              เข้าสู่ระบบด้วย LINE
            </SocialButton>
            <SocialButton provider="google" type="button">
              เข้าสู่ระบบด้วย GOOGLE
            </SocialButton>
          </div>
   */}
          {/* <p className="text-center text-gray-600 mt-6">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="text-green-500 hover:text-green-600">
              ลงทะเบียน
            </Link>
          </p> */}
        </form>
      </div>
    )
  } 