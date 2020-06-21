<template>
  <div v-if='dataReady'>
    <b-form-group label="Check the corresponding box to get website notifications about:">
      <b-form-checkbox-group
        v-model='selectedwebsiteoptions'
        :options='websiteoptions'
        stacked
      ></b-form-checkbox-group>
    </b-form-group>
    <b-form-group label="Check the corresponding box to get email notifications about:">
      <b-form-checkbox-group v-model='selectedemailoptions'>
        <b-form-checkbox value='email digest'>Daily email digests</b-form-checkbox>
        <b-form-checkbox value='greating notifications'>Reminders about grEATings
          <b-form-select v-model='selectedgreatingnotificationoption' :options='greatingnotificationoptions'></b-form-select>
        </b-form-checkbox>
      </b-form-checkbox-group>
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
      dataReady: false,
      selectedwebsiteoptions: [],
      websiteoptions: [
        { text: 'Invitations to grEATings', value: 'invite' },
        { text: 'New members for your grEATings', value: 'new member' },
        { text: 'New restaurants for your grEATings', value: 'new craving' },
        { text: 'Finalization of time for your grEATings', value: 'finalize time' },
        { text: 'Finalization of place for your grEATings', value: 'finalize place' },
      ],
      selectedemailoptions: [],
      greatingnotificationoptions: [
        { text: '2 days before', value: '2 days before' },
        { text: '1 day before', value: '1 day before' },
        { text: '1 hour before', value: '1 hour before' },
      ],
      selectedgreatingnotificationoption: '',
    }
  },
  created: function() {
    this.loadData();
  },
  watch: {
    selectedwebsiteoptions: function() {
      this.putPrefs();
    },
    selectedemailoptions: function() {
      this.putPrefs();
    },
    selectedgreatingnotificationoption: function() {
       this.putPrefs();
    },
  },
  methods: {
    loadData: function() {
      this.dataReady = false;
      axios.get('/api/notifications/' + encodeURIComponent(window.email) + '/preferences')
        .then(res => {
          if (res.data.preferences !== undefined && res.data.preferences !== null && res.data.preferences.length > 0) {
            // Separate the selected options into website options and email options
            res.data.preferences.forEach(p => {
              if (this.websiteoptions.filter(o => o.value === p).length > 0) {
                this.selectedwebsiteoptions.push(p);
              } else {
                this.selectedemailoptions.push(p);
              }
            });
          }
          this.selectedgreatingnotificationoption = res.data.emailtime;
          this.dataReady = true;
        })
        .catch(err => alert(err.response.data.error));
    },
    putPrefs: function() {
      var selected = this.selectedwebsiteoptions.concat(this.selectedemailoptions);
      if (selected !== undefined && selected !== null && selected.length > 0) {
        axios.put('/api/notifications/' + encodeURIComponent(window.email) + '/preferences', { preferences: selected, emailtime: this.selectedgreatingnotificationoption })
          .catch(err => alert(err.response.data.error));
      }
    },
  }
}
</script>
