<!--

The invite app.

-->

<template>
  <div id='app'>
    <Invite v-if='isSignedIn'/>
    <div v-else>
      <p>In order to accept an invitation, please sign in or make an account.</p>
      <b-button v-b-modal.sign-in-popup>Sign In / Sign Up</b-button>
      <SignIn/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';
import Invite from '../components/Invite.vue';
import SignIn from '../components/SignIn.vue';

export default {
  name: 'invite',
  components: {
    Invite,
    SignIn,
  },
  data() {
    return {
      isSignedIn: false,
    };
  },
  computed: {
  },
  created: function() {
    axios.get('/api/me')
        .then(res => {
          window.email = res.data.email;
          eventBus.$emit('login-success', {email: window.email})
        })
        .catch(() => {
          // User isn't logged in currently
          this.$bvModal.show('sign-in-popup');
        });
    eventBus.$on('login-success', (res) => {
      window.email = res.email;
      this.isSignedIn = true;
    });
    eventBus.$on('logout-success', () => {
      window.email = undefined;
      this.isSignedIn = false;
    });
  },
}
</script>
