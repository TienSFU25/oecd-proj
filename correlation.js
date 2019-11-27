function plotCorrelation(svg, countrySel){
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
        PCorr[temp+" \n"+c] = ds[temp];


        temp = getMin(ds);
        listNCorr.push(temp);
        colorArrN.push(colorMap[c]);
        NCorr[temp+" \n"+c] = -ds[temp];
    }

    // console.log("Order");
    // console.log(orderofSC);
    // console.log("Positive:corr");
    // console.log(listPCorr);
    // console.log("Negative:corr");
    // console.log(listNCorr);
    // console.log("Positive:vals");
    // console.log(PCorr);
    // console.log("Negative:vals");
    // console.log(NCorr)  ;





    let width = singleViewWidth;
    let height = singleViewHeight;
    let margin=30;


    svg.selectAll("*").remove();
    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - 2*margin;


    var g = svg.attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + ((width/4)) +  ',' + height/2 +')');

    var g2 = svg.attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + ((3*width/4)) +  ',' + height/2 +')');

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
    var arcs1 = g.selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(height*0.10)         // This is the size of the donut hole
            .outerRadius(height*0.34)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "blue")
        .on("mouseover", function(d, i) {
            showTooltip(d.data.key.split(' ')[0], ``); 
        })
        .on("mousemove", function(){
            moveTooltipToCursor();
        })
        .on("mouseout", function (d,i) {
            fadeTooltip();
        });
        // .style("stroke-width", "1px")
        // .style("opacity", 0.7);

    var arcs2 = g2.selectAll('whatever')
        .data(data_ready2)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(height*0.10)         // This is the size of the donut hole
            .outerRadius(height*0.34)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "red")
        .on("mouseover", function(d, i) {
            showTooltip(d.data.key.split(' ')[0], ``); 
        })
        .on("mousemove", function(){
            moveTooltipToCursor();
        })
        .on("mouseout", function (d,i) {
            fadeTooltip();
        });

        arcs2.append("text").text("HELLO");
        // .style("stroke-width", "1px")
        // .style("opacity", 0.7);


   // let colorMap={"Skills":"#7cff84", "Abilities":"#fff69a", "Knowledge":"#ff848a", "Workstyles":"#99ccff"};



    svg.append("rect")
        .attr("x",width/2-20)
        .attr("y", height*0.2)
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill",'#7cff84')
        .attr('opacity', '0.8');

    svg.append("rect")
        .attr("x",width/2-20)
        .attr("y", height*0.2 + 70)
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill",'#fff69a')
        .attr('opacity', '0.8');

    svg.append("rect")
        .attr("x",width/2-20)
        .attr("y", height*0.2 + 140)
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill",'#ff848a')
        .attr('opacity', '0.8');

    svg.append("rect")
        .attr("x",width/2-20)
        .attr("y", height*0.2 + 210)
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill",'#99ccff')
        .attr('opacity', '0.8');

    svg.append("text")
        .attr("x",width/2-20)
        .attr("y", height*0.2-10)
        .attr("dy", ".35em")
        .text("Skills");

    svg.append("text")
        .attr("x",width/2-20)
        .attr("y", height*0.2 + 60)
        .attr("dy", ".35em")
        .text("Abilities");

    svg.append("text")
        .attr("x",width/2-20)
        .attr("y", height*0.2 + 130)
        .attr("dy", ".35em")
        .text("Knowledge");

    svg.append("text")
        .attr("x",width/2-20)
        .attr("y", height*0.2 + 200)
        .attr("dy", ".35em")
        .text("Workstyles");



    svg.append("text")
        .attr("x", width/4-70)
        .attr("y", height*0.9 )
        .attr("dy", ".35em")
        .text("Positively Correlated");

    svg.append("text")
        .attr("x", 3*width/4-70)
        .attr("y", height*0.9 )
        .attr("dy", ".35em")
        .text("Negatively Correlated");



    // const annotations = [
    //     {
    //         note: {
    //             label: "Here is the annotation label",
    //             title: "Annotation title"
    //         },
    //         x: width/2,
    //         y: height*0.2,
    //         dy: 50,
    //         dx: 50
    //     }
    // ]
    //
    // const makeAnnotations = d3.annotation()
    //     .annotations(annotations)
    // svg.append("g").call(makeAnnotations)
        // arcs1.on("mouseover", function(d,i){
        //     //console.log("Mouse over");
        //     //console.log(d['Country']);
        //     let thise = d3.select(this);
        //     thise.transition()
        //         .duration('50')
        //         .attr('opacity', '.8');
        // })
        // .on('mouseout', function(d,i){
        //     //console.log("Bye from ");
        //     let thise=d3.select(this);
        //     thise.transition()
        //         .duration('50')
        //         .attr('opacity', '0.3');
        //
        // });

    // arcs.append("svg:text")                                     //add a label to each slice
    //     .attr("transform", function(d) {                    //set the label's origin to the center of the arc
    //         //we have to make sure to set these before calling arc.centroid
    //         d.innerRadius = 0;
    //         d.outerRadius = r;
    //         return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
    //     })
    //     .attr("text-anchor", "middle")                          //center the text on it's origin
    //     .text(function(d, i) { return data[i].label; });


}

