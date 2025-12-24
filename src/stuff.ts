import { snapdom } from "@zumer/snapdom";
import { downloadDir } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { writeImage } from "@tauri-apps/plugin-clipboard-manager";
import { Image } from "@tauri-apps/api/image";

let settingsEl: HTMLElement;

let badgeSelectorEls: HTMLImageElement[];
let badgeSelectorModalEl: HTMLElement;
let badgeSelectorModalContainerEl: HTMLElement;
let badgeTooltipEl: HTMLElement;
let globalBadgesSearchEl: HTMLInputElement;
let removeBadgeButtonEl: HTMLElement;

let usernameColorEl: HTMLInputElement;
let usernameTextEl: HTMLInputElement;

let userPresetsButtonEl: HTMLElement;
let userPresetsModalEl: HTMLElement;
let userPresetsModalContainerEl: HTMLElement;
let userPresetsAddButtonEl: HTMLElement;

let messageColorEl: HTMLInputElement;
let messageTextEl: HTMLInputElement;

let outlineColorEl: HTMLInputElement;
let outlineSliderEl: HTMLInputElement;
let outlineThicknessValueEl: HTMLElement;

let backgroundColorEl: HTMLInputElement;
let backgroundSliderEl: HTMLInputElement;
let backgroundOpacityValueEl: HTMLElement;

let emotesChannelTextEl: HTMLInputElement;
let emotesTwitchCheckboxEl: HTMLInputElement;
let emotesFfvCheckboxEl: HTMLInputElement;
let emotesBttvCheckboxEl: HTMLInputElement;
let emotesSeventvCheckboxEl: HTMLInputElement;
let emotesSaveButtonEl: HTMLInputElement;

let wrappingCheckboxEl: HTMLInputElement;

let highlightCheckboxEl: HTMLInputElement;

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

interface Emote {
	token: string;
	id: string;
	type: "twitch" | "ffz" | "bttv" | "seventv";
}

interface UserPreset {
	badges: string[];
	username: {
		color: string;
		text: string;
	};
}

interface GlobalBadges {
	last_fetched: number;
	fetch_cooldown: number;
	badges: any[];
}

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
	emotes: {
		channel: string;
		twitch: boolean;
		ffz: boolean;
		bttv: boolean;
		seventv: boolean;
	};
	wrap: boolean;
	upscale: boolean;
	font: string;
	userPresets: UserPreset[];
	highlight: boolean;
}

const defaultSettings: Settings = {
	version: 5,
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
	emotes: {
		channel: "",
		twitch: true,
		ffz: false,
		bttv: false,
		seventv: false,
	},
	wrap: false,
	upscale: true,
	font: "Inter",
	userPresets: [
		{
			badges: [
				"https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
				"https://static-cdn.jtvnw.net/badges/v1/01998862-3032-4f9c-bc81-fd78b0c35763/3",
				"https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
				"",
			],
			username: {
				color: "#5e8b69",
				text: "Liam",
			},
		},
	],
	highlight: false,
};

let settings: Settings;
let exporting = false;
let globalBadgeFetchCooldown = 3 * 60 * 60 * 1000;
let emotes: Emote[] = [];

