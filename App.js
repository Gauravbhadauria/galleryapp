import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const App = () => {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    hasPermission();
  }, []);
  const hasPermission = async () => {
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };
  const getAllPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(r => {
        console.log(JSON.stringify(r.edges));
        setPhotos(r.edges);
      })
      .catch(err => {
        //Error Loading Images
      });
  };
  return (
    <View style={{flex: 1}}>
      <View style={{width: '100%', alignItems: 'center'}}>
        <FlatList
          data={photos}
          numColumns={2}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: Dimensions.get('window').width / 2 - 20,
                  height: 200,
                  borderRadius: 10,
                  backgroundColor: '#F7BBBB',
                  margin: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: item.node.image.uri}}
                  style={{width: '95%', height: '95%'}}
                />
              </View>
            );
          }}
        />
      </View>
      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          backgroundColor: '#4054EB',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 20,
        }}
        onPress={() => {
          getAllPhotos();
        }}>
        <Text style={{color: '#fff'}}>Sync Photos From Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
