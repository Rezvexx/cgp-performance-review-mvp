import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, BarChart3, User, UserCheck, Settings } from 'lucide-react';

const PerformanceReviewApp = () => {
  const [currentView, setCurrentView] = useState('consultant');
  const [mockData, setMockData] = useState({
    users: [
      { id: 1, name: 'John Smith', email: 'john@cgp.com', role: 'Consultant', teamLeaderId: 2 },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@cgp.com', role: 'Team Leader', teamLeaderId: null },
      { id: 3, name: 'Mike Davis', email: 'mike@cgp.com', role: 'Consultant', teamLeaderId: 2 },
      { id: 4, name: 'Emma Wilson', email: 'emma@cgp.com', role: 'Admin', teamLeaderId: null }
    ],
    campaigns: [
      { id: 1, name: 'Q2 2025 Performance Review', startDate: '2025-07-01', endDate: '2025-07-31', status: 'Active' },
      { id: 2, name: 'Q1 2025 Performance Review', startDate: '2025-04-01', endDate: '2025-04-30', status: 'Ended' }
    ],
    questions: [
      { id: 1, text: 'Describe your key achievements this quarter', type: 'Text Response' },
      { id: 2, text: 'Rate your overall performance', type: 'Rating (1-5)' },
      { id: 3, text: 'What areas would you like to improve?', type: 'Text Response' },
      { id: 4, text: 'How would you rate your teamwork skills?', type: 'Rating (1-5)' }
    ],
    reviews: [
      {
        id: 1,
        campaignId: 1,
        consultantId: 1,
        teamLeaderId: 2,
        status: 'Ready for Your Review',
        answers: {
          1: { consultantAnswer: 'Successfully delivered 3 major client projects ahead of schedule', leaderRating: null, leaderComment: '' },
          2: { consultantAnswer: '4', leaderRating: null, leaderComment: '' },
          3: { consultantAnswer: 'I would like to improve my presentation skills', leaderRating: null, leaderComment: '' },
          4: { consultantAnswer: '5', leaderRating: null, leaderComment: '' }
        }
      }
    ]
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const ViewSwitcher = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <img src="https://via.placeholder.com/120x40/4F46E5/white?text=CGP+Group" alt="CGP Group" className="h-8" />
            <span className="text-gray-500">|</span>
            <h1 className="text-xl font-semibold text-gray-900">Performance Review System</h1>
          </div>
          <select 
            value={currentView} 
            onChange={(e) => setCurrentView(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="consultant">👤 Consultant View</option>
            <option value="leader">👥 Team Leader View</option>
            <option value="admin">⚙️ Admin View</option>
          </select>
        </div>
      </div>
    </div>
  );

  const Sidebar = ({ links, activeLink, setActiveLink }) => (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => setActiveLink(link.key)}
            className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
              activeLink === link.key
                ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.label}
          </button>
        ))}
      </nav>
    </div>
  );

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const AdminView = () => {
    const [activeTab, setActiveTab] = useState('users');

    const adminLinks = [
      { key: 'users', label: 'Users', icon: Users },
      { key: 'campaigns', label: 'Campaigns', icon: Calendar },
      { key: 'questions', label: 'Questions', icon: MessageSquare },
      { key: 'reports', label: 'Reports', icon: BarChart3 }
    ];

    const UserManagement = () => (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <button 
            onClick={() => { setModalType('user'); setSelectedItem(null); setShowModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New User
          </button>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Leader</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockData.users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'Team Leader' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.teamLeaderId ? mockData.users.find(u => u.id === user.teamLeaderId)?.name : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => { setModalType('user'); setSelectedItem(user); setShowModal(true); }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    const CampaignManagement = () => (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
          <button 
            onClick={() => { setModalType('campaign'); setSelectedItem(null); setShowModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Campaign
          </button>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockData.campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Results</button>
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    const QuestionBank = () => (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Question Bank</h2>
          <button 
            onClick={() => { setModalType('question'); setSelectedItem(null); setShowModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Question
          </button>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question Text</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockData.questions.map((question) => (
                <tr key={question.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{question.text}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {question.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    const Reports = () => (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Reviews</h3>
            <p className="text-3xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-bold text-orange-600">4</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Export Data</h3>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Export to CSV
          </button>
        </div>
      </div>
    );

    return (
      <div className="flex">
        <Sidebar links={adminLinks} activeLink={activeTab} setActiveLink={setActiveTab} />
        <div className="flex-1">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'campaigns' && <CampaignManagement />}
          {activeTab === 'questions' && <QuestionBank />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </div>
    );
  };

  const ConsultantView = () => {
    const [selectedReview, setSelectedReview] = useState(null);

    const Dashboard = () => (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Performance Reviews</h2>
        <div className="grid gap-6">
          {mockData.campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Due: {campaign.endDate}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                    In Progress
                  </span>
                  <button 
                    onClick={() => setSelectedReview(campaign)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Continue Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const ReviewForm = ({ campaign }) => (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => setSelectedReview(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
        </div>
        
        <div className="space-y-6">
          {mockData.questions.map((question) => (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{question.text}</h3>
              {question.type === 'Text Response' ? (
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter your response..."
                  defaultValue={question.id === 1 ? 'Successfully delivered 3 major client projects ahead of schedule' : 
                               question.id === 3 ? 'I would like to improve my presentation skills' : ''}
                />
              ) : (
                <div className="flex space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input 
                        type="radio" 
                        name={`question-${question.id}`} 
                        value={rating}
                        defaultChecked={question.id === 2 && rating === 4 || question.id === 4 && rating === 5}
                        className="mr-2"
                      />
                      {rating}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t p-4 mt-8">
          <div className="max-w-4xl mx-auto flex justify-end space-x-4">
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Save Draft
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );

    return selectedReview ? <ReviewForm campaign={selectedReview} /> : <Dashboard />;
  };

  const TeamLeaderView = () => {
    const [selectedReview, setSelectedReview] = useState(null);

    const Dashboard = () => (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Reviews</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consultant Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedReview(mockData.reviews[0])}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Smith</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Q2 2025 Performance Review</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    Ready for Your Review
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );

    const AssessmentPage = ({ review }) => (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => setSelectedReview(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Review: John Smith - Q2 2025</h2>
        </div>
        
        <div className="space-y-6">
          {mockData.questions.map((question) => {
            const answer = review.answers[question.id];
            return (
              <div key={question.id} className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{question.text}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Consultant's Response:</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {answer?.consultantAnswer}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Your Assessment:</h4>
                    {question.type === 'Rating (1-5)' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating:</label>
                        <div className="flex space-x-4">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <label key={rating} className="flex items-center">
                              <input type="radio" name={`rating-${question.id}`} value={rating} className="mr-2" />
                              {rating}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Leader's Comments:</label>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Add your comments..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t p-4 mt-8">
          <div className="max-w-7xl mx-auto flex justify-end space-x-4">
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Save Draft
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Complete & Submit
            </button>
          </div>
        </div>
      </div>
    );

    return selectedReview ? <AssessmentPage review={selectedReview} /> : <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ViewSwitcher />
      
      {currentView === 'admin' && <AdminView />}
      {currentView === 'consultant' && <ConsultantView />}
      {currentView === 'leader' && <TeamLeaderView />}

      {/* Modals */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={modalType === 'user' ? 'Add/Edit User' : 
               modalType === 'campaign' ? 'Create Campaign' :
               modalType === 'question' ? 'Create Question' : 'Confirm Submission'}
      >
        {modalType === 'user' && (
          <div className="space-y-4">
            <input className="w-full p-2 border rounded" placeholder="Full Name" />
            <input className="w-full p-2 border rounded" placeholder="Email Address" />
            <select className="w-full p-2 border rounded">
              <option>Select Role</option>
              <option>Admin</option>
              <option>Team Leader</option>
              <option>Consultant</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Save User</button>
            </div>
          </div>
        )}
        
        {modalType === 'campaign' && (
          <div className="space-y-4">
            <input className="w-full p-2 border rounded" placeholder="Campaign Name" />
            <input type="date" className="w-full p-2 border rounded" />
            <input type="date" className="w-full p-2 border rounded" />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Save Campaign</button>
            </div>
          </div>
        )}
        
        {modalType === 'question' && (
          <div className="space-y-4">
            <textarea className="w-full p-2 border rounded" placeholder="Question Text" rows={3} />
            <select className="w-full p-2 border rounded">
              <option>Text Response</option>
              <option>Rating (1-5)</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Save Question</button>
            </div>
          </div>
        )}
        
        {!modalType && (
          <div className="space-y-4">
            <p>Are you sure you want to submit? You cannot edit your answers after submission.</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Final Submit</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PerformanceReviewApp;
