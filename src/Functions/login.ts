import { api_root_url } from "../Settings/constants";
import { setToken, getToken } from "./keyStore";

export default async function login(email: string, password: string): 
	Promise<{success: boolean, msg: string} | undefined> {
	const endpoint: string = api_root_url + 'login';

	let response: Response;
	try {
		response = await fetch(endpoint, {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});
	} catch (e) {
		return {success: false, msg: 'Try again later'}
	}

	const json = await response.json()
	switch (response.status) {
		case 400:
			return {success: false, msg: 'The password entered is incorrect'}

		case 404:
			return {success: false, msg: 'An account with this email does not exist'}

		case 422:
			return {success: false, msg: 'The email entered is invalid'}

		case 200:
			// Saves access/refresh tokens necessary for authorization
			await setToken({token: 'access'}, json.access);
			await setToken({token: 'refresh'}, json.refresh);
			return {success: true, msg: 'success'}

		default: return {success: false, msg: 'Try again later'}
	}
}
