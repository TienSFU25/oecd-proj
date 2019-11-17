const noop = (e) => {d3.event.stopPropagation()};
const geographyDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const worldTopologyDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv";
const irisDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv";
const skillsDataLoc = "https://raw.githubusercontent.com/cusoh/data_skills/master/SKILLS_2018_TOTAL_25102019044734209.csv";

const margin = {top: 30, right: 0, bottom: 0, left: 10},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

const actualWidth = width - margin.left - margin.right;
const actualHeight = height - margin.top - margin.bottom;
const widthOffset = 15;

let singleViewWidth = actualWidth / 2 - widthOffset;
let singleViewHeight = actualHeight / 2 - widthOffset;

var container = d3.select("#container");

// just use a default projection
// projection = d3.geoEqualEarth();

const dataPromises = [
    d3.json(geographyDataLoc),
    d3.csv(worldTopologyDataLoc),
    d3.csv(irisDataLoc),
    d3.csv(skillsDataLoc)
];

Promise.all(dataPromises).then(values => {
    drawWorldView(values[0], values[3]);
    drawBoxPlot(values[3]);
}).catch(error => console.error(`Error in data fetching ${error}`));

let quads = [];
// make our layout
for (let i = 0; i < 2; i++) {
    let row = container.append("div")
        .attr("class", "row");

    for (let j = 0; j < 2; j++) {
        let quad = row.append("div")
            .attr("class", "scroll column")
            .attr("style", `width: ${singleViewWidth+widthOffset}`)
            .append("svg")
            .attr("width", singleViewWidth)
            .attr("height", singleViewHeight);

        // just to make a checkered layout
        let opacity = (i + j) % 2 == 0 ? 0.3 : 0.1;

        quad.append("rect")
            .attr("opacity", opacity)
            .attr("width", singleViewWidth)
            .attr("height", singleViewHeight);

        quads.push(quad);
    }
}
