<template>
  <div class='wrapper'>
    <div class='part'>
      <h3 v-if="input">Input Your Availability</h3>
      <h3 v-if="!input">Everyone's Availability</h3>
      <p v-if="input">Click and drag to select/deselect your availabily blocks! The purple blocks are your available time blocks.</p>

      <p v-if="!input"> Hover over to view the members that are available at that time block. Blue blocks represent the best starting time blocks. Otherwise, the darker green the time block, the more members that are available! If you are an organizer, click a time block to finalize a time for the grEATing!</p>
       <b-button-group>
        <b-button @click="input = true" v-if='!isFinal' v-bind:disabled="input === true">Input Your Availability</b-button>
        <b-button @click="input = false" v-bind:disabled="input === false">View Everyone's Availability</b-button>
      </b-button-group>
      <b-button v-if="organizerEmail===yourEmail && !isFinal" v-b-modal.change-info>Organizer Settings </b-button>
      <ChangeAvailabilityModal v-bind:greatingId='greatingId'/>
    </div>

    <div v-if="input" class='avail'>
      <div
        v-for='day in Object.keys(availability)'
        v-bind:key='day'
        class='section'>
          <h5>{{new Date(parseInt(day)).toString().split(' 00:')[0]}}</h5>
          <select
          v-bind:key='day'
          v-bind:size='availability[day].length'
          multiple disabled>
            <option v-for='block in availability[day]'
            v-bind:key='block.time'
            v-bind:value='block.time'
            v-bind:selected="false"
            v-on:mouseover='select($event,block.dayIndex,block.timeIndex)'
            v-on:mousedown='down($event,block.dayIndex,block.timeIndex)'
            v-on:mouseup='up'
            v-bind:style="selected(block.selected)">
              {{new Date(parseInt(block.time)).toString().split(' ')[4]}}
            </option>
          </select>
      </div>
    </div>

    <div v-if="!input" class='avail'>
      <div
      v-for='day in Object.keys(availability)'
      v-bind:key='day'
      class='section'>
        <h5>{{new Date(parseInt(day)).toString().split(' 00:')[0]}}</h5>
        <select
        v-bind:key='day'
        v-bind:size='availability[day].length' disabled>
          <option selected disabled hidden style='display: none' value=''/>
          <option v-for='block in availability[day]'
          v-bind:key='block.time'
          v-bind:value='block.time'
          v-bind:selected="false"
          v-on:mouseover='available($event)'
          v-on:click='finalize($event)'
          v-bind:style="bgc(block.time)">
              {{new Date(parseInt(block.time)).toString().split(' ')[4]}}
          </option>
        </select>
      </div>
      <div v-if="!input" class='availusers'>
        <h3> Available Users: </h3>
        <div class='section' v-for='user in current' v-bind:key='user'>
          {{user}}<br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '../main';
import ChangeAvailabilityModal from './ChangeAvailabilityModal.vue';

