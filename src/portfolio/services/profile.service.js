import axios from 'axios';
import { Profile } from '../model/Profile.entity';

const API_URL = 'http://localhost:3000/profile';

export async function getProfile() {
    const response = await axios.get(API_URL);
    return new Profile(response.data);
}
