import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EventCard from '../../components/EventCard';
import api from '../../services/api';
import { Search, Loader2 } from 'lucide-react';

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const searchTerm = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || 'All';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [tempSearch, setTempSearch] = useState(searchTerm);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [page, typeFilter, searchParams.get('q')]); // Trigger when URL params change

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/kegiatan', {
        params: { limit: 9, page, search: searchTerm, jenis: typeFilter }
      });
      setEvents(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: tempSearch, type: typeFilter, page: 1 });
  };
  
  const updateType = (newType) => {
    setSearchParams({ q: searchTerm, type: newType, page: 1 });
  };
  
  const updatePage = (newPage) => {
    setSearchParams({ q: searchTerm, type: typeFilter, page: newPage });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center">Explore Academic Events</h1>
          <p className="mt-4 text-xl text-gray-500 text-center max-w-3xl mx-auto">
            Discover workshops, seminars, and conferences to expand your knowledge and network.
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                  placeholder="Search events, topics, or places..."
                  value={tempSearch}
                  onChange={(e) => setTempSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                id="type"
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
                value={typeFilter}
                onChange={(e) => updateType(e.target.value)}
              >
                <option value="All">Type: All</option>
                <option value="Seminar">Seminar</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full md:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.kegiatan_id} event={event} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => updatePage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updatePage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === i + 1
                          ? 'z-10 bg-primary/10 border-primary text-primary'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => updatePage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">No events found</h3>
            <p className="mt-2 text-gray-500">We couldn't find any events matching your criteria.</p>
            <button 
              onClick={() => setSearchParams({})}
              className="mt-6 text-primary hover:text-secondary font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default EventsPage;
