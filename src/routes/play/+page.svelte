<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { pickFour } from "$lib/speechTitles";

    import { onMount } from "svelte";

    import { socket } from "$lib/websocketConnection";

    let code = "";
    let username = "";

    let view = "code";
    let titles: string[] = [];
    let selectedTitle = "";
    let titleBlank = "";

    onMount(() => {
        socket.on("connect", () => {
            console.log("Websocket connected");
        });

        socket.on("gameStart", () => {
            view = "titles";
            titles = pickFour();
        });
    });

    function joinRoom() {
        socket.emit("joinRoom", {
            code: code,
            username: username,
            role: "player",
        });
        view = "loggedin";
    }

    function selectTitle(index: number) {
        selectedTitle = titles[index];
    }

    function submitTitle() {
        const final = selectedTitle.replace("____________", titleBlank);
        socket.emit("sendTitle", final);
    }
</script>

<main class="flex w-full px-4">
    <div class="items-center justify-center mx-auto">
        <div class="flex flex-col space-y-3 justify-self-end">
            {#if view === "code"}
                <h1 class="large font-black text-6xl">Join Game</h1>
                <p>Please enter the code you see on screen to join.</p>
                <div
                    class="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0"
                >
                    <input
                        bind:value={code}
                        autocomplete="off"
                        placeholder="Game Code"
                        class="p-4 rounded-lg"
                    />
                    <input
                        bind:value={username}
                        autocomplete="off"
                        placeholder="Name"
                        class="p-4 rounded-lg"
                    />
                </div>
                <div class="flex space-x-2">
                    <button on:click={joinRoom}>
                        <Button>Join</Button>
                    </button>
                </div>
            {:else if view === "loggedin"}
                <h1 class="large font-black text-6xl">You're In!</h1>
                <p>Please wait for the host to start the game.</p>
            {:else if view === "titles"}
                <h1 class="large font-black text-6xl">Pick A Title!</h1>
                <p>
                    {selectedTitle
                        ? selectedTitle
                        : "You will modify this title for your speaker."}
                </p>
                {#if selectedTitle}
                    <input
                        bind:value={titleBlank}
                        autocomplete="off"
                        placeholder="Fill in the blank!"
                        class="p-4 rounded-lg"
                    />
                    <button on:click={submitTitle}>
                        <Button>Submit</Button>
                    </button>
                {:else}
                    {#each titles as title, i}
                        <button
                            class="p-4 bg-white rounded-lg large"
                            on:click={() => {
                                selectTitle(i);
                            }}>{title}</button
                        >
                    {/each}
                {/if}
            {/if}
        </div>
    </div>
</main>
