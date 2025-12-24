<script lang="ts">
	import { onMount } from "svelte";
	import { main } from "./stuff";

	onMount(() => {
		main();
	})
</script>

<main class="flex gap-12">
	<div class="flex grow basis-4/6 flex-col">
		<h2 class="mb-1">settings</h2>
		<div class="flex flex-col gap-1" id="settings">
			<div class="flex flex-col">
				<div class="flex items-center gap-1.5">
					<div class="flex grow items-center gap-3">
						<div class="flex flex-col">
							<span>badges</span>
							<div class="flex items-center gap-1">
								<object class="badge-selector" data="" title="" type="image/png"></object>
								<object class="badge-selector" data="" title="" type="image/png"></object>
								<object class="badge-selector" data="" title="" type="image/png"></object>
								<object class="badge-selector" data="" title="" type="image/png"></object>
							</div>
						</div>
						<div class="flex grow flex-col">
							<span>username</span>
							<div class="flex items-center gap-1">
								<input id="username-color" type="color" value="#FFFFFF" />
								<input class="grow" id="username-text" type="text" placeholder="coolguy" autocomplete="off" />
							</div>
						</div>
					</div>
					<img class="mt-auto h-5 cursor-pointer rounded p-0.5 hover:bg-neutral-300" src="/preset.svg" alt="" id="user-presets-button" />
				</div>
			</div>
			<div class="flex flex-col">
				<span>message</span>
				<div class="flex items-center gap-1">
					<input id="message-color" type="color" value="#FFFFFF" />
					<input class="grow" id="message-text" type="text" placeholder="aga yo" autocomplete="off" />
				</div>
			</div>
			<div class="flex flex-col">
				<span class="flex items-center gap-1">outline <span class="text-xs text-neutral-400 italic">&lt;-- scuffed</span></span>
				<div class="flex items-center gap-1">
					<input id="outline-color" type="color" value="#000000" />
					<input id="outline-slider" type="range" min="0" max="5" step="1" value="0" />
					<span class="text-xs">thickness: <span id="outline-thickness">0</span></span>
				</div>
			</div>
			<div class="flex flex-col">
				<span>background</span>
				<div class="flex items-center gap-1">
					<div class="relative box-border flex size-[22px] overflow-hidden border">
						<div class="transparent-image absolute top-0 left-0 size-full"></div>
						<input class="absolute top-0 left-0 m-0 size-5! border-none! p-0" id="background-color" type="color" value="#FFFFFF" />
					</div>
					<input id="background-slider" type="range" min="0" max="1" step="0.05" value="0" />
					<span class="text-xs">opacity: <span id="background-opacity">0.0</span></span>
				</div>
			</div>
			<div class="flex items-center gap-1">
				<span>emotes</span>
				<input class="w-full" id="emote-channel-text" type="text" placeholder="channel" autocomplete="off" />
				<label class="flex w-max items-center text-xs">
					<input type="checkbox" id="emote-twitch-checkbox" />
					<span class="mt-1">twitch</span>
				</label>
				<label class="flex w-max items-center text-xs">
					<input type="checkbox" id="emote-ffz-checkbox" disabled />
					<span class="mt-1">ffz</span>
				</label>
				<label class="flex w-max items-center text-xs">
					<input type="checkbox" id="emote-bttv-checkbox" disabled />
					<span class="mt-1">bttv</span>
				</label>
				<label class="flex w-max items-center text-xs">
					<input type="checkbox" id="emote-seventv-checkbox" disabled />
					<span class="mt-1">7tv</span>
				</label>
				<!-- <img class="h-5 cursor-pointer rounded p-0.5 hover:bg-neutral-300" src="/save.svg" id="emote-save-button" /> -->
				<button class="flex cursor-pointer rounded border-0 p-0.5 hover:bg-neutral-300 disabled:cursor-default disabled:bg-transparent disabled:opacity-20" id="emote-save-button">
					<img class="h-5" src="/save.svg" alt="" />
				</button>
			</div>
			<div class="flex justify-between">
				<label class="flex items-center gap-1">
					<span>wrap text</span>
					<input type="checkbox" id="wrapping-checkbox" />
				</label>
				<label class="flex items-center gap-1">
					<span>first message</span>
					<input type="checkbox" id="highlight-checkbox" />
				</label>
				<div class="flex items-center gap-1">
					<span>font</span>
					<label class="flex items-center text-xs">
						<input type="radio" name="font" value="Inter" />
						<span class="mt-1">Inter (Twitch)</span>
					</label>
					<label class="flex items-center text-xs">
						<input type="radio" name="font" value="MADE" />
						<span class="mt-1">MADE</span>
					</label>
				</div>
			</div>
		</div>
	</div>
	<div class="flex grow basis-3/6 flex-col">
		<div class="mb-1 flex items-center justify-between">
			<h2>preview</h2>
			<div class="flex items-center gap-1">
				<label class="flex items-center text-xs">
					<input type="checkbox" id="preview-background-checkbox" />
					<span>preview background</span>
				</label>
			</div>
		</div>
		<div id="preview">
			<div id="preview-background-container">
				<div class="transparent-image"></div>
				<div id="preview-background"></div>
			</div>
			<div id="preview-message-container">
				<div id="preview-message">
					<div id="preview-message-highlight-background"></div>
					<div id="preview-message-content">
						<div id="preview-message-badges"></div>
						<span id="preview-message-author">author</span><span class="mr-1">:</span><span id="preview-message-body">body</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
