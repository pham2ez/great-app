<!--

Search with autocomplete. Code taken from https://alligator.io/vuejs/vue-autocomplete-component/ at 22:43 on Nov 20, 2019.

-->

<template>
  <div>
    <div class="autocomplete">
      <input
        type="text"
        width="600px"
        @input="onChange"
        v-model="search"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
        @keydown.enter="onEnter"
      />
      <ul
        id="autocomplete-results"
        v-show="isOpen"
        class="autocomplete-results"
      >
        <li
          class="loading"
          v-if="isLoading"
        >
          Loading results...
        </li>
        <li v-if="!isLoading && noResults">No users could be found!</li>
        <div v-if="!isLoading && members.length !== 0">
        <li
        v-for="(member, i) in members"
        :key="i"
        class="autocomplete-result member">
          <UserSearchDropdownItem v-bind:result='member' v-bind:member='true' v-bind:invited='false'/>
        </li>
        </div>
        <div v-if="!isLoading && invited.length !== 0">
        <li v-for="(invited, i) in invited"
        :key="i"
        class="autocomplete-result invited">
          <UserSearchDropdownItem v-bind:result='invited' v-bind:member='false' v-bind:invited='true'/>
        </li>
        </div>
        <div v-if="!isLoading && invitable.length !== 0">
          <li v-for="(invitable, i) in invitable"
          :key="i"
          @click="setResult(invitable)"
          class="autocomplete-result invitable"
          :class="{ 'is-active': i === arrowCounter }"
        >
          <UserSearchDropdownItem v-bind:result='invitable' v-bind:member='false' v-bind:invited='false'/>
        </li>
        </div>
      </ul>
    </div>
    <div class='success' v-if='showSuccess'>
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import axios from 'axios';
// eslint-disable-next-line
import { eventBus } from '../main';
import UserSearchDropdownItem from './UserSearchDropdownItem';

export default {
  name: 'Search',

  components: {
    UserSearchDropdownItem,
  },

  props: {
    greatingId: String,
  },

  data() {
    return {
      isOpen: false,
      search: '',
      isLoading: true,
      arrowCounter: 0,
      members: [],
      invited: [],
      invitable: [],
      showSuccess: false,
      successMessage: '',
    };
  },

  computed: {
    noResults: function() {
      return this.members.length + this.invited.length + this.invitable.length === 0;
    }
  },

  methods: {
    onChange() {
      this.isOpen = true;
      this.isLoading = true;
      axios.post('/api/greatings/' + this.greatingId + '/usersearch', {query: this.search})
        .then(res => {
          this.members = res.data.members;
          this.invited = res.data.invited;
          this.invitable = res.data.invitable;
          this.isLoading = false;
        })
        .catch(err => {
          alert(err.response.data.error);
        });
    },
    setResult(result) {
      var name = result.firstName + ' ' + result.lastName;
      this.search = name;
      this.isOpen = false;
      axios.post('/invite/' + this.greatingId + '/send', {email: result.email})
        .then(() => {
          this.successMessage = name + ' was invited successfully!';
          this.showSuccess = true;
          setTimeout(() => {
            this.showSuccess = false;
            this.search = '';
          }, 2000);

          eventBus.$emit('invited-user');
        })
        .catch(err => {
          alert(err.response.data.error);
        });
    },
    onArrowDown() {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter -1;
      }
    },
    onEnter() {
      this.search = this.results[this.arrowCounter];
      this.isOpen = false;
      this.arrowCounter = -1;
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
  },
  watch: {
    items: function (val, oldValue) {
      // actually compare them
      if (val.length !== oldValue.length) {
        this.results = val;
        this.isLoading = false;
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside)
  }
};
</script>

<style scoped>
  .autocomplete {
    display: flex;
    flex-direction: column;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    overflow: auto;
    width: 100%;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result.member {
    background-color: LightGray;
  }

  .autocomplete-result.invited {
    background-color: LightGray;
  }

  .autocomplete-result.invitable.is-active,
  .autocomplete-result.invitable:hover {
    background-color: #4AAE9B;
    color: white;
  }

  .success {
    color: green;
  }
</style>
