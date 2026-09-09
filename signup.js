import { useState } from "react";
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { supabase } from './supabase';
 
export default function SignUpScreen({ navigation }) {
    const [email, setEmail]           = useState("");
    const [password, setPassword]        = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
 
    function validate() {
        if (!email) {
            Alert.alert("Missing info", "Please enter your email.");
            return false;
        }
        if (!email.includes("@")) {
            Alert.alert("Invalid email", "Please enter a valid email address.");
            return false;
        }
        if (!password) {
            Alert.alert("Missing info", "Please enter a password.");
            return false;
        }
        if (password.length < 6) {
            Alert.alert("Weak password", "Password must be at least 6 characters.");
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert("Passwords don't match", "Please make sure your passwords match.");
            return false;
        }
        return true;
    }
 
    async function signUp() {
        if (!validate()) return;
        const { data, error } = await supabase.auth.signUp({
            email:    email,
            password: password,
        });
 
        if (error) throw error;
 
        const userId = data.user.id;
 
        navigation.navigate("Inputs", { userId: userId });
    }
 
    return (
        <ScrollView style={styles.background}>
            <Text style={styles.title}>Sign up to get started{'\n'}</Text>
            <View style={styles.row}>
                <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#ffffff"
                    style={styles.inputs}
                    value={email}
                    onChangeText={setEmail}
                />
            </View><Text>{'\n'}</Text>
            <View style={styles.row}>
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor="#ffffff"
                    style={styles.inputs}
                    value={password}
                    onChangeText={setPassword}
                />
            </View><Text>{'\n'}</Text>
 
            <View style={styles.row}>
                <TextInput
                    placeholder="Confirm password"
                    secureTextEntry={true}
                    placeholderTextColor="#ffffff"
                    style={styles.inputs}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View><Text>{'\n'}</Text>

            <Button style={styles.button} onPress={signUp} title='Sign Up'></Button><Text>{'\n'}</Text>
 
            <TouchableOpacity
                onPress={() => navigation.navigate("LogIn")}
            >
                <Text style={styles.login}>Already have an account? Log in</Text>
            </TouchableOpacity>
 
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#191970",
    },
    title: {
        color: "#ffffff",
        marginTop: 50,
        alignItems: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: "#ffffff",
        fontSize: 20,
    },
    inputs: {
        color: "#ffffff",
        width: 350,
        borderWidth: 1,
        borderColor: "#ffffff",
        backgroundColor: "#1e90ff",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    login: {
        color: "#ffffff",
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    button: {
        color: "#00bfff",
    },
    row: {
        flexDirection: 'row',
    }
});