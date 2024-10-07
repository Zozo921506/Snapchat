import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, FlatList, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState('');
  const [duration, setDuration] = useState(5);
  const [logged, setLogged] = useState('')
  const route = useRouter();
  const [friend, setFriend] = useState([]);
  const [to, setTo] = useState('')

  const userToken = async () => {
    try
        {
          const token = await AsyncStorage.getItem('token');
          if (token !== null)
          {
            setLogged(token)
          }
          else
          {
            return route.replace("../(auth)/")
          }
        }
    catch(e)
    {
      console.log(e);
    }
  }

  userToken();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const gallery = async () => {
    let pic = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!pic.canceled) 
    {
      setImage(pic.assets[0].uri);
    }
  };

  const camera = async () => {
    let pic = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    })
    if (!pic.canceled)
    {
      setImage(pic.assets[0].uri);
    }
  };

  const resetPicture = () => {
    setImage('');
  };

  const resetFriends = () => {
    setFriend([]);
  }

  const sendPicture = async () => {
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64'
    })
    setImage("data:image/png;base64," + base64)
    fetch('https://snapchat.epidoc.eu/snap', {
      method: 'POST',
      body: JSON.stringify({ to, image: "data:image/png;base64," + base64, duration }),
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVuem8uZmFsbGFAZXBpdGVjaC5ldSIsImlhdCI6MTcxNzc2MjYyM30.JHzgZz6DsIdb-zqL95IfoZYHhw0BKx_qPUBpAsBKrk0', 'Authorization': 'Bearer ' + logged } //remplacez la valeur de x-api-key par votre token api
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      alert("Snap successfully sent")
      setImage('');
      setFriend([]);
    })
    .catch(error => console.error(error));
  }

  const friends = () => {
    fetch('https://snapchat.epidoc.eu/user/friends', {
      method: 'GET',
      headers: { 'Content-Type': 'applicatiob/json', 'X-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVuem8uZmFsbGFAZXBpdGVjaC5ldSIsImlhdCI6MTcxNzc2MjYyM30.JHzgZz6DsIdb-zqL95IfoZYHhw0BKx_qPUBpAsBKrk0', 'Authorization': 'Bearer ' + logged } //remplacez la valeur de x-api-key par votre token api
    })
    .then(response => response.json())
    .then(data => {
      setFriend(data.data);
    })
  }

  const selectFriend = (id) => {
    setTo('');
    setTo(id);
  }

  const timer = () => {
    const choosenTime = setDuration((current) => (current === 1 ? 5 : current === 5 ? 10 : 1))
  }

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.imageContainer}>
          {friend.length >= 1 ? (<View>
            <IconButton icon="undo" onPress={resetFriends} size={50}></IconButton>
            <FlatList data={friend} renderItem={({ item }) => (
              <View style={styles.friendsContainer}>
                <Button title={item.username} onPress={() => selectFriend(item._id)}/>
              </View>
            )}/>
            <IconButton icon="send" onPress={sendPicture} size={50}></IconButton>
          </View>) : (<>
              <Image source={{ uri: image }} style={styles.image}/>
              <View style={styles.sendContainer}>
                <IconButton icon="undo" onPress={resetPicture} size={50}/>
                <IconButton icon="message" onPress={friends} size={50}/>
                {duration === 1 ? (
                  <View>
                    <IconButton icon="timer" onPress={timer} size={50}/>
                  </View>
                ) : duration === 5 ?(
                  <View>
                    <IconButton icon="numeric-5" onPress={timer} size={50}/>
                    <Text>5s</Text>
                  </View>
                ) : (
                  <View>
                    <IconButton icon="timer-10" onPress={timer} size={50}/>
                  </View>
                )}
              </View>
              </>)}
        </View>
      ) : (
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <IconButton icon="camera" size={60} iconColor="white" onPress={camera} />
            <IconButton icon="image" size={60} onPress={gallery} iconColor="white" />
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    top: 500,
    justifyContent: 'space-evenly'
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  sendContainer: {
    flex: 1,
    flexDirection: 'row',
    bottom: 60
  },
  friendsContainer: {
    alignItems: 'center',
    margin: 8
  }
});