<template>
    <div class="page">
      <h2>Qualifications</h2>
      <QualificationList :qualifications="qualifications" />
      <QualificationForm @submit="handleSubmit" />
    </div>
  </template>
  
  <script>
  import QualificationList from '../components/qualification-list.component.vue';
  import QualificationForm from '../components/qualification-form.component.vue';
  import { qualificationService } from '../services/qualification.service';
  
  export default {
    name: 'ProfileQualificationsPage',
    components: {
      QualificationList,
      QualificationForm
    },
    data() {
      return {
        qualifications: []
      };
    },
    async mounted() {
      const designerId = this.$route.params.id || 'default-id';
      this.qualifications = await qualificationService.getQualificationsForDesigner(designerId);
    },
    methods: {
      async handleSubmit(qualification) {
        await qualificationService.submitQualification(qualification);
      }
    }
  };
  </script>