export function base64UrlDecode(str) {
	str = str.replace(/-/g, '+').replace(/_/g, '/');
	while (str.length % 4) {
		str += '=';
	}
	return atob(str);
}

export function isTokenExpired(token) {
	if (!token) return true;
	try {
		const payload = JSON.parse(base64UrlDecode(token.split('.')[1]));
		if (!payload.exp) return true;
		return Date.now() >= payload.exp * 1000;
	} catch (e) {
		return true;
	}
}
