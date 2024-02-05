async function incrementTotalBlockedAds() {
  const totalBlocked =
    (await chrome.storage.local.get(['totalBlocked'])).totalBlocked ?? 0;
  await chrome.storage.local.set({ totalBlocked: totalBlocked + 1 });
}

function main() {
  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (request.action === 'increment') {
        incrementTotalBlockedAds();
      }
    }
  );
}

main();
