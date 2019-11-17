// Define the div for the tooltip
const tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

const updateTooltip = (polygon) => {	
    const tooltipHtml = `<div>
        <div>${polygon.properties.name}</div>
        <div>Population: ${polygon.total}</div>
        </div>`;

//     const tooltipHtml = `<svg>
//     <rect width="300" height="100" class="tooltip"></rect>
//     <circle cx="60" cy="35" r="30"></circle>
//   </svg>`;

    tooltip.html(tooltipHtml)
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY) + "px");	
};