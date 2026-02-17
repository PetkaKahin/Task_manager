<script setup lang="ts">
import TextInput from "@/UI/Inputs/TextInput.vue";
import PasswordInput from "@/UI/Inputs/PasswordInput.vue";
import BaseButton from "@/UI/Buttons/BaseButton.vue";
import {Link, useForm} from "@inertiajs/vue3";
import AuthLayout from "@/Layouts/AuthLayout.vue";

const form = useForm({
    login: '',
    password: '',
    error: null,
})

const submit = () => {
    form.post('/login', {
        onFinish: () => form.reset('password'),
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
        <h2 class="form__header-text">Вход</h2>

        <TextInput
          className="form__input"
          label="Логин / Почта"
          name="login"
          id="login"
          autocomplete="name"
          v-model="form.login"
          :error="form.errors.login"
        />
        <PasswordInput
          className="form__input"
          label="Пароль"
          id="password"
          name="password"
          autocomplete="current-password"
          v-model="form.password"
          :error="form.errors.password"
        />

        <span
          v-if="form.errors.error"
          class="form__errors"
        >
                {{form.errors.error}}
            </span>

        <BaseButton :disabled="form.processing" className="form__sumbit" text="Войти"/>
      </form>

      <div class="links">
        <Link
          href="/register"
          class="links__link"
        >
          Зарегистрироваться
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
        margin: 20px 0 200px 0;
        text-align: center;
    }
}
</style>
