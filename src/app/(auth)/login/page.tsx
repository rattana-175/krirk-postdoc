import Image from 'next/image'
import { LoginForm } from '@/components/auth/login-form/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ | Postdoc ตรวจสอบนักวิจัย',
  description: 'เข้าสู่ระบบ Postdoc ตรวจสอบนักวิจัยและจัดการโปรไฟล์ของคุณ',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/login-bg.jpeg"
          alt="Students"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <Image
            src="/images/Logo-Krirk2-1.png"
            alt="Dekend Logo"
            width={150}
            height={40}
            className="w-[309px] h-[96px] object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-16 py-12">
        <LoginForm />
      </div>
    </div>
  )
} 