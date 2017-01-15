var menu = {
	"file": {
		"new": {
            "label": "New",
            "action": ()=>{
                menu.showPrompt("filename", {
                    "new": {
                        "label": "Create New File",
                        "callback": ()=>{
                            var filename = $("#prompt-input").value;
                            fileman.newFile(filename);
                            fileman.currentFile = filename;
                            editor.textarea.value = "";
                            document.title = filename + " - " + title;
                            editor.setStatus("Opened file " + filename);
                            menu.hidePrompt();
                        }
                    }
                });
            }
        },
		"open": {
            "label": "Open",
            "action": ()=>{
                menu.showPrompt("filename", {
                    "open": {
                        "label": "Open File",
                        "callback": ()=>{
                            var filename = $("#prompt-input").value;
                            editor.textarea.value = fileman.loadFile(filename);
                            fileman.currentFile = filename;
                            document.title = filename + " - " + title;
                            editor.setStatus("Opened file " + filename);
                            menu.hidePrompt();
                        }
                    }
                });
            }
        },
		"save": {
            "label": "Save",
            "action": ()=>{
                fileman.saveFile(fileman.currentFile, editor.textarea.value);
                editor.setStatus("Saved file " + fileman.currentFile);
            }
        },
		"saveAs": {
            "label": "Save As",
            "action": ()=>{
                menu.showPrompt("filename", {
                    "saveAs": {
                        "label": "Save File",
                        "callback": ()=>{
                            var filename = $("#prompt-input").value;
                            fileman.saveFile(filename, editor.textarea.value);
                            fileman.currentFile = filename;
                            document.title = filename + " - " + title;
                            editor.setStatus("Saved file " + filename);
                            menu.hidePrompt();
                        }
                    }
                });
            }
        },
        "download": {
            "label": "Download",
            "action": ()=>{
                menu.showPrompt("filename", {
                    "downloadTxt": {
                        "label": "Download as Plain Text",
                        "callback": ()=>{
                            var filename = $("#prompt-input").value;
                            var a = document.createElement("a");
                            // Thanks http://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
                            a.setAttribute("href", "data:application/octet-stream;charset=utf-8," + encodeURIComponent(editor.textarea.value));
                            a.setAttribute("download", filename)
                            if (document.createEvent) {
                                var event = document.createEvent('MouseEvents');
                                event.initEvent('click', true, true);
                                a.dispatchEvent(event);
                            }
                            else {
                                a.click();
                            }
                            editor.setStatus("Downloaded file " + fileman.currentFile + " as " + filename);
                            menu.hidePrompt();
                        }
                    }
                });
                $("#prompt-input").value = fileman.currentFile;
            }
        },
		"close": {
            "label": "Close",
            "action": ()=>{
                fileman.currentFile = "untitled.txt";
                editor.textarea.value = fileman.loadFile(fileman.currentFile);
                editor.setStatus("Closed file. Now editing " + fileman.currentFile);
            }
        }
	},
	"edit": {
		"undo": {
            "label": "Undo",
            "action": ()=>{document.execCommand("undo");}        
        },
		"redo": {
            "label": "Redo",
            "action": ()=>{document.execCommand("redo");}
        },
        "sort": {
            "label": "Sort",
            "action": ()=>{editor.textarea.value = editor.textarea.value.split("\n").sort().join("\n");}
        }
	},
	"find": {
		"find": {
            "label": "Find",
            "action": ()=>{
                menu.showPrompt("string", {
                    "find": {
                        "label": "Find in Document",
                        "callback": ()=>{menu.hidePrompt();find($("#prompt-input").value);}
                    }
                });
            }
        },
		"replace": {
            "label": "Replace",
            "action": ()=>{
                menu.showPrompt("regex,string", {
                    "replace": {
                        "label": "Replace",
                        "callback": ()=>{
                            var strings = $("#prompt-input").value.split(",");
                            var regex = new RegExp(strings[0]);
                            editor.textarea.value = editor.textarea.value.replace(regex, strings[1]);
                            menu.hidePrompt();
                        }
                    },
                    "replaceAll": {
                        "label": "Replace All (Global Match)",
                        "callback": ()=>{
                            var strings = $("#prompt-input").value.split(",");
                            var regex = new RegExp(strings[0], 'g');
                            editor.textarea.value = editor.textarea.value.replace(regex, strings[1]);
                            menu.hidePrompt();
                        }
                    }
                });
            }
        }
	},
	"view": {
        "font": {
            "label": "Font",
            "action": ()=>{
                menu.showPrompt("value", {
                    "size": {
                        "label": "Set fontSize",
                        "callback": ()=>{editor.textarea.style.fontSize=$("#prompt-input").value;menu.hidePrompt();}
                    },
                    "family": {
                        "label": "Set fontFamily",
                        "callback": ()=>{editor.textarea.style.fontFamily=$("#prompt-input").value;menu.hidePrompt();}
                    }
                });
            }
        },
        "theme": {
            "label": "Theme",
            "action": ()=>{
                menu.showPrompt("[dark/paper]-theme.css", {
                    "theme": {
                        "label": "Set Theme",
                        "callback": ()=>{
                            $("#theme").href="themes/" + $("#prompt-input").value;
                            menu.hidePrompt();
                        }
                    }
                });
            }
        }
	},
	"tools": {
		"dictionary": {
            "label": "Dictionary",
            "action": ()=>{
                menu.showPrompt("word", {
                    "dictLookup": {
                        "label": "Search Dictionary",
                        "callback": ()=>{window.open("http://www.dictionary.com/browse/"+$("#prompt-input").value);menu.hidePrompt();}
                    },
                    "thesLookup": {
                        "label": "Search Thesaurus",
                        "callback": ()=>{window.open("http://www.thesaurus.com/browse/"+$("#prompt-input").value);menu.hidePrompt();}
                    }
                });
            }
        }
	}
};

