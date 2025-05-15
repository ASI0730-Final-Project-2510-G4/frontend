<script>
import LanguageSwitcher from "./public/components/language-switcher.component.vue";

export default {
  name: 'app',
  components: { LanguageSwitcher },
  data() {
    return {
      drawer: false,
      items: [
        { labelKey: 'toolbar.home', to: '/home', icon: 'pi pi-home' },
        { labelKey: 'toolbar.findDesigner', to: '/publishing/categories', icon: 'pi pi-search' },
        { labelKey: 'toolbar.payments', to: '/payments', icon: 'pi pi-credit-card' },
        { labelKey: 'toolbar.qualifications', to: '/qualifications', icon: 'pi pi-graduation-cap' },
        { labelKey: 'toolbar.message', to: '/message', icon: 'pi pi-comment' },
        { labelKey: 'toolbar.portfolio', to: '/profile', icon: 'pi pi-briefcase' }
      ]
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
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
        <pv-button class="toolbar-icon" icon="pi pi-bars" id="bars-icon" @click="toggleDrawer" />
        <img src="../public/creatilink-logo.png" class="creatilink-logo">
        <h3 class="title-color">CreatiLink</h3>
      </template>

      <template #center>
        <div v-if="!['/dashboard', '/home'].includes($route.path)" class="flex-column">
          <router-link v-for="item in items"
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
        <pv-button class="toolbar-icon" id="user-icon" @click="$router.push('/profile')">
          <i class="pi pi-user"></i>
        </pv-button>

        <language-switcher class="language-switcher" />
      </template>
    </pv-toolbar>

    <pv-drawer class="drawer-creatilink" v-model:visible="drawer">
      <template #header>
        <div class="drawer-title">
          <img src="../public/creatilink-logo.png" class="creatilink-logo">
          <h3>CreatiLink</h3>
        </div>
      </template>
      <div class="drawer-content">
        <router-link v-for="item in items"
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
.language-switcher {
  margin-left: 1rem;
}
</style>




<style scoped>


/* Estilo para el toolbar azul oscuro */
.dark-toolbar {
  background-color: #00A295; /* Azul oscuro */
  color: white; /* Color de texto blanco */
}

/* Estilo para los botones del toolbar sin borde */
.no-border {
  border: none; /* Elimina el borde de los botones */
  background: none; /* Elimina el fondo del botón */
  color: white; /* Asegura que el texto sea blanco */
}



/* Estilos para el sidebar */
.drawer-title {
  color: white;
  display: flex;
  justify-content: center;
}





.drawer-content{
  display: flex;
  flex-direction: column;
}

.drawer-button{
  margin: 1rem;
  background-color: black;
  border-color: black;
  text-align: left;
  color:white;
  display: flex;
  justify-content: left;
}

.drawer-button:hover{
  background-color: black !important;
  border-color: #00A295 !important;
  color: #00A295 !important;
}

#bars-icon{
  background-color: transparent;
  border: none;
}

#user-icon{
  background-color: black;
  border: none;
  border-radius: 100%;
  width: 2rem;
  height: 2rem;
}

/*toolbar end*/
.toolbar-icon{
  margin-right: 1rem;
}

</style>
