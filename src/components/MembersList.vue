<template>
  <div class='left-col'>

    <h4> Organizer </h4>
    <div v-if="organizer !== undefined">
      <Member v-bind:first='organizer.firstName'
              v-bind:last='organizer.lastName'
              v-bind:email='organizer.email'/>
    </div>

    <h4> Members </h4>
    <div v-if='members.length>0' class='left-col'>
      <div v-for='m in members'>
        <Member v-bind:first='m.firstName'
                v-bind:last='m.lastName'
                v-bind:email='m.email'/>

        <button v-if='isSelf(m) && !isFinal' class="btn btn-link"
                  v-on:click="leave" size='sm'> leave grEATing </button>
        <button v-else-if='isOrganizer && !isFinal' class="btn btn-link"
                  v-on:click="remove(m)" size='sm'> remove member </button>
      </div>
    </div>
    <div v-else>
      There are no current members.
    </div>

    <h4> Invited </h4>
    <div v-if='invited.length>0' class='left-col'>
      <div v-for='m in invited'>
        <Member v-bind:first='m.firstName'
                v-bind:last='m.lastName'
                v-bind:email='m.email'/>
      </div>
    </div>
    <div v-else-if='!isFinal'>
      There are no pending invitations.
    </div>
    <div v-else>
      This grEATing has been finalized. Invitations are no longer permitted.
    </div>
    <br>
    <div v-if='!isFinal'>
      <h5> Invite Members </h5>
      <p>Invite Link: /invite/{{ greating.idHash }}</p>
      <p>Search for and add new members by name and/or email: <Search v-bind:greatingId='greating.id'/>{{ successMessage }}</p>
    </div>
    <b-button v-if='isOrganizer && !isFinal' v-on:click='deleteGreating'> Delete grEATing </b-button>
  </div>
</template>

<script>
  // eslint-disable-next-line
  import axios from 'axios';
  // eslint-disable-next-line
  import { eventBus } from '../main';

  import Member from './Member.vue';
  import Search from './Search.vue';

  export default {
    name: 'MembersList',

    components: {
      Member,
      Search
    },

    props: {
      greating: Object,
    },

    data() {
      return {
        members: [],
        invited: [],
        organizer: Object,
        isOrganizer: false,
        isFinal: false
      };
    },

    methods: {
      updateMembers: function() {
        axios.get('api/greatings/' + this.greating.id + '/memberInfo')
          .then(res => {
            this.members = res.data.members;
          });
      },

      updateInvited: function() {
        axios.get('api/greatings/' + this.greating.id + '/invitedInfo')
          .then(res => {
            this.invited = res.data.invited;
          });
      },

      isSelf: function(m) {
        return m.email === window.email;
      },

      remove: function(member) {
        this.members = this.members.filter(m => m.email !== member.email);
        axios.delete('/api/greatings/' + this.greating.id + '/members/' + member.email)
          .then(res => {
            return;
          });
      },

      leave: function() {
        // Leaving just removes this member
        let member = {email: window.email};
        this.remove(member);

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

    created() {
      this.updateMembers();
      this.updateInvited();
    },

    mounted: function() {
      eventBus.$on('deleted-member', () => {
        this.updateMembers();
      });

      eventBus.$on('invited-user', () => {
        this.updateInvited();
      });

      eventBus.$on('set-greating-organizer', organizer => {
        this.organizer = organizer
        this.isOrganizer = (window.email === organizer.email);
      });

      eventBus.$on('finalized', () => {
        this.isFinal = true;
      });
    },
  };
</script>

<style scoped>
  * {
    display: flex;
  }

  .left-col {
    flex-direction: column;
    align-items: flex-start;
  }
</style>
