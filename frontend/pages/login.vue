<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="email">Email:</label>
                <input type="text" id="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <p class="error-text" v-if="error">{{ error }}</p>
            <div>
                <button type="submit">Login</button>
                <div>
                    Don't have an account? <NuxtLink to="/register">Register</NuxtLink>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import type { LoginResponse } from '~/types/auth/AuthTypes';

const email = ref('');
const password = ref('');
const error = ref('');

const user = useAuth();
const savedMovies = useSavedMovies();

const handleLogin = async () => {
    error.value = '';

    try {
        const loginResponse = await $fetch("/api/film-finder/auth/login", {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value
            }
        }) as LoginResponse;

        user.value = {
            name: loginResponse.name,
            email: loginResponse.email
        }

        const savedMoviesResponse = await $fetch('/api/film-finder/movies', {
            method: 'GET',
            headers: useRequestHeaders(['cookies']),
            credentials: 'include'
        }) as number[];

        savedMovies.value = savedMoviesResponse;

        await navigateTo("/");
    } catch (err: any) {
        error.value = `${err.data.error}`;
    }
}
</script>

<style scoped>
.login-container {
    width: min(100%, 360px);
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 8px;
    background-color: var(--background-color-secondary);
}

h2 {
    margin-bottom: 1.25rem;
}

form > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

form > div:last-child {
    justify-content: space-between;
    margin-bottom: 0;
}

input {
    padding: 0.5rem;
    outline: none;
    background-color: var(--background-color-tertiary);
    border: none;
    border-radius: 4px;
    font-size: 1rem;
}

input:focus,
button:focus {
    outline: solid var(--theme-color) 1px;
}

button {
    padding: 0.5rem 1.5rem;    
    font-size: 1rem;
    background-color: var(--background-color-tertiary);
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: var(--theme-color);
}

.error-text {
    color: red;
    margin-bottom: 0.75rem;
}
</style>
