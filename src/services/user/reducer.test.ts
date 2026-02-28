import { mockUser } from '@/__tests__/mocks';
// user.test.ts
import { describe, it, expect } from 'vitest';

import { login, logout, checkUserAuth, register, updateUser } from './actions';
import { userSlice, initialState } from './reducer';

const loginCredentials = { email: 'test@test.com', password: '123456' };
const registerCredentials = {
  email: 'test@test.com',
  password: '123456',
  name: 'Test User',
};
const updateCredentials = { name: 'Updated User' };

describe('User store and actions', () => {
  it('should return the initial state', () => {
    expect(userSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle resetUserError', () => {
    const stateWithError = {
      ...initialState,
      error: new Error('test error'),
    };

    const newState = userSlice.reducer(
      stateWithError,
      userSlice.actions.resetUserError()
    );
    expect(newState.error).toBeNull();
  });

  it('should handle logout.fulfilled', () => {
    const stateWithUser = {
      ...initialState,
      user: mockUser,
      isAuthChecked: true,
    };

    const newState = userSlice.reducer(
      stateWithUser,
      logout.fulfilled(undefined, '123', undefined)
    );
    expect(newState.user).toBeNull();
    expect(newState.isAuthChecked).toBe(true);
  });

  it('should handle login.pending/fulfilled/rejected', () => {
    // pending
    let newState = userSlice.reducer(
      initialState,
      login.pending('123', loginCredentials)
    );
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();

    // fulfilled
    newState = userSlice.reducer(
      newState,
      login.fulfilled(mockUser, '123', loginCredentials)
    );
    expect(newState.loading).toBe(false);
    expect(newState.isAuthChecked).toBe(true);
    expect(newState.user).toEqual(mockUser);

    // rejected
    newState = userSlice.reducer(
      newState,
      login.rejected(new Error('Login failed'), '123', loginCredentials)
    );
    expect(newState.loading).toBe(false);
    expect(newState.user).toBeNull();
    expect(newState.error?.message).toBe('Login failed');
  });

  it('should handle register.pending/fulfilled/rejected', () => {
    // pending
    let newState = userSlice.reducer(
      initialState,
      register.pending('123', registerCredentials)
    );
    expect(newState.loading).toBe(true);

    // fulfilled
    newState = userSlice.reducer(
      newState,
      register.fulfilled(mockUser, '123', registerCredentials)
    );
    expect(newState.isAuthChecked).toBe(true);
    expect(newState.user).toEqual(mockUser);

    // rejected
    newState = userSlice.reducer(
      newState,
      register.rejected(new Error('Register failed'), '123', registerCredentials)
    );
    expect(newState.user).toBeNull();
  });

  it('should handle updateUser.pending/fulfilled/rejected', () => {
    // pending
    let newState = userSlice.reducer(
      initialState,
      updateUser.pending('123', updateCredentials)
    );
    expect(newState.loading).toBe(true);

    // fulfilled
    newState = userSlice.reducer(
      newState,
      updateUser.fulfilled(mockUser, '123', updateCredentials)
    );
    expect(newState.user).toEqual(mockUser);
    expect(newState.loading).toBe(false);

    // rejected
    newState = userSlice.reducer(
      newState,
      updateUser.rejected(new Error('Update failed'), '123', updateCredentials)
    );
    expect(newState.user).toBeNull();
  });

  it('should handle checkUserAuth.pending/fulfilled/rejected', () => {
    // pending
    let newState = userSlice.reducer(
      initialState,
      checkUserAuth.pending('123', undefined)
    );
    expect(newState.isAuthChecked).toBe(false);

    // fulfilled
    newState = userSlice.reducer(
      newState,
      checkUserAuth.fulfilled(mockUser, '123', undefined)
    );
    expect(newState.user).toEqual(mockUser);
    expect(newState.isAuthChecked).toBe(true);

    // rejected
    newState = userSlice.reducer(
      newState,
      checkUserAuth.rejected(null, '123', undefined)
    );
    expect(newState.user).toBeNull();
    expect(newState.isAuthChecked).toBe(true);
  });
});
