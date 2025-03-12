export default () => {
	return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
};
