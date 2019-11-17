let geoLayer = {};
let featureBounds;

var theMap = quads[0]
    .append("g");


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

function drawWorldView(geography, worldTopology) {
    let dataBySkills = d3.nest().key(function(d) { return `${d.Type}/${d.Skills}`;}).entries(worldTopology);

    const allCountryNames = new Set();
    const countriesWithData = new Set();
    geography.features.map(v => allCountryNames.add(v.id));

    var projection = d3.geoNaturalEarth1();
    var mapData = d3.map();
    var colorScale = d3.scaleThreshold()
        .domain([-1, -0.5, 0, 0.5, 1])
        .range(["#ffffff"].concat(d3.schemeBlues[5]));
    
    var entriesForSkill = dataBySkills[0];

    entriesForSkill.values.map((entry) => {
        countriesWithData.add(entry.LOCATION);
        mapData.set(entry.LOCATION, +entry.Value);
    });

    const countriesWithNoData = new Set([...allCountryNames].filter(x => !countriesWithData.has(x)));
    Array.from(countriesWithNoData).map((countryName) => {
        // set this as the first color
        mapData.set(countryName, -2);
    });

    // Draw the map
    let mapGroup = theMap
        .selectAll("path")
        .data(geography.features)
        .enter()
        .append("g");

    const path = d3.geoPath().projection(projection);

    var collection = {
        'type': 'FeatureCollection',
        'features' : geography.features
      };

    featureBounds = path.bounds(collection);

    mapGroup.append("path")
        // draw each country
        .attr("d", path)
        // set the color of each country
        .attr("fill", function (d) {
            d.total = mapData.get(d.id) || 0;
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