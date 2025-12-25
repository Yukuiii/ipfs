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

const username = ref("");
const password = ref("");
const rememberMe = ref(true);
const submitting = ref(false);
const submitMessage = ref("");
const submitError = ref("");

const canSubmit = computed(
  () =>
    !submitting.value &&
    username.value.length > 0 &&
    password.value.length > 0
);

/**
 * 登录提交处理。
 * 说明：调用 Pages Functions 的 `/api/auth/login`，返回结果仅用于演示 UI。
 */
async function onSubmit() {
  submitting.value = true;
  submitMessage.value = "";
  submitError.value = "";
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        rememberMe: rememberMe.value,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: true; user: { username: string } }
      | { ok: false; message?: string }
      | null;

    if (!response.ok || !data || data.ok !== true) {
      const message =
        (data && "message" in data && data.message) || "登录失败，请重试";
      submitError.value = message;
      return;
    }

    submitMessage.value = `登录成功：${data.user.username}`;
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
            <Label for="username">用户名</Label>
            <Input
              id="username"
              v-model="username"
              type="text"
              autocomplete="username"
              placeholder="输入用户名"
            />
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
          <p v-if="submitError" class="text-sm text-destructive">
            {{ submitError }}
          </p>
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
