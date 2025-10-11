import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import UploadModal from './UploadModal';

const AdminPanel = ({ user }) => {
  const [pages, setPages] = useState({ unpublished: [], published: [] });
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      const data = await response.json();
      setPages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handlePublish = async (pageName) => {
    try {
      await fetch(`/api/publish/${pageName}`, { method: 'POST' });
      fetchPages();
    } catch (err) {
      console.error('Failed to publish page:', err);
    }
  };

  const handleUnpublish = async (pageName) => {
    try {
      await fetch(`/api/unpublish/${pageName}`, { method: 'POST' });
      fetchPages();
    } catch (err) {
      console.error('Failed to unpublish page:', err);
    }
  };

  const handleDelete = async (pageName) => {
    try {
      await fetch(`/api/pages/${pageName}`, { method: 'DELETE' });
      fetchPages();
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  };

  const handleView = (pageName) => {
    window.open(`/api/page/${pageName}`, '_blank');
  };

  if (user.accessLevel !== 'Admin') {
    return <p>You do not have access to this panel.</p>;
  }

  return (
    <div className="admin-panel">
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={fetchPages}
      />
      <div className="admin-panel-header">
        <h2>Page Management</h2>
        <button onClick={() => setIsModalOpen(true)}>Upload New Page</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="page-lists">
        <div className="page-list">
          <h3>Unpublished Pages</h3>
          <ul>
            {pages.unpublished.map(page => (
              <li key={page}>
                {page}
                <div className="page-actions">
                  <button onClick={() => handleView(page)}>View</button>
                  <button onClick={() => handlePublish(page)}>Publish</button>
                  <button onClick={() => handleDelete(page)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="page-list">
          <h3>Published Pages</h3>
          <ul>
            {pages.published.map(page => (
              <li key={page}>
                {page}
                <div className="page-actions">
                  <button onClick={() => handleView(page)}>View</button>
                  <button onClick={() => handleUnpublish(page)}>Unpublish</button>
                  <button onClick={() => handleDelete(page)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;