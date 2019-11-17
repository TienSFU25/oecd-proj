let geoLayer = {};
let featureBounds;
const zoom = 1.1;
const unknownColorFill = "#ffffff";
const hoverTransitionTimeMs = 200;

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

function focusCountries(countries) {
    d3.selectAll(".Country")
        .transition()
        .duration(hoverTransitionTimeMs)
        .style("opacity", .5)
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

function drawWorldView(geography, worldTopology) {
    let dataBySkills = d3.nest().key(function(d) { return `${d.Type}/${d.Skills}`;}).entries(worldTopology);

    const allCountryNames = new Set();
    const countriesWithData = new Set();

    // ignore Antartica
    geography.features = geography.features.filter((v) => {
        return v.id !== "ATA";
    });

    geography.features.map(v => allCountryNames.add(v.id));

    var projection = d3.geoNaturalEarth1();
    var mapData = d3.map();

    var colorScale = d3.scaleQuantize()
        .domain([-1, 1])
        .range(d3.schemePuOr[8]);
    
    var effectiveThresholds = [-1].concat(colorScale.thresholds().concat([1]));

    var mylegend = legend({
        color: colorScale,
        title: "Skill demands",
        tickSize: 0,
        width: singleViewWidth / 2.5
    });

    var legendGroup = quads[0].append("g")
        .attr("transform", `translate(${singleViewWidth / 1.8}, ${singleViewHeight / 30})`)
        .append(() => mylegend);
    
    var entriesForSkill = dataBySkills[0];
    var skillName = entriesForSkill.key;

    // stick in the textbox
    var textbox = quads[0].append("g");
    textbox.append("text")
        .attr("x", singleViewWidth / 20)
        .attr("y", singleViewHeight / 9)
        .text(skillName);

    // fill up map data (value that will show on choropleth)
    entriesForSkill.values.map((entry) => {
        countriesWithData.add(entry.LOCATION);
        mapData.set(entry.LOCATION, +entry.Value);
    });

    const countriesWithNoData = new Set([...allCountryNames].filter(x => !countriesWithData.has(x)));
    Array.from(countriesWithNoData).map((countryName) => {
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
            d.total = mapData.get(d.id);

            if (Math.abs(d.total) > 1) {
                return unknownColorFill;
            }

            return colorScale(d.total);
        })
        .style("stroke", "black")
        .style("stroke-width", 0.1)
        .attr("class", "Country")
        .style("opacity", .8);

    mapGroup.on("mouseover", function(data) {
        focusCountries(d3.select(this));

        // div way
        tooltip.transition()		
            .duration(hoverTransitionTimeMs)		
            .style("opacity", .9);

        updateTooltip(data);
    })
    .on("mouseleave", function() {
        focusNothing();

        tooltip.transition()		
            .duration(500)		
            .style("opacity", 0);
    });

    fitGeoInside();

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

        focusCountries(countriesInQuantile);
        // console.log(countriesInQuantile._groups[0].length);
    }).on("mouseleave", function() {
        focusNothing();
    });
}