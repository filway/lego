import { useStore } from 'vuex';
import { computed } from 'vue';
import { HotkeysEvent, KeyHandler } from 'hotkeys-js';
import { GlobalDataProps } from '../store/index';
import useHotKey from '../hooks/useHotKey';

const wrap = (callback: KeyHandler) => {
  const wrapperFn = (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault();
    callback(e, event);
  };
  return wrapperFn;
};

export default function initHotKeys() {
  const store = useStore<GlobalDataProps>();
  const currentId = computed(() => store.state.editor.currentElement);
  useHotKey('ctrl+c, command+c', () => {
    store.commit('copyComponent', currentId.value);
  });
  useHotKey('ctrl+v, command+v', () => {
    store.commit('pasteCopiedComponent');
  });
  useHotKey('backspace, delete', () => {
    store.commit('deleteComponent', currentId.value);
  });
  useHotKey('esc', () => {
    store.commit('setActive', '');
  });
  useHotKey('up, w', wrap(() => {
    store.commit('moveComponent', { direction: 'Up', amount: 1, id: currentId.value });
  }));
  useHotKey('down, s', wrap(() => {
    store.commit('moveComponent', { direction: 'Down', amount: 1, id: currentId.value });
  }));
  useHotKey('right, d', wrap(() => {
    store.commit('moveComponent', { direction: 'Right', amount: 1, id: currentId.value });
  }));
  useHotKey('left, a', wrap(() => {
    store.commit('moveComponent', { direction: 'Left', amount: 1, id: currentId.value });
  }));
  useHotKey('shift+down, shift+s', () => {
    store.commit('moveComponent', { direction: 'Down', amount: 10, id: currentId.value });
  });
  useHotKey('shift+up, shift+w', () => {
    store.commit('moveComponent', { direction: 'Up', amount: 10, id: currentId.value });
  });
  useHotKey('shift+right, shift+d', () => {
    store.commit('moveComponent', { direction: 'Right', amount: 10, id: currentId.value });
  });
  useHotKey('shift+left, shift+a', () => {
    store.commit('moveComponent', { direction: 'Left', amount: 10, id: currentId.value });
  });
}
