<script>
	import Button from "$lib/components/Button.svelte";
</script>

<main class="flex w-full px-4">
	<div class="flex items-center justify-center mx-auto">
		<div class="flex flex-col space-y-3 justify-self-end">
			<h1
				class="large break-words font-black text-5xl lg:text-[130px] leading-[130px]"
			>
				YAPPING <br /> POINTS
			</h1>
			<p>
				Improve your public speaking skills with Yapping Points!
				Inspired by Talking Points.
			</p>
			<div class="flex space-x-2">
				<Button href="/play">Play</Button>
				<Button href="/host">Host</Button>
			</div>
		</div>
		<img
			src="/images/brand/hero.png"
			alt="Hero"
			class="invisible fixed lg:visible lg:static"
			style="height: 600px;"
		/>
	</div>
</main>
