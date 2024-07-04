<script lang="ts">
	import { onMount } from 'svelte';

	let items = [];
	let currentPage = 1;
	let totalPages = 1;
	let searchTerm = '';
	let limit = 8;
	let showModal = false;
	let editingItem = null;
	let showCreateModal = false;
	let newItem = {
		no_surat_jalan: '',
		tanggal: '',
		nama_supplier: '',
		yang_mengeluarkan: '',
		nama_barang: '',
		qty: ''
	};

	// Handling fetch get data from API
	async function fetchItems() {
		const response = await fetch(
			`/api/retur-pabriks?page=${currentPage}&limit=${limit}&search=${searchTerm}`
		);
		const data = await response.json();
		items = data.data;
		totalPages = data.pagination.totalPages;
	}

	// Handling search action
	function handleSearch() {
		currentPage = 1;
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
	//Mounting data
	onMount(() => {
		fetchItems();
	});
	// Handling pagination
	function goToPage(newPage) {
		if (newPage < 1 || newPage > totalPages) return; // Handle invalid page numbers
		currentPage = newPage;
		fetchItems();
	}
	// Handling delete item
	async function deleteItem(id) {
		if (confirm('Are you sure you want to delete this item?')) {
			try {
				const response = await fetch(`/api/retur-pabriks?id=${id}`, {
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

	// Handling open edit modal
	function openEditModal(item) {
		editingItem = { ...item };
		showModal = true;
	}

	// Handling close modal
	function closeModal() {
		showModal = false;
		editingItem = null;
	}

	// Handling action update item
	async function saveEdit() {
		try {
			const response = await fetch(`/api/retur-pabriks?id=${editingItem._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editingItem)
			});
			if (response.ok) {
				fetchItems();
				closeModal();
			} else {
				alert('Failed to update the item. Please try again.');
			}
		} catch (error) {
			console.error('Error updating item:', error);
			alert('An error occurred while updating the item.');
		}
	}

	function openCreateModal() {
		newItem = {
			no_surat_jalan: '',
			tanggal: '',
			nama_supplier: '',
			yang_mengeluarkan: '',
			nama_barang: '',
			qty: ''
		};
		showCreateModal = true;
	}

	function closeCreateModal() {
		showCreateModal = false;
	}

	async function createItem() {
		try {
			const response = await fetch('/api/retur-pabriks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newItem)
			});
			if (response.ok) {
				fetchItems();
				closeCreateModal();
			} else {
				alert('Failed to create the item. Please try again.');
			}
		} catch (error) {
			console.error('Error creating item:', error);
			alert('An error occurred while creating the item.');
		}
	}
</script>

<div class="container mx-auto mt-5 mb-5">
	<div class="flex justify-center">
		<div class="w-3/4">
			<div class="bg-white rounded shadow-md">
				<div class="flex items-center justify-between p-4 border-b">
					<span class="font-bold">Barang Retur Pabrik</span>
					<button
						class="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
						on:click={openCreateModal}
					>
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
								<p class="text-sm text-start">Yang Suppllier: {item.nama_supplier}</p>
								<p class="text-sm text-start">Yang Mengeluarkan: {item.yang_mengeluarkan}</p>
								<p class="text-sm text-start">Barang: {item.nama_barang}</p>
								<p class="text-sm text-start">Quantity: {item.qty}</p>
								<!-- Button Edit and Delete -->
								<div class="flex justify-center gap-3 mt-4">
									<button
										class="px-3 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
										on:click={() => openEditModal(item)}
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

<!-- Create Modal -->
{#if showCreateModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
	>
		<div class="relative flex flex-col w-full max-w-md p-8 m-auto bg-white rounded-lg">
			<h2 class="mb-4 text-xl font-bold">Create New Item</h2>
			<input
				type="text"
				class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
				placeholder="No. Surat Jalan"
				bind:value={newItem.no_surat_jalan}
			/>
			<input
				type="date"
				class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
				bind:value={newItem.tanggal}
			/>
			<input
				type="text"
				class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
				placeholder="Nama Supplier"
				bind:value={newItem.nama_supplier}
			/>
			<input
				type="text"
				class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
				placeholder="Yang Mengeluarkan"
				bind:value={newItem.yang_mengeluarkan}
			/>
			<input
				type="text"
				class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
				placeholder="Nama Barang"
				bind:value={newItem.nama_barang}
			/>
			<input
				type="number"
				class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
				placeholder="Quantity"
				bind:value={newItem.qty}
			/>
			<div class="flex justify-end">
				<button
					class="px-4 py-2 mr-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
					on:click={createItem}
				>
					Save
				</button>
				<button
					class="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700"
					on:click={closeCreateModal}
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
	>
		<div class="relative w-auto max-w-3xl mx-auto my-6 lg:w-3/4">
			<div
				class="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none"
			>
				<div
					class="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200"
				>
					<h3 class="text-3xl font-semibold">Edit Barang</h3>
					<button
						class="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
						on:click={closeModal}
					>
						<span
							class="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none"
						>
							×
						</span>
					</button>
				</div>
				<div class="relative flex-auto p-6">
					<form>
						<div class="mb-4">
							<label class="block mb-2 text-sm font-bold text-gray-700" for="no_surat_jalan">
								No Surat Jalan
							</label>
							<input
								class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
								id="no_surat_jalan"
								type="text"
								bind:value={editingItem.no_surat_jalan}
							/>
						</div>
						<div class="mb-4">
							<label class="block mb-2 text-sm font-bold text-gray-700" for="tanggal">
								Tanggal
							</label>
							<input
								class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
								id="tanggal"
								type="date"
								bind:value={editingItem.tanggal}
							/>
						</div>
						<div class="mb-4">
							<label class="block mb-2 text-sm font-bold text-gray-700" for="nama_supplier">
								Nama Supplier
							</label>
							<input
								class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
								id="nama_supplier"
								type="text"
								bind:value={editingItem.nama_supplier}
							/>
						</div>
						<div class="mb-4">
							<label class="block mb-2 text-sm font-bold text-gray-700" for="yang_mengeluarkan">
								Yang Mengeluarkan
							</label>
							<input
								class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
								id="yang_mengeluarkan"
								type="text"
								bind:value={editingItem.yang_mengeluarkan}
							/>
							<div class="mb-4">
								<label class="block mb-2 text-sm font-bold text-gray-700" for="nama_barang">
									Nama Barang
								</label>
								<input
									class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="nama_barang"
									type="text"
									bind:value={editingItem.nama_barang}
								/>
							</div>
							<div class="mb-4">
								<label class="block mb-2 text-sm font-bold text-gray-700" for="qty">
									Quantity
								</label>
								<input
									class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="qty"
									type="number"
									bind:value={editingItem.qty}
								/>
							</div>
						</div>
					</form>
				</div>
				<div
					class="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200"
				>
					<button
						class="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
						type="button"
						on:click={closeModal}
					>
						Close
					</button>
					<button
						class="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
						type="button"
						on:click={saveEdit}
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="fixed inset-0 z-40 bg-black opacity-25"></div>
{/if}

<!-- Styling -->
<style>
	@import 'tailwindcss/tailwind.css';
</style>
