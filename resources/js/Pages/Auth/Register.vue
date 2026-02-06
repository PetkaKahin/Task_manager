<script setup lang="ts">
import TextInput from "@/UI/Inputs/TextInput.vue";
import PasswordInput from "@/UI/Inputs/PasswordInput.vue";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {Link, useForm} from "@inertiajs/vue3";
import AuthLayout from "@/Layouts/AuthLayout.vue";

const form = useForm({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  error: null,
})

const submit = () => {
  form.post('/register', {
    onFinish: () => {
      form.reset('password')
      form.reset('password_confirmation')
    },
  })
}
</script>

<template>
  <AuthLayout>
    <main class="login-page">
      <form
        class="form"
        @submit.prevent="submit"
      >
        <h2 class="form__header-text">Регистрация</h2>

        <TextInput
          className="form__input"
          label="Логин"
          name="name"
          id="name"
          autocomplete="name"
          v-model="form.name"
          :error="form.errors.name"
        />

        <TextInput
          className="form__input"
          label="Почта"
          name="email"
          id="email"
          autocomplete="email"
          v-model="form.email"
          :error="form.errors.email"
        />

        <PasswordInput
          className="form__input"
          label="Пароль"
          id="password"
          name="password"
          autocomplete="new-password"
          v-model="form.password"
          :error="form.errors.password"
        />

        <PasswordInput
          className="form__input"
          label="Повтор пароля"
          id="password_confirm"
          name="password_confirm"
          autocomplete="new-password"
          v-model="form.password_confirmation"
          :error="form.errors.password_confirmation"
        />

        <span
          v-if="form.errors.error"
          class="form__errors"
        >
            {{form.errors.error}}
        </span>

        <BaseButton :disabled="form.processing" class="form__sumbit" text="Зарегистрироваться"/>
      </form>

      <div class="links">
        <Link
          href="/login"
          class="links__link"
        >
          Войти
        </Link>
      </div>
    </main>
  </AuthLayout>
</template>

<style scoped lang="scss">
@use "@scss/variables/colors";

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  border: 1px solid colors.$border-default;
  padding: 30px;
  border-radius: 10px;
  background-color: colors.$bg-elevated;

  &__header-text {
    margin-top: 0;
    text-align: center;
  }

  &__sumbit {
    margin: 20px auto 0 auto;
    padding: 3px 8px;
  }

  &__errors {
    color: colors.$color-error;
    margin-top: 15px;
  }

  &__input {
    width: 220px;
  }
}

.links {
  &__link {
    display: block;
    margin: 20px 0 0 0;
    text-align: center;
  }
}
</style>
