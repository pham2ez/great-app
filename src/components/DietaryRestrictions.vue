<template>
  <div>
    <b-form-group label="Select your dietary restrictions:">
      <b-form-checkbox-group
        id="checkbox-group-1"
        v-model="selected"
        :options="options"
        name="flavour-1"
      ></b-form-checkbox-group>
    </b-form-group>
  </div>
</template>

<script>

// eslint-disable-next-line
import axios from 'axios';
// eslint-disable-next-line
import { eventBus } from '../main';

export default {
  data() {
    return {
      selected: [],
      options: [
        { text: 'Vegetarian', value: 'vegetarian' },
        { text: 'Vegan', value: 'vegan' },
        { text: 'Kosher', value: 'kosher' },
        { text: 'Gluten-Free', value: 'gluten-free' },
        { text: 'Lactose-Free', value: 'lactose-free' },
        { text: 'Halal', value: 'halal' }
      ]
    }
  },
  created: function() {
    this.loadData();
  },
  watch: {
    selected: function() {
      if (this.selected !== undefined && this.selected !== null) {
        axios.put('/api/users/' + encodeURIComponent(window.email) + '/restrictions', {restrictions: this.selected})
          .then(() => {
            eventBus.$emit('update-restriction-success');
          })
          .catch(err => alert(err.response.data.error));
      }
    }
  },
  methods: {
    loadData: function() {
      axios.get('/api/users/' + encodeURIComponent(window.email) + '/restrictions')
        .then(res => {
          if (res.data.restrictions !== undefined && res.data.restrictions !== null && res.data.restrictions.length > 0) {
            this.selected = res.data.restrictions;
          }
        })
        .catch(err => alert(err.response.data.error));
    },
  }
}
</script>
