<template>
       <b-modal v-bind:hide-footer="true" id="my-modal">
         <template v-slot:modal-title>
          <h3> Restaurant Suggesting </h3>
        </template>
          <RestaurantList v-bind:browsing='true' v-bind:signedIn='true' v-bind:greatingId="greatingID"/>
       </b-modal>
</template>

<script>
import RestaurantList from './RestaurantList.vue';

export default {
  name: 'SuggestModal',

  components: { RestaurantList },

  props: {
    greatingID: String
  }
};
</script>
