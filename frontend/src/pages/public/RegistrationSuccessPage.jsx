import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Calendar } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const RegistrationSuccessPage = () => {
  const location = useLocation();
  const eventTitle = location.state?.eventTitle;

  if (!eventTitle) {
    return <Navigate to="/events" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 mb-8">
            Anda telah berhasil terdaftar pada kegiatan <br/>
            <span className="font-bold text-gray-900">{eventTitle}</span>
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left flex items-start">
            <Calendar className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Notifikasi detail pendaftaran telah dibuat dalam sistem. Anda dapat melihat tiket dan detail kegiatan Anda kapan saja di halaman Riwayat Pendaftaran.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/registrations"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-secondary transition-colors"
            >
              Lihat Riwayat Pendaftaran
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link
              to="/events"
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Eksplorasi Kegiatan Lain
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegistrationSuccessPage;
