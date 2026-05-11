interface ConfigPropertySource {
	name: string;
	source: Record<string, string>;
}

interface ConfigResponse {
	name?: string;
	profiles?: string[];
	label?: string | null;
	version?: string;
	state?: string;
	propertySources?: ConfigPropertySource[];
}

export async function fetchRemoteConfig(
	appName: string,
	profile: string,
): Promise<Record<string, string>> {
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

		const data = (await response.json()) as ConfigResponse;

		console.log(
			"Configuration fetched successfully:",
			JSON.stringify(data, null, 2),
		);

		const properties: Record<string, string> = {};
		for (const source of data.propertySources ?? []) {
			Object.assign(properties, source.source);
		}

		console.log(
			"Merged configuration properties:",
			JSON.stringify(properties, null, 2),
		);

		return properties;
	} catch (error) {
		console.error("Failed to fetch remote configuration:", error);
		throw error;
	}
}
