fetch('https://www.nbrb.by/api/exrates/currencies')
    .then(response => response.json())
    .then(payload => ({
            msg: 'currentRate',
            payload,
        })
    )
    .then(postMessage)

    