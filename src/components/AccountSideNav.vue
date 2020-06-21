<!--

Contains the side navigation for account information (Dietary Restrictions, Location, Notifications, Account Settings) as well the content holder for the actual material.

The content associated with each tab should be a separate Vue component. Please do not write that logic in this file.

The side navigation for grEATing information (Members, Availability, Restaurants)  is in GreatingSideNav.vue.

-->

<template>
  <div>
    <b-card no body>
      <b-tabs pills card vertical>
        <b-tab title='Dietary Restrictions' active><b-card-text><DietaryRestrictions/></b-card-text></b-tab>
        <b-tab title='Location'><b-card-text><Location/></b-card-text></b-tab>
        <b-tab title='Notifications'><b-card-text><NotificationPreferences/></b-card-text></b-tab>
        <b-tab title='Account Settings'><b-card-text><MyAccount/></b-card-text></b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
// eslint-disable-next-line
import axios from 'axios';
// eslint-disable-next-line
import { eventBus } from '../main';
import DietaryRestrictions from './DietaryRestrictions.vue';
import MyAccount from './MyAccount.vue';
import Location from './Location.vue';
import NotificationPreferences from './NotificationPreferences.vue';

export default {
  name: 'AccountSideNav',
  
  components: {
    DietaryRestrictions,
    MyAccount,
    Location,
    NotificationPreferences,
  },
};
</script>

<style scoped>
</style>

