// Define the div for the tooltip
const tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0)
    .style("left", "0px")		
    .style("top", "0px");	

const showTooltip = (line1, line2) => {
    tooltip.transition()		
        .duration(200)		
        .style("opacity", .9);

    const tooltipHtml = `<div>
        <div>${line1}</div>
        <div>${line2}</div>
        </div>`;

    tooltip.html(tooltipHtml)
    moveTooltipToCursor();
};

const fadeTooltip = () => {
    tooltip.transition()		
        .duration(500)		
        .style("opacity", 0);
};

const moveTooltipToCursor = () => {
    tooltip.style("left", (d3.event.pageX) + "px")		
    .style("top", (d3.event.pageY) + "px");	
}