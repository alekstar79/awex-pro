<template>
  <div class="wrapper">
    <BriefcaseHeader />
    <BriefcaseMain />
  </div>
</template>

<script>
import BriefcaseHeader from "@/components/BriefcaseHeader.vue"
import BriefcaseMain from '@/components/BriefcaseMain.vue'

export default {
  name: 'HomeView',

  components: {
    BriefcaseHeader,
    BriefcaseMain
  }
}
</script>
