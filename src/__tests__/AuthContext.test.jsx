import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    getMe: vi.fn(),
    register: vi.fn(),
  },
}));

const TestConsumer = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'AUTHENTICATED' : 'ANONYMOUS'}</span>
      <span data-testid="user-email">{user ? user.email : 'NONE'}</span>
      <button onClick={() => login('demo@fitai.com', 'Demo@123')}>
        Log In
      </button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes in unauthenticated state when storage is empty', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('ANONYMOUS');
    expect(screen.getByTestId('user-email')).toHaveTextContent('NONE');
  });

  it('updates state and persists token upon login and logout', async () => {
    const mockUser = {
      id: 1,
      email: 'demo@fitai.com',
      fullName: 'Demo User',
      role: 'ROLE_USER',
    };

    authApi.login.mockResolvedValueOnce({
      success: true,
      data: {
        token: 'mock-jwt-token',
        ...mockUser,
      },
    });

    authApi.getMe.mockResolvedValue({
      success: true,
      data: mockUser,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Log In').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('AUTHENTICATED');
    expect(screen.getByTestId('user-email')).toHaveTextContent('demo@fitai.com');
    expect(localStorage.getItem('fitai_token')).toBe('mock-jwt-token');

    await act(async () => {
      screen.getByText('Log Out').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('ANONYMOUS');
    expect(screen.getByTestId('user-email')).toHaveTextContent('NONE');
    expect(localStorage.getItem('fitai_token')).toBeNull();
  });
});
