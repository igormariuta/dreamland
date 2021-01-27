<template>

  <div :class="modal ? 'modal-project' : ''">

    <loader v-if="$apollo.loading" :isTop='modal' />

    <div v-if="modal" class="close" v-on:click="closeModal()">
      <font-awesome-icon :icon="['fas','times']" />
    </div>

    <main class="page page--project">
      <div class="inner">

        <template v-if="!$apollo.loading">

          <div class="page-title">

            <div class="page-title__project">

              <div class="page-title__project__image user-pic svg-larger"
                :style=" project.owner.picture ? `background: url( ${serverURL}${project.owner.picture.url} );` : '' ">
                <font-awesome-icon v-if="!project.owner.picture" :icon="['fas','user']" />
              </div>

              <div class="page-title__project__info">
                <h2>{{ project.title }}</h2>
                <span class="page-title__project__user">by
                  <router-link class="link" :to="{ name: 'profile', params: { id: project.owner.id }}">
                    {{ project.owner.username }}</router-link>

                  <template v-if="loggedIn">
                    <span class="separate">|</span>
                    <router-link class="link" to="/user">Follow</router-link>
                  </template>

                </span>
              </div>
            </div>

            <div class="page-title__right">
              <button class="btn btn-primary btn-like">
                <font-awesome-icon icon="heart" />
                <span>{{ project.num_likes }}</span>
              </button>
            </div>
          </div>

          <article class="project-article">

            <div class="project-article__imgs">

              <div v-for="image in project.images" :key="image.id"  class="project-article__imgs__row">
                <v-lazy-image :src="serverURL + image.url" :alt="project.title"/>
              </div>

            </div>

            <div class="project-article__overview">

              <div class="project-article__overview__title">
                <h3>Overview</h3>
              </div>

              <div class="project-article__overview__text">
                <p>
                  {{ project.overview }}
                </p>
              </div>

              <div class="separate"></div>

              <div class="project-article__overview__info">
                <small>
                  <font-awesome-icon style="margin-right: 5px" icon="eye" />
                  <span>{{ project.num_views }}</span>
                </small>
                <small>
                  <font-awesome-icon style="margin-right: 5px" icon="heart" />
                  <span>{{ project.num_likes }}</span>
                </small>
                <small>
                  <font-awesome-icon style="margin-right: 5px" icon="tag" />
                  <span>{{ project.project_type }}</span>
                </small>
                <small class="date">
                  <font-awesome-icon style="margin-right: 5px" icon="calendar" />
                  <span>{{ project.created_at | moment("MMM Do YYYY") }}</span>
                </small>
              </div>

            </div>

            <div class="project-article__comments" v-if="!(!loggedIn && !(project.comments).length)">

              <div>
                <h3>
                  {{ (project.comments).length ? `${(project.comments).length} Comments` : `Be the first to comment` }}
                </h3>
              </div>

              <form v-if="loggedIn" action="" class="project-article__comments__field"
                :class="{ '__no-c': (project.comments).length == 0 }">

                <div class="project-article__comments__field__user user-pic svg-larger"
                  :style=" me.picture ? `background: url( ${serverURL}${me.picture.url} );` : '' ">
                  <font-awesome-icon v-if="!me.picture" :icon="['fas','user']" />
                </div>

                <div class="project-article__comments__field__textarea">
                  <textarea type="text"></textarea>
                </div>

              </form>

              <div class="project-article__comment" v-for="comment in sortedComments" :key="comment.id">
                <div class="user">

                  <div class="user__image user-pic svg-larger"
                    :style=" comment.owner.picture ? `background: url( ${serverURL}${comment.owner.picture.url} );` : '' ">
                    <font-awesome-icon v-if="!comment.owner.picture" :icon="['fas','user']" />
                  </div>

                  <div class="user__comment">
                    <div class="user__name">
                      <h3> {{ comment.owner.username }} </h3>
                      <span class="sep">|</span>
                      <small class="date">
                        {{ comment.created_at | moment("from", "now") }}
                      </small>
                    </div>
                    <div class="user__message">
                      <p>
                        {{ comment.text }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </article>

        </template>

      </div>

    </main>

  </div>

</template>

<script>
  import { eventBus } from '../main'
  // Gql
  import Project from '../graphql/Project.gql'
  import VLazyImage from "v-lazy-image";

  export default {

    components: {
      'v-lazy-image' : VLazyImage
    },

    props: ['modal', 'projectId'],

    data() {
      return {
        project: null,
        ifModal: false
      }
    },

    computed: {

      loggedIn() {
        return this.$store.getters.loggedIn
      },

      me() {
        return this.$store.getters.getUser
      },

      sortedComments() {

        const sorted = this.project.comments;

        sorted.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        return sorted;
      }

    },

    mounted() {

      if (this.modal) {
        document.documentElement.style.overflow = 'hidden';
      }

    },

    apollo: {
      project: {
        prefetch: true,
        query: Project,
        variables() {
          return {
            id: this.modal ? this.projectId : this.$route.params.id
          }
        }
      }
    },

    methods: {
      closeModal() {
        eventBus.$emit('closeModalProject', true);
      }
    },

    beforeDestroy() {
      document.documentElement.style.overflow = 'auto';
    }

  }
</script>