<script setup>
import { AuthService } from '@/service/AuthService';
import { getToken } from '@/service/jwtService';
import { AnOutlinedUser, IoOutlineExit } from '@kalimahapps/vue-icons';
import vueJwtDecode from 'vue-jwt-decode';
import { ref, provide } from 'vue';

const current_user = ref(getToken() ? vueJwtDecode.decode(getToken()) : null);
provide('current_user', current_user);

const logout = () => {
  AuthService.logout();
  current_user.value = null;
}
</script>

<template>
  <nav>
    <div class="nav-left">
      <RouterLink to="/cars">Автомобили</RouterLink>
      <RouterLink to="/car-categories">Марки</RouterLink>
    </div>
    <div class="nav-right">
      <div class="user" v-if="current_user">
        {{ current_user.username }}
        <!-- <AnOutlinedUser :style="{ fontSize: '25px' }" /> -->
        <IoOutlineExit class="exit" @click="logout()" :style="{ fontSize: '25px' }" />
      </div>
      <RouterLink v-else to="/login">Войти</RouterLink>
    </div>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
nav {
  padding: 20px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #cdcdcd;
}

nav a {
  padding: 10px;
  font-weight: 500;
  text-decoration: none;
  margin: 0 10px;
}

nav a:hover {
  color: #606060;
}

nav-left,
nav-right {
  display: flex;
  align-items: center;
}

nav-left>*,
nav-right>* {
  margin: 10px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}

main {
  margin-bottom: 3rem;
}

.exit {
  border: 1px solid var(--primary);
  padding: 7px;
  color: white;
  font-size: 30px;
  border-radius: 10px;
  cursor: pointer;
  background-color: var(--primary);
}

.exit:hover {
  box-shadow: 0 0 10px var(--primary);
}


@media (prefers-color-scheme: dark) {
  nav {
    border-bottom: 1px solid #606060;
  }

  nav a:hover {
    color: white;
  }

  .exit:hover {
    color: white;
  }
}

@media only screen and (max-width: 320px) {
  nav {
    padding: 10px;
  }

  nav a {
    padding: 2px;
  }

  .exit {
    padding: 2px;
  }
}
</style>
