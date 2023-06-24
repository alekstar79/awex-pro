<template>
  <header class="header">
    <div class="header__navigation">
      <nav class="header__actions">
        <div class="actions-header__logo">
          <router-link to="/" v-slot="{ navigate }" custom>
            <button @click="navigate" @keypress.enter="navigate" role="link">
              Pay
            </button>
          </router-link>
        </div>

        <div class="actions-header__auth">
          <button @click="logInOut" role="link">
            {{ headerBtnTitle }}
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import { USER_LOGOUT_ACTION } from '@/store/types'

export default {
  name: 'BriefcaseHeader',

  computed: {
    headerBtnTitle() {
      return this.$store.getters.token ? 'Выйти' : 'Войти'
    }
  },
  methods: {
    ...mapActions([USER_LOGOUT_ACTION]),

    async logInOut()
    {
      const redirect = this.$route.path === '/'

      if ((!this.$store.getters.token || await this[USER_LOGOUT_ACTION]()) && redirect) {
        await this.$router.push('/auth')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  background-color: #FFF;

  &__navigation {
    margin: 0 -10px;

    nav {
      display: flex;
      justify-content: space-between;

      padding: 17px 50px;
      background-color: #fff;

      button {
        display: flex;
        padding: 10px 20px;
        justify-content: center;

        border-radius: 35px;
        line-height: 120%;
        font-size: 22px;
        cursor: pointer;
      }

      .actions-header__logo button {
        border: 3px solid #2CA3DF;
        background: #FFF;
        color: #2CA3DF;
      }
      .actions-header__auth button {
        background: #2CA3DF;
        color: #FFF;
      }
    }
  }
}
</style>
