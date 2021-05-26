import { Module } from 'vuex';
import { message } from 'ant-design-vue';
import { v4 as uuidv4 } from 'uuid';
import {
  AllComponentProps, textDefaultProps, imageDefaultProps,
} from 'filway-lego-components';
import { cloneDeep } from 'lodash';
import { inserAt } from '@/helper';
import store, { GlobalDataProps } from './index';

type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right';

export interface HistoryProps {
  id: string;
  componentId: string;
  type: 'add' | 'delete' | 'modify';
  data: any;
  index?: number;
}
export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>;
  value: string | string[];
  id: string;
  isRoot?: boolean;
}
export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的是哪个元素， uuid
  currentElement: string;
  page: PageData;
  copiedComponent?: ComponentData;
  histories: HistoryProps[];
  historyIndex: number;
  cachedOldValues: any;
  maxHistoryNumber: number;
}
export interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}
export type AllFormProps = PageProps & AllComponentProps
export interface PageData {
  props: PageProps;
  title: string;
}

export interface ComponentData {
  // 元素的属性，属性详情见下面
  props: Partial<AllComponentProps>;
  // uuid v4
  id: string;
   // 业务组件库名称 l-text，l-image 等等
   name: 'l-text' | 'l-image' | 'l-shape';
   // 图层是否隐藏
   isHidden?: boolean;
   // 图层是否锁定
   isLocked?: boolean;
   // 图层名称
   layerName?: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    layerName: '图层1',
    props: {
      ...textDefaultProps, text: 'hello', fontSize: '20px', color: '#000000', lineHeight: '1', textAlign: 'left', fontFamily: '', height: '100px', width: '100px',
    },
  },
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   layerName: '图层2',
  //   props: {
  //     ...textDefaultProps, text: 'hello2', fontSize: '10px', fontWeight: 'bold', lineHeight: '2', textAlign: 'left', fontFamily: '',
  //   },
  // },
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   layerName: '图层3',
  //   props: {
  //     ...textDefaultProps, text: 'hello3', fontSize: '15px', actionType: '', url: 'https://www.baidu.com', lineHeight: '3', textAlign: 'left', fontFamily: '',
  //   },
  // },
  // {
  //   id: uuidv4(), name: 'l-image', layerName: '图层4', props: { ...imageDefaultProps, src: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f3e3a17c305b1070f455202.jpg', width: '100px' },
  // },
];

const pageDefaultProps = {
  backgroundColor: '#ffffff', backgroundImage: '', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '560px',
};

