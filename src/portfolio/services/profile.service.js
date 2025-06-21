// src/services/profile.service.js
import { Profile } from '../model/profile.entity';
import axios from 'axios';

const API_URL_PROFILES = 'http://localhost:3000/profiles';
const API_URL_PROJECTS = 'http://localhost:3000/projects';

/*
const BASE_URL = 'https://creatilink-api-production-4e2f.up.railway.app/api/v1';

const API_URL_PROFILES = `${BASE_URL}/profiles`;
const API_URL_PROJECTS = `${BASE_URL}/projects`;
*/


export async function getProfile(userId) {
    try {
        const response = await axios.get(`${API_URL_PROFILES}?userId=${userId}`);
        const profiles = response.data;

        if (!profiles.length) {
            return null;
        }

        const profileData = profiles[0];

        const projectsRes = await axios.get(`${API_URL_PROJECTS}?profileId=${profileData.id}`);
        profileData.projects = projectsRes.data;

        return new Profile(profileData);
    } catch (err) {
        console.error('Error cargando perfil:', err);
        throw err;
    }
}

/*
export async function getProfile(userId) {
    try {
        console.log('🧪 ID enviado a getProfile:', userId);

        const response = await axios.get(`${API_URL_PROFILES}/by-user?userId=${userId}`);
        const profileData = response.data;

        //  Asegúrate que tu backend tenga este endpoint también - ESTO SIEMPRE VA COMENTADO
        //const projectsRes = await axios.get(`${API_URL_PROJECTS}?profileId=${profileData.id}`);
        //profileData.projects = projectsRes.data;

        return new Profile(profileData);
    } catch (err) {
        console.error('Error cargando perfil:', err);
        throw err;
    }
}*/
