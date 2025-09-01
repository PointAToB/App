import { compare, verifyPassword } from "./verifyPassword.ts";


function isEmpty(field: string) {
	return field === ''
}

// Function used for error handling
function setError(errors: string[], setErrors: (errors: string[] | []) => void, isError: boolean, errorString: string):void {
	// Add Error
	if (isError && !errors.includes(errorString))  {
		setErrors([...errors, errorString]);
	}
	// Remove Error
	else if (!isError && errors.includes(errorString)) {
		const tmpErrorList: string[] = errors.filter(error => error !== errorString);
		setErrors(tmpErrorList);
	}
}


// Verifies that create account fields when submitted are well-formed
export function verifyCreateAccountFields(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordReEntry: string,
	errors: string[] | [],
  setErrors: (errors: string[]) => void
): boolean {

	let isError: boolean;
	let errorStr: string;
	/*
	// If any of the fields are blank assign the error: 'Fields cannot be left blank'
  isError = (isEmpty(firstName) || isEmpty(lastName) || isEmpty(email) || isEmpty(password) || isEmpty(passwordReEntry));
	errorStr = 'Fields cannot be left blank';
	setError(errors, setErrors, isError, errorStr);
	*/
	// Checks that both password entries are the same
	isError = (!compare(password, passwordReEntry));
	errorStr = 'Passwords do not match';
	//setError(errors, setErrors, isError, errorStr);

	// Validate password is well-formed
	verifyPassword(password, errors, setErrors);

	errors.forEach(value => console.log("Error: " + value));

	return errors.length === 0;
}