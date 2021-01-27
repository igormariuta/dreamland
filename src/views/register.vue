<template>
  <main style="padding: 50px">

    <form @submit.prevent="login">

      <h3>Create an account</h3>

      <div style="margin-bottom: 15px;">
        <input type="text" v-model="username" name="username" placeholder="Username">
      </div>

      <div style="margin-bottom: 15px;">
        <input type="text" v-model="email" name="email" placeholder="Email">
      </div>

      <div style="margin-bottom: 15px;">
        <input type="password" v-model="password" name="password" placeholder="Password">
      </div>

      <div>
        <button type="submit" class="btn btn-primary">Register</button>
      </div>

    </form>

  </main>
</template>

<script>

  import { onLogin } from '../vue-apollo'

  // GQL
  import Register from '../graphql/Register.gql'

  export default {

    data() {
      return {
        username: '',
        email: '',
        password: '',
      }
    },

    methods: {

      login() {
        this.$apollo.mutate({
          mutation: Register,
          variables: {
            input: {
              username: this.username,
              email:    this.email,
              password: this.password.toString()
            }
          }
        }).then((resp) => {

          onLogin(this.$apollo.provider.defaultClient, resp.data.register.jwt);

          this.$store.commit('setToken', resp.data.register.jwt);
          this.$router.push('/');

        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        })
      }

    }

  }
</script>