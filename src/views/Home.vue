<template>
   <div class="content-container">
     <a-row :gutter="16">
      <template-list :list="testData"></template-list>
     </a-row>
     <a-row type="flex" justify="center">
       <a-button
        type="primary"
        size="large"
        @click="loadMorePage"
        v-if="!isLastPage"
        :loading="isLoading"
        >
        加载更多
       </a-button>
     </a-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store/index';
import TemplateList from '../components/TemplateList.vue';
import useLoadMore from '../hooks/useLoadMore';

export default defineComponent({
  components: {
    TemplateList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const testData = computed(() => store.state.templates.data);
    const total = computed(() => store.state.templates.totalTemplates);
    const isLoading = computed(() => store.getters.isOpLoading('fetchTemplates'));
    const { loadMorePage, isLastPage } = useLoadMore('fetchTemplates', total, { pageIndex: 0, pageSize: 4 });
    onMounted(() => {
      store.dispatch('fetchTemplates', { searchParams: { pageIndex: 0, pageSize: 4 } });
      // if (!currentUser.value.isLogin && currentUser.value.token) {
      //   axios.defaults.headers.common.Authorization = `Bearer ${currentUser.value.token}`;
      //   store.dispatch('fetchCurrentUser').catch(() => {
      //     message.error('登陆状态已过期, 请重新登陆', 2);
      //     localStorage.removeItem('token');
      //     delete axios.defaults.headers.common.Authorization;
      //   });
      // }
      window.addEventListener('scroll', (e) => {
        const totalPageHeight = document.body.scrollHeight;
        const scrollPoint = window.scrollY + window.innerHeight;
        if (scrollPoint >= totalPageHeight && !isLastPage.value) {
          console.log('at the bottom');
          loadMorePage();
        }
      });
    });
    return {
      testData,
      isLoading,
      loadMorePage,
      isLastPage,
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
