<!--

Contains 2 lists of grEATings (active and past).

-->

<template>
  <div>
    <CreateGreating/>
    <h1> My grEATings </h1>
    <b-card no body>
      <b-button v-b-modal.create-popup> Create New </b-button>

      <b-tabs pills card vertical v-model='tabId'>
        <b-tab title='Invited'>
          <b-card-text>
            <div v-if='showActionMessage' color='green'>
              {{actionMessage}}
            </div>

            <div v-if='invited.length === 0'>You have no grEATing invitations.</div>
            <div v-else v-for='greating in invited' v-bind:key='greating.id'>
              <Greating v-bind:greating='greating' v-bind:invitePreview='true'/>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab title='Active' active>
          <b-card-text>
            <div v-if='active.length === 0'>You have no active grEATings.</div>
            <div v-else v-for='greating in active' v-bind:key='greating.id'>
              <Greating v-bind:greating='greating' v-bind:invitePreview='false'/>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab title='Past'>
          <b-card-text>
            <div v-if='past.length === 0'>You have no past grEATings.</div>
            <div v-else v-for='greating in past' v-bind:key='greating.id'>
              <Greating v-bind:greating='greating' v-bind:invitePreview='false'/>
            </div>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
// eslint-disable-next-line
import axios from 'axios';
// eslint-disable-next-line
import { eventBus } from '../main';
import Greating from './Greating';
import CreateGreating from './CreateGreating.vue';

export default {
  name: 'GreatingList',

  data() {
    return {
      invited: [],
      accepted: [],
      actionMessage: '',
      showActionMessage: false
    };
  },

  props: {
    tabId: Number,
  },

  computed: {
    active: function() {
      return this.accepted.filter(greating => greating.status === 'In Progress');
    },
    past: function() {
      return this.accepted.filter(greating => greating.status !== 'In Progress');
    },
  },

  components: {
    Greating,
    CreateGreating
  },

  created: function() {
    this.loadData();
  },

  mounted: function() {
    eventBus.$on('created-greating', () => {
      this.loadData();
    });
    eventBus.$on('left-greating', () => {
      this.loadData();
    });
    eventBus.$on('selected', () => {
      this.loadData();
    });
    eventBus.$on('accepted-invite', () => {
      this.loadData();

      // Display temporary message
      this.actionMessage = '' + ' was added to your active grEATings!';
      this.showActionMessage = true;
      setTimeout(() => {
        this.showActionMessage = false;
      }, 2000);
    });

    eventBus.$on('declined-invite', () => {
      this.loadData();

      // Display temporary message
      this.actionMessage = 'The invitation was removed';
      this.showActionMessage = true;
      setTimeout(() => {
        this.showActionMessage = false;
      }, 2000);
    });
  },

  methods: {
    loadData: function() {
      axios.get('/api/users/' + encodeURIComponent(window.email) + '/greatings')
        .then(res => {
          this.accepted = res.data.accepted;
          this.invited = res.data.invited;
        })
        .catch(err => {
          alert(this.decodeHtml(err.response.data.error));
        });
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
