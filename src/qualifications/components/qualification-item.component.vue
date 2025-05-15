<template>
    <div class="qualification">
      <div class="top">
        <Avatar :image="qualification.reviewerAvatar" size="large" />
        <div>
          <strong>{{ qualification.reviewerName }}</strong>
          <Rating :modelValue="qualification.stars" readonly :cancel="false" />
        </div>
      </div>
      <p>{{ qualification.comment }}</p>
      <div class="images" v-if="qualification.images">
        <img v-for="(img, i) in qualification.images" :key="i" :src="img" />
      </div>
    </div>
  </template>
  
  <script>
  import Avatar from 'primevue/avatar';
  import Rating from 'primevue/rating';
  
  export default {
    name: 'QualificationItem',
    props: {
      qualification: Object
    },
    components: {
      Avatar,
      Rating
    }
  };
  </script>


<style scoped>
.qualification {
  background-color: #f4f4f4;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.top strong {
  font-size: 1.1rem;
}

.images {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.images img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ccc;
}
</style>
