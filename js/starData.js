
WIDTH = 250;
HEIGHT = 250;
CLUSTER_RATE= 10;

const drawStar = (points) =>{
    var paper = Raphael(document.getElementById("container"),WIDTH,HEIGHT);
    //x축 y축에서 50px 떨어진 곳에 가로 세로 1000px인 영역
    
    const path = [];
    for(var i = 0; i < points.length; i ++) {
        path.push(i == 0 ? 'M' : 'L');
        path.push(points[i][0]);
        path.push(points[i][1]);
    }

    const subPath = `M,${points[1][0]},${points[1][1]},L,${points[3][0]},${points[3][1]}`

    
    paper.path(path.join(','))
        .attr({
        "stroke" : "white",
        'stroke-width': 1,
        // 'stroke-linejoin': 'round'
    });

    paper.path(subPath)
        .attr({
        "stroke" : "white",
        'stroke-width': 1,
        // 'stroke-linejoin': 'round'
    });    

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


const changeToXY = () => {
    const metaData = localStorage.getItem("getMetaData");
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
        const X = changeX(metaDataJson[i]["longitude"], minMaxInfo.minLon, minMaxInfo.maxLon)
        const Y = changeY(metaDataJson[i]["latitude"], minMaxInfo.minLat, minMaxInfo.maxLat)
        
        points.push([X,HEIGHT-Y])
    };

    points.sort(function(){
        return Math.random() - Math.random();
    });

    return points;
}

window.onload = () =>{
    const metaData = localStorage.getItem("getMetaData");
    // const dateStart = localStorage.getItem("dateStart");
    
    const points = changeToXY()

    drawStar(points)
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
        const distance =  Math.sqrt( (centroid[0]-points[i][0])^2 + (centroid[1]-points[i][1])^2 );
        pointsDis.push(distance)
    };
    return pointsDis;
}

const clustering = (points, centroid) => {
    let clusterPoints=[];
    
    
    
    

    let startLen = pointsDis.length;
    let endLen = 0; 
    while( startLen != endLen){

    }
    // 해당 points들의 무게중심까지 거리 최대 최소
    let pointsDis = getDistance(points);
    
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

    if(disMax/disMin > CLUSTER_RATE){
        let maxIndex = pointsDis.indexOf(disMax)
        pointsDis.splice(maxIndex, 1)
    }
    


}