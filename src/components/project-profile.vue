<template>

  <div>

    <div class="project__wrap">
      <div class="project__img">
        <v-lazy-image :src="serverURL + project.preview.url" :alt="project.title" />
        <div class="project__img__title __info">
          <span> {{ project.title }} </span>
          <div class="project__img__title__info">
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
        <router-link :to="{ name: 'project', params: { id: project.id }}" class="project__img__link"></router-link>
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
      }
    }

  }
</script>