import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CreateGroupData } from '../types/group';
import { apiService } from '../services/api';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateGroupData>({
    name: '',
    description: '',
    savings_frequency: 'monthly',
    savings_amount: 0,
    interest_rate: 0,
    default_loan_duration: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.savings_amount <= 0) {
      setError('Savings amount must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.createGroup(formData);
      if (response.success) {
        setFormData({
          name: '',
          description: '',
          savings_frequency: 'monthly',
          savings_amount: 0,
          interest_rate: 0,
          default_loan_duration: 1
        });
        setTouched({});
        onSuccess();
      } else {
        setError('Failed to create group');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'savings_amount' || name === 'interest_rate' || name === 'default_loan_duration' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl transform transition-transform duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-teal-50 rounded-t-xl">
          <h2 className="text-xl font-semibold text-teal-800">Create New Savings Group</h2>
          <button
            onClick={onClose}
            className="text-teal-600 hover:text-teal-800 transition-colors p-1 hover:bg-teal-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-teal-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Enter group name"
                className="w-full px-4 py-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-teal-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                placeholder="Describe the purpose of this group"
                className="w-full px-4 py-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Savings Settings */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Savings Settings
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-2">
                    Frequency *
                  </label>
                  <select
                    name="savings_frequency"
                    value={formData.savings_frequency}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white transition-colors"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-2">
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-teal-600">₹</span>
                    <input
                      type="number"
                      name="savings_amount"
                      value={formData.savings_amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      min="1"
                      step="1"
                      
                      className="w-full pl-8 pr-4 py-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>
                  {formData.savings_amount > 0 && (
                    <p className="text-xs text-teal-600 mt-1">
                      {formatCurrency(formData.savings_amount)} per {formData.savings_frequency}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Loan Settings */}
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
              <h3 className="text-sm font-semibold text-teal-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                </svg>
                Loan Settings
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-2">
                    Interest Rate (%) *
                  </label>
                  <input
                    type="number"
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    min="0"
                    step="1"
                    placeholder="0.0"
                    className="w-full px-4 py-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-2">
                    Duration (months) *
                  </label>
                  <input
                    type="number"
                    name="default_loan_duration"
                    value={formData.default_loan_duration}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    min="1"
                    placeholder="1"
                    className="w-full px-4 py-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-5 border-t border-teal-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-teal-700 hover:text-teal-900 font-medium rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;

// import React, { useState } from 'react';
// import { X } from 'lucide-react';
// import { CreateGroupData } from '../types/group';
// import { apiService } from '../services/api';

// interface CreateGroupModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState<CreateGroupData>({
//     name: '',
//     description: '',
//     savings_frequency: 'monthly',
//     savings_amount: 0,
//     interest_rate: 0,
//     default_loan_duration: 1
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (formData.savings_amount <= 0) {
//       setError('Savings amount must be greater than 0');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await apiService.createGroup(formData);
//       if (response.success) {
//         setFormData({
//           name: '',
//           description: '',
//           savings_frequency: 'monthly',
//           savings_amount: 0,
//           interest_rate: 0,
//           default_loan_duration: 1
//         });
//         onSuccess();
//       } else {
//         setError('Failed to create group');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to create group');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'savings_amount' || name === 'interest_rate' || name === 'default_loan_duration' 
//         ? parseFloat(value) || 0 
//         : value
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">Create New Group</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6">
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           )}

//           <div className="space-y-4">
//             {/* Group Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Group Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter group name"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={3}
//                 placeholder="Describe the purpose of this group"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Savings Settings */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Savings Frequency *
//                 </label>
//                 <select
//                   name="savings_frequency"
//                   value={formData.savings_frequency}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="weekly">Weekly</option>
//                   <option value="monthly">Monthly</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Amount (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   name="savings_amount"
//                   value={formData.savings_amount}
//                   onChange={handleChange}
//                   required
//                   min="1"
//                   step="1"
//                   placeholder="0"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Loan Settings */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Interest Rate (%) *
//                 </label>
//                 <input
//                   type="number"
//                   name="interest_rate"
//                   value={formData.interest_rate}
//                   onChange={handleChange}
//                   required
//                   min="0"
//                   step="0.1"
//                   placeholder="0.0"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Loan Duration (months) *
//                 </label>
//                 <input
//                   type="number"
//                   name="default_loan_duration"
//                   value={formData.default_loan_duration}
//                   onChange={handleChange}
//                   required
//                   min="1"
//                   placeholder="1"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {loading ? 'Creating...' : 'Create Group'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateGroupModal;