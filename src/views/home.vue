<template>

  <main class="page page--width">

    <loader v-if="$apollo.loading" />

    <div class="page-title">
      <h2>Projects from creatives you follow</h2>
    </div>

    <!-- Projects -->

    <div class="projects-list list-full" v-if="ifFollow">
      <project class="project" v-for="project in projects" :key="project.id" :project='project'>
      </project>
    </div>

    <!-- No Followers  -->

    <div v-if="!ifFollow && !$apollo.loading">
      <span>You don't follow anyone</span>
    </div>

    <!-- Load more -->
<!-- 
    <div class="load-more-btn">
      <button class="btn btn-primary" :disabled="$apollo.loading" v-if="loadMoreEnabled && ifFollow" v-on:click="loadMore()">Load more</button>
    </div> -->

  </main>

</template>

<script>

  // Components
  import Project from '../components/project'
  // GQL
  import Projects from '../graphql/Projects.gql'
  import Followings from '../graphql/Followings.gql'

  export default {

    components: {
      'project': Project
    },

    data() {
      return {
        ifFollow: false,
        projects: null,
        page: 0,
        limit: 20,
        loadMoreEnabled: true,
        sort: "created_at:desc",
        where: {
          published: true,
          owner: { id: [] }
        }
      }
    },

    computed: {
      me() {
        return this.$store.getters.getUser
      }
    },

    mounted() {
      this.checkFollowings();
    },

    methods: {

      checkFollowings() {

        const id = this.me.id;

        this.$apollo.addSmartQuery('followings', {
          query: Followings,
          fetchPolicy: 'network-only',
          variables() {
            return {
              where: {
                follower: {
                  id: id
                }
              }
            }
          },
          update: data => {
            
            if (data.followers.length) {
              this.ifFollow = true;
              data.followers.forEach(element => {
                this.where.owner.id.push(+element.user.id);
              });

              this.getProjects();
              this.scroll(); 
            }
          },
        })

      },

      getProjects() {

        this.$apollo.addSmartQuery('projects', {
          query: Projects,
          variables() {
            return {
              limit: this.limit,
              start: 0,
              sort: this.sort,
              where: this.where
            }
          }
        });

      },

      scroll() {
        window.onscroll = () => {
          let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

          if (bottomOfWindow && !this.$apollo.loading && this.loadMoreEnabled) {
            this.loadMore();
          }
        };
      },

      loadMore() {

        ++this.page;

        this.$apollo.queries.projects.fetchMore({

          variables: {
            limit: this.limit,
            start: this.limit * this.page,
            sort:  this.sort,
            where: this.where
          },

          updateQuery: (previous, { fetchMoreResult }) => {

            // eslint-disable-next-line no-console
            console.log('loadMore UPDATE');

            if (fetchMoreResult.projects.length < this.limit) {
              this.loadMoreEnabled = false;
            }

            if (!fetchMoreResult.projects) {
              return previous;
            }

            return Object.assign({}, previous, {
              projects: [...previous.projects, ...fetchMoreResult.projects]
            });

          },

        });

      }

    }

  }
</script>