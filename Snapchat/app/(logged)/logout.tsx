import React, { useState } from 'react';
import { TextInput, Button, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() 
{
  const route = useRouter();
  const logOut = async () => {
      try
      {
          const token = await AsyncStorage.getItem('token');
          if (token !== null)
          {
            JSON.stringify(token)
            await AsyncStorage.removeItem('_id')
            await AsyncStorage.removeItem('username')
            await AsyncStorage.removeItem('token')
            return route.replace("../(auth)/")
          }
          else
          {
            return route.replace("../(auth)/")
          }
      }
      catch (e)
      {
        console.log(e);
      }
  }
  return (
    <SafeAreaView style={
      {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Button title='Log out' onPress={logOut}/>
    </SafeAreaView>
  )
}
