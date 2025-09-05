import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Users, 
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
  HelpCircle,
  UserCheck,
  PiggyBank
} from 'lucide-react';
import { apiService } from '../services/api';
import CreateGroupModal from '../components/CreateGroupModal';
import JoinGroupModal from '../components/JoinGroupModal';

// Import tab components
import DashboardHome from '../components/dashboard/DashboardHome';
import MyGroups from '../components/dashboard/MyGroups';
import JoinRequestsManager from '../components/dashboard/JoinRequestsManager';
import Analytics from '../components/dashboard/Analytics';
import Transactions from '../components/dashboard/Transactions';
import SettingsTab from '../components/dashboard/SettingsTab';
import TotalSavings from '../components/dashboard/TotalSavings';

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
  const [groups, setGroups] = useState<any[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  React.useEffect(() => {
      const fetchGroups = async () => {
          try {
              const res = await apiService.getUserGroups();
              if(res.success && res.data?.groups) {
                  setGroups(res.data.groups);
                  await fetchPendingRequestsCount(res.data.groups);
              }
          } catch (error) {
              console.error(error)
          }
      }
      fetchGroups();
  }, [])

  const fetchPendingRequestsCount = async (userGroups: any[]) => {
    try {
      const currentUserId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
      const leaderGroups = userGroups.filter(group => group.created_by === currentUserId);
      
      let totalPendingRequests = 0;
      for (const group of leaderGroups) {
        try {
          const requestsResponse = await apiService.getJoinRequests(group.id.toString());
          if (requestsResponse.success && requestsResponse.data?.requests) {
            const pendingRequests = requestsResponse.data.requests.filter(
              (req: any) => req.status === 'pending'
            );
            totalPendingRequests += pendingRequests.length;
          }
        } catch (err) {
          console.error(`Failed to fetch requests for group ${group.id}:`, err);
        }
      }
      setPendingRequestsCount(totalPendingRequests);
    } catch (error) {
      console.error('Error fetching pending requests count:', error);
    }
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
    { icon: PiggyBank, label: 'Total Savings', path: '/dashboard/total-savings', active: location.pathname === '/dashboard/total-savings' },
    { icon: Users, label: 'My Groups', path: '/dashboard/groups', active: location.pathname === '/dashboard/groups' },
    { icon: UserCheck, label: 'Join Requests', path: '/dashboard/join-requests', active: location.pathname === '/dashboard/join-requests' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics', active: location.pathname === '/dashboard/analytics' },
    { icon: History, label: 'Transactions', path: '/dashboard/transactions', active: location.pathname === '/dashboard/transactions' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings', active: location.pathname === '/dashboard/settings' },
    { icon: HelpCircle, label: 'Help', path: '/dashboard/help', active: false },
  ];

  const handleCreateGroupSuccess = async () => {
    setShowCreateGroupModal(false);
    // Refresh groups list after successful creation
    try {
      const res = await apiService.getUserGroups();
      if(res.success && res.data?.groups) {
        setGroups(res.data.groups);
        await fetchPendingRequestsCount(res.data.groups);
      }
    } catch (error) {
      console.error('Error refreshing groups:', error);
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
      case '/dashboard/total-savings':
        return 'Total Savings';
      case '/dashboard/groups':
        return 'My Groups';
      case '/dashboard/join-requests':
        return 'Join Requests';
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
                  {item.label === 'Join Requests' && pendingRequestsCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {pendingRequestsCount}
                    </span>
                  )}
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
                    {location.pathname === '/dashboard/total-savings' && "View your complete savings summary across all groups"}
                    {location.pathname === '/dashboard/groups' && "Manage your savings groups"}
                    {location.pathname === '/dashboard/join-requests' && "Approve or reject requests to join your groups"}
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
            <Route path="total-savings" element={<TotalSavings />} />
            <Route path="groups" element={<MyGroups />} />
            <Route path="join-requests" element={<JoinRequestsManager onRequestsUpdated={setPendingRequestsCount} />} />
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
      <JoinGroupModal
        isOpen={showJoinGroupModal}
        onClose={() => setShowJoinGroupModal(false)}
        onSuccess={handleCreateGroupSuccess}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onSuccess={handleCreateGroupSuccess}
      />

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
