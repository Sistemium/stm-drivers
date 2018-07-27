import { serverDateTimeFormat } from '@/config/moments';
import get from 'lodash/get';
import assign from 'lodash/assign';
import { isNative, checkIn } from './native';
import Location from '../models/Location';

export default function getLocation(desiredAccuracy, requiredAccuracy, ownerXid, target, timeout) {

  const initData = {
    ownerXid,
    target,
  };

  if (isNative()) {

    return checkIn(desiredAccuracy, requiredAccuracy, initData, timeout)
      .then(location => Location.create(assign(location, initData)));

  }

  return browserGetLocation(desiredAccuracy, requiredAccuracy, timeout)
    .then(location => Location.create(assign(location, initData)));

}

function browserGetLocation(desiredAccuracy, requiredAccuracy, timeout = 3000) {

  const geo = window.navigator.geolocation;

  return new Promise((resolve, reject) => {

    const geoOptions = {
      enableHighAccuracy: true,
      maximumAge: timeout,
      timeout,
    };

    const timeoutId = setTimeout(timeoutHandler, timeout);
    const watchID = geo.watchPosition(successWatch, failWatch, geoOptions);

    let savedCords;

    /*
    Functions
     */

    function timeoutHandler() {

      if (savedCords) {
        resolveCoords(savedCords);
      } else {
        rejectError('Время ожидания геометки истекло');
      }

    }

    function successWatch(location) {

      const accuracy = get(location, 'coords.accuracy');

      const gotDesiredAccuracy = accuracy <= desiredAccuracy;
      const meetRequirements = accuracy <= requiredAccuracy;
      const gotBetterAccuracyThanSaved = !savedCords || savedCords.accuracy > accuracy;

      if (gotDesiredAccuracy) {
        resolveCoords(location.coords);
      } else if (meetRequirements && gotBetterAccuracyThanSaved) {
        savedCords = location;
      }

    }

    function failWatch(err) {

      if (!savedCords) {
        rejectError(err);
      } else {
        resolveCoords(savedCords);
      }

    }

    function cleanUp() {
      clearTimeout(timeoutId);
      geo.clearWatch(watchID);
    }

    function resolveCoords(coords) {

      cleanUp();

      const {
        accuracy: horizontalAccuracy,
        latitude,
        longitude,
      } = coords;

      const timestamp = serverDateTimeFormat();

      resolve({
        horizontalAccuracy,
        latitude,
        longitude,
        timestamp,
      });

    }

    function rejectError(err) {
      cleanUp();
      reject(err);
    }

  });

}
