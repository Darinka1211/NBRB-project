 fetch('https://www.nbrb.by/api/exrates/currencies')
    .then(response => response.json())
    .then (payload => payload.filter((el) => Number(el.Cur_DateEnd.slice(0,4)) >= 2022))
    .then(payload => ({
        msg: 'cur',
        payload,
       })
    ) 
    .then(postMessage)
   
    addEventListener('message', ({data}) => {
        mapp[data.msg](data)
    })