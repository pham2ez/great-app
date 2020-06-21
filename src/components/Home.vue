<template>
  <div class='page'>
    <div class="slogan">
      <h1>grEAT</h1>
      <h5>group eating made easy</h5>
    </div>

    <div class='carousel-container'>
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="0"
      controls
      indicators
      background="#ababab"
      style="text-shadow: 1px 1px 2px #333;"
    >
      <!-- Organize grEATing image -->
      <b-carousel-slide
        img-src="../../media/1_Organize_grEATing.jpg"
      ></b-carousel-slide>

      <!-- Availability image -->
      <b-carousel-slide 
        img-src="../../media/2_Availability.jpg">
      </b-carousel-slide>

      <!-- Add preferences image -->
      <b-carousel-slide 
        img-src="../../media/3_Add_Preferences.jpg">
      </b-carousel-slide>

      <!-- Suggest/approve image -->
      <b-carousel-slide 
        img-src="../../media/4_Suggest_Approve.jpg">
      </b-carousel-slide>

      <!-- Finalize image -->
      <b-carousel-slide 
        img-src="../../media/5_Finalize.jpg">
      </b-carousel-slide>
    </b-carousel>
    </div>

    <div class='page-item'>
      <b-button class="button" v-on:click='showBrowse'>Browse Restaurants</b-button>
    </div>

    <!-- <RestaurantList v-if='showRestaurants' v-bind:browsing='true' v-bind:signedIn='signedIn'/> -->
  </div>
</template>

<script>
import { eventBus } from "../main";
import GreatingList from "./GreatingList.vue";

export default {
  name: "Home",
  components: {
    GreatingList
  },
  props: {
    greatingListTabId: {
      type: Number,
      default: 100
    },
  },
  data() {
    return {
      signedIn: false,
      showRestaurants: false
    };
  },
  methods:{
    sendBrowse: function(show) {
      eventBus.$emit('showBrowse',show);
    },
    showBrowse: function() {
      this.showRestaurants = !this.showRestaurants;
      this.sendBrowse(this.showRestaurants);
    },
  },
  created: function() {
    this.signedIn = window.email !== undefined;
    eventBus.$on("login-success", () => {
      this.signedIn = true;
    });
    eventBus.$on("logout-success", () => {
      this.signedIn = false;
    });
  }
};
</script>

<style scoped>
.slogan {
  text-align: center;
}
.page-item {
  margin: 1rem;
}
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.carousel-container {
  width: 800px;
  height: 600px;
}
</style>
