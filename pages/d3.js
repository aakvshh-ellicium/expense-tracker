import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const margin = {top: 70, right: 40, bottom: 60, left: 175};
const width = 660 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const data = JSON.parse(window.localStorage.state);

const dateExpData = {};
data.transactions.forEach((transaction) => {
    if (transaction.type === "debit") {
        const date = transaction.date;
        const amount = +transaction.amount; // Convert to number
        if (dateExpData[date]) {
            dateExpData[date] += amount;
        } else {
            dateExpData[date] = amount;
        }
    }
});

console.log(dateExpData);

const dateExpSum =[];

for (let date in dateExpData){
    const sum = dateExpData[date];
    dateExpSum.push({date, sum});
}

console.log(dateExpSum)

const svg = d3.select('#analysis')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(dateExpSum, d => d.sum)]); // Use max sum for domain

const y = d3.scaleBand()
    .range([height, 0])
    .padding(0.1)
    .domain(dateExpSum.map(d => d.date)); // Use dates for domain

const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

svg.selectAll(".bar")
    .data(dateExpSum)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", d => y(d.date))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d.sum))
    .style("fill", 'skyblue');

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .call(yAxis);