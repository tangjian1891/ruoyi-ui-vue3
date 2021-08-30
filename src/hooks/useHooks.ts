import { reactive, Ref, ref, toRefs } from "@vue/reactivity";

/**
 * 自定义切割页面loading区域
 * 动态传递决定loading区域
 * @returns
 */
export const useLoading = () => {
  const data = reactive({
    loading: false, //主屏内容，主要为表格区域
    btnLoading: false, //按钮loading
  });

  // 开启loading，默认全开启,支持单个开启
  const openLoading = (...args: Ref[]) => {
    if (args.length === 0) {
      for (const key in data) {
        data[key] = true;
      }
      data.loading = data.btnLoading = true;
    } else {
      args.forEach(item => (item.value = true));
    }
  };

  // 关闭loading，默认全关闭，支持单个关闭
  const closeLoading = (...args: Ref[]) => {
    if (args.length === 0) {
      for (const key in data) {
        data[key] = false;
      }
    } else {
      args.forEach(item => (item.value = false));
    }
  };
  // 暴露出去的为ref
  return { ...toRefs(data), openLoading, closeLoading };
};
