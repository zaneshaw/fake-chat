import { snapdom } from "@zumer/snapdom";
import { downloadDir } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

let settingsEl: HTMLElement;

let badgeSelectorEls: HTMLImageElement[];
let badgeSelectorModalEl: HTMLElement;
let removeBadgeButtonEl: HTMLElement;

let usernameColorEl: HTMLInputElement;
let usernameTextEl: HTMLInputElement;

let messageColorEl: HTMLInputElement;
let messageTextEl: HTMLInputElement;

let outlineColorEl: HTMLInputElement;
let outlineSliderEl: HTMLInputElement;
let outlineThicknessValueEl: HTMLElement;

let backgroundColorEl: HTMLInputElement;
let backgroundSliderEl: HTMLInputElement;
let backgroundOpacityValueEl: HTMLElement;

let wrappingCheckboxEl: HTMLInputElement;

let previewBackgroundCheckboxEl: HTMLInputElement;

let upscaleCheckboxEl: HTMLInputElement;

let previewBackgroundContainerEl: HTMLElement;
let previewBackgroundEl: HTMLElement;
let previewMessageContainerEl: HTMLElement;
let previewMessageEl: HTMLElement;
let previewMessageContentEl: HTMLElement;
let previewMessageBadgesEl: HTMLElement;
let previewMessageAuthorEl: HTMLElement;
let previewMessageBodyEl: HTMLElement;

let exportButtonEl: HTMLButtonElement;

interface Settings {
	version: number;
	badges: string[];
	username: {
		color: string;
		text: string;
	};
	message: {
		color: string;
		text: string;
	};
	outline: {
		color: string;
		thickness: number;
	};
	background: {
		color: string;
		opacity: number;
	};
	wrap: boolean;
	upscale: boolean;
}

const defaultSettings: Settings = {
	version: 1,
	badges: ["https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3", "https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/3", "", ""],
	username: {
		color: "#FFFFFF",
		text: "coolguy",
	},
	message: {
		color: "#FFFFFF",
		text: "aga yo",
	},
	outline: {
		color: "#000000",
		thickness: 0,
	},
	background: {
		color: "#FFFFFF",
		opacity: 0,
	},
	wrap: false,
	upscale: true,
};

let settings: Settings;
let exporting = false;

async function exportPng() {
	if (exporting) return;
	exporting = true;

	renderPreview();

	if (previewMessageEl) {
		const path = await save({
			defaultPath: `${await downloadDir()}/fakechat-${Date.now()}.png`,
			filters: [
				{
					name: "PNG",
					extensions: ["png"],
				},
			],
		});

		if (path) {
			previewMessageEl.style.backgroundColor = previewBackgroundEl.style.backgroundColor;
			const result = await snapdom.toBlob(previewMessageEl, { type: "png", embedFonts: true, scale: settings.upscale ? 10 : 1 });
			previewMessageEl.style.backgroundColor = "initial";

			const bytes = new Uint8Array(await result.arrayBuffer());

			await writeFile(path, bytes);
		}
	}

	exporting = false;
}

