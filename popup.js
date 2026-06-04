const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";
const assetURLMap ={
    "play": chrome.runtime.getURL("assets/play.png"),
    "delete": chrome.runtime.getURL("assets/delete.png")
}

const bookmarkSection= document.getElementById("bookmarks");
document.addEventListener("DOMContentLoaded",() => {
    chrome.storage.sync.get([AZ_PROBLEM_KEY], (data) => {
        // Handle the retrieved data
        const currentBookmarks = data[AZ_PROBLEM_KEY] || [];
        viewBookmarks(currentBookmarks);
    });
});

function viewBookmarks(bookmarks) {
    bookmarkSection.innerHTML = "";
    if(bookmarks.length === 0) {
        bookmarkSection.innerHTML = "<i>No bookmarks added yet.</i>";
        return;
    }
    bookmarks.forEach((bookmark) => addNewBookmark(bookmark));
}

function addNewBookmark(bookmark) {
    const newBookmark = document.createElement("div");
    const bookmarkTitle = document.createElement("div");
    const bookmarkControls =document.createElement("div");

    bookmarkTitle.innerText = bookmark.name;
    bookmarkTitle.classList.add("bookmark-title");
    setControlAtributes(assetURLMap.play, onPlay, bookmarkControls);
    setControlAtributes(assetURLMap.delete, onDelete, bookmarkControls);

    bookmarkControls.classList.add("bookmark-controls");
    newBookmark.classList.add("bookmark");
    newBookmark.setAttribute("url", bookmark.url);
    newBookmark.setAttribute("bookmark-id", bookmark.id);

    newBookmark.appendChild(bookmarkTitle);
    newBookmark.appendChild(bookmarkControls);
    bookmarkSection.appendChild(newBookmark);
}

function setControlAtributes(src, handeler,parentDiv){
    const controlElement = document.createElement("img");
    controlElement.src= src;
    controlElement.addEventListener("click", handeler);
    parentDiv.appendChild(controlElement);
}
function onPlay(event) {
    //.target thee one which is being clicked
   const url = event.target.parentNode.parentNode.getAttribute("url");
   //opens new webpage with the given url to the new tab
    window.open(url, "_blank");
}
function onDelete(event) {
    const bookmarkId = event.target.parentNode.parentNode;
    const bookmarkIdValue = bookmarkId.getAttribute("bookmark-id");
    //removes form dom only
    bookmarkId.remove();
    deleteBookmarkFromStorage(bookmarkIdValue);
}
function deleteBookmarkFromStorage(bookmarkId) {
    chrome.storage.sync.get([AZ_PROBLEM_KEY], (data) => {
        const currentBookmarks = data[AZ_PROBLEM_KEY] || [];
        //whose id is not equal to the id we want to remove we will keep it
        const updatedBookmarks = currentBookmarks.filter((bookmark) => bookmark.id !== bookmarkId);
        chrome.storage.sync.set({ [AZ_PROBLEM_KEY]: updatedBookmarks });
    });
}