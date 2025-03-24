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
        const errorData = await registerResponse.json();
        throw new Error(errorData.detail || 'การลงทะเบียนล้มเหลว');
      }

      // 2. ล็อกอินอัตโนมัติ
      try {
        const loginResponse = await authService.autoLogin({
          username: formData.username,
          password: formData.password
        });
        
        // 3. ดึงข้อมูลผู้ใช้ที่ล็อกอินแล้ว (มี user id)
        const loggedInUser = authService.getUser();
        
        if (!loggedInUser || !loggedInUser.id) {
          console.error('ไม่พบ user_id ในข้อมูลผู้ใช้ที่ล็อกอิน');
          throw new Error('ไม่สามารถสร้างข้อมูล postdoc ได้เนื่องจากไม่มี user_id');
        }
        
        // 4. สร้างข้อมูลในตาราง postdoc
        const postdocResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/postdoc/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginResponse.tokens.access}`, // เพิ่ม token สำหรับการยืนยันตัวตน
          },
          body: JSON.stringify({
            user_id: loggedInUser.id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            gender: null,
            birth_date: null,
            position_interest: null,
            nationality: null,
            profile_picture: null
            // ส่งข้อมูลเฉพาะที่มีตอนลงทะเบียน ส่วนที่เหลือให้เป็น null
          }),
        });

        if (!postdocResponse.ok) {
          const postdocErrorData = await postdocResponse.json();
          console.error('ไม่สามารถสร้างข้อมูล postdoc ได้:', postdocErrorData);
          // ยังคงให้ผู้ใช้ไปหน้าถัดไปแม้จะสร้างข้อมูล postdoc ไม่สำเร็จ
        } else {
          console.log('บันทึกข้อมูล postdoc สำเร็จ');
        }
        
        // 5. นำทางไปยังหน้าที่ต้องการ (ตาม role)
        if (loggedInUser.is_staff) {
          window.location.href = '/admin-postdoc';
        } else {
          window.location.href = '/register-profile';
        }
        
      } catch (loginError) {
        console.error('Auto login failed:', loginError);
        // ถ้าล็อกอินอัตโนมัติล้มเหลว ให้นำทางไปยังหน้าล็อกอินแทน
        window.location.href = '/login';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง';
      setError(errorMessage);
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
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