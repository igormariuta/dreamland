<template>
  <main style="padding: 50px">

    <form @submit.prevent="login">

      <h3>Sign In</h3>

      <div style="margin-bottom: 15px;">
        <input type="text" v-model="email" name="email" placeholder="Email">
      </div>

      <div style="margin-bottom: 15px;">
        <input type="password" v-model="password" name="password" placeholder="Password">
      </div>

      <div>
        <button type="submit" class="btn btn-primary">Sign In</button>
      </div>

      <br>

      <div>
        <small>
          <p>Not a member? <router-link to="/register" class="link"> Create an account </router-link> </p>
        </small>
      </div>

    </form>

  </main>
</template>

<script>

  import { onLogin } from '../vue-apollo'
  // GQL
  import Login from '../graphql/Login.gql'

  export default {

    data() {
      return {
        email: '',
        password: ''
      }
    },

    methods: {

      login() {
        this.$apollo.mutate({
          mutation: Login,
          variables: {
            input: {
              identifier: this.email,
              password: this.password.toString()
            }
          }
        }).then((resp) => {

          onLogin(this.$apollo.provider.defaultClient, resp.data.login.jwt);
          
          this.$store.commit('setToken', resp.data.login.jwt);
          this.$router.push('/');

        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        })
      }

    }

  }
</script>