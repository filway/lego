<template>
  <div class="props-table">
    <div
      v-for="(value, key) in finalProps"
      :key="key"
      :class="{'no-text': !value.text}"
      class="prop-item"
      :id="`item-${key}`"
    >
      <span class="label" v-if="value.text">{{value.text}}</span>
      <div class="prop-component">
        <component
          :is="value.component"
          :[value.valueProp]="value.value"
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <template v-if="value.options">
            <component
              :is="value.subComponent"
              v-for="(option, k) in value.options"
              :key="k"
              :value="option.value"
            >
              <render-vnode :vNode="option.text"></render-vnode>
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, VNode,
} from 'vue';
import { reduce } from 'lodash-es';
import { TextComponentProps } from '../defaultProps';
import { mapPropsToForms } from '../propsMap';
import RenderVnode from '../components/RenderVnode';
import ColorPicker from './ColorPicker.vue';
import IconSwitch from './IconSwitch.vue';
import ImageProcesser from './ImageProcesser.vue';
import ShadowPicker from './ShadowPicker.vue';
import BackgroundProcesser from './BackgroundProcesser.vue';

interface FormProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: { [key: string]: any};
  text?: string;
  options?: { text: string | VNode; value: any}[];
  valueProp: string;
  eventName: string;
  events: { [key: string]: (e: any) => void};
}

export default defineComponent({
  name: 'props-table',
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
    },
  },
  components: {
    RenderVnode,
    ColorPicker,
    IconSwitch,
    ImageProcesser,
    ShadowPicker,
    BackgroundProcesser,
  },
  emits: ['change'],
  setup(props, context) {
    const finalProps = computed(() => reduce(props.props, (result, value, key) => {
      const newKey = key as keyof TextComponentProps;
      const item = mapPropsToForms[newKey];
      if (item) {
        const {
          valueProp = 'value', eventName = 'change', initalTransform, afterTransform,
        } = item;
        const newItem: FormProps = {
          ...item,
          value: initalTransform ? initalTransform(value) : value,
          valueProp,
          eventName,
          events: {
            [eventName]: (e: any) => {
              context.emit('change', { key, value: afterTransform ? afterTransform(e) : e });
            },
          },
        };
        result[newKey] = newItem;
      }
      return result;
    }, {} as { [key: string]: FormProps}));
    return {
      finalProps,
    };
  },
});

</script>
<style>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  width: 28%;
}
.prop-component {
  width: 70%;
}
.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 10px 0;
}
#item-fontWeight {
  margin-left: 28%;
}
</style>
