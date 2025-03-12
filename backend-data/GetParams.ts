export const getParams = (url: string): URLSearchParams => {
	const u = new URL(url);

	return u.searchParams;
};
