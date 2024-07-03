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

	async function deleteItem(id) {
		if (confirm('Are you sure you want to delete this item?')) {
			try {
				
				const response = await fetch(`/api/ins?id=${id}`, {
					method: 'DELETE'
				});
				if (response.ok) {
					fetchItems();
				} else {
					alert('Failed to delete the item. Please try again.');
				}
			} catch (error) {
				console.error('Error deleting item:', error);
				alert('An error occurred while deleting the item.');
			}
		}
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
								<div class="mb-2">
									<h2 class="text-lg font-semibold text-center capitalize">
										{item.no_surat_jalan}
									</h2>
								</div>
								<p class="text-sm text-start">Tanggal: {item.tanggal}</p>
								<p class="text-sm text-start">Supplier: {item.nama_supplier}</p>
								<p class="text-sm text-start">Barang: {item.nama_barang}</p>
								<p class="text-sm text-start">Quantity: {item.qty}</p>
								<!-- Button Edit and Delete -->
								<div class="flex justify-center gap-3 mt-4">
									<button
										class="px-3 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
									>
										Edit
									</button>
									<button
										class="px-3 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
										on:click={() => deleteItem(item._id)}
									>
										Delete
									</button>
								</div>
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
