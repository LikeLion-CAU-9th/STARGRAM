const pinned_main = () => {
  if (!needToPin()) {
    location.href = "./beforeCluster.html";
  }
  const meta = JSON.parse(localStorage.getItem("getMetaData"));
  let fileName = "";
  for (let i = 0; i < meta.length; i++) {
    const img = meta[i];
    if (img["latitude"] === "NO_WHERE" || img["longitude"] === "NO_WHERE") {
      fileName = img["fileName"];
      break;
    }
  }

  const imgTag = document.querySelector("#targetImg");
  imgTag.style.display = "inline-block";
  //   imgTag.src =
  let mapCenter = center();
  console.log(mapCenter);
  var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(
        mapCenter["latitude"],
        mapCenter["longitude"]
      ), // 지도의 중심좌표
      level: 4, // 지도의 확대 레벨
    };

  var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

  // 지도를 클릭한 위치에 표출할 마커입니다
  var marker = new kakao.maps.Marker({
    // 지도 중심좌표에 마커를 생성합니다
    position: map.getCenter(),
  });
  // 지도에 마커를 표시합니다
  marker.setMap(map);

  // 지도에 클릭 이벤트를 등록합니다
  // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
  kakao.maps.event.addListener(map, "click", function (mouseEvent) {
    // 클릭한 위도, 경도 정보를 가져옵니다
    var latlng = mouseEvent.latLng;

    // 마커 위치를 클릭한 위치로 옮깁니다
    marker.setPosition(latlng);

    var message = "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, ";
    message += "경도는 " + latlng.getLng() + " 입니다";

    var resultDiv = document.getElementById("clickLatlng");
    resultDiv.innerHTML = message;
  });
};

const needToPin = () => {
  const meta = JSON.parse(localStorage.getItem("getMetaData"));
  for (let i = 0; i < meta.length; i++) {
    if (
      meta[i]["latitude"] === "NO_WHERE" ||
      meta[i]["longitude"] === "NO_WHERE"
    ) {
      return true;
    }
  }
  return false;
};

const center = () => {
  let latitudeSum = 0;
  let longitudeSum = 0;

  const metaData = localStorage.getItem("getMetaData");
  const metaDataJson = JSON.parse(metaData);
  let positioned = 0;

  for (let i = 0; i < metaDataJson.length; i++) {
    if (metaDataJson[i]["latitude"] != "NO_WHERE") {
      latitudeSum += metaDataJson[i]["latitude"];
      longitudeSum += metaDataJson[i]["longitude"];
      positioned += 1;
    }
  }

  return {
    latitude: latitudeSum / positioned,
    longitude: longitudeSum / positioned,
  };
};
