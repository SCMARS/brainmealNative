import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Implement login logic
        console.log('Login:', { email, password });

    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Welcome Back!</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#666"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#666"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity onPress={handleLogin}>
                        <LinearGradient
                            colors={['#FF6B00', '#FF8E3C']}
                            style={styles.button}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.registerLink}
                        onPress={() => router.push({ pathname: 'register' })}
                    >
                        <Text style={styles.registerText}>
                            Don't have an account? <Text style={styles.registerTextBold}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    formContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        color: 'white',
        fontSize: 16,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerLink: {
        alignItems: 'center',
    },
    registerText: {
        color: '#666',
        fontSize: 14,
    },
    registerTextBold: {
        color: '#FF6B00',
        fontWeight: 'bold',
    },
}); 