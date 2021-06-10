<template>
  <div class="homepage-container">
    <a-layout :style="{background: '#fff'}">
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">慕课乐高</router-link>
        </div>
        <div class="right-col">
          <div class="user-operation">
            <a-button type="primary" @click="createDesign">创建设计</a-button>
            <user-profile :user="user"></user-profile>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      © 慕课网（imooc.com）版权所有 | 津ICP备20000929号-2
    </a-layout-footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import useCreateDesign from '@/hooks/useCreateDesign';
import { GlobalDataProps } from '../store/index';
import UserProfile from '../components/UserProfile.vue';

export default defineComponent({
  name: 'Index',
  components: {
    UserProfile,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const user = computed(() => store.state.user);
    const createDesign = useCreateDesign();
    return {
      user,
      createDesign,
    };
  },
});
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  color: #fff;
}
.user-operation{
  display: flex;
  align-items: center;
}
</style>
