import { compare, verifyPassword } from "./verifyPassword.ts";


function isEmpty(field: string) {
	return field === ''
}

// Function used for error handling
function setError(errors: string[], setErrors: (errors: string[] | []) => void, errorOccurred: boolean, errorString: string):void {
	// Add Error
	if (errorOccurred && !errors.includes(errorString))  setErrors([errors]);
	// Remove Error
	else if (!errorOccurred && errors.includes(errorString)) {}
}


// Verifies that create account fields when submitted are well-formed
export function verifyCreateAccountFields(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordReEntry: string,
  setErrors: (errors: string[] | []) => void,
	errors: string[]
): boolean {

	// If any of the fields are blank assign the error: 'Fields cannot be left blank'
  if (isEmpty(firstName) || isEmpty(lastName) || isEmpty(email) || isEmpty(password)) errors(['Fields cannot be left blank']);
  else errors([]);

	// Checks that both password entries are the same
	if(!compare(password, passwordReEntry)) errors()


	return true;
}