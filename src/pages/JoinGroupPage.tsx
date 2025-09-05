import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { apiService } from '../services/api';
import AuthModal from '../components/AuthModal';
import { useToast } from '../contexts/ToastContext';

const JoinGroupPage: React.FC = () => {
  const { groupCode } = useParams<{ groupCode: string }>();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    checkAuthAndJoinGroup();
  }, [groupCode]);

  const checkAuthAndJoinGroup = async () => {
    try {
      if (!groupCode) {
        toast.error('Invalid group code');
        navigate('/');
        return;
      }

      // Check if user is authenticated
      if (!apiService.isAuthenticated()) {
        setShowAuthModal(true);
        return;
      }

      await handleJoinGroup();
    } catch (error) {
      console.error('Error in join process:', error);
      toast.error('Failed to process join request');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    try {
      if (!groupCode) {
        throw new Error('Group code is required');
      }
      const result = await groupService.joinGroup(groupCode);
      toast.success(result.requires_approval 
        ? 'Join request sent successfully. Waiting for approval.' 
        : 'Successfully joined the group!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to join group');
      navigate('/dashboard');
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    checkAuthAndJoinGroup();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showAuthModal && (
        <AuthModal
          mode="signin"
          onClose={() => navigate('/')}
          onSuccess={handleAuthSuccess}
          onModeSwitch={() => undefined}
        />
      )}
    </div>
  );
};

export default JoinGroupPage;
