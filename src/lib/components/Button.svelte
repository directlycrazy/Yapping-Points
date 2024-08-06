<script lang="ts">
    export let href = "";
</script>

{#if href}
    <a
        {href}
        class="button w-36 h-14 bg-white rounded-lg cursor-pointer select-none
    active:translate-y-2 active:[box-shadow:0_0px_0_0_#e2e8f0]
    active:border-b-[0px]
    transition-all duration-150 [box-shadow:0_10px_0_0_#e2e8f0]
    border-b-[1px] border-slate-100
  "
    >
        <span
            class="large flex flex-col font-black justify-center items-center h-full text-lg"
            ><slot /></span
        >
    </a>
{:else}
    <button
        class="button w-36 h-14 bg-white rounded-lg cursor-pointer select-none
    active:translate-y-2 active:[box-shadow:0_0px_0_0_#e2e8f0]
    active:border-b-[0px]
    transition-all duration-150 [box-shadow:0_10px_0_0_#e2e8f0]
    border-b-[1px] border-slate-100
  "
    >
        <span
            class="large flex flex-col font-black justify-center items-center h-full text-lg"
            ><slot /></span
        >
    </button>
{/if}
