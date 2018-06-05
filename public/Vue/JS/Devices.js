new Vue({
    el: '#Device1',
    data: {
        fill: [
            {qte: 25, dev: "Rev2-1", last: "29/05/2018 17:27", adr: "43.645074, -115.993081"},
            {qte: 50, dev: "Rev2-2", last: "30/05/2018 09:32", adr: "75 Rue Saint-Hélier, 35000 Rennes"},
            {qte: 75, dev: "Rev2-3", last: "29/05/2018 20:27", adr: "Oude Leliestraat 2, 1015 AW Amsterdam, Pays-Bas"},
            {qte: 100, dev: "Rev2-4", last: "30/05/2018 04:20",adr: "62 Chaussée du Sillon, 35400 Saint-Malo"},
            {qte: 0, dev: "Rev2-5", last: "29/05/2018 19:57", adr :"3 avenue germaine tillion 35136 saint-jacques-de-la-lande"},

        ],
        tmp:[
            {a: 1},
            {a: 1},
            {a: 1}

        ],
        neutre: true,
        full: false,
        empty: false,
    },

});


$(".low").jQMeter({
    goal:'100',
    raised: '25' ,
    width:'50px',
    height: '100px',
    barColor: "#ea5153",
    meterOrientation: "vertical"
});

$(".mid").jQMeter({
    goal:'100',
    raised: '65',
    width:'50px',
    height: '100px',
    barColor: "#007cb3",
    meterOrientation: "vertical"
});

$(".high").jQMeter({
    goal:'$10,000',
    raised: '$87,50',
    width:'50px',
    height: '100px',
    barColor: "#45b384",
    meterOrientation: "vertical"
});
