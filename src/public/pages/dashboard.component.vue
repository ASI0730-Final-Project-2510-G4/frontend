<template>
  <div class="dashboard">
    <h1 class="title">{{ $t('dashboard.title') }}</h1>

    <!-- Top row (3 options) -->
    <div class="options-row">
      <div
          v-for="option in topOptions"
          :key="option.titleKey"
          class="option"
          @click="goTo(option.path)"
      >
        <div class="icon-circle">
          <img :src="option.icon" :alt="$t(option.titleKey)" class="icon" />
        </div>
        <p class="option-title">{{ $t(option.titleKey) }}</p>
      </div>
    </div>

    <!-- Bottom row (2 options centered) -->
    <div class="options-row bottom-row">
      <div
          v-for="option in bottomOptions"
          :key="option.titleKey"
          class="option"
          @click="goTo(option.path)"
      >
        <div class="icon-circle">
          <img :src="option.icon" :alt="$t(option.titleKey)" class="icon" />
        </div>
        <p class="option-title">{{ $t(option.titleKey) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const topOptions = [
  { titleKey: 'dashboard.searchDesigners', icon: '/designer.png', path: '/designers' },
  { titleKey: 'dashboard.viewPortfolio', icon: '/jobs.png', path: '/portfolio' },
  { titleKey: 'dashboard.viewPayments', icon: '/payments.png', path: '/payments' },
];

const bottomOptions = [
  { titleKey: 'dashboard.viewReviews', icon: '/reviews.png', path: '/reviews' },
  { titleKey: 'dashboard.viewChats', icon: '/chats.png', path: '/chats' },
];

const goTo = (path) => {
  router.push(path);
};
</script>
<style scoped>
.dashboard {
  min-height: 100vh;


  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}



.options-row {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.bottom-row {
  margin-top: -1rem; /* Superposición leve con fila superior */
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.option:hover {
  transform: scale(1.05);
}

.icon-circle {
  background-color: white;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.option-title {
  margin-top: 1rem;
  color: white;
  font-weight: 500;
  text-align: center;
}

</style>
