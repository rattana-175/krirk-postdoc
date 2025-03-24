import { EducationForm } from "@/components/user/education-form/EducationForm"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เพิ่มข้อมูลการศึกษา | Postdoc ตรวจสอบนักวิจัย',
  description: 'เพิ่มประวัติการศึกษา วุฒิการศึกษา และผลการเรียนของคุณ ',
}

export default function EducationPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <EducationForm />
      </div>
    </div>
  )
} 