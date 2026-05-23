
import { useState, useEffect } from 'react';
import api from '@/services/api';

export const useItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/itinerary');
      setItineraries(data.data.itineraries);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load itineraries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/api/itinerary/${id}`);
      setItineraries((prev) => prev.filter((it) => it._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Delete failed' };
    }
  };

  return { itineraries, loading, error, refetch: fetch, remove };
};

export const useItinerary = (id) => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/itinerary/${id}`);
        setItinerary(data.data.itinerary);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load itinerary');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { itinerary, loading, error };
};