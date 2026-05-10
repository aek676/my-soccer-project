export async function fetchRemoteConfig(appName: string, profile: string) {
	const configServerUrl = Bun.env.CONFIG_SERVER_URL || "http:localhost:8888";

	try {
		const url = `${configServerUrl}/${appName}/${profile}`;
		console.log(`Fetching configuration from ${url}`);

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Error fetching config: ${response.status} ${response.statusText}`,
			);
		}

		const data = await response.json();

		console.log("Configuration fetched successfully:", data);
	} catch (error) {
		console.error("Failed to fetch remote configuration:", error);
		throw error;
	}
}
