<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";

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
const confirmPassword = ref("");
const submitting = ref(false);
const submitMessage = ref("");
const submitError = ref("");

/** 密码是否匹配 */
const passwordMatch = computed(
  () => password.value === confirmPassword.value
);

/** 是否可以提交 */
const canSubmit = computed(
  () =>
    !submitting.value &&
    username.value.length > 0 &&
    password.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    passwordMatch.value
);

/**
 * 注册提交处理。
 * 说明：调用 Pages Functions 的 `/api/auth/register`。
 */
async function onSubmit() {
  submitting.value = true;
  submitMessage.value = "";
  submitError.value = "";

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: true; user: { username: string } }
      | { ok: false; message?: string }
      | null;

    if (!response.ok || !data || data.ok !== true) {
      const message =
        (data && "message" in data && data.message) || "注册失败，请重试";
      submitError.value = message;
      return;
    }

    submitMessage.value = `注册成功：${data.user.username}`;
    // 清空表单
    username.value = "";
    password.value = "";
    confirmPassword.value = "";
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
        <CardTitle>注册</CardTitle>
        <CardDescription>创建一个新账号</CardDescription>
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
            <Label for="password">密码</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              placeholder="输入密码"
            />
          </div>

          <div class="space-y-2">
            <Label for="confirmPassword">确认密码</Label>
            <Input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="再次输入密码"
            />
            <p
              v-if="confirmPassword.length > 0 && !passwordMatch"
              class="text-sm text-destructive"
            >
              两次输入的密码不一致
            </p>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-3">
          <Button class="w-full" type="submit" :disabled="!canSubmit">
            {{ submitting ? "注册中..." : "注册" }}
          </Button>
          <p v-if="submitError" class="text-sm text-destructive">
            {{ submitError }}
          </p>
          <p v-if="submitMessage" class="text-sm text-muted-foreground">
            {{ submitMessage }}
          </p>
          <p class="text-sm text-muted-foreground">
            已有账号？
            <RouterLink class="text-foreground underline underline-offset-4" to="/login">
              登录
            </RouterLink>
          </p>
        </CardFooter>
      </form>
    </Card>
  </main>
</template>
