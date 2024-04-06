<script lang="ts">
	import Scheduler from '../lib/Scheduler';
	import { randomNumbers } from '../lib/fixture';
	import Loading from '../lib/components/Loading.svelte';

	let sorted = randomNumbers;
	let number = 1;
	let toggle = true;

	class SortScheduler extends Scheduler<number, number> {
		constructor() {
			super({ concurrency: 20 });
		}

		index = 0;
		size = 10000;
		protected override read(): number[] {
			const chunk = sorted.slice(this.index, this.index + this.size);
			this.index += this.size;
			return chunk;
		}

		protected override process(chunk: number[]): number[] {
			return chunk.sort((a, b) => a - b);
		}

		protected override write(acc: number[], chunk: number[]): number[] {
			const [arr1, arr2] = [acc, chunk];
			const mergedArray: number[] = [];
			let i = 0; // arr1의 인덱스
			let j = 0; // arr2의 인덱스

			// 두 배열을 비교하면서 더 작은 값을 mergedArray에 추가
			while (i < arr1.length && j < arr2.length) {
				if (arr1[i] < arr2[j]) {
					mergedArray.push(arr1[i]);
					i++;
				} else {
					mergedArray.push(arr2[j]);
					j++;
				}
			}

			// arr1에 남은 요소가 있으면 추가
			while (i < arr1.length) {
				mergedArray.push(arr1[i]);
				i++;
			}

			// arr2에 남은 요소가 있으면 추가
			while (j < arr2.length) {
				mergedArray.push(arr2[j]);
				j++;
			}

			return mergedArray;
		}
	}
	const scheduler = new SortScheduler();

	let loading = false;
	const handleSort = async () => {
		if (toggle) {
			loading = true;
			sorted = await scheduler.do();
			loading = false;
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
{#if loading}
	<Loading />
{/if}
<span></span>
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
