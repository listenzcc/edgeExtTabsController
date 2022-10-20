window.onload = function () {
  const API = chrome;
  const root = document.getElementById("info");

  const rootLevelDivs = d3
    .select(root)
    .selectAll("div")
    .data(["currentTab", "otherTabs", "otherWnds"])
    .join("div")
    .attr("id", (d) => d)
    .attr("className", "CardDivStyle1");

  rootLevelDivs.append("h2").text((d) => d);

  // Update #currentTab
  API.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const data = [];

    API.tabs.get(tabs[0].id, function (tab) {
      data.push({
        url: tab.url,
        title: tab.title,
      });

      d3.select("#currentTab")
        .append("ul")
        .selectAll("li")
        .data(data)
        .join("li")
        .append("span")
        .text((d) => d.title)
        .attr("class", "active");
    });
  });

  // Update #otherTabs
  API.tabs.query({ active: false, currentWindow: true }, function (tabs) {
    const data = [];

    for (let index = 0; index < tabs.length; index++) {
      API.tabs.get(tabs[index].id, function (tab) {
        data.push({
          url: tab.url,
          title: tab.title,
        });

        if (index == tabs.length - 1) {
          d3.select("#otherTabs")
            .append("ol")
            .selectAll("li")
            .data(data)
            .join("li")
            .text((d) => d.title);
        }
      });
    }
  });

  // Update #otherWnds
  API.tabs.query({ currentWindow: false }, function (tabs) {
    const data = {};

    for (let index = 0; index < tabs.length; index++) {
      API.tabs.get(tabs[index].id, function (tab) {
        const { windowId, active, url, title } = tab;

        data[windowId] = data[windowId] ? data[windowId] : [];
        data[windowId].push({
          url: url,
          title: title,
          active: active,
          wndId: windowId,
        });

        if (index == tabs.length - 1) {
          const dataList = [];
          for (const wndId in data) {
            dataList.push({
              wndId,
              display: "block",
              data: data[wndId],
            });
          }

          const divs = d3
            .select("#otherWnds")
            .selectAll("div")
            .data(dataList)
            .join("div");

          divs.append("h3").text((d) => {
            const { wndId, data } = d;
            return wndId + "(" + data.length + ")";
          });

          divs
            .append("ol")
            .selectAll("li")
            .data((d) => d.data)
            .join("li")
            .append("span")
            .text((d) => d.title)
            .attr("class", (d) => (d.active ? "active" : "inactive"));

          d3.select("#otherWnds")
            .select("h2")
            .on("click", (e, d) => {
              console.log("Click", e, d);
              d3.select(e.target).text(() => {
                e.target.customData =
                  e.target.customData == " [+]" ? " [-]" : " [+]";
                return d + e.target.customData;
              });
              divs.attr("style", (d) => {
                d.display = d.display == "none" ? "block" : "none";
                return "display:" + d.display;
              });
            });
        }
      });
    }
  });
};
