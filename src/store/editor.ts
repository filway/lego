import { Module } from 'vuex';
import { message } from 'ant-design-vue';
import { v4 as uuidv4 } from 'uuid';
import {
  AllComponentProps, textDefaultProps, imageDefaultProps,
} from 'filway-lego-components';
import { cloneDeep } from 'lodash';
import store, { GlobalDataProps } from './index';

type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right';

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的是哪个元素， uuid
  currentElement: string;
  page: PageData;
  copiedComponent?: ComponentData;
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

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      props: pageDefaultProps,
      title: 'test title',
    },
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      component.layerName = `图层${state.components.length + 1}`;
      state.components.push(component);
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId;
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
      }
    },
    deleteComponent(state, id) {
      const currentComponent = store.getters.getElement(id);
      if (currentComponent) {
        state.components = state.components.filter((component) => component.id !== id);
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
    }) {
      const updateComponent = state.components.find(
        (component) => component.id === (id || state.currentElement),
      );
      if (updateComponent) {
        if (isRoot) {
          (updateComponent as any)[key] = value;
        } else {
          updateComponent.props[key as keyof AllComponentProps] = value;
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
  },
};

export default editor;
