// All functions to go inside container object

var fileman = {
	"prefix": "AA",
	"uuid": "6df2b13b-b747-4240-81cd-34da1cc1f379",
	"localStorageSupport": (typeof(Storage) == "undefined") ? false : true,
	"newFile": function(filename) {
		// STOP OVERWRITING STUFF YOU NUT
		localStorage.setItem(this.prefix + this.uuid + "/" + filename, "");
	},
	"loadFile": function(filename) {
		// CHECK FILE EXISTS
		return localStorage.getItem(this.prefix + this.uuid + "/" + filename);
	},
	"saveFile": function(filename, data) {
		localStorage.setItem(this.prefix + this.uuid + "/" + filename, data);
	},
	"currentFile": "untitled.txt"
};