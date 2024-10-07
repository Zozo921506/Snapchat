import React, { useState } from 'react';
import { TextInput, Button, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
const LoginScreen = () => 
{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const route = useRouter();
  const handleLogin = () => 
  {
    fetch('https://snapchat.epidoc.eu/user', 
    {
      method: 'PUT',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVuem8uZmFsbGFAZXBpdGVjaC5ldSIsImlhdCI6MTcxNzc2MjYyM30.JHzgZz6DsIdb-zqL95IfoZYHhw0BKx_qPUBpAsBKrk0' } //remplacez la valeur de x-api-key par votre token api
    })
    .then(response => response.json())
    .then(async data => {
      if (data.data._id !== undefined && data.data._id !== null && data.data.username !== undefined && data.data.username !== null && data.data.token !== undefined && data.data.token !== null)
      {
        AsyncStorage.multiSet([['_id', data.data._id], ['username', data.data.username], ['token', data.data.token]]);
        return route.replace("../(logged)/")
      }
      else
      {
        alert("User doesn't exist");
        return "User doesn't exist";
      }

    })
    .catch(error => console.error(error));
  };
  return (
    <SafeAreaView style={
    {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
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
        title="Log in"
        onPress={handleLogin}
      />
    </SafeAreaView>
  );
};
export default LoginScreen;