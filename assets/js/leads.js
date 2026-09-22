/* Block and Bull lead capture, one switch for the whole site.

   Paste the Apps Script web app URL between the quotes below. Every page that
   collects an email loads this file, so setting it here turns capture on
   everywhere at once. Leave it empty and nothing is sent anywhere.

   Deploy steps are in leads/SETUP.md in the repo. */
window.BNB_LEAD_ENDPOINT = '';

window.bnbSendLead = function (payload) {
  var url = window.BNB_LEAD_ENDPOINT;
  if (!url) { return Promise.resolve(false); }
  try {
    payload.ts = new Date().toISOString();
    payload.ref = document.referrer || '';
    payload.utm = location.search || '';
  } catch (e) {}
  /* text/plain and no-cors keep this a simple request, so the browser sends it
     without a preflight that Apps Script would answer with a redirect. We
     cannot read the response in no-cors mode and do not need to: the page
     never blocks on the write. */
  return fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  }).then(function () { return true; }).catch(function () { return false; });
};
