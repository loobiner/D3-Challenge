// @TODO: YOUR CODE HERE!

// creating the SVG wrapper
var svgWidth = 1200;
var svgHeight = 660;

var margin = {
    top: 50, 
    right: 50, 
    bottom: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// appending SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// initial params
var chosenXAxis = "poverty";

//function for updating x-scale variable when clicking x-axis label
function xScale(data, chosenXAxis) {
    //create scales
   var xLinearScale = d3.scaleLinear()
     .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, () =>[chosenXAxis * 1.2])
    ])
    .range([0,width]);

  return xLinearScale;
}

// function for updating xAxis variable when clicking xAxis label
function renderAxes(newXScale, xAxis) {
   var bottomAxis = d3.axisBottom(newXScale);

   xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
}
// function used for updating circles group with transition to
//new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
     .duration(1000)
     .attr("cx", d => newXScale(d[chosenXAxis]));

   return circlesGroup;
}

//function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
        var label = "Poverty";
    }
    else {
        var label = "age:";
    }

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

circlesGroup.call(toolTip);

circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
})
//onmouseout event
.on("mouseout", function(data) {
    toolTip.hide(data);
});

return circlesGroup;
}

//retrieve data from csv and execute everything below
d3.csv("data.csv").then(function(data, err) {
    if (err) throw err;

    //parse data
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = + data.ageMoe;
    data.income = + data.income;
    data.incomeMoe = + data.incomeMoe;
    data.healthcare = + data.healthcare;
    data.healthcareLow = + data.healthcareLow;
    data.healthcareHigh = + data.healthcareHigh;
    data.obesity = + data.obesity;
    data.obesityLow = + data.obesityLow;
    data.obesityHigh = + data.obesityHigh;
    data.smokes = + data.smokes;
    data.smokesLow = + data.smokesLow;
    data.smokesHigh = + data.smokesHigh;
 });

// xLinearScale = xScale function above csv import
var xLinearScale = xScale(data, chosenXAxis);


//create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//append x axis
var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

//append y axis
chartGroup.append("g")
    .call(leftAxis);

//append initial circles
var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

//create group for all x-axis labels
var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width/2}, ${height + 20})`);

var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")// value to grab for event listener
    .classed("active", true)
    .text("Povery Rates per State");

var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age")// value to grab for event listener
    .classed("active", true)
    .text("Average Age of Resident per State")

var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "income")// value to grab for event listener
    .classed("active", true)
    .text("Average Income per State");

var healthcareLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "healthcare")// value to grab for event listener
    .classed("active", true)
    .text("Rate of healthcare(?) per State");

var obesityLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "obesity")// value to grab for event listener
    .classed("active", true)
    .text("Rate of obesity per State");

var smokesLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "smokes")// valu event listener
    .classed("active", true)
    .text("Rate of Smoking per State");

//update ToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis);

//x axis labels event listener
labelsGroup.selectAll("text")
    .on("click", function() {
        //get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

    //replaces chosenXAxis with value
    chosenXAxis = value;

    //console.log(chosenXAxis)

    //fuctions here found above csv import
    //updates x scale for new data
    xLinearScale = xScale(data, chosenXAxis);

    //updates x axis with transition
    xAxis = renderAxes(xLinearScale, xAxis);

    //updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

    //updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis);

    //changes classes to change bold text
    if (chosenXAxis === "poverty") {
        povertyLabel
            .classed("active", true)
            .classed("inactive", false)
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        
    }
    elseif (chosenXAxis === "age"); {
        ageLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", false)
            .classed("inactive", true);
    }
    elseif (chosenXAxis === "income"); {
        incomeLabel
            .classed("active", true)
            .claseed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true)
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", false)
            .classed("inactive", true);
    }
    elseif (chosenXAxis === "healthcare"); {
        healthcareLabel
            .classed("active", true)
            .classed("inactive", true);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true)
        ageLabel
            .classed("active", false)
            .classed("active", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", false)
            .classed("inactive", true);
    }
    elseif (chosenXAxis === "obesity"); {
        obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel 
            .classed("active", false)
            .classed("inactive", true);
    }
    elseif (chosenXAxis === "smokes"); {
        smokesLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
    }


    }})});
