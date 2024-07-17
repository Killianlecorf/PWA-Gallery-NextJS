import fetchApi from '@/utils/fetchApi';
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchApi('/user/isAuth', 'GET');

        if (response.ok) {
          const data = response.data;

          setIsAuthenticated(data.isAuthenticated);
        } else {
          console.error('Erreur de réponse:', response.message);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
};

export default useAuth;