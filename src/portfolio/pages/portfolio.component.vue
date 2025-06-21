<template>
  <div class="portfolio-wrapper">


    <div class="buttons-container-left" v-if="isOwner">


      <button class="add-btn" @click="showAddModal = true"> {{ $t('portfolio.addProject') }}</button>
      <button class="delete-btn" @click="showDeleteModal"> {{ $t('portfolio.deleteProjects') }}</button>
    </div>

    <div class="portfolio-grid">
      <PortfolioCard
          v-for="(project, index) in projectList"
          :key="project.id"
          :project="project"
          :isOwner="props.isOwner"
          @update-project="updateProject"
      />

    </div>


    <div class="modal-backdrop" v-if="showAddModal">
      <div class="modal">
        <h2>{{ $t('portfolio.addNewProject') }}</h2>

        <label>{{ $t('portfolio.title') }}:
          <input v-model="newProject.title" type="text" />
        </label>

        <label>{{ $t('portfolio.description') }}:
          <textarea v-model="newProject.description"></textarea>
        </label>

        <label>{{ $t('portfolio.technologies') }}:
          <input v-model="newProject.technologies" type="text" placeholder="Ej: Photoshop, Ilustración digital" />
        </label>


        <label>{{ $t('portfolio.uploadImage') }}:
          <div class="image-upload">
            <label class="upload-label">
              <i class="fas fa-camera"></i>
              <input type="file" @change="handleImageUpload" accept="image/*" class="upload-hidden" />
            </label>
          </div>
        </label>

        <div class="image-preview" v-if="newProject.image">
          <img :src="newProject.image" alt="Preview" />
        </div>

        <div class="modal-actions">
          <button @click="saveNewProject">{{ $t('portfolio.save') }}</button>
          <button class="cancel" @click="showAddModal = false">{{ $t('portfolio.cancel') }}</button>
        </div>
      </div>
    </div>

    <div class="delete-modal-backdrop" v-if="showDeleteModalFlag">
      <div class="delete-modal">
        <h2 class="delete-modal-title">{{ $t('portfolio.deleteProject') }}</h2>

        <div class="delete-project-list">
          <div
              v-for="(project, index) in projects"
              :key="project.id"
              class="delete-project-item"
          >
            <img :src="project.image" alt="Project Image" />
            <div class="project-info">
              <p class="project-title">{{ project.title }}</p>
              <button class="confirm-delete" @click="showConfirmDeleteModal(project)" v-if="props.isOwner">
                {{ $t('portfolio.delete') }}
              </button>
            </div>
          </div>

        </div>

        <div class="delete-modal-actions">
          <button class="cancel-delete" @click="cancelDelete">
            {{ $t('portfolio.cancel') }}
          </button>
        </div>
      </div>
    </div>


    <div class="delete-modal-backdrop" v-if="showConfirmDeleteModalFlag">
      <div class="delete-modal">
        <h2 class="delete-modal-title">{{ $t('portfolio.confirmDelete') }}</h2>
        <p class="delete-modal-text">{{ $t('portfolio.deleteConfirmationMessage') }}</p>
        <div class="delete-preview">
          <img :src="projectToDelete?.image" alt="Project Preview" />
          <div class="delete-project-name">{{ projectToDelete?.title }}</div>
        </div>
        <div class="delete-modal-actions">
          <button class="confirm-delete" @click="confirmDelete">{{ $t('portfolio.confirmDelete') }}</button>
          <button class="cancel-delete" @click="cancelDelete">{{ $t('portfolio.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PortfolioCard from '../../portfolio/components/portfolio-card.component.vue'
import { getProjects } from '../services/portfolio.service.js'

const projects = ref([])
const showAddModal = ref(false)
const newProject = ref({ title: '', description: '', image: '', technologies: [] })
const showDeleteModalFlag = ref(false)
const showConfirmDeleteModalFlag = ref(false)
const projectToDelete = ref(null)

import { computed } from 'vue'

const projectList = computed(() => {
  return props.isOwner ? projects.value : props.projects
})


const props = defineProps({
  projects: {
    type: Array,
    required: true
  },
  isOwner: {
    type: Boolean,
    required: true
  }
});


/*
const fetchProfileIdByUserId = async (userId) => {
  try {
    const { data: profile } = await axios.get(`https://creatilink-api-production-4e2f.up.railway.app/api/v1/profiles/by-user`, {
      params: { userId }
    });

    return profile?.id || null;
  } catch (error) {
    console.error('Error al obtener el perfil por userId:', error);
    return null;
  }
};*/

const fetchProfileIdByUserId = async (userId) => {
  try {

    const response = await axios.get('http://localhost:3000/profiles');
    const profiles = response.data;


    const profile = profiles.find(p => p.userId === Number(userId));


    return profile?.id || null;
  } catch (error) {
    console.error('Error al obtener el perfil por userId:', error);
    return null;
  }
};



onMounted(async () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    console.error('No hay usuario logueado');
    return;
  }

  const profileId = await fetchProfileIdByUserId(currentUser.id);
  if (!profileId) {
    console.error('No se encontró un perfil para este usuario');
    return;
  }


  currentUser.profileId = profileId;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  projects.value = await getProjects(profileId);
});



const updateProject = async (updatedProject) => {
  const index = projects.value.findIndex(p => p.id === updatedProject.id)
  if (index !== -1) projects.value[index] = updatedProject

  try {
    //await axios.put(`https://creatilink-api-production-4e2f.up.railway.app/api/v1/projects/${Number(updatedProject.id)}`, updatedProject);
    await axios.put(`http://localhost:3000/projects/${updatedProject.id}`, updatedProject);
  } catch (error) {
    console.error('Error al guardar cambios:', error)
  }
}

const showDeleteModal = () => {
  showDeleteModalFlag.value = true
}

const cancelDelete = () => {
  showDeleteModalFlag.value = false
  showConfirmDeleteModalFlag.value = false
  projectToDelete.value = null
}

const showConfirmDeleteModal = (project) => {
  projectToDelete.value = project
  showConfirmDeleteModalFlag.value = true
}
const confirmDelete = async () => {
  try {
    //await axios.delete(`https://creatilink-api-production-4e2f.up.railway.app/api/v1/projects/${Number(projectToDelete.value.id)}`);
    await axios.delete(`http://localhost:3000/projects/${projectToDelete.value.id}`);

    projects.value = projects.value.filter(p => p.id !== projectToDelete.value.id);

    showConfirmDeleteModalFlag.value = false;
    showDeleteModalFlag.value = false;
    projectToDelete.value = null;
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    newProject.value.image = reader.result
  }
  reader.readAsDataURL(file)
}
const saveNewProject = async () => {
  if (!newProject.value.title || !newProject.value.description || !newProject.value.image) {
    alert('Todos los campos son obligatorios.')
    return
  }

  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileId = currentUser.profileId;

    const randomLikes = Math.floor(Math.random() * 90000 + 1000);
    const randomComments = Math.floor(Math.random() * 15000 + 100);

    const techArray = newProject.value.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

    const projectToAdd = {
      profileId: profileId,
      title: newProject.value.title,
      description: newProject.value.description,
      image: newProject.value.image,
      likes: randomLikes,
      comments: randomComments,
      technologies: techArray,
    };

    console.log('🔍 Enviando proyecto al backend:', projectToAdd);

    //const { data: addedProject } = await axios.post('https://creatilink-api-production-4e2f.up.railway.app/api/v1/projects', projectToAdd);
    const { data: addedProject } = await axios.post('http://localhost:3000/projects', projectToAdd);
    projects.value.push(addedProject);

    showAddModal.value = false;
    newProject.value = { title: '', description: '', image: '', technologies: '' };

  } catch (error) {
    console.error('❌ Error al añadir proyecto:', error.response?.data || error.message);
  }
};


