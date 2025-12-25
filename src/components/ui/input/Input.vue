<script setup lang="ts">
import { cn } from "@/lib/utils";

defineOptions({ inheritAttrs: false });

interface Props {
  /**
   * v-model 绑定值。
   */
  modelValue?: string;
  /**
   * 额外的 class。
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  class: undefined,
});

const emit = defineEmits<{
  /**
   * v-model 更新事件。
   */
  (event: "update:modelValue", value: string): void;
}>();

/**
 * 输入事件处理：将原生 input 的值回传给 v-model。
 */
function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<template>
  <input
    v-bind="$attrs"
    :value="props.modelValue"
    @input="onInput"
    :class="
      cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        props.class
      )
    "
  />
</template>
