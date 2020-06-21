<template>
  <div>
    <p padding='10px'> {{first}} {{last}} </p>
  </div>
</template>

<script>
  // eslint-disable-next-line
  import axios from 'axios';
  // eslint-disable-next-line
  import { eventBus } from '../main';

  export default {
    name: 'Member',

    props: ['first',
            'last',
            'email'],

    data() {
      return {
      };
    },

    methods: {

    }
  };
</script>

<style scoped>
  * {
    display: flex;
  }
</style>
