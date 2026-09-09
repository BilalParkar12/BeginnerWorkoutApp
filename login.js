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
 
export default function LoginScreen({ navigation }) {
    const [email,   setEmail]   = useState("");
    const [password,setPassword]= useState("");
 
    function validate() {
        if (!email) {
            Alert.alert("Missing info", "Please enter your email.");
            return false;
        }
        if (!password) {
            Alert.alert("Missing info", "Please enter your password.");
            return false;
        }
        return true;
    }
 
    async function logIn() {
        if (!validate()) return;
        const { data, error } = await supabase.auth.signInWithPassword({
            email:    email,
            password: password,
        });
 
        if (error) throw error;
 
        const userId = data.user.id;
 
        const { data: profile } = await supabase
            .from("Users")
            .select("*")
            .eq("user_id", userId)
            .limit(1);
 
        if (profile && profile.length > 0) {
            navigation.navigate("MainTabs", {userId: userId});
        } else {
            navigation.navigate("Inputs", { userId: userId});
        }
    }
 
    return (
        <ScrollView style={styles.background}>
            <Text style={styles.title}>Log in to continue</Text><Text>{'\n'}</Text>

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

            <Button style={styles.button} onPress={logIn} title='Log In'></Button><Text>{'\n'}</Text>

            <TouchableOpacity
                onPress={() => navigation.navigate("SignUp")}
            >
                <Text style={styles.signup}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

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
    signup: {
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