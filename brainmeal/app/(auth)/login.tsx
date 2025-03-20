import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#FF6B00', '#FF8533']}
            style={styles.logoContainer}
          >
            <Text style={styles.logoText}>BM</Text>
          </LinearGradient>
          <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
            Sign in to continue
          </Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
            <TextInput
              style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
              placeholder="Email"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
            <TextInput
              style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
              placeholder="Password"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.forgotPassword, { opacity: loading ? 0.5 : 1 }]}
            onPress={() => router.push('/forgot-password')}
            disabled={loading}
          >
            <Text style={[styles.forgotPasswordText, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { opacity: loading ? 0.5 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={['#FF6B00', '#FF8533']}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/register')}
              disabled={loading}
            >
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 15,
  },
  inputContainer: {
    borderRadius: 12,
    padding: 15,
  },
  input: {
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: 10,
  },
  loginButtonGradient: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    marginRight: 5,
  },
  registerLink: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '600',
  },
}); 