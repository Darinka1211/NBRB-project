const today = dayjs().format('YYYY-MM-DD');
const fromDate = document.querySelector('.start')
const toDate = document.querySelector('.end')
const select = document.querySelector('.money')
const week = document.querySelector('.btn1')
const month = document.querySelector('.btn2')
const quarter = document.querySelector('.btn3')
const year = document.querySelector('.btn4')

week.addEventListener('click', () => stage(-1, `week`))
month.addEventListener('click', () => stage(-1, `month`))
quarter.addEventListener('click', () => stage(-3, `month`))
year.addEventListener('click', () => stage(-1, `year`))
select.addEventListener('change', deleteTr)
fromDate.addEventListener('change', input)
toDate.addEventListener('change', input)

const chart2 = document.getElementById('chart_div')

function input() {
    if(fromDate.value&&toDate.value) {
        addDate(select.value, fromDate.value, toDate.value)
    }
}

function stage(n, m) {
    const before = dayjs().add(n, m).format('YYYY-MM-DD')
    addDate(select.value, before, today)
}

const worker = new Worker('/js/worker.js')
const mapping = {
    currentRate: (payload) => {
        result = payload.map(
            ({
                Cur_ID,
                Cur_Name,
                Cur_DateStart,
                Cur_DateEnd,
                Cur_QuotName
            }) => {
                return {
                    Cur_ID,
                    Cur_Name,
                    Cur_DateStart,
                    Cur_DateEnd,
                    Cur_QuotName
                };
            });
        result.forEach(el => {
            if(parseInt(el.Cur_DateEnd) > today.slice(0,4)){
        let option = document.createElement('option')
        option.innerText = el.Cur_Name;
        option.value = el.Cur_ID;
        select.append(option);}
        })
        select.addEventListener('change', () => {
            deleteTr()
            getCur(result);
        })
    }
}
function getCur(result) {
    deleteTr()
    const el = result.filter((el) => {
        return el.Cur_ID == select.value
    })[0];
    fromDate.min = el.Cur_DateStart.slice(0,10)
    fromDate.max = el.Cur_DateEnd.slice(0,10)
    toDate.min = el.Cur_DateStart.slice(0,10)
    toDate.max = el.Cur_DateEnd.slice(0,10)
    count = el.Cur_QuotName
    addDate(el.Cur_ID, el.Cur_DateStart, el.Cur_DateEnd)
}
worker.addEventListener('message', ({data}) => {
    mapping[data.msg](data.payload);
});
let arrCurs 
const worker2 = new Worker('/js/worker2.js')
function addDate(idCur, start, end) {
deleteTr()
worker2.postMessage({
    id: idCur,
    dataStart: start,
    dataEnd: end
});
}
worker2.addEventListener('message', ({data}) => {
    workerData({data}.data)
})
function workerData(el) {
    let rateArr = el;
    rateArr.forEach((json) => {
    createTr(`${json.Date.slice(0,10)}`, ` ${count} ` + ` ${json.Cur_OfficialRate} ` + `BYN`)
    })
    arrCurs = [];
    console.log(arrCurs);
    rateArr.forEach(el => arrCurs.push([new Date(el.Date), el.Cur_OfficialRate]))
    createChart()
}
function createTr (el1, el2) {
    const div = document.querySelector('.tb');
    const table = document.createElement('table');
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    td1.innerText = el1;
    td2.innerText = el2;
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
    div.appendChild(table);
}
function deleteTr() {
    const tr = document.querySelectorAll('td');
    tr.forEach(e => e.remove('tr'))
}
function createChart() {
    chart2.innerHTML = '';
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBackgroundColor);
}
function drawBackgroundColor() {
    const data = new google.visualization.DataTable();
    data.addColumn('datetime', 'X');
    data.addColumn('number', 'Курс');
    data.addRows(arrCurs);
    const options = {
        hAxis: {
        title: 'Период'
        },
        vAxis: {
        title: 'Курс'
        },
        backgroundColor: '#78c1f5',
        width: 650,
        height: 340,
    };
    const chart = new google.visualization.LineChart(chart2);
    chart.draw(data, options);
}