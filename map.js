let geoLayer = {};
let featureBounds;

let mapGroup;
let mapPaths;
let mapData;
let textbox;

const projection = d3.geoNaturalEarth1();
const colorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(d3.schemePuOr[8]);
const effectiveThresholds = [-1].concat(colorScale.thresholds().concat([1]));

// works on 1130 * 754, again we not trying to make this responsive
var mapViewport = quads[0]
    .append("svg")
    .attr("viewBox", `${singleViewWidth / 14}, 0, ${singleViewWidth / zoom}, ${singleViewHeight / zoom}`);

var theMap = mapViewport
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
function fitGeoInside(path, features) {
    var collection = {
        'type': 'FeatureCollection',
        'features' : features
    };
    featureBounds = path.bounds(collection);

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

function focusCountries(countries) {
    d3.selectAll(".Country")
        .transition()
        .duration(hoverTransitionTimeMs)
        .style("opacity", .2)
        // .style("stroke", "none");

    countries
        .select("path")
        .transition()
        .duration(hoverTransitionTimeMs)
        .style("opacity", 1)
        .style("stroke", "black");
}

function focusNothing() {
    d3.selectAll(".Country")
        .transition()
        .duration(hoverTransitionTimeMs)
        .style("opacity", .8)
        // .style("stroke", "none");
}

function drawWorldView() {
    mapData = d3.map();
    geographyData.features.map(v => mapData.set(v.id, unknownCountryCode));

    // setup the legend
    var mylegend = legend({
        color: colorScale,
        title: "Skill demands",
        tickSize: 0,
        width: singleViewWidth / 2.5
    });

    var legendGroup = quads[0].append("g")
        .attr("transform", `translate(${singleViewWidth / 1.8}, ${singleViewHeight / 30})`)
        .append(() => mylegend);

    // stick in the textbox
    textbox = quads[0]
        .append("g")
        .append("text")
        .attr("x", singleViewWidth / 20)
        .attr("y", singleViewHeight / 9);

    // Draw the map
    mapGroup = theMap
        .selectAll("path")
        .data(geographyData.features)
        .enter()
        .append("g");

    const path = d3.geoPath().projection(projection);
    mapPaths = mapGroup.append("path")
        .attr("d", path)
        .style("stroke", "black")
        .style("stroke-width", 0.1)
        .attr("class", "Country")
        .style("opacity", .8);
    fitGeoInside(path, geographyData.features);

    // map hover handlers
    mapGroup.on("mouseover", function(data) {
        focusCountries(d3.select(this));
        showTooltip(data.properties.name, `Value: ${data.total}`);
    })
    .on("mouseleave", function() {
        focusNothing();
        fadeTooltip();
    }).on("click", function(d){

        //console.log();
        let curCatData = cdata[currentSelectedCategory];
        //console.log(curCatData);
        //console.log(curCatData[currentC]);
        //console.log(cdata[currentC]);
        let currentC = d.properties.name;
        if (currentC == 'USA'){
            currentC = 'United States';
        }
        updateBarPlot(currentC, curCatData[currentC]);
    });

    // handlers for hovering over the legend
    var legendBoxes = legendGroup.selectAll('rect');
    legendBoxes.on("mouseover", function(d, i) {
        // console.log(d, i);
        var from = effectiveThresholds[i];
        var to = effectiveThresholds[i + 1];

        var countriesInQuantile = mapGroup.filter((val) => {
            var fits = from < val.total && val.total <= to;
            return fits;
        });

        // console.log(`focusing ${countriesInQuantile._groups[0].length} countries`);

        focusCountries(countriesInQuantile);
    }).on("mouseleave", function() {
        focusNothing();
    });

    // display default skill
    currentSelectedCategory = dataBySkills[0].key;
    currentSelectedSkill = dataBySkills[0].values[0].key;
    updateMap();
}

function updateMap() {
    let entriesForCategory = dataBySkills.filter((v) => v.key == currentSelectedCategory)[0];
    let entriesForSkill = entriesForCategory.values.filter((v) => v.key == currentSelectedSkill)[0];
    textbox.text(currentSelectedSkill);

    // fill up map data (value that will show on choropleth)
    entriesForSkill.values.map((entry) => {
        mapData.set(entry.LOCATION, +entry.Value);
    });

    mapPaths
        .attr("fill", function (d) {
        d.total = mapData.get(d.id);

        if (d.total == unknownCountryCode) {
            return unknownColorFill;
        } else {
            return colorScale(d.total);
        }
    });

    fillCircles();
}
