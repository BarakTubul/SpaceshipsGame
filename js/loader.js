
window.users = [
  { username: "p", password: "testuser" }
];

function loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
  
  function loadJS(src) {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  }
  
  function loadComponents() {
    document.querySelectorAll("[data-include]").forEach((el) => {
      const file = el.getAttribute("data-include");
      fetch(file)
        .then((res) => res.text())
        .then((data) => {
          el.innerHTML = data;
  
          const baseName = file.split('/').pop().replace('.html', '');
          const cssPath = `css/${baseName}.css`;
          const jsPath = `js/${baseName}.js`;
  
          loadCSS(cssPath);
          loadJS(jsPath);
        });
    });
  }
  
  document.addEventListener("DOMContentLoaded", loadComponents);
  