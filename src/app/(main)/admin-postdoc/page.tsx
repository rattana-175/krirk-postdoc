import { Metadata } from 'next'
import AdminPostdoc from '@/app/(main)/admin-postdoc/AdminPostdoc'

export const metadata: Metadata = {
  title: 'สร้างนักวิจัย | Postdoc มหาวิทยาลัยเกริก',
  description: 'สร้างนักวิจัย',
}

export default function FindPostdocContent1() {
    return <AdminPostdoc />
}