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
