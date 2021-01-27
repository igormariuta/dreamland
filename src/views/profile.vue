<template>
  <main class="page page--profile page--width">

    <loader v-if="$apollo.loading" />

    <aside class="a-profile" v-if="user">

      <div class="a-profile__inn">

        <div class="a-profile__image user-pic svg-larger"
          :style="user.picture ? `background: url( ${serverURL}${user.picture.url} );` : '' ">
          <font-awesome-icon v-if="!user.picture" :icon="['fas','user']" />
        </div>

        <div class="a-profile__name">

          <router-link to="/editprofile" class="a-profile__edit" v-if="me.id == user.id">
            <font-awesome-icon icon="cog" />
          </router-link>

          <h3> {{ user.username }} </h3>
          <div class="role" v-if="user.occupation"> {{ user.occupation }} </div>
          <div class="place" v-if="user.location">
            <font-awesome-icon icon="map-marker-alt" />
            <span>{{ user.location }}</span>
          </div>

          <div class="a-profile__btns" v-if="loggedIn && me.id != user.id">
            <button v-if="ifFollowing()" class="btn mr-10 btn-gray" v-on:click="unfollow()">Following</button>
            <button v-else class="btn mr-10 btn-gray btn-primary" v-on:click="follow()">Follow</button>

            <button class="btn btn-gray">
              <font-awesome-icon icon="envelope" />
            </button>
          </div>

        </div>
      </div>

      <div class="separate separate__about"></div>

      <div class="a-profile__about">

        <div class="a-profile__about__title">
          <span>About</span>
        </div>

        <p>
          {{ user.about }}
        </p>

      </div>

      <div class="a-profile__social">

        <a :href="user.social_behance" class="btn btn-gray mr-10" v-if="user.social_behance">
          <font-awesome-icon :icon="['fab', 'behance']" />
        </a>

        <a :href="user.social_dribbble" class="btn btn-gray mr-10" v-if="user.social_dribbble">
          <font-awesome-icon :icon="['fab', 'dribbble']" />
        </a>

        <a :href="user.social_instagram" class="btn btn-gray mr-10" v-if="user.social_instagram">
          <font-awesome-icon :icon="['fab', 'instagram']" />
        </a>

      </div>

      <div class="separate"></div>

      <div class="a-profile__member" style="display: flex; align-items: center; justify-content: space-between;">
        <small>Member since: {{ user.created_at | moment("MMM Do  YYYY") }}</small>

        <small>
          <font-awesome-icon style="margin-right: 5px" icon="heart"></font-awesome-icon>
          <strong>{{ numSpaces(totalLikes) }}</strong>
        </small>
      </div>

    </aside>

    <div class="profile-content" v-if="user">

      <div class="page-title">

        <div class="page-title-left">

          <button class="btn btn-link" 
            v-if="(user.projects).length" 
            v-on:click="tab = 'projects'"
            :class="{'btn-link-active': tab == 'projects'}">
              Projects
              <strong style="margin-left: 5px; color: var(--color-text-gray);"> {{ (user.projects).length }} </strong>
          </button>

          <!-- <button class="btn btn-link ml-30" 
            v-if="(user.liked_projects).length" 
            v-on:click="tab = 'likes'"
            :class="{'btn-link-active': tab == 'likes'}">
            Likes 
            <strong style="margin-left: 5px; color: var(--color-text-gray);"> {{ (user.likedprojects).length }} </strong>
          </button> TODO:  -->

          <button class="btn btn-link ml-30" 
            v-if="(user.followers).length" 
            v-on:click="tab = 'followers'"
            :class="{'btn-link-active': tab == 'followers'}">
              Followers
              <strong style="margin-left: 5px; color: var(--color-text-gray);"> {{ (user.followers).length }} </strong>
          </button>

          <!-- <button class="btn btn-link ml-30" 
            v-if="(user.following).length" 
            v-on:click="tab = 'following'"
            :class="{'btn-link-active': tab == 'following'}">
            Following
            <strong style="margin-left: 5px; color: var(--color-text-gray);"> {{ (user.following).length }} </strong>
          </button> -->

        </div>

      </div>

      <!-- Projects -->

      <div class="projects-list list-for-profile" v-if="tab == 'projects'">
        <project-profile class="project" 
          v-for="project in user.projects" 
          :key="project.id" 
          :project='project'>
        </project-profile>
      </div>
 
      <!-- Likes -->

      <!-- <div class="projects-list list-for-profile" v-if="tab == 'likes'">
        <div class="project" v-for="project in user.likedprojects" :key="project.id">
          <div class="project__wrap">
            <div class="project__img">
              <img :src="serverURL + project.image.url"  alt="">
              <div class="project__img__title">
                <span> {{ project.title }} </span>
              </div>
              <router-link :to="{ name: 'project', params: { id: project.id }}" class="project__img__link"></router-link>
            </div>
          </div>

          <div class="project__desc">
            <router-link :to="{ name: 'profile', params: { id: project.owner.id }}" class="project__desc__user">
              <div class="image user-pic" :style=" project.owner.image ? `background: url( ${serverURL}${project.owner.image.url} );` : '' ">
                <font-awesome-icon v-if="!project.owner.image" :icon="['fas','user']"/>
              </div>
              <div class="name">{{ project.owner.username }}</div>
            </router-link>
            <div class="project__desc__info">
              <div class="item">
                <font-awesome-icon icon="eye"/>
                <small>{{ numSpaces(project.numviews) }}</small>
              </div>
              <div class="item">
                <font-awesome-icon icon="heart"/>
                <small>{{ numSpaces(project.numlikes) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- <div v-if="ifFollowing"></div> -->

    </div>

  </main>
</template>

<script>

  // Components
  import ProjectProfile from '../components/project-profile'
  // GQL
  import Profile  from '../graphql/Profile.gql'
  import Follow   from '../graphql/Follow.gql'
  import Unfollow from '../graphql/Unfollow.gql'

  export default {

    data() {
      return {
        user: null,
        followerID: null,
        tab: 'projects'
      }
    },

    components: {
      'project-profile': ProjectProfile,
    },

    computed: {

      loggedIn() {
        return this.$store.getters.loggedIn
      },

      me() {
        return this.$store.getters.getUser
      },

      totalLikes() {

        let total = 0;

        this.user.projects.forEach(function (project) {
          total += project.num_likes;
        });

        return total;

      }

    },

    // apollo: {

    //   user: {
    //     query: Profile,
    //     variables() {
    //       return {
    //         id: this.$route.params.id
    //       }
    //     },
    //   }

    // },

    mounted() {
      this.getProfile();
    },

    methods: {

      getProfile() {

        this.$apollo.addSmartQuery('user', {
          query: Profile,
          variables() {
            return {
              id: this.$route.params.id
            }
          }
        });

      },

      numSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      },

      ifFollowing() {

        for (let follow of this.user.followers) {
          if (follow.follower.id === this.me.id) {
            this.followerID = follow.id;
            return true;
          }
        }
        return false;

      },

      follow() {

        let follower = this.me.id;
        let user     = this.user.id;

        this.$apollo.mutate({
          mutation: Follow,
          variables: {
            input: {
              data: {
                follower: follower,
                user: user
              }
            },
          },

        }).then(() => {
          this.updateProfileFollowers();
        });

      },

      unfollow() {

        const id = this.followerID;

        this.$apollo.mutate({
          mutation: Unfollow,
          variables: {
            input: {
              where: {
                id: id,
              }
            },
          },

        }).then(() => {
          this.updateProfileFollowers();
        });

      },

      updateProfileFollowers() {

        let user = this.user;

        this.$apollo.query({
          query: Profile,
          fetchPolicy: 'network-only', 
          variables: {
            id: user.id
          }
        });

      }

    }

  }
</script>