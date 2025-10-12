import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../Components/logo';
import LineWithText from '../Components/lineWithText';
import Button from '../Components/button';

const Profile = () => {
    type UserType = {
        firstName: string;
        lastName: string;
        email: string;
        weight: number | null;   // integer or null
        height: number | null;   // integer or null
        birthDate: Date | null;  // Date object or null
    };

	const windowHeight: number = Dimensions.get('window').height;
	const navigation = useNavigation();

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

    const handleSave = () => {
        if (validateInputs()) {
            setUser(editedUser);
            setIsEditing(false);
            setErrors({});
        } else {
            // You could also show an alert or notification here
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

        // Validate birthDate (YYYY-MM-DD)
        if (
            editedUser.birthDate &&
            !/^\d{4}-\d{2}-\d{2}$/.test(
            typeof editedUser.birthDate === 'string'
            ? editedUser.birthDate
            : editedUser.birthDate.toISOString().split('T')[0] )
        ) {
            newErrors.birthDate = 'Date of birth must be in YYYY-MM-DD format';
        } else if (editedUser.birthDate) {
            const date = new Date(editedUser.birthDate);
            if (isNaN(date.getTime())) {
                newErrors.birthDate = 'Invalid date';
            }
        }

        setErrors(newErrors); 
        
        return Object.keys(newErrors).length === 0; 
    }
	return (
		<ScrollView style={styles.main}>
			<Logo primaryColor="#DD00FF" secondaryColor="#7650FF" />

			<View style={{ paddingTop: windowHeight / 20 }} />

			<View style={styles.header}>
				<Text style={[styles.text, { fontWeight: 'bold' }]}>Profile</Text>
				<Text style={[styles.text, { fontWeight: 'thin' }]}>Your personal information</Text>
			</View>

			<LineWithText text="about you" />

			<View style={styles.profileField}>
				<Text style={styles.label}>First Name:</Text>

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
					<Text style={styles.value}>{user.firstName}</Text>
				)}
			</View>

            <View style={styles.profileField}>
				<Text style={styles.label}>Last Name:</Text>

                {errors.firstName && (
                    <Text style={styles.error}>{errors.lastName}</Text>
                )}

				{isEditing ? (
					<TextInput
						style={styles.input}
						value={editedUser.lastName}
						onChangeText={(text) => setEditedUser({ ...editedUser, lastName: text })}
					/>
				) : (
					<Text style={styles.value}>{user.lastName}</Text>
				)}
			</View>

			<View style={styles.profileField}>
				<Text style={styles.label}>Email:</Text>

                {errors.firstName && (
                    <Text style={styles.error}>{errors.email}</Text>
                )}

				{isEditing ? (
					<TextInput
						style={styles.input}
						value={editedUser.email}
						onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
					/>
				) : (
					<Text style={styles.value}>{user.email}</Text>
				)}
			</View>

            <View style={styles.profileField}>
				<Text style={styles.label}>Weight:</Text>

                {errors.firstName && (
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
					<Text style={styles.value}>{user.weight}</Text>
				)}
			</View>

            <View style={styles.profileField}>
				<Text style={styles.label}>Height:</Text>

                {errors.firstName && (
                    <Text style={styles.error}>{errors.height}</Text>
                )}

				{isEditing ? (
					<TextInput
						style={styles.input}
						value={editedUser.height !== null ? editedUser.height.toString() : ''}
						onChangeText={(text) => {
                            const num = parseInt(text, 10);
                            setEditedUser({ ...editedUser, height: isNaN(num) ? null : num })
                        }}
					/>
				) : (
					<Text style={styles.value}>{user.height}</Text>
				)}
			</View>

            <View style={styles.profileField}>
				<Text style={styles.label}>Date of Birth:</Text>

                {errors.firstName && (
                    <Text style={styles.error}>{errors.birthDate}</Text>
                )}

				{isEditing ? (
					<TextInput
						style={styles.input}
						value={editedUser.birthDate ? editedUser.birthDate.toISOString().substring(0, 10) : ''}
						onChangeText={(text) => {
                            const date = new Date(text);
                            setEditedUser({ ...editedUser, birthDate: isNaN(date.getTime()) ? null : date })
                        }}
					/>
				) : (
					<Text style={styles.value}>{user.birthDate ? user.birthDate.toLocaleDateString() : ''}</Text>
				)}
			</View>

			<View style={{ paddingTop: 30 }} />
			{isEditing ? (
				<Button
					onPress={handleSave}
					text="Save"
					primaryColor="#00C851"
					textColor="#FFFFFF"
					width={150}
					fontSize={15}
				/>
			) : (
				<Button
					onPress={() => setIsEditing(true)}
					text="Edit"
					primaryColor="#DD00FF"
					textColor="#FFFFFF"
					width={150}
					fontSize={15}
				/>
			)}

			<View style={{ paddingTop: 20 }} />
			{isEditing && (
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
            )}

			<View style={{ paddingBottom: windowHeight / 10 }} />
		</ScrollView>
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
});

export default Profile;