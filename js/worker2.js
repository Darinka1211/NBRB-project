function getRate(id, dataStart, dataEnd){
    fetch(`https://www.nbrb.by/api/exrates/rates/dynamics/${id}?startdate=${dataStart}&enddate=${dataEnd}`)
    .then(response => response.json())
    .then(postMessage)
    
}
function sendRate({data}) {
    getRate(data.id, data.dataStart, data.dataEnd);
}
addEventListener('message', sendRate);