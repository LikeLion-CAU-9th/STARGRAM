let deviceWidth = window.innerWidth;
if (deviceWidth>480){
    deviceWidth = 480;
} 
WIDTH = (deviceWidth * 0.8) - 40;
HEIGHT = WIDTH;
CLUSTER_RATE= 2.5;

const drawStar = (points) =>{
    var paper = Raphael(document.getElementById("container"),WIDTH,HEIGHT);
    //x축 y축에서 50px 떨어진 곳에 가로 세로 1000px인 영역
    
    var path = [];
    var myCircle=[];
    for(var i = 0; i < points.length; i ++) {
        // 길만들기
        path.push(i == 0 ? 'M' : 'L');
        path.push(points[i][0]);
        path.push(points[i][1]);

        // 별 만들기
        myCircle[i] = paper.circle(points[i][0],points[i][1],Math.floor(Math.random()*3)+1).attr('stroke','#FFF');
        myCircle[i].glow().attr('stroke','#FFF');
        myCircle[i].attr({fill:"white"});
    }

    paper.path(path.join(','))
        .attr({
        "stroke" : "white",
        'stroke-width': 0.7,
        // 'stroke-linejoin': 'round'
    });

    if(points.length>3){
        const subPath = `M,${points[1][0]},${points[1][1]},L,${points[3][0]},${points[3][1]}`    
        paper.path(subPath)
            .attr({
            "stroke" : "white",
            'stroke-width': 0.7,
            // 'stroke-linejoin': 'round'
        }); 
    }


};

function changeX(x, minLon, maxLon) {
    let rate = (x - minLon) / (maxLon - minLon); 
    return WIDTH * rate;  
}

function changeY(y, minLat, maxLat) {
    let rate = (y - minLat) / (maxLat - minLat); 
    return HEIGHT * rate;  
}

// function changeY(y, minLat, minLon, maxLon) {
//     let rate = (y - minLat) / (maxLon - minLon); 
//     return HEIGHT * rate;  
// }


const changeToXY = (getMetaData) => {
    const metaData = localStorage.getItem(getMetaData);
    const metaDataJson = JSON.parse(metaData);

    const points = []
    const minMaxInfo={"minLon":metaDataJson[0]["longitude"], "maxLon":metaDataJson[0]["longitude"], "minLat":metaDataJson[0]["latitude"], "maxLat":metaDataJson[0]["latitude"]}
    console.log(minMaxInfo)
    for(let i=0; i<metaDataJson.length; i++){
        const lon = metaDataJson[i]["longitude"]
        const lat = metaDataJson[i]["latitude"]

        if(lon < minMaxInfo.minLon){
            minMaxInfo.minLon = lon
        } else if(lon > minMaxInfo.maxLon){
            minMaxInfo.maxLon = lon
        }
        if(lat < minMaxInfo.minLat){
            minMaxInfo.minLat = lat
        } else if(lat > minMaxInfo.maxLat){
            minMaxInfo.maxLat = lat
        }

        
    };

    localStorage.setItem("minMaxInfo", minMaxInfo)
    console.log(minMaxInfo)

    for(let i=0; i<metaDataJson.length; i++){
        let X = changeX(metaDataJson[i]["longitude"], minMaxInfo.minLon, minMaxInfo.maxLon)
        if(X == 0){
            X +=10;
        }
        else if(X == WIDTH){
            X -=10;
        };
        let Y = changeY(metaDataJson[i]["latitude"], minMaxInfo.minLat, minMaxInfo.maxLat)
        if(Y == 0){
            Y +=10;
        }
        else if(Y == HEIGHT){
            Y -=10;
        };
        
        points.push([X,HEIGHT-Y])
    };

    

    return points;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

window.onload = () =>{
    let points;
    if(localStorage.getItem("isCluster") == 1){
        points = changeToXY("clusterMetaData")
    }
    else{
        points = changeToXY("getMetaData")
    }
    
    points.sort(function(){
        return Math.random() - Math.random();
    });

    drawStar(points)

    const maxLen = titleExample.length;
    let i = getRandomInt(0, maxLen - 1);
    document.querySelector(".star-upload-title").placeholder = titleExample[i];
}



const getCentroid = (points) => {
    sumX = 0;
    sumY = 0;
    for(let i=0; i<points.length; i++){
        sumX += points[i][0];
        sumY += points[i][1];        
    };

    return [sumX/points.length, sumY/points.length];
}

const getDistance = (points) => {
    let centroid = getCentroid(points);
    
    let pointsDis=[];
    for(let i=0; i<points.length; i++){
        const distance =  Math.sqrt( (centroid[0]-points[i][0])**2 + (centroid[1]-points[i][1])**2 );
        pointsDis.push(distance)
    };
    return pointsDis;
}

const clustering = (points) => { 
    
    let farIndex = [];

    let pointsDis = getDistance(points);
    let startLen = points.length;
    let endLen = 0; 
    while( startLen != endLen ){
        startLen = points.length;

        //pointsDis 에서 최대 최소 찾기
        pointsDis = getDistance(points);
        let disMin = pointsDis[0];
        let disMax = pointsDis[0];
        for(let i=0; i<pointsDis.length; i++){
            if(pointsDis[i] > disMax){
                disMax = pointsDis[i];
            }
            else if(pointsDis[i] < disMin){
                disMin = pointsDis[i]
            }
        }
    
        //튀는 값 points에서 제거, index 푸시
        if(disMax/disMin > CLUSTER_RATE){
            let maxIndex = pointsDis.indexOf(disMax)
            farIndex.push(maxIndex)
            points.splice(maxIndex, 1)
        }

        endLen = points.length;

    }
    
    return farIndex;


}



// 나머지 데이터 저장하고 히든태그에 정보 넣어서 보여주기
const writeData = () => {
    
    const title = document.getElementById("title");
    const dateStart = document.getElementById("date_start");
    const dateEnd = document.getElementById("date_end");
    const place = document.getElementById("place");
    const impression = document.getElementById("impression");

    let records = {"title": title.value, "dateStart":dateStart.value, "dateEnd":dateEnd.value, "place": place.value, "impression":impression.value} 
    localStorage.setItem("records", records)
    
    document.getElementById("title_real").innerHTML = title.value;
    document.getElementById("date_start_real").innerHTML = dateStart.value;
    document.getElementById("date_end_real").innerHTML = dateEnd.value;
    document.getElementById("place_real").innerHTML = place.value;
    document.getElementById("impression_real").innerHTML = `<span>"  </span>${impression.value}<span>  "</span>`;

    const recordsDiv = document.getElementById("records")
    recordsDiv.style.display = "none";

    const hiddenRecordsDiv = document.getElementById("hidden_records")
    hiddenRecordsDiv.style.display = "block";
    

}