chrome.webRequest.onBeforeSendHeaders.addListener(function(req){
  var blocking_response = {};
  // Determine whether to block this image request
  var safe = req.url.indexOf('safe-img-pbza') > 0? true:false;
  

  //Check if this request came from gmail
  var from_gmail = false, headers = req.requestHeaders;
  for(var i = 0; i < headers.length; i++) {
   if(headers[i].name.toLowerCase() == 'referer'){
     if(headers[i].value.indexOf('//mail.google.com/') > 0){
       from_gmail = true;
       break;
     }
   }
  }

  if(req.type == 'image' && !safe && from_gmail){
    blocking_response.cancel = true;
  }
  return blocking_response;
},
{urls: [ "*://*.googleusercontent.com/proxy/*" ]},['requestHeaders','blocking']);
