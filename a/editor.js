window.onbeforeunload = function() {
	return "";
}

window.onload = function(){
	editorInit();
};

var editor = {
	"keymap": {
		9: "\t" //tab
	},
	"insertAtCaretPosition": function(element, text) {
		// Default insertion function
		var start = element.selectionStart;
		var end = element.selectionEnd;
		var value = element.value;
		element.value = value.substring(0, start) + text + value.substring(end);
		element.selectionStart = element.selectionEnd = start + text.length;
	},
	"statusBar": $("#status-bar"),
	"setStatus": (status)=>{
		editor.statusBar.innerHTML = status;
	},
	"textarea": $("#textarea")
};

function bindKeysToElement(element, keybindings, ctrl, insertionFunction=editor.insertAtCaretPosition) {
	element.addEventListener("keydown", function(e) {
		if(ctrl === false || e.ctrlKey) {
			var action = keybindings[e.keyCode]; // Might not work
			if(typeof(action) === "function") {
				// If action is a function, execute it and prevent default action
				action();
				e.preventDefault();
				e.stopPropagation();
			}
			else if(typeof(action) != "undefined") {
				// If action is not a function, treat it as a string pass to insertion function
				insertionFunction(element, action.toString());
				e.preventDefault();
				e.stopPropagation();
			}
		}
	});
}

function editorInit() {
	// Bind keys:
	bindKeysToElement(editor.textarea, editor.keymap, false);
	bindKeysToElement(document, menu.keymap.shortcuts, true);
	bindKeysToElement($("#prompt"), menu.keymap.control, false);
	bindKeysToElement(document, {45: ()=>{menu.hidePrompt();editor.textarea.focus();}}, false);
	editor.textarea.addEventListener("focus", ()=>{
		menu.hidePrompt(); // Hide the prompt when the user clicks on the editor.textarea
	});
	menu.showSubMenu(menu.file);
	var d = new Date(); // Get current date
	$("#theme").href = (d.getHours() > 6 && d.getHours() < 20) ? "themes/paper-theme.css" : "themes/dark-theme.css"; // 
	editor.textarea.value = fileman.loadFile("untitled.txt");
    fileman.currentFile = "untitled.txt";
    document.title = "untitled.txt" + " - " + title;
    editor.setStatus("Opened file " + "untitled.txt");
}
