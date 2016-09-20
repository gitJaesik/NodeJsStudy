window.addEventListener("load", function() {
  var formTest = window.document.getElementById("formTest");
  formTest.addEventListener("submit", function(event) {

  	if (this.messageTest.value == "") {
  		event.preventDefault();
  	}

  })
});