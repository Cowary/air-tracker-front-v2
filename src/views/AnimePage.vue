s<template>
  <div class="anime-page">
    <header class="header">
      <div class="header-left">
        <router-link to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          На главную
        </router-link>
        <h1>Аниме</h1>
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

    <div class="search-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск аниме..."
          @keyup.enter="searchAnime"
        />
        <button @click="searchAnime" class="btn-search">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 109 1a8 8 0 000 16zM19 19l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="searchResults.length > 0" class="search-results">
      <h3>Результаты поиска</h3>
      <div class="results-grid">
        <div
          v-for="item in searchResults"
          :key="item.integrationId"
          class="result-card"
          @click="selectFromSearch(item)"
        >
          <div class="result-info">
            <span class="result-title">{{ item.nameRu || item.nameEn }}</span>
            <span class="result-year">{{ item.year }}</span>
            <span class="result-score">{{ item.score }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="anime-list-section">
      <h2>Мой список аниме</h2>
      <button @click="openCreateForm" class="btn-add">
        + Добавить аниме
      </button>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else class="anime-table-container">
        <table class="anime-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Оригинальное название</th>
              <th>Эпизоды</th>
              <th>Статус</th>
              <th>Год</th>
              <th>Оценка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="anime in animeList" :key="anime.id">
              <td class="title-cell">{{ anime.title }}</td>
              <td>{{ anime.originalTitle || '—' }}</td>
              <td>{{ anime.episodesEnd || 0 }} / {{ anime.episodes || '?' }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(anime.status)">
                  {{ getStatusLabel(anime.status) }}
                </span>
              </td>
              <td>{{ anime.releaseYear || '—' }}</td>
              <td>
                <span v-if="anime.score" class="score">{{ anime.score }}</span>
                <span v-else>—</span>
              </td>
              <td>
                <div class="actions">
                  <button @click="editAnime(anime)" class="btn-icon" title="Редактировать">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11.5 2.5l2 2M2 14l1-4 9-9 2 2-9 9-3 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button @click="deleteAnime(anime.id)" class="btn-icon btn-delete" title="Удалить">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10a1 1 0 001 1h6a1 1 0 001-1l.5-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="animeList.length === 0" class="empty-state">
          <p>Аниме не найдены</p>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingAnime ? 'Редактировать аниме' : 'Добавить аниме' }}</h2>
          <button @click="closeForm" class="btn-close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveAnime" class="anime-form">
          <div v-if="posterUrl" class="poster-section">
            <img :src="posterUrl" alt="Poster" class="poster-image" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Название</label>
              <input v-model="formData.title" type="text" required />
            </div>
            <div class="form-group">
              <label>Оригинальное название</label>
              <input v-model="formData.originalTitle" type="text" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Статус</label>
              <select v-model="formData.status" required>
                <option value="WATCHING">Смотрю</option>
                <option value="COMPLETED">Просмотрено</option>
                <option value="PLAN_TO_WATCH">Буду смотреть</option>
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
              <label>Эпизоды (текущие)</label>
              <input v-model.number="formData.episodesEnd" type="number" />
            </div>
            <div class="form-group">
              <label>Всего эпизодов</label>
              <input v-model.number="formData.episodes" type="number" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Оценка (1-10)</label>
              <input v-model.number="formData.score" type="number" min="1" max="10" />
            </div>
            <div class="form-group">
              <label>Длительность эпизода (мин)</label>
              <input v-model.number="formData.duration" type="number" />
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

          <div class="form-group" v-if="formData.shikiId">
            <label>Shikimori ID</label>
            <input v-model.number="formData.shikiId" type="number" readonly />
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
import { animeApi } from '../api';

const router = useRouter();

const animeList = ref([]);
const searchResults = ref([]);
const searchQuery = ref('');
const loading = ref(false);
const showForm = ref(false);
const editingAnime = ref(null);

const userId = ref(parseInt(localStorage.getItem('userId')) || 1);

const formData = ref({
  id: null,
  title: '',
  originalTitle: '',
  status: 'WATCHING',
  releaseYear: null,
  episodesEnd: 0,
  episodes: null,
  score: null,
  duration: null,
  releaseDate: '',
  endDate: '',
  shikiId: null,
  usrId: userId.value
});

const loadAnime = async () => {
  loading.value = true;
  try {
    const response = await animeApi.getAll(userId.value);
    animeList.value = response.data;
  } catch (err) {
    console.error('Ошибка загрузки аниме:', err);
  } finally {
    loading.value = false;
  }
};

const searchAnime = async () => {
  if (!searchQuery.value.trim()) return;
  
  try {
    const response = await animeApi.search(searchQuery.value);
    searchResults.value = response.data.findMedia || [];
  } catch (err) {
    console.error('Ошибка поиска:', err);
    searchResults.value = [];
  }
};

const posterUrl = ref('');