const modifyHistory = (state: EditorProps, history: HistoryProps, type: 'undo' | 'redo') => {
  const { componentId, data } = history;
  const { key, oldValue, newValue } = data;
  const newKey = key as keyof AllComponentProps | Array<keyof AllComponentProps>;
  const updatedComponent = state.components.find((component) => component.id === componentId);
  if (updatedComponent) {
    // check if key is array
    if (Array.isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        updatedComponent.props[keyName] = type === 'undo' ? oldValue[index] : newValue[index];
      });
    } else {
      updatedComponent.props[newKey] = type === 'undo' ? oldValue : newValue;
    }
  }
};
const debounceChange = (callback: (...args: any) => void, timeout = 1000) => {
  let timer = 0;
  return (...args: any) => {
    console.log(timer);
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};
const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  // check historyIndex is already moved
  if (state.historyIndex !== -1) {
    // if moved, delete all the records greater than the index
    state.histories = state.histories.slice(0, state.historyIndex);
    // move historyIndex to unmoved
    state.historyIndex = -1;
  }
  // check length
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord);
  } else {
    // larger than max number
    // shift the first
    // push to last
    state.histories.shift();
    state.histories.push(historyRecord);
  }
};
const pushModifyHistory = (state: EditorProps, { key, value, id }: UpdateComponentData, oldValue: any) => {
  pushHistory(state, {
    id: uuidv4(),
    componentId: (id || state.currentElement),
    type: 'modify',
    data: { oldValue: state.cachedOldValues, newValue: value, key },
  });
  state.cachedOldValues = null;
};
const pushHistoryDebounce = debounceChange(pushModifyHistory);
const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      props: pageDefaultProps,
      title: 'test title',
    },
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 5,
  },
  mutations: {
    resetEditor(state) {
      state.components = [];
      state.currentElement = '';
      state.historyIndex = -1;
      state.histories = [];
    },
    addComponent(state, component: ComponentData) {
      component.layerName = `图层${state.components.length + 1}`;
      state.components.push(component);
      pushHistory(state, {
        id: uuidv4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component),
      });
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId;
    },
    undo(state) {
      // never undo before
      if (state.historyIndex === -1) {
        // undo the last item of the array
        state.historyIndex = state.histories.length - 1;
      } else {
        // undo to the previous step
        state.historyIndex -= 1;
      }
      // get the history record
      const history = state.histories[state.historyIndex];
      switch (history.type) {
        case 'add':
          // if create a component, we should remove it
          state.components = state.components.filter((component) => component.id !== history.componentId);
          break;
        case 'delete':
          // if delete a componet, we should restore it to the right position
          state.components = inserAt(state.components, history.index as number, history.data);
          break;
        case 'modify': {
          // get the modified component by id, restore to the old value
          modifyHistory(state, history, 'undo');
          break;
        }
        default:
          break;
      }
    },
    redo(state) {
      // can't redo when historyIndex is the last item or historyIndex is never moved
      if (state.historyIndex === -1) {
        return;
      }
      // get the record
      const history = state.histories[state.historyIndex];
      // process the history data
      switch (history.type) {
        case 'add':
          state.components.push(history.data);
          // state.components = insertAt(state.components, history.index as number, history.data)
          break;
        case 'delete':
          state.components = state.components.filter((component) => component.id !== history.componentId);
          break;
        case 'modify': {
          modifyHistory(state, history, 'redo');
          break;
        }
        default:
          break;
      }
      state.historyIndex += 1;
    },
    copyComponent(state, id) {
      const currentComponent = store.getters.getElement(id);
      if (currentComponent) {
        state.copiedComponent = currentComponent;
        message.success('已拷贝当前图层', 1);
      }
    },
    pasteCopiedComponent(state) {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent);
        clone.id = uuidv4();
        clone.layerName += '副本';
        state.components.push(clone);
        message.success('已粘贴当前图层', 1);
        pushHistory(state, {
          id: uuidv4(),
          componentId: clone.id,
          type: 'add',
          data: cloneDeep(clone),
        });
      }
    },
    deleteComponent(state, id) {
      const currentComponent = store.getters.getElement(id);
      if (currentComponent) {
        const currentIndex = state.components.findIndex((component) => component.id === id);
        state.components = state.components.filter((component) => component.id !== id);
        pushHistory(state, {
          id: uuidv4(),
          componentId: currentComponent.id,
          type: 'delete',
          data: currentComponent,
          index: currentIndex,
        });
        message.success('已删除当前图层', 1);
      }
    },
    moveComponent(state, data: { direction: MoveDirection; amount: number; id: string}) {
      const currentComponent = store.getters.getElement(data.id);
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0', 0);
        const oldLeft = parseInt(currentComponent.props.left || '0', 0);
        const { direction, amount } = data;
        switch (direction) {
          case 'Up': {
            const newValue = `${oldTop - amount}px`;
            store.commit('updateComponent', { key: 'top', value: newValue, id: data.id });
            break;
          }
          case 'Down': {
            const newValue = `${oldTop + amount}px`;
            store.commit('updateComponent', { key: 'top', value: newValue, id: data.id });
            break;
          }
          case 'Left': {
            const newValue = `${oldLeft - amount}px`;
            store.commit('updateComponent', { key: 'left', value: newValue, id: data.id });
            break;
          }
          case 'Right': {
            const newValue = `${oldLeft + amount}px`;
            store.commit('updateComponent', { key: 'left', value: newValue, id: data.id });
            break;
          }
          default:
            break;
        }
      }
    },
    updateComponent(state, {
      key, value, id, isRoot,
    }: UpdateComponentData) {
      const updateComponent = state.components.find(
        (component) => component.id === (id || state.currentElement),
      );
      if (updateComponent) {
        if (isRoot) {
          (updateComponent as any)[key as string] = value;
        } else {
          const oldValue = Array.isArray(key) ? key.map((key) => updateComponent.props[key]) : updateComponent.props[key];
          if (!state.cachedOldValues) {
            state.cachedOldValues = oldValue;
          }
          pushHistoryDebounce(state, { key, value, id }, oldValue);
          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              updateComponent.props[keyName] = value[index];
            });
          } else if (typeof key === 'string' && typeof value === 'string') {
            updateComponent.props[key] = value;
          }
        }
      }
    },
    updatePage(state, { key, value }) {
      state.page.props[key as keyof PageProps] = value;
    },
  },
  getters: {
    getCurrentElement: (state) => state.components.find(
      (component) => component.id === state.currentElement,
    ),
    getElement: (state) => (id: string) => state.components.find(
      (component) => component.id === (id || state.currentElement),
    ),
    getComponentsLength: (state) => state.components.length,
    checkUndoDisable: (state) => {
      // 1 no history item
      // 2 move to the first item
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true;
      }
      return false;
    },
    checkRedoDisable: (state) => {
      // 1 no history item
      // 2 move to the last item
      // 3 never undo before
      if (state.histories.length === 0
        || state.historyIndex === state.histories.length
        || state.historyIndex === -1) {
        return true;
      }
      return false;
    },
  },
};

export default editor;
