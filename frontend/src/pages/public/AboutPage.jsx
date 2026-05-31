import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LogoEventify from '../../assets/Logo Eventify.png';
import TextEventify from '../../assets/Text Eventify.png';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0eef8] font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full flex flex-col items-center">

          {/* Logo + Text Eventify */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <img
              src={LogoEventify}
              alt="Logo Eventify"
              className="h-32 w-auto"
            />
            <img
              src={TextEventify}
              alt="Eventify"
              className="h-10 w-auto"
            />
          </div>

          {/* Gradient Paragraph Box */}
          <div
            className="w-full rounded-[40px] px-12 py-10 text-center text-[#1a0050] font-semibold text-base leading-relaxed shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #c5b3e6 0%, #9575cd 50%, #b39ddb 100%)',
            }}
          >
            Eventify adalah platform manajemen acara digital yang dirancang untuk
            menyederhanakan agenda akademik bagi mahasiswa dan penyelenggara. Dengan
            fokus pada efisiensi dan kejelasan, kami menyediakan ekosistem terintegrasi
            untuk mengeksplorasi seminar, mendaftar lokakarya secara instan, hingga
            mengelola sertifikasi otomatis. Visi kami adalah membantu Anda mengubah
            peluang belajar menjadi keahlian nyata melalui pengalaman yang modern dan
            terorganisir.
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;