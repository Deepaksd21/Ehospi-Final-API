const hospital = require("../models/hospital");
exports.distanceCalculator = async (req, res) => {
  try {
    let myLocation = req.body.myLocation;
    let array = await hospital.find();
    let distance = req.body.distance;
    let all = [];
    for (i = 0; i < array.length; i++) {
      if (
        myLocation.latitude == array[i].latitude &&
        myLocation.longitude == array[i].longitude
      ) {
        all.push(arr[i]);
      } else {
        let radlat1 = (Math.PI * myLocation.latitude) / 180;
        let radlat2 = (Math.PI * array[i].latitude) / 180;
        let theta = myLocation.longitude - array[i].longitude;
        let radtheta = (Math.PI * theta) / 180;
        let dist =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515 * 1.609344;
        if (dist <= distance) all.push(array[i]);
      }
    }
    res.send(all);
  } catch (e) {
    res.send(e.name);
  }
};