async function exportPng() {
	if (exporting) return;
	exporting = true;

	renderPreview();

	if (previewMessageEl) {
		const path = await save({
			defaultPath: `${await downloadDir()}/chatforge-${Date.now()}.png`,
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
			const image = await Image.fromBytes(bytes);

			await writeFile(path, bytes);
			await writeImage(image);
		}
	}

	exporting = false;
}

async function fetchGlobalBadges() {
	let globalBadges: GlobalBadges;

	const globalBadgesStored = window.localStorage.getItem("global_badges");
	if (globalBadgesStored) {
		globalBadges = JSON.parse(globalBadgesStored);
	} else {
		globalBadges = {
			last_fetched: -1,
			fetch_cooldown: globalBadgeFetchCooldown,
			badges: [],
		};
	}

	if (Date.now() - globalBadges.fetch_cooldown > globalBadges.last_fetched) {
		const url = "https://api.twitchinsights.net/v1/badges/global";
		const res = await fetch(url);
		const json = await res.json();

		globalBadges = {
			last_fetched: Date.now(),
			fetch_cooldown: globalBadgeFetchCooldown,
			badges: json.badges,
		};
	}

	const settingsStored = window.localStorage.getItem("settings");
	if (settingsStored) {
		settings = JSON.parse(settingsStored);
	} else {
		settings = defaultSettings;
		saveSettings();
	}

	window.localStorage.setItem("global_badges", JSON.stringify(globalBadges));

	const globalBadgesEls = document.querySelectorAll(".global-badges");
	let badgesHtml = "";
	for (const badge of globalBadges.badges) {
		badgesHtml += `<img src="${badge.imageURL.substring(0, badge.imageURL.length - 1) + "2"}" data-badge="${badge.title}" />\n`;
	}

	for (const globalBadgesEl of globalBadgesEls) globalBadgesEl.innerHTML = badgesHtml;
}

function renderUserPresets() {
	let html = "";

	for (let i = 0; i < settings.userPresets.length; i++) {
		const preset = settings.userPresets[i];

		html += `<div class="flex group items-center gap-1 rounded hover:bg-neutral-300 py-1 px-2 cursor-pointer **:pointer-events-none" data-userpreset="${i}">`;

		html += preset.badges
			.map((src) => {
				if (src) return `<img class="h-5" src="${src}" />`;
			})
			.join("\n");

		html += `<span class="font-bold drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" style="color: ${preset.username.color}">${preset.username.text}</span>`;

		html += `<span class="text-xs text-neutral-500 ml-auto hidden group-hover:block pointer-events-auto! px-1 py-px rounded hover:bg-red-400 hover:text-white" id="user-presets-detete-button">✖</span>`;
		html += `</div>`;
	}

	document.querySelector("#user-presets-list")!.innerHTML = html;
}

function openUserPresetsModal() {
	userPresetsModalEl.style.removeProperty("display");

	renderUserPresets();
}

function closeUserPresetsModal(presetIndex: number | undefined = undefined) {
	if (presetIndex != undefined) {
		const preset = settings.userPresets[presetIndex];
		console.debug(`user preset ${preset}`);

		settings.badges = preset.badges;
		settings.username = preset.username;
	}

	saveSettings();

	userPresetsModalContainerEl.scrollTo(0, 0);
	userPresetsModalEl.style.display = "none";

	updateElementsFromSettings();
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
	badgeSelectorModalContainerEl.scrollTo(0, 0);
	globalBadgesSearchEl.value = "";
	searchGlobalBadges("");
	badgeSelectorModalEl.style.display = "none";

	console.debug(settings.badges);
	updateElementsFromSettings();
}

function searchGlobalBadges(query: string) {
	const globalBadgesEl = document.querySelector("#global-badges-container") as HTMLElement;
	const resultsEl = document.querySelector("#global-badges-results") as HTMLElement;

	if (query) {
		globalBadgesEl.style.display = "none";
		resultsEl.style.removeProperty("display");

		const badgeEls = resultsEl.querySelectorAll("img");
		for (const badge of badgeEls) {
			const dumbName = badge.dataset.badge?.toLowerCase().replace(/\s/g, "") as string;
			const dumbQuery = query.toLowerCase().replace(/\s/g, "");

			badge.style.display = dumbName.includes(dumbQuery) ? "block" : "none";
		}
	} else {
		globalBadgesEl.style.removeProperty("display");
		resultsEl.style.display = "none";
	}
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

	previewMessageContentEl.style.width = settings.wrap ? "291px" : "fit-content";
	previewMessageContentEl.style.color = settings.message.color;
	previewMessageContentEl.style.webkitTextStrokeColor = settings.outline.color;
	previewMessageContentEl.style.webkitTextStrokeWidth = `${settings.outline.thickness}px`;

	if (settings.highlight) {
		document.querySelector("#preview-message")?.classList.add("preview-message-highlight");
	} else {
		document.querySelector("#preview-message")?.classList.remove("preview-message-highlight");
	}

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

	const tokens = settings.message.text.trim().split(" ");
	for (let i = 0; i < tokens.length; i++) {
		const emoteToken = emotes.find((emote) => emote.token == tokens[i]);
		console.log(emotes.length);
		if (emoteToken) {
			tokens[i] = `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${emoteToken.id}/default/dark/3.0" />`;
		}
	}
	previewMessageBodyEl.innerHTML = tokens.join(" ");

	previewMessageEl.style.fontFamily = settings.font;

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

	emotesChannelTextEl.value = settings.emotes.channel;
	emotesTwitchCheckboxEl.checked = settings.emotes.twitch;
	emotesFfvCheckboxEl.checked = settings.emotes.ffz;
	emotesBttvCheckboxEl.checked = settings.emotes.bttv;
	emotesSeventvCheckboxEl.checked = settings.emotes.seventv;

	wrappingCheckboxEl.checked = settings.wrap;
	highlightCheckboxEl.checked = settings.highlight;
	upscaleCheckboxEl.checked = settings.upscale;

	(document.querySelector(`input[name='font'][value='${settings.font}']`) as HTMLInputElement).checked = true;

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
	settings.highlight = highlightCheckboxEl.checked;
	settings.upscale = upscaleCheckboxEl.checked;

	settings.font = (document.querySelector("input[name='font']:checked") as HTMLInputElement).value;

	renderPreview();
	saveSettings();
}

function upgradeSettings() {
	if (settings.version < 2) {
		settings.font = defaultSettings.font;
		settings.version = 2;
	}

	if (settings.version < 3) {
		settings.userPresets = defaultSettings.userPresets;
		settings.version = 3;
	}

	if (settings.version < 4) {
		settings.emotes = defaultSettings.emotes;
		settings.version = 4;
	}

	if (settings.version < 5) {
		settings.highlight = defaultSettings.highlight;
		settings.version = 5;
	}

	saveSettings();
}

function updateEmoteSettingsState() {
	const emotesSettings = {
		channel: emotesChannelTextEl.value.toLowerCase().trim(),
		twitch: emotesTwitchCheckboxEl.checked,
		ffz: emotesFfvCheckboxEl.checked,
		bttv: emotesBttvCheckboxEl.checked,
		seventv: emotesSeventvCheckboxEl.checked,
	};

	emotesSaveButtonEl.disabled = JSON.stringify(settings.emotes) == JSON.stringify(emotesSettings);
}

async function fetchEmotes(save: boolean = false) {
	if (save) {
		settings.emotes = {
			channel: emotesChannelTextEl.value.toLowerCase().trim(),
			twitch: emotesTwitchCheckboxEl.checked,
			ffz: emotesFfvCheckboxEl.checked,
			bttv: emotesBttvCheckboxEl.checked,
			seventv: emotesSeventvCheckboxEl.checked,
		};
		saveSettings();
		updateEmoteSettingsState();
	}

	emotes = [];

	if (settings.emotes.twitch) {
		const twitchEmotes = await fetchGql(
			{
				channelLogin: "liam",
			},
			`query ($channelLogin: String!) {
				user(login: $channelLogin) {
					subscriptionProducts {
						emotes {
							id token assetType
						}
					}
				}
			}`,
		);

		for (const emote of [
			...twitchEmotes.data.user.subscriptionProducts[0].emotes,
			...twitchEmotes.data.user.subscriptionProducts[1].emotes,
			...twitchEmotes.data.user.subscriptionProducts[2].emotes,
		]) {
			emotes.push({
				token: emote.token,
				id: emote.id,
				type: "twitch",
			});
		}
	}

	console.log(emotes);
	renderPreview();
}

export async function main() {
	findAllElements();

	const settingsStored = window.localStorage.getItem("settings");
	if (settingsStored) {
		settings = JSON.parse(settingsStored);
	} else {
		settings = defaultSettings;
		saveSettings();
	}

	upgradeSettings();

	await fetchEmotes();
	updateElementsFromSettings();
	updateEmoteSettingsState();

	settingsEl.addEventListener("input", () => {
		updateEmoteSettingsState();
		updateSettingsFromElements();
	});
	previewBackgroundCheckboxEl.addEventListener("input", updateSettingsFromElements);
	upscaleCheckboxEl.addEventListener("input", updateSettingsFromElements);
	exportButtonEl.addEventListener("click", exportPng);
	removeBadgeButtonEl.addEventListener("click", () => closeBadgeModal(false));
	emotesSaveButtonEl.addEventListener("click", () => fetchEmotes(true));

	renderUserPresets(); // delete me
	searchGlobalBadges("");

	setInterval(centerPreview, 100);

	await fetchGlobalBadges();

	badgeSelectorEls.forEach((badgeSelectorEl, i) => badgeSelectorEl.addEventListener("click", () => openBadgeModal(i)));
	badgeSelectorModalEl.addEventListener("click", (e) => {
		const el = e.target as HTMLElement;
		if (el) {
			if (el.nodeName == "IMG") {
				closeBadgeModal((el as HTMLImageElement).src);
			}
		}
	});
	badgeSelectorModalEl.addEventListener("mousedown", (e) => {
		const el = e.target as HTMLElement;
		if (el) {
			if (el == badgeSelectorModalEl) {
				closeBadgeModal();
			}
		}
	});

	userPresetsButtonEl.addEventListener("click", openUserPresetsModal);
	userPresetsModalEl.addEventListener("click", (e) => {
		const el = e.target as HTMLElement;
		if (el) {
			if (el == userPresetsModalEl) {
				closeUserPresetsModal();
			} else if (el.dataset.userpreset) {
				closeUserPresetsModal(parseInt(el.dataset.userpreset));
			} else if (el.id == "user-presets-detete-button") {
				settings.userPresets.splice(parseInt(el.parentElement!.dataset.userpreset as string), 1);
				saveSettings();
				renderUserPresets();
			}
		}
	});
	userPresetsAddButtonEl.addEventListener("click", () => {
		settings.userPresets.push({
			badges: settings.badges,
			username: settings.username,
		});
		renderUserPresets();
	});

	document.addEventListener("mouseover", (e) => {
		if (badgeSelectorModalEl.style.display != "none" && (e.target as HTMLElement).dataset.badge) {
			const el = e.target as HTMLElement;

			badgeTooltipEl.style.display = "block";
			badgeTooltipEl.style.top = `${el.offsetTop - badgeSelectorModalContainerEl.scrollTop - el.clientHeight / 2 - 2}px`;
			badgeTooltipEl.style.left = `${el.offsetLeft + el.clientWidth / 2}px`;

			badgeTooltipEl.innerText = el.dataset.badge as string;
		} else {
			badgeTooltipEl.style.display = "none";
		}
	});

	badgeSelectorModalContainerEl.addEventListener("scroll", () => {
		badgeTooltipEl.style.display = "none";
	});

	globalBadgesSearchEl.addEventListener("input", (e) => {
		searchGlobalBadges((e.target as HTMLInputElement).value);
	});
}

async function fetchGql(variables: any, query: string) {
	// https://github.com/mauricew/twitch-graphql-api
	// https://raw.githubusercontent.com/LeCodingWolfie/twre-graphql/refs/heads/main/documentation/graphql.json
	const res = await fetch("https://gql.twitch.tv/gql", {
		headers: {
			"Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
		},
		method: "POST",
		body: JSON.stringify({
			operationName: "",
			variables,
			query,
		}),
	});

	return await res.json();
}

function floatToHex(float: number) {
	return Math.floor(float * 255)
		.toString(16)
		.padStart(2, "0");
}

function findAllElements() {
	settingsEl = document.querySelector("#settings") as HTMLElement;

	badgeSelectorEls = Array.from(document.querySelectorAll(".badge-selector"));
	badgeSelectorModalEl = document.querySelector("#badge-selector-modal") as HTMLElement;
	badgeSelectorModalContainerEl = document.querySelector("#badge-selector-modal-container") as HTMLElement;
	badgeTooltipEl = document.querySelector("#badge-tooltip") as HTMLElement;
	globalBadgesSearchEl = document.querySelector("#global-badges-search") as HTMLInputElement;
	removeBadgeButtonEl = document.querySelector("#remove-badge-button") as HTMLElement;

	usernameColorEl = document.querySelector("#username-color") as HTMLInputElement;
	usernameTextEl = document.querySelector("#username-text") as HTMLInputElement;

	userPresetsButtonEl = document.querySelector("#user-presets-button") as HTMLElement;
	userPresetsModalEl = document.querySelector("#user-presets-modal") as HTMLElement;
	userPresetsModalContainerEl = document.querySelector("#user-presets-modal-container") as HTMLElement;
	userPresetsAddButtonEl = document.querySelector("#user-presets-new-button") as HTMLElement;

	messageColorEl = document.querySelector("#message-color") as HTMLInputElement;
	messageTextEl = document.querySelector("#message-text") as HTMLInputElement;

	outlineColorEl = document.querySelector("#outline-color") as HTMLInputElement;
	outlineSliderEl = document.querySelector("#outline-slider") as HTMLInputElement;
	outlineThicknessValueEl = document.querySelector("#outline-thickness") as HTMLElement;

	backgroundColorEl = document.querySelector("#background-color") as HTMLInputElement;
	backgroundSliderEl = document.querySelector("#background-slider") as HTMLInputElement;
	backgroundOpacityValueEl = document.querySelector("#background-opacity") as HTMLElement;

	emotesChannelTextEl = document.querySelector("#emote-channel-text") as HTMLInputElement;
	emotesTwitchCheckboxEl = document.querySelector("#emote-twitch-checkbox") as HTMLInputElement;
	emotesFfvCheckboxEl = document.querySelector("#emote-ffz-checkbox") as HTMLInputElement;
	emotesBttvCheckboxEl = document.querySelector("#emote-bttv-checkbox") as HTMLInputElement;
	emotesSeventvCheckboxEl = document.querySelector("#emote-seventv-checkbox") as HTMLInputElement;
	emotesSaveButtonEl = document.querySelector("#emote-save-button") as HTMLInputElement;

	wrappingCheckboxEl = document.querySelector("#wrapping-checkbox") as HTMLInputElement;

	highlightCheckboxEl = document.querySelector("#highlight-checkbox") as HTMLInputElement;

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
