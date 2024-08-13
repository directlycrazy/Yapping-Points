<script lang="ts">
    export let loading = false;
    export let role = "Player";
</script>

<div class="px-6 py-10 shadow-md bg-white text-black rounded-lg text-center">
    {#if loading}
        <div class="loader mx-auto mb-2"></div>
    {/if}
    <h1 class="large font-bold text-3xl"><slot /></h1>
    <p class="font-semibold">{role}</p>
</div>

<style>
    .loader {
        width: 40px;
        aspect-ratio: 2;
        --_g: no-repeat radial-gradient(circle closest-side, #000 90%, #0000);
        background:
            var(--_g) 0% 50%,
            var(--_g) 50% 50%,
            var(--_g) 100% 50%;
        background-size: calc(100% / 3) 50%;
        animation: l3 1s infinite linear;
    }
    @keyframes l3 {
        20% {
            background-position:
                0% 0%,
                50% 50%,
                100% 50%;
        }
        40% {
            background-position:
                0% 100%,
                50% 0%,
                100% 50%;
        }
        60% {
            background-position:
                0% 50%,
                50% 100%,
                100% 0%;
        }
        80% {
            background-position:
                0% 50%,
                50% 50%,
                100% 100%;
        }
    }
</style>
