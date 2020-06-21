<!-- white-space: pre means that white space is preserved; please do not reformat this section -->

<template>
<div class='notification-item' v-bind:class='{active: !notification.viewed}' v-on:click='click()' style='white-space: pre'>
<h3>{{notification.grTitle}}</h3>
{{notification.notificationText}}
</div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';

export default {
  name: 'NotificationItem',
  props: {
    notification: Object,
  },
  methods: {
    click: function() {
      axios.put('/api/notifications/' + this.notification.id)
        .then(() => {
          if (this.notification.event === 'showGreating') {
            eventBus.$emit(this.notification.event, {id: this.notification.grId});
          } else {
            eventBus.$emit(this.notification.event);
          }
          eventBus.$emit('notification-clicked');
        })
        .catch(err => { alert(err.response.data.error) });
    },
  }
}
</script>

<style scoped>
.active {
  background-color: AliceBlue;
}
</style>
