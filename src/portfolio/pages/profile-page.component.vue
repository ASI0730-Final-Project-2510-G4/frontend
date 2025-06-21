<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ProfileCard from '../components/profile-card.component.vue';

const route = useRoute();
const profile = ref(null);
const showCreateModal = ref(false);

onMounted(async () => {
  try {
    const userId = route.params.profileId;
    profile.value = await getProfileById(userId);
  } catch (err) {
    console.error('Error cargando perfil:', err);
  }
});

const getProfileById = async (userId) => {
  const response = await fetch(`http://localhost:3000/profiles?userId=${userId}`);
  const data = await response.json();
  return data[0] || null;
};

const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const createProfile = async (newProfile) => {
  try {

    const resProfiles = await fetch('http://localhost:3000/profiles');
    if (!resProfiles.ok) throw new Error('Error obteniendo perfiles');

    const profiles = await resProfiles.json();
    const lastId = profiles.length > 0 ? Math.max(...profiles.map(p => Number(p.id))) : 0;
    const nextId = lastId + 1;


    const profileToCreate = {
      id: nextId,
      ...newProfile
    };


    const response = await fetch('http://localhost:3000/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileToCreate),
    });

    if (!response.ok) throw new Error('Error creando perfil');

    const createdProfile = await response.json();
    profile.value = createdProfile;
    closeCreateModal();
  } catch (error) {
    alert(error.message);
  }
};


/*
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ProfileCard from '../components/profile-card.component.vue';

const route = useRoute();
const profile = ref(null);
const showCreateModal = ref(false);

const API_BASE_URL = 'https://creatilink-api-production-4e2f.up.railway.app/api/v1/profiles';


onMounted(async () => {
  try {
    const userId = route.params.profileId;
    profile.value = await getProfileByUserId(userId);
  } catch (err) {
    console.error('Error cargando perfil:', err);
  }
});

const getProfileByUserId = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/by-user?userId=${userId}`);
  if (!response.ok) {
    throw new Error('No se pudo cargar el perfil');
  }
  const data = await response.json();
  return data;
};

const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const createProfile = async (newProfile) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newProfile),
    });
    if (!response.ok) throw new Error('Error creando perfil');
    const createdProfile = await response.json();
    profile.value = createdProfile;
    closeCreateModal();
  } catch (error) {
    alert(error.message);
  }
};*/
</script>

<template>
  <section class="profile-page">
    <ProfileCard v-if="profile" :profile="profile" />

    <div v-else>
      <button @click="openCreateModal" class="btn create-profile-btn">Create Profile</button>

      <CreateProfileModal
          v-if="showCreateModal"
          :userId="route.params.profileId"
          @close="closeCreateModal"
          @create="createProfile"
      />
    </div>
  </section>
</template>


<style scoped>
.profile-page {
  padding: 2rem;
}
</style>