// todo: add local storage cache
async function fetchGlobalBadges() {
	// const url = "https://api.twitchinsights.net/v1/badges/global";
	// const res = await fetch(url);
	// const json = await res.json();
	const json = {
		badges: [
			{
				setID: "1979-revolution_1",
				title: "1979 Revolution",
				description: "1979 Revolution",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/1979%20Revolution/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/7833bb6e-d20d-48ff-a58d-67fe827a4f84/1",
			},
			{
				setID: "60-seconds_1",
				title: "60 Seconds!",
				description: "60 Seconds!",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/60%20Seconds!/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/1e7252f9-7e80-4d3d-ae42-319f030cca99/1",
			},
			{
				setID: "60-seconds_2",
				title: "60 Seconds!",
				description: "60 Seconds!",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/60%20Seconds!/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/64513f7d-21dd-4a05-a699-d73761945cf9/1",
			},
			{
				setID: "60-seconds_3",
				title: "60 Seconds!",
				description: "60 Seconds!",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/60%20Seconds!/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f4306617-0f96-476f-994e-5304f81bcc6e/1",
			},
			{
				setID: "H1Z1_1",
				title: "H1Z1",
				description: "H1Z1",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/H1Z1/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/fc71386c-86cd-11e7-a55d-43f591dc0c71/1",
			},
			{
				setID: "admin",
				title: "Admin",
				description: "Twitch Admin",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/1",
			},
			{
				setID: "alone",
				title: "Alone",
				description: "This badge was earned by subscribing or gifting a sub to a streamer in the Little Nightmares III category during launch.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/10ba11a2-0171-42b6-9bba-8f2f14248172/1",
			},
			{
				setID: "ambassador",
				title: "Twitch Ambassador",
				description: "Twitch Ambassador",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/team/ambassadors",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/2cbc339f-34f4-488a-ae51-efdf74f4e323/1",
			},
			{
				setID: "anomaly-2_1",
				title: "Anomaly 2",
				description: "Anomaly 2",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Anomaly%202/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d1d1ad54-40a6-492b-882e-dcbdce5fa81e/1",
			},
			{
				setID: "anomaly-warzone-earth_1",
				title: "Anomaly Warzone Earth",
				description: "Anomaly Warzone Earth",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Anomaly:%20Warzone%20Earth/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/858be873-fb1f-47e5-ad34-657f40d3d156/1",
			},
			{
				setID: "anonymous-cheerer",
				title: "Anonymous Cheerer",
				description: "Anonymous Cheerer",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ca3db7f7-18f5-487e-a329-cd0b538ee979/1",
			},
			{
				setID: "arc-raiders-launch-2025",
				title: "Arc Raiders Launch 2025",
				description: "This badge was earned by subscribing or gifting a sub to an Arc Raiders streamer during launch!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d4aa495f-a0e4-4ab4-b3eb-7c2ea573b03f/1",
			},
			{
				setID: "arcane-season-2-premiere",
				title: "Arcane Season 2 Premiere",
				description: "This badge was earned by watching the premiere of Arcane Season 2!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/1d833bde-edc7-4d23-b7b6-ad5a13296675/1",
			},
			{
				setID: "artist-badge",
				title: "Artist",
				description: "Artist on this Channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/1",
			},
			{
				setID: "axiom-verge_1",
				title: "Axiom Verge",
				description: "Axiom Verge",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Axiom%20Verge/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f209b747-45ee-42f6-8baf-ea7542633d10/1",
			},
			{
				setID: "battlechefbrigade_1",
				title: "Battle Chef Brigade",
				description: "Battle Chef Brigade",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Battle%20Chef%20Brigade/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/24e32e67-33cd-4227-ad96-f0a7fc836107/1",
			},
			{
				setID: "battlechefbrigade_2",
				title: "Battle Chef Brigade",
				description: "Battle Chef Brigade",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Battle%20Chef%20Brigade/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ef1e96e8-a0f9-40b6-87af-2977d3c004bb/1",
			},
			{
				setID: "battlechefbrigade_3",
				title: "Battle Chef Brigade",
				description: "Battle Chef Brigade",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Battle%20Chef%20Brigade/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/107ebb20-4fcd-449a-9931-cd3f81b84c70/1",
			},
			{
				setID: "battlefield-6",
				title: "Battlefield 6",
				description: "This badge was earned by subscribing to a streamer playing Battlefield 6.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d7750af0-caca-47c5-b207-1af9be69ce1b/1",
			},
			{
				setID: "battlerite_1",
				title: "Battlerite",
				description: "Battlerite",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Battlerite/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/484ebda9-f7fa-4c67-b12b-c80582f3cc61/1",
			},
			{
				setID: "bits",
				title: "cheer 1",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/1",
			},
			{
				setID: "bits",
				title: "cheer 100",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/09d93036-e7ce-431c-9a9e-7044297133f2/1",
			},
			{
				setID: "bits",
				title: "cheer 1000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/0d85a29e-79ad-4c63-a285-3acd2c66f2ba/1",
			},
			{
				setID: "bits",
				title: "cheer 10000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/68af213b-a771-4124-b6e3-9bb6d98aa732/1",
			},
			{
				setID: "bits",
				title: "cheer 100000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/96f0540f-aa63-49e1-a8b3-259ece3bd098/1",
			},
			{
				setID: "bits",
				title: "cheer 1000000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/494d1c8e-c3b2-4d88-8528-baff57c9bd3f/1",
			},
			{
				setID: "bits",
				title: "cheer 1250000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ce217209-4615-4bf8-81e3-57d06b8b9dc7/1",
			},
			{
				setID: "bits",
				title: "cheer 1500000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c4eba5b4-17a7-40a1-a668-bc1972c1e24d/1",
			},
			{
				setID: "bits",
				title: "cheer 1750000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/183f1fd8-aaf4-450c-a413-e53f839f0f82/1",
			},
			{
				setID: "bits",
				title: "cheer 200000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4a0b90c4-e4ef-407f-84fe-36b14aebdbb6/1",
			},
			{
				setID: "bits",
				title: "cheer 2000000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/7ea89c53-1a3b-45f9-9223-d97ae19089f2/1",
			},
			{
				setID: "bits",
				title: "cheer 25000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/64ca5920-c663-4bd8-bfb1-751b4caea2dd/1",
			},
			{
				setID: "bits",
				title: "cheer 2500000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/cf061daf-d571-4811-bcc2-c55c8792bc8f/1",
			},
			{
				setID: "bits",
				title: "cheer 300000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ac13372d-2e94-41d1-ae11-ecd677f69bb6/1",
			},
			{
				setID: "bits",
				title: "cheer 3000000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5671797f-5e9f-478c-a2b5-eb086c8928cf/1",
			},
			{
				setID: "bits",
				title: "cheer 3500000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c3d218f5-1e45-419d-9c11-033a1ae54d3a/1",
			},
			{
				setID: "bits",
				title: "cheer 400000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a8f393af-76e6-4aa2-9dd0-7dcc1c34f036/1",
			},
			{
				setID: "bits",
				title: "cheer 4000000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/79fe642a-87f3-40b1-892e-a341747b6e08/1",
			},
			{
				setID: "bits",
				title: "cheer 4500000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/736d4156-ac67-4256-a224-3e6e915436db/1",
			},
			{
				setID: "bits",
				title: "cheer 5000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/57cd97fc-3e9e-4c6d-9d41-60147137234e/1",
			},
			{
				setID: "bits",
				title: "cheer 50000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/62310ba7-9916-4235-9eba-40110d67f85d/1",
			},
			{
				setID: "bits",
				title: "cheer 500000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f6932b57-6a6e-4062-a770-dfbd9f4302e5/1",
			},
			{
				setID: "bits",
				title: "cheer 5000000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3f085f85-8d15-4a03-a829-17fca7bf1bc2/1",
			},
			{
				setID: "bits",
				title: "cheer 600000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4d908059-f91c-4aef-9acb-634434f4c32e/1",
			},
			{
				setID: "bits",
				title: "cheer 700000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a1d2a824-f216-4b9f-9642-3de8ed370957/1",
			},
			{
				setID: "bits",
				title: "cheer 75000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ce491fa4-b24f-4f3b-b6ff-44b080202792/1",
			},
			{
				setID: "bits",
				title: "cheer 800000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5ec2ee3e-5633-4c2a-8e77-77473fe409e6/1",
			},
			{
				setID: "bits",
				title: "cheer 900000",
				description: " ",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/088c58c6-7c38-45ba-8f73-63ef24189b84/1",
			},
			{
				setID: "bits-charity",
				title: "Direct Relief - Charity 2018",
				description: "Supported their favorite streamer during the 2018 Blizzard of Bits",
				clickAction: "VISIT_URL",
				clickURL: "https://link.twitch.tv/blizzardofbits",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a539dc18-ae19-49b0-98c4-8391a594332b/1",
			},
			{
				setID: "bits-leader",
				title: "Bits Leader 1",
				description: "Ranked as a top cheerer on this channel",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/8bedf8c3-7a6d-4df2-b62f-791b96a5dd31/1",
			},
			{
				setID: "bits-leader",
				title: "Bits Leader 2",
				description: "Ranked as a top cheerer on this channel",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f04baac7-9141-4456-a0e7-6301bcc34138/1",
			},
			{
				setID: "bits-leader",
				title: "Bits Leader 3",
				description: "Ranked as a top cheerer on this channel",
				clickAction: "VISIT_URL",
				clickURL: "https://bits.twitch.tv",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f1d2aab6-b647-47af-965b-84909cf303aa/1",
			},
			{
				setID: "black-ops-7-global-launch",
				title: "Black Ops 7 Global Launch",
				description: "This badge was earned by subscribing to a COD: Black Ops 7 streamer during launch!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e225aad6-3780-4bdc-ae38-48d3ab7dc36e/1",
			},
			{
				setID: "borderlands-4-badge---ripper",
				title: "Borderlands 4 Badge - Ripper",
				description: "This user joined the ranks of the Rippers in Borderlands 4.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/098219cb-48d8-4945-96a6-80594c7a90dd/1",
			},
			{
				setID: "borderlands-4-badge---vault-symbol",
				title: "Borderlands 4 Badge - Vault Symbol",
				description: "This user is rocking the Vault Symbol from Borderlands 4.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/97eee27d-c87f-4afb-a020-04a9d04456df/1",
			},
			{
				setID: "bot-badge",
				title: "Chat Bot",
				description: "This Bot has been added to the channel by the broadcaster.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3ffa9565-c35b-4cad-800b-041e60659cf2/1",
			},
			{
				setID: "brawlhalla_1",
				title: "Brawlhalla",
				description: "Brawlhalla",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Brawlhalla/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/bf6d6579-ab02-4f0a-9f64-a51c37040858/1",
			},
			{
				setID: "broadcaster",
				title: "Broadcaster",
				description: "Broadcaster",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
			},
			{
				setID: "broken-age_1",
				title: "Broken Age",
				description: "Broken Age",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Broken%20Age/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/56885ed2-9a09-4c8e-8131-3eb9ec15af94/1",
			},
			{
				setID: "bubsy-the-woolies_1",
				title: "Bubsy: The Woolies Strike Back",
				description: "Bubsy: The Woolies Strike Back",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Bubsy:%20The%20Woolies%20Strike%20Back/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c8129382-1f4e-4d15-a8d2-48bdddba9b81/1",
			},
			{
				setID: "chatter-cs-go-2022",
				title: "CS:GO Week Brazil 2022",
				description: "Chatted during CS:GO Week Brazil 2022",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/57b6bd6b-a1b5-4204-9e6c-eb8ed5831603/1",
			},
			{
				setID: "clip-champ",
				title: "Power Clipper",
				description: "Power Clipper",
				clickAction: "VISIT_URL",
				clickURL: "https://help.twitch.tv/customer/portal/articles/2918323-clip-champs-guide",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f38976e0-ffc9-11e7-86d6-7f98b26a9d79/1",
			},
			{
				setID: "clip-the-halls",
				title: "Clip the Halls",
				description: "For spreading the holiday cheer by sharing a clip to TikTok or YouTube during Twitch Holiday Hoopla 2024.",
				clickAction: "VISIT_URL",
				clickURL: "https://blog.twitch.tv/en/2024/12/02/twitch-holiday-hoopla/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ce9e266a-f490-4fb2-9989-aee20036bfa5/1",
			},
			{
				setID: "clips-leader",
				title: "Clips Leader 1",
				description: "Ranked as a top clipper in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/12f70951-efea-48c2-b42b-d5e2ea0d71f7/1",
			},
			{
				setID: "clips-leader",
				title: "Clips Leader 2",
				description: "Ranked as a top clipper in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9eddf7ab-aa46-4798-abe2-710db1043254/1",
			},
			{
				setID: "clips-leader",
				title: "Clips Leader 3",
				description: "Ranked as a top clipper in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/fb838633-6ff6-46df-98b4-9e53fcff84f6/1",
			},
			{
				setID: "creator-cs-go-2022",
				title: "CS:GO Week Brazil 2022",
				description: "Streamed during CS:GO Week Brazil 2022",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a2ea6df9-ac0a-4956-bfe9-e931f50b94fa/1",
			},
			{
				setID: "cuphead_1",
				title: "Cuphead",
				description: "Cuphead",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Cuphead/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4384659a-a2e3-11e7-a564-87f6b1288bab/1",
			},
			{
				setID: "darkest-dungeon_1",
				title: "Darkest Dungeon",
				description: "Darkest Dungeon",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Darkest%20Dungeon/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/52a98ddd-cc79-46a8-9fe3-30f8c719bc2d/1",
			},
			{
				setID: "deceit_1",
				title: "Deceit",
				description: "Deceit",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Deceit/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/b14fef48-4ff9-4063-abf6-579489234fe9/1",
			},
			{
				setID: "destiny-2-final-shape-raid-race",
				title: "Destiny 2: The Final Shape Raid Race",
				description: "I earned this badge by watching Destiny 2: The Final Shape Raid Race on Twitch!",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/category/destiny-2",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e79ee64f-31f1-4485-9c81-b93957e69f8a/1",
			},
			{
				setID: "destiny-2-the-final-shape-streamer",
				title: "Destiny 2: The Final Shape Streamer",
				description: "I earned this badge by taking part in the Destiny 2: The Final Shape Raid Race!",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/category/destiny-2\t",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/b1bcaf3c-d7a2-442b-b407-03f2b8ff624d/1",
			},
			{
				setID: "devil-may-cry-hd_1",
				title: "Devil May Cry HD Collection",
				description: "Devil May Cry HD Collection",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Devil%20May%20Cry%20HD%20Collection/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/633877d4-a91c-4c36-b75b-803f82b1352f/1",
			},
			{
				setID: "devil-may-cry-hd_2",
				title: "Devil May Cry HD Collection",
				description: "Devil May Cry HD Collection",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Devil%20May%20Cry%20HD%20Collection/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/408548fe-aa74-4d53-b5e9-960103d9b865/1",
			},
			{
				setID: "devil-may-cry-hd_3",
				title: "Devil May Cry HD Collection",
				description: "Devil May Cry HD Collection",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Devil%20May%20Cry%20HD%20Collection/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/df84c5bf-8d66-48e2-b9fb-c014cc9b3945/1",
			},
			{
				setID: "devil-may-cry-hd_4",
				title: "Devil May Cry HD Collection",
				description: "Devil May Cry HD Collection",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Devil%20May%20Cry%20HD%20Collection/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/af836b94-8ffd-4c0a-b7d8-a92fad5e3015/1",
			},
			{
				setID: "devilian_1",
				title: "Devilian",
				description: "Devilian",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Devilian/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3cb92b57-1eef-451c-ac23-4d748128b2c5/1",
			},
			{
				setID: "dreamcon-2024",
				title: "Dream Con 2024",
				description: "This badge was earned by watching Dream Con 2024 or completing the post-event survey!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5dfbd056-8ac1-407f-bdf3-f83183fa97ae/1",
			},
			{
				setID: "duelyst_1",
				title: "Duelyst",
				description: "Duelyst",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Duelyst/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/7d9c12f4-a2ac-4e88-8026-d1a330468282/1",
			},
			{
				setID: "duelyst_2",
				title: "Duelyst",
				description: "Duelyst",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Duelyst/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/1938acd3-2d18-471d-b1af-44f2047c033c/1",
			},
			{
				setID: "duelyst_3",
				title: "Duelyst",
				description: "Duelyst",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Duelyst/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/344c07fc-1632-47c6-9785-e62562a6b760/1",
			},
			{
				setID: "duelyst_4",
				title: "Duelyst",
				description: "Duelyst",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Duelyst/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/39e717a8-00bc-49cc-b6d4-3ea91ee1be25/1",
			},
			{
				setID: "duelyst_5",
				title: "Duelyst",
				description: "Duelyst",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Duelyst/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/290419b6-484a-47da-ad14-a99d6581f758/1",
			},
			{
				setID: "duelyst_6",
				title: "Duelyst",
				description: "Duelyst",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Duelyst/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c5e54a4b-0bf1-463a-874a-38524579aed0/1",
			},
			{
				setID: "duelyst_7",
				title: "Duelyst",
				description: "Duelyst",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Duelyst/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/cf508179-3183-4987-97e0-56ca44babb9f/1",
			},
			{
				setID: "elden-ring-recluse",
				title: "Elden Ring SuperFan badge - Recluse",
				description: "You used Stream Together or participated in a stream before or after Nightreign dropped. You’ve earned the Recluse badge.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5afadc6c-933b-4ede-b318-3752bbf267a9/1",
			},
			{
				setID: "elden-ring-wylder",
				title: "Elden Ring Nightreign Clip badge - Wylder",
				description: "You captured a clippable Elden Ring moment. You’ve earned the Wylder badge.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5d5ab328-0916-4655-90b9-78b983ca4262/1",
			},
			{
				setID: "enter-the-gungeon_1",
				title: "Enter The Gungeon",
				description: "Enter The Gungeon",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Enter%20the%20Gungeon/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/53c9af0b-84f6-4f9d-8c80-4bc51321a37d/1",
			},
			{
				setID: "eso_1",
				title: "Elder Scrolls Online",
				description: "Elder Scrolls Online",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/18647a68-a35f-48d7-bf97-ae5deb6b277d/1",
			},
			{
				setID: "evo-2025",
				title: "Evo 2025",
				description: "You have earned the Evo 2025 Badge",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/1469e9cf-14d9-4a48-a91c-81712d027439/1",
			},
			{
				setID: "extension",
				title: "Extension",
				description: "Extension",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ea8b0f8c-aa27-11e8-ba0c-1370ffff3854/1",
			},
			{
				setID: "firewatch_1",
				title: "Firewatch",
				description: "Firewatch",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Firewatch/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/b6bf4889-4902-49e2-9658-c0132e71c9c4/1",
			},
			{
				setID: "founder",
				title: "Founder",
				description: "Founder",
				clickAction: "VISIT_URL",
				clickURL: "https://help.twitch.tv/s/article/founders-badge",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/1",
			},
			{
				setID: "fright-fest-2025",
				title: "Fright Fest 2025",
				description: "This badge was earned by users who shared the best 2025 Fright Fest clips.",
				clickAction: "VISIT_URL",
				clickURL: "https://blog.twitch.tv/en/2025/10/20/twitch-fright-fest-2025/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/2ef2cd27-2210-4640-bbf8-69b5c4d9e302/1",
			},
			{
				setID: "frozen-cortext_1",
				title: "Frozen Cortext",
				description: "Frozen Cortext",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Frozen%20Cortex/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/2015f087-01b5-4a01-a2bb-ecb4d6be5240/1",
			},
			{
				setID: "frozen-synapse_1",
				title: "Frozen Synapse",
				description: "Frozen Synapse",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Frozen%20Synapse/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d4bd464d-55ea-4238-a11d-744f034e2375/1",
			},
			{
				setID: "game-developer",
				title: "Game Developer",
				description: "Game Developer for:",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/85856a4a-eb7d-4e26-a43e-d204a977ade4/1",
			},
			{
				setID: "gamerduo",
				title: "GamerDuo",
				description: "Subbed to a streamer and got 3 months of free Super Duolingo!",
				clickAction: "VISIT_URL",
				clickURL: "https://blog.twitch.tv/2025/10/02/sub-for-super-duolingo/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/be750d4d-a3b9-4116-ae75-6ee4f3294a19/1",
			},
			{
				setID: "gears-of-war-superfan-badge",
				title: "Gears of War Superfan Badge",
				description: "This user is a Gears of War: Reloaded Superfan.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/18b92728-aa7a-4e24-acb5-b14ea17c8b2b/1",
			},
			{
				setID: "getting-over-it_1",
				title: "Getting Over It",
				description: "Getting Over It",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Getting%20Over%20It/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/8d4e178c-81ec-4c71-af68-745b40733984/1",
			},
			{
				setID: "getting-over-it_2",
				title: "Getting Over It",
				description: "Getting Over It",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Getting%20Over%20It/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/bb620b42-e0e1-4373-928e-d4a732f99ccb/1",
			},
			{
				setID: "gingko-leaf",
				title: "Gingko Leaf",
				description: "This badge was earned by watching 30 minutes of a Ghost of Yotei stream during the game's launch!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/394abbbd-cc1d-427f-bc00-bce294353448/1",
			},
			{
				setID: "glhf-pledge",
				title: "GLHF Pledge",
				description: "Signed the GLHF pledge in support for inclusive gaming communities",
				clickAction: "VISIT_URL",
				clickURL: "https://www.anykey.org/pledge",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/1",
			},
			{
				setID: "glitchcon2020",
				title: "GlitchCon 2020",
				description: "Earned for Watching Glitchcon 2020",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/1d4b03b9-51ea-42c9-8f29-698e3c85be3d/1",
			},
			{
				setID: "global_mod",
				title: "Global Moderator",
				description: "Global Moderator",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9384c43e-4ce7-4e94-b2a1-b93656896eba/1",
			},
			{
				setID: "gold-pixel-heart",
				title: "Gold Pixel Heart",
				description: "Thank you for donating via the Twitch Charity tool during Twitch Together for Good 2023!",
				clickAction: "VISIT_URL",
				clickURL: "https://help.twitch.tv/s/article/twitch-charity",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/1687873b-cf38-412c-aad3-f9a4ce17f8b6/1",
			},
			{
				setID: "gold-pixel-heart---together-for-good-24",
				title: "Gold Pixel Heart - Together For Good '24",
				description: "This badge was earned by donating $50 or more as part of Twitch Together for Good 2024!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/52c90eac-b7ec-4e24-b500-8fceecfe91e8/1",
			},
			{
				setID: "gone-bananas",
				title: "Gone Bananas Badge",
				description: "This gilded banana badge was scored by sharing a lulz-worthy clip during April Fool’s week 2025.",
				clickAction: "VISIT_URL",
				clickURL: "http://blog.twitch.tv/2025/04/01/april-fools-day/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e2ba99f4-6079-44d1-8c07-4ca6b58de61f/1",
			},
			{
				setID: "gp-explorer-3",
				title: "GP Explorer 3",
				description: "This badge was earned by watching 15 minutes of GP Explorer 3 on any of the broadcasting channels.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/1e3b6965-2224-44d1-a67a-6d186c1fb17d/1",
			},
			{
				setID: "heavy-bullets_1",
				title: "Heavy Bullets",
				description: "Heavy Bullets",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Heavy%20Bullets/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/fc83b76b-f8b2-4519-9f61-6faf84eef4cd/1",
			},
			{
				setID: "hello_neighbor_1",
				title: "Hello Neighbor",
				description: "Hello Neighbor",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Hello%20Neighbor/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/030cab2c-5d14-11e7-8d91-43a5a4306286/1",
			},
			{
				setID: "hornet",
				title: "Hornet",
				description: "This badge was earned by subscribing to a streamer in the Hollow Knight: Silksong category during game launch week.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4dc7b047-8c59-4522-97f2-24fb63147f56/1",
			},
			{
				setID: "hype-train",
				title: "Current Hype Train Conductor",
				description: "Top supporter during the most recent hype train",
				clickAction: "VISIT_URL",
				clickURL: "https://help.twitch.tv/s/article/hype-train-guide",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/fae4086c-3190-44d4-83c8-8ef0cbe1a515/1",
			},
			{
				setID: "hype-train",
				title: "Former Hype Train Conductor",
				description: "Top supporter during prior hype trains",
				clickAction: "VISIT_URL",
				clickURL: "https://help.twitch.tv/s/article/hype-train-guide",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9c8d038a-3a29-45ea-96d4-5031fb1a7a81/1",
			},
			{
				setID: "innerspace_1",
				title: "Innerspace",
				description: "Innerspace",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Innerspace/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/97532ccd-6a07-42b5-aecf-3458b6b3ebea/1",
			},
			{
				setID: "innerspace_2",
				title: "Innerspace",
				description: "Innerspace",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Innerspace/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/fc7d6018-657a-40e4-9246-0acdc85886d1/1",
			},
			{
				setID: "jackbox-party-pack_1",
				title: "Jackbox Party Pack",
				description: "Jackbox Party Pack",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/The%20Jackbox%20Party%20Pack/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/0f964fc1-f439-485f-a3c0-905294ee70e8/1",
			},
			{
				setID: "kingdom-new-lands_1",
				title: "Kingdom: New Lands",
				description: "Kingdom: New Lands",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Kingdom:%20New%20Lands/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e3c2a67e-ef80-4fe3-ae41-b933cd11788a/1",
			},
			{
				setID: "la-velada-iv",
				title: "La Velada del Año IV",
				description: "This badge was earned for watching La Velada del Año IV!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/655dac77-0b2f-4b62-8871-6ae21f82b34e/1",
			},
			{
				setID: "la-velada-v-badge",
				title: "La Velada V Badge",
				description: "This badge was earned by watching La Velada V!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3f728095-b84d-4e7e-9eee-541ea02ddea0/1",
			},
			{
				setID: "league-of-legends-mid-season-invitational-2025---grey",
				title: "League of Legends Mid Season Invitational 2025 Support a Streamer",
				description: "This badge was earned by gifting a subscription to a streamer in the League of Legends category during MSI 2025.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/18a0b4ba-5f62-4e94-b6f1-481731608602/1",
			},
			{
				setID: "league-of-legends-mid-season-invitational-2025---purple",
				title: "League of Legends Mid Season Invitational 2025",
				description: "This badge was earned by subscribing to a lolesports channel during MSI 2025!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/0a99ba23-5e1a-46b7-8ff2-efbb9a6ea54c/1",
			},
			{
				setID: "legendus",
				title: "LEGENDUS",
				description: "This badge was granted to users who watched LEGENDUS ITADAKI, hosted by fps_shaka, on June 28-June 29, 2025.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/55c355cf-ddbf-4f12-8369-6554a1f78b6f/1",
			},
			{
				setID: "lol-worlds-2025",
				title: "LoL Worlds 2025",
				description: "This badge was earned by subscribing to a participating LoL Esports broadcast or co-stream of the 2025 League of Legends World Championship!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4545b0b5-c825-487e-8958-ce5512eb6f84/1",
			},
			{
				setID: "low",
				title: "Low",
				description: "This badge was earned by watching 30 minutes in the Little Nightmares III category during launch!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/58d48669-bfee-46e7-a83c-b65a30783400/1",
			},
			{
				setID: "marathon-reveal-runner",
				title: "Marathon Reveal Runner",
				description: "This badge was earned by subscribing during the Marathon reveal stream!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ae1c6c62-c057-4fad-a1d4-663bf988701f/1",
			},
			{
				setID: "mel",
				title: "Mel",
				description: "This badge was earned by subscribing or gifting a sub for a streamer in the Hades II category.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/8a7c1d1d-12bb-40d9-9be8-0a4fdf0d870c/1",
			},
			{
				setID: "minecraft-15th-anniversary-celebration",
				title: "Minecraft 15th Anniversary Celebration",
				description: "This badge was earned for using a special emote as part of Minecraft's 15th Anniversary Celebration on Twitch!",
				clickAction: "VISIT_URL",
				clickURL: "https://twitch-web.app.link/e/vkOhfCa7nJb",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/178077b2-8b86-4f8d-927c-66ed6c1b025f/1",
			},
			{
				setID: "moderator",
				title: "Moderator",
				description: "Moderator",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 1",
				description: "Earned for being a part of at least 1 moment on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/bf370830-d79a-497b-81c6-a365b2b60dda/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 10",
				description: "Earned for being a part of at least 75 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9c13f2b6-69cd-4537-91b4-4a8bd8b6b1fd/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 11",
				description: "Earned for being a part of at least 90 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/7573e7a2-0f1f-4508-b833-d822567a1e03/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 12",
				description: "Earned for being a part of at least 105 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f2c91d14-85c8-434b-a6c0-6d7930091150/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 13",
				description: "Earned for being a part of at least 120 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/35eb3395-a1d3-4170-969a-86402ecfb11a/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 14",
				description: "Earned for being a part of at least 140 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/cb40eb03-1015-45ba-8793-51c66a24a3d5/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 15",
				description: "Earned for being a part of at least 160 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/b241d667-280b-4183-96ae-2d0053631186/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 16",
				description: "Earned for being a part of at least 180 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5684d1bc-8132-4a4f-850c-18d3c5bd04f3/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 17",
				description: "Earned for being a part of at least 200 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3b08c1ee-0f77-451b-9226-b5b22d7f023c/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 18",
				description: "Earned for being a part of at least 225 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/14057e75-080c-42da-a412-6232c6f33b68/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 19",
				description: "Earned for being a part of at least 250 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/6100cc6f-6b4b-4a3d-a55b-a5b34edb5ea1/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 2",
				description: "Earned for being a part of at least 5 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/fc46b10c-5b45-43fd-81ad-d5cb0de6d2f4/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 20",
				description: "Earned for being a part of at least 275 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/43399796-e74c-4741-a975-56202f0af30e/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 3",
				description: "Earned for being a part of at least 10 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d08658d7-205f-4f75-ad44-8c6e0acd8ef6/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 4",
				description: "Earned for being a part of at least 15 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/fe5b5ddc-93e7-4aaf-9b3e-799cd41808b1/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 5",
				description: "Earned for being a part of at least 20 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c8a0d95a-856e-4097-9fc0-7765300a4f58/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 6",
				description: "Earned for being a part of at least 30 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f9e3b4e4-200e-4045-bd71-3a6b480c23ae/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 7",
				description: "Earned for being a part of at least 40 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a90a26a4-fdf7-4ac3-a782-76a413da16c1/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 8",
				description: "Earned for being a part of at least 50 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f22286cd-6aa3-42ce-b3fb-10f5d18c4aa0/1",
			},
			{
				setID: "moments",
				title: "Moments Badge - Tier 9",
				description: "Earned for being a part of at least 60 moments on a channel",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5cb2e584-1efd-469b-ab1d-4d1b59a944e7/1",
			},
			{
				setID: "no_audio",
				title: "Watching without audio",
				description: "Individuals with unreliable or no sound can select this badge",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0/1",
			},
			{
				setID: "no_video",
				title: "Listening only",
				description: "Individuals with unreliable or no video can select this badge",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/199a0dba-58f3-494e-a7fc-1fa0a1001fb8/1",
			},
			{
				setID: "okhlos_1",
				title: "Okhlos",
				description: "Okhlos",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Okhlos/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/dc088bd6-8965-4907-a1a2-c0ba83874a7d/1",
			},
			{
				setID: "overwatch-league-insider_1",
				title: "OWL All-Access Pass 2018",
				description: "OWL All-Access Pass 2018",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/overwatchleague",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/51e9e0aa-12e3-48ce-b961-421af0787dad/1",
			},
			{
				setID: "overwatch-league-insider_2018B",
				title: "OWL All-Access Pass 2018",
				description: "OWL All-Access Pass 2018",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/overwatchleague",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/34ec1979-d9bb-4706-ad15-464de814a79d/1",
			},
			{
				setID: "overwatch-league-insider_2019A",
				title: "OWL All-Access Pass 2019",
				description: "OWL All-Access Pass 2019",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/overwatchleague",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ab7fa7a7-c2d9-403f-9f33-215b29b43ce4/1",
			},
			{
				setID: "overwatch-league-insider_2019A",
				title: "OWL All-Access Pass 2019",
				description: "OWL All-Access Pass 2019",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/overwatchleague",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ca980da1-3639-48a6-95a3-a03b002eb0e5/1",
			},
			{
				setID: "overwatch-league-insider_2019B",
				title: "OWL All-Access Pass 2019",
				description: "OWL All-Access Pass 2019",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/overwatchleague",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/75f05d4b-3042-415c-8b0b-e87620a24daf/1",
			},
			{
				setID: "overwatch-league-insider_2019B",
				title: "OWL All-Access Pass 2019",
				description: "OWL All-Access Pass 2019",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/overwatchleague",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/765a0dcf-2a94-43ff-9b9c-ef6c209b90cd/1",
			},
			{
				setID: "overwatch-league-insider_2019B",
				title: "OWL All-Access Pass 2019",
				description: "OWL All-Access Pass 2019",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/overwatchleague",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a8ae0ccd-783d-460d-93ee-57c485c558a6/1",
			},
			{
				setID: "overwatch-league-insider_2019B",
				title: "OWL All-Access Pass 2019",
				description: "OWL All-Access Pass 2019",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/overwatchleague",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/be87fd6d-1560-4e33-9ba4-2401b58d901f/1",
			},
			{
				setID: "overwatch-league-insider_2019B",
				title: "OWL All-Access Pass 2019",
				description: "OWL All-Access Pass 2019",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/overwatchleague",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c5860811-d714-4413-9433-d6b1c9fc803c/1",
			},
			{
				setID: "partner",
				title: "Verified",
				description: "Verified",
				clickAction: "VISIT_URL",
				clickURL: "https://blog.twitch.tv/2017/04/24/the-verified-badge-is-here-13381bc05735",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1",
			},
			{
				setID: "path-of-exile-2-badge",
				title: "Chaos Orb",
				description: "This badge was earned by subscribing to a streamer during Path of Exile 2's launch!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/8bebe4ce-6c15-4746-8c33-42312c250ceb/1",
			},
			{
				setID: "pokemon-legends-z-a-chikorita",
				title: "Pokémon Legends: Z-A Chikorita",
				description: "This badge was earned by purchasing a subscription or gifting a subscription to a streamer playing Pokémon Legends: Z-A for Chikorita.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f479e945-987b-423a-a901-7b1c3b3003fb/1",
			},
			{
				setID: "pokemon-legends-z-a-tepig",
				title: "Pokémon Legends: Z-A Tepig",
				description: "This badge was earned by purchasing a subscription or gifting a subscription to a streamer playing Pokémon Legends Z-A for Tepig.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/34799f2e-e165-42a4-ae79-1c9c06cf1d55/1",
			},
			{
				setID: "pokemon-legends-z-a-totodile",
				title: "Pokémon Legends: Z-A Totodile",
				description: "This badge was earned by purchasing a subscription or gifting a subscription to a streamer playing Pokémon Legends: Z-A for Totodile.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/0bdb6906-ba8f-4fb6-bc9e-3aca04d3d501/1",
			},
			{
				setID: "power-rangers",
				title: "Black Ranger",
				description: "Black Ranger",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9edf3e7f-62e4-40f5-86ab-7a646b10f1f0/1",
			},
			{
				setID: "power-rangers",
				title: "Blue Ranger",
				description: "Blue Ranger",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/1eeae8fe-5bc6-44ed-9c88-fb84d5e0df52/1",
			},
			{
				setID: "power-rangers",
				title: "Green Ranger",
				description: "Green Ranger",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/21bbcd6d-1751-4d28-a0c3-0b72453dd823/1",
			},
			{
				setID: "power-rangers",
				title: "Pink Ranger",
				description: "Pink Ranger",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5c58cb40-9028-4d16-af67-5bc0c18b745e/1",
			},
			{
				setID: "power-rangers",
				title: "Red Ranger",
				description: "Red Ranger",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/8843d2de-049f-47d5-9794-b6517903db61/1",
			},
			{
				setID: "power-rangers",
				title: "White Ranger",
				description: "White Ranger",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/06c85e34-477e-4939-9537-fd9978976042/1",
			},
			{
				setID: "power-rangers",
				title: "Yellow Ranger",
				description: "Yellow Ranger",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d6dca630-1ca4-48de-94e7-55ed0a24d8d1/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (1)",
				description: "Predicted Outcome One",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e33d8b46-f63b-4e67-996d-4a7dcec0ad33/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (10)",
				description: "Predicted Outcome Ten",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/072ae906-ecf7-44f1-ac69-a5b2261d8892/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (2)",
				description: "Predicted Outcome Two",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ffdda3fe-8012-4db3-981e-7a131402b057/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (3)",
				description: "Predicted Outcome Three",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f2ab9a19-8ef7-4f9f-bd5d-9cf4e603f845/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (4)",
				description: "Predicted Outcome Four",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/df95317d-9568-46de-a421-a8520edb9349/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (5)",
				description: "Predicted Outcome Five",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/88758be8-de09-479b-9383-e3bb6d9e6f06/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (6)",
				description: "Predicted Outcome Six",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/46b1537e-d8b0-4c0d-8fba-a652e57b9df0/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (7)",
				description: "Predicted Outcome Seven",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/07cd34b2-c6a1-45f5-8d8a-131e3c8b2279/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (8)",
				description: "Predicted Outcome Eight",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4416dfd7-db97-44a0-98e7-40b4e250615e/1",
			},
			{
				setID: "predictions",
				title: "Predicted Blue (9)",
				description: "Predicted Outcome Nine",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/fc74bd90-2b74-4f56-8e42-04d405e10fae/1",
			},
			{
				setID: "predictions",
				title: "Predicted Gray (1)",
				description: "Predicted Gray (1)",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/144f77a2-e324-4a6b-9c17-9304fa193a27/1",
			},
			{
				setID: "predictions",
				title: "Predicted Gray (2)",
				description: "Predicted Gray (2)",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/097a4b14-b458-47eb-91b6-fe74d3dbb3f5/1",
			},
			{
				setID: "predictions",
				title: "Predicted Pink (1)",
				description: "Predicted Outcome One",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/75e27613-caf7-4585-98f1-cb7363a69a4a/1",
			},
			{
				setID: "predictions",
				title: "Predicted Pink (2)",
				description: "Predicted Outcome Two",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4b76d5f2-91cc-4400-adf2-908a1e6cfd1e/1",
			},
			{
				setID: "premium",
				title: "Prime Gaming",
				description: "Prime Gaming",
				clickAction: "VISIT_URL",
				clickURL: "https://gaming.amazon.com",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1",
			},
			{
				setID: "psychonauts_1",
				title: "Psychonauts",
				description: "Psychonauts",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Psychonauts/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a9811799-dce3-475f-8feb-3745ad12b7ea/1",
			},
			{
				setID: "purple-pixel-heart---together-for-good-24",
				title: "Purple Pixel Heart - Together For Good '24",
				description: "This badge was earned by donating $5 or more as part of Twitch Together for Good 2024!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/1afb4b76-8c34-4b7b-8beb-75f7e5d2a1ab/1",
			},
			{
				setID: "raging-wolf-helm",
				title: "Raging Wolf Helm",
				description: "This badge was earned for watching Elden Ring during the initial Shadow of the Erdtree Expansion launch!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3ff668be-59a3-4e3e-96af-e6b2908b3171/1",
			},
			{
				setID: "raiden-v-directors-cut_1",
				title: "Raiden V",
				description: "Raiden V",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Raiden%20V/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/441b50ae-a2e3-11e7-8a3e-6bff0c840878/1",
			},
			{
				setID: "rift_1",
				title: "RIFT",
				description: "RIFT",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Rift/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f939686b-2892-46a4-9f0d-5f582578173e/1",
			},
			{
				setID: "rplace-2023",
				title: "r/place 2023 Cake",
				description: "A very delicious badge earned by watching Reddit's r/place 2023 event on Twitch Rivals or other participating channels.",
				clickAction: "VISIT_URL",
				clickURL: "https://www.reddit.com/r/place/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e33e0c67-c380-4241-828a-099c46e51c66/1",
			},
			{
				setID: "ruby-pixel-heart---together-for-good-24",
				title: "Ruby Pixel Heart - Together For Good '24",
				description: "This badge was earned by donating $25 or more as part of Twitch Together for Good 2024!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ca0aa8ce-b2a8-4582-a5de-4d5b6915dc47/1",
			},
			{
				setID: "sajam-slam-badge",
				title: "Sajam Slam Badge",
				description: "This badge was earned by subscribing in the Street Fighter 6 category during TwitchCon 2025!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9fd798d6-3d67-4458-a916-9fd5d7286159/1",
			},
			{
				setID: "samusoffer_beta",
				title: "beta_title1",
				description: "beta_title1",
				clickAction: "VISIT_URL",
				clickURL: "https://twitch.amazon.com/prime",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/aa960159-a7b8-417e-83c1-035e4bc2deb5/1",
			},
			{
				setID: "share-the-love",
				title: "Share the Love",
				description: "This lovely badge was earned by users who shared their favorite Twitch clips in February 2025.",
				clickAction: "VISIT_URL",
				clickURL: "https://blog.twitch.tv/2025/02/14/share-the-love-this-valentine-s-day/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/2de71f4f-b152-4308-a426-127a4cf8003a/1",
			},
			{
				setID: "social-sharing",
				title: "Social Media Badge",
				description: "This user earned a Icon badge for reaching 100 views on their social posts.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d2030c7e-c400-4605-a2cf-ce32bd06af8f/1",
			},
			{
				setID: "social-sharing",
				title: "Social Media Badge",
				description: "This user earned a Legend badge for reaching 100000 views on their social posts.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/590698dd-2bc4-4401-817a-17c641f5e881/1",
			},
			{
				setID: "social-sharing",
				title: "Social Media Badge",
				description: "This user earned a Pro badge for reaching 10000 views on their social posts.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/fcca0804-1da5-4d00-ab06-7677676d4d8e/1",
			},
			{
				setID: "sonic-racing-crossworlds",
				title: "Sonic Racing",
				description: "This badge was earned by subscribing to a streamer in the Sonic Racing: Crossworlds category!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3c5a5ea0-714f-46da-b764-5e7ceba59fca/1",
			},
			{
				setID: "speedons-5-badge",
				title: "Speedons 5 Badge",
				description: "This badge was earned by watching Speedons 5!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/81d89508-850c-45ae-b0e2-dbbe6e531b8d/1",
			},
			{
				setID: "staff",
				title: "Staff",
				description: "Twitch Staff",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/jobs?ref=chat_badge",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/1",
			},
			{
				setID: "starbound_1",
				title: "Starbound",
				description: "Starbound",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Starbound/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e838e742-0025-4646-9772-18a87ba99358/1",
			},
			{
				setID: "strafe_1",
				title: "Strafe",
				description: "Strafe",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/strafe/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/0051508d-2d42-4e4b-a328-c86b04510ca4/1",
			},
			{
				setID: "stream-for-humanity-2-2025",
				title: "Stream For Humanity 2",
				description: "Earned by supporting the Stream For Humanity 2 charity marathon",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c02fbad3-aa4b-46d0-93a6-661719a19f1c/1",
			},
			{
				setID: "streamer-awards-2024",
				title: "Streamer Awards 2024",
				description: "You've completed all categories of the 2024 Twitch Predicts: The Streamer Awards extension!",
				clickAction: "VISIT_URL",
				clickURL: "https://thestreamerawards.com/home",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/efc07d3d-46e4-4738-827b-a5bf3508983a/1",
			},
			{
				setID: "sub-gift-leader",
				title: "Gifter Leader 1",
				description: "Ranked as a top subscription gifter in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/21656088-7da2-4467-acd2-55220e1f45ad/1",
			},
			{
				setID: "sub-gift-leader",
				title: "Gifter Leader 2",
				description: "Ranked as a top subscription gifter in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/0d9fe96b-97b7-4215-b5f3-5328ebad271c/1",
			},
			{
				setID: "sub-gift-leader",
				title: "Gifter Leader 3",
				description: "Ranked as a top subscription gifter in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4c6e4497-eed9-4dd3-ac64-e0599d0a63e5/1",
			},
			{
				setID: "sub-gifter",
				title: "10 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d333288c-65d7-4c7b-b691-cdd7b3484bf8/1",
			},
			{
				setID: "sub-gifter",
				title: "100 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/8343ada7-3451-434e-91c4-e82bdcf54460/1",
			},
			{
				setID: "sub-gifter",
				title: "1000 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/bfb7399a-c632-42f7-8d5f-154610dede81/1",
			},
			{
				setID: "sub-gifter",
				title: "150 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/514845ba-0fc3-4771-bce1-14d57e91e621/1",
			},
			{
				setID: "sub-gifter",
				title: "200 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c6b1893e-8059-4024-b93c-39c84b601732/1",
			},
			{
				setID: "sub-gifter",
				title: "2000 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4e8b3a32-1513-44ad-8a12-6c90232c77f9/1",
			},
			{
				setID: "sub-gifter",
				title: "25 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/052a5d41-f1cc-455c-bc7b-fe841ffaf17f/1",
			},
			{
				setID: "sub-gifter",
				title: "250 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/cd479dc0-4a15-407d-891f-9fd2740bddda/1",
			},
			{
				setID: "sub-gifter",
				title: "300 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9e1bb24f-d238-4078-871a-ac401b76ecf2/1",
			},
			{
				setID: "sub-gifter",
				title: "3000 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/b18852ba-65d2-4b84-97d2-aeb6c44a0956/1",
			},
			{
				setID: "sub-gifter",
				title: "350 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/6c4783cd-0aba-4e75-a7a4-f48a70b665b0/1",
			},
			{
				setID: "sub-gifter",
				title: "400 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/6f4cab6b-def9-4d99-ad06-90b0013b28c8/1",
			},
			{
				setID: "sub-gifter",
				title: "4000 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/efbf3c93-ecfa-4b67-8d0a-1f732fb07397/1",
			},
			{
				setID: "sub-gifter",
				title: "450 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/b593d68a-f8fb-4516-a09a-18cce955402c/1",
			},
			{
				setID: "sub-gifter",
				title: "5 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ee113e59-c839-4472-969a-1e16d20f3962/1",
			},
			{
				setID: "sub-gifter",
				title: "50 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c4a29737-e8a5-4420-917a-314a447f083e/1",
			},
			{
				setID: "sub-gifter",
				title: "500 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/60e9504c-8c3d-489f-8a74-314fb195ad8d/1",
			},
			{
				setID: "sub-gifter",
				title: "5000 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d775275d-fd19-4914-b63a-7928a22135c3/1",
			},
			{
				setID: "sub-gifter",
				title: "550 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/024d2563-1794-43ed-b8dc-33df3efae900/1",
			},
			{
				setID: "sub-gifter",
				title: "600 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/3ecc3aab-09bf-4823-905e-3a4647171fc1/1",
			},
			{
				setID: "sub-gifter",
				title: "650 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/eeabf43c-8e4c-448d-9790-4c2172c57944/1",
			},
			{
				setID: "sub-gifter",
				title: "700 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4a9acdc7-30be-4dd1-9898-fc9e42b3d304/1",
			},
			{
				setID: "sub-gifter",
				title: "750 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ca17277c-53e5-422b-8bb4-7c5dcdb0ac67/1",
			},
			{
				setID: "sub-gifter",
				title: "800 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9c1fb96d-0579-43d7-ba94-94672eaef63a/1",
			},
			{
				setID: "sub-gifter",
				title: "850 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/cc924aaf-dfd4-4f3f-822a-f5a87eb24069/1",
			},
			{
				setID: "sub-gifter",
				title: "900 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/193d86f6-83e1-428c-9638-d6ca9e408166/1",
			},
			{
				setID: "sub-gifter",
				title: "950 Gift Subs",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/7ce130bd-6f55-40cc-9231-e2a4cb712962/1",
			},
			{
				setID: "sub-gifter",
				title: "Sub Gifter",
				description: "Has gifted a subscription to another viewer in this community",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a5ef6c17-2e5b-4d8f-9b80-2779fd722414/1",
			},
			{
				setID: "subscriber",
				title: "2-Month Subscriber",
				description: "2-Month Subscriber",
				clickAction: "SUBSCRIBE",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/25a03e36-2bb2-4625-bd37-d6d9d406238d/1",
			},
			{
				setID: "subscriber",
				title: "3-Month Subscriber",
				description: "3-Month Subscriber",
				clickAction: "SUBSCRIBE",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e8984705-d091-4e54-8241-e53b30a84b0e/1",
			},
			{
				setID: "subscriber",
				title: "6-Month Subscriber",
				description: "1-Year Subscriber",
				clickAction: "SUBSCRIBE",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ed51a614-2c44-4a60-80b6-62908436b43a/1",
			},
			{
				setID: "subscriber",
				title: "6-Month Subscriber",
				description: "6-Month Subscriber",
				clickAction: "SUBSCRIBE",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/2d2485f6-d19b-4daa-8393-9493b019156b/1",
			},
			{
				setID: "subscriber",
				title: "9-Month Subscriber",
				description: "9-Month Subscriber",
				clickAction: "SUBSCRIBE",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/b4e6b13a-a76f-4c56-87e1-9375a7aaa610/1",
			},
			{
				setID: "subscriber",
				title: "Subscriber",
				description: "Subscriber",
				clickAction: "SUBSCRIBE",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
			},
			{
				setID: "subscriber",
				title: "Subscriber",
				description: "Subscriber",
				clickAction: "SUBSCRIBE",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
			},
			{
				setID: "subtember-2024",
				title: "SUBtember 2024",
				description: "For being Subbie's friend and participating in SUBtember 2024!",
				clickAction: "VISIT_URL",
				clickURL: "https://link.twitch.tv/subtember2024",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4149750c-9582-4515-9e22-da7d5437643b/1",
			},
			{
				setID: "subtember-2025",
				title: "SUBtember 2025",
				description: "Badge given to users who sub, gift, or use bits during SUBtember 2025.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a9c01f28-179e-486d-a4c7-2277e4f6adb4/1",
			},
			{
				setID: "superhot_1",
				title: "Superhot",
				description: "Superhot",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/superhot/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c5a06922-83b5-40cb-885f-bcffd3cd6c68/1",
			},
			{
				setID: "superultracombo-2023",
				title: "SuperUltraCombo 2023",
				description: "This user joined Twitch's SuperUltraCombo 2023",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/5864739a-5e58-4623-9450-a2c0555ef90b/1",
			},
			{
				setID: "survival-cup-4",
				title: "Survival Cup 4",
				description: "This badge was earned by subscribing or gifting a sub to a streamer during Survival Cup 4!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9ff55f50-2c2a-40c2-9863-158d5ac2d5fd/1",
			},
			{
				setID: "the-first-descendant-badge",
				title: "The First Descendant Badge",
				description: "This badge was earned by subscribing to a streamer playing The First Descendant during launch week!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a56ef091-e8cd-49bd-9de9-7b342c9a7e7e/1",
			},
			{
				setID: "the-game-awards-2023",
				title: "The Game Awards 2023",
				description: "You’ve completed all categories of the 2023 Twitch Predicts: The Game Awards extension!",
				clickAction: "VISIT_URL",
				clickURL: "https://blog.twitch.tv/2023/11/30/the-2023-game-awards-is-live-on-twitch-december-7th/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/10cf46de-61e7-4a42-807a-7898408ce352/1",
			},
			{
				setID: "the-golden-predictor-of-the-game-awards-2023",
				title: "The Golden Predictor of the Game Awards 2023",
				description: "You've predicted the entire 2023 Game Awards perfectly, here is a special gift for your work. Go ahead, show it off!",
				clickAction: "VISIT_URL",
				clickURL: "https://blog.twitch.tv/2023/11/30/the-2023-game-awards-is-live-on-twitch-december-7th/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c84c4dd7-9318-4e8b-9f01-1612d3f83dae/1",
			},
			{
				setID: "the-man-without-fear",
				title: "The Man Without Fear",
				description: "This badge was earned by subscribing or gifting a sub to a streamer in the Marvel Rivals category for the start of Season 4.5!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4ca893e7-6ee3-4437-acdd-071340913d3c/1",
			},
			{
				setID: "the-onryos-mask",
				title: "The Onryō's Mask",
				description: "This badge was earned by subscribing to a Ghost of Yotei streamer during the game's launch!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e0d21894-8d58-4266-9127-b1bd61177899/1",
			},
			{
				setID: "the-surge_1",
				title: "The Surge",
				description: "The Surge",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/The%20Surge/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c9f69d89-31c8-41aa-843b-fee956dfbe23/1",
			},
			{
				setID: "the-surge_2",
				title: "The Surge",
				description: "The Surge",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/The%20Surge/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/2c4d7e95-e138-4dde-a783-7956a8ecc408/1",
			},
			{
				setID: "the-surge_3",
				title: "The Surge",
				description: "The Surge",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/The%20Surge/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/0a8fc2d4-3125-4ccb-88db-e970dfbee189/1",
			},
			{
				setID: "this-war-of-mine_1",
				title: "This War of Mine",
				description: "This War of Mine",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/This%20War%20of%20Mine/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/6a20f814-cb2c-414e-89cc-f8dd483e1785/1",
			},
			{
				setID: "titan-souls_1",
				title: "Titan Souls",
				description: "Titan Souls",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Titan%20Souls/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/092a7ce2-709c-434f-8df4-a6b075ef867d/1",
			},
			{
				setID: "together-for-good-25---good-badge",
				title: "Together for Good '25 - Good Badge",
				description: "This badge was earned by donating $5 or more during Twitch Together for Good 2025!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/192fb627-82b3-46e8-95d3-ac9feba4b1bc/1",
			},
			{
				setID: "together-for-good-25---gooder-badge",
				title: "Together for Good '25 - Gooder Badge",
				description: "This badge was earned by donating $50 or more during Twitch Together for Good 2025!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/84a37e81-9d61-4c29-970e-64a32ec040c7/1",
			},
			{
				setID: "together-for-good-25---goodest-badge",
				title: "Together for Good '25 - Goodest Badge",
				description: "This badge was earned by donating $100 or more during Twitch Together for Good 2025!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/928b8033-3777-49cb-a056-230135a08a62/1",
			},
			{
				setID: "together-for-good-25---wicked-dub-badge",
				title: "Together for Good '25 - Wicked Dub Badge",
				description: "This badge was earned by donating at least $5 to a charity stream using Stream Together during Together for Good 2025!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/9ddae219-6674-4fbc-add9-6e4e6572ea8e/1",
			},
			{
				setID: "touch-grass",
				title: "Touch Grass",
				description: "This badge was earned by users who touched grass and shared their favorite IRL clips in August 2025.",
				clickAction: "VISIT_URL",
				clickURL: "https://help.twitch.tv/s/article/twitch-chat-badges-guide",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/51f536c1-96ca-495b-bc11-150c857a6d54/1",
			},
			{
				setID: "treasure-adventure-world_1",
				title: "Treasure Adventure World",
				description: "Treasure Adventure World",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Treasure%20Adventure%20World/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/59810027-2988-4b0d-b88d-fc414c751305/1",
			},
			{
				setID: "turbo",
				title: "Turbo",
				description: "A subscriber of Twitch's monthly premium user service",
				clickAction: "GET_TURBO",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1",
			},
			{
				setID: "twitch-dj",
				title: "Twitch DJ",
				description: "This user is a DJ in the Twitch DJ Program.",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/dj-program",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/cf91bbc0-0332-413a-a7f3-e36bac08b624/1",
			},
			{
				setID: "twitch-intern-2022",
				title: "Twitch Intern 2022",
				description: "This user was an intern at Twitch for the summer of 2022",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/jobs/early-career/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/91ed38ea-32fe-4f14-8db1-852537d19aa5/1",
			},
			{
				setID: "twitch-intern-2023",
				title: "Twitch Intern 2023",
				description: "This user was an intern at Twitch for the summer of 2023",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/jobs/early-career/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e239e7e0-e373-4fdf-b95e-3469aec28485/1",
			},
			{
				setID: "twitch-intern-2024",
				title: "Twitch Intern 2024",
				description: "This user was an intern at Twitch for the summer of 2024",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/jobs/early-career/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ae96ce48-e764-4232-aa48-d9abf9a5fdab/1",
			},
			{
				setID: "twitch-recap-2023",
				title: "Twitch Recap 2023",
				description: "This user bled purple like it was their job, and was one of the most engaged members of Twitch in 2023!",
				clickAction: "VISIT_URL",
				clickURL: "https://twitch-web.app.link/e/twitch-recap",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/4d9e9812-ba9b-48a6-8690-13f3f338ee65/1",
			},
			{
				setID: "twitch-recap-2024",
				title: "Twitch Recap 2024",
				description: "The Official Chat Badge of the Year. It takes hard work and KomodoHype to receive it. You should be proud to tell everyone you know about this.",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/annual-recap",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/72f2a6ac-3d9b-4406-b9e9-998b27182f61/1",
			},
			{
				setID: "twitchbot",
				title: "AutoMod",
				description: "AutoMod",
				clickAction: "VISIT_URL",
				clickURL: "http://link.twitch.tv/automod_blog",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/df9095f6-a8a0-4cc2-bb33-d908c0adffb8/1",
			},
			{
				setID: "twitchbot",
				title: "AutoMod",
				description: "Badge type for messages that come from the automated moderation system",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/8dbdfef5-0901-457f-a644-afa77ba176e5/1",
			},
			{
				setID: "twitchcon-2024---rotterdam",
				title: "TwitchCon 2024 - Rotterdam",
				description: "Attended TwitchCon Rotterdam 2024",
				clickAction: "VISIT_URL",
				clickURL: "https://twitchcon.com/rotterdam-2024/?utm_source=twitch&utm_medium=chat-badge&utm_campaign=tceu24-chat-badge",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/95b10c66-775c-4652-9b86-10bd3a709422/1",
			},
			{
				setID: "twitchcon-2024---san-diego",
				title: "TwitchCon 2024 - San Diego",
				description: "Attended TwitchCon San Diego 2024",
				clickAction: "VISIT_URL",
				clickURL: "https://twitchcon.com/san-diego-2024/?utm_source=twitch&utm_medium=chat-badge&utm_campaign=tcsd24-chat-badge",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/6575f0d1-2dc2-4f45-a13f-a1a969dcf8fa/1",
			},
			{
				setID: "twitchcon-2025---rotterdam",
				title: "TwitchCon 2025",
				description: "Celebrated TwitchCon’s 10 year anniversary in 2025",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/rotterdam-2025/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/f4d97fd0-437f-4d8d-b4d3-4b6d18e4705b/1",
			},
			{
				setID: "twitchcon-referral-program-2025-bleedpurple",
				title: "TwitchCon Referral Program 2025 (bleedPurple)",
				description: "This badge was earned by referring ten friends who bought their TwitchCon 2025 ticket using your unique referral link.",
				clickAction: "VISIT_URL",
				clickURL: "https://twitchcon.com/rotterdam-2025/referral-program/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/81952c7b-cfec-479c-a8f6-2bccc296786c/1",
			},
			{
				setID: "twitchcon-referral-program-2025-chrome-star",
				title: "TwitchCon Referral Program 2025 (Chrome Star)",
				description: "This badge was earned by referring at least one friend who bought their TwitchCon 2025 ticket using your unique referral link.",
				clickAction: "VISIT_URL",
				clickURL: "https://twitchcon.com/rotterdam-2025/referral-program/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/d139bccf-8184-4fec-a970-cd8d81a7f51a/1",
			},
			{
				setID: "twitchcon2017",
				title: "TwitchCon 2017 - Long Beach",
				description: "Attended TwitchCon Long Beach 2017",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/0964bed0-5c31-11e7-a90b-0739918f1d9b/1",
			},
			{
				setID: "twitchcon2018",
				title: "TwitchCon 2018 - San Jose",
				description: "Attended TwitchCon San Jose 2018",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/?utm_source=twitch-chat&utm_medium=badge&utm_campaign=tc18",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e68164e4-087d-4f62-81da-d3557efae3cb/1",
			},
			{
				setID: "twitchconAmsterdam2020",
				title: "TwitchCon 2020 - Amsterdam",
				description: "Registered for TwitchCon Amsterdam 2020",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/amsterdam/?utm_source=twitch-chat&utm_medium=badge&utm_campaign=tcamsterdam20",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ed917c9a-1a45-4340-9c64-ca8be4348c51/1",
			},
			{
				setID: "twitchconEU2019",
				title: "TwitchCon 2019 - Berlin",
				description: "Attended TwitchCon Berlin 2019",
				clickAction: "VISIT_URL",
				clickURL: "https://europe.twitchcon.com/?utm_source=twitch-chat&utm_medium=badge&utm_campaign=tceu19",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/590eee9e-f04d-474c-90e7-b304d9e74b32/1",
			},
			{
				setID: "twitchconEU2022",
				title: "TwitchCon 2022 - Amsterdam",
				description: "Attended TwitchCon Amsterdam 2022",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/amsterdam-2022/?utm_source=twitch-chat&utm_medium=badge&utm_campaign=tceu22",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/e4744003-50b7-4eb8-9b47-a7b1616a30c6/1",
			},
			{
				setID: "twitchconEU2023",
				title: "TwitchCon 2023 - Paris",
				description: "TwitchCon 2023 - Paris",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/paris-2023/?utm_source=chat_badge",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/a8f2084e-46b9-4bb9-ae5e-00d594aafc64/1",
			},
			{
				setID: "twitchconNA2019",
				title: "TwitchCon 2019 - San Diego",
				description: "Attended TwitchCon San Diego 2019",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/?utm_source=twitch-chat&utm_medium=badge&utm_campaign=tcna19",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/569c829d-c216-4f56-a191-3db257ed657c/1",
			},
			{
				setID: "twitchconNA2020",
				title: "TwitchCon 2020 - North America",
				description: "Registered for TwitchCon North America 2020",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/?utm_source=twitch-chat&utm_medium=badge&utm_campaign=tcna20",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ed917c9a-1a45-4340-9c64-ca8be4348c51/1",
			},
			{
				setID: "twitchconNA2022",
				title: "TwitchCon 2022 - San Diego",
				description: "Attended TwitchCon San Diego 2022",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/san-diego-2022/?utm_source=twitch-chat&utm_medium=badge&utm_campaign=tcna22",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/344d429a-0b34-48e5-a84c-14a1b5772a3a/1",
			},
			{
				setID: "twitchconNA2023",
				title: "TwitchCon 2023 - Las Vegas",
				description: "Attended TwitchCon Las Vegas 2023",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitchcon.com/en/las-vegas-2023/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c90a753f-ab20-41bc-9c42-ede062485d2c/1",
			},
			{
				setID: "tyranny_1",
				title: "Tyranny",
				description: "Tyranny",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/game/Tyranny/details",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/0c79afdf-28ce-4b0b-9e25-4f221c30bfde/1",
			},
			{
				setID: "user-anniversary",
				title: "Twitchiversary Badge",
				description: "Staff badge celebrating Twitch tenure",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/ccbbedaa-f4db-4d0b-9c2a-375de7ad947c/1",
			},
			{
				setID: "vct-paris-2025",
				title: "VCT Paris 2025",
				description: "This badge was earned by subscribing to a VALORANT streamer while watching VALORANT Champions 2025!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/63c91cf1-53d1-4ee9-821f-b4d6e4144e8e/1",
			},
			{
				setID: "vga-champ-2017",
				title: "2017 VGA Champ",
				description: "2017 VGA Champ",
				clickAction: "VISIT_URL",
				clickURL: "https://blog.twitch.tv/watch-and-co-stream-the-game-awards-this-thursday-on-twitch-3d8e34d2345d",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/03dca92e-dc69-11e7-ac5b-9f942d292dc7/1",
			},
			{
				setID: "video-games-day",
				title: "Video Games Day",
				description: "This badge was earned by users who downloaded and shared clips revolving around anything Video Games related in September 2025.",
				clickAction: "VISIT_URL",
				clickURL: "https://www.twitch.tv/directory/gaming",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/34a57a67-b058-45a9-b088-da681aebc83e/1",
			},
			{
				setID: "vip",
				title: "VIP",
				description: "VIP",
				clickAction: "VISIT_URL",
				clickURL: "https://help.twitch.tv/customer/en/portal/articles/659115-twitch-chat-badges-guide",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1",
			},
			{
				setID: "warcraft",
				title: "Alliance",
				description: "For Lordaeron!",
				clickAction: "VISIT_URL",
				clickURL: "http://warcraftontwitch.tv/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/c4816339-bad4-4645-ae69-d1ab2076a6b0/1",
			},
			{
				setID: "warcraft",
				title: "Horde",
				description: "For the Horde!",
				clickAction: "VISIT_URL",
				clickURL: "http://warcraftontwitch.tv/",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/de8b26b6-fd28-4e6c-bc89-3d597343800d/1",
			},
			{
				setID: "zevent-2024",
				title: "ZEVENT 2024",
				description: "This badge was earned for watching ZEVENT 2024!",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/2040d479-b815-4617-8a55-9aed027e30d0/1",
			},
			{
				setID: "zevent25",
				title: "ZEVENT25",
				description: "This badge was earned by watching a ZEvent25 stream.",
				clickAction: "",
				clickURL: "",
				imageURL: "https://static-cdn.jtvnw.net/badges/v1/7c39aa87-4659-4e8f-abaf-c29614cd8a29/1",
			},
		],
	};

	console.debug(json.badges);

	const globalBadgesEl = document.querySelector("#global-badges") as HTMLElement;
	let badgesHtml = "";
	for (const badge of json.badges) {
		badgesHtml += `<img src="${badge.imageURL.substring(0, badge.imageURL.length - 1) + "2"}" />\n`;
	}
	globalBadgesEl.innerHTML = badgesHtml;
}

