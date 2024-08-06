<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import PlayerCard from "$lib/components/PlayerCard.svelte";
	import { onMount } from "svelte";

	import { socket } from "$lib/websocketConnection";
	import type { playerData } from "$lib/types";

	const code = Math.random().toString(36).slice(2, 6).toUpperCase();

	let view = "join";

	let players: playerData[] = [];

	let titleSelectedPlayers = 0;

	onMount(() => {
		socket.emit("joinRoom", { code: code, username: "Host", role: "host" });

		socket.on("connect", () => {
			console.log("Room Created");
		});

		socket.on("playerJoined", (data: playerData) => {
			console.log(data.username);
			players = [...players, data];
		});

		socket.on("titleSelected", (username: string) => {
			for (let i = 0; i < players.length; i++) {
				if (players[i].username === username) players[i].title = true;
				titleSelectedPlayers++;
				if (titleSelectedPlayers === players.length) {
					view = "speechIntro";
				}
			}
		});
	});

	function startGame() {
		socket.emit("gameStart");
		view = "titles";
	}
</script>

<main class="container mx-auto">
	<div class="items-center">
		<div class="flex flex-col space-y-3 ml-20 justify-self-end">
			{#if view === "join"}
				<h1 class="large font-black text-6xl">
					Game Code: <span class="animate-pulse">{code}</span>
				</h1>
				<p>
					Please direct your players to join the game using the code
					above. They will appear below.
				</p>
				<div class="grid grid-cols-5 gap-2">
					{#each players as player, i}
						<PlayerCard>{player.username}</PlayerCard>
					{/each}
				</div>
				<div class="flex space-x-2">
					<button on:click={startGame}>
						<Button>Start</Button>
					</button>
				</div>
			{:else if view === "titles"}
				<h1 class="large font-black text-6xl">Speech Titles!</h1>
				<p>
					Please check your devices to see instructions for creating
					speech names!
				</p>
				<div class="grid grid-cols-5 gap-2">
					{#each players as player, i}
						<PlayerCard loading={!player.title}
							>{player.username}</PlayerCard
						>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</main>
