import { Platform } from 'react-native';

// En emulador Android se usa 10.0.2.2, en iOS simulator localhost, o la IP local de tu máquina en red Wi-Fi
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:4000/api',
  ios: 'http://localhost:4000/api',
  default: 'http://localhost:4000/api',
});
