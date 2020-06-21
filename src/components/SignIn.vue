<template>
  <b-modal id='sign-in-popup' v-bind:ok-title='okButtonText' ref='modal' @ok='handleOk'>
    <template v-if='showSignIn' v-slot:modal-title>
      <h3> Sign In </h3>
    </template>
    <template v-else v-slot:modal-title>
      <h3> Create An Account </h3>
    </template>
    <div v-if='showSignIn'>
      <button v-on:click='showCreateAccount'>Don't have an account? Click here to create one.</button><br><br>

      <form class='component' v-on:submit.prevent='logIn' method='post'>
        <div class='form-group'>
          <label for='existingEmail'>Email Address:</label>
          <input id='existingEmail' v-model.trim='existingEmail' type='text' name='existingEmail'>
        </div>
        <div class='form-group'>
          <label for='existingPassword'>Password:</label>
          <input id='existingPassword' v-model.trim='existingPassword' type='password' name='existingPassword'>
        </div>
        <input type='submit' style='display: none'/>
      </form>
    </div>
    <div v-else>
      <button v-on:click='hideCreateAccount'>Have an account already? Click here to sign in.</button><br><br>

      <form class='component' v-on:submit.prevent='createAccount' method='post'>
        <div class='form-group'>
          <label for='signupFirst'>First Name:</label>
          <input id='signupFirst' v-model.trim='signupFirst' type='text' name='signupFirst'>
        </div>
        <div class='form-group'>
          <label for='signupLast'>Last Name:</label>
          <input id='signupLast' v-model.trim='signupLast' type='text' name='signupLast'>
        </div>
        <div class='form-group'>
          <label for='signupEmail'>Email Address:</label>
          <input id='signupEmail' v-model.trim='signupEmail' type='text' name='signupEmail'>
        </div>
        <div class='form-group'>
          <label for='signupPassword'>Password:</label>
          <input id='signupPassword' v-model.trim='signupPassword' type='password' name='signupPassword'>
        </div>
        <div class='form-group'>
          <label for='signupZip'>Zip Code:</label>
          <input id='signupZip' v-model.trim='signupZip' type='text' name='signupZip'>
        </div>
        <input type='submit' style='display: none'/>
      </form>
    </div>
  </b-modal>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';
import uniqueHash from 'unique-hash';
import Utils from '../models/Utils';

export default {
  name: 'SignIn',

  data() {
    return {
      showSignIn: false,
      existingEmail: '',
      existingPassword: '',
      signupFirst: '',
      signupLast: '',
      signupEmail: '',
      signupPassword: '',
      signupZip: '',
    };
  },
  
  computed: {
    okButtonText: function() {
      return (this.showSignIn ? 'Log In' : 'Create Account and Log In');
    }
  },

  methods: {
    clearFields: function() {
      this.existingEmail = '';
      this.existingPassword = '';
      this.signupFirst = '';
      this.signupLast = '';
      this.signupEmail = '';
      this.signupPassword = '';
      this.signupZip = '';
    },
      
    logIn: function() {
      if (this.existingEmail.length === 0 || this.existingPassword.length === 0) {
        alert('Emails and passwords must be non-empty!');
        return;
      }
      if (!Utils.isEmailAddress(this.existingEmail)) {
        alert('Please enter a valid email address!');
        return;
      }
      axios.post('/api/users/' + encodeURIComponent(this.existingEmail) + '/login', {
        passwordHash: uniqueHash(this.existingPassword, {format: 'string'})
        })
        .then(() => {
          window.email = this.existingEmail.toLowerCase();
          eventBus.$emit('login-success', {email: this.existingEmail});
          this.clearFields();
          this.$refs.modal.hide();
          eventBus.$emit('showGreatings');
        })
        .catch(err => { alert(this.decodeHtml(err.response.data.error)) });
    },
    
    createAccount: function() {
      // create account, then log in immediately
      if (this.signupFirst.length === 0 || this.signupLast.length === 0 || this.signupEmail.length === 0 || this.signupPassword.length === 0 || this.signupZip.length === 0) {
        alert('Please fill out all of the fields!');
        return;
      }
      if (!Utils.isEmailAddress(this.signupEmail)) {
        alert('Please enter a valid email address!');
        return;
      }
      if (!Utils.isZipCode(this.signupZip)) {
        alert('Please enter a 5-digit zip code!');
        return;
      }
      var hashedPassword = uniqueHash(this.signupPassword, {format: 'string'});
      axios.post('/api/users/' + encodeURIComponent(this.signupEmail), {
        firstName: this.signupFirst,
        lastName: this.signupLast,
        passwordHash: hashedPassword,
        zipCode: this.signupZip,
      })
        .then(() => 
          axios.post('/api/users/' + encodeURIComponent(this.signupEmail) + '/login', {
            passwordHash: hashedPassword
          }))
            .then(() => {
              window.email = this.signupEmail.toLowerCase();
              eventBus.$emit('login-success', {email: this.signupEmail});
              this.clearFields();
              this.$refs.modal.hide();
              eventBus.$emit('showMyAccount');
            })
        .catch(err => { alert(this.decodeHtml(err.response.data.error)) });
    },
    
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault() // Prevent modal from closing
      this.showSignIn ? this.logIn() : this.createAccount();
    },
    
    showCreateAccount: function() {
      this.showSignIn = false;
    },
    
    hideCreateAccount: function() {
      this.showSignIn = true;
    },
    
    decodeHtml: function(html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    },
  }
};
</script>

<style scoped>
.form-group{
  display:flex;
}
input{
  flex:1;
}
button{
  width:100%;
}
</style>