export default {
  name: 'Availability',

  components: {
    ChangeAvailabilityModal
  },
  props: {
    greatingId: String,
  },
  data() {
    return {
      availability: {},
      best: null,
      current: [],
      time: null,
      start: null,
      show: false,
      mousedown: false,
      update: {},
      max: 0,
      input: true,
      organizerEmail: "",
      yourEmail: "",
      isFinal: false
    };
  },
  methods: {
    bgc: function(time){
      if(this.best.includes(time)){
        return{
          backgroundColor: 'rgb(89, 171, 227)',
          color: 'black'
        };
      }else{
        return {
          backgroundColor: `rgba(0,179,0,${this.availabileUsers[time].length/this.max})`,
          color: 'black'
        };
      }
    },
    selected: function(yes){
      if(yes){
        return{
          backgroundColor: 'rgb(177,156,217)',
          color: 'black'
        };
      }else{
        return {
          backgroundColor: "rgb(255,255,255)",
          color: 'black'
        };
      }
		},
    finalize: function(event){
      if(event !== null && this.organizerEmail===window.email){ //&& user is organizer
        let time = new Date(parseInt(event.target.value));
        if(confirm("Do you want to finalize this grEATing's time to be " + time + "?")){
          this.isFinal = true;
          this.input = false;
          axios.post('/api/greatings/' + this.greatingId + '/schedule/finalize', {time:event.target.value})
          .then((res)=>{
            eventBus.$emit('selected', res);
          });
        }
      }
    },
    available: function(event){
      this.time = event.target.value;
      if(event !== null){
        this.current = this.availabileUsers[event.target.value];
      }
    },
    down: function(event,di,ti){
      let time = new Date(parseInt(event.target.value));
      time = new Date(time.getFullYear(), time.getMonth(), time.getDate()).getTime();
      this.start = [di,ti,this.availability[time][ti].selected];
      this.mousedown = true;
      this.select(event,di,ti);
    },
    up: function(){
      if(this.mousedown){
        this.mousedown = false;
        axios.post('/api/greatings/' + this.greatingId + '/schedule/availability', {updated: this.update,
      email: window.email})
          .then(()=>{
          axios.get('/api/greatings/' + this.greatingId + '/schedule/availability')
            .then((res)=>{
              this.availabileUsers = res.data;
              this.$forceUpdate();
            });
          axios.get('/api/greatings/' + this.greatingId + '/schedule/optimal', {})
            .then((res)=>{
              this.best = res.data;
            });
        });
      }
    },
    select: function(event,di,ti){
      if(this.mousedown){
        this.update = {};
        let dind = 0;
        let copy = {};
          for(let i of Object.keys(this.availability)){
            copy[i] = []
            let ind = 0;
            let d = di > this.start[0]? [this.start[0],di]: [di,this.start[0]];
            let t = ti > this.start[1]? [this.start[1],ti]: [ti,this.start[1]];
            for(let j of this.availability[i]){
              if(dind >= d[0] && dind <= d[1] && ind >= t[0] && ind <= t[1]){
                this.update[j.time] = !this.start[2];
                copy[i].push({time: j.time, dayIndex: dind, timeIndex: ind,selected: !this.start[2]});
              }else{
                this.update[j.time] = j.selected;
                copy[i].push({time: j.time, dayIndex: dind, timeIndex: ind,selected: j.selected});
              }
              ind++;
            }
            dind++;
          }
          this.availability = copy;
      }
    },
    updateAvailability: function(){
      axios.get('/api/greatings/' + this.greatingId + '/schedule/timeblocks/' + encodeURIComponent(window.email), {
      email: window.email})
        .then((res)=>{
          let dind = 0;
          this.availability = {};
          for(let i of Object.keys(res.data)){
            this.availability[i] = []
            let ind = 0;
            for(let j of res.data[i]){
              this.availability[i].push({time: j.time, dayIndex: dind, timeIndex: ind,selected: j.available});
              ind++;
            }
            dind++;
          }
// eslint-disable-next-line no-console
console.log(this.availability);



      axios.get('/api/greatings/' + this.greatingId + '/schedule/availability')
            .then((res)=>{
              this.availabileUsers = res.data;
                this.$forceUpdate();
            });

      axios.get('/api/greatings/' + this.greatingId + '/schedule/optimal', {})
          .then((res)=>{
            this.best = res.data;
      });
    });
    }
  },
  created: function() {
    this.yourEmail = window.email;
    axios.get('/api/greatings/'+this.greatingId+'/organizer').then((res)=>{
      this.organizerEmail = res.data.email;
      axios.get('/api/greatings/'+this.greatingId+'/members').then((res)=>{
        this.max = res.data.members.length;
      });
      this.updateAvailability();
    });
      eventBus.$on('update-info-success', () => {
        this.updateAvailability();
      });
  },

  mounted: function() {
  }
}
</script>

<style scoped>
.wrapper{
  display: flex;
  flex-direction: column;
}

.avail{
  display: flex;
  flex-direction: row;
}
.section{
  display: flex;
  flex-direction: column;
  padding:0px 0px;
}
.part{
  display: flex;
  flex-direction: column;
  padding:0px 5px;
}
.top{
  display: flex;
  flex-direction: row;
}
form label{
  font-weight:bold;
}
.availusers{
  display: flex;
  flex-direction: column;
  border-style: solid;
  background-color: #ffe5b5;
  border-color: #f5f5f5;
  border-radius: 25px;
  padding: 10px 10px;
}
</style>
