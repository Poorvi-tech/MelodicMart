'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Bell, 
  Lock, 
  Palette, 
  Shield, 
  CreditCard, 
  Globe, 
  Smartphone, 
  Download, 
  Upload, 
  Trash2, 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  MapPin,
  Camera,
  Clock,
  Calendar,
  Zap,
  Wifi,
  Database,
  HardDrive,
  RefreshCw,
  LogOut,
  Phone
} from 'lucide-react';
import { authAPI } from '@/lib/apiService';
import { settingsAPI } from '@/lib/settingsService';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: ''
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    productUpdates: true,
    promotionalEmails: false,
    newsletter: true
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    activityStatus: true,
    searchVisibility: true
  });

  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'system',
    language: 'en',
    fontSize: 'medium',
    animations: true
  });

  // Communication preferences
  const [communicationSettings, setCommunicationSettings] = useState({
    preferredContact: 'email',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    newsletter: true,
    productUpdates: true,
    marketingCommunications: false,
    supportUpdates: true
  });

  // Load user profile and settings on component mount
  useEffect(() => {
    const fetchProfileAndSettings = async () => {
      try {
        setLoading(true);
        const profileData = await authAPI.getProfile();
        setUser(profileData);
        
        // Initialize account settings
        setAccountSettings({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          dateOfBirth: profileData.dateOfBirth || '',
          gender: profileData.gender || '',
          bio: profileData.bio || ''
        });

        // Fetch user settings from backend
        try {
          const settingsData = await settingsAPI.getUserSettings();
          
          // Initialize notification settings
          if (settingsData.notifications) {
            setNotificationSettings({
              emailNotifications: settingsData.notifications.emailNotifications ?? true,
              smsNotifications: settingsData.notifications.smsNotifications ?? true,
              pushNotifications: settingsData.notifications.pushNotifications ?? true,
              orderUpdates: settingsData.notifications.orderUpdates ?? true,
              productUpdates: settingsData.notifications.productUpdates ?? true,
              promotionalEmails: settingsData.notifications.promotionalEmails ?? false,
              newsletter: settingsData.notifications.newsletter ?? true
            });
          }

          // Initialize privacy settings
          if (settingsData.privacy) {
            setPrivacySettings({
              profileVisibility: settingsData.privacy.profileVisibility || 'public',
              activityStatus: settingsData.privacy.activityStatus ?? true,
              searchVisibility: settingsData.privacy.searchVisibility ?? true
            });
          }

          // Initialize display settings
          let themeToApply = 'system';
          if (settingsData.display) {
            setDisplaySettings({
              theme: settingsData.display.theme || 'system',
              language: settingsData.display.language || 'en',
              fontSize: settingsData.display.fontSize || 'medium',
              animations: settingsData.display.animations ?? true
            });
            themeToApply = settingsData.display.theme || 'system';
          } else {
            // Initialize display settings from localStorage or system preference
            const savedTheme = localStorage.getItem('theme') || 'system';
            const savedLanguage = localStorage.getItem('language') || 'en';
            const savedFontSize = localStorage.getItem('fontSize') || 'medium';
            const savedAnimations = localStorage.getItem('animations') === 'false' ? false : true;
          
            setDisplaySettings({
              theme: savedTheme,
              language: savedLanguage,
              fontSize: savedFontSize,
              animations: savedAnimations
            });
            themeToApply = savedTheme;
          }

          // Initialize communication settings
          if (settingsData.communication) {
            setCommunicationSettings({
              preferredContact: settingsData.communication.preferredContact || 'email',
              timezone: settingsData.communication.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
              newsletter: settingsData.communication.newsletter ?? true,
              productUpdates: settingsData.communication.productUpdates ?? true,
              marketingCommunications: settingsData.communication.marketingCommunications ?? false,
              supportUpdates: settingsData.communication.supportUpdates ?? true
            });
          }
          
          // Apply theme immediately
          applyTheme(themeToApply);
        } catch (settingsError) {
          console.error('Failed to load settings:', settingsError);
          // Initialize with default values if settings load fails
          const savedTheme = localStorage.getItem('theme') || 'system';
          const savedLanguage = localStorage.getItem('language') || 'en';
          const savedFontSize = localStorage.getItem('fontSize') || 'medium';
          const savedAnimations = localStorage.getItem('animations') === 'false' ? false : true;
        
          setDisplaySettings({
            theme: savedTheme,
            language: savedLanguage,
            fontSize: savedFontSize,
            animations: savedAnimations
          });
          
          // Apply theme immediately
          applyTheme(savedTheme);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
        if (err.message === 'API request failed') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndSettings();
  }, [router]);

  const applyTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAccountSettings({
      ...accountSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const checked = target.checked;
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === 'checkbox' ? checked : (target as HTMLInputElement).value,
    });
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    setPrivacySettings({
      ...privacySettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    setDisplaySettings({
      ...displaySettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCommunicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    setCommunicationSettings({
      ...communicationSettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        name: accountSettings.name,
        email: accountSettings.email,
        phone: accountSettings.phone,
        dateOfBirth: accountSettings.dateOfBirth,
        gender: accountSettings.gender,
        bio: accountSettings.bio,
        address: user?.address || {}
      };

      const updatedProfile = await authAPI.updateProfile(updateData);
      setUser(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      setSuccess('Account settings updated successfully!');
      
      // Update navbar
      window.dispatchEvent(new Event('userProfileUpdated'));
    } catch (err: any) {
      setError(err.message || 'Failed to update account settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Check if passwords match
      if (securitySettings.newPassword !== securitySettings.confirmPassword) {
        setError('New passwords do not match');
        setIsSaving(false);
        return;
      }

      // If changing password, call the change password API
      if (securitySettings.newPassword) {
        await settingsAPI.changePassword({
          currentPassword: securitySettings.currentPassword,
          newPassword: securitySettings.newPassword
        });
      }
      
      // Update 2FA setting
      await settingsAPI.updateTwoFactor(securitySettings.twoFactorEnabled);
      
      setSuccess('Security settings updated successfully!');
      
      // Reset password fields
      setSecuritySettings({
        ...securitySettings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update security settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await settingsAPI.updateNotifications(notificationSettings);
      setSuccess('Notification preferences saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await settingsAPI.updatePrivacy(privacySettings);
      setSuccess('Privacy settings saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save privacy settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDisplay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Apply theme changes
      applyTheme(displaySettings.theme);
      
      // Save settings to backend
      await settingsAPI.updateDisplay(displaySettings);
      
      // Save to localStorage for immediate access
      localStorage.setItem('theme', displaySettings.theme);
      localStorage.setItem('language', displaySettings.language);
      localStorage.setItem('fontSize', displaySettings.fontSize);
      localStorage.setItem('animations', displaySettings.animations.toString());
      
      setSuccess('Display settings saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save display settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCommunication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await settingsAPI.updateCommunication(communicationSettings);
      setSuccess('Communication preferences saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save communication preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // In a real app, you would prompt for password confirmation first
        await settingsAPI.deleteAccount({ password: '' }); // Password would be required in real implementation
        alert('Account deletion requested. You will receive an email to confirm this action.');
        // Log out user after deletion request
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } catch (err: any) {
        setError(err.message || 'Failed to request account deletion');
      }
    }
  };

  const handleDownloadData = async () => {
    try {
      await settingsAPI.exportData();
      alert('Data export requested. You will receive an email with your data shortly.');
    } catch (err: any) {
      setError(err.message || 'Failed to request data export');
    }
  };

  const handleExportChat = async () => {
    try {
      await settingsAPI.exportChatHistory();
      alert('Chat history export requested. You will receive an email with your chat data shortly.');
    } catch (err: any) {
      setError(err.message || 'Failed to request chat export');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'communication', label: 'Communication', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-purple-100 mt-2">Manage your account preferences and settings</p>
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full font-semibold transition-all backdrop-blur-sm shadow-lg"
            >
              <User className="w-4 h-4" />
              Back to Profile
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Settings</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-purple-100 text-purple-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <form onSubmit={handleSaveAccount}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Account Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={accountSettings.name}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={accountSettings.email}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={accountSettings.phone}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={accountSettings.dateOfBirth}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={accountSettings.gender}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={accountSettings.bio}
                      onChange={handleAccountChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 text-white py-3 px-6 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <form onSubmit={handleSaveSecurity}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="w-6 h-6" />
                    Security
                  </h2>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={securitySettings.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={securitySettings.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={securitySettings.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="twoFactorEnabled"
                          checked={securitySettings.twoFactorEnabled}
                          onChange={handleSecurityChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 text-white py-3 px-6 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <form onSubmit={handleSaveNotifications}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Bell className="w-6 h-6" />
                    Notifications
                  </h2>
                  
                  <div className="space-y-6 mb-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={notificationSettings.smsNotifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications on your device</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="pushNotifications"
                          checked={notificationSettings.pushNotifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Notification Types</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Order Updates</h4>
                            <p className="text-sm text-gray-600">Receive updates about your orders</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="orderUpdates"
                              checked={notificationSettings.orderUpdates}
                              onChange={handleNotificationChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Product Updates</h4>
                            <p className="text-sm text-gray-600">Get notified about new products</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="productUpdates"
                              checked={notificationSettings.productUpdates}
                              onChange={handleNotificationChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Promotional Emails</h4>
                            <p className="text-sm text-gray-600">Receive special offers and promotions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="promotionalEmails"
                              checked={notificationSettings.promotionalEmails}
                              onChange={handleNotificationChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Newsletter</h4>
                            <p className="text-sm text-gray-600">Subscribe to our monthly newsletter</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="newsletter"
                              checked={notificationSettings.newsletter}
                              onChange={handleNotificationChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 text-white py-3 px-6 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <form onSubmit={handleSavePrivacy}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Privacy
                  </h2>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        name="profileVisibility"
                        value={privacySettings.profileVisibility}
                        onChange={handlePrivacyChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                      <p className="text-sm text-gray-600 mt-1">Who can see your profile information</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Activity Status</h3>
                        <p className="text-sm text-gray-600">Show when you're online</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="activityStatus"
                          checked={privacySettings.activityStatus}
                          onChange={handlePrivacyChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Search Visibility</h3>
                        <p className="text-sm text-gray-600">Allow your profile to appear in search results</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="searchVisibility"
                          checked={privacySettings.searchVisibility}
                          onChange={handlePrivacyChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Data Management</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Download Your Data</h4>
                            <p className="text-sm text-gray-600">Get a copy of your personal data</p>
                          </div>
                          <button 
                            onClick={handleDownloadData}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Export Chat History</h4>
                            <p className="text-sm text-gray-600">Download your conversation history</p>
                          </div>
                          <button 
                            onClick={handleExportChat}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 text-white py-3 px-6 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}

              {/* Display Settings */}
              {activeTab === 'display' && (
                <form onSubmit={handleSaveDisplay}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Palette className="w-6 h-6" />
                    Display
                  </h2>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => setDisplaySettings({...displaySettings, theme: 'light'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            displaySettings.theme === 'light' 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <Sun className="w-6 h-6 mb-2 text-yellow-500" />
                            <span className="font-medium">Light</span>
                          </div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setDisplaySettings({...displaySettings, theme: 'dark'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            displaySettings.theme === 'dark' 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <Moon className="w-6 h-6 mb-2 text-gray-700" />
                            <span className="font-medium">Dark</span>
                          </div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setDisplaySettings({...displaySettings, theme: 'system'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            displaySettings.theme === 'system' 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <Globe className="w-6 h-6 mb-2 text-blue-500" />
                            <span className="font-medium">System</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        name="language"
                        value={displaySettings.language}
                        onChange={handleDisplayChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Font Size
                      </label>
                      <select
                        name="fontSize"
                        value={displaySettings.fontSize}
                        onChange={handleDisplayChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Animations</h3>
                        <p className="text-sm text-gray-600">Enable or disable UI animations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="animations"
                          checked={displaySettings.animations}
                          onChange={handleDisplayChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 text-white py-3 px-6 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}

              {/* Communication Settings */}
              {activeTab === 'communication' && (
                <form onSubmit={handleSaveCommunication}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Mail className="w-6 h-6" />
                    Communication Preferences
                  </h2>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => setCommunicationSettings({...communicationSettings, preferredContact: 'email'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            communicationSettings.preferredContact === 'email' 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <Mail className="w-6 h-6 mb-2 text-blue-500" />
                            <span className="font-medium">Email</span>
                          </div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setCommunicationSettings({...communicationSettings, preferredContact: 'sms'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            communicationSettings.preferredContact === 'sms' 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <Smartphone className="w-6 h-6 mb-2 text-green-500" />
                            <span className="font-medium">SMS</span>
                          </div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setCommunicationSettings({...communicationSettings, preferredContact: 'phone'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            communicationSettings.preferredContact === 'phone' 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <Phone className="w-6 h-6 mb-2 text-purple-500" />
                            <span className="font-medium">Phone</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={communicationSettings.timezone}
                        onChange={handleCommunicationChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Asia/Kolkata">Kolkata (IST)</option>
                        <option value="Australia/Sydney">Sydney (AEST)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Newsletter Subscription</h3>
                        <p className="text-sm text-gray-600">Receive our monthly newsletter</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={communicationSettings.newsletter}
                          onChange={handleCommunicationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Product Updates</h3>
                        <p className="text-sm text-gray-600">Get notified about new products and features</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="productUpdates"
                          checked={communicationSettings.productUpdates}
                          onChange={handleCommunicationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Contact Preferences</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                            <p className="text-sm text-gray-600">Receive promotional offers and deals</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="marketingCommunications"
                              checked={communicationSettings.marketingCommunications || false}
                              onChange={handleCommunicationChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Customer Support Updates</h4>
                            <p className="text-sm text-gray-600">Receive updates about support tickets</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="supportUpdates"
                              checked={communicationSettings.supportUpdates || false}
                              onChange={handleCommunicationChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 text-white py-3 px-6 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}