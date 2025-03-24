import { useState } from 'react'
import { RegisterFormData } from '@/types/auth'
import { authService } from '@/services/authService'

export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    first_name: '',
    last_name: '',
    tel: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง')
      setIsLoading(false)
      return
    }
    
    try {
      // 1. ลงทะเบียนผู้ใช้
      const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          tel: formData.tel
        }),
      })

      if (!registerResponse.ok) {
        throw new Error('Registration failed')
      }

      // 2. รับข้อมูลผู้ใช้ที่ลงทะเบียนเพื่อใช้ user_id
      const userData = await registerResponse.json()
      
      // 3. ทำการล็อกอินอัตโนมัติเพื่อรับ token
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })

      if (!loginResponse.ok) {
        throw new Error('Auto login failed')
      }

      const loginData = await loginResponse.json()

      // // ดึงข้อมูลผู้ใช้ที่ล็อกอิน (มี user id)
      // const loggedInUser = authService.getUser()

      // if (!loggedInUser || !loggedInUser.id) {
      //   console.error('ไม่พบ user_id ในข้อมูลผู้ใช้ที่ล็อกอิน');
      //   throw new Error('ไม่สามารถสร้างข้อมูล postdoc ได้เนื่องจากไม่มี user_id');
      // }
      // if (loggedInUser.is_staff) {
      //     window.location.href = '/admin-postdoc';
      //   } else {
      //     window.location.href = '/register-profile';
      //   }

      // 4. บันทึก tokens และข้อมูลผู้ใช้ลงใน cookies
      const tokens = {
        access: loginData.access,
        refresh: loginData.refresh
      }

      // ใช้ฟังก์ชันคล้ายกับ authService.saveTokens
      saveTokensToCookies(tokens)
      saveUserToCookies(loginData.user)
      
      // 5. สร้างข้อมูลพื้นฐานในตาราง postdoc
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/postdoc/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.access}`
          },
          body: JSON.stringify({
            user_id: loginData.user.id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone_number: formData.tel || ''
          }),
        })
      } catch (profileError) {
        // ล็อกข้อผิดพลาดแต่ไม่หยุดโปรเซสการลงทะเบียน
        console.error('Error creating initial postdoc profile:', profileError)
      }

      // 6. นำทางไปยังหน้าหลักหลังจากลงทะเบียนสำเร็จ
      window.location.href = '/admin-postdoc'
    } catch (error) {
      setError('การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง')
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ฟังก์ชันเพื่อบันทึก tokens ลงใน cookies (คล้ายกับใน authService)
  const saveTokensToCookies = (tokens: { access: string, refresh: string }) => {
    // สร้าง Cookies module จาก js-cookie
    const Cookies = require('js-cookie')
    
    Cookies.set('accessToken', tokens.access, {
      secure: process.env.NODE_ENV === 'production',
      expires: 7, // 7 days
      path: '/'
    })
    
    Cookies.set('refreshToken', tokens.refresh, {
      secure: process.env.NODE_ENV === 'production',
      expires: 7,
      path: '/'
    })
  }

  // ฟังก์ชันเพื่อบันทึกข้อมูลผู้ใช้ลงใน cookies
  const saveUserToCookies = (user: any) => {
    const Cookies = require('js-cookie')
    
    if (user && typeof user === 'object') {
      Cookies.set('user', JSON.stringify(user), {
        secure: process.env.NODE_ENV === 'production',
        expires: 7,
        path: '/'
      })
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
    showConfirmPassword,
    isLoading,
    error,
    setShowPassword,
    setShowConfirmPassword,
    handleSubmit,
    handleInputChange,
  }
}