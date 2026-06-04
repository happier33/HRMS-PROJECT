/**
 * HRMS Global Store
 * Implements Redux-like state management using React Context + useReducer.
 * Combines auth, ui, and data slices into a single store.
 */
import React, { createContext, useReducer, useContext, useCallback, useMemo, useEffect } from 'react';

// ── Types ──
export type UserRole = 'ADMIN' | 'HR' | 'DEMOADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  position?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  forgotPasswordStatus: 'idle' | 'loading' | 'success' | 'error';
  resetPasswordStatus: 'idle' | 'loading' | 'success' | 'error';
  forgotPasswordError?: string | null;
  resetPasswordError?: string | null;
}

export interface UIState {
  sidebarCollapsed: boolean;
  activeMenu: string | null;
  floatingPanelOpen: string | null;
  currentPage: string;
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>;
}

export interface AppState {
  auth: AuthState;
  ui: UIState;
}

// ── Default initial state (unauthenticated) ──
const defaultInitialState: AppState = {
  auth: {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    forgotPasswordStatus: 'idle',
    resetPasswordStatus: 'idle',
    forgotPasswordError: null,
    resetPasswordError: null,
  },
  ui: {
    sidebarCollapsed: false,
    activeMenu: 'dashboard',
    floatingPanelOpen: null,
    currentPage: 'login',
    toasts: [],
  },
};

// ── Hydrated initial state — reads from localStorage synchronously before first render ──
function getHydratedInitialState(): AppState {
  try {
    const token = localStorage.getItem('hrms_token');
    const userJson = localStorage.getItem('hrms_user');
    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      return {
        ...defaultInitialState,
        auth: {
          ...defaultInitialState.auth,
          user,
          accessToken: token,
          isAuthenticated: true,
        },
        ui: {
          ...defaultInitialState.ui,
          currentPage: 'dashboard',
        },
      };
    }
  } catch {
    // Corrupt storage — fall through to default
  }
  return defaultInitialState;
}

// ── Action Types ──
type Action =
  | { type: 'AUTH_LOGIN_START' }
  | { type: 'AUTH_LOGIN_SUCCESS'; payload: { user: User; accessToken: string } }
  | { type: 'AUTH_LOGIN_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_TOKEN_REFRESHED'; payload: string }
  | { type: 'AUTH_FORGOT_PASSWORD_START' }
  | { type: 'AUTH_FORGOT_PASSWORD_SUCCESS' }
  | { type: 'AUTH_FORGOT_PASSWORD_FAILURE'; payload: string }
  | { type: 'AUTH_RESET_PASSWORD_START' }
  | { type: 'AUTH_RESET_PASSWORD_SUCCESS' }
  | { type: 'AUTH_RESET_PASSWORD_FAILURE'; payload: string }
  | { type: 'UI_TOGGLE_SIDEBAR' }
  | { type: 'UI_SET_ACTIVE_MENU'; payload: string }
  | { type: 'UI_SET_FLOATING_PANEL'; payload: string | null }
  | { type: 'UI_SET_CURRENT_PAGE'; payload: string }
  | { type: 'UI_ADD_TOAST'; payload: { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' } }
  | { type: 'UI_REMOVE_TOAST'; payload: string };

// ── Reducer ──
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'AUTH_LOGIN_START':
      return { ...state, auth: { ...state.auth, isLoading: true, error: null } };
    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload.user,
          accessToken: action.payload.accessToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      };
    case 'AUTH_LOGIN_FAILURE':
      return { ...state, auth: { ...state.auth, isLoading: false, error: action.payload } };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        auth: { ...defaultInitialState.auth },
        ui: { ...state.ui, currentPage: 'login' },
      };
    case 'AUTH_TOKEN_REFRESHED':
      return { ...state, auth: { ...state.auth, accessToken: action.payload } };

    // ── Forgot password ──
    case 'AUTH_FORGOT_PASSWORD_START':
      return { ...state, auth: { ...state.auth, forgotPasswordStatus: 'loading', forgotPasswordError: null } };
    case 'AUTH_FORGOT_PASSWORD_SUCCESS':
      return { ...state, auth: { ...state.auth, forgotPasswordStatus: 'success' } };
    case 'AUTH_FORGOT_PASSWORD_FAILURE':
      return { ...state, auth: { ...state.auth, forgotPasswordStatus: 'error', forgotPasswordError: action.payload } };

    // ── Reset password ──
    case 'AUTH_RESET_PASSWORD_START':
      return { ...state, auth: { ...state.auth, resetPasswordStatus: 'loading', resetPasswordError: null } };
    case 'AUTH_RESET_PASSWORD_SUCCESS':
      return { ...state, auth: { ...state.auth, resetPasswordStatus: 'success' } };
    case 'AUTH_RESET_PASSWORD_FAILURE':
      return { ...state, auth: { ...state.auth, resetPasswordStatus: 'error', resetPasswordError: action.payload } };

    case 'UI_TOGGLE_SIDEBAR':
      return { ...state, ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed } };
    case 'UI_SET_ACTIVE_MENU':
      return { ...state, ui: { ...state.ui, activeMenu: action.payload } };
    case 'UI_SET_FLOATING_PANEL':
      return { ...state, ui: { ...state.ui, floatingPanelOpen: action.payload } };
    case 'UI_SET_CURRENT_PAGE':
      return {
        ...state,
        ui: {
          ...state.ui,
          currentPage: action.payload,
          activeMenu: action.payload.split('/')[0] || action.payload,
          floatingPanelOpen: null,
        },
      };
    case 'UI_ADD_TOAST':
      return { ...state, ui: { ...state.ui, toasts: [...state.ui.toasts, action.payload] } };
    case 'UI_REMOVE_TOAST':
      return { ...state, ui: { ...state.ui, toasts: state.ui.toasts.filter(t => t.id !== action.payload) } };
    default:
      return state;
  }
}

