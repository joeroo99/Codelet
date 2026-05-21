javascript:(async () => {
  const theme = {
    background: '#00330f',
    surface: '#00661f',
    text: '#f5fff8',

    largeGap: '2rem',
    gap: '0.5rem',
    fontSize: '1rem',
    detail: '0.2rem',
    font: ['Arial', 'Helvetica'],
  };
  var hoverNode;

  try {
    await loadDependencies([
      'https://unpkg.com/html2canvas@latest',
      'https://unpkg.com/jsqr@latest',
    ]);
    const qrElement = await userSelectElement();
    const url = await htmlDecode(qrElement);
    displayOutput(url);
  } catch (e) {
    alert('Unable to scan page due to an unforseen error: ' + e.message);
    throw new Error((e.message));
  }

  /* Helper functions */

  async function loadDependencies(dependencies) {
    let promises = [];
    dependencies.forEach((dependency) => {
      promises.push(loadDependency(dependency));
    });
    return Promise.all(promises);
  }

  async function loadDependency(dependency) {
    return new Promise((resolve, reject) => {
      if (document.body == null) {
        reject(new Error('Body of website is null'));
      }
      let script = document.createElement('script');
      script.src = dependency;
      script.type = 'module';
      script.async = 'async';
      script.onload = resolve;
      script.error = reject;
      document.body.appendChild(script);
    });
  }

  async function userSelectElement() {
    return new Promise((resolve, reject) => {
      try {
        const exitPortalNode = generateExitPortal();

        addEventListener('mouseover', handleMouseover);
      
        addEventListener('click', function handleClick(event) {
          console.log('Click event');
          if (exitPortalNode.contains(hoverNode)) {
            return;
          }
          event.stopPropagation();
          event.preventDefault();
          removeEventListener('mouseover', handleMouseover);
          removeEventListener('click', handleClick);
          document.body.removeChild(exitPortalNode);
          resolve(hoverNode);
        })
      } catch (e) {
        reject(new Error('Failed selecting element: ' + e.message));
      }
    });
  }

  function handleMouseover(event) {
    console.log('mouseover event');
    hoverNode = event.target;
    console.log(hoverNode);
  }

  function generateExitPortal() {
    let root = document.createElement('div');
    root = cleanStyling(root);
    root.style.zIndex = '100000';
    root.style.display = 'flex';
    root.style.flexDirection = 'row';
    root.style.gap = theme.gap;
    root.style.position = 'absolute';
    root.style.top = '0';
    root.style.margin = theme.largeGap;
    root.style.padding = theme.gap;
    root.style.background = theme.background;
    root.style.borderRadius = theme.gap;
    
    let exitButton = document.createElement('button');
    exitButton = cleanStyling(exitButton);
    exitButton.onclick = () => {
      document.body.removeChild(root);
      throw new Error('User exited selection early');
    };
    exitButton.onmouseover = () => { exitButton.style.background = theme.surface; };
    exitButton.onmouseout = () => { exitButton.style.background = 'none'; };
    exitButton.innerText = 'X';
    exitButton.style.padding = theme.gap;
    exitButton.style.color = theme.text;
    exitButton.style.borderRadius = theme.gap;
    root.appendChild(exitButton);
    
    let text = document.createElement('p');
    text = cleanStyling(text);
    text.innerText = 'Click on the QR code';
    text.style.margin = theme.gap;
    text.style.color = theme.text;
    root
      .appendChild(text);

    document.body.appendChild(root);
    return root;
  }

  async function htmlDecode(node) {
    return new Promise(async (resolve, reject) => {
      try {
        const canvas = await html2canvas(node);
        const ctx = canvas.getContext('2d');
        const imgData = ctx
          .getImageData(0, 0, canvas.width, canvas.height)
          .data;
        let code = await jsQR(imgData, canvas.width, canvas.height);
        if (code !== null) {
          code = code.data;
        }
        resolve(code);
      } catch (e) {
        reject(new Error('Failed decoding the given node: ' + e.message));
      }
    });
  }

  function displayOutput(url) {
    let root = document.createElement('div');
    root = cleanStyling(root);
    root.style.zIndex = '100000';
    root.style.display = 'flex';
    root.style.flexDirection = 'row';
    root.style.gap = theme.gap;
    root.style.position = 'absolute';
    root.style.top = '0';
    root.style.margin = theme.largeGap;
    root.style.padding = theme.gap;
    root.style.background = theme.background;
    root.style.borderRadius = theme.gap;
    
    let exitButton = document.createElement('button');
    exitButton = cleanStyling(exitButton);
    exitButton.onclick = () => { document.body.removeChild(root); };
    exitButton.onmouseover = () => { exitButton.style.background = theme.surface; };
    exitButton.onmouseout = () => { exitButton.style.background = 'none'; };
    exitButton.innerText = 'X';
    exitButton.style.padding = theme.gap;
    exitButton.style.color = theme.text;
    exitButton.style.borderRadius = theme.gap;
    root.appendChild(exitButton);
    
    let linkButton = document.createElement('a');
    linkButton = cleanStyling(linkButton);
    linkButton.onmouseover = () => { linkButton.style.background = theme.surface; };
    linkButton.onmouseout = () => { linkButton.style.background = 'none'; };
    linkButton.style.padding = theme.gap;
    linkButton.style.borderRadius = theme.gap;
    let linkContainer = document.createElement('span');
    linkContainer = cleanStyling(linkContainer);
    let linkText = document.createElement('p');
    linkText = cleanStyling(linkText);
    if (url == null) {
      linkText.innerText = 'No QR code found';
    } else {
      linkText.innerText = url;
      linkButton.href = url;
    }
    linkText.style.color = theme.text;
    root
      .appendChild(linkButton)
      .appendChild(linkContainer)
      .appendChild(linkText);

    document.body.appendChild(root);
  }

  function cleanStyling(element) {
    /*
      Since this will be rendering in a webpage with established css
      for the main content, it is necessary to clean the stying for
      the bookmarklet as much as possible
    */
    element.style.display = 'inline';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.fontSize = theme.fontSize;
    element.style.border = '0';
    element.style.borderRadius = '0';
    element.style.fontFamily = theme.font;
    element.style.opacity = 1;
    element.style.textDecoration = 'none';
    element.style.background = 'none';
    element.style.overflow = 'visible';
    return element;
  }
})();
