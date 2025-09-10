import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import { apiService } from '../../services/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

interface DashboardHeaderProps {
  onLogout: () => void;
  onSettingsClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout, onSettingsClick }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCurrentUser();
      if (response.success && response.data?.user) {
        setUserProfile(response.data.user);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    onLogout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">DigiBachat</h1>
            <p className="text-sm text-gray-500">Savings Dashboard</p>
          </div>
        </div>

        {/* Right Side - Profile and Settings */}
        <div className="flex items-center space-x-4">
          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
              className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {isSettingsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    onSettingsClick();
                    setIsSettingsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    // Theme toggle functionality
                    setIsSettingsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Sun className="w-4 h-4 mr-3" />
                  Theme
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {userProfile ? getInitials(userProfile.name) : 'U'}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {userProfile?.email || 'user@example.com'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
                {/* Profile Header */}
                <div className="px-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                      {userProfile ? getInitials(userProfile.name) : 'U'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {userProfile?.name || 'User Name'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {userProfile?.email || 'user@example.com'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onSettingsClick();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="px-4 py-3 space-y-3">
                  {userProfile?.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{userProfile.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{userProfile?.email || 'user@example.com'}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Member since {userProfile ? formatDate(userProfile.created_at) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">India</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onSettingsClick();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        // Security settings
                        onSettingsClick();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Security</span>
                    </button>
                  </div>
                </div>

                {/* Logout */}
                <div className="px-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileDropdownOpen || isSettingsDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsSettingsDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DashboardHeader;
