chrome.webRequest.onBeforeSendHeaders.addListener(function(req){
  var blockingResponse = {};
  // Determine whether to block this image req
  var safe = req.url.indexOf('safe-img-pbz')  > 0? true:false;
  console.log('safe? ' + safe);
  
  //Check if this request came from gmail
  var fromGmail = false, headers = req.requestHeaders;
  for(var i = 0; i < headers.length; i++) {
   if(headers[i].name.toLowerCase() == 'referer'){
     if(headers[i].value.indexOf('//mail.google.com/mail') > 0){
       fromGmail = true;
       break;
     }
   }
  }

  if(req.type == 'image' && !safe && fromGmail){
    console.log(JSON.stringify(req));
    blockingResponse.cancel = true;
  }
  return blockingResponse;
},
{urls: [ "*://*.googleusercontent.com/proxy/*" ]},['requestHeaders','blocking']);
