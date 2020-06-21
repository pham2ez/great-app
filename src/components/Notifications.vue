<template>
<div class='notifications-container'>
  <b-dropdown  variant="outline-dark">
  <template v-slot:button-content>
    Notifications <b-badge variant="light">{{ numUnread }}</b-badge>
  </template>
    <b-dropdown-item v-if='notifications.length === 0'>0 notifications</b-dropdown-item>
    <b-dropdown-item v-else v-for='notification in notifications' v-bind:key='notification.id'><NotificationItem v-bind:notification='notification'/></b-dropdown-item>
  </b-dropdown>
</div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';
import NotificationItem from './NotificationItem';

export default {
  name: 'Notifications',
  components: {
    NotificationItem,
  },
  data() {
    return {
      notifications: [],
      polling: undefined,
    };
  },
  computed: {
    numUnread: function() {
      return this.notifications.map(n => n.viewed ? 0 : 1).reduce((acc, e) => acc + e, 0);
    },
  },
  created: function() {
    this.loadData();
    this.polling = setInterval(this.loadData, 60*1000); // poll every minute
    eventBus.$on('notification-clicked', () => {
      this.loadData();
    });
  },
  methods: {
    loadData: function() {
      axios.get('/api/notifications/' + encodeURIComponent(window.email))
        .then(res => {
          this.notifications = res.data.notifications;
        })
        .catch(err => {
          alert(err.response.data.error)
        });
    }
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
  },
}
</script>

<style scoped>
</style>

