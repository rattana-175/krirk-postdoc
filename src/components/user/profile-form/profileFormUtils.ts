import { Postdoc } from "@/types/user"
import { userService } from "@/services/userService"
import Cookies from "js-cookie"
import { toast } from "sonner"

// ดึงข้อมูล user จาก cookies
export const getUserFromCookies = () => {
  const user = Cookies.get('user')
  return user ? JSON.parse(user) : null
}

// กำหนดตัวแปรสำหรับผูกกับฟอร์ม
export const getEmptyFormData = (): Postdoc => {
  const userData = getUserFromCookies()
  return {
    user_id: userData?.id || 0,
    first_name: "",
    last_name: "",
    gender: "male",
    birth_date: "",
    nationality: "",
    religion: "",
    weight: "",
    height: "",
    english_level: "good",
    skills: "",
    phone_number: "",
    email: "",
    profile_picture: "",
    position_type: "internship",
    position_interest: "",
    preferred_provinces: ""
  }
}

// Validation
export const validateForm = (formData: Postdoc): boolean => {
  if (!formData.first_name?.trim()) {
    toast.error("กรุณากรอกชื่อจริง")
    return false
  }
  if (!formData.last_name?.trim()) {
    toast.error("กรุณากรอกนามสกุล")
    return false
  }
  if (!formData.birth_day || !formData.birth_month || !formData.birth_year) {
    toast.error("กรุณาเลือกวันเกิด")
    return false
  }
  if (!formData.phone_number?.trim()) {
    toast.error("กรุณากรอกเบอร์โทรศัพท์")
    return false
  }
  if (!formData.email?.trim()) {
    toast.error("กรุณากรอกอีเมล")
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    toast.error("รูปแบบอีเมลไม่ถูกต้อง")
    return false
  }

  const phoneRegex = /^[0-9]{9,10}$/
  if (!phoneRegex.test(formData.phone_number)) {
    toast.error("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง")
    return false
  }

  return true
}

// API Calls
export const loadProfile = async (): Promise<Postdoc | null> => {
  try {
    const profile = await userService.getProfile()
    if (profile) {
      // แปลงวันที่จาก "2524-06-21" เป็นวันที่แยกส่วน
      const [year, month, day] = (profile.birth_date || '').split('-')
      const buddhistYear = parseInt(year) + 543 // แปลงปี ค.ศ. เป็น พ.ศ.

      // อัพเดทฟอร์มด้วยข้อมูลใหม่
      return {
        ...profile,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        gender: profile.gender || 'male',
        nationality: profile.nationality || '',
        religion: profile.religion || '',
        weight: profile.weight || '',
        height: profile.height || '',
        english_level: profile.english_level || 'good',
        skills: profile.skills || '',
        phone_number: profile.phone_number || '',
        email: profile.email || '',
        profile_picture: profile.profile_picture || '',
        position_interest: profile.position_interest || '',
        preferred_provinces: profile.preferred_provinces || '',
        // แยกเก็บวัน เดือน ปี เพื่อให้ select แต่ละตัวแสดงค่าถูกต้อง
        birth_day: day,
        birth_month: month,
        birth_year: buddhistYear.toString()
      }
    }
    return null
  } catch (error) {
    console.error("Error loading profile:", error)
    toast.error("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้")
    return null
  }
}

export const saveProfile = async (
  formData: Postdoc, 
  imageFile: File | null
): Promise<boolean> => {
  try {
    // แปลงวันที่กลับเป็นรูปแบบที่ API ต้องการ
    const buddhistYear = parseInt(formData.birth_year || '');
    const christianYear = buddhistYear - 543;
    const month = String(formData.birth_month).padStart(2, '0');
    const day = String(formData.birth_day).padStart(2, '0');
    
    const  updatedFormData = {
      ...formData,
      birth_date: `${christianYear}-${month}-${day}`
    };

    const profile = await userService.getProfile();

    // ถ้ามีข้อมูลโปรไฟล์อยู่แล้ว ให้อัพเดทข้อมูล
    if (profile) {
      await userService.updateProfile({...updatedFormData, id: profile.id});
      toast.success("บันทึกข้อมูลโปรไฟล์สำเร็จ");
    // ถ้ายังไม่มีข้อมูลโปรไฟล์ ให้สร้างข้อมูลใหม่
    } else {
      await userService.createProfile(updatedFormData);
      toast.success("สร้างโปรไฟล์สำเร็จ");
    }
    return true;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
    toast.error("ไม่สามารถบันทึกข้อมูลได้");
    return false;
  }
}