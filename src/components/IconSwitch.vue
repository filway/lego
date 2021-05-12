<template>
  <div class="icon-template" @click.prevent="handleClick">
     <a-tooltip placement="top" :title="tip">
       <a-button :type="checked ? 'primary' : 'default'" shape="circle">
        {{iconName}}
      </a-button>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    iconName: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const handleClick = () => {
      context.emit('change', !props.checked);
    };
    return {
      handleClick,
    };
  },
});
</script>

<style>
.icon-template{
  display: inline-block;
}
</style>
