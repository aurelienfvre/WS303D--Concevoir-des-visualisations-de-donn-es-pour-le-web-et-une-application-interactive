const width = 800;
const height = 600;

const svg = d3.select("#map-population").attr("width", width).attr("height", height);

const projection = d3
  .geoConicConformal()
  .center([2.454071, 46.279229])
  .scale(2600)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

let currentPath = null;
let regionData = {};

// Sélectionnez le tooltip
const tooltip = d3.select("#tooltip-population");

// Chargez le fichier GeoJSON
d3.json("carte.geojson").then(function (geojson) {
  // Chargez le deuxième fichier JSON avec les données de population
  d3.json("population.json").then(function (data) {
    // Associez les données au code de région
    data.forEach((regionDataItem) => {
      regionData[regionDataItem.region] = regionDataItem;
    });

    // Créez une échelle de couleurs en fonction de la population
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([
        d3.min(data, d => d.population),
        d3.max(data, d => d.population)
      ]);

    svg
      .selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "black") // Couleur du trait au survol
      .attr("stroke-width", 0.5) // Épaisseur du trait au survol
      .attr("fill", d => colorScale(regionData[d.properties.name].population))
      .on("mouseover", function (event, d) {
        d3.select(this)
          .classed("highlighted", true);
        regionDataItem = regionData[d.properties.name];
        showData(regionDataItem, event);
      })
      .on("mouseout", function () {
        d3.select(this)
          .classed("highlighted", false);
        hideData();
      });
  });
});

function showData(data, event) {
  // Affiche les données spécifiques à l'emplacement du curseur
  tooltip.style("display", "block");
  if (data) {
    tooltip.html(
      `<strong>Région : </strong>${data.region}<br>` +
        `<strong>Population : </strong>${data.population}<br>`
    );

    // Obtenez les coordonnées du curseur par rapport au #map-container
    const [x, y] = d3.pointer(event, d3.select("#map-container-population").node());

    // Positionnez le tooltip en conséquence
    tooltip.style("left", x + "px");
    tooltip.style("top", y + "px");
  } else {
    tooltip.html("Données non disponibles");
  }
}

function hideData() {
  // Masque les données lorsque le curseur quitte la région
  tooltip.style("display", "none");
}
