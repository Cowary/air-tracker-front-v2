import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import MediaListPage from '../views/MediaListPage.vue';
import LoginPage from '../views/LoginPage.vue';
import AnimePage from '../views/AnimePage.vue';
import MoviePage from '../views/MoviePage.vue';
import TvPage from '../views/TvPage.vue';
import MangaPage from '../views/MangaPage.vue';
import RanobePage from '../views/RanobePage.vue';
import GamePage from '../views/GamePage.vue';
import BookPage from '../views/BookPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/media',
    name: 'MediaList',
    component: MediaListPage
  },
  {
    path: '/anime',
    name: 'Anime',
    component: AnimePage
  },
  {
    path: '/movies',
    name: 'Movies',
    component: MoviePage
  },
  {
    path: '/tv',
    name: 'Tv',
    component: TvPage
  },
  {
    path: '/manga',
    name: 'Manga',
    component: MangaPage
  },
  {
    path: '/ranobe',
    name: 'Ranobe',
    component: RanobePage
  },
  {
    path: '/games',
    name: 'Games',
    component: GamePage
  },
  {
    path: '/books',
    name: 'Books',
    component: BookPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
