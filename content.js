const bookmarkImgURL = chrome.runtime.getURL("assets/bookmark.png");
// for making a space in the storage for bookmark
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";

window.addEventListener("load", ()=>{
addBookmarkButton();
observeLayoutChanges();
});
function observeLayoutChanges() {
  const observer = new MutationObserver(() => {
    // Re-add button if it disappears from DOM
    if (!document.getElementById("add-bookmark-button")) {
      addBookmarkButton();
    }
  });
  observer.observe(document.body, {childList: true, subtree: true});
}

function addBookmarkButton() {
  if (document.getElementById("add-bookmark-button")) return;
  const titleContainer = document.querySelector(
    "div.flex.flex-wrap.items-start.justify-between"
  );
  if (!titleContainer) return;
    const h4 = titleContainer.querySelector("h4");
  if (!h4) return;

    const bookmarkButton = document.createElement("img");
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = bookmarkImgURL;

    bookmarkButton.style.width = "24px";
    bookmarkButton.style.height = "24px";
    bookmarkButton.style.cursor = "pointer";
    //bookmarkButton.style.marginTop = "8px";
    bookmarkButton.style.flexShrink = "0";
    bookmarkButton.style.alignSelf = "center";

  /*const titleContainer = title.closest("div");
  if (titleContainer) {
    titleContainer.appendChild(bookmarkButton);
  } else {
    title.insertAdjacentElement("afterend", bookmarkButton);
  }*/
 h4.insertAdjacentElement("afterend", bookmarkButton);

    bookmarkButton.addEventListener("click", addNewBookmarkHandler);

}
async function addNewBookmarkHandler() {
  const currentBookmarks = await getCurrentBookmarks();
  const azProblemUrl = window.location.href;
  const uniqueId = extractUniqueId(azProblemUrl);
  const name= document.querySelector("h4").innerText;
   if(currentBookmarks.some((bookmark) => bookmark.id === uniqueId)) return;
  const bookmarkObj = {
    id: uniqueId,
    name: name,
    url: azProblemUrl
  }
  //spread operator to add thee new bookmark
  const updatedBookmarks = [...currentBookmarks, bookmarkObj];
  chrome.storage.sync.set({[AZ_PROBLEM_KEY]: updatedBookmarks}, () => {
    console.log("Updated the bookmarks correctly to ", updatedBookmarks);
  });

}
function  getCurrentBookmarks() {
  return new Promise((resolve,reject) => {
      chrome.storage.sync.get([AZ_PROBLEM_KEY], (result) => {
        resolve(result[AZ_PROBLEM_KEY] || []);
      });
  });
}
function extractUniqueId(url) {
    const start = url.indexOf("problems/") + "problems/".length;
    const end = url.indexOf("?", start);
    return end === -1 ? url.substring(start) : url.substring(start, end);
}