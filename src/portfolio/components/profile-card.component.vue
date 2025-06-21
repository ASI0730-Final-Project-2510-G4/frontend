<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <div class="profile-card" v-if="!showCreateModal">
    <div class="header" >
      <div class="header-left">
      <div class="icon-container">
          <img :src="profile.icon || '/images/default-icon.jpg'" alt="Profile Icon" class="profile-icon" />
          <label class="camera-icon-icon" v-if="isOwnProfile">
            <i class="fas fa-camera"></i>
            <input type="file" @change="onIconChange" accept="image/*" class="upload-input-hidden" />
          </label>
        </div>
        <div>
          <h1>{{ profile.name }}</h1>
          <p class="location">📍 {{ profile.location }}</p>
        </div>
      </div>

      <div class="header-right" v-if="isOwnProfile">
        <button class="btn edit" @click="openEditModal">{{ $t('profile.editProfile') }}</button>
        <div class="bottom-buttons">
          <button class="btn message">{{ $t('profile.message') }}</button>
          <button class="btn follow">{{ $t('profile.follow') }}</button>
        </div>
      </div>
    </div>

    <div class="body" >
      <div class="left-section">
        <div class="nav-buttons">
          <button class="btn-tab" @click="activeTab = 'about'">{{ $t('profile.aboutMe') }}</button>
          <button class="btn-tab" @click="activeTab = 'portfolio'">{{ $t('profile.portfolio') }}</button>
        </div>

        <div class="bio" v-if="activeTab === 'about'">
          <p>{{ profile.bio }}</p>
          <ul>
            <li v-for="(item, index) in profile.experience" :key="index">{{ item }}</li>
          </ul>
        </div>

        <PortfolioSection
            v-if="activeTab === 'portfolio'"
            :projects="projects"
            :isOwner="profile.userId === currentUser.id"
        />
      </div>

      <div class="right-section">
        <div class="profile-img-container" v-if="activeTab === 'about'">
          <img :src="profile.image || 'https://i.pravatar.cc/300?img=3'" alt="Profile Photo" class="profile-img" />
          <label class="camera-icon" v-if="isOwnProfile">
            <i class="fas fa-camera"></i>
            <input type="file" @change="onImageChange" accept="image/*" class="upload-input-hidden" />
          </label>
        </div>

        <div class="social-icons-inline" v-if="activeTab === 'about'">
          <a :href="profile.social.instagram" target="_blank" class="icon instagram">
            <div class="tooltip">Instagram</div>
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a :href="profile.social.facebook" target="_blank" class="icon facebook">
            <div class="tooltip">Facebook</div>
            <i class="fa-brands fa-facebook"></i>
          </a>
          <a :href="profile.social.x" target="_blank" class="icon x">
            <div class="tooltip">X</div>
            <i class="fa-brands fa-x-twitter"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Modal Edición -->
    <div class="modal edit-modal" v-if="showEditModal && isOwnProfile">
      <div class="modal-content">
        <button class="close-btn" @click="closeEditModal">{{ $t('profile.close') }}</button>
        <h2>{{ $t('profile.editProfile') }}</h2>
        <form @submit.prevent="saveProfileChanges">
          <label>{{ $t('profile.name') }}</label>
          <input v-model="editableProfile.name" type="text" />

          <label>{{ $t('profile.location') }}</label>
          <input v-model="editableProfile.location" type="text" />

          <label>{{ $t('profile.bio') }}</label>
          <textarea v-model="editableProfile.bio"></textarea>

          <label>{{ $t('profile.experience') }}</label>
          <textarea v-model="experienceText"></textarea>

          <label>{{ $t('profile.instagram') }}</label>
          <input v-model="editableProfile.social.instagram" type="text" />

          <label>{{ $t('profile.facebook') }}</label>
          <input v-model="editableProfile.social.facebook" type="text" />

          <label>{{ $t('profile.x') }}</label>
          <input v-model="editableProfile.social.x" type="text" />

          <button type="submit" class="btn edit">{{ $t('profile.save') }}</button>
        </form>
      </div>
    </div>
  </div>
  <CreateProfileModal
      v-if="showCreateModal"
      :userId="currentUser?.id"
      @create="handleCreateProfile"
      @close="showCreateModal = false"
  />
</template>

<script setup>
import CreateProfileModal from '../components/Create-profile.component.vue'
import PortfolioSection from '../pages/portfolio.component.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProfile } from '../services/profile.service.js'

