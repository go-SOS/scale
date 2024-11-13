"use client";
import { Chart } from 'react-google-charts';

export default function TinyBarChart({ reminders }) {
    const chartData = [
        ['Category', 'Count', { role: 'style' }],
        ['Overdue', reminders.overdue.length, 'red'],
        ['Due Next Day', reminders.dueNextDay.length, 'orange'],
        ['Due Next Week', reminders.dueNextWeek.length, 'yellow'],
        ['Due Next Month', reminders.dueNextMonth.length, 'green']
    ];

    // Chart options
    const options = {
        title: 'Task Due Reminder',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Count',
            minValue: 0,
        },
        vAxis: {
            title: 'Category',
        },
        colors: ['red', 'orange', 'yellow', 'green'], 
    };

    return (
        <div className="bg-white rounded-md min-h-[59vh]">
            <Chart
                width="27vw"
                height="58vh"
                chartType="BarChart"
                loader={<div>Loading Chart...</div>}
                data={chartData}
                options={options}
            />
        </div>
    );
}
