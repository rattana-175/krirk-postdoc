import Footer from "@/components/frontend/shared/Footer";
import Navbar from "@/components/frontend/shared/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <div>
        <Navbar />
        {children}
        <Footer />
      </div>

  )
}