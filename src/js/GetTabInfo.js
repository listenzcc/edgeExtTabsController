window.onload = function () {
  const root = document.getElementById("info");
  root.innerHTML = "";
  root.style.display = "block";

  d3.select(root)
    .selectAll("div")
    .data(["currentTab", "otherTabs", "otherWnds"])
    .join("div")
    .attr("id", (d) => d)
    .attr("className", "CardDivStyle1");

  const API = chrome;

  // Current window, current tab
  const currentTab = root.appendChild(document.createElement("div"));
  currentTab.className = "CardDivStyle1";
  currentTab.appendChild(document.createTextNode("Current:"));

  API.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    API.tabs.get(tabs[0].id, function (tab) {
      var node = document.createElement("div");
      var textnode = document.createTextNode("Url: " + tab.url);
      node.appendChild(textnode);

      var node2 = document.createElement("div");
      var textnode2 = document.createTextNode("Title: " + tab.title);
      node2.appendChild(textnode2);

      currentTab.appendChild(node);
      currentTab.appendChild(node2);
    });
    currentTab.style.display = "block";
  });

  // Current window, other tabs
  const otherTabs = root.appendChild(document.createElement("div"));
  otherTabs.className = "CardDivStyle1";

  API.tabs.query({ active: false, currentWindow: true }, function (tabs) {
    console.log(tabs);
    console.log(tabs.length);
    otherTabs.appendChild(
      document.createTextNode("Others: (" + tabs.length + ")")
    );
    for (let index = 0; index < tabs.length; index++) {
      API.tabs.get(tabs[index].id, function (tab) {
        var node = document.createElement("div");
        var textnode = document.createTextNode("Url: " + tab.url);
        node.appendChild(textnode);

        var node2 = document.createElement("div");
        var textnode2 = document.createTextNode("Title: " + tab.title);
        node2.appendChild(textnode2);

        otherTabs.appendChild(node);
        otherTabs.appendChild(node2);
      });
    }
    otherTabs.style.display = "block";
  });

  // Other window, all tabs
  const otherWindow = root.appendChild(document.createElement("div"));
  otherWindow.className = "CardDivStyle1";

  API.tabs.query({ currentWindow: false }, function (tabs) {
    console.log(tabs);
    console.log(tabs.length);
    otherWindow.appendChild(
      document.createTextNode("Other window: (" + tabs.length + ")")
    );
    for (let index = 0; index < tabs.length; index++) {
      API.tabs.get(tabs[index].id, function (tab) {
        var prefix = tab.active ? "+" : "-";
        var node = document.createElement("div");
        var textnode = document.createTextNode(prefix + "Url: " + tab.url);
        node.appendChild(textnode);

        var node2 = document.createElement("div");
        var textnode2 = document.createTextNode(prefix + "Title: " + tab.title);
        node2.appendChild(textnode2);

        otherWindow.appendChild(node);
        otherWindow.appendChild(node2);
      });
    }
    otherWindow.style.display = "block";
  });
};
