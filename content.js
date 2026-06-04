const bookmarkImgURL = chrome.runtime.getURL("assets/bookmark.png");
// for making a space in the storage for bookmark
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";
window.addEventListener("load", addBookmarkButton);

function addBookmarkButton() {
  if (document.getElementById("add-bookmark-button")) return;

    const bookmarkButton = document.createElement("img");
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = bookmarkImgURL;

    const title = document.querySelector("h4");
    if (!title) return;
    bookmarkButton.style.width = "24px";
    bookmarkButton.style.height = "24px";
    bookmarkButton.style.marginTop = "8px";

    title.appendChild(bookmarkButton);

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
      chrome.sync.get([AZ_PROBLEM_KEY], (result) => {
        resolve(result[AZ_PROBLEM_KEY] || []);
      });
  });
}
function extractUniqueId(url) {
    const start = url.indexOf("problems/") + "problems/".length;
    const end = url.indexOf("?", start);
    return end === -1 ? url.substring(start) : url.substring(start, end);
}