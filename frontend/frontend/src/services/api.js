// API Service for communicating with the backend
// Prefer build-time REACT_APP_API_URL, fall back to a window global (if injected at runtime),
// then to the host mapped by docker-compose used in this workspace.
const API_BASE_URL = 'http://localhost:5001';

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Auth APIs
export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const register = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
};

// Book APIs
export const getBooks = async () => {
  try {
    const headers = getHeaders();
    console.log('Fetching books from:', `${API_BASE_URL}/api/books`);
    console.log('Headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}/api/books`, {
      method: 'GET',
      headers
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let body = null;
      try { body = await response.text(); } catch (e) { /* ignore */ }
      throw new Error(`Failed to fetch books (status ${response.status})${body ? ': ' + body : ''}`);
    }
    
    const data = await response.json();
    console.log('Books fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in getBooks:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

export const addBook = async (title, author, description, image, pagesTotal, pagesRead) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('title', title);
  formData.append('author', author);
  formData.append('description', description);
  if (typeof pagesTotal === 'number') {
    formData.append('pagesTotal', String(pagesTotal));
  }
  if (typeof pagesRead === 'number') {
    formData.append('pagesRead', String(pagesRead));
  }
  if (image) {
    formData.append('image', image);
  }

  const response = await fetch(`${API_BASE_URL}/api/books`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to add book');
  }
  return response.json();
};

export const updateBook = async (id, title, author, description, image, pagesTotal, pagesRead) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('title', title);
  formData.append('author', author);
  formData.append('description', description);
  if (typeof pagesTotal === 'number') {
    formData.append('pagesTotal', String(pagesTotal));
  }
  if (typeof pagesRead === 'number') {
    formData.append('pagesRead', String(pagesRead));
  }
  if (image) {
    formData.append('image', image);
  }

  const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to update book');
  }
  return response.json();
};

export const deleteBook = async (id) => {
  const headers = getHeaders();
  const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!response.ok) {
    let body = null;
    try { body = await response.text(); } catch (e) { /* ignore */ }
    throw new Error(`Failed to delete book (status ${response.status})${body ? ': ' + body : ''}`);
  }
  return response.json();
};
