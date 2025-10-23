import * as keychain from 'react-native-keychain';

// Used for Access Token and Refresh Token

export async function setToken(tokenStr: string, tokenName: string)  {
	console.log("mock setToken:", tokenName, tokenStr);
  }

  export async function getToken(tokenName: string) {
	console.log("mock getToken:", tokenName);

	// paste generated token here (temporary fix)
	return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYwNzIwODMwLCJpYXQiOjE3NjA3MjA1MzAsImp0aSI6IjE5OGVmMDk1NzRiMDRhMTc4ZDllMWM3MjhkNzc1MzlmIiwidXNlcl9pZCI6M30.Al2MD6sL0GqMZtSb4xJJ7SnkzvpJyHfnQa-Z9K8neQ4";
  }



