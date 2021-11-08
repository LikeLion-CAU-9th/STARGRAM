if (!window.indexedDB) {
  alert("현재 사용중인 Browser 환경에서는 사용할 수 없습니다.");
}

const writeIndexedDB = (base64ImageObj) => {
  let request = window.indexedDB.open("stargramDB");
  request.onerror = function (e) {
    alert("Database Error: ", e.target.errorCode);
  };
  request.onsuccess = function (e) {
    let db = this.result;
    let transaction = db.transaction(["image"], "readwrite");

    transaction.oncomplete = function (e) {
      console.log("done");
    };

    transaction.onerror = function (e) {
      console.log("fail");
    };

    let objectStore = transaction.objectStore("image");
    let request_write = objectStore.add(base64ImageObj);
    request_write.onsuccess = function (e) {
      console.log(e.target.result);
    };
  };
};

const clearIndexedDB = () => {
  indexedDB.deleteDatabase("stargramDB");
};

const initIndexedDB = () => {
  clearIndexedDB();
  let db;
  let request = indexedDB.open("stargramDB", 1);
  request.onupgradeneeded = function (e) {
    console.log("onupgrade");
    let db = e.target.result;
    let objectStore = db.createObjectStore("image", { keyPath: "photo_name" });
    objectStore.createIndex("base64", "base64", { unique: false });
    console.log("onupgradeneeded");
  };
  request.onerror = function (e) {
    console.log("Error");
  };
  request.onsuccess = function (e) {
    db = this.result;
  };
};
