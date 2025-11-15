const BASE_URL = 'http://localhost:5000/api';

export const publicRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Request failed with status ${response.status}` };
      }
      throw new Error(errorData.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const userRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Request failed with status ${response.status}` };
      }
      throw new Error(errorData.message || 'Auth request failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
