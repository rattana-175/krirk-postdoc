"use client"

import Image from 'next/image'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { userService } from '@/services/userService'
import { toast, Toaster } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

export function UserProfile() {
  // สถานะสำหรับเก็บข้อมูลและการทำงาน
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // ref สำหรับ input file
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ดึงข้อมูลโปรไฟล์เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await userService.getProfile()
        setProfileData(profile)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // ฟังก์ชันเมื่อคลิกปุ่มอัปโหลด
  const handleImageUploadClick = () => {
    fileInputRef.current?.click()
  }

  // ฟังก์ชันเมื่อมีการเลือกไฟล์
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // ตรวจสอบประเภทไฟล์
      if (!file.type.match('image/jpeg|image/png|image/webp')) {
        toast.error('กรุณาเลือกไฟล์รูปภาพ (JPEG, PNG, WEBP) เท่านั้น')
        return
      }
      
      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('ขนาดไฟล์ต้องไม่เกิน 5MB')
        return
      }
      
      // สร้าง URL สำหรับแสดงตัวอย่างรูปภาพ
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      // อัพโหลดรูปภาพ
      uploadImage(file)
    }
  }

  // ฟังก์ชันอัพโหลดรูปภาพไปยัง Supabase Storage
  const uploadImage = async (file: File) => {
    setUploading(true)
    
    try {
      // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
      const fileName = `${Date.now()}_${file.name}`
      
      console.log('Uploading file:', fileName)
      
      // อัพโหลดไฟล์ไปยัง Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })
        
      if (error) {
        console.error('Error uploading image:', error)
        toast.error('ไม่สามารถอัพโหลดรูปภาพได้')
        throw error
      }
      
      console.log('Upload successful:', data)
      
      // สร้าง URL สำหรับเข้าถึงรูปภาพ
      const { data: urlData } = supabase.storage
        .from('profile_images')
        .getPublicUrl(fileName)
        
      if (!urlData || !urlData.publicUrl) {
        throw new Error('ไม่สามารถสร้าง URL สำหรับรูปภาพได้')
      }
      
      console.log('Image URL:', urlData.publicUrl)
      
      // อัพเดทโปรไฟล์ด้วย URL ของรูปภาพใหม่
      const updatedProfile = await updateProfileImage(urlData.publicUrl)
      
      toast.success('อัพโหลดรูปภาพสำเร็จ')
      
      // อัพเดทข้อมูลโปรไฟล์ใน state
      setProfileData(updatedProfile)
    } catch (error) {
      console.error('Error in upload process:', error)
      toast.error('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ')
    } finally {
      setUploading(false)
    }
  }

  // ฟังก์ชันอัพเดทข้อมูลโปรไฟล์ในฐานข้อมูล
  const updateProfileImage = async (imageUrl: string) => {
    if (!profileData || !profileData.id) {
      throw new Error('ไม่พบข้อมูลโปรไฟล์')
    }
    
    try {
      const updatedProfile = {
        ...profileData,
        profile_picture: imageUrl
      }
      
      const result = await userService.updateProfile(updatedProfile)
      return result
    } catch (error) {
      console.error('Error updating profile with new image:', error)
      throw new Error('ไม่สามารถอัพเดทข้อมูลโปรไฟล์ได้')
    }
  }

  // ดึงข้อมูลผู้ใช้จาก Cookies เพื่อใช้เป็นข้อมูลสำรอง
  const user = Cookies.get('user')
  const userData = user ? JSON.parse(user) : null
  
  // ใช้รูปโปรไฟล์จากฐานข้อมูล หรือรูปเริ่มต้นถ้าไม่มี
  const profileImagePath = profileData?.profile_picture || userData?.profile_image || '/images/default-user.webp'

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : (
            <>
              <Image
                src={previewUrl || profileImagePath}
                alt="Profile"
                fill
                className="rounded-full object-cover bg-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/default-user.webp'
                }}
              />
              
              {/* Input สำหรับเลือกไฟล์ (ซ่อนไว้) */}
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              
              {/* ปุ่มสำหรับเปิด file dialog */}
              <button 
                onClick={handleImageUploadClick}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 disabled:bg-gray-500"
                aria-label="Upload photo"
              >
                {uploading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
        <div className="w-full space-y-3">
          <Link 
            href="/user/profile"
            className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            ข้อมูลส่วนตัว
          </Link>
          <Link 
            href="/user/education"
            className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            เพิ่มข้อมูลการศึกษา
          </Link>
          <Link 
            href="/user/certificate"
            className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            เพิ่มประวัติการอบรม
          </Link>
          <Link 
            href="/user/work-history"
            className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            เพิ่มประวัติการทำงาน
          </Link>
        </div>
      </div>
    </div>
  )
}