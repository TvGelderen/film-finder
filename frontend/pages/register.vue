<template>
    <div class="register-container">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="name" required />
            </div>
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
                <button type="submit">Register</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const handleRegister = async () => {
    error.value = '';

    try {
        await $fetch("/api/film-finder/auth/register", {
            method: 'POST',
            body: {
                name: name.value,
                email: email.value,
                password: password.value
            }
        }) as string;

        await navigateTo('/login');
    } catch (err: any) {
        error.value = `${err.data.message}`;
    }
}
</script>

<style scoped>
.register-container {
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

.success-text {
    color: green;
    margin-bottom: 0.75rem;
}

.error-text {
    color: red;
    margin-bottom: 0.75rem;
}
</style>
