<template>
  <section class="briefcase">
    <div class="briefcase__container">
      <div class="briefcase-table">
        <div class="briefcase-table__header">
          <div class="briefcase-table__title">Криптовалюта</div>
          <div class="briefcase-table__title">Количество</div>
        </div>

        <div
          @click="toggleMode(i)"
          v-for="(crypto, i) in list"
          class="briefcase-table__wrapper"
          :class="{ active: crypto.active }"
          :key="i"
        >
          <div class="briefcase-table__row">
            <div class="briefcase-table__col name">
              <img
                :src="`https://awex.pro/b2cached/icon/64/${crypto.asset}.png`"
                class="briefcase-table__icon"
                alt=""
              >

              <div class="briefcase-table__name">
                <div class="briefcase-table__coin">{{ crypto.name }}</div>
                <span>{{ crypto.asset }}</span>
              </div>
            </div>

            <div class="briefcase-table__col change">
              <div class="briefcase-table__change">{{ crypto.graphChange }}</div>
            </div>

            <div class="briefcase-table__col currency">
              <div class="briefcase-table__currency">{{ convert(crypto.balance, 8) }}</div>
              <small class="text-table">
                <span>~{{ convert(crypto.summ, 2) }}&nbsp;{{ relativeCurrency }}</span>
              </small>
            </div>
          </div>

          <div class="briefcase-table__actions unselected">
            <a
              @click.stop="acceptTransfer(i)"
              class="actions-box__item pointer"
              type="button"
            >
              <img
                src="https://awex.pro/site/static/img/icons/netin.svg"
                class="briefcase-icon"
                alt=""
              >
              Принять перевод
            </a>

            <a
              @click.stop="sendTransfer(i)"
              class="actions-box__item pointer"
              type="button"
            >
              <img
                src="https://awex.pro/site/static/img/icons/netout.svg"
                class="briefcase-icon"
                alt=""
              >
              Отправить перевод
            </a>
          </div>
        </div>
      </div>

      <SidePanel v-model="acceptTransferPanel" #default="{}">
        <h3 class="side-title">
          Получить перевод {{ currentAcceptTransfer.name }} ({{ currentAcceptTransfer.asset }})
        </h3>

        <div class="form form__line">
          <div class="form__line-box line-box">
            <label class="line-box__label form__label">
              Назовите пользователю код ниже
            </label>
          </div>

          <div class="form__input-box input-box item-props">
            <input
              :value="acceptTransferCode"
              class="form__input input"
              autocomplete="off"
              type="text"
              readonly
            >
          </div>
        </div>

        <div class="form form__line">
          <div v-if="acceptTransferCode" class="authenticator-img">
            <img :src="`https://awex.pro/b2api/qr/gen?data=${acceptTransferCode}`" alt="">
          </div>
        </div>
      </SidePanel>

      <SidePanel v-model="sendTransferPanel" #default="{}">
        <h3 class="side-title">
          Отправить перевод {{ currentSendTransfer.name }} ({{ currentSendTransfer.asset }})
        </h3>

        <div class="form form__line">
          <div class="form__line-box line-box">
            <label class="line-box__label form__label">
              Код пользователя
            </label>
          </div>

          <div
            :class="{ green: transferCodeGreen, red: transferCodeRed }"
            class="form__input-box input-box"
          >
            <input
              v-model.trim="sendTransferCode"
              class="form__input input"
              placeholder="Не заполнено"
              autocomplete="off"
              type="text"
            >
          </div>
        </div>

        <div class="form form__line">
          <div class="form__line-box line-box">
            <label class="line-box__label form__label">
              Количество
            </label>
          </div>

          <div
            :class="{ green: transferAmountGreen, red: transferAmountRed }"
            class="form__input-box input-box"
          >
            <input
              :value="sendTransferAmount"
              @input="onInput($event)"
              class="form__input input"
              autocomplete="off"
              type="text"
            >
          </div>
        </div>

        <div class="form form__line">
          <div class="form__line-box line-box">
            <label class="line-box__label form__label">
              Код 2FA
            </label>
          </div>

          <div
            :class="{ green: transfer2FAGreen, red: transfer2FARed }"
            class="form__input-box input-box"
          >
            <input
              v-model.trim="sendTransfer2FA"
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
            @click="$bus.$emit('send:transfer')"
            :class="{ grey: !available }"
            :disabled="!available"
          >
            Провести без комиссии
          </button>
        </div>
      </SidePanel>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { convert } from '@/utils'

import SidePanel from '@/components/SidePanel.vue'

import {

  FETCH_LIST_ACTION,
  USER_INFO_ACTION,
  USER_TRANSFER_ACTION,

  SET_LIST_MUTATION,
  SET_MUTATION

} from '@/store/types'