const router = useRouter()
const route = useRoute()

const activeTab = ref('about')
const profile = ref({
  name: '',
  location: '',
  bio: '',
  image: '',
  icon: '',
  experience: [],
  social: {
    instagram: '',
    facebook: '',
    x: ''
  }
})


const projects = ref([]);

const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || {})
const isOwnProfile = computed(() => currentUser.value?.id == route.params.profileId);


const showEditModal = ref(false)
const editableProfile = ref({})
const experienceText = ref('')
const showCreateModal = ref(false)


const openEditModal = () => {
  editableProfile.value = JSON.parse(JSON.stringify(profile.value))
  experienceText.value = editableProfile.value.experience.join('\n')
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const saveProfileChanges = async () => {
  editableProfile.value.experience = experienceText.value.split('\n').map(e => e.trim()).filter(Boolean);

  try {
    const response = await fetch(`http://localhost:3000/profiles/${editableProfile.value.id}`, {
    //const response = await fetch(`https://creatilink-api-production-4e2f.up.railway.app/api/v1/profiles/${editableProfile.value.id}`, {

      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editableProfile.value)
    });

    if (!response.ok) throw new Error('Error al guardar en el servidor');

    const updated = await response.json();
    profile.value = updated;
    closeEditModal();
  } catch (error) {
    alert('Error al guardar los cambios: ' + error.message);
  }
};

onMounted(async () => {
  try {
    const userId = route.params.profileId;
    if (!userId) {
      showCreateModal.value = true;
      return;
    }

    const loadedProfile = await getProfile(userId);

    if (!loadedProfile || Object.keys(loadedProfile).length === 0) {
      // Solo muestra modal si estás viendo tu propio perfil
      showCreateModal.value = isOwnProfile.value;
      return;
    }

    profile.value = loadedProfile;


    //const res = await fetch(`https://creatilink-api-production-4e2f.up.railway.app/api/v1/projects/by-profile/${loadedProfile.id}`);
    const res = await fetch(`http://localhost:3000/projects?profileId=${loadedProfile.id}`);



    projects.value = await res.json();


  } catch (err) {
    console.error('Error cargando perfil:', err);
    showCreateModal.value = isOwnProfile.value;
  }
});

const handleCreateProfile = async (newProfile) => {
  try {

    newProfile.id = currentUser.value.id;
    newProfile.userId = currentUser.value.id;
    console.log(' Datos que se van a enviar al backend:', JSON.stringify(newProfile, null, 2));


    //const response = await fetch('https://creatilink-api-production-4e2f.up.railway.app/api/v1/profiles', {
      const response = await fetch('http://localhost:3000/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile)
    });

    if (!response.ok) throw new Error('Error al crear el perfil');

    const created = await response.json();
    profile.value = created;
    showCreateModal.value = false;
  } catch (err) {
    alert('No se pudo crear el perfil: ' + err.message);
  }
};





const updateProfile = async (updatedProfile) => {
  try {
    const response = await fetch(`http://localhost:3000/profiles/${updatedProfile.id}`, {
    //const response = await fetch(`https://creatilink-api-production-4e2f.up.railway.app/api/v1/profiles/${updatedProfile.id}`, {

      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    });

    if (!response.ok) throw new Error('Error al actualizar el perfil');

    const updated = await response.json();
    profile.value = updated;

    if (showEditModal.value) {
      editableProfile.value = JSON.parse(JSON.stringify(updated));
      experienceText.value = editableProfile.value.experience.join('\n');
    }
  } catch (err) {
    alert('Error al actualizar el perfil: ' + err.message);
  }
};

const onImageChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const updated = { ...profile.value, image: reader.result }
    updateProfile(updated)
  }
  reader.readAsDataURL(file)
}

const onIconChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const updated = { ...profile.value, icon: reader.result }
    updateProfile(updated)
  }
  reader.readAsDataURL(file)
}

</script>


<style scoped>



.camera-icon-icon {
  position: absolute;
  top: 0px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  color: #000000;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.camera-icon-icon:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.icon-container {
  position: relative;
}




.profile-icon {
  width: 150px;
  height: 150px;
  border-radius: 5px;
  object-fit: cover;

}

.profile-img-container {
  position: relative;
  width: 100%;
  max-width: 300px;
}

.camera-icon {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: rgba(255, 255, 255, 0.6);
  color: #000000;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.camera-icon:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.upload-input-hidden {
  display: none;
}

