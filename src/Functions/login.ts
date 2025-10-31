import { api_root_url } from "../Settings/constants";
import { setToken } from "./keyStore";
import { isEmpty } from "./verifyFields";

export default async function login(email: string, password: string): 
	Promise<{success: boolean, msg: string} | undefined> {
	const endpoint: string = api_root_url + 'login';

	// Verify fields are well-formed (Non-Empty)
	if (isEmpty(email, password))
		return {success: false, msg: 'Fields cannot be left blank'}

	try {
		const response: Response = await fetch(endpoint, {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});

		const json = await response.json()
		switch (response.status) {
			case 200:
				await setToken({token: 'access'}, json.access);
				await setToken({token: 'refresh'}, json.refresh);
				return {success: true, msg: 'success'}

			case 400:
				return {success: false, msg: 'The password entered is incorrect'}

			case 404:
				return {success: false, msg: 'An account with this email does not exist'}

			case 422:
				return {success: false, msg: 'The email entered is invalid'}
			}
		} catch (e) { return {success: false, msg: 'Try again later'} }
}
