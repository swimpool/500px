var gecko = (function () {

  var me = {};

  // Launch a browser with the specified URL.
  me.openUrl = function(url) {
    chameleon.intent({
      action:"android.intent.action.VIEW",
      data: url
    });
  };

  // Set the title of the widget.
  me.setTitle = function(title) {
    chameleon.setTitle({ text: title });
  };

  // Reload the entire widget code.
  me.reloadWidget = function() {
    chameleon.refresh({ reload: true });
  };

  // Show the loading animation. 
  me.showLoading = function() {
    chameleon.showLoading({ showloader: true });
  };

  // Hide the loading animation.
  me.hideLoading = function() {
    chameleon.showLoading({ showloader: false });
  };

  // Returns true if the widget is being run in a Kickstarter backers only 
  // version of Chameleon.
  me.isKickstarter = function() {
    return chameleon.getChameleonPackageName() == 'com.chameleonlauncher.preorder';
  };

  // Show an action icon at the top of the widget with the given icon.
  me.showAction = function(image) {
    chameleon.action({ icon: image });
  };

  // Hides the action icon.
  me.hideAction = function() {
    chameleon.action({ visible: false });
  };

  // Returns true if the function is being called from a Chameleon window.
  me.isWindow = function() {
    return chameleon.getType() == 'window';
  };

  // Returns true if the function is being called from a Chameleon widget.
  me.isWidget = function() {
    return chameleon.getType() == 'widget';
  };

  // Get a single setting from this widget instance.
  me.getInstanceSetting = function(key, def) {
    return _getSetting('instance', key, def);
  };

  // Save a single setting to this widget instance.
  me.setInstanceSetting = function(key, value) {
    return _setSetting('instance', key, value);
  };

  // Get a single setting from the local storage for this widget instance.
  me.getLocalSetting = function(key, def) {
    var value = chameleon.getLocalData(key);
    if (value) {
      return value;
    }
    if (def !== undefined) {
      return def;
    }
    return null;
  };

  // Save a single setting to the local storage for this widget instance.
  me.setLocalSetting = function(key, value) {
    return chameleon.saveLocalData(key, value);
  };

  // Get a single setting from this widgets shared data pool.
  me.getSharedSetting = function(key, def) {
    return _getSetting('shared', key, def);
  };

  // Save a single setting to this widgets shared data pool.
  me.setSharedSetting = function(key, value) {
    return _setSetting('shared', key, value);
  };

  // ### Deprecated Functions

  // ALIAS: getInstanceSetting
  me.getInstanceData = function(key, def) {
    return me.getInstanceSetting(key, def);
  };

  // ALIAS: setInstanceSetting
  me.setInstanceData = function(key, value) {
    return me.setInstanceSetting(key, value);
  };

  // ## Private Functions

  var _getSetting = function(type, key, def) {
    var data = _getData(type);
    if (key in data) {
      return data[key];
    }
    if (def !== undefined) {
      return def;
    }
    return null;
  };

  var _setSetting = function(type, key, value) {
    var data = _getData(type);
    data[key] = value;
    return _saveData(type, data);
  }

  var _getData = function(type) {
    var data = null;
    switch (type) {
      case 'instance': 
        data = chameleon.getData();
      break;
      case 'shared': 
        data = chameleon.getSharedData();
      break;
    }
    if (data == null) {
      data = {};
    }    
    return data;
  }

  var _saveData = function(type, data) {
    switch (type) {
      case 'instance': 
        return chameleon.saveData(data);;
      case 'shared': 
        return chameleon.saveSharedData(data);
    }    
    return false;
  }

  return me;

}());
