/**
 * useLocation — custom hook for requesting and watching the device's GPS location.
 */
import {useState, useEffect} from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let watchId = null;

    async function requestAndFetch() {
      try {
        const granted = await requestPermission();
        if (!granted) {
          setError('Location permission denied.');
          setLoading(false);
          return;
        }

        watchId = Geolocation.watchPosition(
          position => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLoading(false);
            setError(null);
          },
          err => {
            setError(err.message);
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 500, // metres
            interval: 60000,     // ms
            fastestInterval: 30000,
          },
        );
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    requestAndFetch();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return {location, error, loading};
}

async function requestPermission() {
  if (Platform.OS === 'ios') {
    const result = await Geolocation.requestAuthorization('whenInUse');
    return result === 'granted';
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Noor Location Permission',
      message: 'Noor needs access to your location to show accurate prayer times.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}
