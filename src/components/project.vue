<template>

  <div>

    <div class="project__wrap">
      <div class="project__img">
        <v-lazy-image :src="serverURL + project.preview.url" :alt="project.title" />
        <div class="project__img__title">
          <span>{{ project.title }}</span>
        </div>
        <router-link :to="{ name: 'project', params: { id: project.id }}" class="project__img__link"></router-link>
      </div>
    </div>

    <div class="project__desc">
      <router-link :to="{ name: 'profile', params: { id: project.owner.id }}" class="project__desc__user">
        <div class="image user-pic"
          :style="project.owner.picture ? `background: url( ${serverURL}${project.owner.picture.url} );` : '' ">
          <font-awesome-icon v-if="!project.owner.picture" :icon="['fas','user']" />
        </div>
        <div class="name">{{ project.owner.username }}</div>
      </router-link>
      <div class="project__desc__info">
        <div class="item">
          <font-awesome-icon icon="eye" />
          <small>{{ numSpaces(project.num_views) }}</small>
        </div>
        <div class="item">
          <font-awesome-icon icon="heart" />
          <small>{{ numSpaces(project.num_likes) }}</small>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

  import VLazyImage from "v-lazy-image";

  export default {

    components: {
      'v-lazy-image' : VLazyImage
    },

    props: ['project'],

    data() {
      return {}
    },

    methods: {

      numSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      },

    }

  }
</script>