
var countries  = ['Austria', 'Australia','Belgium', 'Czech Republic','Canada', 'France', 'Denmark', 'Finland', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Luxembourg', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Poland', 'Portugal', 'Slovak Republic', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'United Kingdom', 'United States', 'Argentina', 'Brazil', 'Bulgaria', 'Chile', 'Cyprus', 'Estonia', 'Latvia', 'Lithuania', 'Peru', 'Romania', 'Slovenia', 'South Africa'];//, 'Malaysia'];
var _cdata;
var corrData;
var cdata =[];
var countrySel;
window.onload = function(){

    //console.log("Create a global variable named \"_data\"");
    //loadMapData("world-110m2.json");
    //loadSkillData('SKILLS_2018_TOTAL_25102019044734209.csv');
    //loadSkillData(skillsDataLoc);
    //loadSkillData('parsed_skills_data.json');
    loadSkillData('https://raw.githubusercontent.com/TienSFU25/oecd-proj/master/parsed_skills_data.json');
    //loadCorrelationData('parsed_corr_data.json');
    loadCorrelationData('https://raw.githubusercontent.com/TienSFU25/oecd-proj/master/parsed_corr_data.json');
    //createDropDown("#dropdown");
};

function loadCorrelationData(path){
    d3.json(path).then(
        function(dat){
            corrData=dat;
        }
    )

}

function loadSkillData(path) {
    d3.json(path).then(
        function (data) {
            cdata = data;
        }
    );
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
        //console.log(countries[val]);
    }
    document.querySelector(div_id).appendChild(select);

    document.getElementById("viz-2-select").addEventListener("change", function (sel){
        let currentC = sel.srcElement.value;
        //console.log(currentC);
        let curCatData = cdata[currentSelectedCategory];
        //console.log(curCatData);
        //console.log(curCatData[currentC]);
        //console.log(cdata[currentC]);
        //countrySel = currentC;
        updateBarPlot(currentC, curCatData[currentC]);
    })
}

function updateBarPlot(country, xdata){
    let newData=[];
    countrySel = country;
    for (dd in xdata){
        //console.log(dd);
        newData.push({key:dd, value:xdata[dd]});
    }
    let mywidth = singleViewWidth    ;
    let myheight = singleViewHeight;
    console.log("XXXXXXXXXXXXXXX");
    console.log(mywidth);
    console.log(myheight);


    //console.log("HHHHHHHHHHHHH");
    let numBARS = Object.keys(newData).length;
    if (numBARS*24 < 550){
        w = numBARS*24+12;
    }
    else{
        w = 1000;
    }
    var margin = {top: 0, right: 0, bottom: 200, left: 50},
        width = w - margin.left - margin.right,
        height = myheight + margin.top - margin.bottom;

    // let svg=d3.select("#lineplot");
    //let svg=d3.select("#lineplot");
    let svg = quads[1];

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    svg.selectAll("*").remove();

    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add x axis
    var x = d3.scaleBand()
        .domain(d3.map(xdata).keys())
        .rangeRound([margin.left, width])
        .padding(0.1);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "lineplot-axis")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 8)
        .attr("x", 10)
        .attr("dy", ".5em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    function getMax(data) {
        let max = 0;
        //let keys = Object.keys(data);
        for (k in data){
            console.log('k');
            console.log(k);
            console.log('val');
            console.log(data[k].value);
            if(data[k].value > max){
                max = data[k].value;
            }
        }
        return max;
    }

    function getMin(data) {
        let min = 0;
        //keys = Object.keys(data);
        for (k in data){
            console.log('k');
            console.log(k);
            console.log('val');
            console.log(data[k].value);
            if(data[k].value < min){
                min = data[k].value;
            }
        }
        return min;
    }

    let Lmin = getMin(newData)*1.1;
    let Lmax = getMax(newData)*1.1;


    console.log(newData);
    console.log("VVVVVVVV");
    console.log(Lmin);
    console.log(Lmax);
    // Add Y axis
    var y = d3.scaleLinear()
        .domain([Lmin, Lmax])
        .range([height, 10]);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));

    //console.log("DEBUG:");
    //console.log(xdata);

    // Add the line
    svg.append("path")
        .datum(newData)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
            .x(function(d) {
                return x(d.key); })
            .y(function(d) {
                //console.log(y(1));
                return y(1); })
        );

    // Add the green regions
    svg.append("path")
        .datum(newData)
        .attr("fill", function(d,i){
            //let v = parseFloat(d.value);
            let v = 0.55;
            //console.log(d);
            if(v>=0.5){return '#BFB';}else{return '#FBB';}
        })
        .attr("stroke", "none")
        .attr("stroke-width", 1)
        .attr("d", d3.area()
            .x(function(d,i) { return x(d.key) })
            .y0(function(d) { return y(0) })
            .y1(function(d) { if (d.value>0) {return y(d.value)}else{return y(0)} })
        );
    //
    // Add the red regions
    svg.append("path")
        .datum(newData)
        .attr("fill", function(d,i){
            //let v = parseFloat(d.value);
            let v = 0.55;
            //console.log(d);
            if(v>=0.5){return '#FBB';}else{return '#BFB';}
        })
        .attr("stroke", "none")
        .attr("stroke-width", 1)
        .attr("d", d3.area()
            .x(function(d,i) { return x(d.key) })
            .y0(function(d) { return y(0) })
            .y1(function(d) { if (d.value<0) {return y(d.value)}else{return y(0)} })
        );

    svg.append('g')
        .selectAll("dot")
        .data(newData)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.key); } )
        .attr("cy", function (d) { return y(d.value); } )
        .attr("r", 2.0)
        .style("fill", "orange");

    svg.selectAll("rect").data(newData)
        .enter()
        .append("rect")
        .attr("x",function(d,i){
            //d is the object
            //i is the index
            //  console.log(i);
            return x(d.key)-(0.5*width/newData.length); })
        .attr("y", function(d,i){
            let u = y(0); let v = y(d.value);
            if(u>v)
                return v;
            else
                return u;

        })
        .attr("width", width/newData.length)
        .attr("height", function(d,i){
            let u = y(0); let v = y(d.value);
            if(u>v)
                return u-v;
            else
                return v-u;
        })
        .attr("fill",'white')
        .attr('opacity', '0.3')
        .on("mouseover", function(d,i){
            //console.log("Mouse over");
            //console.log(d['Country']);
            //console.log(d);
            let thise = d3.select(this);
            thise.transition()
                .duration('50')
                .attr('opacity', '.8');

            return tooltip.style("visibility", "visible").text(d.key);
        })
        .on('mousemove', function(){
            return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
        })
        .on('mouseout', function(d,i){
            //console.log("Bye from ");
            let thise=d3.select(this);
            thise.transition()
                .duration('50')
                .attr('opacity', '0.3');
            return tooltip.style("visibility", "hidden");
        })
        .on("click", function(d){
            console.log(d);
            console.log(currentSelectedCategory)
        });



    // Call the function for donut plot
    /* For the selected country the doughnut plot essentially show which other countries have similar/dis-similar
    * attributes for skill categories */
    let div_id = quads[3];
    plotCorrelation(div_id, countrySel);

}

