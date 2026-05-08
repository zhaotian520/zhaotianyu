import { useState, useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface PermissionState {
  camera: boolean | null;
  mediaLibrary: boolean | null;
  audio: boolean | null;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: null,
    mediaLibrary: null,
    audio: null,
  });

  const requestMediaLibrary = useCallback(async (): Promise<boolean> => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const granted = result.granted;
    setPermissions((p) => ({ ...p, mediaLibrary: granted }));

    if (!granted) {
      Alert.alert(
        '需要权限',
        '请在系统设置中允许访问相册，以选择视频和封面图',
        [
          { text: '取消', style: 'cancel' },
          { text: '去设置', onPress: () => Linking.openSettings() },
        ]
      );
    }

    return granted;
  }, []);

  const requestCamera = useCallback(async (): Promise<boolean> => {
    const result = await ImagePicker.requestCameraPermissionsAsync();
    const granted = result.granted;
    setPermissions((p) => ({ ...p, camera: granted }));

    if (!granted) {
      Alert.alert(
        '需要权限',
        '请在系统设置中允许使用相机，以拍摄视频',
        [
          { text: '取消', style: 'cancel' },
          { text: '去设置', onPress: () => Linking.openSettings() },
        ]
      );
    }

    return granted;
  }, []);

  const requestAudio = useCallback(async (): Promise<boolean> => {
    // Android handles audio permissions via native module
    if (Platform.OS === 'android') {
      return true;
    }
    return true;
  }, []);

  return {
    permissions,
    requestMediaLibrary,
    requestCamera,
    requestAudio,
  };
}
