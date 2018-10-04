function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  
  // Use `d3.json` to fetch the metadata for a sample
  
  /* data route */
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample) {

  console.log(sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    var select_list = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    select_list .html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample).forEach(([key, value]) => {
      var cell = select_list.append("p");
      cell.text(`${key}: ${value}`);
      cell.append("br");
      });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
});
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(respones) {

  console.log(respones);

  var otu_ids = respones.otu_ids;
  console.log(otu_ids);
  var sample_values = respones.sample_values;
  var otu_labels = respones.otu_labels;
    // @TODO: Build a Bubble Chart using the sample data
  var trace0 = [{
    x:otu_ids,
    y:sample_values,
    text:otu_labels,
    mode: 'markers',
    marker:{
      size:sample_values,
      color:otu_ids
    }
  }];

  Plotly.newPlot("bubble",trace0);

    // @TODO: Build a Pie Chart
  var trace1 = {type:"pie",
  labels:otu_ids.slice(0,10),
  values:sample_values.slice(0,10),
  hovertext:otu_labels.slice(0,10)};
  
  var data = [trace1]
  Plotly.newPlot("pie",data);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
