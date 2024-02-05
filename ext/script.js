async function updateTotalBlockedAdsDisplay() {
  const counterElement = document.querySelector('.ads-skipped');
  const totalBlocked =
    (await chrome.storage.local.get(['totalBlocked'])).totalBlocked ?? 0;
  counterElement.innerHTML = totalBlocked;
}

function main() {
  updateTotalBlockedAdsDisplay();
}

main();
