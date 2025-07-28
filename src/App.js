import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, BarChart3, User, UserCheck, Settings, X, Check, AlertCircle } from 'lucide-react';

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
      { id: 1, name: 'Q2 2025 Performance Review', startDate: '2025-07-01', endDate: '2025-07-31', status: 'Active', questionIds: [1, 2, 3, 4] },
      { id: 2, name: 'Q1 2025 Performance Review', startDate: '2025-04-01', endDate: '2025-04-30', status: 'Ended', questionIds: [1, 2] }
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
        isDraft: false,
        answers: {
          1: { consultantAnswer: 'Successfully delivered 3 major client projects ahead of schedule', leaderRating: null, leaderComment: '' },
          2: { consultantAnswer: '4', leaderRating: null, leaderComment: '' },
          3: { consultantAnswer: 'I would like to improve my presentation skills', leaderRating: null, leaderComment: '' },
          4: { consultantAnswer: '5', leaderRating: null, leaderComment: '' }
        }
      },
      {
        id: 2,
        campaignId: 1,
        consultantId: 3,
        teamLeaderId: 2,
        status: 'In Progress',
        isDraft: true,
        answers: {
          1: { consultantAnswer: 'Working on client onboarding process improvements', leaderRating: null, leaderComment: '' },
          2: { consultantAnswer: '3', leaderRating: null, leaderComment: '' },
          3: { consultantAnswer: '', leaderRating: null, leaderComment: '' },
          4: { consultantAnswer: '', leaderRating: null, leaderComment: '' }
        }
      }
    ]
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState(null);

  // Helper function to show notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper function to generate IDs
  const generateId = () => Math.max(...Object.values(mockData).flat().map(item => item.id || 0)) + 1;

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
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? <Check className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
            {notification.message}
          </div>
        </div>
      )}
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
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // CRUD Operations
  const handleSaveUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const newUser = {
      id: selectedItem?.id || generateId(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      teamLeaderId: formData.teamLeaderId || null
    };

    setMockData(prev => ({
      ...prev,
      users: selectedItem 
        ? prev.users.map(user => user.id === selectedItem.id ? newUser : user)
        : [...prev.users, newUser]
    }));

    showNotification(selectedItem ? 'User updated successfully' : 'User created successfully');
    setShowModal(false);
    setFormData({});
  };

  const handleDeleteUser = (userId) => {
    setMockData(prev => ({
      ...prev,
      users: prev.users.filter(user => user.id !== userId)
    }));
    showNotification('User deleted successfully');
    setShowModal(false);
  };

  const handleSaveQuestion = () => {
    if (!formData.text || !formData.type) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const newQuestion = {
      id: selectedItem?.id || generateId(),
      text: formData.text,
      type: formData.type
    };

    setMockData(prev => ({
      ...prev,
      questions: selectedItem 
        ? prev.questions.map(q => q.id === selectedItem.id ? newQuestion : q)
        : [...prev.questions, newQuestion]
    }));

    showNotification(selectedItem ? 'Question updated successfully' : 'Question created successfully');
    setShowModal(false);
    setFormData({});
  };

  const handleDeleteQuestion = (questionId) => {
    setMockData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    showNotification('Question deleted successfully');
    setShowModal(false);
  };

  const handleSaveCampaign = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      showNotification('End date must be after start date', 'error');
      return;
    }

    const newCampaign = {
      id: selectedItem?.id || generateId(),
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: new Date(formData.endDate) < new Date() ? 'Ended' : 'Active',
      questionIds: formData.questionIds || []
    };

    setMockData(prev => ({
      ...prev,
      campaigns: selectedItem 
        ? prev.campaigns.map(c => c.id === selectedItem.id ? newCampaign : c)
        : [...prev.campaigns, newCampaign]
    }));

    showNotification(selectedItem ? 'Campaign updated successfully' : 'Campaign created successfully');
    setShowModal(false);
    setFormData({});
  };

  const exportToCSV = () => {
    const headers = ['Consultant Name', 'Campaign', 'Question', 'Consultant Answer', 'Leader Rating', 'Leader Comment'];
    const rows = [];

    mockData.reviews.forEach(review => {
      const consultant = mockData.users.find(u => u.id === review.consultantId);
      const campaign = mockData.campaigns.find(c => c.id === review.campaignId);
      
      Object.keys(review.answers).forEach(questionId => {
        const question = mockData.questions.find(q => q.id === parseInt(questionId));
        const answer = review.answers[questionId];
        
        rows.push([
          consultant?.name || '',
          campaign?.name || '',
          question?.text || '',
          answer.consultantAnswer || '',
          answer.leaderRating || '',
          answer.leaderComment || ''
        ]);
      });
    });

    const csvContent = [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'performance_review_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully');
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
            onClick={() => { 
              setModalType('user'); 
              setSelectedItem(null); 
              setFormData({});
              setShowModal(true); 
            }}
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
                      onClick={() => { 
                        setModalType('user'); 
                        setSelectedItem(user); 
                        setFormData(user);
                        setShowModal(true); 
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        setModalType('deleteUser');
                        setSelectedItem(user);
                        setShowModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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
            onClick={() => { 
              setModalType('campaign'); 
              setSelectedItem(null); 
              setFormData({ questionIds: [] });
              setShowModal(true); 
            }}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
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
                    {campaign.questionIds?.length || 0} questions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Results</button>
                    <button 
                      onClick={() => { 
                        setModalType('campaign'); 
                        setSelectedItem(campaign); 
                        setFormData(campaign);
                        setShowModal(true); 
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
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
            onClick={() => { 
              setModalType('question'); 
              setSelectedItem(null); 
              setFormData({});
              setShowModal(true); 
            }}
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
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{question.text}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {question.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => { 
                        setModalType('question'); 
                        setSelectedItem(question); 
                        setFormData(question);
                        setShowModal(true); 
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        setModalType('deleteQuestion');
                        setSelectedItem(question);
                        setShowModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    const Reports = () => {
      const totalReviews = mockData.reviews.length;
      const completedReviews = mockData.reviews.filter(r => r.status === 'Completed').length;
      const pendingReviews = totalReviews - completedReviews;

      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Reviews</h3>
              <p className="text-3xl font-bold text-blue-600">{totalReviews}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{completedReviews}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Pending</h3>
              <p className="text-3xl font-bold text-orange-600">{pendingReviews}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Export Data</h3>
            <button 
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Export to CSV
            </button>
          </div>
        </div>
      );
    };

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
    const [reviewAnswers, setReviewAnswers] = useState({});

    const currentConsultant = mockData.users.find(u => u.role === 'Consultant');
    const consultantReviews = mockData.reviews.filter(r => r.consultantId === currentConsultant?.id);

    const handleSaveDraft = () => {
      if (!selectedReview) return;

      setMockData(prev => ({
        ...prev,
        reviews: prev.reviews.map(review => 
          review.id === selectedReview.id 
            ? {
                ...review,
                isDraft: true,
                status: 'In Progress',
                answers: {
                  ...review.answers,
                  ...Object.keys(reviewAnswers).reduce((acc, qId) => ({
                    ...acc,
                    [qId]: {
                      ...review.answers[qId],
                      consultantAnswer: reviewAnswers[qId]
                    }
                  }), {})
                }
              }
            : review
        )
      }));

      showNotification('Draft saved successfully');
    };

    const handleSubmitReview = () => {
      if (!selectedReview) return;

      // Check if all questions are answered
      const campaign = mockData.campaigns.find(c => c.id === selectedReview.campaignId);
      const requiredQuestions = campaign?.questionIds || [];
      const answeredQuestions = Object.keys(reviewAnswers).filter(qId => reviewAnswers[qId]?.trim());

      if (answeredQuestions.length < requiredQuestions.length) {
        showNotification('Please answer all questions before submitting', 'error');
        return;
      }

      setMockData(prev => ({
        ...prev,
        reviews: prev.reviews.map(review => 
          review.id === selectedReview.id 
            ? {
                ...review,
                isDraft: false,
                status: 'Ready for Your Review',
                answers: {
                  ...review.answers,
                  ...Object.keys(reviewAnswers).reduce((acc, qId) => ({
                    ...acc,
                    [qId]: {
                      ...review.answers[qId],
                      consultantAnswer: reviewAnswers[qId]
                    }
                  }), {})
                }
              }
            : review
        )
      }));

      showNotification('Review submitted successfully');
      setSelectedReview(null);
      setReviewAnswers({});
      setShowModal(false);
    };

    const Dashboard = () => {
      const calculateAverageScore = (review) => {
        const ratings = Object.values(review.answers)
          .map(answer => answer.leaderRating)
          .filter(rating => rating !== null && rating !== undefined);
        
        if (ratings.length === 0) return null;
        const sum = ratings.reduce((acc, rating) => acc + parseInt(rating), 0);
        return (sum / ratings.length).toFixed(1);
      };

      return (
        <div className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Performance Reviews</h2>
          <div className="grid gap-6">
            {consultantReviews.map((review) => {
              const campaign = mockData.campaigns.find(c => c.id === review.campaignId);
              const averageScore = calculateAverageScore(review);
              const hasLeaderFeedback = Object.values(review.answers).some(answer => 
                answer.leaderComment && answer.leaderComment.trim()
              );

              return (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign?.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Due: {campaign?.endDate}</p>
                      
                      {/* Status and Score Display */}
                      <div className="mt-3 flex items-center space-x-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          review.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                          review.status === 'Ready for Your Review' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {review.status === 'Ready for Your Review' ? 'Under Review' : review.status}
                        </span>

                        {averageScore && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Average Score:</span>
                            <span className={`px-2 py-1 text-sm font-bold rounded ${
                              parseFloat(averageScore) >= 4 ? 'bg-green-100 text-green-800' :
                              parseFloat(averageScore) >= 3 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {averageScore}/5
                            </span>
                          </div>
                );
              })}
            </div>

            <button 
              onClick={() => setShowModal(false)} 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
        
        {modalType === 'submitReview' && (
          <div className="space-y-4">
            <p>Are you sure you want to submit? You cannot edit your answers after submission.</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSubmitReview} className="px-4 py-2 bg-blue-600 text-white rounded">Final Submit</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PerformanceReviewApp;        )}
                      </div>

                      {/* Additional Status Information */}
                      {review.status === 'Completed' && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Review Details:</span>
                            <button 
                              onClick={() => {
                                setModalType('viewResults');
                                setSelectedItem(review);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View Full Results
                            </button>
                          </div>
                          
                          {hasLeaderFeedback && (
                            <p className="text-sm text-gray-600">
                              ✓ Feedback provided by team leader
                            </p>
                          )}
                          
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Questions Rated:</span>
                              <span className="ml-2 font-medium">
                                {Object.values(review.answers).filter(a => a.leaderRating).length} / {Object.keys(review.answers).length}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Comments:</span>
                              <span className="ml-2 font-medium">
                                {Object.values(review.answers).filter(a => a.leaderComment?.trim()).length}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {review.status === 'Ready for Your Review' && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            ✓ Your review has been submitted and is currently being evaluated by your team leader.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      {review.status !== 'Completed' && review.status !== 'Ready for Your Review' && (
                        <button 
                          onClick={() => {
                            setSelectedReview(review);
                            setReviewAnswers(
                              Object.keys(review.answers).reduce((acc, qId) => ({
                                ...acc,
                                [qId]: review.answers[qId].consultantAnswer
                              }), {})
                            );
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          {review.isDraft ? 'Continue Review' : 'Start Review'}
                        </button>
                      )}
                      
                      {review.status === 'Completed' && (
                        <button 
                          onClick={() => {
                            setModalType('viewResults');
                            setSelectedItem(review);
                            setShowModal(true);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          View Results
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const ReviewForm = ({ review }) => {
      const campaign = mockData.campaigns.find(c => c.id === review.campaignId);
      const questions = mockData.questions.filter(q => campaign?.questionIds?.includes(q.id));

      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <button 
              onClick={() => setSelectedReview(null)}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Dashboard
            </button>
            <h2 className="text-2xl font-bold text-gray-900">{campaign?.name}</h2>
          </div>
          
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{question.text}</h3>
                {question.type === 'Text Response' ? (
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter your response..."
                    value={reviewAnswers[question.id] || ''}
                    onChange={(e) => setReviewAnswers(prev => ({
                      ...prev,
                      [question.id]: e.target.value
                    }))}
                  />
                ) : (
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input 
                          type="radio" 
                          name={`question-${question.id}`} 
                          value={rating}
                          checked={reviewAnswers[question.id] == rating}
                          onChange={(e) => setReviewAnswers(prev => ({
                            ...prev,
                            [question.id]: e.target.value
                          }))}
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
              <button 
                onClick={handleSaveDraft}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Save Draft
              </button>
              <button 
                onClick={() => {
                  setModalType('confirmSubmission');
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      );
    };

    return selectedReview ? <ReviewForm review={selectedReview} /> : <Dashboard />;
  };

  const TeamLeaderView = () => {
    const [selectedReview, setSelectedReview] = useState(null);
    const [leaderAssessments, setLeaderAssessments] = useState({});

    const currentLeader = mockData.users.find(u => u.role === 'Team Leader');
    const teamReviews = mockData.reviews.filter(r => r.teamLeaderId === currentLeader?.id);

    const handleSaveLeaderDraft = () => {
      if (!selectedReview) return;

      setMockData(prev => ({
        ...prev,
        reviews: prev.reviews.map(review => 
          review.id === selectedReview.id 
            ? {
                ...review,
                answers: {
                  ...review.answers,
                  ...Object.keys(leaderAssessments).reduce((acc, qId) => ({
                    ...acc,
                    [qId]: {
                      ...review.answers[qId],
                      leaderRating: leaderAssessments[qId]?.rating,
                      leaderComment: leaderAssessments[qId]?.comment
                    }
                  }), {})
                }
              }
            : review
        )
      }));

      showNotification('Assessment draft saved successfully');
    };

    const handleSubmitLeaderReview = () => {
      if (!selectedReview) return;

      setMockData(prev => ({
        ...prev,
        reviews: prev.reviews.map(review => 
          review.id === selectedReview.id 
            ? {
                ...review,
                status: 'Completed',
                answers: {
                  ...review.answers,
                  ...Object.keys(leaderAssessments).reduce((acc, qId) => ({
                    ...acc,
                    [qId]: {
                      ...review.answers[qId],
                      leaderRating: leaderAssessments[qId]?.rating,
                      leaderComment: leaderAssessments[qId]?.comment
                    }
                  }), {})
                }
              }
            : review
        )
      }));

      showNotification('Review completed successfully');
      setSelectedReview(null);
      setLeaderAssessments({});
    };

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
              {teamReviews.map((review) => {
                const consultant = mockData.users.find(u => u.id === review.consultantId);
                const campaign = mockData.campaigns.find(c => c.id === review.campaignId);
                
                return (
                  <tr key={review.id} className={review.status === 'Ready for Your Review' ? 'cursor-pointer hover:bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consultant?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        review.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                        review.status === 'Ready for Your Review' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {review.status === 'Ready for Your Review' && (
                        <button 
                          onClick={() => {
                            setSelectedReview(review);
                            setLeaderAssessments(
                              Object.keys(review.answers).reduce((acc, qId) => ({
                                ...acc,
                                [qId]: {
                                  rating: review.answers[qId].leaderRating,
                                  comment: review.answers[qId].leaderComment
                                }
                              }), {})
                            );
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );

    const AssessmentPage = ({ review }) => {
      const consultant = mockData.users.find(u => u.id === review.consultantId);
      const campaign = mockData.campaigns.find(c => c.id === review.campaignId);
      const questions = mockData.questions.filter(q => campaign?.questionIds?.includes(q.id));

      return (
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <button 
              onClick={() => setSelectedReview(null)}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Dashboard
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Review: {consultant?.name} - {campaign?.name}</h2>
          </div>
          
          <div className="space-y-6">
            {questions.map((question) => {
              const answer = review.answers[question.id];
              return (
                <div key={question.id} className="bg-white p-6 rounded-lg shadow border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{question.text}</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Consultant's Response:</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {answer?.consultantAnswer || 'No response provided'}
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
                                <input 
                                  type="radio" 
                                  name={`rating-${question.id}`} 
                                  value={rating} 
                                  checked={leaderAssessments[question.id]?.rating == rating}
                                  onChange={(e) => setLeaderAssessments(prev => ({
                                    ...prev,
                                    [question.id]: {
                                      ...prev[question.id],
                                      rating: e.target.value
                                    }
                                  }))}
                                  className="mr-2" 
                                />
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
                          value={leaderAssessments[question.id]?.comment || ''}
                          onChange={(e) => setLeaderAssessments(prev => ({
                            ...prev,
                            [question.id]: {
                              ...prev[question.id],
                              comment: e.target.value
                            }
                          }))}
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
              <button 
                onClick={handleSaveLeaderDraft}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Save Draft
              </button>
              <button 
                onClick={handleSubmitLeaderReview}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Complete & Submit
              </button>
            </div>
          </div>
        </div>
      );
    };

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
        title={
          modalType === 'user' ? (selectedItem ? 'Edit User' : 'Add New User') :
          modalType === 'campaign' ? (selectedItem ? 'Edit Campaign' : 'Create Campaign') :
          modalType === 'question' ? (selectedItem ? 'Edit Question' : 'Create Question') :
          modalType === 'deleteUser' ? 'Confirm Delete' :
          modalType === 'deleteQuestion' ? 'Confirm Delete' :
          modalType === 'submitReview' ? 'Confirm Submission' :
          'Modal'
        }
      >
        {modalType === 'user' && (
          <div className="space-y-4">
            <input 
              className="w-full p-2 border rounded" 
              placeholder="Full Name" 
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <input 
              className="w-full p-2 border rounded" 
              placeholder="Email Address" 
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            <select 
              className="w-full p-2 border rounded"
              value={formData.role || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Team Leader">Team Leader</option>
              <option value="Consultant">Consultant</option>
            </select>
            {formData.role === 'Consultant' && (
              <select 
                className="w-full p-2 border rounded"
                value={formData.teamLeaderId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, teamLeaderId: parseInt(e.target.value) }))}
              >
                <option value="">Select Team Leader</option>
                {mockData.users.filter(u => u.role === 'Team Leader').map(leader => (
                  <option key={leader.id} value={leader.id}>{leader.name}</option>
                ))}
              </select>
            )}
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSaveUser} className="px-4 py-2 bg-blue-600 text-white rounded">Save User</button>
            </div>
          </div>
        )}
        
        {modalType === 'campaign' && (
          <div className="space-y-4">
            <input 
              className="w-full p-2 border rounded" 
              placeholder="Campaign Name" 
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <input 
              type="date" 
              className="w-full p-2 border rounded" 
              value={formData.startDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <input 
              type="date" 
              className="w-full p-2 border rounded" 
              value={formData.endDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Select Questions:</label>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {mockData.questions.map(question => (
                  <label key={question.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={formData.questionIds?.includes(question.id) || false}
                      onChange={(e) => {
                        const questionIds = formData.questionIds || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            questionIds: [...questionIds, question.id] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            questionIds: questionIds.filter(id => id !== question.id) 
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{question.text}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSaveCampaign} className="px-4 py-2 bg-blue-600 text-white rounded">Save Campaign</button>
            </div>
          </div>
        )}
        
        {modalType === 'question' && (
          <div className="space-y-4">
            <textarea 
              className="w-full p-2 border rounded" 
              placeholder="Question Text" 
              rows={3} 
              value={formData.text || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
            />
            <select 
              className="w-full p-2 border rounded"
              value={formData.type || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">Select Type</option>
              <option value="Text Response">Text Response</option>
              <option value="Rating (1-5)">Rating (1-5)</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSaveQuestion} className="px-4 py-2 bg-blue-600 text-white rounded">Save Question</button>
            </div>
          </div>
        )}

        {modalType === 'deleteUser' && (
          <div className="space-y-4">
            <p>Are you sure you want to delete user "{selectedItem?.name}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button 
                onClick={() => handleDeleteUser(selectedItem.id)} 
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}

        {modalType === 'deleteQuestion' && (
          <div className="space-y-4">
            <p>Are you sure you want to delete this question? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button 
                onClick={() => handleDeleteQuestion(selectedItem.id)} 
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}
        
        {modalType === 'confirmSubmission' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Submit Performance Review</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to submit your performance review? Once submitted, you cannot make any changes.
              </p>
              
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Review Summary:</h4>
                <div className="text-sm text-gray-600">
                  <p>Your responses will be sent to your team leader for evaluation.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        )}

        {modalType === 'submissionSuccess' && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">Review Submitted Successfully!</h3>
            <p className="text-gray-600">
              Your performance review has been submitted and sent to your team leader for evaluation. 
              You'll be notified once the review is complete.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong><br/>
                • Your team leader will review your responses<br/>
                • You'll receive scores and feedback once completed<br/>
                • Check your dashboard for updates
              </p>
            </div>
            <button 
              onClick={() => {
                setShowModal(false);
              }} 
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {modalType === 'viewResults' && selectedItem && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900">Performance Review Results</h3>
            
            {/* Overall Score */}
            {(() => {
              const ratings = Object.values(selectedItem.answers)
                .map(answer => answer.leaderRating)
                .filter(rating => rating !== null && rating !== undefined);
              
              if (ratings.length > 0) {
                const sum = ratings.reduce((acc, rating) => acc + parseInt(rating), 0);
                const average = (sum / ratings.length).toFixed(1);
                
                return (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Overall Score:</span>
                      <span className={`px-3 py-1 text-lg font-bold rounded ${
                        parseFloat(average) >= 4 ? 'bg-green-100 text-green-800' :
                        parseFloat(average) >= 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {average}/5
                      </span>
                    </div>
                  </div>
                );
              }
            })()}

            {/* Individual Question Results */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.keys(selectedItem.answers).map(questionId => {
                const question = mockData.questions.find(q => q.id === parseInt(questionId));
                const answer = selectedItem.answers[questionId];
                
                return (
                  <div key={questionId} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{question?.text}</h4>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Your Answer:</span>
                        <p className="text-sm text-gray-800 mt-1">{answer.consultantAnswer || 'No response'}</p>
                      </div>
                      
                      {answer.leaderRating && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Leader's Rating:</span>
                          <span className="ml-2 px-2 py-1 text-sm font-bold bg-blue-100 text-blue-800 rounded">
                            {answer.leaderRating}/5
                          </span>
                        </div>
                      )}
                      
                      {answer.leaderComment && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Leader's Feedback:</span>
                          <p className="text-sm text-gray-800 mt-1 bg-yellow-50 p-2 rounded">{answer.leaderComment}</p>
                        </div>
                      )}
                    </div>
                  </div>
