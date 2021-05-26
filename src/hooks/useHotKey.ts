import hotkeys, { KeyHandler } from 'hotkeys-js';
import { onMounted, onUnmounted } from 'vue';

const useHotKey = (keys: string, callback: KeyHandler): void => {
  onMounted(() => {
    hotkeys(keys, callback);
  });
  onUnmounted(() => {
    hotkeys.unbind(keys, callback);
  });
};

export default useHotKey;
