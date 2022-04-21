chrome.action.onClicked.addListener(async tab => {
  chrome.storage.local.get(['token'], (a) => {
    if (a.token) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { toggleVisible: true, token: a.token });
        setTimeout(() => { chrome.tabs.sendMessage(tab.id, { order: 'changestate', state: 'save' }); }, 500);

      }
    } else {
      chrome.tabs.create({
        url: 'qr.html'
      });
    }
  })

});

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log({ tab }.tab.url);
  return tab;
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "POPUP_INIT":
      getCurrentTab().then(sendResponse);
      return true;
    case "reToken":
      getCurrentTab().then((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { token:request.token, renewToken: true });
        }
      });
      return true;
    default:
      break;
  }
});
