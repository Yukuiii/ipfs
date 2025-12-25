<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

interface Props {
  /**
   * 按钮的视觉样式。
   */
  variant?: ButtonVariant;
  /**
   * 按钮尺寸。
   */
  size?: ButtonSize;
  /**
   * 原生按钮类型，默认 `button`，在表单中建议使用 `submit`。
   */
  type?: "button" | "submit" | "reset";
  /**
   * 是否禁用按钮。
   */
  disabled?: boolean;
  /**
   * 额外的 class。
   */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "default",
  type: "button",
  disabled: false,
  class: undefined,
});
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)"
  >
    <slot />
  </button>
</template>
