var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

var color = d3.scale.category10();

function create_svg(selector) {
  return d3.select(selector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function x_axis(svg, xAxis, height, width) {
  return svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end");
}

function y_axis(svg, yAxis) {
  return svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
}

function plot_dots(svg, data, r, cx, cy, fill) {
  return svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", r)
      .attr("cx", cx)
      .attr("cy", cy)
      .style("fill", fill);
}

function type(d) {
  d.hourlyRate = +d.hourlyRate;
  d.monthBilledHours = +d.monthBilledHours;
  d.experience = +d.experience;
  d.holidayWeeks = +d.holidayWeeks;
  return d;
}

(function() {
  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x.domain([0, 6]))
      .tickValues([0, 1, 2, 3, 4, 5])
      .tickFormat(function (d) { return d; })
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .tickValues([0, 25, 50, 75, 100, 125, 150])
      .orient("left");

  var svg = create_svg("#houly_rate_by_experience_chart");

  d3.tsv("/data/french_freelance_ruby_on_rails.tsv", type, function(error, data) {
    var tuples = {};
    var max_r = 0;
    var tuple_selector = function(d) {
      return d.experience + "-" + d.hourlyRate;
    }
    data.forEach(function(d) {
      var key = tuple_selector(d);
      if (tuples[key]) {
        tuples[key] += 1;
      } else {
        tuples[key] = 1;
      }
      max_r = Math.max(max_r, tuples[key]);
    });

    var r = d3.scale.linear()
              .domain([1, max_r])
              .range([3, 15]);

    y.domain(d3.extent(data, function(d) { return d.hourlyRate; })).nice();

    x_axis(svg, xAxis, height, width)
      .text("Expérience (années)");

    y_axis(svg, yAxis)
      .text("Taux horaire (€)");

    var vLineY = height * 4.0 / 7 + 3;
    svg.selectAll(".vline").data(d3.range(26)).enter()
      .append("line")
      .attr("y1", vLineY)
      .attr("y2", vLineY)
      .attr("x1", 0)
      .attr("x2", width)
      .style("stroke", "#eee")
      .style("shape-rendering", "crispEdges");

    plot_dots(svg, data,
      function(d) { return r(tuples[tuple_selector(d)]); },
      function(d) { return x(d.experience); },
      function(d) { return y(d.hourlyRate); },
      function(d) { return color(d.hourlyRate >= 75); });
  });
})();

(function() {
  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x.domain([0, 180]))
      .ticks(9)
      .tickFormat(function (d) { return d; })
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y.domain([0, 6]))
      .tickValues([0, 1, 2, 3, 4, 5, "6+"])
      .tickFormat(function (d) { return d; })
      .orient("left");

  var svg = create_svg("#work_load");

  d3.tsv("/data/french_freelance_ruby_on_rails.tsv", type, function(error, data) {
    var tuples = {};
    var max_r = 0;
    var tuple_selector = function(d) {
      return d.monthBilledHours + "-" + d.holidayWeeks;
    }

    data.forEach(function(d) {
      var key = tuple_selector(d);

      if (tuples[key]) {
        tuples[key] += 1;
      } else {
        tuples[key] = 1;
      }
      max_r = Math.max(max_r, tuples[key]);
    });

    var r = d3.scale.linear()
              .domain([1, max_r])
              .range([3, 15]);

    x_axis(svg, xAxis, height, width)
      .text("Volume mensuel facturé (heures)");

    y_axis(svg, yAxis)
      .text("Congés (semaines)")

    plot_dots(svg, data,
      function(d) { return r(tuples[tuple_selector(d)]); },
      function(d) { return x(d.monthBilledHours); },
      function(d) { return y(d.holidayWeeks); },
      "green");
  });
})();

(function() {
  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x.domain([0, 180]))
      .ticks(9)
      .tickFormat(function (d) { return d; })
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .tickValues([0, 25, 50, 75, 100, 125, 150])
      .orient("left");

  var svg = create_svg("#quality_or_quantity");

  d3.tsv("/data/french_freelance_ruby_on_rails.tsv", type, function(error, data) {
    var tuples = {};
    var max_r = 0;
    var tuple_selector = function(d) {
      return d.monthBilledHours + "-" + d.hourlyRate;
    }

    data.forEach(function(d) {
      var key = tuple_selector(d);

      if (tuples[key]) {
        tuples[key] += 1;
      } else {
        tuples[key] = 1;
      }
      max_r = Math.max(max_r, tuples[key]);
    });

    var r = d3.scale.linear()
              .domain([1, max_r])
              .range([3, 15]);

    y.domain(d3.extent(data, function(d) { return d.hourlyRate; })).nice();

    x_axis(svg, xAxis, height, width)
      .text("Volume mensuel facturé (heures)");

    y_axis(svg, yAxis)
      .text("Taux horaire (€)")

    plot_dots(svg, data,
      function(d) { return r(tuples[tuple_selector(d)]); },
      function(d) { return x(d.monthBilledHours); },
      function(d) { return y(d.hourlyRate); },
      function(d) { return color(d.hourlyRate >= 75); });
  });
})();

(function() {
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = create_svg("#forfait_taux_horaire");
  // Title
  svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Part de projets facturés au forfait");

  d3.tsv("/data/french_freelance_ruby_on_rails.tsv", type, function(error, data) {

    var aggregated = d3.nest()
                   .key(function(d) { return d.fixedPriceRatio })
                   .rollup(function(d) { return d3.sum(d, function(e) { return 1 }); })
                   .entries(data)
                   .map(function(d) { return {fixedPriceRatio: d.key, frequency: d.values}; })
                   .sort(function(a, b) { return d3.ascending(a.fixedPriceRatio, b.fixedPriceRatio); });

    x.domain(aggregated.map(function(d) { return d.fixedPriceRatio; }));
    y.domain([0, d3.max(aggregated, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(aggregated)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.fixedPriceRatio); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); });
  });


})();

(function() {
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = create_svg("#panel_strucure_juridique");
  // Title
  svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "16px");

  d3.tsv("/data/french_freelance_ruby_on_rails.tsv", function(error, data) {

    var aggregated = d3.nest()
                   .key(function(d) { return d.companyForm })
                   .rollup(function(d) { return d3.sum(d, function(e) { return 1 }); })
                   .entries(data)
                   .map(function(d) { return {companyForm: d.key, frequency: d.values}; })
                   .sort(function(a, b) { return d3.ascending(a.companyForm, b.companyForm); });

    x.domain(aggregated.map(function(d) { return d.companyForm; }));
    y.domain([0, d3.max(aggregated, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(aggregated)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.companyForm); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); });
  });


})();