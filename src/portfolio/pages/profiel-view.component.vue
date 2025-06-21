<template>
  <div class="user-list-container">
    <h2>{{ $t('userList.title') }}</h2>
    <div class="card-grid">
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
  </div>
</template>


<script>
import { authService } from "../../users/services/auth.service.js";
import axios from 'axios';

//const API_URL_PROFILES = 'https://creatilink-api-production-4e2f.up.railway.app/api/v1/profiles';
const API_URL_PROFILES = 'http://localhost:3000/profiles';


export default {
  data() {
    return {
      currentUser: null,
      allUsers: [],
      profiles: []
    };
  },
  methods: {
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
      return this.profiles.find(p => p.userId === String(userId));
    },

    getProfileImage(userId) {
      const profile = this.getProfileByUserId(userId);
      return profile ? profile.image : '';
    },

    getProfileName(userId) {
      const profile = this.getProfileByUserId(userId);
      return profile ? profile.name : '';
    },

    getCardBackground(userId) {
      const image = this.getProfileImage(userId);
      return {
        backgroundImage: `url('${image}')`
      };
    },

    goToProfile(userId) {
      const profile = this.getProfileByUserId(userId);
      if (profile) {
        this.$router.push({ name: 'profile', params: { profileId: profile.id } });
      } else {
        console.warn(`No se encontró perfil para el usuario con ID ${userId}`);
      }
    }

  },

  computed: {
    otherUsers() {
      const filtered = this.allUsers.filter(user => user.id !== this.currentUser.id);
      console.log("Usuarios que se están mostrando (otherUsers):", filtered);
      return filtered;
    }
  },

  created() {
    this.fetchUsers();
  }
};
</script>


<style scoped>
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



</style>
