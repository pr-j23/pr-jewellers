import { toast } from 'react-hot-toast';
import { loginSuccess, loginFailure, signupSuccess, signupFailure, logout, setLoading } from '../../store/slices/authSlice';

export const loginUser = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.email === email && storedUser.password === password) {
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          isAuthenticated: true,
        }));
        dispatch(loginSuccess({ ...storedUser, isAuthenticated: true }));
        toast.success('Successfully logged in!');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      dispatch(loginFailure({ message: error.message }));
      toast.error('Login failed: ' + error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const signupUser = ({ name, email, password }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const newUser = { id: Date.now(), name, email, password, role: 'USER', isAuthenticated: true };
      localStorage.setItem('user', JSON.stringify(newUser));
      dispatch(signupSuccess(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      dispatch(signupFailure({ message: error.message }));
      toast.error('Signup failed: ' + error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    localStorage.removeItem('user');
    dispatch(logout());
    toast.success('Successfully logged out!');
  };
};

export const refreshToken = () => {
  return (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        dispatch(loginSuccess(user));
      } else {
        throw new Error('No user found to refresh token');
      }
    } catch (error) {
      dispatch(loginFailure({ message: error.message }));
      toast.error('Token refresh failed: ' + error.message);
    }
  };
};

export const getStoredUser = () => {
  return (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        dispatch(loginSuccess(user));
      } else {
        dispatch(loginFailure({ message: 'No user found' }));
      }
    } catch (error) {
      console.error('Failed to retrieve stored user:', error);
      dispatch(loginFailure({ message: 'Failed to retrieve user' }));
    }
  };
};
