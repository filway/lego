<template>
   <div class="content-container">
      <h1 v-if="isLoading">templates is loading</h1>
      <template-list :list="testData"></template-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { GlobalDataProps } from '../store/index';
import TemplateList from '../components/TemplateList.vue';

export default defineComponent({
  components: {
    TemplateList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const testData = computed(() => store.state.templates.data);
    const isLoading = computed(() => store.getters.isOpLoading('fetchTemplates'));
    onMounted(() => {
      store.dispatch('fetchTemplates');
      // if (!currentUser.value.isLogin && currentUser.value.token) {
      //   axios.defaults.headers.common.Authorization = `Bearer ${currentUser.value.token}`;
      //   store.dispatch('fetchCurrentUser').catch(() => {
      //     message.error('登陆状态已过期, 请重新登陆', 2);
      //     localStorage.removeItem('token');
      //     delete axios.defaults.headers.common.Authorization;
      //   });
      // }
    });
    return {
      testData,
      isLoading,
    };
  },
});
</script>

<style>
.page-title {
  color: #fff;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>
