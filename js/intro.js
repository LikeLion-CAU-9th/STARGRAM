function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

const writeDate = (len) => {
  const imgFile = document.querySelectorAll(".uploadImg");
  for (let i = 0; i < len; i++) {
    let img64 = getBase64Image(imgFile[i]);
    let imgObj = { photo_name: imgFile[i].title, base64: img64 };
    writeIndexedDB(imgObj);
  }
  const getMetaData = document.getElementById("metadata").innerHTML;
  localStorage.removeItem("getMetaData");
  localStorage.setItem("getMetaData", getMetaData);
};

const afterWriting = () => {
  let needToPing = 0;
  const photoList = JSON.parse(localStorage.getItem("getMetaData"));
  for (let i = 0; i < photoList.length; i++) {
    if (photoList[i]["latitude"] === "NO_WHERE") {
      needToPing += 1;
    }
  }
  if (needToPing === 0) {
    const btn = document.querySelector(".start-btn button");
    btn.innerHTML = "별자리 그리기";
    btn.style.backgroundColor = "#d0e78b";
    btn.addEventListener("click", (e) => {
      location.href = "./template/mapUpload.html";
    });
  } else {
    const introText = document.querySelector(".intro-text p");
    introText.innerHTML =
      `위치정보를 불러올 수 없는 사진이 ${needToPing}장 있어요.<br>` +
      "사진을 촬영한 장소를 직접 지정해주세요!";
    introText.style.color = "#d75a5a";
    const btn = document.querySelector(".start-btn button");
    btn.innerHTML = "위치 설정하기";
    btn.style.backgroundColor = "#d75a5a";
    btn.addEventListener("click", (e) => {
      location.href = "./template/pinned.html";
    });
  }
};

const uploadImgPreview = () => {
  // 업로드 파일 읽기
  const fileInfo = document.querySelector("#uploadImg").files;

  let metaData = [];
  let reader = [];

  for (let i = 0; i < fileInfo.length; i++) {
    reader.push(new FileReader());
  }

  for (let i = 0; i < fileInfo.length; i++) {
    let img = document.createElement("img");
    img.title = fileInfo[i].name;
    img.className = "uploadImg";
    if (i === fileInfo.length - 1) {
      reader[i].onload = function (e) {
        for (let i = 0; i < fileInfo.length; i++) {
          EXIF.getData(fileInfo[i], () => {
            const tags = EXIF.getAllTags(fileInfo[i]);
            console.log(tags);
            metaData.push(tags);
          });
        }
        img.src = e.target.result;
      };
    } else {
      reader[i].onload = function (e) {
        img.src = e.target.result;
      };
    }
    document.querySelector("body").appendChild(img);
  }

  for (let i = 0; i < fileInfo.length; i++) {
    if (fileInfo[i]) {
      reader[i].readAsDataURL(fileInfo[i]);
    }
  }

  // 메타데이터에서 위도, 경도, 시간만 뽑아서 히든태그에 넣어둠
  setTimeout(() => {
    const getMetaData = [];
    for (let i = 0; i < metaData.length; i++) {
      const exifLat = metaData[i]["GPSLatitude"];
      const exifLong = metaData[i]["GPSLongitude"];
      const exifLatRef = metaData[i]["GPSLatitudeRef"];
      const exifLongRef = metaData[i]["GPSLongitudeRef"];
      const dateTime = metaData[i]["DateTime"];

      if (exifLat == undefined) {
        getMetaData.push({
          latitude: "NO_WHERE",
          longitude: "NO_WHERE",
          dateTime: dateTime,
        });
      } else {
        if (exifLatRef == "S") {
          var latitude =
            exifLat[0] * -1 + (exifLat[1] * -60 + exifLat[2] * -1) / 3600;
        } else {
          var latitude = exifLat[0] + (exifLat[1] * 60 + exifLat[2]) / 3600;
        }

        if (exifLongRef == "W") {
          var longitude =
            exifLong[0] * -1 + (exifLong[1] * -60 + exifLong[2] * -1) / 3600;
        } else {
          var longitude = exifLong[0] + (exifLong[1] * 60 + exifLong[2]) / 3600;
        }

        const wtmX = latitude;
        const wtmY = longitude;
        getMetaData.push({
          latitude: wtmX,
          longitude: wtmY,
          dateTime: dateTime,
        });
      }
    }

    const getMetaDataJson = JSON.stringify(getMetaData);
    document.getElementById("metadata").innerHTML = getMetaDataJson;
    writeDate(fileInfo.length);
    afterWriting();
  }, 100);
};