.profile-card {
  max-width: 1500px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}


.header {
  max-width: 1500px;
  margin: 0 auto;

  background: linear-gradient(to right, #7a1c2f, #9d2d44);
  color: #000000;
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon {
  width: 100px;
  height: 100px;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.btn {
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  font-weight: 600;
  cursor: pointer;
}

.edit {
  cursor: pointer;
  position: relative;
  padding: 10px 24px;
  font-size: 18px;
  color: rgb(0, 0, 0);
  border: 2px solid rgb(0, 0, 0);
  border-radius: 34px;
  background-color: transparent;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  overflow: hidden;
}

.edit:hover {
  color: #212121;
  scale: 1.1;
  box-shadow: 0 0px 20px rgb(118, 93, 103);
}

.edit:active{
  scale: 1;
}

.edit:hover::before {
  scale: 3;
}

.edit::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 50px;
  height: 50px;
  border-radius: inherit;
  scale: 0;
  z-index: -1;
  background-color: rgb(118, 93, 103);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}


.bottom-buttons {
  display: flex;
  gap: 0.5rem;
}

.message,
.follow {
  background-color: white;
  color: #000000;
}

.body {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 2rem;
  gap: 2rem;
  color: #000;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.left-section {
  flex: 1 1 60%;
  min-width: 300px;
  box-sizing: border-box;
}




.nav-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-tab {
  cursor: pointer;
  position: relative;
  padding: 10px 24px;
  font-size: 18px;
  color: rgb(118, 93, 103);
  border: 2px solid rgb(118, 93, 103);
  border-radius: 34px;
  background-color: transparent;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  overflow: hidden;
}

.btn-tab::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 50px;
  height: 50px;
  border-radius: inherit;
  scale: 0;
  z-index: -1;
  background-color: rgb(118, 93, 103);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.btn-tab:hover::before {
  scale: 3;
}

.btn-tab:hover {
  color: #212121;
  scale: 1.1;
  box-shadow: 0 0px 20px rgb(118, 93, 103);
}

.btn-tab:active {
  scale: 1;
}


@media (max-width: 768px) {
  .left-section,
  .right-section {
    flex: 1 1 100%;
  }
}

.profile-img {
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  object-fit: cover;
  box-sizing: border-box;
}


.modal.social-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal.social-modal .modal-content {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 10px;
  position: relative;
  text-align: center;
  width: 90%;
  max-width: 400px;
  max-height: 210px;

  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
}



.modal.social-modal .close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #fff;
  background-color: red;
  border-radius: 50%;
}

.modal.social-modal .close-btn:hover {
  background-color: darkred;
}



.social-photos a {
  display: inline-block;
  cursor: pointer;
}

.social-photos img {
  width: 70px;
  height: 70px;
  object-fit: contain;
}


.modal.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  z-index: 1000;
}

.modal.edit-modal .modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  position: relative;
  text-align: left;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  color: #000;
}


.modal.edit-modal .close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #fff;
  background-color: #ff0000;
  border-radius: 50%;
}

.modal.edit-modal .close-btn:hover {
  background-color: #ff8080;
}

form label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

form input,
form textarea {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
}

form textarea {
  height: 120px;
  resize: vertical;
}

form button {
  background-color: #765d67;
  color: #fff;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

form button:hover {
  background-color: #9d2d44;
}


.icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 3px;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  text-decoration: none;
  color: inherit;
}

.icon .tooltip {
  position: absolute;
  top: -15px;
  background: #333;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(10px);
  transition: 0.3s;
  white-space: nowrap;
}

.icon:hover .tooltip {
  opacity: 1;
  transform: translateY(0);
}

.icon i {
  font-size: 40px;
}

.icon.instagram i {
  color: #E1306C;
}

.icon.facebook i {
  color: #1877F2;
}

.icon.x i {
  color: #000000;
}
.icon.instagram .tooltip {
  background: #E1306C;
}

.icon.facebook .tooltip {
  background: #1877F2;
}

.icon.x .tooltip {
  background: #000000;
}



.social-icons-inline {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 0px;
}

.social-icons-inline .icon {
  font-size: 20px;
  color: #555;
  transition: color 0.3s;
}

.social-icons-inline .icon:hover {
  color: #e1306c;
}

.social-icons-inline .facebook:hover {
  color: #3b5998;
}

.social-icons-inline .x:hover {
  color: #000;
}


</style>