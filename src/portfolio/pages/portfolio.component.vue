<template>
  <div class="portfolio-wrapper">



    <!-- Contenedor para los botones alineados a la izquierda -->
    <div class="buttons-container-left">
      <button class="add-btn" @click="showAddModal = true"> {{ $t('portfolio.addProject') }}</button>
      <button class="delete-btn" @click="showDeleteModal"> {{ $t('portfolio.deleteProjects') }}</button>
    </div>

    <div class="portfolio-grid">
      <PortfolioCard
          v-for="(project, index) in projects"
          :key="index"
          :project="project"
          @update-project="updateProject"
      />
    </div>

    <!-- MODAL AÑADIR PROYECTO -->
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

    <!-- MODAL ELIMINAR PROYECTOS -->
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
              <button class="confirm-delete" @click="showConfirmDeleteModal(project)">
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


    <!-- MODAL DE CONFIRMAR ELIMINACIÓN -->
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




onMounted(async () => {
  projects.value = await getProjects()
})

const updateProject = async (updatedProject) => {
  const index = projects.value.findIndex(p => p.id === updatedProject.id)
  if (index !== -1) projects.value[index] = updatedProject

  try {
    const { data: profile } = await axios.get('http://localhost:3000/profile')
    profile.projects = profile.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
    await axios.put('http://localhost:3000/profile', profile)
  } catch (error) {
    console.error('Error al guardar cambios:', error)
  }
}


// Abrir el modal para eliminar proyectos
const showDeleteModal = () => {
  showDeleteModalFlag.value = true
}

const cancelDelete = () => {
  showDeleteModalFlag.value = false
  showConfirmDeleteModalFlag.value = false
  projectToDelete.value = null
}

// Mostrar el modal de confirmación de eliminación de un proyecto
const showConfirmDeleteModal = (project) => {
  projectToDelete.value = project
  showConfirmDeleteModalFlag.value = true
}

// Confirmar la eliminación del proyecto
const confirmDelete = async () => {
  try {
    // Eliminar el proyecto del servidor
    const { data: profile } = await axios.get('http://localhost:3000/profile')
    profile.projects = profile.projects.filter(p => p.id !== projectToDelete.value.id)
    await axios.put('http://localhost:3000/profile', profile)

    // Eliminar el proyecto de la lista en el frontend
    projects.value = projects.value.filter(p => p.id !== projectToDelete.value.id)

    // Cerrar los modales
    showConfirmDeleteModalFlag.value = false
    showDeleteModalFlag.value = false
    projectToDelete.value = null
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error)
  }
}

// Subir la imagen del proyecto
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    newProject.value.image = reader.result
  }
  reader.readAsDataURL(file)
}

// Guardar el nuevo proyecto
const saveNewProject = async () => {
  if (!newProject.value.title || !newProject.value.description || !newProject.value.image) {
    alert('Todos los campos son obligatorios.')
    return
  }

  try {
    const { data: profile } = await axios.get('http://localhost:3000/profile')
    const existingProjects = profile.projects || []
    const maxId = existingProjects.reduce((max, p) => (p.id > max ? p.id : max), 0)
    const newId = maxId + 1

    const randomLikes = Math.floor(Math.random() * 90000 + 1000)
    const randomComments = Math.floor(Math.random() * 15000 + 100)
    const techArray = newProject.value.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0)
    const projectToAdd = {
      id: newId,
      title: newProject.value.title,
      description: newProject.value.description,
      image: newProject.value.image,
      likes: randomLikes,
      comments: randomComments,
      technologies: techArray

    }

    profile.projects.push(projectToAdd)
    await axios.put('http://localhost:3000/profile', profile)

    projects.value.push(projectToAdd)
    showAddModal.value = false
    newProject.value = { title: '', description: '', image: '' }
  } catch (error) {
    console.error('Error al añadir proyecto:', error)
  }
}




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

  /* Añade estos dos estilos */
  background-color: #ffffff; /* Fondo blanco */
  color: #000000; /* Texto negro */
}


/* Cuadrícula de portafolio con ajuste dinámico de columnas */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); /* Usamos auto-fit para un ajuste mejor */
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 60px;
  padding: 0 20px; /* Asegura que no haya espacio extra en los lados */
  justify-items: center; /* Centra las tarjetas dentro de sus celdas */

}


/* Media queries para pantallas pequeñas */
@media (max-width: 768px) {
  .portfolio-grid {
    grid-template-columns: 1fr; /* En pantallas pequeñas, 1 columna */
    gap: 16px; /* Reduce el espacio entre las tarjetas */
  }
}

@media (max-width: 480px) {
  .portfolio-wrapper {
    padding: 20px 10px; /* Reduce el padding en pantallas más pequeñas */
  }
}


/* Modal básico */
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
/* Estilos de los botones */
.add-btn, .delete-btn {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 8px;
  color: white;
}
.add-btn {
  background-color: #28a745;
}

.delete-btn {
  background-color: #dc3545;
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

.add-btn {
  background-color: #28a745;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}


/* Estilo para los botones sobre la primera tarjeta */
.buttons-container-left {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  position: absolute; /* Coloca los botones encima de las tarjetas */
  left: 0;
  top: 0;
  padding: 20px;
  z-index: 10;
  width: 100%; /* Asegura que se acomoden bien */
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
  text-align: center; /* Asegura que el texto esté centrado */


}

.confirm-delete:hover {
  background-color: #c0392b;
}

.delete-modal-actions {
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */


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



