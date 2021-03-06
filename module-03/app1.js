//***********************Band scales for Bar charts**************************

// You can use numeric data as ordinal data if you wish. Instead of using the numbers themselves, you can use their index.
//
// The band width is the distance between number in the band range. D3 provides a function called bandwidth() which will calculate this for you without the padding.
//
// Band scales were made specifically for bar charts so it's recommended you use them.

// see below for info about updating the bar chart

//*************************Mouse Hovers*******************************

// D3 supports all default JavaScript events including clicks and hovers.
//
// The on() function is provided the data and index(in case of arrays) which contains the value to each element in the array.
//
// JavaScript animations and transitions give you more power as opposed to CSS. Use JavaScript if you need that power and flexibility. Otherwise, use CSS.
//
// Set the CSS(style..) property pointer-events to none if you don't want events applied to a certain element.

var data = [{
    key: 0,
    num: 6
  },
  {
    key: 1,
    num: 20
  },
  {
    key: 2,
    num: 14
  },
  {
    key: 3,
    num: 24
  },
  {
    key: 4,
    num: 3
  },
  {
    key: 5,
    num: 7
  },
  {
    key: 6,
    num: 17
  },
  {
    key: 7,
    num: 23
  },
  {
    key: 8,
    num: 2
  },
  {
    key: 9,
    num: 6
  },
  {
    key: 10,
    num: 25
  },
  {
    key: 11,
    num: 11
  },
  {
    key: 12,
    num: 26
  },
  {
    key: 13,
    num: 9
  },
  {
    key: 14,
    num: 12
  }
];

var key = function(d){
  return d.key;
}

// Create SVG element
var chart_width = 800;
var chart_height = 400;
var bar_padding = 5;
var sort_flag = false;

var svg = d3.select('#chart')
  .append('svg')
  .attr('width', chart_width)
  .attr('height', chart_height);

// create scales
// 800/15 =53.33
// 0 - 0; 1 - 53.33
var x_scale = d3.scaleBand()
  .domain(d3.range(data.length))
  .rangeRound([0, chart_width]) // rangeRound to round values
  .paddingInner(0.05);

var y_scale = d3.scaleLinear()
  .domain([0, d3.max(data, function(d){
    return d.num;
  })])
  .range([0, chart_height]);

// Bind data and create bars
svg.selectAll('rect')
  .data(data, key)
  .enter()
  .append('rect')
  .attr("x", function(d,i) {
    return x_scale(i); // 0 - 0, 1 - 30, 2 - 60
  })
  .attr("y", function(d) {
    return chart_height - y_scale(d.num);
  })
  .attr("width", x_scale.bandwidth())
  .attr("height", function(d) {
    return y_scale(d.num);
  })
  .attr('fill', '#7ED26D')
  // .on('mouseover', function(){
  //   d3.select(this)
  //     .transition()
  //     .attr('fill', '#0c9cdf');
  // })
  // .on('mouseout', function(){
  //   d3.select(this)
  //     .transition('change_color_back')
  //     .attr('fill', '#7ed26d')
  // })
  // You can give your transitions names to prevent collisions. This will mean you will have to interrupt animations manually by using the interrupt() function.
  .on('click', function(){
    svg.selectAll('rect')
      .sort(function(a, b){
        return sort_flag ? d3.descending(a.num, b.num) : d3.ascending(a.num, b.num);
      })
      .transition('sort') // optional argument for having diff transition name
      .duration(1000)
      .attr("x", function(d,i) {
        return x_scale(i);
      });

    svg.selectAll('text')
      .sort(function(a, b){
        return sort_flag ? d3.descending(a.num, b.num) : d3.ascending(a.num, b.num);
      })
      .transition()
      .duration(1000)
      .attr("x", function(d, i) {
        return x_scale(i) + (x_scale.bandwidth()) / 2;
      });
      sort_flag = !sort_flag;
  });

// create labels
svg.selectAll('text')
  .data(data, key)
  .enter()
  .append('text')
  .text(function(d) {
    return d.num;
  })
  .attr("x", function(d, i) {
    return x_scale(i) + (x_scale.bandwidth()) / 2;
  })
  .attr("y", function(d) {
    return chart_height - y_scale(d.num) + 15;
  })
  .attr('font-size', '15px')
  .attr('fill', '#fff')
  .attr('text-anchor', 'middle')
  .style('pointer-events', 'none');


//******************************Updating bar chart****************************

// There are 3 situations you'll find yourself in when it comes to updating data. This can be a change in original data, an addition or a removal.
//
// Changes in data usually occur during an event. By default, D3 supports all JavaScript events by using the on() function on a selection.
//
// The reverse() function is a JavaScript array function that will take care of reversing the values in your array.
//
// You can bind your data to the elements again to let D3 be aware of the change. You will have to redraw only the elements affected and only change the attributes that were affected.

//****************************Transitions and Animations***********************

// Applying a transition is as simple as applying the transition() function to your current selection. D3 will take care of animating the attributes for you.
//
// Transitions can only be applied to attributes that currently exist. Otherwise there will be no animation applied.
//
// You can control the duration of your transition by applying the duration() function. The length of time is measured in milliseconds.
//
// You can delay a transition by applying the delay() function. This is also measured in milliseconds. Be careful with your delays as it can be easy to ruin the user experience with long delays and animations.

