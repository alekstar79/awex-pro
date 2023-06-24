<template>
  <section class="briefcase">
    <div class="briefcase__container">
      <div class="briefcase-authform">
        <form action="/b2api/user/auth" method="POST">
          <div class="form form__line">
            <div class="form__line-box line-box">
              <label class="line-box__label form__label">
                Ваш e-mail или логин
              </label>
            </div>

            <div class="form__input-box input-box item-props zero-paddings">
              <input
                v-model.trim="login"
                class="form__input input"
                placeholder="Ваш e-mail или логин"
                autocomplete="off"
                type="text"
              >
            </div>
          </div>

          <div class="form form__line">
            <div class="form__line-box line-box">
              <label class="line-box__label form__label">
                Ваш пароль
              </label>
            </div>

            <div class="form__input-box input-box item-props zero-paddings">
              <input
                v-model.trim="pass"
                class="form__input input"
                placeholder="Ваш пароль"
                autocomplete="off"
                type="password"
              >
            </div>
          </div>

          <div class="form__line">
            <button
              @click="loginHandler"
              class="button pointer unselectable form__button"
              :class="{ grey: !available }"
              :disabled="!available"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>

    <SidePanel v-model="openPanel" #default="{}">
      <h3 class="side-title">
        Требуется проверка 2-го фактора
      </h3>

      <div class="form form__line">
        <div class="form__line-box line-box">
          <label class="line-box__label form__label">
            Google 2FA, проверочный код
          </label>
        </div>

        <div class="form__input-box input-box item-props">
          <input
            v-model.trim="g2fa"
            class="form__input input"
            placeholder="Не заполнено"
            autocomplete="off"
            type="text"
          >
        </div>
      </div>

      <div class="form__line">
        <button
          class="button pointer unselectable form__button"
          :class="{ grey: g2fa.length < 6 }"
          :disabled="g2fa.length < 6"
          @click="loginHandler"
        >
          Проверить
        </button>
      </div>

      <div class="form__line">
        <button
          class="button pointer unselectable form__button"
          @click="openPanel = false"
        >
          Haзад
        </button>
      </div>
    </SidePanel>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import SidePanel from '@/components/SidePanel.vue'

import {

  USER_LOGIN_ACTION,
  SET_LOGIN_MUTATION,
  SET_PASS_MUTATION,
  SET_G2FA_MUTATION

} from '@/store/types'

export default {
  name: 'BriefcaseAuth',

  components: {
    SidePanel
  },
  data: () => ({
    openPanel: false
  }),
  computed: {
    error() {
      return this.$store.state.error
    },
    available() {
      if (!this.login || !this.pass) return false

      return !(this.login.length < 7 || this.pass.length < 6);
    },
    login: {
      set(value)
      {
        this.$store.commit(SET_LOGIN_MUTATION, value)
      },
      get()
      {
        return this.$store.getters.login
      }
    },
    pass: {
      set(value)
      {
        this.$store.commit(SET_PASS_MUTATION, value)
      },
      get()
      {
        return this.$store.getters.pass
      }
    },
    g2fa: {
      set(value)
      {
        this.$store.commit(SET_G2FA_MUTATION, value)
      },
      get()
      {
        return this.$store.state.g2fa
      }
    }
  },
  watch: {
    error(value) {
      this.$bus.$emit('show:snack', value)
    }
  },
  methods: {
    ...mapActions([USER_LOGIN_ACTION]),

    async loginHandler(e)
    {
      e.preventDefault()

      if (await this[USER_LOGIN_ACTION]()) {
        return await this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.briefcase {
  width: 100%;

  .unselectable {
    user-select: none;
  }
  .pointer {
    cursor: pointer;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;

    width: clamp(200px, 100%, 540px);
  }
  .form {
    .line-box__label {
      padding-left: 20px;
    }

    &__line {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    &__input-box {
      display: block;
      height: 49px;
      padding: 5px;
      border-radius: 55px;
      border: 2px solid #105;
    }
    &__input {
      width: 100%;
      height: 100%;
      font-size: 18px;
      padding: 5px 5px 5px 20px;
      border-radius: 55px;
      border: none;
      outline: none;
    }
    &__button {
      display: block;
      padding: 10px 20px;

      border-radius: 35px;
      background: #2CA3DF;
      color: #FFF;
      line-height: 120%;
      font-size: 22px;

      &.grey {
        color: #105;
        background-color: rgba(209,209,209,.2);
        pointer-events: none;
      }
    }
  }
  .side-title {
    padding-bottom: 10px;
    margin-bottom: 20px;

    font-weight: 600;
    font-size: 1.5rem;
    line-height: 120%;
  }
}
</style>
