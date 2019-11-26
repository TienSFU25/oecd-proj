// from raw
const getSkillNameFn = (d) => d.Skills;
const getCategoryNameFn = (d) => d.Type;

let boxplot;
let x, xAxis;
let y, yAxis;

function drawBoxPlot() {
    // Show the X scale
    x = d3.scaleBand()
        .range([ 0, 1])
        .domain([])
        .paddingInner(1)
        .paddingOuter(.5);

    boxplot = quads[2].append("g")
        .attr("class", "boxplot")
        .attr("transform", `scale(${boxScale}) translate(${boxLeftShift}, ${boxDownShift})`);

    xAxis = boxplot.append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(0, ${boxplotHeight})`)
        .call(d3.axisBottom(x));

    // Show the Y scale
    y = d3.scaleLinear()
        .domain([-1,1])
        .range([boxplotHeight, 0])
    
    yAxis = boxplot.append("g")
        .call(d3.axisLeft(y));

    updateBoxPlot();
}

function clear() {
    boxplot.selectAll(".vertline").remove();
    boxplot.selectAll(".mainbox").remove();
    boxplot.selectAll(".median").remove();
    boxplot.selectAll(".hoverbox").remove();

    // remove jitter
    boxplot.selectAll("circle").remove();
}

function updateBoxPlot() {
    clear();

    let data = dataBySkills.filter(v => {
        return v.key == currentSelectedCategory;
    })[0].values;

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = data.map(keyValuePair => {
        let d = keyValuePair.values;
        q1 = d3.quantile(d.map(function(g) { return g.Value;}).sort(d3.ascending),.25);
        median = d3.quantile(d.map(function(g) { return g.Value;}).sort(d3.ascending),.5);
        q3 = d3.quantile(d.map(function(g) { return g.Value;}).sort(d3.ascending),.75);
        interQuantileRange = q3 - q1;
        min = q1 - 1.5 * interQuantileRange;
        max = q3 + 1.5 * interQuantileRange;

        let statSum = {q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max};

        return {
            key: keyValuePair.key,
            value: statSum
        };
    });

    let domain = data.map((v) => v.key);

    // update the X axis
    let boxPlotWidth = singleItemWidth * domain.length + 30;
    x.domain(domain)
        .range([0, boxPlotWidth]);

    xAxis.call(d3.axisBottom(x));
    xAxis.selectAll("text")
        .on("click", function(data) {
            currentSelectedSkill = data.key;
            updateMap();
        });

    // Show the main vertical line
    let vertLines = boxplot
        .selectAll("vertLines");

    vertLines.data(sumstat)
        .enter()
        .append("line")
        .attr("class", "vertline")
        .attr("x1", function(d){return(x(d.key))})
        .attr("x2", function(d){return(x(d.key))})
        .attr("y1", function(d){return(y(d.value.min))})
        .attr("y2", function(d){return(y(d.value.max))})
        .attr("stroke", "black")
        .style("width", 40)

    // rectangle for the main box
    boxplot
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("class", "mainbox")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(Math.abs(y(d.value.q1)-y(d.value.q3)))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2");

    // Show the median
    boxplot
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("class", "median")
        .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(y(d.value.median))})
        .attr("y2", function(d){return(y(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80);

    // opaque rectangle for hover
    boxplot
        .selectAll("hoverBox")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("class", "hoverarea")
        .attr("x", function(d){return(x(d.key)-singleItemWidth/4)})
        .attr("y", function(d){return(y(1.0))})
        .attr("height", boxplotHeight)
        .attr("width", singleItemWidth / 2)
        .on("click", function(data) {
            currentSelectedSkill = data.key;
            updateMap();
        });

    // show jitter
    for (let i = 0; i < data.length; i++) {
        const skillName = data[i].key;
        const skillData = data[i].values;

        boxplot
            .selectAll("indPoints")
            .data(skillData)
            .enter()
            .append("circle")
            .attr("cx", function(d){return(x(skillName) - jitterWidth/2 + Math.random()*jitterWidth )})
            .attr("cy", function(d){return(y(d.Value))})
            .attr("r", 4)
            .attr("class", "hover")
            .attr("stroke", "black")
            .on("mouseover", function(data) {
                showTooltip(data.Country, `Value: ${data.Value}`);
            })
            .on("mouseleave", function() {
                fadeTooltip();
            })
            .on("click", function(data) {
                currentSelectedSkill = skillName;
                updateMap();
            });
        
        fillCircles();
    }

    // need to put this at the end or the svg overscales
    quads[2].attr("width", boxPlotWidth * boxScale + 50);
};

function fillCircles() {
    if (boxplot) {
        boxplot.selectAll("circle")
            .style("fill", function(data) {
            if (getSkillNameFn(data) == currentSelectedSkill) {
                return "green";
            }

            return "white";
        });
    }
}