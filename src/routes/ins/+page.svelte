<script lang="ts">
</script>

<div class="container mx-auto mt-5 mb-5">
	<div class="flex justify-center">
		<div class="w-3/4">
			<div class="bg-white rounded shadow-md">
				<div class="flex items-center justify-between p-4 border-b">
					<span class="font-bold">Barang Masuk</span>
					<button class="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
						>Add Data</button
					>
				</div>
				<div class="p-4">
					<div class="mb-3">
						<div class="flex justify-center mb-3">
							<input
								type="text"
								class="w-3/4 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
								placeholder="Search barang masuk..."
							/>
						</div>
					</div>
					<table class="min-w-full bg-white border">
						<thead class="text-white bg-gray-800">
							<tr>
								<th class="px-4 py-2">No Surat Jalan</th>
								<th class="px-4 py-2">Tanggal</th>
								<th class="px-4 py-2">Supplier</th>
								<th class="px-4 py-2">Barang</th>
								<th class="px-4 py-2">Quantity</th>
								<th class="px-4 py-2" style="width:17%">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colspan="6" class="p-4 text-center">
									<div
										class="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
										role="alert"
									>
										Data Belum Tersedia!
									</div>
								</td>
							</tr>
							<tr>
								<td class="px-4 py-2 border">tes</td>
								<td class="px-4 py-2 border">t</td>
								<td class="px-4 py-2 border">tes</td>
								<td class="px-4 py-2 border">t</td>
								<td class="px-4 py-2 border">t</td>
								<td class="flex justify-center px-4 py-2 text-center border">
									<button
										class="px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
										>Edit</button
									>
									<button class="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
										>Delete</button
									>
								</td>
							</tr>
						</tbody>
					</table>
					<!-- Pagination Controls -->
					<div class="flex items-center justify-between mt-4">
						<button class="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700">
							Previous
						</button>
						<span>Page 1 of Total Page</span>
						<button class="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700">
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
