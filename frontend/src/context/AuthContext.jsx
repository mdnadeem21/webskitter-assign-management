import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/axiosConfig';
import roles from '../services/role.json';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get('/profile/user', { withCredentials: true });
      if (data?.user) {
        const userRole = data.user.role;
        setUser({
          ...data.user,
          permissions: roles[userRole] || [], // Attach permissions from roles.json
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (formData) => {
    try {
      await api.post('/login/user', formData, { withCredentials: true });
      await fetchUserProfile();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout/user', {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);