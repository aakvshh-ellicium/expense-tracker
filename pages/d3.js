// import { transition } from "d3-transition";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const margin = {top: 70, right: 40, bottom: 60, left: 75};
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

// date-wise expenses
const dateWiseExpenses = () => {
    const svg = d3.select('#analysis')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    dateExpSum.sort((a, b) => d3.descending(a.sum, b.sum));

    const x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(dateExpSum, d => d.sum + 25)]); // Use max sum for domain

    const y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1)
        .domain(dateExpSum.map(d => d.date)); // Use dates for domain

    const xAxis = d3.axisBottom(x)
        .ticks(5)
        .tickSize(0);
    const yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickPadding(10);

    svg.selectAll(".bar")
        .data(dateExpSum)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.date))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .transition()
        .duration(1750)
        .attr("width", d => x(d.sum))
        .style("fill", 'skyblue');

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.selectAll(".label")
        .data(dateExpSum)
        .enter()
        .append("text")
        .attr("x", d => x(d.sum) + 5)
        .attr("y", d => y(d.date) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(d => d.sum);

    svg.append("text")
        .attr("transform", "translate(" + width / 2.7 + "," + (height + margin.bottom / 2) + ')')
        .style("font-size", "20px") 
        .style("fill", "black")
        .attr("dy", "1em")
        .text("Total Expenses");   
}

dateWiseExpenses();

const categoryExpData = {}

data.transactions.forEach(transaction => {
    if (transaction.type === "debit"){
        const category = transaction.category;
        const amount = Number(transaction.amount);

        if (categoryExpData[category]){
            categoryExpData[category] += amount;
        } else {
            categoryExpData[category] = amount;
        }
    }
})

console.log(categoryExpData);

let categoryExpSum = [];

for (let category in categoryExpData){
    const sum = categoryExpData[category];
    categoryExpSum.push({category, sum})
}

console.log(categoryExpSum)

const svg = d3.select('#analysis2')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    categoryExpSum.sort((a, b) => d3.descending(a.sum, b.sum));

    const x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(categoryExpSum, d => d.sum + 25)]); // Use max sum for domain

    const y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1)
        .domain(categoryExpSum.map(d => d.category)); // Use dates for domain

    const xAxis = d3.axisBottom(x)
        .ticks(5)
        .tickSize(0);
    const yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickPadding(10);

    svg.selectAll(".bar")
        .data(categoryExpSum)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.category))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .transition()
        .duration(1750)
        .attr("width", d => x(d.sum))
        .style("fill", 'skyblue');

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.selectAll(".label")
        .data(categoryExpSum)
        .enter()
        .append("text")
        .attr("x", d => x(d.sum) + 5)
        .attr("y", d => y(d.category) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(d => d.sum);

    svg.append("text")
        .attr("transform", "translate(" + width / 2.7 + "," + (height + margin.bottom / 2) + ')')
        .style("font-size", "20px") 
        .style("fill", "black")
        .attr("dy", "1em")
        .text("Total Expenses");  


