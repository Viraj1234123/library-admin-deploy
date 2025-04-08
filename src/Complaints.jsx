import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResolutionModal from "./ResolutionModal"; // Import modal

const Complaints = ({ userType }) => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [resolutionComments, setResolutionComments] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'complaint', 'feedback'

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(complaints.filter(item => 
        item.category.toLowerCase() === activeFilter
      ));
    }
  }, [activeFilter, complaints]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}complaints`, { withCredentials: true });
      setComplaints(response.data.data);
      setFilteredComplaints(response.data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleResolveComplaint = async (id) => {
    if (!resolutionComments[id]) {
      alert('Please enter a resolution comment');
      return;
    }
    try {
      await axios.patch(`${import.meta.env.VITE_API_BASE_URL}complaints/${id}`, { status: 'resolved', comment: resolutionComments[id] }, { withCredentials: true });
      alert('Complaint resolved successfully!');
      setShowModal(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };
  
  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) {
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}complaints/${id}`, { withCredentials: true });
      alert('Complaint deleted successfully!');
      fetchComplaints();
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  return (
    <div className="complaints-container">
      <h3>✉️ Complaint Management</h3>
      
      {/* Filter buttons */}
      <div className="filter-buttons" style={{ marginBottom: '20px' }}>
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'complaint' ? 'active' : ''}`}
          onClick={() => setActiveFilter('complaint')}
        >
          Complaints
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveFilter('feedback')}
        >
          Feedback
        </button>
      </div>
      
      <div className="table-wrapper">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Student Roll No</th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Comments</th>
              {userType === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr 
                key={complaint._id} 
                className={complaint.status === 'resolved' ? 'resolved-row' : 'pending-row'}
              >
                <td>{complaint.studentId.rollNo}</td>
                <td>{complaint.title}</td>
                <td>{complaint.description}</td>
                <td>{complaint.category}</td>
                <td>
                  {complaint.comments.length > 0 ? (
                    complaint.comments.map((c) => (
                      <div key={c._id}>
                        <p>{c.comment}</p>
                      </div>
                    ))
                  ) : 'No comments'}
                </td>
                {userType === 'admin' && (
                  <td className="action-buttons">
                    {complaint.status !== 'resolved' && (
                      <>
                        <button 
                          className="resolve-btn" 
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowModal(true);
                          }}
                        >
                          Resolve
                        </button>
                      </>
                    )}
                    <button className="delete-btn" onClick={() => handleDeleteComplaint(complaint._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Resolution Modal */}
      <ResolutionModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        complaint={selectedComplaint}
        resolutionComments={resolutionComments}
        setResolutionComments={setResolutionComments}
        handleResolveComplaint={handleResolveComplaint}
      />
    </div>
  );
};

export default Complaints;