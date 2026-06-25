function buildImageUrl(image) {
  if (!image) {
    return '/public/images/photo_1_2026-04-02_23-48-40.jpg';
  }

  if (image.startsWith('http') || image.startsWith('/')) {
    return image;
  }

  return `/public/images/${image}`;
}

function renderAnimals(container, animals, isAdmin, callbacks) {
  if (!Array.isArray(animals) || animals.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100 text-gray-500">
        Пока нет животных для отображения.
      </div>
    `;
    return;
  }

  container.innerHTML = animals
    .map(animal => {
      const imageUrl = buildImageUrl(animal.image);
      const genderText = animal.gender === 'female' ? 'Девочка' : 'Мальчик';

      return `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100 hover:border-orange">
          <img class="animal-img w-full" src="${imageUrl}" alt="${animal.name}">
          <div class="p-4">
            <h3 class="text-xl font-bold text-purple">${animal.name}</h3>
            <p class="text-gray-600 text-sm mb-2">${genderText}, ${animal.age}</p>
            <p class="text-gray-600 text-sm mb-4">${animal.traits}</p>
            <p class="text-gray-500 text-sm mb-4">${animal.description}</p>
            <div class="flex flex-wrap gap-2 items-center">
              <a href="#help" class="inline-block bg-orange/10 hover:bg-orange text-orange hover:text-white px-4 py-2 rounded-full text-sm font-medium transition">Хочу помочь →</a>
              ${isAdmin ? `
                <button data-animal-id="${animal.id}" data-action="edit" class="admin-action-btn inline-flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-full text-sm font-medium transition hover:bg-purple-dark">
                  <i class="fas fa-edit"></i> Редактировать
                </button>
                <button data-animal-id="${animal.id}" data-action="delete" class="admin-action-btn inline-flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-full text-sm font-medium transition hover:bg-[#e57500]">
                  <i class="fas fa-trash-alt"></i> Удалить
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('.admin-action-btn').forEach(button => {
    button.addEventListener('click', event => {
      const animalId = event.currentTarget.dataset.animalId;
      const action = event.currentTarget.dataset.action;
      if (action === 'edit' && callbacks.onEdit) {
        callbacks.onEdit(Number(animalId));
      }
      if (action === 'delete' && callbacks.onDelete) {
        callbacks.onDelete(Number(animalId));
      }
    });
  });
}

export { renderAnimals };
