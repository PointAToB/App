import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Dimensions, Platform, Switch } from 'react-native';
import Logo from '../Components/logo';
import LineWithText from '../Components/lineWithText';
import Button from '../Components/button';
import { getToken } from '../Functions/keyStore';
import { api_root_url } from '../Settings/constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../Components/themeToggle';

const Profile = () => {
    type UserType = {
        firstName: string;
        lastName: string;
        email: string;
        weight: number | null;   // integer or null
        height: number | null;   // integer or null
        birthDate: Date | null;  // Date object or null
    };

  	const { theme, toggleThemeMode, toggleColorTheme, isDarkMode } = useTheme();

	function parseDateString(dateString: string): Date | null {
  		if (!dateString || typeof dateString !== 'string') return null;

  		try {
    		// Handle known format like "1982-07-07T00:00:00"
    		const [datePart] = dateString.split('T'); // Get '1982-07-07'
    		const [year, month, day] = datePart.split('-').map(Number);

    		if (
      			isNaN(year) || isNaN(month) || isNaN(day) ||
      			month < 1 || month > 12 ||
      			day < 1 || day > 31
    		) {
      			console.warn('Invalid date values:', { year, month, day });
      			return null;
    		}

    		const parsedDate = new Date(year, month - 1, day); // month is 0-based
    		return parsedDate;
  		} catch (e) {
    		console.warn('Failed to parse birth date:', dateString, e);
    		return null;
  		}
	}

	const inchesToFeetInches = (inches: number | null) => {
  		if (inches == null || isNaN(inches)) return { feet: '', inches: '' };
  		const feet = Math.floor(inches / 12);
  		const remainder = inches % 12;
  		return { feet: feet.toString(), inches: remainder.toString() };
	};

	const feetInchesToInches = (feet: string | '', inches: string | '') => {
  		const f = parseInt(feet, 10) || 0;
  		const i = parseInt(inches, 10) || 0;
  		if (isNaN(f) && isNaN(i)) return null;
  		return (isNaN(f) ? 0 : f) * 12 + (isNaN(i) ? 0 : i);
	};

	const windowHeight: number = Dimensions.get('window').height;

	const updateUser = async () => {
    	const token = await getToken({ token: 'access' });
    	if (!token) {
        	console.warn('No token found. User is not authenticated.');
        	return false;
    	}

    	try {
        	const response = await fetch(`${api_root_url}user`, {
            	method: 'PUT',
            	headers: {
                	'Content-Type': 'application/json',
                	'Authorization': `Bearer ${token}`
            	},

            	body: JSON.stringify({
					// Only send fields that were edited or needed
					firstName: editedUser.firstName,
					lastName: editedUser.lastName,
					email: editedUser.email,
					weight: editedUser.weight,
					height: editedUser.height,
					birthDate: editedUser.birthDate?.toISOString().split('T')[0], // format to YYYY-MM-DD
				}),
       	 	});

        	if (response.ok) {
            	console.log('User updated successfully');
            	return true;
        	} 
			else {
				const text = await response.text();
				console.error('Failed to update user:', response.status, text);
            	return false;
        	}

    	} catch (error) {
    		console.error('Error updating user:', error);
        	return false;
    	}
	};

	const fetchUserProfile = async () => {
		setIsLoading(true); // <--- start loading

		const token = await getToken({ token: 'access' });

		if (!token) {
			console.warn('No token found');
			setIsLoading(false); // <--- stop loading even on failure
			return;
		}

		try {
			const response = await fetch(`${api_root_url}user`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				console.error('Failed to fetch user profile');
				setIsLoading(false);
				return;
			}

			const rawUserData = await response.json();

			console.log(rawUserData.birthDate)

			const userData: UserType = {
				firstName: rawUserData.firstName,
				lastName: rawUserData.lastName,
				email: rawUserData.email,
				weight: rawUserData.weight,
				height: rawUserData.height,
				birthDate: rawUserData.birthDate ? parseDateString(rawUserData.birthDate) : null,			
			};

			console.log('Parsed birthDate:', userData.birthDate);


			setUser(userData);
			setEditedUser(userData);
			setUserId(rawUserData.id);
		} catch (error) {
			console.error('Error fetching user profile:', error);
		} finally {
			setIsLoading(false); // <-- stop loading once done
		}
	};

	const [user, setUser] = useState<UserType>({
        firstName: '',
        lastName: '',
        email: '',
        weight: null,
        height: null,
        birthDate: null,
	});

	const [isEditing, setIsEditing] = useState(false);
	const [editedUser, setEditedUser] = useState(user);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [userId, setUserId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showDatePicker, setShowDatePicker] = useState(true);
	const [heightFeet, setHeightFeet] = useState('');
	const [heightInches, setHeightInches] = useState('');


	useEffect(() => {
  		const { feet, inches } = inchesToFeetInches(editedUser.height);
  		setHeightFeet(feet);
  		setHeightInches(inches);
	}, [editedUser.height]);

	const onChangeDate = (event: any, selectedDate?: Date) => {
  		setShowDatePicker(Platform.OS === 'ios');  // keep open on iOS until user closes
  		if (selectedDate) {
    		setEditedUser({ ...editedUser, birthDate: selectedDate });
  		}
	};

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const handleSave = async () => {
    	if (validateInputs()) {
        	const success = await updateUser();
        	if (success) {
            	setUser(editedUser);
            	setIsEditing(false);
        	} 
			else {
            	console.error("Failed to update user on backend.");
        	}
    	} 
		else {
        	console.log('Validation failed', errors);
    	}
	};

    const validateInputs = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate firstName
        if (!editedUser.firstName || typeof editedUser.firstName !== 'string') {
            newErrors.firstName = 'First name is required and must be a string.';
        }

        // Validate lastName
        if (!editedUser.lastName || typeof editedUser.lastName !== 'string') {
            newErrors.lastName = 'Last name must be a non-empty string';
        }

        // Validate email (simple regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editedUser.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Validate weight (integer)
        if (
            editedUser.weight !== null &&
            (isNaN(Number(editedUser.weight)) || !Number.isInteger(Number(editedUser.weight)))
        ) {
            newErrors.weight = 'Weight must be an integer';
        }

        // Validate height (integer)
         if (
            editedUser.height !== null &&
            (isNaN(Number(editedUser.height)) || !Number.isInteger(Number(editedUser.height)))
        ) {
            newErrors.height = 'Height must be an integer';
        }

		if (editedUser.birthDate) {
  			let date: Date;

  			if (typeof editedUser.birthDate === 'string') {
    			// Optional format check (if you care)
    			const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(editedUser.birthDate);
    			if (!isValidFormat) {
      				newErrors.birthDate = 'Date must be in YYYY-MM-DD format';
    			}

    			const parsed = parseDateString(editedUser.birthDate);
    			if (!parsed || isNaN(parsed.getTime())) {
      				newErrors.birthDate = 'Invalid date';
    			}

  			} 
		
			else if (editedUser.birthDate instanceof Date) {
    			if (isNaN(editedUser.birthDate.getTime())) {
      				newErrors.birthDate = 'Invalid date';
    			}
  			} 

			else {
    			newErrors.birthDate = 'Date is not valid';
  			}
		}

        setErrors(newErrors); 
        
        return Object.keys(newErrors).length === 0; 
    }
	
	if (isLoading) {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Loading profile...</Text>
		</View>
	);

	}
	return (
		<View style={{ flex: 1, backgroundColor: theme.background }}>
			<ScrollView style={[styles.main]}>
				<Logo primaryColor={theme.primaryColor} secondaryColor={theme.secondaryColor} />
			
				<View style={{ paddingTop: windowHeight / 20 }} />
			
				<View style={styles.header}>
					<Text style={[styles.text, { fontWeight: 'bold', color: theme.text }]}>Profile</Text>
					<Text style={[styles.text, { fontWeight: 'thin', color: theme.text}]}>Your personal information</Text>
				</View>
			
				<LineWithText text="about you" />
			
				<View style={[styles.profileField, { flexDirection: 'row', alignItems: 'baseline' }]}>
					<Text style={[ styles.label, { color: theme.text }]}>First Name: </Text>
			
					{errors.firstName && (
						<Text style={styles.error}>{errors.firstName}</Text>
					)}
			
					{isEditing ? (
						<TextInput
							style={styles.input}
							value={editedUser.firstName}
							onChangeText={(text) => setEditedUser({ ...editedUser, firstName: text })}
						/>
				) : (
					<Text style={[ styles.value, { color: theme.text }]}>{user.firstName}</Text>
					)}
				</View>
			
				<View style={[styles.profileField, { flexDirection: 'row', alignItems: 'baseline' }]}>
					<Text style={[ styles.label, { color: theme.text }]}>Last Name: </Text>
			
					{errors.lastName && (
						<Text style={styles.error}>{errors.lastName}</Text>
					)}
			
					{isEditing ? (
						<TextInput
							style={styles.input}
							value={editedUser.lastName}
							onChangeText={(text) => setEditedUser({ ...editedUser, lastName: text })}
						/>
					) : (
						<Text style={[ styles.value, { color: theme.text }]}>{user.lastName}</Text>
					)}
				</View>
			
				<View style={[styles.profileField, { flexDirection: 'row', alignItems: 'baseline' }]}>
					<Text style={[ styles.label, {color: theme.text }]}>Email: </Text>
			
					{errors.email && (
						<Text style={styles.error}>{errors.email}</Text>
					)}
			
					{isEditing ? (
						<TextInput
							style={styles.input}
							value={editedUser.email}
							onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
						/>
					) : (
						<Text style={[ styles.value, {color: theme.text }]}>{user.email}</Text>
					)}
				</View>
			
				<View style={[styles.profileField, { flexDirection: 'row', alignItems: 'baseline' }]}>
					<Text style={[ styles.label, { color: theme.text }]}>Weight: </Text>
			
					{errors.weight && (
						<Text style={styles.error}>{errors.weight}</Text>
					)}
			
					{isEditing ? (
						<TextInput
							style={styles.input}
							value={editedUser.weight !== null ? editedUser.weight.toString() : ''}
							onChangeText={(text) => {
							const num = parseInt(text, 10);
							setEditedUser({ ...editedUser, weight: isNaN(num) ? null : num })
							}}
						/>
					) : (
						<Text style={[ styles.value, { color: theme.text }]}>{user.weight} lbs</Text>
					)}
				</View>
			
				<View style={[styles.profileField, { flexDirection: 'row', alignItems: 'baseline' }]}>
					<Text style={[ styles.label, { color: theme.text }]}>Height:</Text>
			
					{errors.height && <Text style={styles.error}>{errors.height}</Text>}
			
					{isEditing ? (
					// Editing mode → two small inputs for feet and inches
						<>
						<TextInput
							style={[styles.input, { width: 50, marginLeft: 10 }]}
							value={inchesToFeetInches(editedUser.height).feet.toString()}
							keyboardType="numeric"
							onChangeText={(text) => {
								const { inches } = inchesToFeetInches(editedUser.height);
								const newFeet = parseInt(text, 10) || 0;
								const total = feetInchesToInches(newFeet.toString(), inches);
								setEditedUser({ ...editedUser, height: total });
							}}
							placeholder="ft"
						/>
						<Text style={{ marginHorizontal: 4 }}>ft</Text>
						<TextInput
							style={[styles.input, { width: 50 }]}
							value={inchesToFeetInches(editedUser.height).inches.toString()}
							keyboardType="numeric"
							onChangeText={(text) => {
								const { feet } = inchesToFeetInches(editedUser.height);
								const newInches = parseInt(text, 10) || 0;
								const total = feetInchesToInches(feet, newInches.toString());
								setEditedUser({ ...editedUser, height: total });
							}}
							placeholder="in"
						/>
						<Text style={{ marginLeft: 4 }}>in</Text>
						</>
					) : (
						// Display mode → convert inches to formatted string
						<Text style={[styles.value, { marginLeft: 10 }, { color: theme.text }]}>
							{user.height != null
							? `${Math.floor(user.height / 12)}′ ${user.height % 12}″`
							: ''}
						</Text>
					)}
				</View>
				
				{/* TODO: See if this breaks based on iOS or Android, it's doing weird things on Android but works on iOS */}
				<View style={[styles.profileField, { flexDirection: 'row', alignItems: 'baseline' }]}>
					<Text style={[ styles.label, {color: theme.text }]}>Date of Birth: </Text>
				
					{errors.birthDate && <Text style={styles.error}>{errors.birthDate}</Text>}
				
					{isEditing ? (
						<>
						{showDatePicker && (
							<DateTimePicker
								value={editedUser.birthDate || new Date(2000, 0, 1)}
								mode="date"
								display="default"
								onChange={onChangeDate}
								maximumDate={new Date()}
								// style={{ flex: 1 }} // optional, but usually modal pickers ignore style
								/>
						)}
						</>
					) : (
						<Text style={[styles.value, { color: theme.text }]}>
							{user.birthDate ? user.birthDate.toLocaleDateString() : ''}
						</Text>
					)}
				</View>
				
				<View style={{ flex: 1, backgroundColor: theme.background }}>
					<Text style={{ color: theme.text, fontSize: 18, marginBottom: 10 }}>Theme Settings</Text>
				
					<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
						<Text style={{ color: theme.text, marginRight: 10 }}>Dark Mode</Text>
						<Switch value={isDarkMode} onValueChange={toggleThemeMode} />
					</View>
				
					<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
						<Text style={{ color: theme.text, marginRight: 10 }}>Color Theme</Text>
						<Button 
							text="Toggle Theme" 
							onPress={toggleColorTheme} 
							primaryColor={theme.primaryColor}
							textColor="#FFFFFF"
							width={150}
							fontSize={15} />
					</View>
				</View>
				
				<View style={{ paddingTop: 30 }} />
				
					{isEditing ? (
						// When editing, show Save + Cancel side by side
						<View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
							<Button
								onPress={handleSave}
								text="Save"
								primaryColor="#00C851"
								textColor="#FFFFFF"
								width={150}
								fontSize={15}
							/>
							<Button
								onPress={() => {
									setEditedUser(user); // Reset form changes
									setIsEditing(false); // Exit edit mode
								}}
								text="Cancel"
								primaryColor="#fc0303"
								textColor="#FFFFFF"
								width={150}
								fontSize={15}
							/>
						</View>
					) : (
						// When not editing, show only Edit
						<Button
							onPress={() => setIsEditing(true)}
							text="Edit"
							primaryColor={theme.primaryColor}
							textColor="#FFFFFF"
							width={150}
							fontSize={15}
						/>
					)}
				
				<View style={{ paddingBottom: windowHeight / 10 }} />
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	main: {
		margin: 25,
	},
	header: {
		marginBottom: 15,
	},
	text: {
		fontSize: 15,
		textAlign: 'center',
		color: '#000000',
	},
	profileField: {
		marginVertical: 10,
	},
	label: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 5,
	},
	value: {
		fontSize: 15,
		color: '#333',
	},
	input: {
		borderColor: '#CCCCCC',
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		fontSize: 15,
		backgroundColor: '#FAFAFA',
	},
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
	  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label1: {
    fontSize: 18,
  },
});

export default Profile;