export default {
  name: 'BriefcaseMain',

  components: {
    SidePanel
  },
  data: () => ({
    currentAcceptTransfer: {},
    currentSendTransfer: {},

    acceptTransferPanel: false,
    sendTransferPanel: false,

    transferAmountGreen: true,
    transferAmountRed: false,

    validators: []
  }),
  computed: {
    error() {
      return this.$store.state.error
    },
    relativeCurrency() {
      return this.$store.getters.relativeCurrency
    },
    acceptTransferCode() {
      return this.$store.state.acceptTransferCode
    },
    available() {
      return this.transferCodeGreen && this.transfer2FAGreen && this.transferAmountGreen
    },
    transferCodeError() {
      const code = this.sendTransferCode

      if (code === null || code === '') return false

      return !!code && (code.length !== 8 || !/\d{3}[a-zA-Z]{2}\d{3}/i.test(code))
    },
    transfer2FAError() {
      const G2FA = this.sendTransfer2FA

      if (G2FA === null || G2FA === '') return false

      return !!G2FA && (G2FA.length !== 6 || isNaN(Number(G2FA)))
    },
    transferCodeRed() {
      const code = this.sendTransferCode

      if (code === null || code === '') return false

      return this.transferCodeError
    },
    transfer2FARed() {
      const G2FA = this.sendTransfer2FA

      if (G2FA === null || G2FA === '') return false

      return this.transfer2FAError
    },
    transferCodeGreen() {
      const code = this.sendTransferCode

      if (code === null || code === '') return false

      return !this.transferCodeError
    },
    transfer2FAGreen() {
      const G2FA = this.sendTransfer2FA

      if (G2FA === null || G2FA === '') return false

      return !this.transfer2FAError
    },
    sendTransferCode: {
      set(sendTransferCode) {
        this.$store.commit(SET_MUTATION, { sendTransferCode })
      },
      get() {
        return this.$store.state.sendTransferCode
      }
    },
    sendTransferAmount: {
      set(sendTransferAmount) {
        this.$store.commit(SET_MUTATION, { sendTransferAmount })
      },
      get() {
        return this.$store.state.sendTransferAmount
      }
    },
    sendTransfer2FA: {
      set(sendTransfer2FA) {
        this.$store.commit(SET_MUTATION, { sendTransfer2FA })
      },
      get() {
        return this.$store.state.sendTransfer2FA
      }
    },
    list: {
      set(list) {
        this.$store.commit(SET_LIST_MUTATION, list)
      },
      get() {
        return this.$store.state.list
      }
    }
  },
  watch: {
    error(value) {
      this.$bus.$emit('show:snack', value)
    }
  },
  methods: {
    ...mapActions([USER_INFO_ACTION, USER_TRANSFER_ACTION, FETCH_LIST_ACTION]),

    convert,

    toggleMode(idx)
    {
      let list = [...this.list]

      if (list[idx].active) {
        list[idx].active = false
      } else {
        list = list.map((a, i) => ({ ...a, active: idx === i }))
      }

      this.list = list
    },
    async acceptTransfer(idx)
    {
      this.currentAcceptTransfer = this.list[idx]

      await this[USER_INFO_ACTION]()

      this.acceptTransferPanel = true
    },
    async sendTransfer(idx)
    {
      this.currentSendTransfer = this.list[idx]

      const { asset, balance } = this.currentSendTransfer

      this.sendTransferAmount = balance
      this.sendTransferPanel = true

      // wait until the user clicks the transfer button
      this.$bus.$once('send:transfer', () => {
        this[USER_TRANSFER_ACTION](asset)
      })
    },
    onInput({ target })
    {
      if (Number.isNaN(Number(target.value))) {
        target.value = target.value.toString().slice(0, target.value.length - 1)
        return
      }

      const targetValue = this.$bigDecimal(target.value)
      const currentValue = this.$bigDecimal(this.currentSendTransfer.balance)
      const nullValue = this.$bigDecimal(0)

      const compare = targetValue.compareTo(nullValue)

      if (compare <= 0) {
        this.transferAmountGreen = false
        this.transferAmountRed = true
      } else {
        this.transferAmountGreen = true
        this.transferAmountRed = false
      }
      if (targetValue.compareTo(currentValue) > 0) {
        target.value = this.currentSendTransfer.balance
      }

      this.sendTransferAmount = this.convert(target.value, 8)
    }
  },
  beforeDestroy()
  {
    this.$bus.$off('send:transfer')
  },
  async created()
  {
    await this[FETCH_LIST_ACTION]()
  }
}
</script>

<style lang="scss" scoped>
.briefcase {
  min-width: 350px;
  width: 100%;

  .briefcase-table {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: .0625rem solid #d1d1d1;
      padding-bottom: .3125rem;
      margin-bottom: .625rem;
    }
    &__wrapper {
      display: flex;
      padding: 20px 50px;
      flex-direction: column;
      align-items: center;

      border-radius: 55px;
      background: rgba(44, 163, 223, .10);
      cursor: pointer;

      &.active .briefcase-table__actions {
        visibility: visible;
        height: 100%;
      }
    }
    &__row {
      display: grid;
      grid-template-columns: 1fr 0.125rem 20%;
      gap: 0.5rem;
      align-items: center;
      justify-items: center;
      border-radius: 0.9375rem;
      pointer-events: auto;
      overflow: hidden;
      width: 100%;
    }
    &__col.name {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__name {
      margin-left: 10px;
    }
    &__col.currency {
      text-align: end;
      font-size: 24px;

      small {
        font-size: 20px;
        color: #6F6F6F;
      }
    }
    &__col:first-child {
      justify-self: start;
    }
    &__col:nth-child(2) {
      justify-self: end;
    }
    &__col:last-child {
      justify-self: end;
    }
    &__actions {
      display: flex;
      justify-content: space-around;
      align-items: center;

      transition: all .2s;

      visibility: hidden;
      margin-top: -7px;
      width: 263px;
      height: 10px;
    }

    .actions-box__item {
      display: flex;
      flex-direction: column;
      align-items: center;

      width: 80px;
      height: 70px;

      text-align: center;
      color: #105;
    }
  }
  .form {
    .line-box__label {
      padding-left: 20px;
    }

    &__line {
      display: flex;
      flex-direction: column;
      gap: 5px;

      color: #6F6F6F;

      img {
        border: 3px solid #6F6F6F;
        border-radius: 55px;
      }
    }
    &__input-box {
      display: block;
      height: 49px;
      padding: 5px;
      border-radius: 55px;
      border: 2px solid #105;

      &.green {
        border-color: #39aa39;
      }
      &.red {
        border-color: #ca3a3a;
      }
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
      cursor: pointer;

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
