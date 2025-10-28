import { fetch, FetchRequestInit } from "expo/fetch";
import tokenHandler from "./tokenHandler";


export default async function authFetch(url: string, options: FetchRequestInit = {method: 'GET'}) {
	const updatedHeader = new Headers(options.headers)
	updatedHeader.append('Authorization', `Bearer ${await tokenHandler()}`)
	options.headers = updatedHeader

	return await fetch(url, options)
}



