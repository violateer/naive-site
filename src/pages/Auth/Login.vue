<template>
  <div
    :style="{
      width: '50%',
      margin: '15rem auto 0px',
      padding: '2rem',
    }"
  >
    <n-card>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        size="medium"
        label-placement="top"
      >
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi :span="24" label="账号" path="username">
            <n-input v-model:value="model.username" placeholder="username..." />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="密码" path="password">
            <n-input
              type="password"
              show-password-on="mousedown"
              placeholder="password..."
              :maxlength="8"
              v-model:value="model.password"
            >
              <template #password-visible-icon>
                <n-icon :size="16" :component="GlassesOutline" />
              </template>
              <template #password-invisible-icon>
                <n-icon :size="16" :component="Glasses" />
              </template>
            </n-input>
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <div :style="{ width: '100%', textAlign: 'center' }">
        <n-button type="primary" @click="handleValidateButtonClick">
          登录
        </n-button>
      </div>
    </n-card>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst, NIcon, useMessage } from "naive-ui";
import { GlassesOutline, Glasses } from "@vicons/ionicons5";
import { useRouter } from "vue-router";
import { LoginParams, login } from "../../base/service";

export default defineComponent({
  setup() {
    const router = useRouter();
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    window.$message = message;

    const rules = {
      username: {
        required: true,
        trigger: ["blur", "input"],
        message: "请输入账号",
      },
      password: {
        required: true,
        trigger: ["blur", "input"],
        message: "请输入密码",
      },
    };
    const model = ref<LoginParams>({
      username: "",
      password: "",
    });

    // 登录
    const Login = async (params: LoginParams) => {
      await login(params);
      router.push("/");
    };

    const handleValidateButtonClick = (e: MouseEvent) => {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          Login(model.value);
        } else {
          message.error("验证失败");
        }
      });
    };
    return {
      GlassesOutline,
      Glasses,
      formRef,
      model,
      rules,
      handleValidateButtonClick,
    };
  },
});
</script>