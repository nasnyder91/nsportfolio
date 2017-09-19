$(document).ready(function(){
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  var vidText = "<div class='container text-center'>"+ "~" +
    "*" + "<h1 class='display-3'>Nick Snyder | Developer</h1>"+ "~" +
    "*" + "<br><br>"+ "~" +
    "*" + "<p id='codeText'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis atque rerum tempore expedita consectetur alias ducimus id tenetur labore quasi beatae numquam, autem deserunt omnis, ut sit, nisi tempora! Laudantium!</p>"+ "~" +
    "</div>";

  var finalHTML = "<div class='container text-center'><h1 class='display-3'>Nick Snyder | Developer</h1><br><br><p id='codeText'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis atque rerum tempore expedita consectetur alias ducimus id tenetur labore quasi beatae numquam, autem deserunt omnis, ut sit, nisi tempora! Laudantium!</p></div>"
  var counter = 0;
  var timeoutValue;

  //Creates random timeout value
  function randTimeout(){
    return (Math.floor(Math.random()*(76) + 5));
  }

  //Animates writing of code on screen
  function writeCode(){
    $("#codeText").html($("#codeText").html().slice(0,-1));
    if(vidText.charAt(counter) == "~"){
      $("#codeText").append("<br>" + "|");
    }else if(vidText.charAt(counter) == "*"){
      $("#codeText").append("&nbsp; &nbsp; &nbsp; &nbsp; " + "|");
    }else{
      $("#codeText").append(escapeHTML(vidText.charAt(counter)) + "|");
    }

    if(counter+1 == vidText.length){
      $("#codeText").fadeOut(2000, function(){
        $(this).html(finalHTML);
      }).fadeIn(2000);

    }else{
      counter++;
      setTimeout(writeCode, randTimeout());
    };
  };

  function escapeHTML(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }

  writeCode();

});