// If your data changes, then your visualization will not reflect that accurately. You'll need to update the domain before you do anything else. Just call the domain() function again and pass in the new minimum and maximum values


// Events
d3.select('.update').on('click', function() {
  // console.log('Om Namah Shivaya!');
  //data.reverse();
  data[0].num = 50;
  y_scale.domain([0, d3.max(data, function(d){
    return d.num;
  })]); // updating the domain

  svg.selectAll('rect')
    .data(data, key)
    .transition()
    .delay(function(d, i) {
      return i / data.length * 1000;
    })
    .duration(1000)
    .ease(d3.easeCubicInOut)
    .attr("y", function(d) {
      return chart_height - y_scale(d.num);
    })
    .attr("height", function(d) {
      return y_scale(d.num);
    });
  // create labels
  svg.selectAll('text')
    .data(data, key)
    .transition()
    .delay(function(d, i) {
      return i / data.length * 1000;
    })
    .duration(1000) // defaul 250 -- 1/4 of a second
    .ease(d3.easeCubicInOut)
    .text(function(d) {
      return d.num;
    })
    .attr("x", function(d, i) {
      return x_scale(i) + (x_scale.bandwidth()) / 2;
    })
    .attr("y", function(d) {
      return chart_height - y_scale(d.num) + 15;
    })

});

// When you add new data, you need to update your scales domain for the new minimum and maximum values.
//
// The data() function returns a selection. The selection being the elements that have data binded to them.
//
// The elements that have data binded to them and the elements you create after moving them from the waiting room are 2 different selections.
//
// You can merge separate selections by calling the merge() function. This function must be chained after a selection and the selection it will be merged with must be passed into the function.

// Add Data
d3.select('.add').on('click', function() {
  // Add new data
  var new_num = Math.floor(Math.random() * d3.max(data, function(d){
    return d.num;
  }));
  data.push({
    key: data[data.length-1].key+1, num: new_num
  });

  // Update Scales
  x_scale.domain(d3.range(data.length));
  y_scale.domain([0, d3.max(data, function(d) {
    return d.num;
  })]);

  // Select Bars
  var bars = svg.selectAll('rect')
    .data(data, key);

  // Add new bar
  bars.enter()
    .append('rect')
    .attr('x', function(d, i) {
      return x_scale(i);
    })
    .attr('y', chart_height)
    .attr('width', x_scale.bandwidth())
    .attr('height', 0)
    .attr('fill', '#7ED26D')
    .merge(bars)
    .transition()
    .duration(1000)
    .attr("x", function(d, i) {
      return x_scale(i); // 0 - 0, 1 - 30, 2 - 60
    })
    .attr("y", function(d) {
      return chart_height - y_scale(d.num);
    })
    .attr("width", x_scale.bandwidth())
    .attr("height", function(d) {
      return y_scale(d.num);
    })
    .attr('fill', '#7ED26D');

  // Create Labels
  var labels = svg.selectAll('text')
    .data(data, key);

  labels.enter()
    .append('text')
    .text(function(d) {
      return d.num;
    })
    .attr("x", function(d, i) {
      return x_scale(i) + (x_scale.bandwidth()) / 2;
    })
    .attr("y", chart_height)
    .attr('font-size', '15px')
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .merge(labels)
    .transition()
    .duration(1000)
    .attr("x", function(d, i) {
      return x_scale(i) + (x_scale.bandwidth()) / 2;
    })
    .attr("y", function(d) {
      return chart_height - y_scale(d.num) + 15;
    });
});

// D3 has an exit mode which will store references to elements that have no data bound to them. You can call the exit() function loop through these elements.
//
// If you apply the remove() function to a transition, then the function will wait until the transition is finished.
//
// Data joins are the process of binding a value in your data to an element. It's the connection between data in your array and elements on the page.
//
// By default, D3 will use index ordering which means the first value in the array is bound to the first element on the page. So on and so forth.

// Remove Data
d3.select('.remove').on('click', function() {
  // Remove first item
  data.shift();

  // Update Scales
  x_scale.domain(d3.range(data.length));
  y_scale.domain([0, d3.max(data, function(d){
    return d.num;
  })]);

  // Select Bars
  var bars = d3.selectAll('rect').data(data, key);

  // Update Bars
  bars.transition()
    .duration(500)
    .attr("x", function(d, i) {
      return x_scale(i); // 0 - 0, 1 - 30, 2 - 60
    })
    .attr("y", function(d) {
      return chart_height - y_scale(d.num);
    })
    .attr("width", x_scale.bandwidth())
    .attr("height", function(d) {
      return y_scale(d.num);
    })
    .attr('fill', '#7ED26D');

  // Remove Bars
  bars.exit()
    .transition()
    .attr('x', -x_scale.bandwidth())
    .remove();

  // Select Labels
  var labels = d3.selectAll('text').data(data, key);

  // Update Labels
  labels.transition()
    .duration(500)
    .attr('text-anchor', 'start')
    .attr("x", function(d, i) {
      return x_scale(i) + (x_scale.bandwidth()) / 2;
    })
    .attr("y", function(d) {
      return chart_height - y_scale(d.num) + 15;
    });

  // Remove labels
  labels.exit()
    .transition()
    .attr('x', -x_scale.bandwidth())
    .remove();




});
