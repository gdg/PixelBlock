
window.onload = function () {
  // jquery
  var jq = document.createElement('script');
  jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js";
  document.getElementsByTagName('body')[0].appendChild(jq);
  
  // gmail.js
  var gmsrc = document.createElement('script');
  gmsrc.src = chrome.extension.getURL('scripts/gmail.min.js');
  document.getElementsByTagName('body')[0].appendChild(gmsrc);
  
  // main.js
  var sm = document.createElement('script');
  sm.src = chrome.extension.getURL('scripts/main.js');
  document.getElementsByTagName('body')[0].appendChild(sm);
  console.log('PixelBlock Ready!');

  // throw images in
  var redEye = document.createElement('img');
  redEye.src = chrome.extension.getURL('images/track-block.png');
  redEye.id = 'red-eye';
  redEye.style.display = 'none';
  redEye.height = 14;
  redEye.width = 25;
  redEye.style.verticalAlign = "-3px";
  redEye.style.paddingLeft = '5px';
  redEye.style.cursor = 'pointer';
  document.getElementsByTagName('body')[0].appendChild(redEye);

  // add boostrap
  var bs = document.createElement('script');
  bs.id = 'bs-script';
  bs.setAttribute('data-src', chrome.extension.getURL('scripts/bootstrap.js'));
  document.getElementsByTagName('body')[0].appendChild(bs);
  
  //add bootstrap css
  var css = document.createElement('link');
  css.href = chrome.extension.getURL('styles/bootstrap.css');
  css.rel = 'stylesheet';
  document.getElementsByTagName('body')[0].appendChild(css);
}
