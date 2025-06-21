<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Create Profile</h2>
      <form @submit.prevent="handleSubmit">
        <label>Name</label>
        <input v-model="profile.name" type="text" required />

        <label>Location</label>
        <input v-model="profile.location" type="text" required />

        <label>Bio</label>
        <textarea v-model="profile.bio" required></textarea>

        <label>Experience (one per line)</label>
        <textarea
            v-model="experienceText"
            placeholder="e.g. Designer at XYZ"
        ></textarea>

        <label>Instagram</label>
        <input
            v-model="profile.social.instagram"
            type="text"
            placeholder="https://instagram.com/..."
        />

        <label>Facebook</label>
        <input
            v-model="profile.social.facebook"
            type="text"
            placeholder="https://facebook.com/..."
        />

        <label>X (Twitter)</label>
        <input
            v-model="profile.social.x"
            type="text"
            placeholder="https://x.com/..."
        />

        <div class="modal-actions">
          <button type="submit" class="btn">Create</button>
          <button type="button" class="btn cancel" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['create', 'close']);

const profile = ref({
  userId: props.userId,
  name: '',
  location: '',
  bio: '',
  icon: '',
  image: '',
  experience: [],
  social: {
    instagram: '',
    facebook: '',
    x: '',
  },
});

const experienceText = ref('');

const handleSubmit = () => {
  // Convert experience textarea into array
  profile.value.experience = experienceText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);


  console.log(' Datos que se van a emitir:', profile.value);

  emit('create', profile.value);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #000000;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
}

.modal-content h2 {
  margin-bottom: 1rem;
  text-align: center;
}

.modal-content label {
  display: block;
  margin: 0.5rem 0 0.2rem;
  font-weight: bold;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  font-size: 1rem;
}

.btn.cancel {
  background-color: #d9534f;
}

.btn:hover {
  opacity: 0.9;
}
</style>
