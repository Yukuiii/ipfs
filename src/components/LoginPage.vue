<script setup lang="ts">
import { computed, ref } from "vue";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const email = ref("");
const password = ref("");
const rememberMe = ref(true);
const submitting = ref(false);
const submitMessage = ref("");

const emailError = computed(() => {
  if (!email.value) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? "" : "邮箱格式不正确";
});

const canSubmit = computed(
  () =>
    !submitting.value &&
    email.value.length > 0 &&
    password.value.length > 0 &&
    !emailError.value
);

/**
 * 登录提交处理（示例）。
 * 这里只做最小 UI 演示，不包含真实鉴权逻辑。
 */
async function onSubmit() {
  submitting.value = true;
  submitMessage.value = "";
  try {
    // 这里预留对接真实登录 API 的位置；当前仅做 UI/交互验证。
    await new Promise((resolve) => setTimeout(resolve, 400));
    submitMessage.value = `已提交：${email.value}（记住我：${rememberMe.value ? "是" : "否"}）`;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main
    class="min-h-svh bg-background text-foreground flex items-center justify-center px-4 py-10"
  >
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>使用你的账号继续</CardDescription>
      </CardHeader>

      <form @submit.prevent="onSubmit">
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="email">邮箱</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
            />
            <p v-if="emailError" class="text-sm text-destructive">
              {{ emailError }}
            </p>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">密码</Label>
              <a
                class="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                href="#"
                @click.prevent
              >
                忘记密码？
              </a>
            </div>
            <Input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="输入密码"
            />
          </div>

          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded border border-input bg-background accent-primary"
            />
            <span>记住我</span>
          </label>
        </CardContent>

        <CardFooter class="flex flex-col gap-3">
          <Button class="w-full" type="submit" :disabled="!canSubmit">
            {{ submitting ? "登录中..." : "登录" }}
          </Button>
          <p v-if="submitMessage" class="text-sm text-muted-foreground">
            {{ submitMessage }}
          </p>
          <p class="text-sm text-muted-foreground">
            还没有账号？
            <a class="text-foreground underline underline-offset-4" href="#" @click.prevent>
              注册
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  </main>
</template>
