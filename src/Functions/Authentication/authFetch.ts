import { fetch, FetchRequestInit } from "expo/fetch";
import tokenHandler from "./tokenHandler";


export const authFetchStatusCodes = {
	OFFLINE: 19,
	ABORTED: 20,
	UNKNOWN_ERROR: 0
}

export default async function authFetch(url: string, options: FetchRequestInit) {
	const updatedHeader = new Headers(options.headers)
	updatedHeader.append('Authorization', `Bearer ${await tokenHandler()}`)
	options.headers = updatedHeader

	try {
		return await fetch(url, options)
	}
	catch (e: any) {
		// Network related error code: 19
		if(e instanceof TypeError) {
			return new Response(null, {
				status: authFetchStatusCodes.OFFLINE,
				statusText: 'Network connection failed or server is unreachable.'
			})
		}

		// Fetch aborted code: 20
		if(e.name === 'AbortError') {
			return new Response(null, {
				status: authFetchStatusCodes.ABORTED,
				statusText: 'Request was aborted by the client.'
			})
		}

		// Other error code: 0
		else {
			return new Response(null, {
				status: authFetchStatusCodes.UNKNOWN_ERROR,
				statusText: `Unknown Fetch Error: ${e.message}`
			})
		}
	}


}