import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authenticateUser from './authenticateUser';
 
const useAuthenticationCheck = () => {
    const location = useLocation();
    const navigate = useNavigate();
 
    useEffect(() => {
        if (location.pathname !== '/' && location.pathname !== '/signup') {
            authenticateUser(navigate);
        }
    }, [location, navigate]);
};
 
export default useAuthenticationCheck;