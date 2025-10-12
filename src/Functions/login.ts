import { api_root_url } from "../Settings/constants";
import { setToken } from "./keyStore";

export default async function Login(email: string, password: string): Promise<boolean> {
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

		// If user is unauthorized
		if(response.status === 401) return false;

		// Saves access/refresh tokens necessary for authorization
		const json: {access: string, refresh: string} = JSON.parse(await response.json())
		await setToken({token: 'access'}, json.access)
		await setToken({token: 'refresh'}, json.refresh)

    } catch (e) { console.error(e); return false; }

		return true;
}