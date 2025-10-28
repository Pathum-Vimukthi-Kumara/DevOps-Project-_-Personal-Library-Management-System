import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks, addBook, updateBook, deleteBook, removeAuthToken } from '../../services/api';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    image: null
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('username');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    setUsername(user || 'User');
    fetchBooks();
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author) {
      setError('Title and author are required');
      return;
    }

    try {
      if (editingId) {
        await updateBook(editingId, formData.title, formData.author, formData.description, formData.image);
        setEditingId(null);
      } else {
        await addBook(formData.title, formData.author, formData.description, formData.image);
      }
      
      setFormData({ title: '', author: '', description: '', image: null });
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      setError(err.message || 'Failed to save book');
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      image: null
    });
    setEditingId(book.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        fetchBooks();
      } catch (err) {
        setError('Failed to delete book');
      }
    }
  };

  const handleAddNew = () => {
    setFormData({ title: '', author: '', description: '', image: null });
    setEditingId(null);
    setShowModal(true);
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📚 My Library</h1>
            <p className="text-gray-600 mt-2">Welcome, {username}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleAddNew}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              + Add Book
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading your books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No books in your library yet</p>
            <button 
              onClick={handleAddNew}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          /* Books Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {book.imagePath && (
                  <img 
                    src={`${process.env.REACT_APP_API_URL || window.REACT_APP_API_URL || 'http://localhost:5001'}/api/images/${book.imagePath}`} 
                    alt={book.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">By {book.author}</p>
                  {book.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{book.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(book)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded transition text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Book' : 'Add New Book'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Title *</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Book title"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Author *</label>
                <input 
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Book description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Book Cover Image</label>
                <input 
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded transition"
                >
                  {editingId ? 'Update' : 'Add'} Book
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;