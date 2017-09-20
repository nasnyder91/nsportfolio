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

  var contactHTML = "<form class='form-horizontal col-sm-12' action='https://formspree.io/n.a.snyder@comcast.net' method='POST'><div class='form-group'><label>Name</label><input class='form-control required' placeholder='Your name' data-placement='top' data-trigger='manual' data-content='Must be at least 3 characters long, and must only contain letters.' type='text' name='name'></div><div class='form-group'><label>E-Mail</label><input class='form-control email' placeholder='Your email' data-placement='top' data-trigger='manual' data-content='Must be a valid e-mail address (user@gmail.com)' type='text' name='_replyto'></div><div class='form-group'><label>Message</label><textarea id='contactMessage' class='form-control' placeholder='Your message..' data-placement='top' data-trigger='manual' name='body'></textarea></div><div class='form-group'><button type='submit' class='modalButton btn btn-success pull-right'>Send</button></div><input type='hidden' name='_next' value='' /></form>";

  var projectsHTML = "<div class='row'><div class='col-md-6 text-center'><a class='btn' href='#'><img id='proDisImg' src='img/ProportionDistortionIcon.png' class='img-responsive' alt=''><h2>Proportion Distortion</h2></a><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, totam enim dicta hic reprehenderit odit voluptatem nam autem quisquam consequuntur eius, et nulla quidem. Dolore.</p></div><div class='col-md-6 text-center'><a class='btn' href='#'><i class='fa fa-gamepad' aria-hidden='true' style='font-size:60px'></i><h2>Classic Games Collection</h2></a><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed vero inventore accusamus. Alias placeat non explicabo, officiis doloremque magnam dicta hic minima consequatur optio ex!</p></div></div>";

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
  };

  $("#contactBtn").click(function(){
    if(($("#bottomInfo").is(":visible")) && ($("#bottomInfo").attr("displaying") == "contact")){
      $("#bottomInfo").fadeOut("normal");
    } else if(($("#bottomInfo").is(":visible")) && ($("#bottomInfo").attr("displaying") == "projects")){
      $("#bottomInfo").fadeOut("normal",function(){
        $("#bottomInfo").html(contactHTML);
        $("#bottomInfo").fadeIn("normal");
      });
    } else{
      $("#bottomInfo").html(contactHTML);
      $("#bottomInfo").fadeIn("normal");
    }

    $("#bottomInfo").attr("displaying", "contact");
  });

  $("#projectsBtn").click(function(){
    if(($("#bottomInfo").is(":visible")) && ($("#bottomInfo").attr("displaying") == "projects")){
      $("#bottomInfo").fadeOut("normal");
    } else if(($("#bottomInfo").is(":visible")) && ($("#bottomInfo").attr("displaying") == "contact")){
      $("#bottomInfo").fadeOut("normal",function(){
        $("#bottomInfo").html(projectsHTML);
        $("#bottomInfo").fadeIn("normal");
      });
    } else{
      $("#bottomInfo").html(projectsHTML);
      $("#bottomInfo").fadeIn("normal");
    }

    $("#bottomInfo").attr("displaying", "projects");
  });

  // If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = 'Pasadena Rental Lease.pdf';

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

/**
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
