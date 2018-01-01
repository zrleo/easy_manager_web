$(function() {
    Morris.Area({
        element: 'morris-area-chart',
        data: [
            { time: '2010-01-01', lookNum: 2000, partakeNum: null, winNum: 2647 },
            { time: '2010-01-02', lookNum: 2048, partakeNum: 2294, winNum: 2441 },
            { time: '2010-01-03', lookNum: 2455, partakeNum: 2294, winNum: 2441 },
            { time: '2010-01-04', lookNum: 2680, partakeNum: 2294, winNum: 2441 }
        ],
        xkey: 'time',
        ykeys: ['lookNum', 'partakeNum', 'winNum'],
        labels: ['浏览次数', '参与次数', '中奖次数'],
        hideHover: 'auto',
        resize: true,
        lineColors: ['#87d6c6', '#54cdb4','#1ab394'],  // 三种数据对应的背景色
        lineWidth: 2, // 数据的线粗细程度
        pointSize: 2 //数据点的大小
    });
});