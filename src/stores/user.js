// src/stores/user.js
import { defineStore } from 'pinia'
import { authService } from '../users/services/auth.service.js'

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: authService.getCurrentUser()
    }),
    actions: {
        async login(email, password) {
            const user = await authService.login(email, password)
            this.currentUser = user
        },
        logout() {
            authService.logout()
            this.currentUser = null
        }
    }
})