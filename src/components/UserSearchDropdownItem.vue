<template>
  <div class='dropdownitem'>
    <p class='status' v-bind:class='status'>{{ status }}</p>
    <p class='name'>{{ result.firstName }} {{ result.lastName }}</p>
    <p class='email'>{{ result.email }}</p>
  </div>
</template>

<script>
// eslint-disable-next-line
import axios from 'axios';
// eslint-disable-next-line
import { eventBus } from '../main';

export default {
  name: 'UserSearchDropdownItem',
  
  props: {
    greatingId: String,
    result: Object,
    member: Boolean,
    invited: Boolean,
  },
  
  mounted: function() {
  },
  
  computed: {
    status: function() {
      if (this.member) {
        return 'Member';
      } else if (this.invited) {
        return 'Invited';
      } else {
        return 'Invitable';
      }
    }
  },
  
  methods: {
  },
};
</script>

<style scoped>
p {
  line-height: 1.2em;
  margin: 0.2em 0;
}

.name {
  color: black;
}

.email {
  color: gray;
}

.status {
  float: right;
  color: gray;
}

.dropdownitem {
  border-style: gray;
  border-color: black;
  border-width: 1px;
}
</style>
