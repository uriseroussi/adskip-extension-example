class AdSkip {
  constructor() {
    this.ytAdModuleObserver = null; // the MutationObserver for the div rendering ad information
    this.adModuleElement = null; // the div element rendering ad information
    this.adSkipButtonElement = null; // the custom skip button element
  }

  // observe youtube ad module for changes and run the checkForAd callback
  observeAdModule() {
    if (!this.adModuleElement) {
      this.adModuleElement = document.querySelector(
        '#ytd-player .ytp-ad-module'
      );

      if (this.adModuleElement) {
        this.checkForAd(); // run an initial check for ads
        this.ytAdModuleObserver = new MutationObserver(() => this.checkForAd());
        this.ytAdModuleObserver.observe(this.adModuleElement, {
          subtree: true,
          childList: true,
        });
      }
    }
  }

  // check if an ad is playing
  // if ad playing an no skip button created, create it and make visible
  // if ad not playing hide the button
  checkForAd() {
    if (this.adModuleElement.innerHTML !== '') {
      if (!this.adSkipButtonElement) {
        this.createAdSkipButton();
      }
      this.adSkipButtonElement.style.visibility = 'visible';
    } else {
      if (this.adSkipButtonElement) {
        this.adSkipButtonElement.style.visibility = 'hidden';
      }
    }
  }

  // creates a button to be rendered when an ad plays
  // button on click will skip the ad
  createAdSkipButton() {
    const videoElement = document.querySelector('video');

    videoElement.parentElement.style.position = 'relative';
    videoElement.parentElement.insertAdjacentHTML(
      'afterend',
      `<button id="ad-skip-button">
        <span>AdSkip</span>
        <svg height="100%" viewBox="-6 -6 36 36" width="100%">
          <path d="M5,18l10-6L5,6V18L5,18z M19,6h-2v12h2V6z" fill="#fff"></path>
        </svg>
       </button>`
    );

    const adSkipButton = document.querySelector('#ad-skip-button');
    adSkipButton.innerText = 'AdSkip';
    adSkipButton.style.padding = '10px 20px';
    adSkipButton.style.fontSize = '16px';
    adSkipButton.style.backgroundColor = '#4CAF50';
    adSkipButton.style.color = '#fff';
    adSkipButton.style.border = 'none';
    adSkipButton.style.borderRadius = '5px';
    adSkipButton.style.cursor = 'pointer';
    adSkipButton.style.position = 'absolute';
    adSkipButton.style.bottom = '86px';
    adSkipButton.style.right = '12px';
    adSkipButton.style.zIndex = '9999';
    adSkipButton.style.display = 'flex';
    adSkipButton.style.gap = '3px';

    adSkipButton.addEventListener('click', () => {
      this.skipAd();
    });

    this.adSkipButtonElement = adSkipButton;
  }

  // skip ad by going to the end timestamp and click the youtube ad skip button
  skipAd() {
    const videoElement = document.querySelector('video');
    const skipButton = document.querySelector(
      'button.ytp-ad-skip-button-modern'
    );

    if (videoElement && isFinite(videoElement.duration)) {
      videoElement.currentTime = videoElement.duration;
    }
    if (skipButton) {
      skipButton.click();
    }
    chrome.runtime.sendMessage({ action: 'increment' });
  }
}

// run a callback when the DOM changes
function observeDocument(callback) {
  const observer = new MutationObserver((records, observer) => {
    callback(observer);
  });
  observer.observe(document, { subtree: true, childList: true });
}

function main() {
  const adSkip = new AdSkip();

  observeDocument((observer) => {
    if (!adSkip.adModuleElement) {
      adSkip.observeAdModule();
    } else {
      observer.disconnect();
    }
  });
}

main();
