const beforeCluster = () => {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    

    let metaData = localStorage.getItem("getMetaData");
    let metaDataJson = JSON.parse(metaData);


    //메타 데이터 먼저 포인트로 바꾸기
    let metaPoints = changeToXY("getMetaData")
    //튀는 값 인덱스 찾기
    let farIndex = clustering(metaPoints)
    console.log(farIndex)

    //튀는 값 제거
    for(let i=0; i<farIndex.length; i++){
        metaDataJson.splice(farIndex[i], 1);
    };


    localStorage.setItem("clusterMetaData", JSON.stringify(metaDataJson));

    console.log("clusted")
    console.log(metaDataJson)

    
    //튀는 값 없는 일반적인 경우
    if(farIndex.length==0){
        console.log("들어왔니?")
        location.href = "./mapUpload.html"
    }

    metaData = localStorage.getItem("getMetaData");
    metaDataJson = JSON.parse(metaData);

    var points = [];
    for(let i=0; i<metaDataJson.length; i++){  
        point = new kakao.maps.LatLng(metaDataJson[i]["latitude"], metaDataJson[i]["longitude"])
        points.push(point)
    };

    // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
    var bounds = new kakao.maps.LatLngBounds();    

    var i, marker;
    for (i = 0; i < points.length; i++) {
        // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
        marker =     new kakao.maps.Marker({ position : points[i] });
        marker.setMap(map);
        
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(points[i]);
    }

    map.setBounds(bounds);

};

window.onload = () =>{
    beforeCluster();
};