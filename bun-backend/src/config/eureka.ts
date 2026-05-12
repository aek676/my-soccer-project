import os from "node:os";

interface EurekaInstance {
	instanceId: string;
	hostName: string;
	app: string;
	ipAddr: string;
	status: string;
	port: { $: number; "@enabled": boolean };
	dataCenterInfo: { "@class": string; name: string };
	leaseInfo: { renewalIntervalInSecs: number; durationInSecs: number };
	vipAddress: string;
	secureVipAddress: string;
	statusPageUrl: string;
	healthCheckUrl: string;
}

interface EurekaRegistrationPayload {
	instance: EurekaInstance;
}

function getLocalIpAddress(): string {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]!) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return "127.0.0.1";
}

export async function registerWithEureka(
	appName: string,
	instanceHostname: string,
	port: number,
): Promise<void> {
	const eurekaUrl =
		Bun.env["eureka.client.service-url.defaultZone"] ||
		Bun.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE ||
		Bun.env.EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE ||
		"http://localhost:8761/eureka/";

	const heartbeatInterval = 30 * 1000;
	const ipAddr = getLocalIpAddress();
	const isProduction = Bun.env.SPRING_PROFILES_ACTIVE === "prod";
	const effectiveHostname = isProduction ? ipAddr : instanceHostname;

	const instanceData: EurekaInstance = {
		instanceId: `${effectiveHostname}:${appName.toLowerCase()}:${port}`,
		hostName: effectiveHostname,
		app: appName.toUpperCase(),
		ipAddr: ipAddr,
		status: "UP",
		port: { $: port, "@enabled": true },
		dataCenterInfo: {
			"@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
			name: "MyOwn",
		},
		leaseInfo: {
			renewalIntervalInSecs: 30,
			durationInSecs: 90,
		},
		vipAddress: appName.toLowerCase(),
		secureVipAddress: appName.toLowerCase(),
		statusPageUrl: `http://${effectiveHostname}:${port}/healthz/live`,
		healthCheckUrl: `http://${effectiveHostname}:${port}/healthz/ready`,
	};

	const payload: EurekaRegistrationPayload = { instance: instanceData };
	const url = `${eurekaUrl}/apps/${appName.toUpperCase()}`;

	async function register(): Promise<void> {
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				console.log(`[Eureka] Registered as ${appName}`);
			} else {
				console.error(
					`[Eureka] Registration failed: ${response.status} ${response.statusText}`,
				);
			}
		} catch (error) {
			console.error("[Eureka] Registration error:", error);
		}
	}

	async function heartbeat(): Promise<void> {
		try {
			const instanceId = `${effectiveHostname}:${appName.toLowerCase()}:${port}`;
			const heartbeatUrl = `${eurekaUrl}/apps/${appName.toUpperCase()}/${instanceId}`;

			const response = await fetch(heartbeatUrl, {
				method: "PUT",
				headers: {
					Accept: "application/json",
				},
			});

			if (!response.ok && response.status !== 200) {
				console.warn(
					`[Eureka] Heartbeat failed: ${response.status} ${response.statusText}`,
				);
			}
		} catch (error) {
			console.warn("[Eureka] Heartbeat error:", error);
		}
	}

	async function deregister(): Promise<void> {
		try {
			const instanceId = `${effectiveHostname}:${appName.toLowerCase()}:${port}`;
			const deleteUrl = `${eurekaUrl}/apps/${appName.toUpperCase()}/${instanceId}`;

			await fetch(deleteUrl, {
				method: "DELETE",
				headers: {
					Accept: "application/json",
				},
			});

			console.log("[Eureka] Deregistered successfully");
		} catch (error) {
			console.error("[Eureka] Deregistration error:", error);
		}
	}

	const cleanup = async (): Promise<void> => {
		console.log("[Eureka] Shutting down, deregistering...");
		try {
			await deregister();
		} catch (e) {
			console.error("[Eureka] Deregistration failed during shutdown:", e);
		}
		await Bun.sleep(500);
		process.exit(0);
	};

	process.on("SIGINT", cleanup);
	process.on("SIGTERM", cleanup);

	await register();

	setInterval(heartbeat, heartbeatInterval);
}
