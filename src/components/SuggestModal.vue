<template>
       <b-modal v-bind:hide-footer="true" id="my-modal">
         <template v-slot:modal-title>
          <h3> Restaurant Suggesting </h3>
        </template>
          <RestaurantList v-bind:browsing='true' v-bind:signedIn='true' v-bind:greatingId="greatingID"/>
       </b-modal>
</template>

<script>
import axios from 'axios';
import RestaurantList from './RestaurantList';
import Utils from '../models/Utils';

import { eventBus } from '../main';

export default {
  name: 'SuggestModal',

  components: { RestaurantList },

  props: {
    greatingID: String
  }
};
</script>
