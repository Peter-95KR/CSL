import api from './api.service';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // URL이 올바른지 확인
    console.log('Login request to:', api.defaults.baseURL + '/auth/login');
    
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const getProfile = async (): Promise<AuthResponse> => {
  try {
    // Direct fetch instead of using api service
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch('http://localhost:3001/api/auth/profile', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};
