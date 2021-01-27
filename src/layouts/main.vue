<template>
  <div>

    <loader v-if="$apollo.loading" />

    <header class="header">

      <div class="header__logo">
        <router-link to="/"></router-link>
      </div>

      <nav class="header__nav">
        <ul class="header__nav__ul">

          <li v-if="loggedIn">
            <router-link class="header__nav__link btn" to="/">For You</router-link>
          </li>
          <li>
            <router-link class="header__nav__link btn" to="/discover">Discover</router-link>
          </li>
          <li>
            <router-link class="header__nav__link btn" to="/profiles">Dreamers</router-link>
          </li>
          <li>
            <router-link class="header__nav__link btn" to="/teams">Teams</router-link>
          </li>
          <!-- <li>
            <router-link class="header__nav__link btn" to="/user">Profile</router-link>
          </li> -->
          <!-- <li>
            <router-link class="header__nav__link btn" to="/stats">Stats</router-link>
          </li> -->
        </ul>
      </nav>

      <div class="header__search">

        <font-awesome-icon class="search-icon" icon="search"/>

        <form>
          <font-awesome-icon icon="search"/>
          <input type="search" placeholder="Search for projects and designers">
        </form>

      </div>

      <div v-if="!loggedIn" class="header__right">
        <div class="header__actions">
          <router-link to="/login" class="btn ml-30 btn-primary ">
            Sign In
          </router-link>
        </div>
      </div>

      <div v-if="loggedIn" class="header__right">

        <div class="header__actions">
          <button class="header__action header__action--add-project">
            <font-awesome-icon icon="plus"/>
          </button>
          <button class="header__action" @click="updateTheme()">
            <font-awesome-icon :icon="['fas','fill']"/>
          </button>
          <button class="header__action">
            <font-awesome-icon :icon="['far','envelope']"/>
          </button>
          <button class="header__action">
            <font-awesome-icon :icon="['far','bell']"/>
          </button>
          <button class="header__action" @click="logOut()">
            <font-awesome-icon :icon="['fas','sign-out-alt']"/>
          </button>
        </div>

        <div class="header__user">

          <router-link :to="`/profile/${me.id}`" class="header__user__image">
            <div class="img user-pic svg-larger" :style=" me.picture ? `background: url( ${serverURL}${me.picture.url} );` : '' ">
              <font-awesome-icon v-if="!me.picture" :icon="['fas','user']"/>
            </div>
          </router-link>

        </div>

      </div>

    </header>

    <!-- Router -->
    <router-view v-if='loggedIn && me.id || !loggedIn' />

    <!-- modalProject -->

    <modal v-if="modal.show" modal="true" :projectId='modal.id'></modal> 

  </div>
</template>

<script>

  import VueJwtDecode from 'vue-jwt-decode'
  import { onLogout } from '../vue-apollo'
  import { eventBus } from '../main';
  // Components
  import Project from '../views/project'
  // GQL
  import Profile from '../graphql/Profile.gql'

  export default {

    data() {
      return {
        themeDark: false,
        modal: {
          id: null,
          show: false
        }
      }
    },

    components: {
      'modal': Project
    },

    computed: {

      loggedIn() {
        return this.$store.getters.loggedIn
      },

      me() {
        return this.$store.getters.getUser
      }
      
    },

    mounted() {

      if (this.loggedIn) {
        this.getMe();
      }

      eventBus.$on('showModalProject', (id) => {
        this.modal.show = true;
        this.modal.id   = id;     
      })

      eventBus.$on('closeModalProject', (goBack) => {

        this.modal.show = false;
        this.modal.id   = null;     

        if(goBack) {
          history.back();
        }
      })

    },

    methods: {

      updateTheme() {
        this.themeDark = !this.themeDark;
        document.body.className = this.themeDark ? 'theme-dark' : '';
      },

      logOut() {
        onLogout(this.$apollo.provider.defaultClient);
        this.$router.go();
      },

      getMe() {
        const userId = VueJwtDecode.decode(this.$store.getters.getToken).id;

        this.$apollo.query({
          query: Profile,
          variables: {
            id: userId
          },
        }).then((resp) => {
          this.$store.commit('setUser', resp.data.user)
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
      }
    }
  
  }
</script>