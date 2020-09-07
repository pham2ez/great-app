<template>
  <div>
    <h3> Change Your Account Information </h3>
    <form v-on:submit.prevent='changeEmail' method='post'>
      <div class='form-group'>
        <b-card>
        <div class="group-item">
          <label class="label" for='newEmail'>Email Address:</label>
          <input id='newEmail' v-model.trim='newEmail' type='text' name='newEmail' v-bind:placeholder='currentEmail'>
        </div>
          <b-button>Change Email Address</b-button>
        </b-card>
      </div>
    </form>
    <form v-on:submit.prevent='changePassword' method='post'>
      <div class='form-group'>
        <b-card>
        <div class="group-item">
        <label class="label" for='newPassword'>Password:</label>
        <input id='newPassword' v-model.trim='newPassword' type='password' name='newPassword'>
        </div>
        <b-button>Change Password</b-button>
        </b-card>
      </div>
    </form>
    <form v-on:submit.prevent='changeName' method='post'>
      <div class='form-group'>
        <b-card>
        <div class="group-item">
        <label class="label" for='newFirstName'>First name:</label>
        <input id='newFirstName' v-model.trim='newFirstName' type='text' name='newFirstName' v-bind:placeholder='currentFirstName'>
        </div>

        <div class="group-item">
        <label class="label" for='newLastName'>Last name:</label>
        <input id='newLastName' v-model.trim='newLastName' type='text' name='newLastName' v-bind:placeholder='currentLastName'>
        </div>
      <b-button>Change Name</b-button>
        </b-card>
      </div>
    </form>
    <h3> Delete Your Account </h3>
    <p> If you wish to delete your account, press the button below.</p>
    <b-button style="width:100%;" variant="danger" v-on:click='showDeleteConfirm'>Delete My Account!</b-button>
    <div v-if='showConfirmBox'>
      Are you sure you want to delete your account? This cannot be undone.<br>
      <b-button v-on:click='hideDeleteConfirm'>Cancel</b-button>
      <b-button v-on:click='deleteAccount'>Delete my account</b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';
import uniqueHash from 'unique-hash';
import Utils from '../models/Utils';

export default {
  name: 'MyAccount',

  data() {
    return {
      currentEmail: '',
      currentFirstName: '',
      currentLastName: '',
      newEmail: '',
      newPassword: '',
      newFirstName: '',
      newLastName: '',
      showDietaryRestrictions : true,
      showLocation: false,
      showNotifications: false,
      showAccountInfo: false,
      showConfirmBox: false,
    };
  },

  created: function() {
    eventBus.$on('login-success', () => {
      this.loadMyInfo();
    });
    this.loadMyInfo();
  },

  mounted: function() {
  },

  methods: {
    loadMyInfo: function() {
      axios.get('/api/me')
        .then(res => {
          this.currentEmail = res.data.email;
          this.currentFirstName = res.data.firstName;
          this.currentLastName = res.data.lastName;
        })
        .catch(err => {
          alert(this.decodeHtml(err.response.data.error));
        });
    },
  
    clearFields: function() {
      this.newEmail = '';
      this.newPassword = '';
      this.newFirstName = '';
      this.newLastName = '';
    },
  
    changeEmail: function() {
      if (this.newEmail.length === 0) {
        alert('If you would like to change your email, please type in the box.')
      } else {
        var email = this.newEmail.toLowerCase();
        axios.put('/api/email', {email: email})
          .then(() => {
              window.email = email;
              eventBus.$emit('login-success', {email: email});
              alert('Your email address was changed successfully!');
            })
          .catch(err => { alert(this.decodeHtml(err.response.data.error)) });
      }
      // if change went through, clear fields no matter what (feedback!)
      this.clearFields();
    },

    changePassword: function() {
      if (this.newPassword.length === 0) {
        alert('If you would like to change your password, please type in the box.')
      } else {
        let hashedPassword = uniqueHash(this.newPassword, {format: 'string'});
        axios.put('/api/password', {passwordHash: hashedPassword})
          .then(() => {
              alert('Your password was changed successfully!');
              // if change went through, clear fields
              this.clearFields();
            })
          .catch(err => { alert(this.decodeHtml(err.response.data.error)) });
      }
    },

    changeName: function() {
      var fields = {}
      if (this.newFirstName.length === 0 && this.newLastName.length === 0) {
        alert('If you would like to change your first / last name, please type in the appropriate box(es).')
      } else {
        if (this.newFirstName.length !== 0) {
          fields.firstName = this.newFirstName;
        }
        if (this.newLastName.length !== 0) {
          fields.lastName = this.newLastName;
        }
        axios.put('/api/name', fields)
          .then(() => {
            if (this.newFirstName.length !== 0 && this.newLastName.length !== 0) {
              eventBus.$emit('name-change-success', {
                firstName: this.newFirstName,
                lastName: this.newLastName,
              });
              this.currentFirstName = this.newFirstName;
              this.currentLastName = this.newLastName;
              alert('Your first name is now ' + this.newFirstName + ' and your last name is now ' + this.newLastName + '.');
            } else if (this.newFirstName.length !== 0) {
              this.currentFirstName = this.newFirstName;
              eventBus.$emit('name-change-success', {firstName: Utils.encodeString(this.newFirstName)});
              alert('Your first name is now ' + this.newFirstName + '.');
            } else {
              this.currentLastName = this.newLastName;
              eventBus.$emit('name-change-success', {lastName: Utils.encodeString(this.newLastName)});
              alert('Your last name is now ' + this.newLastName + '.');
            }
            // if change went through, clear fields no matter what (feedback!)
            this.clearFields();
          })
          .catch(err => { alert(this.decodeHtml(err.response.data.error)) });
      }
    },
    
    showDeleteConfirm: function() {
      this.showConfirmBox = true;
    },
    
    hideDeleteConfirm: function() {
      this.showConfirmBox = false;
    },
    
    deleteAccount: function() {
      axios.delete('/api/delete')
        .then(() => {
          window.email = undefined;
          eventBus.$emit('logout-success');
        })
        .catch(err => { alert(this.decodeHtml(err.response.data.error)) });
    },
    
    decodeHtml: function(html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }
  }
};
</script>

<style scoped>
</style>