const selectFromSearch = async (item) => {
  searchResults.value = [];
  searchQuery.value = '';
  showForm.value = true;
  editingAnime.value = null;
  
  formData.value = {
    id: null,
    title: item.nameRu || item.nameEn,
    originalTitle: item.nameEn || item.nameRu,
    status: 'PLAN_TO_WATCH',
    releaseYear: item.year,
    episodesEnd: 0,
    episodes: item.episodes,
    score: item.score ? parseInt(item.score) : null,
    duration: null,
    releaseDate: '',
    endDate: '',
    shikiId: item.integrationId,
    usrId: userId.value
  };
  
  posterUrl.value = '';
  
  try {
    const response = await animeApi.getByServiceId(item.integrationId);
    const animeData = response.data;
    
    if (animeData && animeData.media) {
      const media = animeData.media;
      posterUrl.value = animeData.posterUrl || '';
      
      formData.value = {
        ...formData.value,
        title: media.title || formData.value.title,
        originalTitle: media.originalTitle || formData.value.originalTitle,
        releaseYear: media.releaseYear || formData.value.releaseYear,
        episodes: media.episodes || formData.value.episodes,
        score: media.score || formData.value.score,
        duration: media.duration || formData.value.duration,
        releaseDate: media.releaseDate || '',
        endDate: media.endDate || ''
      };
    } else if (animeData.posterUrl) {
      posterUrl.value = animeData.posterUrl;
    }
  } catch (err) {
    console.error('Ошибка получения данных аниме:', err);
  }
};

const openCreateForm = () => {
  editingAnime.value = null;
  formData.value = {
    id: null,
    title: '',
    originalTitle: '',
    status: 'WATCHING',
    releaseYear: null,
    episodesEnd: 0,
    episodes: null,
    score: null,
    duration: null,
    releaseDate: '',
    endDate: '',
    shikiId: null,
    usrId: userId.value
  };
  showForm.value = true;
};

const editAnime = (anime) => {
  editingAnime.value = anime;
  formData.value = {
    id: anime.id,
    title: anime.title,
    originalTitle: anime.originalTitle || '',
    status: anime.status,
    releaseYear: anime.releaseYear,
    episodesEnd: anime.episodesEnd || 0,
    episodes: anime.episodes,
    score: anime.score,
    duration: anime.duration,
    releaseDate: anime.releaseDate || '',
    endDate: anime.endDate || '',
    shikiId: anime.shikiId,
    usrId: userId.value
  };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingAnime.value = null;
};

const saveAnime = async () => {
  try {
    const data = { ...formData.value };
    
    if (editingAnime.value) {
      await animeApi.update(data, userId.value);
    } else {
      await animeApi.create(data, userId.value);
    }
    
    closeForm();
    await loadAnime();
  } catch (err) {
    console.error('Ошибка сохранения:', err);
    alert('Ошибка сохранения аниме');
  }
};

const deleteAnime = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить это аниме?')) return;
  
  try {
    await animeApi.delete(id, userId.value);
    await loadAnime();
  } catch (err) {
    console.error('Ошибка удаления:', err);
    alert('Ошибка удаления аниме');
  }
};

const getStatusClass = (status) => {
  const classes = {
    'WATCHING': 'status-watching',
    'COMPLETED': 'status-completed',
    'PLAN_TO_WATCH': 'status-planned',
    'DROPPED': 'status-dropped',
    'ON_HOLD': 'status-onhold'
  };
  return classes[status] || 'status-default';
};

const getStatusLabel = (status) => {
  const labels = {
    'WATCHING': 'Смотрю',
    'COMPLETED': 'Просмотрено',
    'PLAN_TO_WATCH': 'Буду смотреть',
    'DROPPED': 'Брошено',
    'ON_HOLD': 'Отложено'
  };
  return labels[status] || status;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

onMounted(loadAnime);
</script>

<style scoped>
.anime-page {
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

.search-section {
  max-width: 1200px;
  margin: 0 auto 2rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-box input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  font-size: 1rem;
  outline: none;
}

.btn-search {
  padding: 0.75rem 1rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-search:hover {
  background: #4f46e5;
}

.search-results {
  max-width: 1200px;
  margin: 0 auto 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-results h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: #374151;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.result-card {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.result-card:hover {
  background: #ede9fe;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-title {
  font-weight: 500;
  color: #1a1a2e;
}

.result-year, .result-score {
  font-size: 0.875rem;
  color: #6b7280;
}

.anime-list-section {
  max-width: 1200px;
  margin: 0 auto;
}

.anime-list-section h2 {
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

.anime-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-top: 1rem;
}

.anime-table {
  width: 100%;
  border-collapse: collapse;
}

.anime-table th,
.anime-table td {
  padding: 1rem 1.25rem;
  text-align: left;
}

.anime-table th {
  background: #f9fafb;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.anime-table td {
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
}

.anime-table tr:last-child td {
  border-bottom: none;
}

.anime-table tr:hover td {
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

.status-watching { background: #dbeafe; color: #2563eb; }
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

.anime-form {
  padding: 1.5rem;
}

.poster-section {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.poster-image {
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

.form-group input[readonly] {
  background: #f9fafb;
  color: #6b7280;
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

  .anime-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
