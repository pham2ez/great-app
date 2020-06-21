<template>
  <b-modal class="wrapper" id="change-info" ref='modal' @ok='handleOk' @cancel='clearFields'>
    <template v-slot:modal-title>
        <h3> grEATing Settings</h3>
      </template>
        <h5>Date Range</h5>
      Start: <input type="date" v-bind:min="new Date().toString()" v-on:change="startDateChange" v-model="startDate"><br>
      End: <input type="date" v-bind:min="startDate" v-model="endDate"><br><br>
      <h5>Time Range</h5>
      Start: <input type="time" v-model="startTime"><br>
      End: <input type="time" v-model="endTime"><br><br>
      grEATing duration (minutes): <input type="number" step="15" v-model="length">
  </b-modal>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';

export default {
  name: 'ChangeAvailabilityModal',
  props: {
    greatingId: String,
  },
  data() {
    return {
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      length: null,
      loadedData: null
    };
  },

  mounted: function() {
    axios.get('/api/greatings/' + this.greatingId + '/schedule/info')
          .then((res)=>{
            this.loadedData = res.data;
            let data = res.data;
            this.startDate= data.availDays[0].split(' ')[0];
            this.endDate= data.availDays[1].split(' ')[0];
            this.startTime= data.timeRange[0].split(' ')[1];
            this.endTime= data.timeRange[1].split(' ')[1];
            this.length= data.length;
          });
  },

  methods: {
    startDateChange: function(){
      if (new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
        this.endDate = this.startDate;
      }
    },
    clearFields: function() {
      let data = this.loadedData;
            this.startDate= data.availDays[0].split(' ')[0];
            this.endDate= data.availDays[1].split(' ')[0];
            this.startTime= data.timeRange[0].split(' ')[1];
            this.endTime= data.timeRange[1].split(' ')[1];
            this.length= data.length;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault() // Prevent modal from closing
      this.create();
    },
    create: function() {
      if (new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
        alert('Please choose a valid date range.');
        return;
      }
      if (this.startDate === null || this.endDate === null || this.startDate === "" || this.endDate === "") {
        alert('Please fill out the date range.');
        return;
      }
      if (this.startTime === null || this.endTime === null || this.startTime === "" || this.endTime === "") {
        alert('Please fill out a time range.');
        return;
      }
      if (new Date(this.startDate + " " + this.startTime).getTime() > new Date(this.startDate + " " + this.endTime).getTime()) {
        alert('Please choose a valid time range.');
        return;
      }
      if (new Date(this.startDate + " " + this.startTime).getTime() % 900000 !== 0 || new Date(this.startDate + " " + this.endTime).getTime() % 900000 !== 0) {
        alert('Please choose a start/end time that is in intervals of 15 minutes.');
        return;
      }
      if (this.length === null || this.length === "") {
        alert('Please choose the length for this grEATing.');
        return;
      }
      if (this.length > 0 && this.length % 15 !== 0) {
        alert('Please choose a length that is in intervals of 15 minutes.');
        return;
      }
      let fields = {
      email: window.email,
      availDays: [this.startDate + " 00:",this.endDate + " 00:"],
      timeRange: [this.startDate + " " + this.startTime,this.startDate + " " + this.endTime],
      length: this.length};
      axios.put('/api/greatings/'+this.greatingId+'/schedule/info', fields)
        .then(() => {
          this.loadedData = {availDays: fields.availDays, timeRange: fields.timeRange, length: fields.length};
          this.clearFields();
          this.$refs.modal.hide();
          eventBus.$emit('update-info-success', () => {
          });
        });
    }
  }
};
</script>

<style scoped>
.wrapper{
  display: flex;
}
input{
  width:100%;
}
</style>
