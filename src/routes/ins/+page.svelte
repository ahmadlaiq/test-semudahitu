<script lang="ts">
	import { onMount } from 'svelte';

	let items = [];
	let currentPage = 1;
	let totalPages = 1;
	let searchTerm = '';
	let limit = 8; // Number of items per page

	async function fetchItems() {
		const response = await fetch(
			`/api/ins?page=${currentPage}&limit=${limit}&search=${searchTerm}`
		);
		const data = await response.json();
		items = data.data;
		totalPages = data.pagination.totalPages;
	}

	function handleSearch() {
		currentPage = 1; // Reset to first page when searching
		fetchItems();
	}

	// Debounce function to limit API calls during typing
	function debounce(func, timeout = 300) {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}

	const debouncedSearch = debounce(() => handleSearch());

	onMount(() => {
		fetchItems();
	});

	function goToPage(newPage) {
		if (newPage < 1 || newPage > totalPages) return; // Handle invalid page numbers
		currentPage = newPage;
		fetchItems();
	}
</script>

<div class="container mx-auto mt-5 mb-5">
	<div class="flex justify-center">
		<div class="w-3/4">
			<div class="bg-white rounded shadow-md">
				<div class="flex items-center justify-between p-4 border-b">
					<span class="font-bold">Barang Masuk</span>
					<button class="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
						Add Data
					</button>
				</div>
				<div class="p-4">
					<div class="mb-3">
						<div class="flex justify-center mb-3">
							<input
								type="text"
								class="w-3/4 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
								placeholder="Search barang masuk..."
								bind:value={searchTerm}
								on:input={debouncedSearch}
							/>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
						{#each items as item}
							<div class="p-4 bg-white rounded-lg shadow-md hover:bg-gray-600 hover:text-white">
								<h2 class="text-lg text-center capitalize">{item.nama_supplier}</h2>
							</div>
						{/each}
					</div>
					<div class="flex justify-center mt-4">
						<button
							class="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 disabled:opacity-5"
							disabled={currentPage === 1}
							on:click={() => goToPage(currentPage - 1)}
						>
							Previous
						</button>
						<span class="p-2 mx-2">{currentPage} / {totalPages}</span>
						<button
							class="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 disabled:opacity-50"
							disabled={currentPage === totalPages}
							on:click={() => goToPage(currentPage + 1)}
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@import 'tailwindcss/tailwind.css';
</style>
