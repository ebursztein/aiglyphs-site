<script lang="ts">
	import Icon, {addIcon} from '@iconify/svelte';
	import { onMount, createEventDispatcher } from 'svelte';

  // Icons
  import sunIcon from '../icons/sun.svg?raw';
  import moonIcon from '../icons/moon.svg?raw';
  import downloadIcon from '../icons/download.svg?raw';
  import clipboardIcon from '../icons/clipboard.svg?raw';
  addIcon('local:sun', { body: sunIcon });
  addIcon('local:moon', { body: moonIcon });
  addIcon('local:download', { body: downloadIcon });
  addIcon('local:clipboard', { body: clipboardIcon });



  export let name: string;
	export let body: string;
	export let description: string;
	export let hasVariant: boolean;
	export let aiVariantBody: string | undefined;

	let dialog: HTMLDialogElement;
	let activeTheme: 'dark' | 'light' = 'dark'; // Initial theme: dark
	let downloadingBase = false;
	let downloadingAI = false;

	const dispatch = createEventDispatcher();

	$: formattedName = name
		.split('_')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	// --- Theme icon theme Toggle ---
  function toggleTheme() {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    updateIconColors(); // Call a function to update colors
  }

  // --- Update Icon Colors ---
  function updateIconColors() {
    if (activeTheme === 'dark') {
      document.documentElement.style.setProperty('--icon-color', '#ffffff'); // White
      document.documentElement.style.setProperty('--background-color', '#000000'); // Black
    } else {
      document.documentElement.style.setProperty('--icon-color', '#000000'); // Black
      document.documentElement.style.setProperty('--background-color', '#ffffff'); // White
    }
  }

    // --- Construct SVG ---
    function constructSvg(iconBody: string): string {
        let svg = '<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">';
        svg += iconBody;
        svg += '</svg>';
        return svg;
    }

	// --- Download SVG ---
	async function downloadSvg(iconBody: string, filename: string, isAI: boolean = false) {
        const svg = constructSvg(iconBody); // Construct the full SVG

		if (isAI) {
			downloadingAI = true;
		} else {
			downloadingBase = true;
		}
		try {
			//No need to encode the svg if we don't modify it.
			const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = `${filename}.svg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			showToast('SVG downloaded successfully!', 'success');
		} catch (error) {
			console.error('Failed to download SVG:', error);
			showToast('Failed to download SVG', 'error');
		} finally {
			if (isAI) {
				downloadingAI = false;
			} else {
				downloadingBase = false;
			}
		}
	}

	// --- Copy SVG ---
    async function copySvg(iconBody: string) {
        const svg = constructSvg(iconBody); // Construct full SVG
        try {
            await navigator.clipboard.writeText(svg);
            showToast('SVG copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
            showToast('Failed to copy SVG', 'error');
        }
    }
	// --- Toast ---
	function showToast(message: string, type: 'success' | 'error') {
		const toast = document.createElement('div');
		toast.className = `toast toast-end`;
		toast.innerHTML = `
      <div class="alert alert-${type}">
        <span>${message}</span>
      </div>
    `;
		document.body.appendChild(toast);
		setTimeout(() => toast.remove(), 3000);
	}

	// --- onMount ---
	onMount(() => {
		const handleClick = (e: MouseEvent) => {
			const modalBox = dialog?.querySelector('.modal-box');
			if (modalBox && !modalBox.contains(e.target as Node)) {
				closeModal();
			}
		};

		dialog?.addEventListener('click', handleClick);
		dialog.showModal();

		// Set initial color via CSS variable
		// document.documentElement.style.setProperty('--icon-color', '#ffffff'); // Moved to updateIconColors
    updateIconColors(); // Initialize with correct colors

		return () => {
			dialog?.removeEventListener('click', handleClick);
		};
	});

	function closeModal() {
		dialog.close();
		dispatch('close');
	}
</script>

<dialog bind:this={dialog} class="modal" on:close={closeModal}>
	<div class="modal-box relative max-w-3xl">
		<form method="dialog">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				aria-label="Close modal"
				on:click|preventDefault={closeModal}
			>
				✕
			</button>
		</form>

		<h3 class="font-bold text-2xl mb-2">{formattedName}</h3>
		<p class="text-sm opacity-70 mb-6">{description}</p>

		<div class="flex flex-col md:flex-row gap-8 justify-center items-center mb-8">
			<!-- Base Icon Section -->
			<div class="flex flex-col items-center gap-4">
				<div class="relative">
          <div class="tooltip tooltip-bottom absolute z-10 bottom-2 right-2" data-tip="Toggle theme">
            <label class="swap swap-rotate">
              <input type="checkbox" on:change={toggleTheme} checked={activeTheme === 'dark'} />
              {#if activeTheme === 'dark'}
                <Icon icon="local:moon" class="swap-off text-blue-400 " />
                <Icon icon="local:sun" class="swap-on  text-amber-400"  />
              {:else}
                <Icon icon="local:sun" class="swap-on  text-amber-400" />
                <Icon icon="local:moon" class="swap-off  text-blue-400" />
              {/if}
            </label>
          </div>
            <div
                class="icon-display border-primary border-2 p-8 rounded-box w-48 h-48 flex items-center justify-center"
            >
						<svg
							viewBox="0 0 48 48"
							class="w-32 h-32 icon-svg"

							aria-label={`${formattedName} icon`}
						>
							{@html body}
						</svg>
					</div>
				</div>
				<div class="flex gap-2">
					<button
						class="btn btn-primary btn-sm"
						on:click={() => downloadSvg(body, name)}
						aria-label="Download SVG"
						disabled={downloadingBase}
					>
						{#if downloadingBase}
							<span class="loading loading-spinner"></span>
						{:else}
							<Icon icon="local:download" class="button-icon" />
						{/if}
						<span class="button-text">SVG</span>
					</button>
					<button class="btn btn-secondary btn-sm" on:click={() => copySvg(body)}>
						<Icon icon="local:clipboard" class="button-icon" />
						<span class="button-text">copy</span>
					</button>
				</div>
			</div>

			<!-- AI Variant Section -->
			{#if hasVariant && aiVariantBody}
				<div class="flex flex-col items-center gap-4">
					<div class="relative">
              <div
                  class="icon-display border-primary border-2 p-8 rounded-box w-48 h-48 flex items-center justify-center"
              >
							<svg
								viewBox="0 0 48 48"
								class="w-32 h-32 icon-svg"

								aria-label={`${formattedName} AI variant icon`}
							>
								{@html aiVariantBody}
							</svg>
						</div>
					</div>
					<div class="flex gap-2">
						<button
							class="btn btn-primary btn-sm"
							on:click={() => downloadSvg(aiVariantBody, `${name}-ai`, true)}
							aria-label="Download AI variant SVG"
							disabled={downloadingAI}
						>
							{#if downloadingAI}
								<span class="loading loading-spinner"></span>
							{:else}
								<Icon icon="local:download"/>
							{/if}
							<span class="button-text">SVG</span>
						</button>
						<button class="btn btn-secondary btn-sm" on:click={() => copySvg(aiVariantBody)}>
							<Icon icon="local:clipboard" />
							<span class="button-text">Copy</span>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button on:click|preventDefault={closeModal}>close</button>
	</form>
</dialog>

<style>

  .btn .button-icon {
      fill: currentColor;
      stroke: currentColor;
  }


	/* No more color picker styles! */
	.icon-display {
		transition: all 0.3s ease;
        background-color: var(--background-color); /* Use the CSS variable */
	}
    .icon-svg {
        fill: var(--icon-color);       /* Use CSS variable for fill */
        stroke: var(--icon-color);     /* Use CSS variable for stroke */
    }

	.toast {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 1000;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.toast {
		animation: fadeIn 0.3s ease-out;
	}

	.relative {
		position: relative;
	}
	.tooltip {
		z-index: 20;
	}

	.swap {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 0.5rem;
		padding: 0.25rem;
	}

	/* Optional: Add hover effect to the theme toggle */
	.swap:hover {
		background: rgba(0, 0, 0, 0.2);
	}
</style>