// ── Context ──
interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ── Provider ──
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Third-arg lazy initializer: runs once synchronously before the first render
  const [state, rawDispatch] = useReducer(appReducer, undefined, getHydratedInitialState);

  // Enhanced dispatch: clears localStorage on logout so tokens never survive past sign-out
  const dispatch = useCallback((action: Action) => {
    if (action.type === 'AUTH_LOGOUT') {
      localStorage.removeItem('hrms_token');
      localStorage.removeItem('hrms_user');
    }
    rawDispatch(action);
  }, []);

  // Bridge RTK Query layer → React Context via custom DOM events
  useEffect(() => {
    const handleForceLogout = () => {
      dispatch({ type: 'AUTH_LOGOUT' });
    };
    const handleTokenRefreshed = (e: Event) => {
      const detail = (e as CustomEvent<{ accessToken: string }>).detail;
      if (detail?.accessToken) {
        rawDispatch({ type: 'AUTH_TOKEN_REFRESHED', payload: detail.accessToken });
      }
    };

    window.addEventListener('hrms:force-logout', handleForceLogout);
    window.addEventListener('hrms:token-refreshed', handleTokenRefreshed);
    return () => {
      window.removeEventListener('hrms:force-logout', handleForceLogout);
      window.removeEventListener('hrms:token-refreshed', handleTokenRefreshed);
    };
  }, [dispatch]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

// ── Hooks ──
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}

export function useAuth() {
  const { state, dispatch } = useStore();

  const startForgotPassword = () => dispatch({ type: 'AUTH_FORGOT_PASSWORD_START' });
  const successForgotPassword = () => dispatch({ type: 'AUTH_FORGOT_PASSWORD_SUCCESS' });
  const failForgotPassword = (message: string) => dispatch({ type: 'AUTH_FORGOT_PASSWORD_FAILURE', payload: message });

  const startResetPassword = () => dispatch({ type: 'AUTH_RESET_PASSWORD_START' });
  const successResetPassword = () => dispatch({ type: 'AUTH_RESET_PASSWORD_SUCCESS' });
  const failResetPassword = (message: string) => dispatch({ type: 'AUTH_RESET_PASSWORD_FAILURE', payload: message });

  return {
    auth: state.auth,
    dispatch,
    startForgotPassword,
    successForgotPassword,
    failForgotPassword,
    startResetPassword,
    successResetPassword,
    failResetPassword,
  };
}

export function useUI() {
  const { state, dispatch } = useStore();

  const setCurrentPage = useCallback((page: string) => {
    dispatch({ type: 'UI_SET_CURRENT_PAGE', payload: page });
  }, [dispatch]);

  const setFloatingPanel = useCallback((panel: string | null) => {
    dispatch({ type: 'UI_SET_FLOATING_PANEL', payload: panel });
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'UI_TOGGLE_SIDEBAR' });
  }, [dispatch]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).slice(2);
    dispatch({ type: 'UI_ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'UI_REMOVE_TOAST', payload: id }), 4000);
  }, [dispatch]);

  return {
    ui: state.ui,
    setCurrentPage,
    setFloatingPanel,
    toggleSidebar,
    addToast,
  };
}
