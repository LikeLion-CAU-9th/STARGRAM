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