//Build function to read json file using d3
function buildMetaData(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);

  // Filter the data
  var buildingArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var result = buildingArray[0];
  // Use d3 to select the required panel
  var panelData = d3.select("#sample-metadata");

  // Clear the existing data in the html
  panelData.html("");

  // Use `Object.entries` to add each key and value pair to the panelData
  Object.entries(result).forEach(([key, value]) => {
    panelData.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
});
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var sampleData = data.samples;
    var buildingArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    var result = buildingArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Build a Bubble Chart
  var bubbleChart = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleChart);
    
    //Create a horizontal bar chart
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var chartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, chartLayout);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selectDropdown = d3.select("#selDataset");

  // Populate the select options by using the list of sample names
  d3.json("samples.json").then((data) => {
    var name = data.names;

    name.forEach((sample) => {
      selectDropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    })

    // Use the sample data from the list to build the plots
    var sampleData = name[0];
    buildCharts(sampleData);
    buildMetaData(sampleData);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetaData(newSample);
};

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var filters = metadata.filter((sampleObj) => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var results = filters[0];

    // 3. Create a variable that holds the washing frequency.
    var washFrequency = results.wfreq;
    console.log(washFrequency);   

    // 4. Create the trace for the gauge chart.
    var gaugeData = {

      title: { text: "Bellybutton Washing Frequency" },
      value: parseFloat(washFrequency),
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 10], tickwidth: 2, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" },
        ],
      },
    };
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      hovermode: "closest",
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("plotAreagauge", [gaugeData], gaugeLayout);
  });
}
// Initialize the dashboard
init()