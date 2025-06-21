<template>
  <div class="home">

    <section
        class="hero"
        v-if="activeProject"
        :style="{ backgroundImage: 'url(' + activeProject.image + ')' }"
    >
      <div class="overlay">
        <div class="hero-content">
          <h1>{{ activeProject.title }}</h1>
          <p>{{ activeProject.description }}</p>
          <p class="tags">Tecnologías: {{ activeProject.technologies?.join(', ') }}</p>
          <p class="meta">Likes: {{ activeProject.likes }} | Comentarios: {{ activeProject.comments }}</p>
          <button class="btn" @click="goToProfile(activeProject.profileId)">View Profile</button>
        </div>

        <Swiper
            :slides-per-view="3"
            :centered-slides="true"
            :loop="true"
            :space-between="-100"
            @swiper="onSwiper"
            :autoplay="{ delay: 3000 }"
            @slideChange="onSlideChange"
            class="swiper-container"
        >
          <SwiperSlide
              v-for="(project, index) in projects"
              :key="project.id"
              @click="setActiveProject(project, index)"
          >
            <img
                :src="project.image"
                :alt="project.title"
                class="slide-img"
                :class="{ 'active-slide': activeProject.id === project.id }"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>

    <div class="user-list-container">
      <h2>{{ $t('userList.title') }}</h2>

      <div class="carousel-wrapper">
        <button class="carousel-btn left" @click="scrollLeft">&#10094;</button>

        <div class="carousel" ref="carousel">
          <div v-for="user in otherUsers" :key="user.id" class="card">
            <div class="card-background" :style="getCardBackground(user.id)"></div>
            <div class="card-overlay">
              <p class="card-name">{{ getProfileName(user.id) }}</p>
              <button class="btn view-profile" @click="goToProfile(user.id)">
                {{ $t('userList.viewProfile') }}
              </button>
            </div>
          </div>
        </div>

        <button class="carousel-btn right" @click="scrollRight">&#10095;</button>
      </div>


    </div>


  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';
import { authService } from "../../users/services/auth.service.js";
import axios from 'axios';

//const API_URL_PROFILES = 'https://creatilink-api-production-4e2f.up.railway.app/api/v1/profiles';
const API_URL_PROFILES = 'http://localhost:3000/profiles';


export default {
  name: 'Home',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      projects: [],
      activeProject: null,
      swiperInstance: null,
      currentUser: null,
      allUsers: [],
      profiles: []
    };
  },
  async created() {

    this.fetchUsers();


    //const response = await fetch('https://creatilink-api-production-4e2f.up.railway.app/api/v1/projects');
    const response = await fetch('http://localhost:3000/projects');


    const allProjects = await response.json();
    this.projects = allProjects;
    this.activeProject = this.projects[0] || null;


    try {
      const users = await authService.getAllUsers();
      this.allUsers = users;
      this.currentUser = authService.getCurrentUser();
      const profileRes = await axios.get(API_URL_PROFILES);
      this.profiles = profileRes.data;
    } catch (error) {
      console.error("Error al obtener usuarios o perfiles:", error);
    }
  },
  methods: {
    scrollLeft() {
      const cardWidth = 320; // card (300px) + gap (20px)
      const visibleCards = this.getVisibleCardsCount();
      this.$refs.carousel.scrollBy({ left: -cardWidth * visibleCards, behavior: 'smooth' });
    },
    scrollRight() {
      const cardWidth = 320;
      const visibleCards = this.getVisibleCardsCount();
      this.$refs.carousel.scrollBy({ left: cardWidth * visibleCards, behavior: 'smooth' });
    },
    getVisibleCardsCount() {
      const containerWidth = this.$refs.carousel?.offsetWidth || 0;
      return Math.floor(containerWidth / 320); // 300px card + 20px gap
    },


    setActiveProject(project, index) {
      this.activeProject = project;
      if (this.swiperInstance) {
        this.swiperInstance.slideToLoop(index);
      }
    },
    onSwiper(swiper) {
      this.swiperInstance = swiper;
    },
    onSlideChange(swiper) {
      const index = swiper.realIndex;
      this.activeProject = this.projects[index];
    },
    async fetchUsers() {
      try {
        const users = await authService.getAllUsers();
        this.allUsers = users;
        this.currentUser = authService.getCurrentUser();

        const response = await axios.get(API_URL_PROFILES);
        this.profiles = response.data;

      } catch (error) {
        console.error("Error al obtener los usuarios o perfiles: ", error);
      }
    },

    getProfileByUserId(userId) {
      return this.profiles.find(p => Number(p.userId) === Number(userId)); // ✅
      if (!match) console.warn(`❌ No se encontró perfil para userId: ${userId}`);
      return match;
    },

    getProfileImage(userId) {
      const profile = this.getProfileByUserId(userId);
      return profile ? profile.image : '';
    },

    getProfileName(userId) {
      const profile = this.getProfileByUserId(userId);
      return profile?.name || 'Usuario sin perfil';
    },

    getCardBackground(userId) {
      const image = this.getProfileImage(userId);
      return {
        backgroundImage: `url('${image}')`
      };
    },

    goToProfile(userId) {
      this.$router.push({ name: 'profile', params: { profileId: userId } });
    }
  },
  computed: {
    otherUsers() {
      const filtered = this.allUsers.filter(user => user.id !== this.currentUser.id);
      console.log("Usuarios que se están mostrando (otherUsers):", filtered);
      return filtered;
    }
  }


};
</script>


