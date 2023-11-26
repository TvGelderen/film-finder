<template>
    <nav>
        <NuxtLink class="logo" to="/">
            <img src="/img/logo.png" />
        </NuxtLink>
    </nav>
    <main>
        <slot />
    </main>
</template>

<style scoped>
nav {
    width: 100%;
    height: 4rem;
    display: flex;
    align-items: center;
    background-color: var(--background-color-secondary);
}

main {
    background-color: var(--background-color);
    height: calc(100vh - 60px);
    padding-top: 2rem;
}

.logo {
    width: 14rem;
    margin-left: 1rem;
    display: flex;
    align-items: center;
}

.logo img {
    width: 100%;
}
</style>