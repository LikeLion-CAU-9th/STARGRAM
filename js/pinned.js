const center = () => {
    let latitudeSum = 0;
    let longitudeSum = 0;

    const metaData = localStorage.getItem("getMetaData");
    const metaDataJson = JSON.parse(metaData);
    let positioned = 0;

    for(let i=0; i<metaDataJson.length; i++){
        if (metaDataJson[i]["latitude"] != "NO_WHERE") {
            latitudeSum += metaDataJson[i]["latitude"]
            longitudeSum += metaDataJson[i]["longitude"]
            positioned += 1;
        }
    }
    
    return {"latitude" : latitudeSum/positioned, "longitude" : longitudeSum/positioned}

    
}