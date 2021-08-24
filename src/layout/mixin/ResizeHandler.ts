// import store from '@/store'
import { onBeforeMount, onBeforeUnmount, onMounted, watch } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
function useResizeMixin() {
  const { body } = document;
  const WIDTH = 992; // refer to Bootstrap's responsive design
  const store = useStore();
  const route = useRoute();
  const { sidebar, device } = store.state.app;
  watch(
    () => route,
    () => {
      if (device === "mobile" && sidebar.opened) {
        store.dispatch("app/closeSideBar", { withoutAnimation: false });
      }
    },
  );
  onMounted(() => {
    const isMobile = $_isMobile();
    if (isMobile) {
      store.dispatch("app/toggleDevice", "mobile");
      store.dispatch("app/closeSideBar", { withoutAnimation: true });
    }
  });

  onBeforeMount(() => {
    window.addEventListener("resize", $_resizeHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", $_resizeHandler);
  });

  function $_isMobile() {
    const rect = body.getBoundingClientRect();
    return rect.width - 1 < WIDTH;
  }

  function $_resizeHandler() {
    if (!document.hidden) {
      const isMobile = $_isMobile();
      store.dispatch("app/toggleDevice", isMobile ? "mobile" : "desktop");

      if (isMobile) {
        store.dispatch("app/closeSideBar", { withoutAnimation: true });
      }
    }
  }
}

export { useResizeMixin };
