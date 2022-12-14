import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import request from '../utils/axios';
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        // const decoded = jwtDecode<{ role: string }>(accessToken!);

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get('/users/me');
          const user = response.data;

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
        // if (decoded.role !== 'ADMIN') {
        //   dispatch({
        //     type: Types.Initial,
        //     payload: {
        //       isAuthenticated: false,
        //       user: null,
        //     },
        //   });
        // }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  // googleProvider
  const googleProvider = new GoogleAuthProvider();
  // auth
  const auth = getAuth();

  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then(async (result) => {
      const resultUser: any = result.user;

      const response = await request.post(`/oauth2/authorize`, {
        idToken: resultUser.accessToken,
      });
      const { accessToken } = response?.data?.data;
      const decoded = jwtDecode<{ role: string }>(accessToken!);
      console.log(decoded.role);
      if (decoded.role.toString() !== 'ADMIN') {
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
      setSession(accessToken);
      const res = await axios.get('/users/me');
      const user = res.data;
      console.log(user);

      dispatch({
        type: Types.Login,
        payload: {
          user,
        },
      });
    });
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/account/login', {
      email,
      password,
    });
    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: Types.Login,
      payload: {
        user,
      },
    });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        loginWithGoogle,
        user: {
          id: state?.user?.uid,
          email: state?.user?.email || '',
          photoURL: state?.user?.imageUrl || '',
          displayName: state?.user?.name || state?.user?.fullName || '',
          role: state?.user?.role || '',
          phoneNumber: state?.user?.phone || '',
          address: state?.user?.address || '',
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
