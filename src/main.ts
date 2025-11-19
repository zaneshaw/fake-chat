import { snapdom } from "@zumer/snapdom";
import { downloadDir } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

let settingsEl: HTMLElement | null;

let usernameColorEl: HTMLInputElement | null;
let usernameTextEl: HTMLInputElement | null;

let messageColorEl: HTMLInputElement | null;
let messageTextEl: HTMLInputElement | null;

let outlineColorEl: HTMLInputElement | null;
let outlineSliderEl: HTMLInputElement | null;
let outlineThicknessValueEl: HTMLElement | null;

let backgroundColorEl: HTMLInputElement | null;
let backgroundSliderEl: HTMLInputElement | null;
let backgroundOpacityValueEl: HTMLElement | null;

let wrappingCheckboxEl: HTMLInputElement | null;

let previewBackgroundCheckboxEl: HTMLInputElement | null;

let upscaleCheckboxEl: HTMLInputElement | null;

let previewBackgroundContainerEl: HTMLElement | null;
let previewBackgroundEl: HTMLElement | null;
let previewMessageContainerEl: HTMLElement | null;
let previewMessageEl: HTMLElement | null;
let previewMessageContentEl: HTMLElement | null;
let previewMessageAuthorEl: HTMLElement | null;
let previewMessageBodyEl: HTMLElement | null;

let exportButtonEl: HTMLButtonElement | null;

interface Settings {
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

let settings: Settings;
let exporting = false;

async function exportPng() {
	if (exporting) return;
	exporting = true;

	if (previewMessageContentEl) {
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
			previewMessageContentEl.style.backgroundColor = previewBackgroundEl!.style.backgroundColor;
			const result = await snapdom.toBlob(previewMessageContentEl, { type: "png", embedFonts: true, scale: settings.upscale ? 10 : 1 });
			previewMessageContentEl.style.backgroundColor = "initial";

			const bytes = new Uint8Array(await result.arrayBuffer());

			await writeFile(path, bytes);
		}
	}

	exporting = false;
}

function centerPreview() {
	previewMessageEl!.style.left = `${previewMessageContainerEl!.clientWidth / 2 - previewMessageEl!.clientWidth / 2}px`;
	previewMessageEl!.style.top = `${previewMessageContainerEl!.clientHeight / 2 - previewMessageEl!.clientHeight / 2}px`;
}

// todo: dont handle defaults. settings will have a default at some point.
function renderPreview() {
	console.debug(settings);

	previewBackgroundEl!.style.backgroundColor = settings?.background.color || "#FFFFFF00";

	if (previewBackgroundCheckboxEl?.checked) {
		previewBackgroundContainerEl!.style.display = "block";
	} else {
		previewBackgroundContainerEl!.style.display = "none";
	}

	previewMessageContentEl!.style.width = settings?.wrap ? "291px" : "auto";
	previewMessageContentEl!.style.color = settings.username.color;
	previewMessageContentEl!.style.webkitTextStrokeColor = settings.outline.color;
	previewMessageContentEl!.style.webkitTextStrokeWidth = `${settings.outline.thickness}px`;

	previewMessageAuthorEl!.style.color = settings.username.color;
	previewMessageAuthorEl!.innerText = settings.username.text;

	previewMessageBodyEl!.style.color = settings.message.color;
	previewMessageBodyEl!.innerText = settings.message.text;

	centerPreview();
}

window.addEventListener("DOMContentLoaded", () => {
	settingsEl = document.querySelector("#settings");

	usernameColorEl = document.querySelector("#username-color");
	usernameTextEl = document.querySelector("#username-text");

	messageColorEl = document.querySelector("#message-color");
	messageTextEl = document.querySelector("#message-text");

	outlineColorEl = document.querySelector("#outline-color");
	outlineSliderEl = document.querySelector("#outline-slider");
	outlineThicknessValueEl = document.querySelector("#outline-thickness");

	backgroundColorEl = document.querySelector("#background-color");
	backgroundSliderEl = document.querySelector("#background-slider");
	backgroundOpacityValueEl = document.querySelector("#background-opacity");

	wrappingCheckboxEl = document.querySelector("#wrapping-checkbox");

	previewBackgroundCheckboxEl = document.querySelector("#preview-background-checkbox");

	upscaleCheckboxEl = document.querySelector("#upscale-checkbox");

	previewBackgroundContainerEl = document.querySelector("#preview-background-container");
	previewBackgroundEl = document.querySelector("#preview-background");
	previewMessageContainerEl = document.querySelector("#preview-message-container");
	previewMessageEl = document.querySelector("#preview-message");
	previewMessageContentEl = document.querySelector("#preview-message-content");
	previewMessageAuthorEl = document.querySelector("#preview-message-author");
	previewMessageBodyEl = document.querySelector("#preview-message-body");

	exportButtonEl = document.querySelector("#export-button");

	settingsEl?.addEventListener("input", updateAll);
	previewBackgroundCheckboxEl?.addEventListener("input", updateAll);
	upscaleCheckboxEl?.addEventListener("input", updateAll);
	exportButtonEl?.addEventListener("click", exportPng);

	function updateAll() {
		const backgroundOpacityHex = Math.floor(parseFloat(backgroundSliderEl?.value || "0") * 255)
			.toString(16)
			.padStart(2, "0");

		settings = {
			badges: ["moderator"],
			username: {
				color: usernameColorEl?.value ?? "#FFFFFF",
				text: usernameTextEl?.value || usernameTextEl!.placeholder,
			},
			message: {
				color: messageColorEl?.value ?? "#FFFFFF",
				text: messageTextEl?.value || messageTextEl!.placeholder,
			},
			outline: {
				color: outlineColorEl?.value || "#000000",
				thickness: parseFloat(outlineSliderEl?.value || "0"),
			},
			background: {
				color: `${backgroundColorEl?.value}${backgroundOpacityHex}` || "#FFFFFF00",
				opacity: parseFloat(backgroundSliderEl?.value || "0"),
			},
			wrap: wrappingCheckboxEl?.checked || false,
			upscale: upscaleCheckboxEl?.checked || false
		};

		renderPreview();
		updateThingies();
	}

	// todo: dont handle defaults. settings will have a default at some point.
	function updateThingies() {
		outlineThicknessValueEl!.innerText = settings?.outline.thickness.toString() || "0";

		backgroundOpacityValueEl!.innerText = settings?.background.opacity.toFixed(2) || "0.00";
		backgroundColorEl!.style.opacity = settings?.background.opacity.toString() ?? "0";
	}

	updateAll();

	setInterval(centerPreview, 100);
});
