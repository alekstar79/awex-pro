<template>
  <div class="wrapper">
    <BriefcaseHeader />
    <BriefcaseAuth />
  </div>
</template>

<script>
import BriefcaseHeader from '@/components/BriefcaseHeader.vue'
import BriefcaseAuth from '@/components/BriefcaseAuth.vue'

export default {
  name: 'AuthView',

  components: {
    BriefcaseHeader,
    BriefcaseAuth
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.getters.token && to.path === '/auth') {
        vm.$router.push('/')
      }
    })
  }
}
</script>
