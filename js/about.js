function initAbout() {
  const authors = [
    { name: "Barak Toboul", id: "313557969" },
    { name: "Nofar Avraham", id: "211648126" }
  ];

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
      </ul>
      <p><strong>Additional Implementations:</strong><br></p>
      <ul>
        <li>A timer was added to the game screen and it's being set by the config screen</li>
      </ul>
    </div>
  `;

  if (!document.getElementById("authorsDialog")) {
    $("body").append('<div id="authorsDialog" style="display:none;"></div>');
  }

  $("#authorsDialog").html(content);

  $("#authorsDialog").dialog({
    modal: true,
    width: 450,
    title: "About",
    open: function (event, ui) {
      // Bind click outside to close
      $(document).on("mousedown.outsideDialog", function (e) {
        const $dialog = $("#authorsDialog").parent(); // the wrapper created by jQuery UI
        if (!$dialog.is(e.target) && $dialog.has(e.target).length === 0) {
          $("#authorsDialog").dialog("close");
        }
      });
    },
    close: function () {
      // Unbind when dialog closes
      $(document).off("mousedown.outsideDialog");
    }
  });
}
