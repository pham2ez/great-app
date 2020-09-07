<template>
  <div>
    <h3> Would you like to accept this invitation? </h3>
      <b-button v-on:click='reject'>No</b-button>
      <b-button v-on:click='accept'>Yes</b-button>
  </div>
</template>

<script>
// eslint-disable-next-line
import axios from 'axios';
// eslint-disable-next-line
import { eventBus } from '../main';

export default {
  name: 'Invite',
  methods: {
    accept: function() {
      axios.post('/api/invite/' + this.$route.params.grIdHash + '/accept')
        .then(() => {
          this.$router.push({name: 'main'});
        })
        .catch(err => {
          alert(this.decodeHtml(err.response.data.error));
        });
    },
    reject: function() {
      this.$router.push({name: 'main'});
    },
    decodeHtml: function(html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    },
  },
};
</script>

<style scoped>
</style>

