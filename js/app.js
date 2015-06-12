var directory = [];
var onSpreadsheet = function(json) {
  console.log(json);
  var tabContainer = document.getElementById('tabs');
  var firstPageUrl = '';
  var htmlStr = '';
  var entries = json.feed.entry;
  for (var i = 0; i < entries.length; ++i) {
    var r = entries[i];
    var title = r.gsx$title.$t;
    var fb = r.gsx$fb.$t;
    var url = r.gsx$url.$t;

    var isActive = '';
    if (i == 0) {
      isActive = 'active';
      firstPageUrl = url;
    }

    htmlStr += '<li class="'+isActive+'"><a href onclick="onTabClick(event, '+i+')">'+title+'</a></li>';
    directory.push({
      title: title,
      fb: fb,
      url: url
    });
  }
  tabContainer.innerHTML = htmlStr;

  populateTabContent(directory[0]);
};

var onTabClick = function(e, index) {
  e.preventDefault();
  var li = $('#tabs li');
  li.removeClass('active');

  if (directory.length > 0) {
    var entry = directory[index];
    populateTabContent(entry);
    li.eq(index).addClass('active');
  }
};

var populateTabContent = function(entry) {
  var url = entry.url;
  var contentContainer = document.getElementById('tabContent');

  contentContainer.innerHTML = '讀取中 ...';
  $.ajax({
    url: url,
    dataType: 'html'
  }).done(function(data) {
    data = data.split('<body')[1].split('>').slice(1).join('>').split('</body>')[0];
    // replace href url
    data = data.replace(/"(http:\/\/www.google.com\/url\?q=(.*?)&amp;.*?)"/g, function(match, href, url) {
      return decodeURIComponent(url);
    });
    data = data.replace(/<a /g, '<a target="_blank" ');
    // add fb plugin
    if (entry.fb !== undefined && entry.fb !== 'none') {
      data += '<div id="fbContainer"><div class="fb-comments" data-href="http://opentaipei.github.io/publicforum/'+entry.fb+'" data-width="100%" data-numposts="5" data-colorscheme="light"></div></div>';
    }

    contentContainer.innerHTML = data;

    if (entry.fb !== undefined && entry.fb !== 'none') {
      FB.XFBML.parse(document.getElementById('fbContainer'), function() {
        console.log('parsed');
      });
    }
  });
};

