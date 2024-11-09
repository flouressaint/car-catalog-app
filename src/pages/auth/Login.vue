<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '@/service/AuthService';
import { getToken } from '@/service/jwtService';
import vueJwtDecode from 'vue-jwt-decode';

const router = useRouter();

const current_user = inject('current_user');

const error = ref('');
const loading = ref(false);
const user = ref({
    username: '',
    password: ''
});

const login = (user) => {
    if (!user.username || !user.password) {
        error.value = 'Имя пользователя и пароль обязательны для заполнения';
        return;
    }
    error.value = '';
    loading.value = true;
    AuthService
        .login(user)
        .then(() => {
            error.value = '';
            loading.value = false;
            current_user.value = vueJwtDecode.decode(getToken());
            router.push({ name: 'cars' });
        })
        .catch((err) => {
            if (err.response.data.code === 401) {
                error.value = 'Неверное имя пользователя или пароль';
                loading.value = false;
                return;
            }
        })
}
</script>

<template>
    <div class="login-page">
        <div class="login-form">
            <h1>Вход</h1>
            <div v-if="error" class="error">{{ error }}</div>
            <input type="username" v-model="user.username" placeholder="Имя пользователя">
            <input type="password" v-model="user.password" placeholder="Пароль">
            <button @click="login(user)" :disabled="loading">Войти</button>
            <svg v-if="loading" class="loading" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                    <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate"
                        values="0 12 12;360 12 12" />
                </path>
            </svg>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.error {
    margin-bottom: 10px;
    color: red;
}

.login-form {
    width: 80%;
    max-width: 400px;
    margin: 50px auto;
    padding: 0px 30px 30px 30px;
    /* border: 1px solid #ccc; */
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.loading {
    margin: 10px auto 0px;
}

h1 {
    margin: 0px;
}

input {
    padding: 5px;
    width: 100%;
    font-size: 16px;
    padding: 20px 0px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 20px;
}

button {
    margin: 10px;
    padding: 30px 50px;
    border-radius: 30px;
    border: 1px solid #ccc;
}
</style>