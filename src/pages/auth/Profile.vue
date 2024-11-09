<script setup>
import { AuthService } from '@/service/AuthService';
import { getToken } from '@/service/jwtService';
import vueJwtDecode from 'vue-jwt-decode';

const current_user = vueJwtDecode.decode(getToken());
</script>
<template>
    <div class="profile-page">
        <h1>Профиль</h1>
        <h2>{{ current_user.username }}</h2>
        <!-- <div v-for="role in current_user.roles" :role="role">
            {{ role }}
        </div> -->
        <button @click="AuthService.logout()">Выйти</button>
    </div>
</template>

<style scoped>
.profile-page {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

button {
    margin: 10px;
    padding: 30px 50px;
    border-radius: 30px;
    border: 1px solid #ccc;
}
</style>