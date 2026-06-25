const API_BASE = '/api';

async function request(path, options = {}) {
  const defaultOptions = {
    credentials: 'include',
    headers: {},
  };

  const config = { ...defaultOptions, ...options };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
    config.headers = { ...config.headers, 'Content-Type': 'application/json' };
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Серверная ошибка');
  }

  return payload;
}

async function sendContactMessage(data) {
  return request('/contact', {
    method: 'POST',
    body: data,
  });
}

async function loginAdmin(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

async function getProfile() {
  try {
    return await request('/auth/me', {
      method: 'GET',
    });
  } catch (error) {
    return null;
  }
}

async function fetchAnimals() {
  return request('/animals', {
    method: 'GET',
  });
}

async function logout() {
  return request('/auth/logout', {
    method: 'POST',
  });
}

async function createAnimal(data) {
  return request('/animals', {
    method: 'POST',
    body: data,
  });
}

async function updateAnimal(id, data) {
  return request(`/animals/${id}`, {
    method: 'PUT',
    body: data,
  });
}

async function deleteAnimalById(id) {
  return request(`/animals/${id}`, {
    method: 'DELETE',
  });
}

export { sendContactMessage, loginAdmin, getProfile, fetchAnimals, createAnimal, updateAnimal, deleteAnimalById, logout };
