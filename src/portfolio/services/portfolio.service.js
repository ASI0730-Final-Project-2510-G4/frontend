/*import axios from 'axios';

export async function getProjects(profileId) {
    try {
        const response = await axios.get(`https://creatilink-api-production-4e2f.up.railway.app/api/v1/projects/by-profile/${profileId}`);

        const profileProjects = response.data.filter(project => project.profileId === profileId);

        return profileProjects;
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        return [];
    }
}*/

import axios from 'axios';

export async function getProjects(profileId) {
    try {
        const response = await axios.get(`http://localhost:3000/projects?profileId=${profileId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        return [];
    }
}