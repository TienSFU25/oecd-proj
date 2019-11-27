var container = d3.select("#container");

// just use a default projection
// projection = d3.geoEqualEarth();

const dataPromises = [
    d3.json(geographyDataLoc),
    d3.csv(skillsDataLoc)
];

Promise.all(dataPromises).then(values => {
    geographyData = values[0];
    skillsData = values[1];

    // ignore Antartica
    geographyData.features = geographyData.features.filter((v) => {
        return v.id !== "ATA";
    });

    dataBySkills = d3.nest().key(d => d.Type).key(d => d.Skills).entries(skillsData);

    drawWorldView();
    drawBoxPlot();
}).catch(error => console.error(`Error in data fetching ${error}`));

// add horizontal scroll
function scrollHorizontally(e) {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    this.scrollLeft -= (delta*40);
    e.preventDefault();
}

// make our layout
for (let i = 0; i < 2; i++) {
    let row = container.append("div")
        .attr("class", "row");

    for (let j = 0; j < 2; j++) {
        let quadContainer = row.append("div")
            .attr("class", "scroll column")
            .attr("style", `width: ${singleViewWidth+widthOffset}`);
        
        quadContainer.on("mousewheel", scrollHorizontally.bind(quadContainer.node()), false);
        
        let quad = quadContainer.append("svg")
            .attr("width", singleViewWidth-8)
            .attr("height", singleViewHeight);

        // just to make a checkered layout
        let opacity = (i + j) % 2 == 0 ? 0.3 : 0.1;

        quad.append("rect")
            .attr("opacity", opacity)
            .attr("width", maxWidth)
            .attr("height", singleViewHeight);

        quads.push(quad);
    }
}

let tabs = container.append("div")
    .attr("class", "flex-container category-tabs")
    .attr("style", `width: ${tabWidth * tabNames.length}px`);

let defaultColor = "bisque";

for (let i = 0; i < tabNames.length; i++) {
    let color = i == 0 ? filterColorScale[1] : defaultColor;

    tabs.append("div")
        .attr("class", "flex-item")
        .attr("style", `height: ${tabHeight}px; background: ${color}`)
        .append("div")
        .text(tabNames[i])
        .on("click", function() {
            currentSelectedCategory = tabNames[i];
            currentSelectedSkill = dataBySkills.filter((v) => v.key == currentSelectedCategory)[0].values[0].key;
            
            tabs.selectAll(".flex-item").attr("style", `height: ${tabHeight}px; background: ${defaultColor}`);
            d3.select(this.parentElement).attr("style", `height: ${tabHeight}px; background: ${filterColorScale[1]}`);

            updateBoxPlot();
            updateMap();
        });
}
