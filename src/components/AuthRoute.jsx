import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
 

const RouteGuard = ({ isProtected }) => {
    const { currentUser, loading } = useAuth();
    
    if (loading) {
        return <div className='p-6 text-center'>Loading...</div>;
    }
  
    if (isProtected) {
      if (currentUser) {
            return <Outlet />;
        } else {
            if (window.location.pathname !== '/login') {
                toast.error('Unauthorized! Please log in to access this page.');
            }
            return <Navigate to='/login' replace />;
        }
    } else {
        return( currentUser ? <Navigate to='/generate-pitch' replace /> : <Outlet />);
    }
};

export default RouteGuard;