const noop = (e) => {d3.event.stopPropagation()};
const geographyDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const worldTopologyDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv";
const irisDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv";

const margin = {top: 10, right: 0, bottom: 0, left: 10},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

const actualWidth = width - margin.left - margin.right;
const actualHeight = height - margin.top - margin.bottom;

let featureBounds;
let geoLayer = {};
let singleViewWidth = actualWidth / 2;
let singleViewHeight = actualHeight / 2;

// The svg
var svg = d3.select("svg")
    .attr("width", actualWidth)
    .attr("height", actualHeight);

// just use a default projection
// projection = d3.geoEqualEarth();
var projection = d3.geoNaturalEarth1();

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);

const dataPromises = [
    d3.json(geographyDataLoc),
    d3.csv(worldTopologyDataLoc),
    d3.csv(irisDataLoc)
];

Promise.all(dataPromises).then(values => {
    values[1].map((value) => {
        data.set(value.code, +value.pop);
    });
    drawWorldView(values[0]);
    drawBoxPlot(values[2]);
}).catch(error => console.error(`Error in data fetching ${error}`));

var layout = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let quads = [];

// make our layout
for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
        let quad = layout.append("g")
            .attr("transform", "translate(" + singleViewWidth*i + "," + singleViewHeight*j + ")");

        // just to make a checkered layout
        let opacity = (i + j) % 2 == 0 ? 0.3 : 0.1;

        quad.append("rect")
            .attr("opacity", opacity)
            .attr("width", singleViewWidth)
            .attr("height", singleViewHeight);

        quads.push(quad);
    }
}

var theMap = quads[0]
    .append("g");

// Define the div for the tooltip
const tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

const updateTooltip = (polygon) => {	
    const tooltipHtml = `<div>
        <div>${polygon.properties.name}</div>
        <div>Population: ${polygon.total}</div>
        </div>`;

//     const tooltipHtml = `<svg>
//     <rect width="300" height="100" class="tooltip"></rect>
//     <circle cx="60" cy="35" r="30"></circle>
//   </svg>`;

    tooltip.html(tooltipHtml)
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY) + "px");	
};

function getFeaturesBox() {
    return {
        x: featureBounds[0][0],
        y: featureBounds[0][1],
        width: featureBounds[1][0] - featureBounds[0][0],
        height: featureBounds[1][1] - featureBounds[0][1]
    };
};

// fits the geometry layer inside the viewport
function fitGeoInside() {
    var bbox = getFeaturesBox(),
        scale = 0.95 / Math.max(bbox.width / singleViewWidth, bbox.height / singleViewHeight),
        trans = [-(bbox.x + bbox.width / 2) * scale + singleViewWidth / 2, -(bbox.y + bbox.height / 2) * scale + singleViewHeight / 2];

    geoLayer.scale = scale;
    geoLayer.translate = trans;

    theMap.attr('transform', [
            'translate(' + geoLayer.translate + ')',
            'scale(' + geoLayer.scale + ')'
        ].join(' '));
}

function drawWorldView(worldTopology) {
    // Draw the map
    let mapGroup = theMap
        .selectAll("path")
        .data(worldTopology.features)
        .enter()
        .append("g");

    const path = d3.geoPath().projection(projection);

    var collection = {
        'type': 'FeatureCollection',
        'features' : worldTopology.features
      };

    featureBounds = path.bounds(collection);
        
    mapGroup.append("path")
        // draw each country
        .attr("d", path)
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", "Country")
        .style("opacity", .8);

    mapGroup.on("mouseover", function(data) {
        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .5);
        d3.select(this)
            .select("path")
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "black");

        // div way
        tooltip.transition()		
            .duration(200)		
            .style("opacity", .9);

        updateTooltip(data);
    })
    .on("mousemove", function (data) {
        // updateTooltip(data);
    })
    .on("mouseleave", function(data) {
        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .8);

        d3.select(this)
            .select("path")
            .transition()
            .duration(200)
            .style("stroke", "transparent");

        tooltip.transition()		
            .duration(500)		
            .style("opacity", 0);
    });

    fitGeoInside();
}

function drawBoxPlot(data) {
    // pretty random constants...not exactly responsive
    // we will need to tweak this to fit the screen
    const boxScale = 0.9;
    const boxLeftShift = singleViewWidth * (1 - boxScale) / 2;
    const boxDownShift = singleViewHeight * (1 - boxScale) / 3;

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Species;})
        .rollup(function(d) {
            q1 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.25)
            median = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.5)
            q3 = d3.quantile(d.map(function(g) { return g.Sepal_Length;}).sort(d3.ascending),.75)
            interQuantileRange = q3 - q1
            min = q1 - 1.5 * interQuantileRange
            max = q3 + 1.5 * interQuantileRange
            
            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data);

    // Show the X scale
    var x = d3.scaleBand()
        .range([ 0, singleViewWidth ])
        .domain(["setosa", "versicolor", "virginica"])
        .paddingInner(1)
        .paddingOuter(.5);

    var boxplot = quads[1].append("g")
        .attr("transform", `scale(${boxScale}) translate(${boxLeftShift}, ${boxDownShift})`);

    boxplot.append("g")
        .attr("transform", `translate(0, ${singleViewHeight})`)
        .call(d3.axisBottom(x));

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([3,9])
        .range([singleViewHeight, 0])
    boxplot.append("g")
        .call(d3.axisLeft(y));

    // Show the main vertical line
    boxplot
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.key))})
        .attr("x2", function(d){return(x(d.key))})
        .attr("y1", function(d){return(y(d.value.min))})
        .attr("y2", function(d){return(y(d.value.max))})
        .attr("stroke", "black")
        .style("width", 40);

    // rectangle for the main box
    var boxWidth = 100
    boxplot
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.value.q3))})
            .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2");

    // Show the median
    boxplot
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(y(d.value.median))})
        .attr("y2", function(d){return(y(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80);
}