// Settings Service for MelodicMart
import { fetchAPI } from './apiService';

// Settings API
export const settingsAPI = {
  // Get user settings
  getUserSettings: async () => {
    return fetchAPI('/settings');
  },

  // Update user settings
  updateUserSettings: async (data: any) => {
    return fetchAPI('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Update notification preferences
  updateNotifications: async (data: any) => {
    return fetchAPI('/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Update privacy settings
  updatePrivacy: async (data: any) => {
    return fetchAPI('/settings/privacy', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Update display preferences
  updateDisplay: async (data: any) => {
    return fetchAPI('/settings/display', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Update communication preferences
  updateCommunication: async (data: any) => {
    return fetchAPI('/settings/communication', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return fetchAPI('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Enable/disable 2FA
  updateTwoFactor: async (enabled: boolean) => {
    return fetchAPI('/auth/two-factor', {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    });
  },

  // Export user data
  exportData: async () => {
    return fetchAPI('/settings/export-data');
  },

  // Export chat history
  exportChatHistory: async () => {
    return fetchAPI('/settings/export-chat');
  },

  // Delete account
  deleteAccount: async (data: { password: string }) => {
    return fetchAPI('/auth/delete-account', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }
};