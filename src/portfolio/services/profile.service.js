import { Profile } from '../model/profile.entity';
import axios from 'axios';
const API_URL = 'http://localhost:3000/profile';

export async function getProfile() {
    const response = await axios.get(API_URL);
    return new Profile(response.data);

}
