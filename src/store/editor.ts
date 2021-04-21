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

interface ComponentData {
  // 元素的属性，属性详情见下面
  props: { [key: string]: any};
  // uuid v4
  id: string;
  name: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'hello', fontSize: '20px', color: 'red',
    },
  },
  { id: uuidv4(), name: 'l-text', props: { text: 'hello2', fontSize: '10px', color: 'blue' } },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'hello3', fontSize: '15x', color: 'purple', actionType: 'url', url: 'https://www.baidu.com', tag: 'a',
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
  },
};

export default editor;
