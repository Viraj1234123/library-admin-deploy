// Announcements.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { title } from 'framer-motion/client';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    imageLink: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}announcements/get-all`, { withCredentials: true });
      setAnnouncements(response.data.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', newAnnouncement.title);
    formData.append('description', newAnnouncement.description);
    if (imageFile) {
      formData.append('file', imageFile);
    }

    try {
      if (isEditing && editingId) {
       
        await axios.patch(`${import.meta.env.VITE_API_BASE_URL}announcements/update`, 
          {id: editingId, title: newAnnouncement.title, description: newAnnouncement.description, file: newAnnouncement.file},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            },

          }
        );
        alert('Announcement updated successfully!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}announcements/add`, 
          formData, 
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        alert('Announcement created successfully!');
      }
      
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} announcement`);
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setIsEditing(true);
    setNewAnnouncement({
      title: announcement.title,
      description: announcement.description,
      imageLink: announcement.imageLink
    });
  };

  const resetForm = () => {
    setNewAnnouncement({ title: '', description: '', imageLink: '' });
    setImageFile(null);
    setEditingId(null);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}announcements/delete/${id}`, { withCredentials: true });
      alert('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  return (
    <div className="announcements-container">
      <h3>📢 Announcements Management</h3>
      
      <div className="create-announcement">
        <h4>{isEditing ? 'Edit Announcement' : 'Create New Announcement'}</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={newAnnouncement.description}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
              accept="image/*"
            />
            {newAnnouncement.imageLink && !imageFile && (
              <div className="mt-2">
                <small>Current Image:</small>
                <img 
                  src={newAnnouncement.imageLink} 
                  alt="Current" 
                  style={{ maxWidth: '100px', maxHeight: '100px', display: 'block' }}
                />
              </div>
            )}
          </div>
          
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Announcement' : 'Create Announcement'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="announcements-list mt-4">
        <h4>Existing Announcements</h4>
        {announcements.length === 0 ? (
          <p>No announcements yet</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Image</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map(announcement => (
                <tr key={announcement._id}>
                  <td>{announcement.title}</td>
                  <td>{announcement.description}</td>
                  <td>
                    {announcement.imageLink && (
                      <img 
                        src={announcement.imageLink} 
                        alt="Announcement" 
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                    )}
                  </td>
                  <td>{new Date(announcement.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(announcement._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Announcements;