function getCurrentProjectId() {
  var queryString = window.location.search.substring(1);
  var queries = queryString.split('&');

  var projectId = null;
  queries.forEach(function(query) {
    var keyAndValue = query.split('=');
    if (keyAndValue[0] === 'project') {
      projectId = keyAndValue[1];
    }
  });

  return projectId;
}

function changeHeaderColor() {
  var defaultSetting = {
    conditions: []
  };
  chrome.storage.sync.get(defaultSetting, function(setting) {
    var projectId = getCurrentProjectId();
    var conditions = setting.conditions;

    for (var i = 0; i < conditions.length; i++) {
      var condition = conditions[i];
      if (projectId.match(condition.pattern)) {
        var header = document.querySelector('[md-theme=platform-bar]');
        if (!header) {
          console.error("can't get valid header");
          return;
        }

        var colorRgb = 'rgb(' + condition.color.r + ', '
                              + condition.color.g + ', '
                              + condition.color.b + ')';
        header.style.backgroundColor = colorRgb;
        return;
      }
    }

    // No patterns matched, so back to original color
    var header = document.querySelector('[md-theme=platform-bar]');
    if (!header) {
      console.error("can't get valid header");
      return;
    }
    header.style.backgroundColor = null;
  });
}

(function() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    changeHeaderColor();
  });
  changeHeaderColor();
}());
