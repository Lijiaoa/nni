import React from 'react';
import ReactEcharts from 'echarts-for-react';
import '../../../static/style/experiment/experiment.scss';
import '../../../static/style/experiment/project.scss';

function MetricGraph(): any {
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 40,
            bottom: 40,
            data: ['Example mnist', 'Example mnist1', 'Example mnist2', 'Example mnist3', 'Example mnist4']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        yAxis: {
            type: 'value',
            name: 'Metirc'
        },
        series: [
            {
                name: 'Example mnist',
                type: 'line',
                data: [0.4,0.5,0.7,0.9,0.7,0.8, 0.87, 0.9]
            },
            {
                name: 'Example mnist1',
                type: 'line',
                data: [0.1,0.3,0.7,0.5,0.9,0.8, 0.82, 0.99]
            },
            {
                name: 'Example mnist2',
                type: 'line',
                data: [0.1,0.3,0.35,0.5,0.56,0.7, 0.79, 0.83]
            },
            {
                name: 'Example mnist3',
                type: 'line',
                data: [0.1,0.3,0.33,0.5,0.55,0.6, 0.66, 0.77]
            },
            {
                name: 'Example mnist4',
                type: 'line',
                data: [0.9,0.98,0.998,0.99999,0.92,0.96]
            }
        ]
    };
    return (
        <div>
            <ReactEcharts
                option={option}
                style={{ width: '100%', height: 418, margin: '0 auto' }}
                notMerge={true} // update now
            />
        </div>
    );
}

export default MetricGraph;
