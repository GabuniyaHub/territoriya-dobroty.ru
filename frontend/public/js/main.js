import { loginAdmin, getProfile, fetchAnimals, createAnimal, updateAnimal, deleteAnimalById, logout } from './api.js';
import { renderAnimals } from './animals.js';

let currentAdmin = null;

// Модалка входа админа
const adminModal = document.getElementById('admin-modal');
const openAdminModalBtn = document.getElementById('open-admin-modal');
const closeAdminModalBtn = document.getElementById('close-admin-modal');
const adminLoginForm = document.getElementById('admin-login-form');
const adminLoginResult = document.getElementById('admin-login-result');
const adminPanel = document.getElementById('admin-panel');
const animalsGrid = document.getElementById('animals-grid');
const refreshAnimalsBtn = document.getElementById('refresh-animals');
const showAddAnimalBtn = document.getElementById('show-add-animal');
const logoutAdminBtn = document.getElementById('logout-admin');
const animalFormPanel = document.getElementById('animal-form-panel');
const animalEditForm = document.getElementById('animal-edit-form');
const cancelAnimalEditBtn = document.getElementById('cancel-animal-edit');
const animalFormResult = document.getElementById('animal-form-result');

// Открыть модалку
openAdminModalBtn?.addEventListener('click', () => {
  adminModal.classList.remove('hidden');
});

// Закрыть модалку
closeAdminModalBtn?.addEventListener('click', () => {
  adminModal.classList.add('hidden');
});

// Закрыть модалку при клике вне её
adminModal?.addEventListener('click', (e) => {
  if (e.target === adminModal) {
    adminModal.classList.add('hidden');
  }
});

// Вход админа
adminLoginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(adminLoginForm);

  adminLoginResult.textContent = 'Вход...';

  try {
    const result = await loginAdmin(formData.get('email'), formData.get('password'));
    console.log('Login result:', result);

    adminLoginResult.textContent = 'Вход успешен!';
    adminLoginResult.classList.remove('text-red-500');
    adminLoginResult.classList.add('text-green-500');

    // Закрыть модалку
    setTimeout(() => {
      adminModal.classList.add('hidden');
    }, 500);

    // Обновить профиль и UI
    await initAdminMode();
  } catch (error) {
    adminLoginResult.textContent = 'Ошибка: ' + error.message;
    adminLoginResult.classList.remove('text-green-500');
    adminLoginResult.classList.add('text-red-500');
  }
});

// Инициализировать админ-режим
async function initAdminMode() {
  try {
    const profile = await getProfile();
    if (profile && profile.email) {
      currentAdmin = profile;
      adminPanel?.classList.remove('hidden');
      console.log('Admin mode activated for:', profile.email);
      await loadAnimals(true); // true = isAdmin
    }
  } catch (error) {
    console.error('Failed to get profile:', error);
  }
}

// Загрузить животных
async function loadAnimals(isAdmin = false) {
  try {
    const animals = await fetchAnimals();
    renderAnimals(
      animalsGrid,
      animals,
      isAdmin,
      {
        onEdit: handleEditAnimal,
        onDelete: handleDeleteAnimal,
      }
    );
  } catch (error) {
    console.error('Failed to load animals:', error);
    animalsGrid.innerHTML = '<p class="text-red-500">Ошибка загрузки животных</p>';
  }
}

// Обновить список животных
refreshAnimalsBtn?.addEventListener('click', async () => {
  await loadAnimals(true);
});

// Показать форму добавления животного
showAddAnimalBtn?.addEventListener('click', () => {
  animalEditForm.reset();
  document.querySelector('input[name="id"]').value = '';
  animalFormPanel.classList.remove('hidden');
  animalFormResult.textContent = '';
});

// Редактировать животное
async function handleEditAnimal(animalId) {
  console.log('Edit animal:', animalId);
  try {
    const animals = await fetchAnimals();
    const animal = animals.find((a) => a.id === animalId);
    if (animal) {
      document.querySelector('input[name="id"]').value = animal.id;
      document.querySelector('input[name="name"]').value = animal.name;
      document.querySelector('input[name="age"]').value = animal.age;
      document.querySelector('select[name="gender"]').value = animal.gender;
      document.querySelector('input[name="image"]').value = animal.image;
      document.querySelector('input[name="traits"]').value = animal.traits;
      document.querySelector('textarea[name="description"]').value = animal.description;
      animalFormPanel.classList.remove('hidden');
      animalFormResult.textContent = '';
    }
  } catch (error) {
    console.error('Failed to load animal:', error);
  }
}

// Удалить животное
async function handleDeleteAnimal(animalId) {
  if (!confirm('Удалить это животное?')) {
    return;
  }
  try {
    await deleteAnimalById(animalId);
    await loadAnimals(true);
  } catch (error) {
    alert('Ошибка удаления: ' + error.message);
  }
}

// Отменить редактирование
cancelAnimalEditBtn?.addEventListener('click', () => {
  animalFormPanel.classList.add('hidden');
  animalEditForm.reset();
});

// Сохранить животное
animalEditForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(animalEditForm);
  const animalId = formData.get('id');

  const data = {
    name: formData.get('name'),
    age: formData.get('age'),
    gender: formData.get('gender'),
    image: formData.get('image'),
    traits: formData.get('traits'),
    description: formData.get('description'),
  };

  animalFormResult.textContent = 'Сохранение...';

  try {
    if (animalId) {
      await updateAnimal(Number(animalId), data);
    } else {
      await createAnimal(data);
    }
    animalFormResult.textContent = 'Сохранено!';
    animalFormResult.classList.remove('text-red-500');
    animalFormResult.classList.add('text-green-500');
    setTimeout(() => {
      animalFormPanel.classList.add('hidden');
      animalEditForm.reset();
      loadAnimals(true);
    }, 1000);
  } catch (error) {
    animalFormResult.textContent = 'Ошибка: ' + error.message;
    animalFormResult.classList.remove('text-green-500');
    animalFormResult.classList.add('text-red-500');
  }
});

// Выход
logoutAdminBtn?.addEventListener('click', async () => {
  try {
    await logout();
    currentAdmin = null;
    adminPanel?.classList.add('hidden');
    animalFormPanel?.classList.add('hidden');
    adminLoginForm.reset();
    await loadAnimals(false);
  } catch (error) {
    console.error('Logout error:', error);
  }
});

// Загрузить животных при загрузке страницы
window.addEventListener('DOMContentLoaded', async () => {
  await loadAnimals(false); // Загрузить для всех пользователей
  await initAdminMode(); // Проверить, залогинен ли админ
});
