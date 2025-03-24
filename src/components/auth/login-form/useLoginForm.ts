import { useState } from 'react'
import { LoginFormData } from '@/types/auth'
import { authService } from '@/services/authService'

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // ดักจับทุกข้อผิดพลาดที่อาจเกิดขึ้น
      console.log('Attempting login with:', formData);
      
      const response = await authService.login(formData)
      console.log('Login response:', response);
      
      if (!response || !response.tokens || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      // บันทึกข้อมูลการล็อกอิน
      authService.saveTokens(response.tokens)
      authService.saveUser(response.user)
      
      // ตรวจสอบข้อมูลที่บันทึกแล้ว
      const savedUser = authService.getUser();
      console.log('Saved user data:', savedUser);
      
      // ใช้ฟังก์ชัน routeBasedOnRole เพื่อนำทางตามบทบาทของผู้ใช้
      authService.routeBasedOnRole()
      
    } catch (error) {
      console.error('Login error details:', error);
      setError('ข้อมูลเข้าสู่ระบบไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return {
    formData,
    showPassword,
    isLoading,
    error,
    setShowPassword,
    handleSubmit,
    handleInputChange,
  }
}