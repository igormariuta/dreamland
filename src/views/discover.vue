<template>

  <main class="page page--discover page--width">

    <loader v-if="$apollo.loading" />

    <div class="page-title">
      <h2>Discover the world of Dreams</h2>

      <div class="page-title__right">

        <button class="btn btn-link ml-30" 
          :class="{ 'btn-link-active': sort == 'created_at:desc' }"
          v-on:click="sortBy('created_at:desc')">Recent</button>

        <button class="btn btn-link ml-30" 
          :class="{ 'btn-link-active': sort == 'num_likes:desc, created_at:desc' }"
          v-on:click="sortBy('num_likes:desc, created_at:desc')">Popular</button>

        <!-- <button class="btn btn-link" v-on:click="projectType('')">Hot</button> -->

        <!-- <button class="btn btn-link" 
          :class="{ 'btn-link-active': pt == '' }"  
          v-on:click="projectType('')">All</button>

        <button class="btn btn-link" 
          :class="{ 'btn-link-active': pt == 'photography' }"
          v-on:click="projectType('photography')">Photography</button>

        <button class="btn btn-link" 
          :class="{ 'btn-link-active': pt == 'finearts' }"
          v-on:click="projectType('finearts')">Fine Arts</button>

        <button class="btn btn-link" 
          :class="{ 'btn-link-active': pt == 'illustration' }"
          v-on:click="projectType('illustration')">Illustration</button>

        <button class="btn btn-link"
          :class="{ 'btn-link-active': pt == 'architecture' }" 
          v-on:click="projectType('architecture')">Architecture</button>
          -->
          
        <button class="btn btn-link ml-30">
          <font-awesome-icon icon="ellipsis-v" />
        </button>

      </div>

    </div>

    <!-- Projects -->

    <div class="projects-list list-full">
      <project class="project" 
        v-for="project in projects" 
        :key="project.id" 
        :project='project'>
      </project>
    </div>

    <!-- Load more -->
<!-- 
    <div class="load-more-btn">
      <button class="btn btn-primary" :disabled="$apollo.loading" v-if="loadMoreEnabled" v-on:click="loadMore()">Load more</button>
    </div> -->

  </main>

</template>

<script>

  // Components
  import Project from '../components/project'
  // GQL
  import Projects from '../graphql/Projects.gql'

  export default {

    components: {
      'project': Project,
    },

    data() {
      return {
        projects: null,
        page: 0,
        limit: 20,
        loadMoreEnabled: true,
        sort: "num_likes:desc, created_at:desc",
        where: {
          published: true
          // created_at_gt: this.lastMonth
        }
        // pt: '',
        // lastMonth: ''
      }
    },

    mounted() {

      // this.lastMonth = new Date();
      // // this.lastMonth.setMonth(this.lastMonth.getMonth() - 1);
      // this.lastMonth.setMonth(this.lastMonth.getMonth() - 12);

      // this.where = {
      //   created_at_gt: this.lastMonth
      // }

      this.getProjects();
      this.scroll();

    },

    methods: {

      getProjects() {

        this.$apollo.addSmartQuery('projects', {
          query: Projects,
          variables() {
            return {
              limit: this.limit,
              start: 0,
              sort:  this.sort,
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

          updateQuery: (previous, {fetchMoreResult }) => {

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

      },

      sortBy(str) {
        this.sort = str;
        this.page = 0;
        this.loadMoreEnabled = true;
      },

      // projectType (pt) {

      //   if (pt == '') {
      //     this.where = { date_gt: this.lastMonth };
      //     this.pt = '';
      //   }
      //   else {
      //     this.where = { projecttype: pt,  date_gt: this.lastMonth };
      //     this.pt = pt;
      //   }

      // }

    }

  }
</script>