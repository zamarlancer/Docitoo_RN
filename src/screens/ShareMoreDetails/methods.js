import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Screens} from '@/constants/Navigation';
import ImagePicker from 'react-native-image-picker';
import __ from '@/assets/lang';
import {Platform, PermissionsAndroid} from 'react-native';

function useViewModel(props) {
  const nav = useNavigation();

  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [avatarSource, setAvatarSource] = useState('');

  const onPressSubmit = () => {
    nav.navigate(Screens.doctors)
  };

  const onPressChoose = async () => {
    const tag = 'ShareMoreDetails::onPressChoose()';

    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);

        const cameraGrant = grants[PermissionsAndroid.PERMISSIONS.CAMERA];
        if (cameraGrant === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(tag, 'You can use camera')
        } else {
          console.log(tag, 'Camera permission denied')
        }

        const storageGrant = grants[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        if (storageGrant === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use store photos and videos')
        } else {
          console.log('Storage permission denied')
        }

      } catch (e) {
        console.log(tag, 'error', e.message)
      }
    }
    const options = {
      title: __('select_photo'),
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log(tag, 'User cancelled image picker');
      } else if (response.error) {
        console.log(tag, 'ImagePicker error: ', response.error);
      } else if (response.customButton) {
        console.log(tag, 'User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log(tag, 'User selected a photo: ', response.uri);

        // You can also display the image using data:
        // const source = {uri: 'data:image/jpeg:base64,' + response.data};

        setAvatarSource(source);
      }
    })
  };

  return {
    gender, setGender,
    bloodType, setBloodType,
    avatarSource, setAvatarSource,
    onPressSubmit,
    onPressChoose,
  }
}

export default useViewModel;
