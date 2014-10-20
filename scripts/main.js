

var pixelblock = (function(){

  var blacklist = [{name:'Signals',      pattern:'t.signaux',              url:'http://getsignals.com'},
                   {name:'Signals',       pattern:'t.senaldos.com',         url:'http://getsignals.com'},
                   {name:'Banana Tag',    pattern:'bl-1.com',               url:'http://bananatag.com'},
                   {name:'Boomerang',     pattern:'mailstat.us/tr',         url:'http://boomeranggmail.com'},
                   {name:'Yesware',       pattern:'app.yesware.com',        url:'http://yesware.com'},
                   {name:'Yesware',       pattern:'t.yesware.com',          url:'http://yesware.com'},
                   {name:'Streak',        pattern:'mailfoogae.appspot.com', url:'http://streak.com'},
                   {name:'LaunchBit',     pattern:'launchbit.com/taz-pixel',url:'http://launchbit.com'},
                   {name:'MailChimp',     pattern:'list-manage.com/track',  url:'http://mailchimp.com'},
                   {name:'Postmark',      pattern:'cmail1.com/t',           url:'http://postmarkapp.com'},
                   {name:'iContact',      pattern:'click.icptrack.com/icp/',url:'http://icontact.com'},
                   {name:'Infusionsoft',  pattern:'infusionsoft.com/app/emailOpened',  url:'http://infusionsoft.com'},
                   {name:'Intercom',      pattern:'via.intercom.io/o',      url:'http://intercom.io'},
                   {name:'Mandrill',      pattern:'mandrillapp.com/track',  url:'http://mandrillapp.com'},
                   {name:'Hubspot',       pattern:'t.hsms06.com',           url: 'http://hubspot.com'},
                   {name:'RJ Metrics',    pattern:'go.rjmetrics.com',       url:'http://rjmetrics.com'},
                   {name:'Mixpanel',      pattern:'api.mixpanel.com/track', url:'http://mixpanel.com'},
                   {name:'Front App',     pattern:'web.frontapp.com/api',   url:'http://frontapp.com'}
                   ];

  var gmail         = null,
      safe_pattern  = '?safe-img-pbz#',
      proxy_pattern = 'googleusercontent.com/proxy';

  /*
   * 
   */
  var isBlacklisted = function(img){
    var blacklisted = false;

    // run img src's against our blacklist
    for(var x = 0; x < blacklist.length; x ++){
      if(img.src.indexOf(blacklist[x].pattern) > 0) {
        img.tracker_info = blacklist[x];
        blacklisted = true;
      }
    }

    // block all images left over that are 1 x 1 (regardless)
    if(!blacklisted && $(img).width() == 1 && $(img).height() == 1){
      img.tracker_info = {pattern:'', name:'Unknown', url:''};
      blacklisted = true;
    }

    // if blacklisted, hide image (ie. prevent the tracking img from loading)
    if(blacklisted) img.style.display = 'none';
    return blacklisted;
  }

  /*
   * Whitelist an img, i.e. let it display/load
   */
  var whitelistImg = function(img){
    if(img.src.indexOf(safe_pattern) == -1) img.src = img.src.replace('#', safe_pattern);
  }

  /*
   * 
   */
  var showTrackingEye = function(email){
    var tracking_imgs = $(email).find("img[tracker='true']");

    if(tracking_imgs.length > 0){
      // Add the red eye
      var eye = $('#red-eye').clone();
      var content = getPopoverHeader(tracking_imgs);
      $(eye).popover({trigger:'click',placement:'bottom', content:content, html:true});

      $(eye).click( function(e){ e.stopPropagation(); } );
      $(email).click( function(e){ $(eye).popover('hide'); } );

      eye.show();
      $(email).find('h3.iw').append(eye);// div.gK
    }
  }

  /*
   * 
   */
  var getPopoverHeader = function(imgs){
    var plural = imgs.length > 1? 's':'';
    var content = '<div class="hover-content">';
    content += '<div>Blocked <span style="font-weight:bold;text-decoration:underline;">' + imgs.length + '</span> tracking attempt' + plural + '</div>';
    content += '<div style="margin-top:8px;"><span style="text-decoration:underline;">Source' + plural + '</span>:&nbsp;';
    
    $.each(imgs, function(index){
      var url = cleanURL(this.src);
      if(index > 0) content += ', ';
      
      if(this.tracker_info.url != ''){
        content += '<a class="tracker-name" href="'+ this.tracker_info.url +'" target="_blank" title="' + this.tracker_info.url  + '">' + this.tracker_info.name + '</a>';
      }else{
        content += '<span class="tracker-name unknown" title="' + url + '">' + this.tracker_info.name + '</span>';
      }
      
    });
    content += '</div></div>';
    return content;
  }

  /*
   * 
   */
  var cleanURL = function(url){
    if(url == '' || url.indexOf('#') == -1) return url;
    return url.substring(url.indexOf('#')+1);
  }

  var scanImgs = function(){
    var body = gmail.dom.email_body();

    var emails = $(body[0]).find('div.h7[processed!="true"]');
    // go through all open emails on screen
    for(var x = 0; x < emails.length; x++){
      var email = emails[x], trackingImgFound = false;

      // loop over all images in this email
      $("img[src]", email).each(function(){
        var src = this.src;
        if(src.indexOf(proxy_pattern) > 0 && src.indexOf(safe_pattern) == -1){
          if(isBlacklisted(this)){
            this.setAttribute('tracker', 'true');
            trackingImgFound = true;
          }else{
            whitelistImg(this);
          }
        }
      });

      // show 'eye'
      if(trackingImgFound) showTrackingEye(email);

      // Handle no images mode
      if($("div.ado", email).length == 0) email.setAttribute('processed', 'true');
    }
    setTimeout(scanImgs, 100);
  }

  var init = function(){
    // add bootstrap.js
    $('#bs-script').attr('src', $('#bs-script').attr('data-src'));
    // init gmail.js
    gmail = new Gmail();
  }

  var start = function(){
    setTimeout(scanImgs, 350);
  }

  return {init:init, start:start};
})();

// check if jquery loaded/init'd
var checkLoaded = function() {
  if(window.jQuery) {
    $.fn.onAvailable = function(e) {
      var t = this.selector;
      var n = this;
      if (this.length > 0) e.call(this);
      else {
        var r = setInterval(function () {
          if ($(t).length > 0) {
            e.call($(t));
            clearInterval(r);
          }
        }, 50);
        
      }
    };
    pixelblock.init();
    pixelblock.start();
  } else {
    setTimeout(checkLoaded, 100);
  }
};
checkLoaded();