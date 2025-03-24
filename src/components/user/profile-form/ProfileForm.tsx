"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import { Postdoc } from "@/types/user"
import { PROVINCES, ENGLISH_LEVELS } from "@/types/profile"
import { 
  getEmptyFormData, 
  validateForm, 
  loadProfile, 
  saveProfile 
} from "@/components/user/profile-form/profileFormUtils"

export function ProfileForm() {
  // State
  const [formData, setFormData] = useState<Postdoc>(getEmptyFormData())
  const [isLoading, setIsLoading] = useState(false)

  // Effects - โหลดข้อมูลโปรไฟล์เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    const initializeForm = async () => {
      const profile = await loadProfile()
      if (profile) {
        setFormData(profile)
      }
    }
    
    initializeForm()
  }, [])

  // Handlers
  /**
   * จัดการการเปลี่ยนแปลงค่าในฟอร์ม
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'preferred_provinces' && value) {
      // ตรวจสอบว่ามีจังหวัดที่เลือกแล้วหรือไม่
      const currentProvinces = formData.preferred_provinces ? formData.preferred_provinces.split(',').filter(Boolean) : []
      
      // ตรวจสอบว่าเลือกได้ไม่เกิน 3 จังหวัด
      if (currentProvinces.length < 3 && !currentProvinces.includes(value)) {
        const newProvinces = [...currentProvinces, value].join(',')
        setFormData(prev => ({
          ...prev,
          preferred_provinces: newProvinces
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value ?? "" 
      }))
    }
  }

  /**
   * ลบจังหวัดที่เลือกออกจากรายการ
   */
  const handleRemoveProvince = (provinceToRemove: string) => {
    const currentProvinces = (formData.preferred_provinces || '').split(',').filter(Boolean)
    const newProvinces = currentProvinces.filter(p => p !== provinceToRemove).join(',')
    setFormData(prev => ({
      ...prev,
      preferred_provinces: newProvinces
    }))
  }

  /**
   * บันทึกข้อมูลฟอร์ม
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm(formData)) {
      return
    }
  
    setIsLoading(true)
    
    try {
      // ส่งข้อมูลฟอร์มไปให้ saveProfile
      await saveProfile(formData, null)
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * ล้างข้อมูลฟอร์ม
   */
  const handleReset = () => {
    setFormData(getEmptyFormData())
  }

  // Render helpers
  /**
   * แสดงส่วนเลือกเพศ
   */
  const renderGenderSelection = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        เพศ
      </label>
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange}
            className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500"
          />
          <span className="ml-2 text-gray-700">ชาย</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange}
            className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500"
          />
          <span className="ml-2 text-gray-700">หญิง</span>
        </label>
      </div>
    </div>
  )

  /**
   * แสดงส่วนเลือกวันเดือนปีเกิด
   */
  const renderBirthDateSelection = () => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          เกิดวันที่
        </label>
        <select
          name="birth_day"
          value={formData.birth_day || ''}
          onChange={handleChange}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-gray-900 px-2 py-2"
        >
          <option value="">วันที่</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day.toString().padStart(2, '0')}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          เดือน
        </label>
        <select
          name="birth_month"
          value={formData.birth_month || ''}
          onChange={handleChange}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-gray-900 px-2 py-2"
        >
          <option value="">เดือน</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month.toString().padStart(2, '0')}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          พ.ศ.
        </label>
        <select
          name="birth_year"
          value={formData.birth_year || ''}
          onChange={handleChange}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-gray-900 px-2 py-2"
        >
          <option value="">ปี พ.ศ.</option>
          {Array.from({ length: 50 }, (_, i) => 2567 - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  /**
   * แสดงส่วนเลือกระดับภาษาอังกฤษ
   */
  const renderEnglishLevelSelection = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        ระดับภาษาอังกฤษ
      </label>
      <div className="flex gap-4">
        {ENGLISH_LEVELS.map((level) => (
          <label key={level.value} className="flex items-center">
            <input
              type="radio"
              name="english_level"
              value={level.value}
              checked={formData.english_level === level.value}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500"
            />
            <span className="ml-2 text-gray-700">{level.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  /**
   * แสดงส่วนเลือกประเภทการสมัคร (ฝึกงาน/งานประจำ)
   */
  const renderPositionTypeSelection = () => (
    <div className="flex gap-4">
      <label className="flex items-center">
        <input
          type="radio"
          name="position_type"
          value="internship"
          checked={formData.position_type === "internship"}
          onChange={handleChange}
          className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500"
        />
        <span className="ml-2 text-gray-700">หาที่ฝึกงาน</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name="position_type"
          value="job"
          checked={formData.position_type === "job"}
          onChange={handleChange}
          className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500"
        />
        <span className="ml-2 text-gray-700">หางาน</span>
      </label>
    </div>
  )

  /**
   * แสดงส่วนเลือกจังหวัด
   */
  const renderProvinceSelection = () => {
    const selectedProvinces = (formData.preferred_provinces || '').split(',').filter(Boolean)
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          จังหวัดที่สนใจ (เลือกได้สูงสุด 3 จังหวัด)
        </label>
        <select 
          name="preferred_provinces"
          value="" // ตั้งค่าเป็นค่าว่างเพื่อให้ select กลับมาที่ตัวเลือกแรกหลังจากเลือก
          onChange={handleChange}
          className="w-full rounded-lg p-3 bg-white border text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">เลือกจังหวัด</option>
          {PROVINCES
            .filter(p => !selectedProvinces.includes(p))
            .map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
        </select>

        {/* แสดงจังหวัดที่เลือก */}
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedProvinces.map((province) => (
            <div 
              key={province}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
            >
              {province}
              <button
                type="button"
                onClick={() => handleRemoveProvince(province)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }
  // Main render
  return (
    <>
    <Toaster richColors position="top-right" />
    <form onSubmit={handleSubmit} className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">Profile Details</h2>
        
        {/* ข้อมูลส่วนตัว */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ชื่อจริง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name (姓名)
            </label>
            <Input
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              placeholder="First name"
            />
          </div>

          {/* นามสกุล */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <Input
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              placeholder="Last name"
            />
          </div>

          {/* เพศ */}
          {renderGenderSelection()}

          {/* วันเกิด */}
          {renderBirthDateSelection()}
        </div>

        {/* ข้อมูลเพิ่มเติม */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* สัญชาติ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สัญชาติ
            </label>
            <Input
              name="nationality"
              value={formData.nationality || ''}
              onChange={handleChange}
              placeholder="Nationality"
            />
          </div>

          {/* ศาสนา */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ศาสนา
            </label>
            <Input
              name="religion"
              value={formData.religion || ''}
              onChange={handleChange}
              placeholder="Religion"
            />
          </div>
          
          {/* น้ำหนัก */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              น้ำหนัก
            </label>
            <div className="relative">
              <Input
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                type="number"
                placeholder="Weight"
              />
              <span className="absolute right-3 top-2 text-gray-500">กก.</span>
            </div>
          </div>

          {/* ส่วนสูง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ส่วนสูง
            </label>
            <div className="relative">
              <Input
                name="height"
                value={formData.height || ''}
                onChange={handleChange}
                type="number"
                placeholder="Height"
              />
              <span className="absolute right-3 top-2 text-gray-500">ซม.</span>
            </div>
          </div>
        </div>

        {/* ระดับภาษาอังกฤษ */}
        {renderEnglishLevelSelection()}

        {/* ความถนัดและทักษะ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ความถนัดและทักษะ
          </label>
          <Input
            name="skills"
            value={formData.skills || ''}
            onChange={handleChange}
            placeholder="ระบุได้หลายอย่าง เช่น การสื่อสาร, การทำงานกลุ่ม, การคิดวิเคราะห์, การตัดสินใจ, การจัดการเวลา, การทำงานภายใต้ความกดัน"
          />
        </div>
        {/* ข้อมูลติดต่อ */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">ข้อมูลติดต่อ & ช่องทางติดตามผลงาน</h3>
          
          {/* เบอร์โทรศัพท์ */}
          <Input
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={handleChange}
            placeholder="เบอร์โทรศัพท์"
            type="tel"
          />

          {/* อีเมล */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <Input
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="อีเมล"
              type="email"
            />
          </div>
        </div>
        {/* ความต้องการ */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">ความต้องการ</h3>
          
          {/* ประเภทงาน */}
          {renderPositionTypeSelection()}

          {/* ตำแหน่งที่สนใจ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ตำแหน่งที่สนใจ
            </label>
            <Input
              name="position_interest"
              value={formData.position_interest || ''}
              onChange={handleChange}
              placeholder="ระบุได้หลายตำแหน่ง เช่น HR, บัญชี, ธุรการ"
            />
          </div>

          {/* จังหวัดที่สนใจ */}
          {renderProvinceSelection()}
        </div>
        {/* ปุ่มดำเนินการ */}
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            onClick={handleReset}
          >
            ล้างข้อมูล
          </Button>
        </div>
    </form>
    </>
    
  )
}