</script>


<style scoped>


.portfolio-wrapper {

  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  overflow-x: hidden;
  background-color: #ffffff;
  color: #000000;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 60px;
  padding: 0 20px;
  justify-items: center;

}


@media (max-width: 768px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
@media (max-width: 480px) {
  .portfolio-wrapper {
    padding: 20px 10px;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;

}

.upload-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}





.image-preview {
  margin: 10px 0;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.add-btn, .delete-btn {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 8px;
  color: white;
}
.add-btn {
  cursor: pointer;
  position: relative;
  padding: 10px 24px;
  font-size: 18px;
  color: rgb(0, 255, 45);
  border: 2px solid rgb(166, 255, 166);
  border-radius: 34px;
  background-color: transparent;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  overflow: hidden;
}

.add-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 50px;
  height: 50px;
  border-radius: inherit;
  scale: 0;
  z-index: -1;
  background-color: rgb(166, 255, 166);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.add-btn:hover::before {
  scale: 3;
}

.add-btn:hover {
  color: #212121;
  scale: 1.1;
  box-shadow: 0 0px 20px rgb(166, 255, 166);
}

.add-btn:active {
  scale: 1;
}









.delete-btn {
  cursor: pointer;
  position: relative;
  padding: 10px 24px;
  font-size: 18px;
  color: rgb(0, 255, 45);
  border: 2px solid rgb(255, 120, 120);
  border-radius: 34px;
  background-color: transparent;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  overflow: hidden;
}

.delete-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 50px;
  height: 50px;
  border-radius: inherit;
  scale: 0;
  z-index: -1;
  background-color: rgb(255, 120, 120);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.delete-btn:hover::before {
  scale: 3;
}

.delete-btn:hover {
  color: #212121;
  scale: 1.1;
  box-shadow: 0 0px 20px rgb(255, 120, 120);
}

.delete-btn:active {
  scale: 1;
}












.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
}

.modal label {
  display: block;
  margin-top: 15px;
  font-weight: bold;
}

.modal input,
.modal textarea {
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.modal-actions .cancel {
  background: #ccc;
}

.modal-actions button:first-child {
  background: #2ecc71;
  color: white;
}

.image-upload {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.upload-label {
  cursor: pointer;
  font-size: 24px;
  color: #2c3e50;
}

.upload-hidden {
  display: none;
}

.image-preview {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 10px;
}


.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.delete-project-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.delete-project-item {
  display: flex;
  gap: 16px;
  align-items: center;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
}

.delete-project-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.delete-project-item button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.2s;
}

.delete-project-item button:hover {
  background-color: darkred;
}


.add-btn, .delete-btn {
  padding: 10px 20px;
  cursor: pointer;
}



.delete-btn {
  background-color: #dc3545;
  color: white;
}



.buttons-container-left {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 20px;
  z-index: 10;
  width: 100%;
}

.add-btn, .delete-btn {
  padding: 10px 20px;
  cursor: pointer;
}

.add-btn {
  background-color: #28a745;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.delete-modal {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-align: center;
}

.delete-modal-title {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.delete-modal-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.delete-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.delete-preview img {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.delete-project-name {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #444;
}

.delete-modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;

}

.confirm-delete {
  padding: 10px 20px;
  background-color: #ffffff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-delete {
  padding: 10px 20px;
  background-color: #bdc3c7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}







.delete-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.2s ease-in-out;
}

.delete-modal {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.delete-modal-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.delete-project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;

}

.delete-project-item {
  display: flex;
  gap: 16px;
  align-items: center;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

}

.delete-project-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;

}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

}

.project-info p {
  margin: 0;
  font-weight: 500;

}

.confirm-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;


}

.confirm-delete:hover {
  background-color: #c0392b;
}

.delete-modal-actions {
  display: flex;
  justify-content: center;
  align-items: center;


}

.cancel-delete {
  background-color: #bdc3c7;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer;
}

.cancel-delete:hover {
  background-color: #95a5a6;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}


</style>




