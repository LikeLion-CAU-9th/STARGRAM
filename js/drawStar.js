const drawStar = (lst) => {
  const cvs = document.querySelector("#space_cvs");
  let ctx = cvs.getContext("2d");
  cvs.style.width =
    document.querySelector(".rendering-container").offsetWidth - 100 + "px";
  cvs.style.height = "400px";
  cvs.style.margin = "30px 10%";
  let coor = [];
  coor = toCoordinates(lst);
  console.log(`coor: ${coor[0].longitude}`);
  console.log(coor);
  ctx.beginPath();
  ctx.lineWidth = 8;
  for (let i = 0; i < coor.length - 1; i++) {
    ctx.moveTo(coor[i].longitude, coor[i].latitude);
    ctx.lineTo(coor[i + 1].longitude, coor[i + 1].latitude);
  }

  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
};

const getCenter = (lst) => {
  let latitude = 0;
  let longitude = 0;
  lst.forEach((o) => (latitude += o.latitude));
  lst.forEach((o) => (longitude += o.longitude));
  let lat = latitude / lst.length;
  let long = longitude / lst.length;
  return [lat, long];
};

const toCoordinates = (lst) => {
  let widthPX = document.querySelector("#space_cvs").style.width;
  let heightPX = document.querySelector("#space_cvs").style.height;
  const WIDTH = parseInt(widthPX.substring(0, widthPX.length - 2));
  // const WIDTH = 384;
  const HEIGHT = parseInt(heightPX.substring(0, heightPX.length - 2));
  const center = getCenter(lst);
  console.log(`WIDTH: ${WIDTH}`);
  console.log(`HEIGHT: ${HEIGHT}`);
  console.log(`center: ${center[0]} and ${center[1]}`);
  lst.forEach((o) => {
    o.longitude = (o.longitude * WIDTH) / (2 * center[1]);
    o.latitude = (o.latitude * HEIGHT) / (2 * center[0]);
  });
  return lst;
};

let lst = [
  { latitude: 33.34359, longitude: 126.17369 },
  { latitude: 33.27181, longitude: 126.70084 },
  { latitude: 33.38166, longitude: 126.78678 },
  { latitude: 33.32622, longitude: 126.83839 },
  { latitude: 33.30608, longitude: 126.79433 },
];
lst.forEach((o) => {
  o.latitude -= 33;
  o.longitude -= 126;
  o.latitude *= 100;
  o.longitude *= 100;
});

drawStar(lst);
