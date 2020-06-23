<!--

Contains the overall structure of the app.

-->

<template>
  <div id='app'>
  <TopNav/>
  <AccountSideNav v-if='showMyAccount'/>
  <Home v-if='showHome'/>
  <GreatingList v-if='showGreatings' v-bind:tabId='greatingListTabId'/>
  <RestaurantList v-if="showBrowse" v-bind:browsing='true' v-bind:signedIn='signedIn'/>
  <GreatingSideNav v-if='showGreating' v-bind:greatingId=' greatingId'/>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';
import AccountSideNav from '../components/AccountSideNav.vue';
import Home from '../components/Home.vue';
import GreatingList from '../components/GreatingList.vue';
import TopNav from '../components/TopNav.vue';
import GreatingSideNav from '../components/GreatingSideNav.vue';
import RestaurantList from "../components/RestaurantList.vue";

export default {
  name: 'main',
  components: {
    AccountSideNav,
    Home,
    TopNav,
    GreatingSideNav,
    GreatingList,
    RestaurantList
  },
  data() {
    return {
      showMyAccount: false,
      greatingListTabId: undefined,
      showHome: true,
      showGreatings: false,
      showBrowse: false,
      greatingId: undefined,
      signedIn: false
    };
  },
  computed: {
    showGreating: function() {
      return this.greatingId !== undefined;
    }
  },
  created: function() {
    axios.get('/api/me')
        .then(res => {
          window.email = res.data.email.toLowerCase();
          eventBus.$emit('login-success', {email: window.email})
        })
        .catch(() => {
          // User isn't logged in currently
        });
    eventBus.$on('showMyAccount', () => {
      this.showMyAccount = true;
      this.showBrowse = false;
      this.greatingListTabId = undefined;
      this.showHome = false;
      this.showGreatings = false;
      this.greatingId = undefined;
    });
    eventBus.$on('showBrowse', () => {
      this.showMyAccount = false;
      this.showBrowse = true;
      this.greatingListTabId = undefined;
      this.showHome = false;
      this.showGreatings = false;
      this.greatingId = undefined;
    });
    eventBus.$on('showHome', () => {
      this.showMyAccount = false;
      this.showBrowse = false;
      this.greatingListTabId = undefined;
      this.showHome = true;
      this.showGreatings = false;
      this.greatingId = undefined;
    });
    eventBus.$on('showGreatings', () => {
      this.showMyAccount = false;
      this.showBrowse = false;
      this.greatingListTabId = 1;
      this.showHome = false;
      this.showGreatings = true;
      this.greatingId = undefined;
    });
    eventBus.$on('showGreating', res => {
      this.showMyAccount = false;
      this.showBrowse = false;
      this.greatingListTabId = undefined;
      this.showHome = false;
      this.showGreatings = false;
      this.greatingId = res.id;
    });
    eventBus.$on('showInvites', () => {
      this.showGreatings = false; // hide Greatings
      this.showMyAccount = false;
      this.showBrowse = false;
      this.greatingListTabId = 0; // set the greatingListTabId
      this.showHome = false; // show Home again to get it to refresh
      this.showGreatings = true;
      this.greatingId = undefined;
    });
    eventBus.$on('login-success', (res) => {
      window.email = res.email.toLowerCase();
      this.signedIn = true;
    });
    eventBus.$on('logout-success', () => {
      window.email = undefined;
      this.showMyAccount = false;
      this.showBrowse = false;
      this.greatingListTabId = undefined;
      this.showHome = true;
      this.showGreatings = false;
      this.greatingId = undefined;
      this.signedIn = false;
    });
  },
}
</script>