function openBadgeModal(selectorIndex: number) {
	badgeSelectorModalEl.dataset.selectorIndex = selectorIndex.toString();
	badgeSelectorModalEl.style.removeProperty("display");
}

function closeBadgeModal(badgeSrc: string | false | undefined = undefined) {
	const selectorIndex = parseInt(badgeSelectorModalEl.dataset.selectorIndex || "-1");
	console.debug(`badge selector ${selectorIndex}`);

	if (badgeSrc === false) {
		settings.badges[selectorIndex] = "";
	} else if (badgeSrc) {
		if (badgeSrc.endsWith("/2")) badgeSrc = badgeSrc.substring(0, badgeSrc.length - 1) + "3";

		console.debug(`badge src ${badgeSrc}`);

		settings.badges[selectorIndex] = badgeSrc;
	}
	saveSettings();

	delete badgeSelectorModalEl.dataset.index;
	badgeSelectorModalEl.style.display = "none";

	console.log(settings.badges);
	updateElementsFromSettings();
}

function centerPreview() {
	previewMessageEl.style.left = `${previewMessageContainerEl.clientWidth / 2 - previewMessageEl.clientWidth / 2}px`;
	previewMessageEl.style.top = `${previewMessageContainerEl.clientHeight / 2 - previewMessageEl.clientHeight / 2}px`;
}

