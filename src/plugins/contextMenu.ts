import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import createContextMenu, { ActionItem } from '../components/createContextMenu';

const initContextMenu = () => {
  const store = useStore();
  const testActions: ActionItem[] = [
    { shortcut: 'Backspace / Delete', text: '删除图层', action: (cid) => { store.commit('deleteComponent', cid); } },
  ];

  let destory: any;
  onMounted(() => {
    destory = createContextMenu(testActions);
  });
  onUnmounted(() => {
    destory();
  });
};

export default initContextMenu;
