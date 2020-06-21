<template>
  <div>
    <!-- <h3>Welcome {{currentUser.firstName}}</h3> -->
    <!-- <h6>These are your preferences for this grEATing </h6> -->
    <!-- <div class='wrapper' v-for='pref in preferences'>
      <h6> <b>{{pref.type}}</b>: {{pref.value}} </h6>
    </div> -->

    <b-form-group label="Select preferences for this grEATing:">
      <b-form-checkbox-group
        id="checkbox-group-1"
        v-model="selected"
        :options="options"
        name="flavour-1"
      ></b-form-checkbox-group>
    </b-form-group>

    <!-- <b-dropdown text='New craving...'>
      <b-dropdown-item-button v-on:click='addPref("Mexican")'> Mexican </b-dropdown-item-button>
    </b-dropdown> -->
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';

export default {
  name: 'Preferences',

  data() {
    return {
      selected: [],
      options: [
        { text: 'Mexican', value: 'mexican' },
        { text: 'Italian', value: 'italian' },
        { text: 'American', value: 'american' },
        { text: 'Chinese', value: 'chinese' },
        { text: 'Korean', value: 'korean' },
        { text: 'Japanese', value: 'japanese' },
        { text: 'Mediterranean', value: 'mediterranean'}        
      ],
      currentUser: undefined
    };
  },

  props: {
    greatingId: String
  },

  created: function() {
    this.getCurrentUser();
  },

  watch: {
    selected: function() {
      if (this.selected !== undefined && this.selected !== null) {
        axios.post(`/api/greatings/${this.greatingId}/restaurants/criteria`, {criteria: this.selected, user: this.currentUser.email})
        .then(() => {
        eventBus.$emit('add-pref-success', {});
        });
      }
    }
  },

  methods: {
    // addPref: function(pref) {
    //   this.preferences.push({type: 'Craving', value: pref});

    //   // post the new preference to the server and notify the restaurant list
    //   axios.post(`/api/greatings/${this.greatingId}/restaurants/${pref}`, {})
    //   .then(() => {
    //     eventBus.$emit('add-pref-success', {});
    //   });
    // },
    getCurrentUser: function() {
      axios.get('/api/me').then(response => {
        this.currentUser = response.data;
      });
    }
  }
};
</script>

<style scoped>
.generic-list {
  display: flex;
}

.generic-list > * {
  margin: 0.5rem;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
