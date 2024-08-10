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

function pasteTimeToActiveElement() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const formattedTime = `${year}${month}${day}${hours}${minutes}`;

  const activeElement = document.activeElement;
  if (
    activeElement &&
    (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
  ) {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const text = activeElement.value;
    activeElement.value =
      text.slice(0, start) + formattedTime + text.slice(end);
    activeElement.selectionStart = activeElement.selectionEnd =
      start + formattedTime.length;
  } else {
    // Use Range and Selection API for contenteditable elements or other non-input elements
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(formattedTime);
      range.insertNode(textNode);

      // Move the cursor to the end of the inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  // Main Menu
  chrome.contextMenus.create({
    id: "parent",
    title: "Copy Current Time Extension",
    contexts: ["all"],
  });

  // Sub Menu
  chrome.contextMenus.create({
    id: "copyTime",
    parentId: "parent",
    title: "Copy Current Time",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "pasteTime",
    parentId: "parent",
    title: "Paste Current Time",
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

  if (info.menuItemId === "pasteTime") {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        function: pasteTimeToActiveElement,
      })
      .then(() => {
        console.log("Time pasted at cursor position");
      })
      .catch((err) => {
        console.error("Error pasting time:", err);
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
