export const sanitizeKeys = (key: string[]) => {
	const sanitizedKeys = key.map((key) => {
		key.replace(/\\/g, '/').replace(/^\./, '');
		return key;
	})
	return sanitizedKeys;
}