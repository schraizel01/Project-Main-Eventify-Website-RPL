import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TextEventify from '../../assets/Text Eventify.png';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          
          <div className="text-center mb-12 flex justify-center">
            <img src={TextEventify} alt="Eventify" className="h-16 md:h-20 w-auto" />
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-16 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/5 rounded-tl-full"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Empowering Academic Excellence</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8 rounded-full"></div>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
                Eventify adalah platform manajemen acara digital yang dirancang untuk menyederhanakan agenda akademik bagi mahasiswa dan penyelenggara.
              </p>
              
              <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                Kami percaya bahwa pengetahuan harus mudah diakses. Oleh karena itu, kami membangun Eventify untuk menghubungkan institusi pendidikan dengan pembelajar yang antusias melalui pengalaman pendaftaran acara yang mulus, tanpa hambatan, dan tanpa batas.
              </p>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
