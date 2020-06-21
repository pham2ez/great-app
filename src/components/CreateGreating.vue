<template>
  <b-modal id='create-popup' v-bind:ok-title='okButtonText' ref='modal' @ok='handleOk' @cancel='clearFields'>
      <template v-slot:modal-title>
        <h3> Create a grEATing </h3>
      </template>
    <div class="wrapper">
      <form class='component' v-on:submit.prevent='create' method='post' >
        <div class='form-group'>
          <label for='title'> Title: </label>
          <input id='title' v-model.trim='title' type='text' name='title'>
        </div>
        <input type='submit' style='display: none'/>
      </form>
      <h5>Date Range</h5>
      Start: <input type="date" v-bind:min="today" v-on:change="startDateChange" v-model="startDate">
      End: <input type="date" v-bind:min="min" v-model="endDate"><br>
      <h5>Time Range</h5>
      Start: <input type="time" v-model="startTime">
      End: <input type="time" v-model="endTime"><br>
      grEATing duration (minutes): <input type="number" step="15" v-model="length">
    </div>
  </b-modal>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';
import uniqueHash from 'unique-hash';
import Utils from '../models/Utils';

export default {
  name: 'CreateGreating',
  components:{
  },

  data() {
    return {
      title: '',
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      length: null,
      min: null
    };
  },

  computed: {
    okButtonText: function() {
      return ('Create \x22' + this.title + '\x22');
    },
    today: function(){
      let time = new Date();
      let month = time.getMonth() < 9? "0"+(time.getMonth()+1): (time.getMonth()+1);
      let date = time.getDate() < 10? "0"+time.getDate(): time.getDate();
      return time.getFullYear() + '-' + month + '-' + date;
    }
  },

  methods: {
    clearFields: function() {
      this.title = '';
      this.startDate = null;
      this.endDate= null;
      this.startTime= null;
      this.endTime= null;
      this.length= null;
    },
    startDateChange: function(){
      if (new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
        this.endDate = this.startDate;
        this.min = this.startDate;
      }
    },

    create: function() {
      if (this.title.length === 0) {
        alert('Title must be non-empty!');
        return;
      }
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
      if(isNaN(new Date(this.startDate).getTime()) || isNaN(new Date(this.endDate).getTime())){
        alert('Please choose valid dates.');
      }
      if (new Date(this.startDate + " " + this.startTime).getTime() > new Date(this.startDate + " " + this.endTime).getTime()) {
        alert('Please choose a valid time range.');
        return;
      }
      if (new Date(this.startDate + " " + this.startTime).getTime() % 900000 !== 0 || new Date(this.startDate + " " + this.endTime).getTime() % 900000 !== 0) {
        alert('Please choose a start/end time that is in intervals of 15 minutes.');
        return;
      }
      if (new Date(this.startDate + " " + this.startTime).getTime() < new Date().getTime()) {
        alert('Please choose a date that has not yet past.');
        return;
      }
      if (this.length === null || this.length === "" ) {
        alert('Please choose the length for this grEATing.');
        return;
      }
      if (parseInt(this.length) <= 0 || parseInt(this.length) % 15 !== 0 || isNaN(parseInt(this.length))) {
        alert('Please choose a valid length that is in intervals of 15 minutes.');
        return;
      }
      let fields = {title: this.title,
      email: window.email,
      dates: [this.startDate + " 00:",this.endDate + " 00:"],
      times: [this.startDate + " " + this.startTime,this.startDate + " " + this.endTime],
      length: this.length};
      axios.post('/api/greatings/', fields)
        .then(() => {
          this.clearFields();
          this.$refs.modal.hide();
          eventBus.$emit('created-greating');
        })
        .catch(err => { alert(this.decodeHtml(err.response.data.error)) });
    },

    decodeHtml: function(html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault() // Prevent modal from closing
      this.create();
    }
  },
  created: function(){
    this.min = this.today;
  }
};
</script>

<style scoped>
.wrapper{
  display: flex;
  flex-direction: column;
}
input{
  width: 100%;
}
</style>
