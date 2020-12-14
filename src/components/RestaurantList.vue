<template>
  <div class='wrapper'>
    <h4>Search from zip code/restaurant name:</h4>
    <div class="search" v-if="browsing">
      <b-form-input disabled type="text" style="height:100%;" v-model="search" placeholder="Search..."/>
      <b-button disabled variant="dark" v-on:click="loadRestaurants"> Search </b-button>
      <b-dropdown variant="dark" id="dropdown" text="Filters" class="m-md-2">
        <div  v-for="(group,index) in filters" v-bind:key="index">
          <b-form-checkbox disabled
            v-for="filter in group"
            v-bind:key="filter"
            @change="loadCriteria($event,filter)"
          >{{filter}}</b-form-checkbox>
          <b-dropdown-divider v-if="index!==Object.keys(filters).length-1"/>
          </div>
        </b-dropdown>
    </div>
    <div class="search" v-if="!browsing">
      <b-button @click="showModal = true">Suggest Restaurant </b-button>
       <b-modal v-model="showModal" hide-footer id="my-modal">
         <template v-slot:modal-title>
          <h3> Restaurant Suggesting </h3>
        </template>
          <RestaurantList v-bind:browsing='true' v-bind:signedIn='true' v-bind:greatingId="greatingId"/>
       </b-modal>
    </div>
    <h3>{{locationHeader}}</h3>
    <div v-if="filter.length>0" class="side-by-side"> <h5>filter: {{getFilters}}</h5><b-button @click="clearFilter">Clear</b-button></div>
    <b-button-group v-if="!browsing">
      <b-button :pressed="sortCriteria==='bestfit'" v-on:click="sortBy('bestfit')">Sort by Best Fit</b-button>
      <b-button :pressed="sortCriteria==='mostpopular'" v-on:click="sortBy('mostpopular')">Sort by Most Popular</b-button>
    </b-button-group>
    <div v-if="searching">Loading Restaurants...</div>
    <b-spinner label="Spinning" v-if="searching"></b-spinner>
    <div class='restaurant-list'>
      <div v-if='restaurants.length || searching'>
        <RestaurantListItem
          v-for='restaurant in restaurants'
          v-bind:key='restaurant.id'
          v-bind:restaurant='restaurant'
          v-bind:browsing='browsing'
          v-bind:signedIn='signedIn'
          v-bind:greatings='greatings'
          v-bind:greatRestaurants='greatRestaurants'
          v-bind:allowChoose="allowChoose"
        />
      </div>
      <div v-else>
        <p>There are no restaurants to display.</p>
        <!-- <p style="color:red;">This web app uses on Google's Place API which we no longer have access to.</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import RestaurantListItem from './RestaurantListItem';
import Utils from '../models/Utils';

import { eventBus } from '../main';

