<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import PlayerCard from "$lib/components/PlayerCard.svelte";
	import PlayIcon from 'lucide-svelte/icons/play';
	import TypeIcon from 'lucide-svelte/icons/type';
	import CameraIcon from 'lucide-svelte/icons/camera';
	import SquareIcon from 'lucide-svelte/icons/square';

	import { onMount } from "svelte";

	import { socket } from "$lib/websocketConnection";
	import type { playerData, Title } from "$lib/types";

	const code = Math.random().toString(36).slice(2, 6).toUpperCase();

	let view = "join";

	let players: playerData[] = [];
	let titles: Title[] = [];

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

		socket.on("titleSelected", (data: { id: string, code: string, username: string, title: string}) => {
			for (let i = 0; i < players.length; i++) {
				if (players[i].username === data.username) {
					players[i].title = true;
					titleSelectedPlayers++;
					titles.push(data);
					if (titleSelectedPlayers === players.length) {
						view = "speechIntro";
					}
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
			{:else if view === "game"}
				<div class="flex space-x-4">
					<div class="flex flex-col space-y-4">
						<div class="bg-white rounded-lg shadow-md w-full p-6 flex justify-center h-[600px] max-w-[1000px] items-center overflow-hidden">
							<h1 class="uppercase font-black text-6xl">Hello, my name is ... and my talk is ...</h1>
							<!-- <img src="/images/game/76126.jpg"> -->
						</div>
						<div class="flex space-x-1">
							<div class=" bg-white rounded-full w-12 h-12 flex">
								<PlayIcon class="m-auto justify-center" />
							</div>
							<div class=" bg-white rounded-full w-12 h-12 flex">
								<TypeIcon class="m-auto justify-center" />
							</div>
							<div class=" bg-white rounded-full w-12 h-12 flex">
								<CameraIcon class="m-auto justify-center" />
							</div>
							<div class=" bg-white rounded-full w-12 h-12 flex">
								<TypeIcon class="m-auto justify-center" />
							</div>
							<div class=" bg-white rounded-full w-12 h-12 flex">
								<CameraIcon class="m-auto justify-center" />
							</div>
							<div class=" bg-white rounded-full w-12 h-12 flex">
								<TypeIcon class="m-auto justify-center" />
							</div>
							<div class=" bg-white rounded-full w-12 h-12 flex">
								<CameraIcon class="m-auto justify-center" />
							</div>
							<div class=" bg-white rounded-full w-12 h-12 flex">
								<SquareIcon class="m-auto justify-center" />
							</div>
						</div>
					</div>
					<div>score slider</div>
				</div>
			{/if}
		</div>
	</div>
</main>
