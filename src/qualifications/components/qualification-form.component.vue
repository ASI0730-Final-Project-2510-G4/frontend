<template>
    <div class="form-wrapper">
      <img class="avatar" :src="reviewerAvatar" />
      <div class="form-bubble">
        <Rating v-model="stars" :cancel="false" class="rating" />
  
        <Textarea
          v-model="comment"
          rows="2"
          autoResize
          placeholder="Type a Review..."
          class="input"
        />
  
        <FileUpload
          mode="basic"
          name="images[]"
          accept="image/*"
          customUpload
          @uploader="onUpload"
          chooseLabel=""
          class="upload"
        />
  
        <div class="form-actions">
          <i class="pi pi-smile"></i>
          <i class="pi pi-image"></i>
          <i class="pi pi-pencil"></i>
        </div>
      </div>
  
      <Button label="Publish" class="publish-btn" @click="submit" />
    </div>
  </template>
  
  <script>
  import Rating from 'primevue/rating';
  import Textarea from 'primevue/textarea';
  import Button from 'primevue/button';
  import FileUpload from 'primevue/fileupload';
  import Qualification from '../model/qualification.model';
  
  export default {
    name: 'QualificationForm',
    data() {
      return {
        stars: 0,
        comment: '',
        images: [],
        reviewerAvatar: 'https://i.pravatar.cc/50?u=client'
      };
    },
    emits: ['submit'],
    methods: {
      onUpload(event) {
        this.images = Array.from(event.files);
      },
      submit() {
        const qualification = new Qualification({
          id: String(Date.now()),
          reviewerName: 'Cliente Anónimo',
          reviewerAvatar: this.reviewerAvatar,
          stars: this.stars,
          comment: this.comment,
          images: this.images,
          createdAt: new Date().toISOString()
        });
  
        this.$emit('submit', qualification);
  
        // Limpiar formulario
        this.stars = 0;
        this.comment = '';
        this.images = [];
      }
    },
    components: {
      Rating,
      Textarea,
      Button,
      FileUpload
    }
  };
  </script>
  
  <style scoped>
  .form-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-top: 2rem;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .form-bubble {
    flex: 1;
    background-color: #d9d9d9;
    border-radius: 1rem;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .rating {
    margin-bottom: 0.25rem;
  }
  
  .input {
    border: none;
    background: transparent;
    resize: none;
  }
  
  .upload {
    margin-top: -0.25rem;
  }
  
  .form-actions {
    display: flex;
    gap: 0.5rem;
    font-size: 1rem;
    color: #555;
  }
  
  .publish-btn {
    background-color: #008b84;
    border: none;
    color: white;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    margin-top: 0.5rem;
  }
  </style>
  