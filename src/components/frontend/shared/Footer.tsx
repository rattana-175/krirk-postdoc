import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-sm text-center text-gray-600">
          © Copyright {new Date().getFullYear()} Postdoc, www.krirk.ac.th is owned and operated by Pasition Co., Ltd
        </div>
      </div>
    </footer>
  );
};

export default Footer