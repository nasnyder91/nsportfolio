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
    "*" + "<h1 class='display-3'>Nick Snyder <span class='orange'>|</span> <span class='blue'>Developer</span></h1>"+ "~" +
    "*" + "<br><br>"+ "~" +
    "*" + "<h2>Welcome to my portfolio</h2>"+ "~" +
    "</div>";

  var finalHTML = $("#finalHTML");

  var contactForm = $("#contactForm");

  var form = $("#theForm");

  var projectsInfo = $("#projectsInfo");

  var counter = 0;
  var timeoutValue;

  var inQuote = false;
  var quoteArr = [];

  $('#theForm').on('submit', function(e) {
       e.preventDefault();

       var name = $('#name').val();

       var email = $('#email').val();

       var comments = $('#contactMessage').val();

       if(form[0].checkValidity()){
         $.ajax({
             url:'https://formspree.io/n.a.snyder@comcast.net',
             method:'POST',
             data:{
                 name:name,
                 _replyto:email,
                  email:email,
                 comments:comments,
                 _subject:'Portfolio form submission',
             },
             dataType:"json",
             success:function() {
                 console.log('success');
                 $('#formThankYou').show();
                 $('#name').val('');
                 $('#email').val('');
                 $('#contactMessage').val('');
             }

         });
       } else{
         console.log("not valid");
         form.find(':submit').click();
       }
   });

  //Creates random timeout value
  function randTimeout(){
    return (Math.floor(Math.random()*(61) + 20));
  }

  String.prototype.replaceAll = function(search, replace)
  {
      //if replace is not sent, return original string otherwise it will
      //replace search string with 'undefined'.
      if (replace === undefined) {
          return this.toString();
      }

      return this.split(search).join(replace);
  };

  function colorText(input){
    var output = input;
    output = output.replaceAll("&lt;div", "&lt;<span style='color:red;'>div</span>");
    output = output.replaceAll("div&gt;", "<span style='color:red;'>div</span>&gt;");

    output = output.replaceAll("&lt;h1", "&lt;<span style='color:red;'>h1</span>");
    output = output.replaceAll("h1&gt;", "<span style='color:red;'>h1</span>&gt;");

    output = output.replaceAll("&lt;h2", "&lt;<span style='color:red;'>h2</span>");
    output = output.replaceAll("h2&gt;", "<span style='color:red;'>h2</span>&gt;");

    output = output.replaceAll("&lt;span", "&lt;<span style='color:red;'>span</span>");
    output = output.replaceAll("span&gt;", "<span style='color:red;'>span</span>&gt;");

    output = output.replaceAll("br&gt;", "<span style='color:red;'>br</span>&gt;");

    output = output.replaceAll("class=", "<span style='color:orange;'>class</span>=");

    output = output.replaceAll("id=", "<span style='color:blue;'>id</span>=");

    return output;
  }


  //Animates writing of code on screen
  function writeCode(){
    $("#codeText").html($("#codeText").html().slice(0,-1));


    if(vidText.charAt(counter) == "~"){
      $("#codeText").append("<br>" + "|");
    }else if(vidText.charAt(counter) == "*"){
      $("#codeText").append("&nbsp; &nbsp; &nbsp; &nbsp; " + "|");
    }else if((vidText.charAt(counter) == "'") && (inQuote == false)){
      $("#codeText").append("<span style='color:green;'>" + escapeHTML(vidText.charAt(counter)) + "</span>" + "|");
      inQuote = true;
    }else if((vidText.charAt(counter) == "'") && (inQuote == true)){
      $("#codeText").append("<span style='color:#24cc18;'>" + escapeHTML(vidText.charAt(counter)) + "</span>" + "|");
      inQuote = false;
    } else{
      if(inQuote == true){
        $("#codeText").append("<span style='color:#24cc18;'>" + escapeHTML(vidText.charAt(counter)) + "</span>" + "|");
      }else{
        $("#codeText").append(escapeHTML(vidText.charAt(counter)) + "|");
      }
    }


    $("#codeText").html(colorText($("#codeText").html()));

    if(counter+1 == vidText.length){
      $("#codeText").fadeOut(2000, function(){
        $(finalHTML).fadeIn(2000);
      });

    }else{
      counter++;
      setTimeout(writeCode, randTimeout());
    };
  };

  function escapeHTML(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  };

  $("#contactBtn").click(function(){
    if($("#bottomInfo").attr("displaying") == "projects"){
      $("#bottomInfo").fadeOut("normal",function(){
      $(contactForm).show();
      $("#bottomInfo").fadeIn("normal");
      $(projectsInfo).hide();
      $("#bottomInfo").attr("displaying", "contact");
      });
    };
  });

  $("#projectsBtn").click(function(){
    if($("#bottomInfo").attr("displaying") == "contact"){
      $("#bottomInfo").fadeOut("normal",function(){
      $(contactForm).hide();
      $(projectsInfo).show();
      $("#bottomInfo").fadeIn("normal");
      $("#bottomInfo").attr("displaying", "projects");
      });
    };
  });

  // If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = 'resume.pdf';

// Disable workers to avoid yet another cross-origin issue (workers need
// the URL of the script to be loaded, and dynamically loading a cross-origin
// script does not work).
 PDFJS.disableWorker = true;

// The workerSrc property shall be specified.
PDFJS.workerSrc = 'js/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    canvas = document.getElementById('resumeCanvas'),
    ctx = canvas.getContext('2d'),
    scale = 2.0;

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport(scale);
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });

  // Update page counters
  document.getElementById('page_num').textContent = pageNum;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

/*
 * Asynchronously downloads PDF.
 */
PDFJS.getDocument(url).then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;
  document.getElementById('page_count').textContent = pdfDoc.numPages;

  // Initial/first page rendering
  renderPage(pageNum);
});

  writeCode();

});
