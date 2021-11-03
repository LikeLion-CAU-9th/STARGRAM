
function countingStar(response) {
    setTimeout(()=> {
        document.getElementById('visits').innerText = response.value;
    }, 100);
}