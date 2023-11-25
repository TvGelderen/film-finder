<template>
    <nav>
        <div class="title-link">
            <NuxtLink class="nav-link" to="/">FilmFinder</NuxtLink>
        </div>
    </nav>
    <main>
        <slot />
    </main>
</template>

<style scoped>
nav {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    background-color: var(--background-color-secondary);
}

main {
    background-color: var(--background-color);
    height: calc(100vh - 60px);
    padding-top: 48px;
}

.nav-link {
    font-size: 24px;
    text-decoration: none;
}

.nav-link:hover {
    color: #dddddd;
}

.title-link .nav-link {
    font-family: 'Times New Roman', Times, serif;
}
</style>