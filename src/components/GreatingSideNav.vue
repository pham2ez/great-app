<!--

Contains the side navigation for grEATings (Members, Availability, Restaurants) as well the content holder for the actual material.

The content associated with each tab should be a separate Vue component. Please do not write that logic in this file.

The side navigation for account information (Dietary Restrictions, Location, Notifications, Account Settings) is in AccountSideNav.vue.

-->

<template>
  <div>
    <div v-if='dataReady'>
      <h1> {{ title }} </h1>
      <h4> Status: {{this.greating.status}} </h4>
      <h4 v-if='chosenRestaurant!==undefined'> Restaurant: {{chosenRestaurant}} </h4>
      <h4 v-if='chosenTime!==undefined'> Time: {{new Date(chosenTime)}} </h4>

      <b-card no body>
        <b-tabs pills card vertical>
          <b-tab title='Members' active><b-card-text><MembersList v-bind:greating='greating'/></b-card-text></b-tab>
          <b-tab title='Availability'><b-card-text><Availability v-bind:greatingId="greatingId"/></b-card-text></b-tab>
          <b-tab title='Your Preferences'><b-card-text><Preferences v-bind:greatingId='greatingId'/></b-card-text></b-tab>
          <b-tab title='Restaurants'><b-card-text><RestaurantList v-bind:browsing="false" v-bind:greatingId="greatingId"/></b-card-text></b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import axios from 'axios';
// eslint-disable-next-line
import { eventBus } from '../main';
import Availability from './Availability.vue';
import RestaurantList from './RestaurantList.vue';
import MembersList from './MembersList.vue'
import Preferences from './Preferences.vue'

export default {
  name: 'GreatingSideNav',

  props: {
    greatingId: String,
  },

  data() {
    return {
      dataReady: false,
      greating: undefined,
      chosenTime: undefined,
      chosenRestaurant: undefined,
      organizer: undefined,
      isOrganizer: false
    };
  },

  computed: {
    title: function() {
      return this.greating.title;
    }
  },

  components: {
    MembersList,
    Availability,
    RestaurantList,
    Preferences
  },

  created: function() {
    this.loadGreating();
  },

  mounted: function() {
    eventBus.$on('selected', (data) => {
      console.log("Updating after selection");
      let greating = data.data;
      this.greating = greating;
      this.chosenRestaurant = greating.restaurant !== undefined? greating.restaurant.name: undefined;
      this.chosenTime = greating.time;

      if (this.greating.status === 'Finalized') {
        eventBus.$emit('finalized');
      }
    });
  },
  methods: {
    loadGreating: function() {
      this.dataReady = false;
      axios.get('/api/greatings/' + this.greatingId)
        .then(res1 => {
          this.greating = res1.data;
          this.dataReady = true;
        })
        .then(() => {
          axios.get('/api/greatings/' + this.greating.id + '/organizer')
            .then(res2 => {
              let organizer = res2.data;
              this.organizer = organizer;
              this.isOrganizer = (window.email === organizer.email);
              eventBus.$emit('set-greating-organizer', this.organizer);
            });
        })
        .catch(() => {
        });
    }
  },
};
</script>

<style scoped>
</style>
