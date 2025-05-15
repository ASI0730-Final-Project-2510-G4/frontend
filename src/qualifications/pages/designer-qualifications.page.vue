<template>
    <div class="page">
      <h2>My Qualifications</h2>
      <QualificationList :qualifications="qualifications" />
    </div>
  </template>
  
  <script>
  import QualificationList from '../components/qualification-list.component.vue';
  import { qualificationService } from '../services/qualification.service';
  
  export default {
    name: 'DesignerQualificationsPage',
    components: { QualificationList },
    data() {
      return {
        qualifications: []
      };
    },
    async mounted() {
      this.qualifications = await qualificationService.getQualificationsForDesigner('current-designer-id');
    }
  };
  </script>

<style scoped>
.page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.page h2 {
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  color: #333;
}
</style>
