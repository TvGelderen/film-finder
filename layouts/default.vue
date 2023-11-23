<template>
    <nav>
        <NuxtLink class="nav-link" to="/">Home</NuxtLink>
    </nav>
    <main>
        <slot />
    </main>
</template>

<style scoped>
    nav {
        width: 100%;
        height: 60px;
        padding-left: 24px;
        display: flex;
        align-items: center;
        background-color: #060606;
    }

    main {
        padding: 24px;
        background-color: #121212;
        height: calc(100vh - 60px);
    }

    .nav-link {
        font-size: 24px;
        text-decoration: none;
    }

    .nav-link:hover {
        color: #dddddd;
    }
</style>