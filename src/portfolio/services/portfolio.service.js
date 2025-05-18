// project.service.js
import axios from 'axios'

export async function getProjects() {

    try {
        const response = await axios.get('http://localhost:3000/profile')
        return response.data.projects
    } catch (error) {
        console.error('Error al obtener proyectos:', error)
        return []
    }
}