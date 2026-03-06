<template>
  <div class="home-container">
    <button class="logout-btn" @click="handleLogout">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 13L17 10L14 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Выйти
    </button>
    <div class="hero">
      <div class="hero-content">
        <h1>Air Tracker</h1>
        <p>Отслеживайте ваши любимые фильмы, сериалы, аниме, игры и книги в одном месте</p>
        <router-link to="/media" class="btn-primary">
          Перейти к списку медиа
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
      </div>
      <div class="hero-visual">
        <div class="card-grid">
          <div class="media-card card-1">
            <span class="card-icon">🎬</span>
            <span>Фильмы</span>
          </div>
          <div class="media-card card-2">
            <span class="card-icon">📺</span>
            <span>Сериалы</span>
          </div>
          <div class="media-card card-3">
            <span class="card-icon">🎮</span>
            <span>Игры</span>
          </div>
          <div class="media-card card-4">
            <span class="card-icon">📚</span>
            <span>Книги</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '../api';

const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    router.push('/login');
  }
});

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fc 0%, #eef0f5 100%);
}

.logout-btn {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
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

.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  gap: 4rem;
}

.hero-content {
  flex: 1;
  max-width: 500px;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}

.hero-content p {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.media-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  transition: transform 0.3s;
}

.media-card:hover {
  transform: translateY(-4px);
}

.card-icon {
  font-size: 2rem;
}

.card-1 { animation: float 3s ease-in-out infinite; }
.card-2 { animation: float 3s ease-in-out infinite 0.5s; }
.card-3 { animation: float 3s ease-in-out infinite 1s; }
.card-4 { animation: float 3s ease-in-out infinite 1.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-visual {
    width: 100%;
  }
}
</style>