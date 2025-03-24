import { WorkHistoryForm } from "@/components/user/work-history-form/WorkHistoryForm"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เพิ่มประวัติการทำงาน | Postdoc ตรวจสอบนักวิจัย',
  description: 'เพิ่มประวัติการทำงาน ประสบการณ์ และผลงานที่ผ่านมาของคุณ',
}

export default function WorkHistoryPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <WorkHistoryForm />
      </div>
    </div>
  )
} 