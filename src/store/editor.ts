import { Module } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import { TextComponentProps } from '@/defaultProps';
import { GlobalDataProps } from './index';

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的是哪个元素， uuid
  currentElement: string;
}

export interface ComponentData {
  // 元素的属性，属性详情见下面
  props: Partial<TextComponentProps>;
  // uuid v4
  id: string;
  name: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'hello', fontSize: '20px', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none', color: 'red', lineHeight: '1', textAlign: 'left', fontFamily: '',
    },
  },
  { id: uuidv4(), name: 'l-text', props: { text: 'hello2', fontSize: '10px', color: 'blue' } },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'hello3', fontSize: '15x', color: 'purple', actionType: 'url', url: 'https://www.baidu.com',
    },
  },
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
  },
  mutations: {
    addComponent(state, props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: 'l-text',
        props,
      };
      state.components.push(newComponent);
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId;
    },
    updateComponent(state, { key, value }) {
      const updateComponent = state.components.find(
        (component) => component.id === state.currentElement,
      );
      if (updateComponent) {
        updateComponent.props[key as keyof TextComponentProps] = value;
      }
    },
  },
  getters: {
    getCurrentElement: (state) => state.components.find(
      (component) => component.id === state.currentElement,
    ),
  },
};

export default editor;
