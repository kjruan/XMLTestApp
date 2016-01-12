var app = angular.module('exampleApp');

app.directive('fileReader', function() {

	function parseXml(xml) {
	   var dom = null;
	   if (window.DOMParser) {
	      try { 
	         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
	      } 
	      catch (e) { console.log(e); }
	   }
	   else if (window.ActiveXObject) {
	      try {
	         dom = new ActiveXObject('Microsoft.XMLDOM');
	         dom.async = false;
	         if (!dom.loadXML(xml)) // parse error ..
	            window.alert(dom.parseError.reason + dom.parseError.srcText);
	      } 
	      catch (e) { dom = null; }
	   }
	   else
	      alert("oops");
	   return dom;
	}

	var getDataSetCommandText = function (rdl) {
		var datasets = rdl;
		// var output = datasets.map(function (dataset) {
		// 	var dic = {};
		// 	var name = dataset['$'].Name;

		// 	dic[name] = getSpecifcAPXFunctions(dataset.Query[0].CommandText);
		// 	return dic;
		// })
		return datasets;
	}

	var getSpecifcAPXFunctions = function (query) {
		var regex = /APXUser(.\w+)(.\w+)(?!..\s)/gi;
		var output = query.map(function (str) {
			return str.match(regex);
		})
		return output
	}

	return {
		scope: {
			fileReader: '='
		},
		link: function (scope, element, attr) {
			$(element).on('change', function (changeEvent) {
				var files = changeEvent.target.files; 
				if (files.length) {
					var r = new FileReader(); 
					r.onload = function (e) {
						var contents = e.target.result; 
						scope.$apply(function() {
							scope.fileReader = xml2json(parseXml(contents), '  ');
						});
					};
					r.readAsText(files[0]);
				}
			});
		}
	}
});

