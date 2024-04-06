abstract class Scheduler<SOURCE, TARGET> {
	private limit: number;
	private interval: number;
	constructor({
		concurrency: limit = 1,
		interval = 0
	}: { concurrency?: number; interval?: number } = {}) {
		this.limit = limit;
		this.interval = interval;
	}

	protected abstract read(): SOURCE[];
	protected write(acc: TARGET[], current: TARGET[]): TARGET[] {
		acc.push(...current);
		return acc;
	}
	protected abstract process(items: SOURCE[]): TARGET[];

	i = 0;
	private run(acc: TARGET[], done: () => void): Promise<TARGET[]> {
		return new Promise((resolve) => {
			setTimeout(() => {
				const sources = this.read();
				if (sources.length === 0) {
					done();
				}
				const targets = this.process(sources);
				const result = this.write(acc, targets);
				resolve(result);
			}, 0);
		});
	}

	do(): Promise<TARGET[]> {
		return new Promise((resolve) => {
			let isDone = false;
			let running = 0;
			let targets: TARGET[] = [];
			const next = () => {
				if (isDone) {
					resolve(targets);
					return;
				}
				while (running < this.limit) {
					console.log('running', running);
					running++;
					this.run(targets, () => {
						isDone = true;
					}).then((result) => {
						running--;
						targets = result;

						next();
					});
				}
			};
			next();
		});
	}
}

export default Scheduler;
