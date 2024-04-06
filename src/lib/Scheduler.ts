abstract class Scheduler<SOURCE, TARGET> {
	private limit: number;
	constructor({ limit = 1 }: { limit?: number }) {
		this.limit = limit;
	}

	protected abstract read(): SOURCE[];
	protected write(acc: TARGET[], current: TARGET[]): TARGET[] {
		acc.push(...current);
		return acc;
	}
	protected abstract process(items: SOURCE[]): TARGET[];

	private async asyncRun(acc: TARGET[], done: () => void): Promise<void> {
		const sources = this.read();
		if (sources.length === 0) {
			return done();
		}
		const targets = this.process(sources);
		this.write(acc, targets);
	}

	do() {
		return new Promise((resolve) => {
			const targets: TARGET[] = [];
			let isDone = false;
			let running = 0;
			const next = () => {
				if (isDone) {
					resolve(targets);
					return;
				}
				while (running < this.limit) {
					running++;
					this.asyncRun(targets, () => {
						isDone = true;
					}).then(() => {
						running--;
						next();
					});
				}
			};
			next();
		});
	}
}

export default Scheduler;
