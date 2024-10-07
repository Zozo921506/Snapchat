import React, { useState } from 'react';
import { TextInput, Button, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
const SignupScreen = () => 
{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const route = useRouter();
  const handleSignUp = () => 
{
    fetch('https://snapchat.epidoc.eu/user', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVuem8uZmFsbGFAZXBpdGVjaC5ldSIsImlhdCI6MTcxNzc2MjYyM30.JHzgZz6DsIdb-zqL95IfoZYHhw0BKx_qPUBpAsBKrk0' } //remplacez la valeur de x-api-key par votre token api
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      alert("Successfully created")
    return route.replace("/")})
    .catch(error => console.error(error));
  };
  return (
    <SafeAreaView
        style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <TextInput
            placeholder="Username"
            placeholderTextColor={"gray"}
            value={username}
            onChangeText={setUsername}
            style={{textAlign: 'center'}}
        />
        <TextInput
            placeholder="Email"
            placeholderTextColor={"gray"}
            value={email}
            onChangeText={setEmail}
            style={{textAlign: 'center'}}
        />
        <TextInput
            placeholder="Password"
            placeholderTextColor={"gray"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{textAlign: 'center'}}
        />
        <Button
            title="Sign up"
            onPress={handleSignUp}
        />
    </SafeAreaView>
  );
};
export default SignupScreen;