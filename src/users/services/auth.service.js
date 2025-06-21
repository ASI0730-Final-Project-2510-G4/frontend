const BASE_URL = 'http://localhost:3000'; // Dirección local de tu JSON
const USERS_URL = `${BASE_URL}/users`;

export const authService = {
    async login(email, password) {
        const res = await fetch(USERS_URL);
        if (!res.ok) throw new Error('Error al acceder a los usuarios');

        const users = await res.json();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) throw new Error('Correo o contraseña incorrectos');

        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    },

    async register(userData) {
        // Obtener todos los usuarios actuales para encontrar el último ID
        const resUsers = await fetch(USERS_URL);
        if (!resUsers.ok) throw new Error('Error al obtener usuarios para generar ID');

        const users = await resUsers.json();
        const lastId = users.length > 0 ? Math.max(...users.map(u => Number(u.id))) : 0;
        const newId = lastId + 1;

        const newUser = {
            id: newId,
            ...userData
        };

        // Registrar el nuevo usuario
        const res = await fetch(USERS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (!res.ok) throw new Error('Error al registrar usuario');

        return await res.json();
    },

    logout() {
        localStorage.removeItem('currentUser');
    },

    getCurrentUser() {
        const data = localStorage.getItem('currentUser');
        return data ? JSON.parse(data) : null;
    },

    async getAllUsers() {
        const res = await fetch(USERS_URL);
        if (!res.ok) throw new Error('Error al obtener los usuarios');

        return await res.json();
    }
};
