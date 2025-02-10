<script lang="ts">
	import Icon from '@iconify/svelte';
	import IconModal from './IconModal.svelte';
	import iconData from '../assets/icons.json';

	// Process icons (same as before)
	const iconsByCategory = Object.entries(iconData.categories).reduce(
		(acc, [category, iconNames]) => {
			acc[category] = iconNames
				.filter(name => !name.endsWith('-ai'))
				.sort((a, b) => a.localeCompare(b))
				.map(name => ({
					name,
					...iconData.icons[name],
					hasVariant: Object.hasOwn(iconData.icons, `${name}-ai`),
					aiVariantBody: iconData.icons[`${name}-ai`]?.body,
					category
				}));
			return acc;
		},
		{}
	);

	// Category visibility (same as before)
	let categoryVisibility = Object.keys(iconsByCategory).reduce((acc, category) => {
		acc[category] = true;
		return acc;
	}, {});

	function toggleCategory(category: string) {
		categoryVisibility[category] = !categoryVisibility[category];
	}

	// --- MODAL STATE (NEW) ---
	let selectedIcon: {
		name: string;
		body: string;
		description: string;
		hasVariant: boolean;
		aiVariantBody?: string;
	} | null = null;

	// --- MODIFIED openModal FUNCTION ---
	function openModal(icon: {
		name: string;
		body: string;
		description: string;
		hasVariant: boolean;
		aiVariantBody?: string;
	}) {
		selectedIcon = icon;
	}

  //No need of close modal function here, we delegate it using the event dispatcher.
</script>

<main class="flex-1 container mx-auto px-4 py-8">
	{#each Object.entries(iconsByCategory) as [category, icons]}
		<div class="collapse collapse-arrow bg-base-200 mb-4">
			<input
				type="checkbox"
				checked={categoryVisibility[category]}
				on:change={() => toggleCategory(category)}
			/>
			<div class="collapse-title text-xl font-medium">
				{category}
			</div>
			<div class="collapse-content">
				<div class="icons-grid grid grid-cols-auto-fit gap-4 justify-center pt-4">
					{#each icons as icon}
						<div class="relative group w-32 aspect-square">
							<div
								class="card h-full bg-base-300 overflow-hidden transition-all duration-300 ease-in-out
                       hover:bg-[size:200%] hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-500
                       border-none cursor-pointer"
								on:click={() => openModal(icon)}
							>
								{#if icon.hasVariant}
									<div class="absolute top-2 right-2 w-4 h-4 text-purple-500">
										<Icon icon="mdi:sparkles" />
									</div>
								{/if}

								<div class="card-body justify-center items-center p-2">
									<div class="w-8 h-8 mb-1 transition-colors duration-300">
										<svg
											viewBox="0 0 48 48"
											fill="currentColor"
											class="w-full h-full"
										>
											{@html icon.body}
										</svg>
									</div>
									<h2 class="text-xs text-center font-medium">
										{icon.name
											.split('_')
											.map(word => word.charAt(0).toUpperCase() + word.slice(1))
											.join(' ')}
									</h2>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}

	{#if selectedIcon}
		<IconModal
			client:only="svelte"
			name={selectedIcon.name}
			body={selectedIcon.body}
			description={selectedIcon.description}
			hasVariant={selectedIcon.hasVariant}
			aiVariantBody={selectedIcon.aiVariantBody}
			on:close={() => (selectedIcon = null)}
		/>
	{/if}
</main>

<style>
	:global(.grid-cols-auto-fit) {
		grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
	}
</style>
