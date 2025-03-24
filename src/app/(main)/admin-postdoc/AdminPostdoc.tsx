"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from 'next/link'
import Cookies from "js-cookie"
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Education {
  id: number
  user_id: number
  level: string
  institution_name: string
  faculty: string
  field_of_study: string
  gpa: string
  status: string
  created_at: string
  updated_at: string
  user: number
}

interface Postdoc {
  id: number
  user_id: number
  education: Education | null
  first_name: string
  last_name: string
  gender: string
  birth_date: string
  nationality: string
  religion: string
  weight: string
  height: string
  english_level: string
  skills: string
  phone_number: string
  email: string
  address: string
  province: string
  district: string
  zipcode: string
  profile_picture: string
  created_at: string
  updated_at: string
  subdistrict: string
  position_type: string
  position_interest: string
  preferred_provinces: string
  user: number
}

export default function FindPostdocContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [postdocs, setPostdocs] = useState<Postdoc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  // Check if user is authorized to access this page
  useEffect(() => {
    const checkAdminAccess = () => {
      // Check if user is authenticated and has staff privileges
      const isAdmin = authService.checkAdminAccess()
      
      if (!isAdmin) {
        // If not authorized, redirect to login
        router.push('/login')
        return
      }
      
      setAuthorized(true)
    }
    
    checkAdminAccess()
  }, [router])

  // Modify the fetchPostdocs function to work with or without authentication
  const fetchPostdocs = async (query = "") => {
    setLoading(true)
    setError("")
    
    try {
      // รับ token จาก cookies สำหรับการรับรองตัวตน
      const token = Cookies.get("accessToken")
      
      // สร้าง URL สำหรับการค้นหา
      const searchUrl = query 
        ? `${API_URL}/postdoc/search/?q=${encodeURIComponent(query)}`
        : `${API_URL}/postdoc/`
      
      // Prepare headers with or without authentication token
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      
      // Only add Authorization header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
      
      // ทำการเรียก API พร้อมกับ headers
      const response = await fetch(searchUrl, {
        headers: headers,
      })
      
      if (!response.ok) {
      // ดึงข้อความผิดพลาดจาก response ถ้ามี
      const  errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      setPostdocs(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setLoading(false)
    }
  }

  // โหลดข้อมูลเมื่อคอมโพเนนต์โหลดครั้งแรกและเมื่อได้รับการอนุญาต
  useEffect(() => {
    if (authorized) {
      fetchPostdocs()
    }
  }, [authorized])

  // ค้นหาเมื่อกด Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchPostdocs(searchTerm)
    }
  }

  // แปลง string skills เป็น array
  const getSkillsArray = (skillsString: string): string[] => {
    if (!skillsString) return []
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill)
  }

  // สร้างชื่อเต็ม
  const getFullName = (postdoc: Postdoc): string => {
    return `${postdoc.first_name} ${postdoc.last_name}`
  }

  // สร้างข้อมูลสำหรับแสดงสถาบันการศึกษา
  const getInstitution = (postdoc: Postdoc): string => {
    return postdoc.education?.institution_name || "-"
  }

  // สร้างข้อมูลสำหรับแสดงสาขา
  const getMajor = (postdoc: Postdoc): string => {
    return postdoc.education?.field_of_study || postdoc.position_interest || "-"
  }

  // สร้าง URL สำหรับการดูโปรไฟล์
  const getProfileUrl = (postdocId: number): string => {
    return `/user/profile/${postdocId}`
  }

  // If not authorized yet, show loading state
  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
      </div>
    )
  }

  return (
    <div className="relative bg-white pt-24 pb-16">
      {/* ส่วนหัว */}
      <div className="text-center mb-12">
        <Link href="/register">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
            สร้างนักวิจัย
        </h1>
        </Link>
        <p className="text-lg text-gray-600">
            สร้างนักวิจัย Post-Doctor มหาวิทยาลัยเกริก
        </p>
      </div>

      {/* ช่องค้นหา */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ, มหาวิทยาลัย, สาขา หรือทักษะ"
            className="flex-1 bg-transparent border-0 focus:outline-none text-gray-900 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            onClick={() => fetchPostdocs(searchTerm)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            ค้นหา
          </button>
        </div>
      </div>

      {/* แสดงสถานะการโหลด */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      )}

      {/* แสดงข้อความผิดพลาด */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* แสดงผลการค้นหา */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postdocs.map((postdoc) => (
              <div
                key={postdoc.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                      {postdoc.profile_picture ? (
                        <Image
                          src={postdoc.profile_picture}
                          alt={getFullName(postdoc)}
                          fill
                          className="object-cover"
                          onError={() => {
                            // ในกรณีที่โหลดรูปภาพไม่สำเร็จ จะแสดงไอคอนแทน
                            console.error(`Failed to load image: ${postdoc.profile_picture}`);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getFullName(postdoc)}
                      </h3>
                      <p className="text-sm text-gray-500">{getInstitution(postdoc)}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600">{getMajor(postdoc)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getSkillsArray(postdoc.skills).map((skill, index) => (
                      <span
                        key={`${postdoc.id}-skill-${index}`}
                        className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <Link href={getProfileUrl(postdoc.id)}>
                    <button className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                      ดูโปรไฟล์
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* แสดงเมื่อไม่พบผลการค้นหา */}
      {!loading && !error && postdocs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">ไม่พบผลการค้นหา</p>
        </div>
      )}
    </div>
  )
}