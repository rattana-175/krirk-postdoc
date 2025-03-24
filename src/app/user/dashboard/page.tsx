import { UserDashboard } from '@/components/user/UserDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Postdoc ข้อมูลนักวิจัย',
  description: 'จัดการข้อมูลส่วนตัว  และติดตามสถานะของคุณ',
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <UserDashboard />
      </div>
    </div>
  )
} 