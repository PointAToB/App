import {api_root_url} from "../../Settings/constants";
import {fetch} from "expo/fetch";
import {getToken, setToken, tokenType} from "../keyStore";

// Used for getting the access token from expo secure store
// If expired use refresh token to acquire new access token
// If refresh also expired return null
export default async function tokenHandler() {
	// Verify access token is not expired
	let res = await helperFetch('verify', {token: 'access'})
	if(res.status === 200) return getToken({token: 'access'});

	// Attempt to acquire new access token
	res = await helperFetch('refresh', {token: 'refresh'})
	if(res.status === 200) {
		const body: {access: string} = await res.json()
		await setToken({token: 'access'}, body.access)

		return getToken({token: 'access'});
	}

	return null
}

async function helperFetch(point: string, token: tokenType) {
	const endpoint = (point: string) => (api_root_url + 'token/' + point)
	return fetch(endpoint(point), {method: 'POST', headers: {'Authorization': `Bearer ${await getToken(token)}`}})
}