// In MV3 the service worker can be stopped at any time, so setInterval/setTimeout
// are not reliable for scheduling. chrome.alarms wakes the worker up on time
// even after it has been suspended.

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "reminder") {
    chrome.notifications.create(`alarm-${Date.now()}`, {
      type: "basic",
      iconUrl: "images/icon-48.png",
      title: "Reminder",
      message: "This notification was fired by a scheduled alarm.",
    });
  }
});
