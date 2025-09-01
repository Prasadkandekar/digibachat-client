import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  PiggyBank, 
  Users, 
  TrendingUp, 
  Calendar, 
  IndianRupee,
  Bell,
  Settings,
  LogOut,
  Plus,
  UserPlus,
  UserMinus,
  Menu,
  X,
  Home,
  BarChart3,
  History,
  HelpCircle
} from 'lucide-react';
import { apiService, CreateGroupData } from '../services/api';

// Import tab components
import DashboardHome from '../components/dashboard/DashboardHome';
import MyGroups from '../components/dashboard/MyGroups';
import Analytics from '../components/dashboard/Analytics';
import Transactions from '../components/dashboard/Transactions';
import SettingsTab from '../components/dashboard/SettingsTab';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showExitGroupModal, setShowExitGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [newGroupData, setNewGroupData] = useState<CreateGroupData>({
    name: '',
    description: '',
    contributionAmount: 0,
    frequency: 'monthly'
  });
  const [groups, setGroups] = useState<any[]>([]);

  React.useEffect(() => {
      const fetchGroups = async () => {
          try {
              const res = await apiService.getUserGroups();
              if(res.success) {
                  setGroups(res.data)
              }
          } catch (error) {
              console.error(error)
          }
      }
      fetchGroups();
  }, [])

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
    { icon: Users, label: 'My Groups', path: '/dashboard/groups', active: location.pathname === '/dashboard/groups' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics', active: location.pathname === '/dashboard/analytics' },
    { icon: History, label: 'Transactions', path: '/dashboard/transactions', active: location.pathname === '/dashboard/transactions' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings', active: location.pathname === '/dashboard/settings' },
    { icon: HelpCircle, label: 'Help', path: '/dashboard/help', active: false },
  ];

  const handleJoinGroup = async () => {
    try {
      await apiService.joinGroup(groupCode);
      setShowJoinGroupModal(false);
      setGroupCode('');
      // Optionally refresh groups list
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await apiService.createGroup(newGroupData);
      setShowCreateGroupModal(false);
      setNewGroupData({ name: '', description: '', contributionAmount: 0, frequency: 'monthly' });
      // Optionally refresh groups list
    } catch (error) {
      console.error(error);
    }
  };

  const handleExitGroup = async () => {
    try {
      await apiService.leaveGroup(selectedGroup);
      setShowExitGroupModal(false);
      setSelectedGroup('');
      // Optionally refresh groups list
    } catch (error) {
      console.error(error);
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/dashboard/groups':
        return 'My Groups';
      case '/dashboard/analytics':
        return 'Analytics';
      case '/dashboard/transactions':
        return 'Transactions';
      case '/dashboard/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Digi <span className="text-gray-700">बचत</span>
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Group Management Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="space-y-2">
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </button>
            <button
              onClick={() => setShowJoinGroupModal(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Join Group
            </button>
            <button
              onClick={() => setShowExitGroupModal(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Exit Group
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-2"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                  <p className="text-gray-600">
                    {location.pathname === '/dashboard' && "Welcome back! Here's your savings overview."}
                    {location.pathname === '/dashboard/groups' && "Manage your savings groups"}
                    {location.pathname === '/dashboard/analytics' && "Track your financial progress"}
                    {location.pathname === '/dashboard/transactions' && "View your transaction history"}
                    {location.pathname === '/dashboard/settings' && "Manage your account settings"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                  <Bell className="w-5 h-5" />
                </button>
                <button 
                  onClick={onLogout}
                  className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="groups" element={<MyGroups />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<SettingsTab />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Join Group Modal */}
      {showJoinGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Join Group</h2>
              <button
                onClick={() => setShowJoinGroupModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Code
                </label>
                <input
                  type="text"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter group code (e.g., FAM001)"
                />
              </div>
              <button
                onClick={handleJoinGroup}
                className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Group</h2>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroupData.name}
                  onChange={(e) => setNewGroupData({...newGroupData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGroupData.description}
                  onChange={(e) => setNewGroupData({...newGroupData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Group description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contribution Amount (₹)
                </label>
                <input
                  type="number"
                  value={newGroupData.contributionAmount}
                  onChange={(e) => setNewGroupData({...newGroupData, contributionAmount: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Monthly contribution amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={newGroupData.frequency}
                  onChange={(e) => setNewGroupData({...newGroupData, frequency: e.target.value as 'weekly' | 'monthly' | 'quarterly'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <button
                onClick={handleCreateGroup}
                className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Group Modal */}
      {showExitGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Exit Group</h2>
              <button
                onClick={() => setShowExitGroupModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Group to Exit
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Choose a group</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> Exiting a group will remove you from all future contributions and you may lose access to group funds.
                </p>
              </div>
              <button
                onClick={handleExitGroup}
                disabled={!selectedGroup}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Exit Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
