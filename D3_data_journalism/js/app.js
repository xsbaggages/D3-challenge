// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 50,
  bottom: 50,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// creating SVG wrapper    
var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
  
  // Append an SVG group
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // typecast from string to int
  d3.csv("data/data.csv", function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    return data;
}).then(function(data) {
    
  // console.log(data);
  // console.log(data.poverty);
  // console.log(data.healthcare);

    // scale y to chart height
    var yScale = d3.scaleLinear()
        .domain([8, d3.max(data, function(d) {
          return d.poverty;
        })])
        .range([height, 0]);

    // scale x to chart width
    var xScale = d3.scaleLinear()
        .domain([3, d3.max(data, function(d) {
          return d.healthcare;
        })])
        .range([0, width]);
       

    // creating axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    chartGroup.append("g")
        .call(yAxis);

  
     // ceating data point in circles   
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.healthcare))
      .attr("cy", d => yScale(d.poverty))
      .attr("r", "10")
      .classed("stateCircle", true);

    //adding state abbreviations 
    chartGroup.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => (xScale(d.healthcare)))
      .attr("y", d => (yScale(d.poverty)))
      .classed("stateText", true)
      .text(d => d.abbr);
    // could not figure out why state abbr from Alabama to Mississippi does not show up

    // x label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .classed("aText", true)
      .attr("data-axis-name", "healthcare")
      .text("Lacks Healthcare(%)");

    // y label
    chartGroup.append("text")
      .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
      .attr("data-axis-name", "poverty")
      .classed("aText", true)
      .text("In Poverty (%)");

});