function renderPreview() {
	console.debug(settings);

	outlineThicknessValueEl.innerText = settings.outline.thickness.toString();

	backgroundOpacityValueEl.innerText = settings.background.opacity.toFixed(2);
	backgroundColorEl.style.opacity = settings.background.opacity.toString();

	previewBackgroundEl.style.backgroundColor = `${settings.background.color}${floatToHex(settings.background.opacity)}`;

	if (previewBackgroundCheckboxEl.checked) {
		previewBackgroundContainerEl.style.display = "block";
	} else {
		previewBackgroundContainerEl.style.display = "none";
	}

	previewMessageContentEl.style.maxWidth = settings.wrap ? "291px" : "auto";
	previewMessageContentEl.style.color = settings.username.color;
	previewMessageContentEl.style.webkitTextStrokeColor = settings.outline.color;
	previewMessageContentEl.style.webkitTextStrokeWidth = `${settings.outline.thickness}px`;

	if (settings.badges) {
		previewMessageBadgesEl.innerHTML = settings.badges
			.map((src) => {
				if (src) return `<img src="${src}" />`;
			})
			.join("\n");
	}

	previewMessageAuthorEl.style.color = settings.username.color;
	previewMessageAuthorEl.innerText = settings.username.text;

	previewMessageBodyEl.style.color = settings.message.color;
	previewMessageBodyEl.innerText = settings.message.text;

	centerPreview();
}

