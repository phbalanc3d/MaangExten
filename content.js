const bookmarkImgURL = chrome.runtime.getURL("assets/bookmark.png");

window.addEventListener("load", addBookmarkButton);

function addBookmarkButton() {
    const bookmarkButton = document.createElement("img");
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = bookmarkImgURL;

    bookmarkButton.style.width = "24px";
    bookmarkButton.style.height = "24px";
    bookmarkButton.style.cursor = "pointer";
    const header = document.querySelector(
  ".flex.flex-wrap.items-start.justify-between.gap-3"
);

header.style.display = "flex";
header.style.justifyContent = "space-between";
header.style.alignItems = "center";
console.log(header);
header.appendChild(bookmarkButton);
}