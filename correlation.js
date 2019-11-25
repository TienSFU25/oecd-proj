function plotCorrelation(svg, country){
    //console.log("helloWorld");

    /*
    * 1. Divide the area into two divs
    * 2. Draw two random sunbeams
    * 3. Revise
    * */

    // Create two lists
    // list1 = [country_skill_p_corr, country_abilities_p_corr, country_knowledge_p_corr, c_W_p_c]
    let listPCorr = [];
    let listNCorr = [];
    let PCorr = {};
    let NCorr = {};
    let orderofSC = [];
    let colorMap={"Skills":"#7cff84", "Abilities":"#fff69a", "Knowledge":"#ff848a", "Workstyles":"#99ccff"};
    let colorArrP = [];
    let colorArrN = [];

    for(c in corrData){
        orderofSC.push(c);
        cs = corrData[c];
        ds = cs[countrySel];
        delete ds[countrySel];

        const getMax = obj => {
            return Object.keys(obj).filter(x => {
                return obj[x] == Math.max.apply(null,
                    Object.values(obj));
            });
        };

        const getMin = obj => {
            return Object.keys(obj).filter(x => {
                return obj[x] == Math.min.apply(null,
                    Object.values(obj));
            });
        };

        let temp = getMax(ds);
        //console.log(temp);
        colorArrP.push(colorMap[c]);
        listPCorr.push(temp);
        PCorr[temp+c] = ds[temp];


        temp = getMin(ds);
        listNCorr.push(temp);
        colorArrN.push(colorMap[c]);
        NCorr[temp+c] = -ds[temp];
    }

    console.log("Order");
    console.log(orderofSC);
    console.log("Positive:corr");
    console.log(listPCorr);
    console.log("Negative:corr");
    console.log(listNCorr);
    console.log("Positive:vals");
    console.log(PCorr);
    console.log("Negative:vals");
    console.log(NCorr)  ;




    // // let mywidth = singleViewWidth;
    // // let myheight = singleViewHeight;
    //
    let width = 600; //singleViewWidth/2;
    let height = 400; //singleViewHeight;
    let margin=30;

    // //var svg1 = svg.attr('height', height)
    // //     .append('g')
    // //     .attr('transform', 'translate(' + ((width/2)-50) +  ',' + height/2 +')');
    // svg = svg
    //     .append("svg")
    //     .append("g")
    //
    // svg.append("g")
    //     .attr("class", "slices");
    // svg.append("g")
    //     .attr("class", "labels");
    // svg.append("g")
    //     .attr("class", "lines");
    //
    // //width = 960,
    // //height = 450,
    // radius = Math.min(width, height) / 2;
    //
    // var pie = d3.pie()
    //     .sort(null)
    //     .value(function(d) {
    //         return d.value;
    //     });
    //
    // var arc = d3.arc()
    //     .outerRadius(radius * 0.8)
    //     .innerRadius(radius * 0.4);
    //
    // var outerArc = d3.arc()
    //     .innerRadius(radius * 0.9)
    //     .outerRadius(radius * 0.9);
    //
    // //svg1.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    //
    // var key = function(d){ return d.data.label; };
    //
    // var color = d3.scaleOrdinal()
    //     .domain(["Abilities", "Knowledge", "Workstyles", "Skills"])
    //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);
    //
    // function randomData (){
    //     var labels = color.domain();
    //     return labels.map(function(label){
    //         return { label: label, value: Math.random() }
    //     });
    // }
    //
    // change(randomData());
    //
    // // d3.select(".randomize")
    // //     .on("click", function(){
    // //         change(randomData());
    // //     });
    //
    //
    // function change(data) {
    //
    //     /* ------- PIE SLICES -------*/
    //     var slice = svg.select(".slices").selectAll("path.slice")
    //         .data(pie(data), key);
    //
    //     slice.enter()
    //         .insert("path")
    //         .style("fill", function(d) { return color(d.data.label); })
    //         .attr("class", "slice");
    //
    //     slice
    //         .transition().duration(1000)
    //         .attrTween("d", function(d) {
    //             this._current = this._current || d;
    //             var interpolate = d3.interpolate(this._current, d);
    //             this._current = interpolate(0);
    //             return function(t) {
    //                 return arc(interpolate(t));
    //             };
    //         })
    //
    //     slice.exit()
    //         .remove();
    //
    //     /* ------- TEXT LABELS -------*/
    //
    //     var text = svg.select(".labels").selectAll("text")
    //         .data(pie(data), key);
    //
    //     text.enter()
    //         .append("text")
    //         .attr("dy", ".35em")
    //         .text(function(d) {
    //             return d.data.label;
    //         });
    //
    //     function midAngle(d){
    //         return d.startAngle + (d.endAngle - d.startAngle)/2;
    //     }
    //
    //     text.transition().duration(1000)
    //         .attrTween("transform", function(d) {
    //             this._current = this._current || d;
    //             var interpolate = d3.interpolate(this._current, d);
    //             this._current = interpolate(0);
    //             return function(t) {
    //                 var d2 = interpolate(t);
    //                 var pos = outerArc.centroid(d2);
    //                 pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
    //                 return "translate("+ pos +")";
    //             };
    //         })
    //         .styleTween("text-anchor", function(d){
    //             this._current = this._current || d;
    //             var interpolate = d3.interpolate(this._current, d);
    //             this._current = interpolate(0);
    //             return function(t) {
    //                 var d2 = interpolate(t);
    //                 return midAngle(d2) < Math.PI ? "start":"end";
    //             };
    //         });
    //
    //     text.exit()
    //         .remove();
    //
    //     /* ------- SLICE TO TEXT POLYLINES -------*/
    //
    //     var polyline = svg.select(".lines").selectAll("polyline")
    //         .data(pie(data), key);
    //
    //     polyline.enter()
    //         .append("polyline");
    //
    //     polyline.transition().duration(1000)
    //         .attrTween("points", function(d){
    //             this._current = this._current || d;
    //             var interpolate = d3.interpolate(this._current, d);
    //             this._current = interpolate(0);
    //             return function(t) {
    //                 var d2 = interpolate(t);
    //                 var pos = outerArc.centroid(d2);
    //                 pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
    //                 return [arc.centroid(d2), outerArc.centroid(d2), pos];
    //             };
    //         });
    //
    //     polyline.exit()
    //         .remove();
    // };



    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin;


    var g = svg.attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + ((width/2)-50) +  ',' + height/2 +')');

    var g2 = svg.attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + ((width/2)+350) +  ',' + height/2 +')');

    // Create dummy data
    //let ccdata = corrData[countrySel];
    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(PCorr)
        .range(colorArrP);

    // Compute the position of each group on the pie:
    var pie1 = d3.pie()
        .value(function(d) {return d.value; });
    var pie2 = d3.pie()
        .value(function(d) {return d.value; });

    var data_ready = pie1(d3.entries(PCorr));
    var data_ready2 = pie2(d3.entries(NCorr));

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    g.selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(110)         // This is the size of the donut hole
            .outerRadius(160)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "blue")
        .style("stroke-width", "1px")
        .style("opacity", 0.7);

    g2.selectAll('whatever')
        .data(data_ready2)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(110)         // This is the size of the donut hole
            .outerRadius(160)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "red")
        .style("stroke-width", "1px")
        .style("opacity", 0.7)



}
