import { CertificateForm } from "@/components/user/certificate-form/CertificateForm"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เพิ่มประวัติการอบรม | Postdoc ตรวจสอบนักวิจัย',
  description: 'เพิ่มประวัติการอบรม Postdoc ตรวจสอบนักวิจัย',
}

export default function CertificatePage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <CertificateForm />
      </div>
    </div>
  )
} 