<style scoped>
@import url('https://unpkg.com/swiper/swiper-bundle.min.css');
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;500&display=swap');

.home {
  font-family: 'Roboto', sans-serif;
  color: #fff;
  background-color: #000;
  min-height: 100vh;
}

.hero {
  height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
  background-repeat: no-repeat;
}

.overlay {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.9) 45%, rgba(0, 0, 0, 0.4));
  display: flex;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
}

.hero-content {
  max-width: 40%;
  animation: fadeIn 1s ease-in-out;
}

h1 {
  font-family: 'Bebas Neue', cursive;
  font-size: 64px;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-shadow: 2px 2px 8px #000;
}

p {
  font-size: 18px;
  margin-bottom: 10px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.9);
}

.tags, .meta {
  font-size: 14px;
  color: #ccc;
}

.btn {
  margin-top: 15px;
  padding: 12px 24px;
  background-color: #e50914;
  border: none;
  color: white;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
  background-color: #b0060f;
  transform: scale(1.05);
}

.swiper-container {
  width: 50%;
  height: 400px;
  display: flex;
  align-items: center;
}

.slide-img {
  width: 200px;
  height: 300px;
  border-radius: 10px;
  transition: transform 0.3s, opacity 0.3s;
  opacity: 0.4;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0,0,0,0.7);
}

.active-slide {
  transform: scale(1.2);
  opacity: 1 !important;
  z-index: 10;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-list-container {
  padding: 2rem;
  background-color: #111;
}

.user-list-container h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 1rem;
}

.card {
  position: relative;
  height: 379px;
  width: 300px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.5s ease;
  z-index: 0;
}

.card:hover .card-background {
  transform: scale(1.90);
}

.card::before {
  content: "";
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2;
}

.card:hover::before {
  opacity: 1;
}

.card-overlay {
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  color: white;
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.card:hover .card-overlay {
  opacity: 1;
}

.card-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.btn.view-profile {
  padding: 0.5rem 1rem;
  background: white;
  color: black;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.btn.view-profile:hover {
  transform: scale(1.05);
}









.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

.carousel {
  display: flex;
  overflow-x: hidden;
  flex-wrap: nowrap;
  scroll-behavior: smooth;
  gap: 20px;
  padding: 1rem 2.5rem;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 2rem;
  padding: 0.2rem 0.8rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 1);
}

.carousel-btn.left {
  left: 10px;
}

.carousel-btn.right {
  right: 10px;
}

.view-all-container {
  text-align: center;
  margin-top: 1rem;
}

.view-all-link {
  color: #00aaff;
  text-decoration: none;
  font-weight: bold;
}

.view-all-link:hover {
  text-decoration: underline;
}


</style>