function saveSettings() {
	window.localStorage.setItem("settings", JSON.stringify(settings));
}

function updateElementsFromSettings() {
	for (let i = 0; i < badgeSelectorEls.length; i++) {
		badgeSelectorEls[i].setAttribute("data", settings.badges[i]);
	}

	usernameColorEl.value = settings.username.color;
	usernameTextEl.value = settings.username.text;

	messageColorEl.value = settings.message.color;
	messageTextEl.value = settings.message.text;

	outlineColorEl.value = settings.outline.color;
	outlineSliderEl.value = settings.outline.thickness.toString();

	backgroundColorEl.value = settings.background.color;
	backgroundSliderEl.value = settings.background.opacity.toString();

	wrappingCheckboxEl.checked = settings.wrap;
	upscaleCheckboxEl.checked = settings.upscale;

	renderPreview();
}

function updateSettingsFromElements() {
	settings.username = {
		color: usernameColorEl.value,
		text: usernameTextEl.value,
	};

	settings.message = {
		color: messageColorEl.value,
		text: messageTextEl.value,
	};

	settings.outline = {
		color: outlineColorEl.value,
		thickness: parseFloat(outlineSliderEl.value),
	};

	settings.background = {
		color: backgroundColorEl.value,
		opacity: parseFloat(backgroundSliderEl.value),
	};

	settings.wrap = wrappingCheckboxEl.checked;
	settings.upscale = upscaleCheckboxEl.checked;

	renderPreview();
	saveSettings();
}

