
WIDTH = 250;
HEIGHT = 250;

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

    console.log(minMaxInfo)

    for(let i=0; i<metaDataJson.length; i++){
        const X = changeX(metaDataJson[i]["longitude"], minMaxInfo.minLon, minMaxInfo.maxLon)
        const Y = changeY(metaDataJson[i]["latitude"], minMaxInfo.minLat, minMaxInfo.maxLat)
        
        points.push([X,Y])
    };

    points.sort(function(){
        return Math.random() - Math.random();
    });

    return points;
}

window.onload = () =>{
    const metaData = localStorage.getItem("getMetaData");
    // const dateStart = localStorage.getItem("dateStart");
    
    const metaDataJson = JSON.parse(metaData)
    
    const points = changeToXY()

    drawStar(points)
}