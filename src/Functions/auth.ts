import { fetch, FetchRequestInit } from "expo/fetch";
<<<<<<< HEAD
import { api_root_url } from "../Settings/constants";
import { getToken, setToken } from "./keyStore";


export default async function authFetch(endpoint: string, options: FetchRequestInit = {method: 'GET'}) {
=======
import {api_root_url} from "../Settings/constants";
import {getToken, setToken} from "./keyStore";

export async function authFetch(endpoint: string, options: FetchRequestInit = {method: 'GET'}) {
>>>>>>> origin/main
	const updatedHeader = new Headers(options.headers)
	updatedHeader.append('Authorization', `Bearer ${await tokenHandler()}`)
	options.headers = updatedHeader

	return await fetch(api_root_url + endpoint, options)
}

// Used for getting the access token from expo secure store
// If expired use refresh token to acquire new access token
// If refresh also expired return null
<<<<<<< HEAD
async function tokenHandler() {
=======
export async function tokenHandler() {
>>>>>>> origin/main
	// Verify access token is not expired
	const accessToken = await getToken({token: 'access'})
	let res = await  fetch(api_root_url + 'token/verify', {method: 'POST', body: JSON.stringify({
			token: accessToken
		})});
	if(res.status === 200) return accessToken


	// Attempt to acquire new access token
	res = await fetch(api_root_url + 'token/refresh', {method: 'POST', body: JSON.stringify({
			refresh: await getToken({token: 'refresh'})
		})});

	if(res.status === 200) {
		const body = await res.json()
		await setToken({token: 'access'}, body.access)
		return body.access;
	}

	return null
}




