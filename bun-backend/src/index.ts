import cluster from "node:cluster";
import os from "node:os";
import process from "node:process";

if (cluster.isPrimary) {
	const numCPUs = os.availableParallelism();
	for (let i = 0; i < numCPUs; i++) cluster.fork();

	const handleShutdown = () => {
		console.log("Primary process shutting down, notifying workers...");
		for (const id in cluster.workers) {
			cluster.workers[id]?.process.kill("SIGTERM");
		}
	};

	process.on("SIGINT", handleShutdown);
	process.on("SIGTERM", handleShutdown);

	cluster.on("exit", (worker) => {
		console.log(`Worker ${worker.process.pid} died`);
		if (Object.keys(cluster.workers || {}).length === 0) {
			console.log("All workers finished, exiting primary process");
			process.exit(0);
		}
	});
} else {
	await import("./server");
	console.log(`Worker ${process.pid} started`);
}
