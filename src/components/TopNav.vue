<template>
  <div>
    <SignIn/>
    <nav class='navbar sticky-top navbar-light bg-light'>
      <a class='navbar-brand' href='#' v-on:click='showHome'>grEAT</a>
      <div v-if='signedin'><b-button button v-on:click='showGreatings' variant="outline-dark">My grEATings</b-button></div>
      <div v-if='signedin'><Notifications/></div>
      <div><b-button v-if='signedin' v-on:click='showBrowse' variant="outline-dark">Browse</b-button></div>
      <div><b-button v-if='signedin' v-on:click='showMyAccount' variant="outline-dark">Settings</b-button></div>
      <div><b-button button v-if='!signedin' v-b-modal.sign-in-popup variant="outline-dark">Sign In / Sign Up</b-button></div>
      <div><b-button v-if='signedin' v-on:click='logout' variant="outline-dark">Signout</b-button></div>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';
import SignIn from './SignIn.vue';
import Notifications from './Notifications.vue';

export default {
  name: 'TopNav',
  components: {
    SignIn,
    Notifications,
  },
  data() {
    return {
      signedin: false,
    };
  },
  created: function() {
    eventBus.$on('login-success', () => {
      this.signedin = true;
    });
    eventBus.$on('logout-success', () => {
      this.signedin = false;
    });
  },
  methods: {
    logout: function() {
      axios.delete('/api/logout')
        .then(() => {
          window.email = undefined;
          eventBus.$emit('logout-success');
        })
        .catch(() => {});
    },
    showMyAccount: function() {
      eventBus.$emit('showMyAccount');
    },
    showHome: function() {
      eventBus.$emit('showHome');
    },
    showGreatings: function() {
      eventBus.$emit('showGreatings');
    },
    showBrowse: function() {
      eventBus.$emit('showBrowse');
    },
  }
}
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  width: 200px;
  height: 25vh;

  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
