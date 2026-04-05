<template>
  <div class="game-page">
    <header class="header">
      <div class="header-left">
        <router-link to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          На главную
        </router-link>
        <h1>Игры</h1>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 13L17 10L14 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Выйти
      </button>
    </header>

    <div class="media-list-section">
      <h2>Мой список игр</h2>
      <button @click="openCreateForm" class="btn-add">
        + Добавить игру
      </button>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else class="media-table-container">
        <table class="media-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Статус</th>
              <th>Год</th>
              <th>Дата выхода</th>
              <th>Дата окончания</th>
              <th>Оценка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="game in mediaList" :key="game.id">
              <td class="title-cell">{{ game.title }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(game.status)">
                  {{ getStatusLabel(game.status) }}
                </span>
              </td>
              <td>{{ game.releaseYear || '—' }}</td>
              <td>{{ game.releaseDate || '—' }}</td>
              <td>{{ game.endDate || '—' }}</td>
              <td>
                <span v-if="game.score" class="score">{{ game.score }}</span>
                <span v-else>—</span>
              </td>
              <td>
                <div class="actions">
                  <button @click="editMedia(game)" class="btn-icon" title="Редактировать">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11.5 2.5l2 2M2 14l1-4 9-9 2 2-9 9-3 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button @click="deleteMedia(game.id)" class="btn-icon btn-delete" title="Удалить">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10a1 1 0 001 1h6a1 1 0 001-1l.5-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="mediaList.length === 0" class="empty-state">
          <p>Игры не найдены</p>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingMedia ? 'Редактировать игру' : 'Добавить игру' }}</h2>
          <button @click="closeForm" class="btn-close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveMedia" class="media-form">
          <div class="form-group">
            <label>Название</label>
            <input v-model="formData.title" type="text" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Статус</label>
              <select v-model="formData.status" required>
                <option value="PLAYING">Играю</option>
                <option value="COMPLETED">Пройдено</option>
                <option value="PLAN_TO_PLAY">Буду играть</option>
                <option value="DROPPED">Брошено</option>
                <option value="ON_HOLD">Отложено</option>
              </select>
            </div>
            <div class="form-group">
              <label>Год выхода</label>
              <input v-model.number="formData.releaseYear" type="number" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Дата выхода</label>
              <input v-model="formData.releaseDate" type="date" />
            </div>
            <div class="form-group">
              <label>Дата окончания</label>
              <input v-model="formData.endDate" type="date" />
            </div>
          </div>

          <div class="form-group">
            <label>Оценка (1-10)</label>
            <input v-model.number="formData.score" type="number" min="1" max="10" />
          </div>

          <div class="form-actions">
            <button type="button" @click="closeForm" class="btn-cancel">Отмена</button>
            <button type="submit" class="btn-save">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { gameApi } from '../api';

const router = useRouter();

const mediaList = ref([]);
const loading = ref(false);
const showForm = ref(false);
const editingMedia = ref(null);

const userId = ref(parseInt(localStorage.getItem('userId')) || 1);

const formData = ref({
  id: null,
  title: '',
  status: 'PLAYING',
  releaseYear: null,
  releaseDate: '',
  endDate: '',
  score: null,
  usrId: userId.value
});

const loadMedia = async () => {
  loading.value = true;
  try {
    const response = await gameApi.getAll(userId.value);
    mediaList.value = response.data;
  } catch (err) {
    console.error('Ошибка загрузки игр:', err);
  } finally {
    loading.value = false;
  }
};

const openCreateForm = () => {
  editingMedia.value = null;
  formData.value = {
    id: null,
    title: '',
    status: 'PLAYING',
    releaseYear: null,
    releaseDate: '',
    endDate: '',
    score: null,
    usrId: userId.value
  };
  showForm.value = true;
};

const editMedia = (media) => {
  editingMedia.value = media;
  formData.value = {
    id: media.id,
    title: media.title,
    status: media.status,
    releaseYear: media.releaseYear,
    releaseDate: media.releaseDate || '',
    endDate: media.endDate || '',
    score: media.score,
    usrId: userId.value
  };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingMedia.value = null;
};

const saveMedia = async () => {
  try {
    const data = { ...formData.value };

    if (editingMedia.value) {
      await gameApi.update(data, userId.value);
    } else {
      await gameApi.create(data, userId.value);
    }

    closeForm();
    await loadMedia();
  } catch (err) {
    console.error('Ошибка сохранения:', err);
    alert('Ошибка сохранения игры');
  }
};

const deleteMedia = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить эту игру?')) return;

  try {
    await gameApi.delete(id, userId.value);
    await loadMedia();
  } catch (err) {
    console.error('Ошибка удаления:', err);
    alert('Ошибка удаления игры');
  }
};

const getStatusClass = (status) => {
  const classes = {
    'PLAYING': 'status-playing',
    'COMPLETED': 'status-completed',
    'PLAN_TO_PLAY': 'status-planned',
    'DROPPED': 'status-dropped',
    'ON_HOLD': 'status-onhold'
  };
  return classes[status] || 'status-default';
};

const getStatusLabel = (status) => {
  const labels = {
    'PLAYING': 'Играю',
    'COMPLETED': 'Пройдено',
    'PLAN_TO_PLAY': 'Буду играть',
    'DROPPED': 'Брошено',
    'ON_HOLD': 'Отложено'
  };
  return labels[status] || status;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

onMounted(loadMedia);
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  background: #f8f9fc;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto 2rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  color: #ef4444;
  border-color: #ef4444;
  background: #fef2f2;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #6366f1;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

.media-list-section {
  max-width: 1200px;
  margin: 0 auto;
}

.media-list-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 1rem;
}

.btn-add {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.media-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-top: 1rem;
}

.media-table {
  width: 100%;
  border-collapse: collapse;
}

.media-table th,
.media-table td {
  padding: 1rem 1.25rem;
  text-align: left;
}

.media-table th {
  background: #f9fafb;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.media-table td {
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
}

.media-table tr:last-child td {
  border-bottom: none;
}

.media-table tr:hover td {
  background: #f9fafb;
}

.title-cell {
  font-weight: 500;
  color: #1a1a2e;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-playing { background: #dbeafe; color: #2563eb; }
.status-completed { background: #d1fae5; color: #059669; }
.status-planned { background: #fef3c7; color: #d97706; }
.status-dropped { background: #fee2e2; color: #dc2626; }
.status-onhold { background: #e0e7ff; color: #4f46e5; }
.status-default { background: #f3f4f6; color: #6b7280; }

.score {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e5e7eb;
  color: #374151;
}

.btn-delete:hover {
  background: #fee2e2;
  color: #dc2626;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 1rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a2e;
}

.btn-close {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.media-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-save {
  padding: 0.625rem 1.25rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-save:hover {
  background: #4f46e5;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .media-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
