<template>
    <div>
      <QualificationItem
        v-for="q in qualifications"
        :key="q.id"
        :qualification="q"
      />
    </div>
  </template>
  
  <script>
  import QualificationItem from './qualification-item.component.vue';
  
  export default {
    name: 'QualificationList',
    props: {
      qualifications: Array
    },
    components: {
      QualificationItem
    }
  };
  </script>

<style scoped>

</style>
