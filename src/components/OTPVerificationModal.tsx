// src/components/OTPVerificationModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Mail, Clock } from 'lucide-react';
import { apiService, VerifyEmailData } from '../services/api';

interface OTPVerificationModalProps {
  email: string;
  onClose: () => void;
  onVerificationSuccess: () => void;
  onResendOtp: () => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  email,
  onClose,
  onVerificationSuccess,
  onResendOtp,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const verifyData: VerifyEmailData = { email, otp: otpString };
      const response = await apiService.verifyEmail(verifyData);

      if (response.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          onVerificationSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    setCooldown(60);
    setError('');
    setSuccess('');

    try {
      await apiService.resendOtp(email);
      setSuccess('OTP sent successfully!');
      onResendOtp();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Verify Email</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 text-teal-600 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">
              Enter the 6-digit code sent to
            </p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* OTP Inputs */}
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              ))}
            </div>

            {/* Error/Success Messages */}
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            {success && <p className="text-sm text-green-600 text-center">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-4 text-center">
            <button
              onClick={handleResendOtp}
              disabled={cooldown > 0}
              className="text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cooldown > 0 ? (
                <span className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Resend in {cooldown}s
                </span>
              ) : (
                'Resend OTP'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;    