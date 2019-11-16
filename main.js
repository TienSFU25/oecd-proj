
var countries  = ['Austria', 'Austrailia','Belgium', 'Czech Republic','Canada', 'France', 'Denmark', 'Finland', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Luxembourg', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Poland', 'Portugal', 'Slovak Republic', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'United Kingdom', 'United States', 'Argentina', 'Brazil', 'Bulgaria', 'Chile', 'Cyprus', 'Estonia', 'Latvia', 'Lithuania', 'Peru', 'Romania', 'Slovenia', 'South Africa', 'Malaysia'];
var _cdata;
var cdata ={};
window.onload = function(){

    //console.log("Create a global variable named \"_data\"");
    //loadMapData("world-110m2.json");
    loadSkillData('SKILLS_2018_TOTAL_25102019044734209.csv');
    createDropDown("#float_bottom");
};

function loadSkillData(path){
    d3.csv(path).then(
        function(data){
            _cdata  = data;

            console.log("skills data loaded");
            for(let row in _cdata){
               let c = _cdata[row]['Country'];

               let sk = _cdata[row]['Skills']
               let value = _cdata[row]['Value']

               if(!(c in cdata)){
                   cdata[c]=[{ key: sk, value : value}]
               }else{
                   cdata[c].push({ key: sk, value : value})
               }

            }
        }
    )
}

function createDropDown(div_id){
    console.log("Executing");

    let select = document.createElement("select");
    select.id = "viz-2-select";


    for(let val in countries) {
        //var option = document.createElement("option");
        let opt = new Option( countries[val] );
        opt.value = countries[val];
        opt.id="country_select";
        select.options.add(  opt );
        console.log(countries[val], countries[val]);
    }
    document.querySelector(div_id).appendChild(select);


    document.getElementById("viz-2-select").addEventListener("change", function (sel){
        let currentC = sel.srcElement.value;
        console.log(currentC);
        //console.log(cdata[currentC]);
        updateBarPlot(currentC, cdata[currentC]);
    })
}

function updateBarPlot(country, data){

    //// get the skills data for the country selected
    // already read in _cdata;

    //// plot the skill data as a point
    // set the dimensions and margins of the graph
    mywidth = $("#lineplot").width();
    myheight = $("#lineplot").height();
    console.log("XXXXXXXXXXXXXXX");
    console.log(mywidth);
    console.log(myheight);
    var margin = {top: 0, right: 0, bottom: 180, left: 0},
        width = 2200 - margin.left - margin.right,
        height = myheight - margin.top - margin.bottom;


    // let svg=d3.select("#lineplot");
    let svg=d3.select("#lineplot");
    svg.selectAll("*").remove();
    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // Add x axis
    var x = d3.scaleBand()
        .domain(data.map( function(d,i) {
            return d.key; }))
        .rangeRound([20, width])
        .padding(0.1);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([-1, 1])
        .range([height, 10]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d,i) { return x(d.key) })
            .y(function(d,i) { return y(d.value) })
        );

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
            .x(function(d,i) { return x(d.key) })
            .y(function(d,i) { return y(1) })
        );

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
            .x(function(d,i) { return x(d.key) })
            .y(function(d,i) { return y(0) })
        );
    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
            .x(function(d,i) { return x(d.key) })
            .y(function(d,i) { return y(-1) })
        );




}