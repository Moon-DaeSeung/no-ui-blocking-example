<script lang="ts">
	import { randomNumbers } from '../lib/fixture';

	let sorted = randomNumbers;
	let number = 1;
	let toggle = true;

	const handleSort = () => {
		if (toggle) {
			sorted = sorted.toSorted((a, b) => a - b);
			toggle = false;
		} else {
			sorted = randomNumbers;
			toggle = true;
		}
	};
</script>

<div>
	<button on:click={() => number++}>Change</button>
	<button on:click={handleSort}>{toggle ? 'Sort' : 'reset'}</button>
</div>

<strong>{number}</strong>
<table>
	<thead>
		<tr>
			<th class="w-[100px]"> Number </th>
		</tr>
	</thead>
	<tbody>
		{#each sorted.slice(0, 10) as number}
			<tr>
				<td>
					{number}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.buttons {
		display: flex;
		gap: 10px;
	}
</style>
