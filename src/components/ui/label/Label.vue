<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  /**
   * 额外的 class。
   */
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <label
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        props.class
      )
    "
  >
    <slot />
  </label>
</template>
