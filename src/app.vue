<script>
import { ref, computed, onMounted, watchEffect } from 'vue'

import { useUserStore } from './stores/user.js'


import LanguageSwitcher from "./public/components/language-switcher.component.vue"
import { authService } from "./users/services/auth.service.js"
import Menu from 'primevue/menu'
import { useRouter } from 'vue-router'
import ClientBalanceBox from './payments/components/client-balance-box.component.vue'
import { getProfile } from './portfolio/services/profile.service.js'


export default {
  name: 'app',
  components: {
    LanguageSwitcher,
    ClientBalanceBox,
    'pv-menu': Menu
  },
  setup() {
    const router = useRouter()
    const drawer = ref(false)
    const menu = ref(null)


    const userStore = useUserStore()





    watchEffect(() => {
      console.log('🔍 currentUser (store):', userStore.currentUser)
    })

    const profile = ref(null)


    const toolbarItems = computed(() => {
      const role = userStore.currentUser?.role
      if (role === 'client') {
        return [
          { labelKey: 'toolbar.home', to: '/home', icon: 'pi pi-home' },
          { labelKey: 'toolbar.findDesigner', to: '/find-designer', icon: 'pi pi-search' },
          { labelKey: 'toolbar.message', to: '/message', icon: 'pi pi-comment' }
        ]
      } else if (role === 'profile') {
        return [
          { labelKey: 'toolbar.home', to: '/home', icon: 'pi pi-home' },
          { labelKey: 'toolbar.profile', to: `/profile/${userStore.currentUser?.id}`, icon: 'pi pi-user' },
          { labelKey: 'toolbar.payments', to: '/payments', icon: 'pi pi-credit-card' },
          { labelKey: 'toolbar.qualifications', to: '/qualifications', icon: 'pi pi-graduation-cap' },
          { labelKey: 'toolbar.message', to: '/message', icon: 'pi pi-comment' }
        ]
      }
      return []
    })

    const menuItems = computed(() => [
      {
        label: profile.value?.name || 'Usuario',
        icon: 'pi pi-user'
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {

          userStore.logout()
          router.push('/login')
        }
      }
    ])

    const onUserButtonClick = (event) => {
      if (menu.value) {
        menu.value.toggle(event)
      }
    }

    onMounted(async () => {

      if (!userStore.currentUser) {
        router.push('/login')
      } else if (userStore.currentUser.role === 'profile') {
        try {
          profile.value = await getProfile(userStore.currentUser.profileId)
        } catch (err) {
          console.error("Error al cargar el perfil:", err)
        }
      }
    })

    return {
      drawer,

      currentUser: userStore.currentUser,
      toolbarItems,
      menuItems,
      menu,
      onUserButtonClick,
      profile
    }
  }
}
</script>


<template>
  <pv-toast />
  <pv-confirm-dialog />
  <header>
    <pv-toolbar class="dark-toolbar">
      <template #start>
        <pv-button class="toolbar-icon" icon="pi pi-bars" id="bars-icon" @click="drawer = !drawer" />
        <img src="../public/log2.png" class="creatilink-logo">

      </template>

      <template #center>
        <div v-if="toolbarItems.length > 0" class="flex-column">
          <router-link v-for="item in toolbarItems"
                       :key="item.labelKey"
                       v-slot="{ navigate, href }"
                       :to="item.to" custom>
            <pv-button class="p-button-text no-border" :href="href" @click="navigate">
              <i :class="item.icon"></i> {{ $t(item.labelKey) }}
            </pv-button>
          </router-link>
        </div>
      </template>

      <template #end>
        <div class="user-menu-wrapper">
          <template v-if="currentUser">
            <pv-button
                class="toolbar-icon"
                id="user-icon"
                icon="pi pi-user"
                @click="onUserButtonClick"
                aria-haspopup="true"
                aria-controls="user-menu"
            />
            <pv-menu ref="menu" :model="menuItems" popup id="user-menu" />
          </template>

          <router-link v-else to="/login" custom v-slot="{ navigate, href }">
            <pv-button class="toolbar-icon" id="user-icon" :href="href" @click="navigate">
              <i class="pi pi-user"></i>
            </pv-button>
          </router-link>
        </div>
        <template v-if="currentUser?.role === 'client'">
          <client-balance-box />
        </template>
        <language-switcher class="language-switcher" />
      </template>
    </pv-toolbar>

    <pv-drawer class="drawer-creatilink" v-model:visible="drawer">
      <template #header>
        <div class="drawer-title">
          <img src="../public/log2.png" class="creatilink-logo">
        </div>
      </template>
      <div class="drawer-content">
        <router-link v-for="item in toolbarItems"
                     :key="item.labelKey"
                     v-slot="{ navigate, href }"
                     :to="item.to" custom>
          <pv-button class="drawer-button" :href="href" @click="navigate">
            <a :class="item.icon"></a> {{ $t(item.labelKey) }}
          </pv-button>
        </router-link>
      </div>
    </pv-drawer>
  </header>

  <main>
    <router-view />
  </main>
</template>



<style scoped>
.dark-toolbar {
  background-color: #141414;
  color: white;
  border-bottom: 3px solid #765d67;
  display: flex;
  align-items: center;
  padding: 0 1rem;
}
.no-border {
  border: none;
  background: none;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
  cursor: pointer;
}
.no-border:hover {
  color: #6D3C52 !important;
  background-color: transparent !important;
}
.creatilink-logo {
  height: 100px;
  margin-right: 0.8rem;
  filter: brightness(1);
}
.drawer-title {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #765d67;
  color: white;
}
.drawer-title img.creatilink-logo {
  height: 80px;
  margin-right: 0.8rem;
}

#bars-icon,
#user-icon {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.3rem;
  transition: color 0.3s ease;
  cursor: pointer;
  margin-right: 1rem;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
}
.drawer-button {
  margin: 0.5rem 1rem;
  background-color: transparent;
  border: none;
  color: white;
  text-align: left;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s ease;
  cursor: pointer;
}
.drawer-button:hover {
  color: #6d3c52 !important;
  background-color: transparent !important;
}
#bars-icon:hover,
#user-icon:hover {
  color: #6D3C52;
}
.toolbar-icon{
  margin-right: 1rem;
}

.drawer-creatilink {
  background-color: #141414;
  color: white;
  width: 250px;
}
</style>