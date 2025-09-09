import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

interface PendingPayment {
  id: number;
  upi_transaction_id: string;
  amount: number;
  user_name: string;
  user_email: string;
  created_at: string;
  upi_status: string;
  status: string;
  description: string;
}

interface PendingUPIPaymentsProps {
  groupId: string;
  isLeader: boolean;
}

const PendingUPIPayments: React.FC<PendingUPIPaymentsProps> = ({ groupId, isLeader }) => {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGroupTransactions(groupId);
      
      if (response.success) {
        const pending = response.data.transactions.filter(
          (txn: any) => txn.payment_method === 'upi' && txn.status === 'pending'
        );
        setPendingPayments(pending);
      }
    } catch (err) {
      setError('Failed to load pending payments');
      console.error('Error loading pending payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const completePayment = async (transactionId: number) => {
    try {
      const response = await apiService.completeUPIPayment(transactionId.toString());
      
      if (response.success) {
        // Refresh the list
        await loadPendingPayments();
      } else {
        setError(response.message || 'Failed to complete payment');
      }
    } catch (err) {
      setError('Failed to complete payment');
      console.error('Error completing payment:', err);
    }
  };

  useEffect(() => {
    if (isLeader) {
      loadPendingPayments();
    }
  }, [groupId, isLeader]);

  if (!isLeader) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        <span>Loading pending payments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Pending UPI Payments</h3>
        <button
          onClick={loadPendingPayments}
          className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      {pendingPayments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No pending UPI payments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingPayments.map((payment) => (
            <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-teal-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {payment.user_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.user_email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {payment.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{payment.amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => completePayment(payment.id)}
                    className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verify
                  </button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Transaction ID: {payment.upi_transaction_id}</span>
                  <span className="capitalize">Status: {payment.upi_status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingUPIPayments;
