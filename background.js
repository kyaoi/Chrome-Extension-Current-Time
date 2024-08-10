function copyTimeToClipboard() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const formattedTime = `${year}${month}${day}${hours}${minutes}`;

  navigator.clipboard
    .writeText(formattedTime)
    .then(() => {
      console.log("Time copied to clipboard");
    })
    .catch((err) => {
      console.error("Error copying time to clipboard:", err);
    });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyTime",
    title: "Copy Current Time",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyTime") {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        function: copyTimeToClipboard,
      })
      .then(() => {
        console.log("Script executed");
      })
      .catch((err) => {
        console.error("Error executing script:", err);
      });
  }
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "copy-current-time") {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        function: copyTimeToClipboard,
      })
      .then(() => {
        console.log("Script executed");
      })
      .catch((err) => {
        console.error("Error executing script:", err);
      });
  }
});
