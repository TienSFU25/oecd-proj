// from raw
const getSkillNameFn = (d) => d.Skills;
const getCategoryNameFn = (d) => d.Type;

let boxplot;

function drawBoxPlot(data) {
    // only show current category
    data = data.filter((v) => {
        return v.Type == currentSelectedCategory;
    });

    const boxScale = 0.9;
    const boxPlotWidth = 10 * singleViewWidth;

    const boxplotHeight = singleViewHeight * 0.7;

    // pretty random constants...not exactly responsive
    // we will need to tweak this to fit the screen
    const boxLeftShift = singleViewWidth * (1 - boxScale) / 2;
    const boxDownShift = boxplotHeight * (1 - boxScale) / 3;

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(getSkillNameFn)
        .rollup(function(d) {
            q1 = d3.quantile(d.map(function(g) { return g.Value;}).sort(d3.ascending),.25);
            median = d3.quantile(d.map(function(g) { return g.Value;}).sort(d3.ascending),.5);
            q3 = d3.quantile(d.map(function(g) { return g.Value;}).sort(d3.ascending),.75);
            interQuantileRange = q3 - q1;
            min = q1 - 1.5 * interQuantileRange;
            max = q3 + 1.5 * interQuantileRange;

            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data);

    let domain = d3.nest().key(getSkillNameFn).entries(data).map(v => v.key);

    // Show the X scale
    var x = d3.scaleBand()
        .range([ 0, boxPlotWidth ])
        .domain(domain)
        .paddingInner(1)
        .paddingOuter(.5);

    boxplot = quads[2].append("g")
        .attr("transform", `scale(${boxScale}) translate(${boxLeftShift}, ${boxDownShift})`);

    var xAxis = boxplot.append("g")
        .attr("transform", `translate(0, ${boxplotHeight})`)
        .call(d3.axisBottom(x));

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([-1,1])
        .range([boxplotHeight, 0])
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
        .style("width", 40)
        
    xAxis.selectAll("text")	
        .style("text-anchor", "end")
        // .attr("dx", "-.8em")
        // .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)" 
        });

    // rectangle for the main box
    var boxWidth = 10;
    boxplot
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
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
        .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(y(d.value.median))})
        .attr("y2", function(d){return(y(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80);
    
    // Add individual points with jitter
    var jitterWidth = boxWidth * 2;
    
    boxplot
        .selectAll("indPoints")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d){return(x(getSkillNameFn(d)) - jitterWidth/2 + Math.random()*jitterWidth )})
        .attr("cy", function(d){return(y(d.Value))})
        .attr("r", 4)
        .attr("stroke", "black")
        .on("mouseover", function(data) {
            showTooltip(data.Country, `Value: ${data.Value}`);
        })
        .on("mouseleave", function() {
            fadeTooltip();
        })
        .on("click", function(data) {
            displayMapBySkillName(getCategoryNameFn(data), getSkillNameFn(data));
        });
    
    fillCircles();

    // need to put this at the end or the svg overscales
    quads[2].attr("width", boxPlotWidth * boxScale + 50);
}

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