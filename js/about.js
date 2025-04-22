function initAbout() {
    const authors = [
      { name: "Barak Toboul", id: "313557969" },
      { name: "Nofar Avraham", id: "211648126" }
    ];
  
    // Create HTML content
    const content = `
      <div>
        <p><strong>Submitters:</strong></p>
        <ul>
          ${authors.map(author => `<li>${author.name} - ${author.id}</li>`).join("")}
        </ul>
        <p><strong>Tools Used:</strong><br>We used both <em>template</em> and <em>jQuery</em>.</p>
        <p><strong>Difficulties:</strong><br></p>
        <ul>
          <li>Understanding how to implement the different screens in different HTMLs.</li>
          <li>Adjusting code to be responsive for different screen sizes.</li>
          <li>Fitting the game into the screen without scrolling.</li>
        <ul>
        
      </div>
    `;
  
    // Inject into dialog element (or create it dynamically)
    if (!document.getElementById("authorsDialog")) {
      $("body").append('<div id="authorsDialog" style="display:none;"></div>');
    }
  
    $("#authorsDialog").html(content);
  
    // Open the dialog
    $("#authorsDialog").dialog({
      modal: true,
      width: 450,
      title: "About",
      buttons: {
        "close": function () {
          $(this).dialog("close");
        }
      }
    });
  }
  