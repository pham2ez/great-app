<template>
  <div>
    <h3> Change Your Location Information </h3>
    <p>Your zip code is necessary for grEAT to search for restaurants by location.</p>
    <form v-on:submit.prevent='changeZip' method='post'>
      <div class='form-group'>
          <b-card>
          <div class="group-item">
          <label class="label" for='newZip'>Zip Code:</label>
          <input id='newZip' v-model.trim='newZip' type='text' name='newZip' v-bind:placeholder='currentZip'>
          </div>
          <b-button>Change Zip Code</b-button>
          </b-card>
      </div>
    </form>
    <p>Putting in your address is optional. You may remove your address at any time by submitting a blank form.</p>
    <form v-on:submit.prevent='changeAddress' method='post'>
      <div class='form-group'>
          <b-card>
          <div class="group-item">
          <label class="label" for='newStreet'>Street Address:</label>
          <input id='newStreet' v-model.trim='newStreet' type='text' name='newStreet' v-bind:placeholder='decodeHtml(currentStreet)'>
          </div>
          <div class="group-item">
          <label class="label" for='newCity'>City:</label>
          <input id='newCity' v-model.trim='newCity' type='text' name='newCity' v-bind:placeholder='decodeHtml(currentCity)'>
          </div>
          <div class="group-item">
          <label class="label" for='newState'>State:</label>
          <input id='newState' v-model.trim='newState' type='text' name='newState' v-bind:placeholder='decodeHtml(currentState)'>
          </div>
          <b-button>Change Address</b-button>
          </b-card>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';
import Utils from '../models/Utils';

export default {
  name: 'Location',

  data() {
    return {
      currentStreet: '',
      currentCity: '',
      currentState: '',
      currentZip: '',
      newStreet: '',
      newCity: '',
      newState: '',
      newZip: '',
    };
  },
  
  created: function() {
    eventBus.$on('login-success', () => {
      this.loadMyInfo();
    });
    this.loadMyInfo();
  },
  
  methods: {
    clearFields() {
      this.newStreet = '';
      this.newCity = '';
      this.newState = '';
      this.newZip = '';
    },
    
    decodeHtml(html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    },
    
    loadMyInfo() {
      axios.get('/api/me')
        .then(res => {
          this.currentZip = res.data.zipCode;
          var addr = res.data.address;
          this.currentStreet = addr.streetAddr;
          this.currentCity = addr.city;
          this.currentState = addr.state;
        })
        .catch(() => {
          // User is not logged in. Do nothing.
        });
    },

    changeAddress() {
      if (!(this.newStreet.length === 0 && this.newCity.length === 0 && this.newState.length === 0) && (this.newStreet.length === 0 || this.newCity.length === 0 || this.newState.length === 0)) {
        alert('If you would like to change your address, please fill in all of the fields.')
      } else {
        var fields = {
          streetAddr: this.newStreet,
          city: this.newCity,
          state: this.newState,
        }
        axios.put('/api/address', fields)
          .then(() => {
              this.clearFields();
              this.loadMyInfo();
            })
          .catch(err => { alert(this.decodeHtml(err.response.data.error)) });
      }
    },

    changeZip() {
        if (Utils.isZipCode(this.newZip)) {
          axios.put('/api/zip', {zipCode: this.newZip})
              .then(() => {
                  this.loadMyInfo();
                  this.clearFields();
                })
              .catch(err => { alert(this.decodeHtml(err.response.data.error)) });
        } else {
          alert('Please enter a valid 5-digit zip code!');
        }
      },

  },
};
</script>

<style>
input{
  flex: 1;
}

.label{
  font-weight: bold;
}
.group-item{
  display: flex;
  padding: 5px 0px;
  flex: 1;
}
</style>