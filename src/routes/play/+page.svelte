<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import RightArrowIcon from 'lucide-svelte/icons/arrow-right';
    import LeftArrowIcon from 'lucide-svelte/icons/arrow-left';
    import { fourImages, pickThree, twoSegues } from "$lib/speechTitles";

    import { onMount } from "svelte";

    import { socket } from "$lib/websocketConnection";

    let code = "";
    let username = "";

    let view = "code";

    let titles: string[] = [];
    let segues: string[] = [];
    let images: string[] = [];

    let toSubmit: string[] = [];
    let selectedTitle = "";
    let titleBlank = "";

    let blanksStep = 0;
    let imageStep = 0;

    onMount(() => {
        socket.on("connect", () => {
            console.log("Websocket connected");
        });

        socket.on("gameStart", () => {
            view = "titles";
            titles = pickThree();
            segues = twoSegues();
        });

        socket.on('resetView', () => {
            view = "gamewait";
        })

        socket.on('changeView', (data: { view: string }) => {
            console.log(data)
            view = data.view;
            if (view === "assistant") {
                images = fourImages();
            }
        })
    });

    function joinRoom() {
        if (!code || !username) return;
        socket.emit("joinRoom", {
            code: code,
            username: username,
            role: "player",
        });
        view = "loggedin";
    }

    function navigateSlideshow(direction: "forward" | "back") {
        socket.emit('changeSlide', direction);
    }

    function selectTitle(index: number) {
        selectedTitle = titles[index];
    }

    function selectImage(img: number) {
        // if (imageStep === 3) return;
        imageStep++;
        socket.emit('selectImage', images[img]);
        if (imageStep <= 2) {
            images = fourImages();
        } else {
            images = [];
        }
    }

    function advanceBlanks() {
        blanksStep++;

        const final = selectedTitle.replace("____________", titleBlank);
        toSubmit.push(final);

        selectedTitle = segues[blanksStep - 1];

        if (blanksStep === 3) {
            console.log(toSubmit)
            socket.emit("sendTitle", JSON.stringify(toSubmit));
            view = "gamewait";
        }
    }
</script>

<main class="flex w-full px-4">
    <div class="items-center justify-center mx-auto">
        <div class="flex flex-col space-y-3 justify-self-end">
            {view}
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
                <h1 class="large font-black text-6xl">Fill In The Blanks!</h1>
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
                    <button on:click={advanceBlanks}>
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
            {:else if view === "gamewait"}
                <h1 class="large font-black text-6xl">Submitted!</h1>
                <p>Wait until you see your name on screen for when it's your big speech time.</p>
            {:else if view === "presenter"}
                <h1 class="large font-black text-6xl">You're Up!</h1>
                <p>Use the controls on screen to control your presentation.</p>
                <div class="flex w-full gap-x-2">
                    <button on:click={() => {navigateSlideshow('back')}} class="bg-white grow p-6 rounded-lg shadow-md">
                        <LeftArrowIcon class="mx-auto h-14 w-14"></LeftArrowIcon>
                    </button>
                    <button on:click={() => {navigateSlideshow('forward')}} class="bg-white grow p-6 rounded-lg shadow-md">
                        <RightArrowIcon class="mx-auto h-14 w-14"></RightArrowIcon>
                    </button>
                </div>
            {:else if view === "assistant"}
                <h1 class="large font-black text-6xl">Assistant</h1>
                <p>Use the below options to select the next slide for your speaker.</p>
                <div class="grid grid-cols-2">
                    {#each images as image, i}
                        <button class="p-2" on:click={() => {selectImage(i)}}>
                            <img src={`https://cdn.inspare.cc/yp/${image}`} alt="point">
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</main>
