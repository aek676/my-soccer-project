export function resolvePlaceholder(
	value: string,
	props: Record<string, string> = {},
): string {
	if (!value) return value;

	let resolved = value;
	const pattern = /\$\{([\w.-]+)(?::([^}]*))?\}/g;

	while (pattern.test(resolved)) {
		resolved = resolved.replace(pattern, (match, key, defaultVal) => {
			const envVal = Bun.env[key];
			if (envVal !== undefined) return envVal;
			const propVal = props[key];
			if (propVal !== undefined) return propVal;
			if (defaultVal !== undefined) return defaultVal;
			return match;
		});
	}

	return resolved;
}
