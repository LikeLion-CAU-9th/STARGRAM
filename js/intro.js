function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

const metaPush = (metaData, fileInfo) => {
  for (let i = 0; i < fileInfo.length; i++) {
    EXIF.getData(fileInfo[i], () => {
      let tags = EXIF.getAllTags(fileInfo[i]);
      tags["fileName"] = fileInfo[i].name;
      console.log(tags);
      metaData.push(tags);
    });
  }
};

const uploadImgPreview = () => {
  return new Promise((resolve) => {
    console.log("Upload Img Preview");
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
          img.src = e.target.result;
          metaPush(metaData, fileInfo);
        };
        console.log(
          `uploadImgPreview resolve and meta lengh: ${metaData.length}`
        );
        const resInterv = setInterval(() => {
          if (metaData.length === fileInfo.length) {
            clearInterval(resInterv);
            resolve(metaData);
          }
        }, 100);
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
  });
};

// Timeout 1000
const dataProcess = (metaData) => {
  return new Promise((resolve, reject) => {
    console.log(`DataProcess: ${metaData}`);

    const getMetaData = [];
    for (let i = 0; i < metaData.length; i++) {
      const exifLat = metaData[i]["GPSLatitude"];
      const exifLong = metaData[i]["GPSLongitude"];
      const exifLatRef = metaData[i]["GPSLatitudeRef"];
      const exifLongRef = metaData[i]["GPSLongitudeRef"];
      const dateTime = metaData[i]["DateTime"];
      const fileName = metaData[i]["fileName"];

      if (exifLat == undefined) {
        getMetaData.push({
          fileName: fileName,
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
          fileName: fileName,
          latitude: wtmX,
          longitude: wtmY,
          dateTime: dateTime,
        });
      }
    }

    const getMetaDataJson = JSON.stringify(getMetaData);
    document.getElementById("metadata").innerHTML = getMetaDataJson;

    resolve(getMetaData.length);
  });
};

// Timeout 10000

const saveData = (leng) => {
  return new Promise((resolve, reject) => {
    console.log(`saveData: ${leng}`);
    initIndexedDB();
    const imgFile = document.querySelectorAll(".uploadImg");
    let writtenData = 0;
    for (let i = 0; i < leng; i++) {
      let img64 = getBase64Image(imgFile[i]);
      let imgObj = { photo_name: imgFile[i].title, base64: img64 };
      writeIndexedDB(imgObj).then(() => {
        writtenData += 1;
      });
    }
    const getMetaData = document.getElementById("metadata").innerHTML;
    localStorage.removeItem("getMetaData");
    localStorage.setItem("getMetaData", getMetaData);
    let interv = setInterval(() => {
      if (writtenData === leng) {
        clearInterval(interv);
        resolve();
      }
    }, 100);
  });
};

// Timeout 100000

const afterWriting = () => {
  return new Promise((resolve, reject) => {
    console.log(`afterWriting`);
    let needToPin = 0;
    const photoList = JSON.parse(localStorage.getItem("getMetaData"));
    // const clusterList = JSON.parse(localStorage.getItem("clusterMetaData"));

    for (let i = 0; i < photoList.length; i++) {
      if (photoList[i]["latitude"] === "NO_WHERE") {
        needToPin += 1;
      }
    }

    if (needToPin === 0) {
      const btn = document.querySelector(".start-btn button");
      btn.innerHTML = "별자리 그리기";
      btn.style.backgroundColor = "#d0e78b";

      btn.addEventListener("click", (e) => {
        location.href = "./template/beforeCluster.html";
      });

      //걸러낼 데이터 있을때 없을때 구분
      // if(photoList.length == clusterList.length){
      //   btn.addEventListener("click", (e) => {
      //     location.href = "./template/mapUpload.html";
      //   });
      // }
      // else{
      //   btn.addEventListener("click", (e) => {
      //     location.href = "./template/beforeCluster.html";
      //   });
      // }
      //
    } else {
      const introText = document.querySelector(".intro-text p");
      introText.innerHTML =
        `위치정보를 불러올 수 없는 사진이 ${needToPin}장 있어요.<br>` +
        "사진을 촬영한 장소를 직접 지정해주세요!";
      introText.style.color = "#d75a5a";
      const btn = document.querySelector(".start-btn button");
      btn.innerHTML = "위치 설정하기";
      btn.style.backgroundColor = "#d75a5a";
      btn.addEventListener("click", (e) => {
        location.href = "./template/pinned.html";
      });
    }
    resolve();
  });
};

const introAsyncFlow = async () => {
  let metaData = await uploadImgPreview();
  let metaLength = await dataProcess(metaData);
  await saveData(metaLength);
  await afterWriting();
};