<div class="float-right mt-3 flex items-center gap-3">
	<label class="flex items-center text-xs">
		<input type="checkbox" id="upscale-checkbox" checked />
		<span>10x upscale</span>
	</label>
	<button class="cursor-pointer px-3 py-1.5 text-sm" id="export-button">export</button>
</div>
<a class="absolute bottom-1 left-3 text-xs text-neutral-400 no-underline" href="https://github.com/zaneshaw/chatforge" target="_blank">made by squidee</a>
<div class="absolute top-0 left-0 z-10 flex size-full items-center justify-center bg-black/50" id="user-presets-modal" style="display: none">
	<div class="flex size-full h-4/5 w-2/5 flex-col gap-2 overflow-y-auto rounded bg-neutral-100 p-5" id="user-presets-modal-container">
		<div class="flex items-center justify-between">
			<h2>presets</h2>
			<span class="cursor-pointer text-xs underline" id="user-presets-new-button">new preset</span>
		</div>
		<div class="flex flex-col" id="user-presets-list">
			<span data-userpreset="0">0</span>
			<span data-userpreset="1">1</span>
			<span data-userpreset="2">2</span>
		</div>
	</div>
</div>
<div class="absolute top-0 left-0 z-10 flex size-full items-center justify-center bg-black/50" id="badge-selector-modal" style="display: none">
	<div
		class="flex size-full h-4/5 w-2/5 flex-col gap-2 overflow-y-auto rounded bg-neutral-100 p-5 [&_img]:size-6 [&_img]:cursor-pointer [&_img]:rounded [&_img]:p-1 [&_img]:drop-shadow [&_img]:drop-shadow-black/15 [&_img]:hover:bg-neutral-300 [&_img]:hover:drop-shadow-none"
		id="badge-selector-modal-container"
	>
		<div class="pointer-events-none absolute top-0 left-0 z-10 hidden translate-[-50%] rounded bg-neutral-50 px-2 py-1 text-sm drop-shadow" id="badge-tooltip"></div>
		<div class="flex items-center justify-between">
			<h2>badges</h2>
			<span class="cursor-pointer text-xs underline" id="remove-badge-button">remove badge</span>
		</div>
		<input class="m-0 box-border min-w-full px-2 py-3" id="global-badges-search" type="text" placeholder="search global badges" autocomplete="off" />
		<div class="flex flex-col gap-5" id="global-badges-container">
			<div>
				<h3>common global badges</h3>
				<div class="flex flex-wrap">
					<img src="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2" alt="" data-badge="Moderator" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2" alt="" data-badge="Verified" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/2" alt="" data-badge="Artist" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/3ffa9565-c35b-4cad-800b-041e60659cf2/2" alt="" data-badge="Chat Bot" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2" alt="" data-badge="Broadcaster" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/2" alt="" data-badge="Founder" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/df9095f6-a8a0-4cc2-bb33-d908c0adffb8/2" alt="" data-badge="AutoMod" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/8dbdfef5-0901-457f-a644-afa77ba176e5/2" alt="" data-badge="AutoMod" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/2" alt="" data-badge="VIP" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/2" alt="" data-badge="Staff" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/2" alt="" data-badge="Prime Gaming" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/2" alt="" data-badge="Turbo" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/2cbc339f-34f4-488a-ae51-efdf74f4e323/2" alt="" data-badge="Twitch Ambassador" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/9384c43e-4ce7-4e94-b2a1-b93656896eba/2" alt="" data-badge="Global Moderator" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/2" alt="" data-badge="Admin" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/85856a4a-eb7d-4e26-a43e-d204a977ade4/2" alt="" data-badge="Game Developer" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0/2" alt="" data-badge="Watching without audio" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/199a0dba-58f3-494e-a7fc-1fa0a1001fb8/2" alt="" data-badge="Listening only" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/cf91bbc0-0332-413a-a7f3-e36bac08b624/2" alt="" data-badge="Twitch DJ" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/2" alt="" data-badge="GLHF Pledge" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/fae4086c-3190-44d4-83c8-8ef0cbe1a515/2" alt="" data-badge="Current Hype Train Conductor" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/9c8d038a-3a29-45ea-96d4-5031fb1a7a81/2" alt="" data-badge="Former Hype Train Conductor" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/4d9e9812-ba9b-48a6-8690-13f3f338ee65/2" alt="" data-badge="Twitch Recap 2023" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/72f2a6ac-3d9b-4406-b9e9-998b27182f61/2" alt="" data-badge="Twitch Recap 2024" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/21656088-7da2-4467-acd2-55220e1f45ad/2" alt="" data-badge="Gifter Leader 1" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/0d9fe96b-97b7-4215-b5f3-5328ebad271c/2" alt="" data-badge="Gifter Leader 2" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/4c6e4497-eed9-4dd3-ac64-e0599d0a63e5/2" alt="" data-badge="Gifter Leader 3" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/12f70951-efea-48c2-b42b-d5e2ea0d71f7/2" alt="" data-badge="Clips Leader 1" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/9eddf7ab-aa46-4798-abe2-710db1043254/2" alt="" data-badge="Clips Leader 2" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/fb838633-6ff6-46df-98b4-9e53fcff84f6/2" alt="" data-badge="Clips Leader 3" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/8bedf8c3-7a6d-4df2-b62f-791b96a5dd31/2" alt="" data-badge="Bits Leader 1" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/f04baac7-9141-4456-a0e7-6301bcc34138/2" alt="" data-badge="Bits Leader 2" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/f1d2aab6-b647-47af-965b-84909cf303aa/2" alt="" data-badge="Bits Leader 3" />
				</div>
			</div>
			<div>
				<h2>liam sub badges (tier 1)</h2>
				<div class="flex flex-wrap">
					<img src="https://static-cdn.jtvnw.net/badges/v1/cb96b0d2-1a5e-4314-8003-0191d6f2822f/2" alt="" data-badge="Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/16171b73-2254-4685-a4f6-c5d4741e35fc/2" alt="" data-badge="2-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/e7f6ca63-c4e6-4c7e-a049-5ba7c5fa473a/2" alt="" data-badge="3-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/51ac61d1-30de-4ecc-8283-1e7ececab3d0/2" alt="" data-badge="6-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/532982f3-006c-4a01-baee-c7a08d961298/2" alt="" data-badge="9-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/24de109c-f893-4160-9c8b-d56cb61639f7/2" alt="" data-badge="1-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/7501057e-f08d-4f2e-a520-8f668edb7a8a/2" alt="" data-badge="1.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/171dab46-72bb-4134-9e91-d1059f9c82c8/2" alt="" data-badge="2-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/86335b36-e0bd-4f4b-a0b6-5858788f76be/2" alt="" data-badge="2.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/940cd46d-4c98-42bf-a48a-b0df37c1c632/2" alt="" data-badge="3-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/97de2863-661a-4aa2-b722-728991a589a3/2" alt="" data-badge="3.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/eea30e8c-a649-41b6-b0d3-0a9e7986879b/2" alt="" data-badge="4-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/21195b55-94af-4ade-8cf2-399263f6113c/2" alt="" data-badge="4.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/cf920d33-5894-4c32-97d8-9b7a679ca40f/2" alt="" data-badge="5-Year Subscriber" />
				</div>
			</div>
			<div>
				<h2>liam sub badges (tier 2)</h2>
				<div class="flex flex-wrap">
					<img src="https://static-cdn.jtvnw.net/badges/v1/08a25d4e-9cf2-4b44-afc1-e04ceeebe37a/2" alt="" data-badge="Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/084f7afa-0517-4b21-80a2-4c7cffd049c8/2" alt="" data-badge="2-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/dbb1a97e-977d-4946-9654-8af0617f0dd4/2" alt="" data-badge="3-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/5dd99cde-3862-4763-a6dc-c79679efdc1b/2" alt="" data-badge="6-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/76737b72-ce7b-45e7-8242-fdd642a02c33/2" alt="" data-badge="9-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/0ee7cd10-3689-4f1f-a58d-fe6f7edee649/2" alt="" data-badge="1-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/f93bd682-746b-4923-bd8d-9354d1b79c3c/2" alt="" data-badge="1.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/2348646e-21ed-4a03-a931-0b6ea25eadf0/2" alt="" data-badge="2-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/a98dd099-3233-4f5a-9016-72faa5cc70da/2" alt="" data-badge="2.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/ff308469-ac07-4492-a904-3f4349e8edb1/2" alt="" data-badge="3-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/246bc5ac-5fa2-43e8-b754-47e3669a1832/2" alt="" data-badge="3.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/ea683528-53e9-4d0e-b8a2-4972e63d6a62/2" alt="" data-badge="4-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/61e29895-87ff-4220-9cdd-b7cf101d5a64/2" alt="" data-badge="4.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/097916d8-8638-437e-8b49-18dfed9f6674/2" alt="" data-badge="5-Year Subscriber" />
				</div>
			</div>
			<div>
				<h2>liam sub badges (tier 3)</h2>
				<div class="flex flex-wrap">
					<img src="https://static-cdn.jtvnw.net/badges/v1/b144517c-e0c6-464f-bfa6-50e57768c751/2" alt="" data-badge="Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/f7e82251-717d-4760-90a2-1acd9e7b8568/2" alt="" data-badge="2-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/00629846-1f93-4a54-8536-bfe210efe364/2" alt="" data-badge="3-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/33e1f508-cabc-458c-9b4b-0a11290a6b74/2" alt="" data-badge="6-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/756a5c20-7cb9-48d5-885e-a56a932d061e/2" alt="" data-badge="9-Month Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/f4cd6df5-cf89-4e62-acf6-c11a589d7d64/2" alt="" data-badge="1-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/a1e8e07b-56a2-40eb-9d51-204c9e71acb9/2" alt="" data-badge="1.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/c3f1ed6f-3d34-4ed3-8bf3-b1fa33b53bee/2" alt="" data-badge="2-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/6c6990d0-fb61-4ebb-b53c-c9f03749547c/2" alt="" data-badge="2.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/45e0b2e5-bea6-469a-8f18-eba45856c7e9/2" alt="" data-badge="3-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/852d56e0-4735-4d5d-abbd-187909775fb7/2" alt="" data-badge="3.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/c477ddeb-6c12-493f-a921-c39aa2cf675b/2" alt="" data-badge="4-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/18bc0e3c-37d8-4144-a8e0-a29fdbcdd914/2" alt="" data-badge="4.5-Year Subscriber" />
					<img src="https://static-cdn.jtvnw.net/badges/v1/01998862-3032-4f9c-bc81-fd78b0c35763/2" alt="" data-badge="5-Year Subscriber" />
				</div>
			</div>
			<div>
				<div class="flex flex-col">
					<h2>all global badges (a-z)</h2>
					<span class="text-xs">fetched from <a href="https://api.twitchinsights.net/v1/badges/global" target="_blank">Twitch Insights</a></span>
				</div>
				<div class="global-badges flex flex-wrap">
					<span>still loading or there was an error</span>
				</div>
			</div>
		</div>
		<div class="global-badges flex flex-wrap" id="global-badges-results"></div>
	</div>
</div>