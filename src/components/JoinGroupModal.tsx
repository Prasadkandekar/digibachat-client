import React, { useState } from 'react';
import { X, Users, Search, Shield } from 'lucide-react';
import { groupService } from '../services/groupService';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (!groupCode.trim()) {
      setError('Please enter a group code');
      setLoading(false);
      return;
    }

    try {
      const result = await groupService.joinGroup(groupCode.trim().toUpperCase());
      setGroupCode('');
      onSuccess();
      
      // Display a success message if the group requires approval
      if (result.requires_approval) {
        setSuccessMessage('Join request sent successfully. Waiting for leader approval.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl transform transition-transform duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-teal-100 bg-teal-50 rounded-t-xl">
          <h2 className="text-xl font-semibold text-teal-800">Join a Savings Group</h2>
          <button
            onClick={onClose}
            className="text-teal-600 hover:text-teal-800 transition-colors p-1 hover:bg-teal-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-teal-600" />
            </div>
            <p className="text-teal-700 mb-3 font-medium">
              Enter the group code provided by the group leader
            </p>
            <div className="flex items-center justify-center text-sm text-teal-600 bg-teal-50 p-3 rounded-lg border border-teal-100">
              <Shield className="w-4 h-4 mr-2" />
              <span>The code is usually 6-8 characters long (e.g., FAMILY01)</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-teal-700 mb-3">
              Group Code *
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-teal-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                required
                placeholder="Enter group code (e.g., FAMILY01)"
                className="w-full pl-10 pr-4 py-3 border border-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors uppercase"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-5 border-t border-teal-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-teal-700 hover:text-teal-900 font-medium rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !groupCode.trim()}
              className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Joining...
                </>
              ) : 'Join Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinGroupModal;

// import React, { useState } from 'react';
// import { X, Users, Search } from 'lucide-react';
// import { groupService } from '../services/groupService';

// interface JoinGroupModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose, onSuccess }) => {
//   const [groupCode, setGroupCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!groupCode.trim()) {
//       setError('Please enter a group code');
//       setLoading(false);
//       return;
//     }

//     try {
//       const result = await groupService.joinGroup(groupCode.trim().toUpperCase());
//       setGroupCode('');
//       onSuccess();
      
//       // Display a success message if the group requires approval
//       if (result.requires_approval) {
//         setError('Join request sent successfully. Waiting for leader approval.');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to join group');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg w-full max-w-md">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">Join a Group</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Content */}
//         <form onSubmit={handleSubmit} className="p-6">
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           )}

//           <div className="text-center mb-6">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Users className="w-8 h-8 text-blue-600" />
//             </div>
//             <p className="text-gray-600 mb-2">
//               Enter the group code provided by the group leader
//             </p>
//             <p className="text-sm text-gray-500">
//               The code is usually 6-8 characters long (e.g., FAMILY01)
//             </p>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Group Code *
//             </label>
//             <div className="relative">
//               <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//               <input
//                 type="text"
//                 value={groupCode}
//                 onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
//                 required
//                 placeholder="Enter group code (e.g., FAMILY01)"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
//                 style={{ textTransform: 'uppercase' }}
//               />
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || !groupCode.trim()}
//               className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {loading ? 'Joining...' : 'Join Group'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JoinGroupModal;