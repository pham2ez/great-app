<template>
  <div header-tag='header'>
    <b-card
    :title="restaurant.name"
    style="max-width: 20rem;"
    class="mb-2"
  >
    <div class="side-by-side"><i class="suggested" v-if="restaurant.suggestedBy">suggested by {{restaurant.suggestedBy}}</i></div>
    <p v-if="restaurant.formatted_address!==undefined">{{ restaurant.formatted_address }}</p>
    <p v-else-if="restaurant.vicinity!==undefined">{{ restaurant.vicinity }}</p>
    <p v-if="restaurant.website" v-html="`<a href='${restaurant.website}' target='_blank'>website</a>`"></p>
    <br>
    <i> {{tags}} </i>
    <div v-if="!browsing">
      <div class='spread'>
        <div v-if='!isFinal' class="btn-group btn-group-sm">
          <b-button variant="info" type="button" class="btn btn-primary" @click="approve('Love')">Love: {{numLoves}}</b-button>
          <b-button variant="info" type="button" class="btn btn-primary" @click="approve('Like')">Like: {{numLikes}}</b-button>
          <b-button variant="info" type="button" class="btn btn-secondary" @click="approve('Dislike')">Dislike: {{numDislikes}}</b-button>
        </div>
        <b-button v-if='allowChoose && !isFinal' variant="dark" size='sm' v-on:click='choose'> choose </b-button>
      </div>
    </div>
    <div v-else>
      <div v-if="signedIn && browsing && !isNaN(parseInt(greatings))">
         <b-button v-on:click='suggest(greatings,restaurant.place_id)' v-bind:disabled="greatRestaurants[greatings][1].includes(restaurant.place_id)"> Suggest to this grEATing </b-button>
      </div>
      <div v-if="signedIn && browsing && isNaN(parseInt(greatings))">
        <b-dropdown id="dropdown-1" text="Suggest Restaurant to..." class="m-md-2">
          <b-dropdown-item v-if="greatings.length === 0" disabled>No Available Greatings</b-dropdown-item>
          <b-dropdown-item
            v-for="greating in greatings"
            v-bind:key="greating.title"
            v-on:click="suggest(greating.id,restaurant.place_id)"
            v-bind:disabled="greatRestaurants[greating.id][1].includes(restaurant.place_id)"
          >{{greating.title}}</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    </b-card>
  </div>
</template>

<script>

import axios from 'axios';
import { eventBus } from '../main';

export default {
  name: 'RestaurantListItem',

  props: ['restaurant','browsing', 'signedIn', 'greatings', 'greatRestaurants', 'allowChoose'],

  data() {
    return {
      numLoves: 0,
      numLikes: 0,
      numDislikes: 0,
      tags: "",
      restaurants: [],
      isFinal: false
    };
  },
  created: function(){
    this.getTags();
  },

  methods: {
    approve: function(approvalLevel) {
      // fields should be restaurantID, active user email, and approval level
      let fields = {restaurantID: this.restaurant.place_id,
                    userEmail: window.email,
                    level: approvalLevel};

      axios.post('/api/greatings/'+this.greatings[0].id+'/restaurants/approve/', fields)
        .then(response => {
          this.numLoves = parseInt(response.data.loves);
          this.numLikes = parseInt(response.data.likes);
          this.numDislikes = parseInt(response.data.dislikes);
        });
    },

    choose: function() {
      let fields = {
                    restaurant: this.restaurant};

      axios.post('/api/greatings/'+this.greatings[0].id+'/restaurants/finalize/', fields)
        .then((res) => {
          eventBus.$emit('selected', res);
        });

      this.isFinal = true;
      eventBus.$emit('finalized-restaurant');
    },
    suggest:function(grID){
      axios.put('/api/greatings/'+grID+'/restaurants', {restaurant:this.restaurant,email:window.email})
        .then(() => {
          eventBus.$emit('suggest-success');
        });
    },

    clearErrorMessages: function() {
      setInterval(() => {
        this.error = '';
      }, 5000);
    },

    getTags: function() {
      this.tags = "";
      for(let tag of this.restaurant.tags){
        this.tags += tag + ", ";
      }
      if(this.restaurant.price_level === 0){
        this.tags += "free";
      }else if(this.restaurant.price_level === undefined || this.restaurant.price_level === null){
        this.tags = this.tags.substring(0,this.tags.length-2);
      }else{
        for(let i = 0; i < this.restaurant.price_level; i++){
          this.tags += "$";
        }
      }
    },

    getApprovals: function(){
      if (!this.browsing) {
        axios.get('/api/greatings/' +this.greatings[0].id + '/' + this.restaurant.place_id + '/approval')
          .then(response => {
            this.numLoves = parseInt(response.data.loves);
            this.numLikes = parseInt(response.data.likes);
            this.numDislikes = parseInt(response.data.dislikes);
          });
      }
    }
  },

  computed: {
  },

  mounted: function() {
    if (!this.browsing) {
      // Populate the approval information
      axios.get('/api/greatings/' +this.greatings[0].id + '/' + this.restaurant.place_id + '/approval')
        .then(response => {
          this.numLoves = parseInt(response.data.loves);
          this.numLikes = parseInt(response.data.likes);
          this.numDislikes = parseInt(response.data.dislikes);
        });
    }

    eventBus.$on('finalized-restaurant', () => {
      this.isFinal = true;
    })
    eventBus.$on('switch-sort', () => {
      this.getApprovals();
    })
  }};
</script>

<style scoped>
.success-message, .error-message {
  display: flex;
  justify-content: center;
}

.spread {
  display: flex;
  justify-content: space-between;
}

.side-by-side{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.suggested{
  padding: 0px 10px;
}
h5{
  font-weight: bold;
}
</style>
