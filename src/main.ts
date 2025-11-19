// import { invoke } from "@tauri-apps/api/core";

// async function greet() {
// 	if (greetMsgEl && greetInputEl) {
// 		// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// 		greetMsgEl.textContent = await invoke("greet", {
// 			name: greetInputEl.value,
// 		});
// 	}
// }

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
	wrapping: boolean;
}

function renderPreview(settings: Settings) {
	console.log(settings);
}

window.addEventListener("DOMContentLoaded", () => {
	const settingsEl: HTMLElement | null = document.querySelector("#settings");

	const usernameColorEl: HTMLInputElement | null = document.querySelector("#username-color");
	const usernameTextEl: HTMLInputElement | null = document.querySelector("#username-text");

	const messageColorEl: HTMLInputElement | null = document.querySelector("#message-color");
	const messageTextEl: HTMLInputElement | null = document.querySelector("#message-text");

	const outlineColorEl: HTMLInputElement | null = document.querySelector("#outline-color");
	const outlineSliderEl: HTMLInputElement | null = document.querySelector("#outline-slider");
	const outlineThicknessValueEl: HTMLElement | null = document.querySelector("#outline-thickness");

	const backgroundColorEl: HTMLInputElement | null = document.querySelector("#background-color");
	const backgroundSliderEl: HTMLInputElement | null = document.querySelector("#background-slider");
	const backgroundOpacityValueEl: HTMLElement | null = document.querySelector("#background-opacity");

	const wrappingCheckboxEl: HTMLInputElement | null = document.querySelector("#wrapping-checkbox");

	const previewBackgroundCheckboxEl: HTMLInputElement | null = document.querySelector("#preview-background-checkbox");

	const previewEl: HTMLElement | null = document.querySelector("#preview");
	const previewBackgroundContainerEl: HTMLElement | null = document.querySelector("#preview-background-container");
	const previewBackgroundEl: HTMLElement | null = document.querySelector("#preview-background");

	settingsEl?.addEventListener("input", updateAll);
	previewBackgroundCheckboxEl?.addEventListener("input", () => updateThingies());

	function updateAll() {
		const backgroundOpacityHex = Math.floor(parseFloat(backgroundSliderEl?.value || "0") * 255).toString(16);

		const settings: Settings = {
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
			wrapping: wrappingCheckboxEl?.checked || false,
		};

		renderPreview(settings);
		updateThingies(settings);
	}

	// todo: dont handle defaults. settings will have a default at some point.
	function updateThingies(settings: Settings | undefined = undefined) {
		outlineThicknessValueEl!.innerText = settings?.outline.thickness.toString() || "0";

		backgroundOpacityValueEl!.innerText = settings?.background.opacity.toFixed(2) || "0.00";
		backgroundColorEl!.style.opacity = settings?.background.opacity.toString() ?? "0";

		previewBackgroundEl!.style.backgroundColor = settings?.background.color || "#FFFFFF00";

		if (previewBackgroundCheckboxEl?.checked) {
			previewBackgroundContainerEl!.style.display = "block";
		} else {
			previewBackgroundContainerEl!.style.display = "none";
		}
	}

	updateThingies();
});
