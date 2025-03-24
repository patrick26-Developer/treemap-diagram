const width = 960;
const height = 600;

const svg = d3.select("#tree-map");
const tooltip = d3.select("#tooltip");
const legend = d3.select("#legend");

const color = d3.scaleOrdinal(d3.schemeCategory10); // Palette de couleurs

// Chargement des données JSON
d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
  .then(data => {
    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .paddingInner(1)
      (root);

    // Création des tuiles
    const tile = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    tile.append("rect")
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.category))
      .on("mousemove", (event, d) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px")
          .attr("data-value", d.data.value)
          .html(`Nom: ${d.data.name}<br>Catégorie: ${d.data.category}<br>Valeur: ${d.data.value}`)
          .style("opacity", 0.9);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Ajout des noms dans les cases
    tile.append("text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g)) // Séparer les noms longs
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 12 + i * 10)
      .text(d => d)
      .attr("font-size", "10px")
      .attr("fill", "black");

    // Création de la légende
    const categories = [...new Set(root.leaves().map(d => d.data.category))];

    const legendItemSize = 20;
    const spacing = 5;

    legend
      .attr("height", categories.length * (legendItemSize + spacing));

    const legendItems = legend.selectAll("g")
      .data(categories)
      .enter().append("g")
      .attr("transform", (d, i) => `translate(10, ${i * (legendItemSize + spacing)})`);

    legendItems.append("rect")
      .attr("class", "legend-item")
      .attr("width", legendItemSize)
      .attr("height", legendItemSize)
      .attr("fill", d => color(d));

    legendItems.append("text")
      .attr("x", legendItemSize + 5)
      .attr("y", legendItemSize / 1.5)
      .text(d => d)
      .attr("font-size", "12px")
      .attr("fill", "black");
  });