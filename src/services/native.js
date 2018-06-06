/* eslint-disable no-unused-vars */
function isNative() {

  return !!window.webkit || !!window.stmAndroid;

}

function checkIn(accuracy, data, timeout) {
}

export { isNative, checkIn };
