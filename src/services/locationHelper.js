import { serverDateTimeFormat } from '@/config/moments';
import { get, assign } from 'lodash';
import { isNative, checkIn } from './native';
import Location from '../models/Location';

export default function getLocation(desiredAccuracy, requiredAccuracy, ownerXid, target, timeout) {

  const initData = {
    ownerXid,
    target,
  };

  if (isNative()) {

    return checkIn(desiredAccuracy, requiredAccuracy, initData, timeout)
      .then(location => Location.create(assign(location, initData)))
      .catch(m => {

        throw Error(m);

      });

  }

  return browserGetLocation(desiredAccuracy, requiredAccuracy, timeout)
    .then(location => Location.create(assign(location, initData)));

}

function browserGetLocation(desiredAccuracy, requiredAccuracy, timeout) {

  const geo = window.navigator.geolocation;
  const time = timeout || 30000;

  return new Promise((resolve, reject) => {

    const geoOptions = {
      enableHighAccuracy: true,
      maximumAge: timeout,
      timeout: time,
    };

    const watchID = geo.watchPosition(successWatch, failWatch, geoOptions);

    let savedCords;

    const timeoutId = setTimeout(() => {

      geo.clearWatch(watchID);

      if (savedCords) {

        const res = {
          horizontalAccuracy: savedCords.accuracy,
          latitude: savedCords.latitude,
          longitude: savedCords.longitude,
          timestamp: serverDateTimeFormat(Date()),
        };

        resolve(res);

      } else {

        reject('Время ожидания геометки истекло');

      }

    }, time);

    function successWatch(location) {
      if (get(location, 'coords.accuracy') <= desiredAccuracy) {
        clearTimeout(timeoutId);
        geo.clearWatch(watchID);
        const coords = location.coords;
        const res = {
          horizontalAccuracy: coords.accuracy,
          latitude: coords.latitude,
          longitude: coords.longitude,
          timestamp: serverDateTimeFormat(Date()),
        };

        resolve(res);
      } else if (get(location, 'coords.accuracy') <= requiredAccuracy &&
        (!savedCords || savedCords.accuracy > get(location, 'coords.accuracy'))) {

        savedCords = location;

      }
    }

    function failWatch(err) {

      clearTimeout(timeoutId);

      geo.clearWatch(watchID);

      if (savedCords) {

        const res = {
          horizontalAccuracy: savedCords.accuracy,
          latitude: savedCords.latitude,
          longitude: savedCords.longitude,
          timestamp: serverDateTimeFormat(Date()),
        };

        resolve(res);

      } else {

        reject(err);

      }

    }

  });

}
