let chart;
const ctx = document.getElementById("linechart2").getContext("2d");
let jsonData;
let selectedYears = ["2023"]; // Sélectionnez l'année 2023 par défaut
const colors = ["#41de6e", "#84c396", "#67bcc6", "#217eb8"];

function createChart() {
  // Mise à jour du titre en fonction des années sélectionnées
  const title = `Évolution du nombre de voitures électriques (${selectedYears.join(
    ", "
  )}) en France`;
  document.querySelector(".titre").textContent = title;

  const datasets = selectedYears.map((selectedYear) => {
    const data = jsonData.find((item) => item.annee === selectedYear);
    return {
      label: `Nombre de voitures électriques en ${selectedYear} en France`,
      data: data.mois.map((month) => month.valeur),
      borderColor: colors[parseInt(selectedYear) - 2020],
      borderWidth: 1,
      fill: false,
    };
  });

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: jsonData[0].mois.map((month) => month.mois),
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Mois",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Nombre de voitures électriques",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
        legend: {
          display: true,
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
      },
    },
  });

  setActiveButton();
}

function setActiveButton() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    const year = button.getAttribute("data-year");
    if (selectedYears.includes(year)) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const year = event.target.getAttribute("data-year");
    const yearIndex = selectedYears.indexOf(year);
    if (yearIndex === -1) {
      selectedYears.push(year);
    } else {
      selectedYears.splice(yearIndex, 1);
    }

    createChart();
  });
});

fetch("annee.json")
  .then((response) => response.json())
  .then((data) => {
    jsonData = data;
    createChart();
  })
  .catch((error) =>
    console.error("Erreur de chargement des données JSON", error)
  );

// Charger les données JSON
$.getJSON("annee.json", function (data) {
  var tableBody = $("table.data-table__line tbody");

  // Parcourir les données et les insérer dans le tableau
  for (var i = 0; i < data.length; i++) {
    var anneeData = data[i];
    var annee = anneeData.annee;

    // Créer une nouvelle ligne pour le tableau
    var newRow = $("<tr>");
    newRow.append("<td>" + annee + "</td>");

    // Le nombre de voitures électriques est la somme des valeurs de chaque mois de cette année
    var nombreVoituresElectriques = 0;
    for (var j = 0; j < anneeData.mois.length; j++) {
      nombreVoituresElectriques += anneeData.mois[j].valeur;
    }
    newRow.append("<td>" + nombreVoituresElectriques + "</td>");

    // Ajouter la nouvelle ligne au tableau
    tableBody.append(newRow);
  }
});
// Utilisez fetch pour charger le JSON
fetch("secteur.json")
  .then((response) => response.json())
  .then((jsonData) => {
    const data = jsonData.data;
    const options = jsonData.options;

    const config = {
      type: "bar",
      data: data,
      options: options,
    };

    var myChart = new Chart(document.getElementById("barchart"), config);
  })
  .catch((error) =>
    console.error("Erreur de chargement du fichier JSON:", error)
  );

// Utilisez fetch pour charger le JSON
fetch("projection.json")
  .then((response) => response.json())
  .then((jsonData) => {
    const data = jsonData;

    // Créez un tableau de labels d'années à partir des données JSON
    const years = data.map((item) => item.annee);

    // Créez un tableau de données pour chaque scénario
    const scenarioBasData = data.map((item) => item.scenario_bas);
    const scenarioMedianData = data.map((item) => item.scenario_median);
    const scenarioHautData = data.map((item) => item.scenario_haut);

    // Ne pas inclure la courbe "Réalisé" pour les années après 2023
    const realiseData = data.map((item) =>
      item.annee <= "2023" ? item.realise : null
    );

    const config = {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Scénario Bas",
            data: scenarioBasData,
            borderColor: "#05a5e1",
            borderWidth: 1,
            borderDash: [5, 5],
            fill: false,
            // pointRadius: 0,
            zIndex: 1,
          },
          {
            label: "Scénario Médian",
            data: scenarioMedianData,
            borderColor: "#8755c8",
            borderWidth: 1,
            borderDash: [5, 5],
            fill: false,
            // pointRadius: 0,
            zIndex: 1,
          },
          {
            label: "Scénario Haut",
            data: scenarioHautData,
            borderColor: "#ef426f",
            borderWidth: 1,
            borderDash: [5, 5],
            fill: false,
            // pointRadius: 0,
            zIndex: 1,
          },
          {
            label: "Réalisé",
            data: realiseData,
            borderColor: "#688197",
            borderWidth: 3,
            fill: "start",

            zIndex: 2,
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Année",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Nombre de points de charge",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Trajectoire des points de charge ouverts au public à horizon 2030",
          },
          legend: {
            display: true,
          },
          tooltips: {
            mode: "index",
            intersect: false,
          },
        },
      },
    };

    var myChart = new Chart(document.getElementById("linechart"), config);
  })
  .catch((error) =>
    console.error("Erreur de chargement du fichier JSON:", error)
  );


  const width = 800;
  const height = 600;
  
  const svg = d3.select("#map").attr("width", width).attr("height", height);
  
  const projection = d3
    .geoConicConformal()
    .center([2.454071, 46.279229])
    .scale(2600)
    .translate([width / 2, height / 2]);
  
  const path = d3.geoPath().projection(projection);
  
  let currentPath = null;
  let regionData = {};
  
  // Sélectionnez le tooltip
  const tooltip = d3.select("#tooltip");
  
  // Chargez le fichier GeoJSON
  d3.json("carte.geojson").then(function (geojson) {
    // Chargez le deuxième fichier JSON avec les données
    d3.json("puissance.json").then(function (data) {
      // Associez les données au code de région
      data.forEach((regionDataItem) => {
        regionData[regionDataItem.code_region] = regionDataItem;
      });
  
      // Créez une échelle de couleurs de bleu en fonction de la puissance
      const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([
          d3.min(data, d => d.puissance_installee_moyenne_par_point_de_charge),
          d3.max(data, d => d.puissance_installee_moyenne_par_point_de_charge)
        ]);
  
      svg
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "black") // Couleur du trait au survol
        .attr("stroke-width", 0.5) // Épaisseur du trait au survol
        .attr("fill", d => colorScale(regionData[d.properties.code_region].puissance_installee_moyenne_par_point_de_charge))
        .on("mouseover", function (event, d) {
          d3.select(this)
            .classed("highlighted", true);
          regionDataItem = regionData[d.properties.code_region];
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
          `<strong>Puissance installée : </strong>${data.puissance_installee_moyenne_par_point_de_charge.toFixed(2)} kVA<br>` +
          `<strong>Évolution sur 12 mois : </strong>${data.evolution_sur_12_mois_de_la_puissance_installee_moyenne_par_point_de_charge.toFixed(2)}%`
      );
  
      // Obtenez les coordonnées du curseur par rapport au #map-container
      const [x, y] = d3.pointer(event, d3.select("#map-container").node());
  
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
  