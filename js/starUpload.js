window.onload = () => {
  const maxLen = titleExample.length;
  let i = getRandomInt(0, maxLen - 1);
  document.querySelector(".star-upload-title").placeholder = titleExample[i];
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
