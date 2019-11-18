// Define the div for the tooltip
const tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

const showTooltip = (line1, line2) => {
    tooltip.transition()		
        .duration(200)		
        .style("opacity", .9);

    const tooltipHtml = `<div>
        <div>${line1}</div>
        <div>${line2}</div>
        </div>`;

    tooltip.html(tooltipHtml)
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY) + "px");	
};

const fadeTooltip = () => {
    tooltip.transition()		
        .duration(500)		
        .style("opacity", 0);
};