menu.keymap = {
    "shortcuts": {
        78: menu.file.new.action, //n
        79: menu.file.open.action, //o
        83: menu.file.save.action, //s
        74: menu.file.download.action, //j
        87: menu.file.close.action, //w
        90: menu.edit.undo.action, //z
        89: menu.edit.redo.action, //y
        // Copy, cut, paste handled by default.
        70: menu.find.find.action, //f
        72: menu.find.replace.action, //h
        68: menu.tools.dictionary.action, //d
    },
    "control": {
        27: ()=>{menu.hidePrompt();}, //Esc
        38: ()=>{ //Up
            var options = document.querySelectorAll("#prompt-results li");
            menu.subMenuIndex = -1;
            for(var i in options) {
                if(options[i] === document.activeElement.parentElement){
                    menu.subMenuIndex = Number(i) - 1;
                    break;
                }
            }
            if(menu.subMenuIndex >= 0) {
                options[menu.subMenuIndex].firstChild.focus();
            }
            else {
                $("#prompt-input").focus();
            }
        },
        40: ()=>{ //Down            
            var options = document.querySelectorAll("#prompt-results li");
            menu.subMenuIndex = 0;
            for(var i in options) {
                if(options[i] === document.activeElement.parentElement){
                    menu.subMenuIndex = Number(i) + 1;
                    break;
                }
            }
            if(menu.subMenuIndex < options.length) {
                options[menu.subMenuIndex].firstChild.focus();
            }
            else {
                menu.subMenuIndex-=1;
                options[options.length-1].firstChild.focus();
            }
        }
    }
};

menu.showSubMenu = function (menuObject) {
    $("#sub-menu").style.display = "block";
    var list = $("#sub-menu ul");
    list.innerHTML = "";
    for(var item in menuObject) {
        var label = menuObject[item].label;
        var action = menuObject[item].action;
        var li = document.createElement("li");
        li.id = "sub-menu-" + item;
        li.className = "menu-item";
        li.innerHTML = `<a href="#">${label}</a>`
        list.appendChild(li);
        li.onclick = action; // Attach event in a slightly more legit way
    }
}

menu.showPrompt = function(placeholder, optionsObject) {
    $("#prompt").style.display = "block";
    var results = $("#prompt-results");
    var input = $("#prompt-input");
    input.placeholder = placeholder;
    input.value = "";
    input.focus();
    results.innerHTML = "";
    for(var item in optionsObject) {
        var label = optionsObject[item].label;
        var callback = optionsObject[item].callback;
        var li = document.createElement("li");
        li.id = "prompt-results-" + item;
        li.innerHTML = `<a href="#">${label}</a>`;
        results.appendChild(li);
        li.onclick = callback
    }
}


$("#main-menu-file").addEventListener("click", function(){menu.showSubMenu(menu.file)});
$("#main-menu-edit").addEventListener("click", function(){menu.showSubMenu(menu.edit)});
$("#main-menu-find").addEventListener("click", function(){menu.showSubMenu(menu.find)});
$("#main-menu-view").addEventListener("click", function(){menu.showSubMenu(menu.view)});
$("#main-menu-tools").addEventListener("click", function(){menu.showSubMenu(menu.tools)});



menu.hidePrompt = function() {
    $("#prompt").style.display = "none";
}
