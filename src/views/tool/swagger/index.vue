<template>
  <i-frame :src="url" />
</template>
<script lang="ts">
import iFrame from "@/components/iFrame/index.vue";
export default {
  name: "Swagger",
  components: { iFrame },
  data() {
    return {
      url: process.env.VUE_APP_BASE_API + "/doc.html"
    };
  },
};
</script>
