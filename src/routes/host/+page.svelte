<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import PlayerCard from "$lib/components/PlayerCard.svelte";
	import PlayIcon from 'lucide-svelte/icons/play';
	import TypeIcon from 'lucide-svelte/icons/type';
	import CameraIcon from 'lucide-svelte/icons/camera';
	import SquareIcon from 'lucide-svelte/icons/square';
	import { fade, fly } from 'svelte/transition'

	import { onMount } from "svelte";

	import { socket } from "$lib/websocketConnection";
	import type { playerData, Title } from "$lib/types";

	const code = Math.random().toString(36).slice(2, 6).toUpperCase();

	let view = "join";

	let players: playerData[] = [];
	let titles: Title[] = [];

	$: presenterIndex = 0;
	$: presenter = players[presenterIndex]
	// $: assistantIndex = players.length - 1;
	$: assistant = players[players.length - (presenterIndex + 1)];

	console.log(presenter, assistant)

	let titleSelectedPlayers = 0;
	let slide = 0;

	let screenText = "";
	let screenImg = "";
	let speech: string[] = [];
	let images: string[] = [];

	function shuffleTitlesPlayers() {
		function shuffleArr(array: any[]) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		}

		shuffleArr(players);
		shuffleArr(titles);
		console.log(players, titles)
	}

	function startSpeech() {
		slide = 0;
		images = [];
		speech = selectSpeech();
		// presenter = players[presenterIndex];
		// assistantIndex--;
		// assistant = players[assistantIndex];
		changeView("presenting")
		setTimeout(() => {
			socket.emit('presenterScreen', presenter);
			socket.emit('assistantScreen', assistant);
			changeView("speech");
			slideData();
		}, 5000)
	}

	function selectSpeech() {
		let title = titles[0];
		titles.shift();
		console.log(title.speech)
		return JSON.parse(title.speech);
	}

	function changeView(v: string) {
		view = "";
		setTimeout(() => {
			view = v;
		}, 1500)
	}

	function slideData() {
		if (slide === 0) {
			screenText = `Hello, my name is ${presenter.username} and my talk is ...`
		} else if (slide === 1) {
			screenText = speech[0];
		} else if (slide === 7) {
			screenText = "Thank You."
			setTimeout(() => {
				presenterIndex++;
				startSpeech();
			}, 8000)
		} else if (slide % 2 === 0) {
			//Image slides
			console.log(images)
			screenImg = `https://cdn.inspare.cc/yp/${images[(slide / 2) - 1]}`
		} else {
			console.log((slide - 1) / 2)
			screenText = speech[(slide - 1) / 2]
			//Text slides
		}
	}

	onMount(() => {
		// setInterval(() => {
		// 	slide++;
		// }, 2500)
		//TESTING PURPOSES ONLY
		// for (let i = 0; i < 1; i++) {
			// 	players.push({ id: String(i), code: code, username: "player" + i, role: "player", title: true })
			// 	titles.push({id: String(i), code: code, title: `title ${i}`})
			// }
			
		socket.emit("joinRoom", { code: code, username: "Host", role: "host", played: false, presented: false });

		socket.on("connect", () => {
			console.log("Room Created");
		});

		socket.on("playerJoined", (data: playerData) => {
			console.log(data.username);
			players = [...players, data];
		});

		socket.on('changeSlide', (direction: "back" | "forward") => {
			//Slide boundaries
			if (slide <= 0 && direction === "back") return;
			if (slide >= 7 && direction === "forward") return;
			if (direction === "back") {
				slide--;
			} else {
				slide++;
			}
			slideData();
		})

		socket.on('selectImage', img => {
			console.log(img)
			images.push(img);
		})

		socket.on("titleSelected", (data: { id: string, code: string, username: string, speech: string}) => {
			titleSelectedPlayers = 0;
			
			for (let i = 0; i < players.length; i++) {
				if (players[i].username === data.username) {
					players[i].title = true;
					// titleSelectedPlayers++;
					titles.push(data);
				}
				
				if (players[i].title) titleSelectedPlayers++;
			}
			
			console.log(titleSelectedPlayers, players.length);
			if (titleSelectedPlayers === players.length) {
				shuffleTitlesPlayers();
				startSpeech();
			}
		});
	});

	function startGame() {
		socket.emit("gameStart");
		changeView("titles")
		// view = "titles";
	}
</script>

<main class="container mx-auto">
	<div class="items-center">
		<div class="flex flex-col space-y-3 ml-20 justify-self-end">
			{#if view === "join"}
				<div class="space-y-3" transition:fly|local={{ x: 0, y: 200, duration: 700 }}>
					<h1 class="large font-semibold text-5xl">
						Game Code
					</h1>
					<span class="large text-7xl font-black animate-pulse">{code}</span>
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
				</div>
			{:else if view === "titles"}
				<div class="space-y-3" transition:fly|local={{ x: 0, y: 200, duration: 700 }}>
					<h1 class="large font-black text-6xl">Speech Titles!</h1>
					<p>
						Please check your devices to see instructions for creating
						speech names!
					</p>
					<div class="grid grid-cols-5 gap-2">
						{#each players as player, i}
							<PlayerCard loading={!player.title}>{player.username}</PlayerCard
							>
						{/each}
					</div>
				</div>
			{:else if view === "presenting"}
				<div transition:fly|local={{ x: 0, y: 200, duration: 700 }}>
					<div class="flex flex-col space-y-4">
						<div>
							<h1 class="large font-black text-6xl">Now Presenting...</h1>
							<p>
								Player <b>{presenter.username}</b> will be presenting first and <b>{assistant.username}</b> will be the assistant! Please follow the instructions on your phones.
							</p>
						</div>
						<div class="flex space-x-2">
							<div transition:fade|local={{ duration: 700, delay: 500 }}>
								<PlayerCard role="Presenter">{presenter.username}</PlayerCard>
							</div>
							<div transition:fade|local={{ duration: 700, delay: 1400 }}>
								<PlayerCard role="Assistant">{assistant.username}</PlayerCard>
							</div>
						</div>
					</div>
				</div>
			{:else if view === "speech"}
				<div transition:fly|local={{ x: 0, y: 200, duration: 700 }}>
					<div class="flex space-x-4">
						<div class="flex flex-col space-y-4">
							<div class="flex gap-x-5">
								<div class="bg-white rounded-lg shadow-md p-0 flex justify-center h-[600px] w-[1000px] items-center overflow-hidden">
									{#if slide % 2 === 0 && slide !== 0}
										<img alt="Slide left intentionally blank" src={screenImg}>
									{:else}
										<div class="p-6">
											<h1 class="uppercase font-black text-6xl">{screenText}</h1>
										</div>
									{/if}
								</div>
								<!-- <div class="w-[50px] h-full bg-gray-200 rounded-lg shadow-md">
									<div class="h-[50%] transition bg-white rounded-t-lg"></div>
								</div> -->
							</div>
							<div class="flex space-x-1">
								{#each {length: 8} as _, i}
									<div class={`${slide === i && "invert"} bg-white rounded-full w-12 h-12 flex`}>
										{#if i === 0}
											<PlayIcon class="m-auto justify-center" />
										{:else if i === 7}
											<SquareIcon class="m-auto justify-center" />
										{:else if i % 2 === 0}
											<CameraIcon class="m-auto justify-center" />
										{:else}
											<TypeIcon class="m-auto justify-center" />
										{/if}
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>
