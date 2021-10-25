let scene, camera, renderer, starGeo, stars, vertices;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer();
  document.querySelector(".starfall-screen").style.height =
    "calc(100vh - 75px)";
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector(".starfall-screen").appendChild(renderer.domElement);
  vertices = [];
  for (let i = 0; i < 4000; i++) {
    star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.001;
    vertices.push(star);
  }
  starGeo = new THREE.BufferGeometry().setFromPoints(vertices);
  let sprite = new THREE.TextureLoader().load("./image/star-white.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 1,
    map: sprite,
  });
  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
  animate();
}

function animate() {
  for (let k = 0; k < vertices.length; k++) {
    vertices[k].velocity += vertices[k].acceleration;
    vertices[k].y -= vertices[k].velocity;
    if (vertices[k].y < -200) {
      vertices[k].y = 200;
      vertices[k].velocity = 0;
    }
  }
  starGeo.setFromPoints(vertices);
  stars.rotation.y -= 0.002;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.onload = () => {
  init();
};
