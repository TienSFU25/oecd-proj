// The svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(70)
    .center([0,20])
    .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);

const geographyDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const worldTopologyDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv";

const dataPromises = [
    d3.json(geographyDataLoc),
    d3.csv(worldTopologyDataLoc)
];

Promise.all(dataPromises).then(values => {
    values[1].map((value, index) => {
        data.set(value.code, +value.pop);
    });
    ready(values[0]);
}).catch(error => console.error(`Error in data fetching ${error}`));

function ready(worldTopology) {
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(worldTopology.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        });
}