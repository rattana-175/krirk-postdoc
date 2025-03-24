import { Metadata } from 'next'
import FindInternshipContent from '@/app/(main)/find-postdoc/FindPostdocContent'

export const metadata: Metadata = {
  title: 'ค้นหานักวิจัย | Postdoc มหาวิทยาลัยเกริก',
  description: 'ค้นหานักวิจัย',
}

export default function FindInternshipPage() {
    return <FindInternshipContent />
}