window.addEventListener("DOMContentLoaded", async () => {
	findAllElements();

	const settingsStored = window.localStorage.getItem("settings");
	if (settingsStored) {
		settings = JSON.parse(settingsStored);
	} else {
		settings = defaultSettings;
		saveSettings();
	}

	updateElementsFromSettings();

	settingsEl.addEventListener("input", updateSettingsFromElements);
	previewBackgroundCheckboxEl.addEventListener("input", updateSettingsFromElements);
	upscaleCheckboxEl.addEventListener("input", updateSettingsFromElements);
	exportButtonEl.addEventListener("click", exportPng);
	removeBadgeButtonEl.addEventListener("click", () => closeBadgeModal(false));

	setInterval(centerPreview, 100);

	await fetchGlobalBadges();

	badgeSelectorEls.forEach((badgeSelectorEl, i) => badgeSelectorEl.addEventListener("click", () => openBadgeModal(i)));
	badgeSelectorModalEl.addEventListener("click", (e) => {
		const el = e.target as HTMLElement;
		if (el) {
			if (el == badgeSelectorModalEl) {
				closeBadgeModal();
			} else if (el.nodeName == "IMG") {
				closeBadgeModal((el as HTMLImageElement).src);
			}
		}
	});
});

function floatToHex(float: number) {
	return Math.floor(float * 255)
		.toString(16)
		.padStart(2, "0");
}