export default {
  name: 'RestaurantList',

  components: { RestaurantListItem },

  data() {
    return {
      error: '',
      restaurants: [],
      greatRestaurants:[],
      search: null,
      locationHeader: '',
      searching: false,
      showModal: false,
      allowChoose: false,
      greatings: [],
      filters:{0:["vegetarian", "vegan", "kosher", "halal"],
      1:["mexican","italian", "american", "chinese", "korean", "japanese", "mediterranean"],
      2:["$", "$$", "$$$", "$$$$"]},
      filter: [],
      sortCriteria: "bestfit",
      zip: null
    };
  },

  props: {
    browsing: Boolean,
    signedIn: Boolean,
    greatingId: String
  },

  created: function() {

    eventBus.$on('update-restriction-success', () => {
      this.clearMessages();
      this.loadRestaurants();
    });

    eventBus.$on('add-pref-success', () => {
      this.clearMessages();
      this.loadRestaurants();
    });

    eventBus.$on('suggest-success', () => {
      this.clearMessages();
      this.loadRestaurants();
      this.loadGreatRestaurants();
    });

    axios.get('/api/greatings/' + this.greatingId + '/organizer')
      .then(res => {
        let organizerInfo = res.data;
        this.allowChoose = (window.email === organizerInfo.email);
      });
  },
  computed:{
    getFilters: function(){
      if(this.filter.length === 0){
        return "";
      }else{
        return this.filter.reduce((total, f) => {return `${total}, ${f}`});
      }
    },
    query: function(){
      if(this.filter.length === 0){
        return "";
      }else{
        return this.filter.reduce((total, f) => {if(this.filters[2].includes(f)){return total;}else{return `${f} ${total}`;}},"");
      }
    }
  },
  mounted: function() {
    if(window.email !== undefined){
      axios.get('/api/users/' + encodeURIComponent(window.email) + '/zip')
          .then(res => {
            this.zip = res.data.zip;
            this.search = this.zip;
            this.loadData();
            this.loadGreatRestaurants();
            this.loadRestaurants();
          });
    }else{
      this.zip = "02139";
      this.search = this.zip;
      this.loadData();
      this.loadGreatRestaurants();
      this.loadRestaurants();
    }
  },

  methods: {

    decodeHtml: function(html) {
      var txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    },
    clearFilter: function(){
      this.filter = [];
      this.loadRestaurants();
    },
    loadData: function() {
      if(this.browsing && this.signedIn && this.greatingId !== undefined){
        this.greatings = this.greatingId;
      }else if(this.browsing && this.signedIn){
        axios.get('/api/users/' + encodeURIComponent(window.email) + '/greatings')
          .then(res => {
            this.greatings = res.data.accepted;
          })
          .catch(err => {
            alert(this.decodeHtml(err.response.data.error));
          });
      }else{
        this.greatings = [{id: this.greatingId}];
      }
    },
    loadGreatRestaurants: function(){
      if(window.email !== undefined){
      axios.get('/api/greatings/restaurants/' + encodeURIComponent(window.email))
          .then(res => {
            this.greatRestaurants = res.data;
          })
          .catch(err => {
            alert(this.decodeHtml(err.response.data.error));
          });
      }
    },
    loadCriteria: function(event,filter) {
      if(this.browsing){
        if(!event){
          this.filter = this.filter.filter((f) => {return f !== filter;});
        }else{
          this.locationHeader = `Showing Restaurants near ${this.search}`;
          this.filter.push(filter);
        }
        this.restaurants = [];
        this.searching = true;
        let containsPrice = this.filter.filter((f)=>{return this.filters[2].includes(f);});
        if(this.filter.length === 0){
          this.loadRestaurants();
        }else if(!Utils.isZipCode(this.search) && containsPrice[0]){
          let price = containsPrice.reduce((total,price)=>{return price.length > total.length? price: total;});
          axios.get(`/api/restaurants/location/${this.zip}/price/${this.filters[2].indexOf(price)+1}/${this.search} ${this.query}`, {} )
          .then(res => {
            this.searching = false;
            this.restaurants = res.data;
          });
        }else if(!Utils.isZipCode(this.search)){
          axios.get(`/api/restaurants/location/${this.zip}/criteria/${this.getFilters}/${this.search} ${this.query}`, {} )
          .then(res => {
            this.searching = false;
            this.restaurants = res.data;
          });
        }else if(containsPrice[0]){
          let price = containsPrice.reduce((total,price)=>{return price.length > total.length? price: total;});
          axios.get(`/api/restaurants/location/${this.search}/price/${this.filters[2].indexOf(price)+1}/${this.query}`, {} )
          .then(res => {
            this.searching = false;
            this.restaurants = res.data;
          });
        }else{
        axios.get(`/api/restaurants/location/${this.search}/criteria/${this.query}`, {} )
          .then(res => {
            this.searching = false;
            this.restaurants = res.data;
          })
          .catch(
            () => {
              this.searching = false;
              this.restaurants = [];
            }
          );
        }
      }
    },
    sortBy: function(criteria) {
      this.sortCriteria = criteria;
      this.loadRestaurants();
    },
    loadRestaurants: function() {
      if (this.browsing) {
        if (!Utils.isZipCode(this.search)) {
          this.locationHeader = `Showing Restaurants called ${this.search}`;
          this.filter = [];
          this.restaurants = [];
            this.searching = true;
            axios.get(`/api/restaurants/location/${this.zip}/name/${this.search}`).then(response => {
              this.restaurants = response.data;
              this.searching = false;
            });
        }else{ // loads browsing restaurants
          this.locationHeader = `Showing Restaurants near ${this.search}`;
          this.filter = [];
          this.restaurants = [];
            this.searching = true;
            axios.get('/api/restaurants/location/' + this.search).then(response => {
              this.restaurants = response.data;
              this.searching = false;
            });
        }
      } else { 
        // loads all restaurants for greating id
          this.locationHeader = `Showing Restaurants nearest to your Group`;
          axios.get(`/api/greatings/${this.greatingId}/restaurants/${this.sortCriteria}`).then(response => {
            this.restaurants = response.data;
            this.$nextTick(function () {
              eventBus.$emit('switch-sort');
              this.$forceUpdate();
            });

          });
      }
    },
    clearMessages: function() {
      setInterval(() => {
        // this.success = '';
        this.error = '';
      }, 5000);
    }
  }
};
</script>

<style scoped>
.restaurant-list {
  display: flex;
  flex-wrap: wrap;
}

.search {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.restaurant-list > * {
  margin: 0.5rem;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.side-by-side{
  display: flex;
  flex-direction: row;
}
</style>
