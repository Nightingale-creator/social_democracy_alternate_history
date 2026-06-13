(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var TITLE = "Social Democracy: An Alternate History" + '_' + "Autumn Chen";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      document.body.classList.remove('dark-mode');
      window.dendryUI.saveSettings();
  };
  window.enableDarkMode = function() {
      window.dendryUI.dark_mode = true;
      document.body.classList.add('dark-mode');
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
  };

  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
  };

  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.onDisplayContent = function() {
      
  };

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };

  //custom music system for multiple layers of music by Communist45 and Puddle originally for Beeshana Kalaya
  window.AudioManager = (function() {
    var layers = {
        music: {
            playlist: [
                'music/Im_A_Dude.mp3',
                'music/Einheitsfront.mp3',
                'music/Rhine_no_Mamori.mp3'
            ],
            currentIndex: 0,
            audio: null,
            volume: 1.0,
            enabled: true
        },
        ambient: {
            playlist: [],
            currentIndex: 0,
            audio: null,
            volume: 0.4,
            enabled: false
        },
        sfx: {
            playlist: [],
            currentIndex: 0,
            audio: null,
            volume: 0.6,
            enabled: true
        }
    };

    var muted = false;
    var started = false;

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
    }

    function playLayer(layerName) {
            var layer = layers[layerName];
            if (!layer || !layer.enabled || layer.playlist.length === 0) return;
            var targetVol = muted ? 0 : layer.volume;

            if (layer.audio) {
                var old = layer.audio;
                old.onended = null;
                var fadeOut = setInterval(function() {
                    if (old.volume > 0.05) {
                        old.volume = Math.max(0, old.volume - 0.05);
                    } else {
                        old.pause();
                        clearInterval(fadeOut);
                    }
                }, 50);
            }

            setTimeout(function() {
                var newAudio = new Audio(layer.playlist[layer.currentIndex]);
                layer.audio = newAudio;
                newAudio.volume = 0;
                newAudio.play().catch(function() {});
                var fadeIn = setInterval(function() {
                    if (newAudio.volume < targetVol - 0.05) {
                        newAudio.volume = Math.min(targetVol, newAudio.volume + 0.05);
                    } else {
                        newAudio.volume = targetVol;
                        clearInterval(fadeIn);
                    }
                }, 50);
                newAudio.onended = function() {
                    layer.currentIndex = (layer.currentIndex + 1) % layer.playlist.length;
                    playLayer(layerName);
                };
            }, 800);
    }

    function stopLayer(layerName) {
        var layer = layers[layerName];
        if (layer && layer.audio) {
            layer.audio.pause();
            layer.audio = null;
        }
    }

    return {
        started: false,

        init: function() {
        },

        start: function() {
            this.started = true;
            playLayer('music');
        },

        mute: function() {
            muted = true;
            for (var name in layers) {
                if (layers[name].audio) layers[name].audio.pause();
            }
        },

        unmute: function() {
            muted = false;
            for (var name in layers) {
                if (layers[name].audio) layers[name].audio.play().catch(function() {});
            }
        },

        isMuted: function() { return muted; },

        skip: function(layerName) {
            var sfxLayer = layers['sfx'];
            if (sfxLayer && sfxLayer.enabled) {
                var sfxAudio = new Audio('music/sfx/radio_static.mp3');
                sfxAudio.volume = sfxLayer.volume;
                sfxAudio.play().catch(function() {});
            }
            var name = layerName || 'music';
            var layer = layers[name];
            if (layer.audio) {
                var old = layer.audio;
                old.onended = null;
                var fadeOut = setInterval(function() {
                    if (old.volume > 0.05) {
                        old.volume = Math.max(0, old.volume - 0.05);
                    } else {
                        old.pause();
                        clearInterval(fadeOut);
                    }
                }, 50);
            }
            layer.currentIndex = (layer.currentIndex + 1) % layer.playlist.length;
            setTimeout(function() {
                playLayer(name);
            }, 400);
        },

        previous: function(layerName) {
            var sfxLayer = layers['sfx'];
            if (sfxLayer && sfxLayer.enabled) {
                var sfxAudio = new Audio('music/sfx/radio_static.mp3');
                sfxAudio.volume = sfxLayer.volume;
                sfxAudio.play().catch(function() {});
            }
            var name = layerName || 'music';
            var layer = layers[name];
            if (layer.audio) {
                var old = layer.audio;
                old.onended = null;
                var fadeOut = setInterval(function() {
                    if (old.volume > 0.05) {
                        old.volume = Math.max(0, old.volume - 0.05);
                    } else {
                        old.pause();
                        clearInterval(fadeOut);
                    }
                }, 50);
            }
            layer.currentIndex = (layer.currentIndex - 1 + layer.playlist.length) % layer.playlist.length;
            setTimeout(function() {
                playLayer(name);
            }, 400);
        },

        playSong: function(path, layerName) {
            var name = layerName || 'music';
            var layer = layers[name];
            var targetVol = muted ? 0 : layer.volume;

            if (layer.audio) {
                var old = layer.audio;
                old.onended = null; // remove existing ended listener
                var fadeOut = setInterval(function() {
                    if (old.volume > 0.05) {
                        old.volume = Math.max(0, old.volume - 0.05);
                    } else {
                        old.pause();
                        clearInterval(fadeOut);
                    }
                }, 50);
            }

            setTimeout(function() {
                var newAudio = new Audio(path);
                layer.audio = newAudio;
                newAudio.volume = 0;
                newAudio.play().catch(function() {});
                var fadeIn = setInterval(function() {
                    if (newAudio.volume < targetVol - 0.05) {
                        newAudio.volume = Math.min(targetVol, newAudio.volume + 0.05);
                    } else {
                        newAudio.volume = targetVol;
                        clearInterval(fadeIn);
                    }
                }, 50);
                newAudio.onended = function() {
                    layer.currentIndex = (layer.currentIndex + 1) % layer.playlist.length;
                    playLayer(name);
                };
            }, 400);
        },

        playSongOnce: function(path, layerName) {
            var name = layerName || 'music';
            var layer = layers[name];
            var targetVol = muted ? 0 : layer.volume;

            if (layer.audio) {
                var old = layer.audio;
                old.onended = null;
                var fadeOut = setInterval(function() {
                    if (old.volume > 0.05) {
                        old.volume = Math.max(0, old.volume - 0.05);
                    } else {
                        old.pause();
                        clearInterval(fadeOut);
                    }
                }, 50);
            }

            setTimeout(function() {
                var newAudio = new Audio(path);
                layer.audio = newAudio;
                newAudio.volume = 0;
                newAudio.play().catch(function() {});
                var fadeIn = setInterval(function() {
                    if (newAudio.volume < targetVol - 0.05) {
                        newAudio.volume = Math.min(targetVol, newAudio.volume + 0.05);
                    } else {
                        newAudio.volume = targetVol;
                        clearInterval(fadeIn);
                    }
                }, 50);
                newAudio.onended = null; // nothing plays after
            }, 400);
        },

        addSong: function(layerName, path) {
            layers[layerName].playlist.push(path);
        },

        removeSong: function(layerName, path) {
            var pl = layers[layerName].playlist;
            var idx = pl.indexOf(path);
            if (idx > -1) pl.splice(idx, 1);
        },

        enableLayer: function(layerName) {
            layers[layerName].enabled = true;
            playLayer(layerName);
        },

        disableLayer: function(layerName) {
            layers[layerName].enabled = false;
            stopLayer(layerName);
        },

        pause: function(layerName) {
            var name = layerName || 'music';
            var layer = layers[name];
            if (layer.audio) layer.audio.pause();
        },

        resume: function(layerName) {
            var name = layerName || 'music';
            var layer = layers[name];
            if (layer.audio) layer.audio.play().catch(function() {});
        },

        setVolume: function(layerName, vol) {
            var names = layerName === 'music' ? ['music', 'ambient', 'sfx'] : [layerName];
            for (var i = 0; i < names.length; i++) {
                layers[names[i]].volume = vol;
                if (layers[names[i]].audio && !muted) {
                    layers[names[i]].audio.volume = vol;
                }
            }
        },
    };
  }());

  window.disableAudio = function() {
    AudioManager.mute();
    window.dendryUI.toggle_audio(false);
  };

  window.enableAudio = function() {
    AudioManager.unmute();
  };

  window.toggleMusicButton = function() {
    var onIcon = document.getElementById('music-on-icon');
    var offIcon = document.getElementById('music-off-icon');
    if (AudioManager.isMuted()) {
        AudioManager.unmute();
        onIcon.style.display = '';
        offIcon.style.display = 'none';
    } else {
        AudioManager.mute();
        onIcon.style.display = 'none';
        offIcon.style.display = '';
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('music-toggle-btn').onclick = function(e) {
        window.toggleMusicButton();
    };
  });

  window.skipSong = function() {
    AudioManager.skip('music');
  };

  window.updateMusicBtn = function() {
      var disabled = window.dendryUI && window.dendryUI.disable_audio;
      var onIcon = document.getElementById('music-on-icon');
      var offIcon = document.getElementById('music-off-icon');
      if (onIcon && offIcon) {
          onIcon.style.display = disabled ? 'none' : 'inline';
          offIcon.style.display = disabled ? 'inline' : 'none';
      }
  };


  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.toggle_audio(false);
    AudioManager.init();
    window.dendryUI.loadSettings({show_portraits: false});
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
  };

}());
