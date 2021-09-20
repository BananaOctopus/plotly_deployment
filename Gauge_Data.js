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
