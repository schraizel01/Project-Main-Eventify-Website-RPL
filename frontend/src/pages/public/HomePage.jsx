import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EventCard from '../../components/EventCard';
import api from '../../services/api';
import { Search, Loader2, Compass } from 'lucide-react';
import LogoEventify from '../../assets/Logo Eventify.png';
import TextEventify from '../../assets/Text Eventify.png';
import HeroImage from '../../assets/hero-image.png';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/kegiatan', {
        params: { limit: 6 }
      });
      setEvents(response.data.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.get('/kegiatan', {
        params: { limit: 6, search: searchTerm, jenis: typeFilter }
      });
      setEvents(response.data.data);
    } catch (error) {
      console.error('Failed to search events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-[#f8f7ff] overflow-hidden py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="mb-12 lg:mb-0 pr-0 lg:pr-8">
              <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
                <img src={LogoEventify} alt="Logo" className="h-24 sm:h-32 md:h-40 w-auto drop-shadow-md -ml-2" />
                <img src={TextEventify} alt="Eventify" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto" />
              </div>
              
              <p className="mt-3 text-[#4A5568] sm:text-lg md:text-xl lg:mx-0 max-w-lg text-center lg:text-left leading-relaxed font-medium">
                Find seminars and workshops in one place and register in seconds. Empowering your academic journey with seamless event management.
              </p>
              
              <div className="mt-10 flex justify-center lg:justify-start">
                <Link
                  to="/events"
                  className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-2xl text-white bg-[#ab9afc] hover:bg-[#9783f9] shadow-lg transition-all hover:-translate-y-1"
                >
                  Explore Events
                  <Compass className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Content */}
            <div className="relative mx-auto w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border-8 border-white bg-white">
              <img
                className="w-full h-auto object-cover"
                src={HeroImage}
                alt="Laptop with academic items"
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* Available Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-extrabold text-gray-900">Available Events</h2>
            <p className="mt-3 text-gray-700 leading-relaxed text-sm sm:text-base">
              Explore and register for upcoming seminars and workshops to empower your educational journey. Unlock your full potential by gaining industry-relevant skills and connecting with experts who are shaping the future.
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">Type: All</option>
              <option value="Seminar">Seminar</option>
              <option value="Workshop">Workshop</option>
            </select>
            <button
              type="submit"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.kegiatan_id} event={event} />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                to="/events"
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                View All Events
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
