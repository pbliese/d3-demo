//main.js

//execute script when window is loaded

window.onload = function(){ ////The function the entire map is contained in. Loads the entire map
    //SVG dimension variables
    var w = 900, h = 500; ////Set values for container attributes about to be defined
    var container = d3.select("body") //get the <body> element from the DOM ////create container
        .append("svg") //put a new svg in the body
        .attr("width", w) //assign the width
        .attr("height", h) //assign the height ////define the container attributes with aftermentioned variables
        .attr("class", "container") //always assign a class (as the block name) for styling and future selection
        .style("background-color", "rgba(0,0,0,0.2)"); //only put a semicolon at the end of the block!

        //innerRect block
    var innerRect = container.append("rect") //put a new rect in the svg
        .datum(400) ////create rectangle to add to the container, define attributes
        .attr("width", function(d){ //rectangle width
            return d * 2; //400 * 2 = 800
        }) 
        .attr("height", function(d){ //rectangle height ////Width and height have to be different since it's a rectangle, so functions to keep sides proportional
            return d; //400
        })
        .attr("class", "innerRect") //class name
        .attr("x", 50) //position from left on the x (horizontal) axis
        .attr("y", 50) //position from top on the y (vertical) axis
        .style("fill", "#FFFFFF"); //fill color

        var cityPop = [ ////create city variables to be drawn as circles
            { 
                city: 'Saint Louis',
                population: 308626
            },
            {
                city: 'Fort Collins',
                population: 165080
            },
            {
                city: 'Seattle',
                population: 724745 
            },
            {
                city: 'New Orleans',
                population: 393292
            }
        ];
        var x = d3.scaleLinear() //create the scale ////Variable to be used with scaling
        .range([90, 720]) //output min and max
        .domain([0, 3]); //input min and max ////Scales for x axis
        //find the minimum value of the array
        var minPop = d3.min(cityPop, function(d){ ////Get min population from values
            return d.population;
        });

        //find the maximum value of the array
        var maxPop = d3.max(cityPop, function(d){ ////Get max pop from variable data
            return d.population;
        });

        //scale for circles center y coordinate
        var y = d3.scaleLinear() ////Create scale for y axis
        .range([450, 50]) //was 440, 95
        .domain([0, 900000]); //was minPop, maxPop ////Set value to accommodate full range of population

        //color scale generator 
        var color = d3.scaleLinear()////colors for min and max pop values
        .range([
            "#FDBE85",
            "#D94701"
        ])
        .domain([
            minPop, 
            maxPop
        ]);

        //Example 2.6 line 3
        var circles = container.selectAll(".circles") //create an empty selection ////cicles variable to be filled with population circles
            .data(cityPop) //here we feed in an array
            .enter() //one of the great mysteries of the universe
            .append("circle") //inspect the HTML--holy crap, there's some circles there ////Append the circles to the container
            .attr("class", "circles") 
            .attr("id", function(d){
                return d.city;
            })
            .attr("r", function(d){
                //calculate the radius based on population value as circle area
                var area = d.population * 0.01;
                return Math.sqrt(area/Math.PI);////return the radius for the circles, based on pop data
            })
            .attr("cx", function(d, i){
            //use the scale generator with the index to place each circle horizontally
            return x(i); ////Place the circles based on their position in the array
        })
            .attr("cy", function(d){
                return y(d.population); ////Set circle at y coordinate based on pop value
            })
            .style("fill", function(d, i){ //add a fill based on the color scale generator
                return color(d.population);
            })
            .style("stroke", "#000"); //black circle stroke ////Style the circles for easier viewing, border them
            
        var yAxis = d3.axisLeft(y); ////Create Y axis for understanding on pop values
        //create axis g element and add axis
        var axis = container.append("g")
        .attr("class", "axis")////Set attributes for axis, append to container
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

        var title = container.append("text")////Create title for graph, set attributes
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("x", 450)
        .attr("y", 30)
        .text("City Populations");

        var labels = container.selectAll(".labels")////Set labels for circles
        .data(cityPop)
        .enter()
        .append("text")
        .attr("class", "labels")////Append city names and pop values to circles
        .attr("text-anchor", "left")
        .attr("y", function(d){
            //vertical position centered on each circle
            return y(d.population);
        });

    //first line of label
    var nameLine = labels.append("tspan")////Create city names here
        .attr("class", "nameLine")
        .attr("x", function(d,i){
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .text(function(d){
            return d.city;
        });

    //create format generator
    var format = d3.format(",");////Add commas to pop values for easier reading

    //Example 3.16 line 1...second line of label
    var popLine = labels.append("tspan")////Create population label, append to label variable
        .attr("class", "popLine")
        .attr("x", function(d,i){
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .attr("dy", "15") //vertical offset
        .text(function(d){//// Format pop line so it has identification as population
            return "Pop. " + format(d.population); //use format generator to format numbers
        });
};