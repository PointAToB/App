import { api_root_url } from "../Settings/constants";
import { setToken } from "./keyStore";

export default async function login(email: string, password: string): 
	Promise<{success: boolean, msg: string} | undefined> {
	const endpoint:string = api_root_url + 'token/pair';

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
		console.log(json)
		// If user is unauthorized
		if(response.status === 401) 
			return {success: false, msg: 'The email or password entered is incorrect'}

		// Saves access/refresh tokens necessary for authorization

		await setToken({token: 'access'}, json.access)
		await setToken({token: 'refresh'}, json.refresh)

    } catch (e) { console.log("Error: " + e); return {success: false, msg: 'Try again later'} }

		return {success: true, msg: 'success'}
}