<!--

Contains a single grEATing, for use in GreatingList.

-->

<template>
  <div class='container'>
    <b-card class="card" v-if='dataReady' v-on:click='showGreating'>
      <b-card-text>
        <div class="right-side">
        <div v-bind:style="progressColor">{{ greating.status }}</div>

      <b-dropdown v-if='!invitePreview' split id="dropdown-1" v-on:click.stop='showGreating' text="View" class="m-md-2">
        <b-dropdown-item v-if='isMember' v-on:click.stop="leave">Leave</b-dropdown-item>
        <b-dropdown-item v-if='isOrganizer' v-on:click.stop='deleteGreating'>Delete</b-dropdown-item>
      </b-dropdown>

      <b-dropdown v-else split id="dropdown-1" v-on:click.stop='accept(greating.idHash)' text="Accept" class="m-md-2">
        <b-dropdown-item v-on:click.stop='decline(greating.idHash)'> Decline </b-dropdown-item>
      </b-dropdown>

      </div>
        <h3>{{ greating.title }} </h3>
        <p v-if="greating.chosenTime">Time: {{ new Date(greating.chosenTime) }}</p>
        <p v-else>Time: Not Chosen Yet</p>
        <p v-if="greating.restaurantId">Restaurant: {{ greating.restaurantId.name }}</p>
        <p v-else>Restaurant: Not Chosen Yet</p>
        <p>Members: {{ shortMembersList }}</p>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
// eslint-disable-next-line
import axios from 'axios';
// eslint-disable-next-line
import { eventBus } from '../main';

export default {
  name: 'Greating',

  data() {
    return {
      members: [],
      dataReady: false,
      isOrganizer: false,
      isMember: true
    };
  },

  props: {
    greating: Object,
    invitePreview: false
  },

  computed: {
    restaurantName: function() {
      return '';
      // TODO: calculate a restaurant name based on the restaurantId
      // axios.get()
      // this.greating.restaurantId
    },
    shortMembersList: function() {
      const characterCount = 40; // change this if you want
      var nameConcat = this.members.join();
      if (nameConcat.length > characterCount) {
        return nameConcat(0, characterCount) + '...';
      } else {
        return nameConcat;
      }
    },
    progressColor: function(){
      if(this.greating.status === "Finalized"){
        return {color:"#73e600", fontWeight:"bold"};
      }else{
        return {color:"#4e98ff", fontWeight:"bold"};
      }
    }
  },
  components: {
  },
  created: function() {
    this.loadMembers();
  },
  mounted: function() {
  },
  methods: {
    loadMembers: function() {
      this.dataReady = false;
      axios.get('/api/greatings/' + this.greating.id + '/memberInfo')
        .then(res => {
          if (res.data.members.filter(m => m.email === window.email).length === 0){
            this.isMember = false;
          }

          axios.get('/api/greatings/' + this.greating.id + '/members')
            .then(res2 => {
              this.members = res2.data.members;

              axios.get('api/greatings/' + this.greating.id + '/organizer')
                .then(res3 => {
                  this.isOrganizer = (window.email === res3.data.email);
                  this.dataReady = true;
                });
            });
        })
        .catch(() => {

        });
    },

    accept: function(grIdHash) {
      axios.post('/api/invite/' + grIdHash + '/accept')
        .then(res => {
          eventBus.$emit('accepted-invite');
        });
    },

    decline: function(grIdHash) {
      axios.post('/api/invite/' + grIdHash + '/decline')
        .then(res => {
          eventBus.$emit('declined-invite');
        });
    },

    showGreating: function() {
      // Only show greatings if the user has already accepted the invite
      // Otherwise, simply preview the greating but don't do anything on click
      if (!this.invitePreview){
        eventBus.$emit('showGreating', {id: this.greating.id});
      }
    },

    leave: function() {
      // Leaving just removes this member
      let member = {email: window.email};
      axios.delete('/api/greatings/' + this.greating.id + '/members/' + member.email)
        .then(res => {
          this.loadMembers();
        });

      this.isMember = false;

      // Go back to the user's greatings
      eventBus.$emit('showGreatings');
      eventBus.$emit('left-greating');
    },

    deleteGreating: function() {
      axios.delete('/api/greatings/' + this.greating.id)
        .then(res => {
          return;
        })

      // Go back to the user's greatings
      eventBus.$emit('showGreatings');
      eventBus.$emit('left-greating');
    }
  },
};
</script>

<style scoped>
.container {
  margin-bottom: 15pt;
}

.spread {
  display: flex;
  justify-content: space-between;
  width: 20%
}
.right-side{
  display: flex;
  flex-direction: column;
  float: right;
  align-items: center;
}
.card:hover {
  background-color: #e8f2ff;
}
</style>
