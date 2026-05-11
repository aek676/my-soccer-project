import { resolvePlaceholder } from "../utils/resolvePlaceholder";

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
	const configServerUrl =
		Bun.env.SPRING_CLOUD_CONFIG_COMPONENT_URI || "http://localhost:8888";

	try {
		const url = `${configServerUrl}/${appName}/${profile}`;

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Error fetching config: ${response.status} ${response.statusText}`,
			);
		}

		const data = (await response.json()) as ConfigResponse;

		const properties: Record<string, string> = {};
		for (const source of data.propertySources ?? []) {
			Object.assign(properties, source.source);
		}

		return properties;
	} catch (error) {
		console.error("Failed to fetch remote configuration:", error);
		throw error;
	}
}

export async function buildConfig() {
	const env = Bun.env.NODE_ENV || "local";

	const remoteProps = await fetchRemoteConfig("bun-backend", env);

	return {
		app: {
			name: resolvePlaceholder(
				remoteProps["spring.application.name"],
				remoteProps,
			),
			port: Number(resolvePlaceholder(remoteProps["server.port"], remoteProps)),
			hostname: resolvePlaceholder(
				remoteProps["eureka.instance.hostname"],
				remoteProps,
			),
		},
		datasource: {
			url:
				resolvePlaceholder(remoteProps["spring.datasource.url"], remoteProps) ||
				Bun.env.MONGO_ATLAS_URI,
			db:
				resolvePlaceholder(remoteProps["spring.datasource.db"], remoteProps) ||
				Bun.env.MONGO_ATLAS_DB_NAME,
		},
		eureka: {
			hostname: resolvePlaceholder(
				remoteProps["eureka.instance.hostname"],
				remoteProps,
			),
			instanceId: resolvePlaceholder(
				remoteProps["eureka.instance.instance-id"],
				remoteProps,
			),
		},
	};
}
