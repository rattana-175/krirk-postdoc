import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-sm text-center text-gray-600">
          © Copyright {new Date().getFullYear()} Postdoc, <a href='https://www.krirk.ac.th'> www.krirk.ac.th </a>is owned and operated
        </div>
      </div>
    </footer>
  );
};

export default Footer