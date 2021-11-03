const writeDate = () => {
  const getMetaData = document.getElementById("metadata").innerHTML;
  localStorage.setItem("getMetaData", getMetaData);
};

const afterWriting = () => {
  const btn = document.querySelector(".start-btn button");
  btn.innerHTML = "별자리 그리기";
  btn.style.backgroundColor = "#d0e78b";
  btn.addEventListener("click", (e) => {
    location.href = "#";
  });
};

const uploadImgPreview = () => {
  // 업로드 파일 읽기
  const fileInfo = document.querySelector("#uploadImg").files;

  let metaData = [];
  let reader = [];

  for (let i = 0; i < fileInfo.length; i++) {
    reader.push(new FileReader());
  }

  // readAsDataURL( )을 통해 파일을 읽어 들일때 onload가 실행
  reader[fileInfo.length - 1].onload = function () {
    for (let i = 0; i < fileInfo.length; i++) {
      EXIF.getData(fileInfo[i], () => {
        const tags = EXIF.getAllTags(fileInfo[i]);
        console.log(tags);
        metaData.push(tags);
      });
    }
  };

  for (let i = 0; i < fileInfo.length; i++) {
    if (fileInfo[i]) {
      // readAsDataURL( )을 통해 파일의 URL을 읽어온다.
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
    writeDate();
    afterWriting();
  }, 100);
};
