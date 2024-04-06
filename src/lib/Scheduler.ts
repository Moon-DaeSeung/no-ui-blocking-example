abstract class Scheduler<SOURCE, TARGET> {
	private limit: number;
	constructor({ concurrency = 1 }: { concurrency?: number } = {}) {
		this.limit = concurrency;
	}

	protected abstract read(): SOURCE[];
	protected abstract write(acc: TARGET[], current: TARGET[]): TARGET[]
	protected abstract process(items: SOURCE[]): TARGET[];

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