function findAllElements() {
	settingsEl = document.querySelector("#settings") as HTMLElement;

	badgeSelectorEls = Array.from(document.querySelectorAll(".badge-selector"));
	badgeSelectorModalEl = document.querySelector("#badge-selector-modal") as HTMLElement;
	removeBadgeButtonEl = document.querySelector("#remove-badge-button") as HTMLElement;

	usernameColorEl = document.querySelector("#username-color") as HTMLInputElement;
	usernameTextEl = document.querySelector("#username-text") as HTMLInputElement;

	messageColorEl = document.querySelector("#message-color") as HTMLInputElement;
	messageTextEl = document.querySelector("#message-text") as HTMLInputElement;

	outlineColorEl = document.querySelector("#outline-color") as HTMLInputElement;
	outlineSliderEl = document.querySelector("#outline-slider") as HTMLInputElement;
	outlineThicknessValueEl = document.querySelector("#outline-thickness") as HTMLElement;

	backgroundColorEl = document.querySelector("#background-color") as HTMLInputElement;
	backgroundSliderEl = document.querySelector("#background-slider") as HTMLInputElement;
	backgroundOpacityValueEl = document.querySelector("#background-opacity") as HTMLElement;

	wrappingCheckboxEl = document.querySelector("#wrapping-checkbox") as HTMLInputElement;

	previewBackgroundCheckboxEl = document.querySelector("#preview-background-checkbox") as HTMLInputElement;

	upscaleCheckboxEl = document.querySelector("#upscale-checkbox") as HTMLInputElement;

	previewBackgroundContainerEl = document.querySelector("#preview-background-container") as HTMLElement;
	previewBackgroundEl = document.querySelector("#preview-background") as HTMLElement;
	previewMessageContainerEl = document.querySelector("#preview-message-container") as HTMLElement;
	previewMessageEl = document.querySelector("#preview-message") as HTMLElement;
	previewMessageContentEl = document.querySelector("#preview-message-content") as HTMLElement;
	previewMessageBadgesEl = document.querySelector("#preview-message-badges") as HTMLElement;
	previewMessageAuthorEl = document.querySelector("#preview-message-author") as HTMLElement;
	previewMessageBodyEl = document.querySelector("#preview-message-body") as HTMLElement;

	exportButtonEl = document.querySelector("#export-button") as HTMLButtonElement;
}
