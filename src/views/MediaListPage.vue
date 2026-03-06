<template>
  <div class="media-list-container">
    <header class="header">
      <div class="header-left">
        <router-link to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          На главную
        </router-link>
        <h1>Список медиа</h1>
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

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadMedia" class="btn-retry">Повторить</button>
    </div>

    <div v-else class="table-container">
      <table class="media-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Оригинальное название</th>
            <th>Тип</th>
            <th>Статус</th>
            <th>Год</th>
            <th>Оценка</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="media in mediaList" :key="media.id">
            <td class="title-cell">{{ media.title }}</td>
            <td>{{ media.originalTitle || '—' }}</td>
            <td>
              <span class="type-badge" :class="getTypeClass(media.type)">
                {{ media.type }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="getStatusClass(media.status)">
                {{ media.status }}
              </span>
            </td>
            <td>{{ media.releaseYear || '—' }}</td>
            <td>
              <span v-if="media.score" class="score">{{ media.score }}</span>
              <span v-else>—</span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="mediaList.length === 0" class="empty-state">
        <p>Медиа не найдены</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { mediaApi } from '../api';

const router = useRouter();

const mediaList = ref([]);
const loading = ref(true);
const error = ref('');

const userId = ref(localStorage.getItem('userId') || 1);

const loadMedia = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await mediaApi.getAllMedia(userId.value);
    mediaList.value = response.data;
  } catch (err) {
    error.value = 'Ошибка загрузки данных';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const getTypeClass = (type) => {
  const types = {
    'ANIME': 'type-anime',
    'MANGA': 'type-manga',
    'MOVIE': 'type-movie',
    'TV': 'type-tv',
    'GAME': 'type-game',
    'BOOK': 'type-book'
  };
  return types[type?.toUpperCase()] || 'type-default';
};

const getStatusClass = (status) => {
  const statuses = {
    'WATCHING': 'status-watching',
    'COMPLETED': 'status-completed',
    'PLAN_TO_WATCH': 'status-planned',
    'DROPPED': 'status-dropped'
  };
  return statuses[status?.toUpperCase()] || 'status-default';
};

onMounted(loadMedia);

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style scoped>
.media-list-container {
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

.loading, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
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

.error-state p {
  color: #ef4444;
  font-size: 1rem;
}

.btn-retry {
  padding: 0.5rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
}

.table-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
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

.type-badge, .status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-anime { background: #ede9fe; color: #7c3aed; }
.type-manga { background: #fce7f3; color: #db2777; }
.type-movie { background: #dbeafe; color: #2563eb; }
.type-tv { background: #d1fae5; color: #059669; }
.type-game { background: #fef3c7; color: #d97706; }
.type-book { background: #e0e7ff; color: #4f46e5; }
.type-default { background: #f3f4f6; color: #6b7280; }

.status-watching { background: #dbeafe; color: #2563eb; }
.status-completed { background: #d1fae5; color: #059669; }
.status-planned { background: #fef3c7; color: #d97706; }
.status-dropped { background: #fee2e2; color: #dc2626; }
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

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

@media (max-width: 768px) {
  .media-table {
    display: block;
    overflow-x: auto;
  }
}
</style>