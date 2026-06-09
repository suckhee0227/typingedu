// node_modules/html-to-image/es/util.js
function resolveUrl(url, baseUrl) {
  if (url.match(/^[a-z]+:\/\//i)) {
    return url;
  }
  if (url.match(/^\/\//)) {
    return window.location.protocol + url;
  }
  if (url.match(/^[a-z]+:/i)) {
    return url;
  }
  const doc = document.implementation.createHTMLDocument();
  const base = doc.createElement("base");
  const a = doc.createElement("a");
  doc.head.appendChild(base);
  doc.body.appendChild(a);
  if (baseUrl) {
    base.href = baseUrl;
  }
  a.href = url;
  return a.href;
}
var uuid = /* @__PURE__ */ (() => {
  let counter = 0;
  const random = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => {
    counter += 1;
    return `u${random()}${counter}`;
  };
})();
function toArray(arrayLike) {
  const arr = [];
  for (let i = 0, l = arrayLike.length; i < l; i++) {
    arr.push(arrayLike[i]);
  }
  return arr;
}
var styleProps = null;
function getStyleProperties(options = {}) {
  if (styleProps) {
    return styleProps;
  }
  if (options.includeStyleProperties) {
    styleProps = options.includeStyleProperties;
    return styleProps;
  }
  styleProps = toArray(window.getComputedStyle(document.documentElement));
  return styleProps;
}
function px(node, styleProperty) {
  const win = node.ownerDocument.defaultView || window;
  const val = win.getComputedStyle(node).getPropertyValue(styleProperty);
  return val ? parseFloat(val.replace("px", "")) : 0;
}
function getNodeWidth(node) {
  const leftBorder = px(node, "border-left-width");
  const rightBorder = px(node, "border-right-width");
  return node.clientWidth + leftBorder + rightBorder;
}
function getNodeHeight(node) {
  const topBorder = px(node, "border-top-width");
  const bottomBorder = px(node, "border-bottom-width");
  return node.clientHeight + topBorder + bottomBorder;
}
function getImageSize(targetNode, options = {}) {
  const width = options.width || getNodeWidth(targetNode);
  const height = options.height || getNodeHeight(targetNode);
  return { width, height };
}
function getPixelRatio() {
  let ratio;
  let FINAL_PROCESS;
  try {
    FINAL_PROCESS = process;
  } catch (e) {
  }
  const val = FINAL_PROCESS && FINAL_PROCESS.env ? FINAL_PROCESS.env.devicePixelRatio : null;
  if (val) {
    ratio = parseInt(val, 10);
    if (Number.isNaN(ratio)) {
      ratio = 1;
    }
  }
  return ratio || window.devicePixelRatio || 1;
}
var canvasDimensionLimit = 16384;
function checkCanvasDimensions(canvas) {
  if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) {
    if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) {
      if (canvas.width > canvas.height) {
        canvas.height *= canvasDimensionLimit / canvas.width;
        canvas.width = canvasDimensionLimit;
      } else {
        canvas.width *= canvasDimensionLimit / canvas.height;
        canvas.height = canvasDimensionLimit;
      }
    } else if (canvas.width > canvasDimensionLimit) {
      canvas.height *= canvasDimensionLimit / canvas.width;
      canvas.width = canvasDimensionLimit;
    } else {
      canvas.width *= canvasDimensionLimit / canvas.height;
      canvas.height = canvasDimensionLimit;
    }
  }
}
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      img.decode().then(() => {
        requestAnimationFrame(() => resolve(img));
      });
    };
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.src = url;
  });
}
async function svgToDataURL(svg) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(svg)).then(encodeURIComponent).then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
}
async function nodeToDataURL(node, width, height) {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  const foreignObject = document.createElementNS(xmlns, "foreignObject");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  foreignObject.setAttribute("x", "0");
  foreignObject.setAttribute("y", "0");
  foreignObject.setAttribute("externalResourcesRequired", "true");
  svg.appendChild(foreignObject);
  foreignObject.appendChild(node);
  return svgToDataURL(svg);
}
var isInstanceOfElement = (node, instance) => {
  if (node instanceof instance)
    return true;
  const nodePrototype = Object.getPrototypeOf(node);
  if (nodePrototype === null)
    return false;
  return nodePrototype.constructor.name === instance.name || isInstanceOfElement(nodePrototype, instance);
};

// node_modules/html-to-image/es/clone-pseudos.js
function formatCSSText(style) {
  const content = style.getPropertyValue("content");
  return `${style.cssText} content: '${content.replace(/'|"/g, "")}';`;
}
function formatCSSProperties(style, options) {
  return getStyleProperties(options).map((name) => {
    const value = style.getPropertyValue(name);
    const priority = style.getPropertyPriority(name);
    return `${name}: ${value}${priority ? " !important" : ""};`;
  }).join(" ");
}
function getPseudoElementStyle(className, pseudo, style, options) {
  const selector = `.${className}:${pseudo}`;
  const cssText = style.cssText ? formatCSSText(style) : formatCSSProperties(style, options);
  return document.createTextNode(`${selector}{${cssText}}`);
}
function clonePseudoElement(nativeNode, clonedNode, pseudo, options) {
  const style = window.getComputedStyle(nativeNode, pseudo);
  const content = style.getPropertyValue("content");
  if (content === "" || content === "none") {
    return;
  }
  const className = uuid();
  try {
    clonedNode.className = `${clonedNode.className} ${className}`;
  } catch (err) {
    return;
  }
  const styleElement = document.createElement("style");
  styleElement.appendChild(getPseudoElementStyle(className, pseudo, style, options));
  clonedNode.appendChild(styleElement);
}
function clonePseudoElements(nativeNode, clonedNode, options) {
  clonePseudoElement(nativeNode, clonedNode, ":before", options);
  clonePseudoElement(nativeNode, clonedNode, ":after", options);
}

// node_modules/html-to-image/es/mimes.js
var WOFF = "application/font-woff";
var JPEG = "image/jpeg";
var mimes = {
  woff: WOFF,
  woff2: WOFF,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: JPEG,
  jpeg: JPEG,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function getExtension(url) {
  const match = /\.([^./]*?)$/g.exec(url);
  return match ? match[1] : "";
}
function getMimeType(url) {
  const extension = getExtension(url).toLowerCase();
  return mimes[extension] || "";
}

// node_modules/html-to-image/es/dataurl.js
function getContentFromDataUrl(dataURL) {
  return dataURL.split(/,/)[1];
}
function isDataUrl(url) {
  return url.search(/^(data:)/) !== -1;
}
function makeDataUrl(content, mimeType) {
  return `data:${mimeType};base64,${content}`;
}
async function fetchAsDataURL(url, init, process2) {
  const res = await fetch(url, init);
  if (res.status === 404) {
    throw new Error(`Resource "${res.url}" not found`);
  }
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => {
      try {
        resolve(process2({ res, result: reader.result }));
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(blob);
  });
}
var cache = {};
function getCacheKey(url, contentType, includeQueryParams) {
  let key = url.replace(/\?.*/, "");
  if (includeQueryParams) {
    key = url;
  }
  if (/ttf|otf|eot|woff2?/i.test(key)) {
    key = key.replace(/.*\//, "");
  }
  return contentType ? `[${contentType}]${key}` : key;
}
async function resourceToDataURL(resourceUrl, contentType, options) {
  const cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
  if (cache[cacheKey] != null) {
    return cache[cacheKey];
  }
  if (options.cacheBust) {
    resourceUrl += (/\?/.test(resourceUrl) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime();
  }
  let dataURL;
  try {
    const content = await fetchAsDataURL(resourceUrl, options.fetchRequestInit, ({ res, result }) => {
      if (!contentType) {
        contentType = res.headers.get("Content-Type") || "";
      }
      return getContentFromDataUrl(result);
    });
    dataURL = makeDataUrl(content, contentType);
  } catch (error) {
    dataURL = options.imagePlaceholder || "";
    let msg = `Failed to fetch resource: ${resourceUrl}`;
    if (error) {
      msg = typeof error === "string" ? error : error.message;
    }
    if (msg) {
      console.warn(msg);
    }
  }
  cache[cacheKey] = dataURL;
  return dataURL;
}

// node_modules/html-to-image/es/clone-node.js
async function cloneCanvasElement(canvas) {
  const dataURL = canvas.toDataURL();
  if (dataURL === "data:,") {
    return canvas.cloneNode(false);
  }
  return createImage(dataURL);
}
async function cloneVideoElement(video, options) {
  if (video.currentSrc) {
    const canvas = document.createElement("canvas");
    const ctx2 = canvas.getContext("2d");
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx2 === null || ctx2 === void 0 ? void 0 : ctx2.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL2 = canvas.toDataURL();
    return createImage(dataURL2);
  }
  const poster = video.poster;
  const contentType = getMimeType(poster);
  const dataURL = await resourceToDataURL(poster, contentType, options);
  return createImage(dataURL);
}
async function cloneIFrameElement(iframe, options) {
  var _a;
  try {
    if ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body) {
      return await cloneNode(iframe.contentDocument.body, options, true);
    }
  } catch (_b) {
  }
  return iframe.cloneNode(false);
}
async function cloneSingleNode(node, options) {
  if (isInstanceOfElement(node, HTMLCanvasElement)) {
    return cloneCanvasElement(node);
  }
  if (isInstanceOfElement(node, HTMLVideoElement)) {
    return cloneVideoElement(node, options);
  }
  if (isInstanceOfElement(node, HTMLIFrameElement)) {
    return cloneIFrameElement(node, options);
  }
  return node.cloneNode(isSVGElement(node));
}
var isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SLOT";
var isSVGElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SVG";
async function cloneChildren(nativeNode, clonedNode, options) {
  var _a, _b;
  if (isSVGElement(clonedNode)) {
    return clonedNode;
  }
  let children = [];
  if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
    children = toArray(nativeNode.assignedNodes());
  } else if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
    children = toArray(nativeNode.contentDocument.body.childNodes);
  } else {
    children = toArray(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
  }
  if (children.length === 0 || isInstanceOfElement(nativeNode, HTMLVideoElement)) {
    return clonedNode;
  }
  await children.reduce((deferred, child) => deferred.then(() => cloneNode(child, options)).then((clonedChild) => {
    if (clonedChild) {
      clonedNode.appendChild(clonedChild);
    }
  }), Promise.resolve());
  return clonedNode;
}
function cloneCSSStyle(nativeNode, clonedNode, options) {
  const targetStyle = clonedNode.style;
  if (!targetStyle) {
    return;
  }
  const sourceStyle = window.getComputedStyle(nativeNode);
  if (sourceStyle.cssText) {
    targetStyle.cssText = sourceStyle.cssText;
    targetStyle.transformOrigin = sourceStyle.transformOrigin;
  } else {
    getStyleProperties(options).forEach((name) => {
      let value = sourceStyle.getPropertyValue(name);
      if (name === "font-size" && value.endsWith("px")) {
        const reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
        value = `${reducedFont}px`;
      }
      if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && name === "display" && value === "inline") {
        value = "block";
      }
      if (name === "d" && clonedNode.getAttribute("d")) {
        value = `path(${clonedNode.getAttribute("d")})`;
      }
      targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
    });
  }
}
function cloneInputValue(nativeNode, clonedNode) {
  if (isInstanceOfElement(nativeNode, HTMLTextAreaElement)) {
    clonedNode.innerHTML = nativeNode.value;
  }
  if (isInstanceOfElement(nativeNode, HTMLInputElement)) {
    clonedNode.setAttribute("value", nativeNode.value);
  }
}
function cloneSelectValue(nativeNode, clonedNode) {
  if (isInstanceOfElement(nativeNode, HTMLSelectElement)) {
    const clonedSelect = clonedNode;
    const selectedOption = Array.from(clonedSelect.children).find((child) => nativeNode.value === child.getAttribute("value"));
    if (selectedOption) {
      selectedOption.setAttribute("selected", "");
    }
  }
}
function decorate(nativeNode, clonedNode, options) {
  if (isInstanceOfElement(clonedNode, Element)) {
    cloneCSSStyle(nativeNode, clonedNode, options);
    clonePseudoElements(nativeNode, clonedNode, options);
    cloneInputValue(nativeNode, clonedNode);
    cloneSelectValue(nativeNode, clonedNode);
  }
  return clonedNode;
}
async function ensureSVGSymbols(clone, options) {
  const uses = clone.querySelectorAll ? clone.querySelectorAll("use") : [];
  if (uses.length === 0) {
    return clone;
  }
  const processedDefs = {};
  for (let i = 0; i < uses.length; i++) {
    const use = uses[i];
    const id = use.getAttribute("xlink:href");
    if (id) {
      const exist = clone.querySelector(id);
      const definition = document.querySelector(id);
      if (!exist && definition && !processedDefs[id]) {
        processedDefs[id] = await cloneNode(definition, options, true);
      }
    }
  }
  const nodes = Object.values(processedDefs);
  if (nodes.length) {
    const ns = "http://www.w3.org/1999/xhtml";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("xmlns", ns);
    svg.style.position = "absolute";
    svg.style.width = "0";
    svg.style.height = "0";
    svg.style.overflow = "hidden";
    svg.style.display = "none";
    const defs = document.createElementNS(ns, "defs");
    svg.appendChild(defs);
    for (let i = 0; i < nodes.length; i++) {
      defs.appendChild(nodes[i]);
    }
    clone.appendChild(svg);
  }
  return clone;
}
async function cloneNode(node, options, isRoot) {
  if (!isRoot && options.filter && !options.filter(node)) {
    return null;
  }
  return Promise.resolve(node).then((clonedNode) => cloneSingleNode(clonedNode, options)).then((clonedNode) => cloneChildren(node, clonedNode, options)).then((clonedNode) => decorate(node, clonedNode, options)).then((clonedNode) => ensureSVGSymbols(clonedNode, options));
}

// node_modules/html-to-image/es/embed-resources.js
var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function toRegex(url) {
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, "g");
}
function parseURLs(cssText) {
  const urls = [];
  cssText.replace(URL_REGEX, (raw, quotation, url) => {
    urls.push(url);
    return raw;
  });
  return urls.filter((url) => !isDataUrl(url));
}
async function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
  try {
    const resolvedURL = baseURL ? resolveUrl(resourceURL, baseURL) : resourceURL;
    const contentType = getMimeType(resourceURL);
    let dataURL;
    if (getContentFromUrl) {
      const content = await getContentFromUrl(resolvedURL);
      dataURL = makeDataUrl(content, contentType);
    } else {
      dataURL = await resourceToDataURL(resolvedURL, contentType, options);
    }
    return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
  } catch (error) {
  }
  return cssText;
}
function filterPreferredFontFormat(str, { preferredFontFormat }) {
  return !preferredFontFormat ? str : str.replace(FONT_SRC_REGEX, (match) => {
    while (true) {
      const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || [];
      if (!format) {
        return "";
      }
      if (format === preferredFontFormat) {
        return `src: ${src};`;
      }
    }
  });
}
function shouldEmbed(url) {
  return url.search(URL_REGEX) !== -1;
}
async function embedResources(cssText, baseUrl, options) {
  if (!shouldEmbed(cssText)) {
    return cssText;
  }
  const filteredCSSText = filterPreferredFontFormat(cssText, options);
  const urls = parseURLs(filteredCSSText);
  return urls.reduce((deferred, url) => deferred.then((css) => embed(css, url, baseUrl, options)), Promise.resolve(filteredCSSText));
}

// node_modules/html-to-image/es/embed-images.js
async function embedProp(propName, node, options) {
  var _a;
  const propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
  if (propValue) {
    const cssString = await embedResources(propValue, null, options);
    node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
    return true;
  }
  return false;
}
async function embedBackground(clonedNode, options) {
  ;
  await embedProp("background", clonedNode, options) || await embedProp("background-image", clonedNode, options);
  await embedProp("mask", clonedNode, options) || await embedProp("-webkit-mask", clonedNode, options) || await embedProp("mask-image", clonedNode, options) || await embedProp("-webkit-mask-image", clonedNode, options);
}
async function embedImageNode(clonedNode, options) {
  const isImageElement = isInstanceOfElement(clonedNode, HTMLImageElement);
  if (!(isImageElement && !isDataUrl(clonedNode.src)) && !(isInstanceOfElement(clonedNode, SVGImageElement) && !isDataUrl(clonedNode.href.baseVal))) {
    return;
  }
  const url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
  const dataURL = await resourceToDataURL(url, getMimeType(url), options);
  await new Promise((resolve, reject) => {
    clonedNode.onload = resolve;
    clonedNode.onerror = options.onImageErrorHandler ? (...attributes) => {
      try {
        resolve(options.onImageErrorHandler(...attributes));
      } catch (error) {
        reject(error);
      }
    } : reject;
    const image = clonedNode;
    if (image.decode) {
      image.decode = resolve;
    }
    if (image.loading === "lazy") {
      image.loading = "eager";
    }
    if (isImageElement) {
      clonedNode.srcset = "";
      clonedNode.src = dataURL;
    } else {
      clonedNode.href.baseVal = dataURL;
    }
  });
}
async function embedChildren(clonedNode, options) {
  const children = toArray(clonedNode.childNodes);
  const deferreds = children.map((child) => embedImages(child, options));
  await Promise.all(deferreds).then(() => clonedNode);
}
async function embedImages(clonedNode, options) {
  if (isInstanceOfElement(clonedNode, Element)) {
    await embedBackground(clonedNode, options);
    await embedImageNode(clonedNode, options);
    await embedChildren(clonedNode, options);
  }
}

// node_modules/html-to-image/es/apply-style.js
function applyStyle(node, options) {
  const { style } = node;
  if (options.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }
  if (options.width) {
    style.width = `${options.width}px`;
  }
  if (options.height) {
    style.height = `${options.height}px`;
  }
  const manual = options.style;
  if (manual != null) {
    Object.keys(manual).forEach((key) => {
      style[key] = manual[key];
    });
  }
  return node;
}

// node_modules/html-to-image/es/embed-webfonts.js
var cssFetchCache = {};
async function fetchCSS(url) {
  let cache2 = cssFetchCache[url];
  if (cache2 != null) {
    return cache2;
  }
  const res = await fetch(url);
  const cssText = await res.text();
  cache2 = { url, cssText };
  cssFetchCache[url] = cache2;
  return cache2;
}
async function embedFonts(data, options) {
  let cssText = data.cssText;
  const regexUrl = /url\(["']?([^"')]+)["']?\)/g;
  const fontLocs = cssText.match(/url\([^)]+\)/g) || [];
  const loadFonts = fontLocs.map(async (loc) => {
    let url = loc.replace(regexUrl, "$1");
    if (!url.startsWith("https://")) {
      url = new URL(url, data.url).href;
    }
    return fetchAsDataURL(url, options.fetchRequestInit, ({ result }) => {
      cssText = cssText.replace(loc, `url(${result})`);
      return [loc, result];
    });
  });
  return Promise.all(loadFonts).then(() => cssText);
}
function parseCSS(source) {
  if (source == null) {
    return [];
  }
  const result = [];
  const commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
  let cssText = source.replace(commentsRegex, "");
  const keyframesRegex = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  while (true) {
    const matches = keyframesRegex.exec(cssText);
    if (matches === null) {
      break;
    }
    result.push(matches[0]);
  }
  cssText = cssText.replace(keyframesRegex, "");
  const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
  const combinedCSSRegex = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})";
  const unifiedRegex = new RegExp(combinedCSSRegex, "gi");
  while (true) {
    let matches = importRegex.exec(cssText);
    if (matches === null) {
      matches = unifiedRegex.exec(cssText);
      if (matches === null) {
        break;
      } else {
        importRegex.lastIndex = unifiedRegex.lastIndex;
      }
    } else {
      unifiedRegex.lastIndex = importRegex.lastIndex;
    }
    result.push(matches[0]);
  }
  return result;
}
async function getCSSRules(styleSheets, options) {
  const ret = [];
  const deferreds = [];
  styleSheets.forEach((sheet) => {
    if ("cssRules" in sheet) {
      try {
        toArray(sheet.cssRules || []).forEach((item, index) => {
          if (item.type === CSSRule.IMPORT_RULE) {
            let importIndex = index + 1;
            const url = item.href;
            const deferred = fetchCSS(url).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
              try {
                sheet.insertRule(rule, rule.startsWith("@import") ? importIndex += 1 : sheet.cssRules.length);
              } catch (error) {
                console.error("Error inserting rule from remote css", {
                  rule,
                  error
                });
              }
            })).catch((e) => {
              console.error("Error loading remote css", e.toString());
            });
            deferreds.push(deferred);
          }
        });
      } catch (e) {
        const inline = styleSheets.find((a) => a.href == null) || document.styleSheets[0];
        if (sheet.href != null) {
          deferreds.push(fetchCSS(sheet.href).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
            inline.insertRule(rule, inline.cssRules.length);
          })).catch((err) => {
            console.error("Error loading remote stylesheet", err);
          }));
        }
        console.error("Error inlining remote css file", e);
      }
    }
  });
  return Promise.all(deferreds).then(() => {
    styleSheets.forEach((sheet) => {
      if ("cssRules" in sheet) {
        try {
          toArray(sheet.cssRules || []).forEach((item) => {
            ret.push(item);
          });
        } catch (e) {
          console.error(`Error while reading CSS rules from ${sheet.href}`, e);
        }
      }
    });
    return ret;
  });
}
function getWebFontRules(cssRules) {
  return cssRules.filter((rule) => rule.type === CSSRule.FONT_FACE_RULE).filter((rule) => shouldEmbed(rule.style.getPropertyValue("src")));
}
async function parseWebFontRules(node, options) {
  if (node.ownerDocument == null) {
    throw new Error("Provided element is not within a Document");
  }
  const styleSheets = toArray(node.ownerDocument.styleSheets);
  const cssRules = await getCSSRules(styleSheets, options);
  return getWebFontRules(cssRules);
}
function normalizeFontFamily(font) {
  return font.trim().replace(/["']/g, "");
}
function getUsedFonts(node) {
  const fonts = /* @__PURE__ */ new Set();
  function traverse(node2) {
    const fontFamily = node2.style.fontFamily || getComputedStyle(node2).fontFamily;
    fontFamily.split(",").forEach((font) => {
      fonts.add(normalizeFontFamily(font));
    });
    Array.from(node2.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        traverse(child);
      }
    });
  }
  traverse(node);
  return fonts;
}
async function getWebFontCSS(node, options) {
  const rules = await parseWebFontRules(node, options);
  const usedFonts = getUsedFonts(node);
  const cssTexts = await Promise.all(rules.filter((rule) => usedFonts.has(normalizeFontFamily(rule.style.fontFamily))).map((rule) => {
    const baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
    return embedResources(rule.cssText, baseUrl, options);
  }));
  return cssTexts.join("\n");
}
async function embedWebFonts(clonedNode, options) {
  const cssText = options.fontEmbedCSS != null ? options.fontEmbedCSS : options.skipFonts ? null : await getWebFontCSS(clonedNode, options);
  if (cssText) {
    const styleNode = document.createElement("style");
    const sytleContent = document.createTextNode(cssText);
    styleNode.appendChild(sytleContent);
    if (clonedNode.firstChild) {
      clonedNode.insertBefore(styleNode, clonedNode.firstChild);
    } else {
      clonedNode.appendChild(styleNode);
    }
  }
}

// node_modules/html-to-image/es/index.js
async function toSvg(node, options = {}) {
  const { width, height } = getImageSize(node, options);
  const clonedNode = await cloneNode(node, options, true);
  await embedWebFonts(clonedNode, options);
  await embedImages(clonedNode, options);
  applyStyle(clonedNode, options);
  const datauri = await nodeToDataURL(clonedNode, width, height);
  return datauri;
}
async function toCanvas(node, options = {}) {
  const { width, height } = getImageSize(node, options);
  const svg = await toSvg(node, options);
  const img = await createImage(svg);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const ratio = options.pixelRatio || getPixelRatio();
  const canvasWidth = options.canvasWidth || width;
  const canvasHeight = options.canvasHeight || height;
  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  if (!options.skipAutoScale) {
    checkCanvasDimensions(canvas);
  }
  canvas.style.width = `${canvasWidth}`;
  canvas.style.height = `${canvasHeight}`;
  if (options.backgroundColor) {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}
async function toPng(node, options = {}) {
  const canvas = await toCanvas(node, options);
  return canvas.toDataURL();
}

// appHelper.ts
var _AppHelper = class _AppHelper {
  static async fetchRawData() {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error(`Failed to load data.json`);
    return await response.json();
  }
  static async loadAppData() {
    const data = await this.fetchRawData();
    return data.appData;
  }
  static async loadTextData() {
    const data = await this.fetchRawData();
    const textData2 = data.textData;
    if (!textData2?.default_language) {
      return textData2;
    }
    const defaultLang = textData2.default_language;
    let lang = defaultLang;
    if (textData2.supported_multiple_languages) {
      lang = new URLSearchParams(window.location.search).get("lang") || defaultLang;
    }
    const langTexts = textData2[lang];
    const texts = langTexts && Object.keys(langTexts).length > 0 ? langTexts : textData2[defaultLang] || {};
    return texts;
  }
  static async loadAssetList() {
    const data = await this.fetchRawData();
    return data.assetList;
  }
  /** 저장소 요청을 부모 창으로 보내고 응답을 기다린다. (내부 구현용) */
  static requestStorage(type, payload) {
    return new Promise((resolve, reject) => {
      if (window.parent === window) {
        reject(new Error("AppHelper.storage requires a platform (parent) window"));
        return;
      }
      const requestId = `storage-${++_AppHelper.storageSeq}-${Date.now()}`;
      const TIMEOUT_MS = 1e4;
      let timer;
      const handleResponse = (event) => {
        const msg = event.data;
        if (msg?.source !== "alparka-parent" || msg?.type !== "storage-result" || msg?.requestId !== requestId) {
          return;
        }
        cleanup();
        if (msg.ok) {
          resolve(msg.data);
          return;
        }
        if (msg.reason === "not-logged-in") {
          const fallback = type === "storage-load" ? null : type === "storage-keys" ? [] : void 0;
          resolve(fallback);
          return;
        }
        reject(new Error(msg.error || "Storage request failed"));
      };
      const cleanup = () => {
        clearTimeout(timer);
        window.removeEventListener("message", handleResponse);
      };
      timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Storage request timed out: ${type}`));
      }, TIMEOUT_MS);
      window.addEventListener("message", handleResponse);
      try {
        window.parent.postMessage(
          { source: "alparka-game-iframe", type, requestId, payload },
          "*"
        );
      } catch (err) {
        cleanup();
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }
  /**
   * 브라우저 클라이언트 좌표를 캔버스의 논리 해상도 좌표로 변환합니다.
   * AI 지침: appCanvas 규칙에 따라 모든 마우스/터치 좌표 보정에 이 함수를 사용하세요.
   * @param clientX - event.clientX
   * @param clientY - event.clientY
   * @param appCanvas - 기준이 되는 HTMLCanvasElement
   */
  static getRelativeCoordinates(clientX, clientY, appCanvas3) {
    const rect = appCanvas3.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const scaleX = appCanvas3.width / rect.width;
    const scaleY = appCanvas3.height / rect.height;
    return {
      x: x * scaleX,
      y: y * scaleY
    };
  }
  /** 기기 유형 감지 */
  static getPlatform() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || navigator.maxTouchPoints > 0 ? "mobile" : "pc";
  }
  /** 화면 방향 감지 (가로 모드 여부) */
  static isLandscape() {
    return window.innerWidth > window.innerHeight;
  }
  /** 터치 지원 여부 (PC라도 터치 모니터일 수 있음) */
  static supportsTouch() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }
  /** 텍스트를 안전한 HTML로 변환 (XSS 방어) */
  static sanitizeText(text) {
    let safe = text.replace(
      /<(script|style|iframe|svg|math|form)\b[^>]*>[\s\S]*?<\/\1>/gi,
      ""
    );
    safe = safe.replace(
      /<\/?(script|style|iframe|svg|math|form)\b[^>]*\/?>/gi,
      ""
    );
    safe = safe.replace(
      /<\/?(img|a|input|button|textarea|select|option|label|fieldset|legend|link|meta|base|video|audio|source|object|embed|span|div|table|tr|td|th|thead|tbody|tfoot|col|colgroup|caption|h[1-6]|nav|section|article|header|footer|main|aside|details|summary)\b[^>]*>/gi,
      ""
    );
    safe = safe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    safe = safe.replace(/&lt;(br)\s*\/?&gt;/gi, "<br>");
    safe = safe.replace(/&lt;(\/?(?:p|b|i|u|strong|em|small))&gt;/gi, "<$1>");
    safe = safe.replace(/&amp;#(\d+);/g, (match, num) => {
      const n = parseInt(num, 10);
      return n === 38 || n === 60 || n === 62 ? match : `&#${num};`;
    });
    safe = safe.replace(/&amp;#x([0-9a-fA-F]+);/g, (match, hex) => {
      const n = parseInt(hex, 16);
      return n === 38 || n === 60 || n === 62 ? match : `&#x${hex};`;
    });
    safe = safe.replace(/\n/g, "<br>");
    return safe;
  }
  /** DOM기반 UI 요소 생성 */
  static createUIElement(elementType, id = "", styles = {}, textContent = "", eventListeners = []) {
    const element = document.createElement(elementType);
    if (id) element.id = id;
    Object.assign(element.style, styles);
    if (styles.pointerEvents === "auto") {
      element.style.touchAction = "none";
    }
    if (textContent) {
      element.innerHTML = this.sanitizeText(textContent);
    }
    eventListeners.forEach(({ event, handler }) => {
      element.addEventListener(event, handler);
    });
    return element;
  }
  /**
   * 캔버스를 캡처하여 Data URL을 반환합니다. (내부 구현용)
   * @param includeUILayer - true이면 UI 레이어 포함, false이면 appCanvas만 캡처
   * @returns Data URL 문자열 또는 캡처 실패 시 null
   */
  static async captureCanvasAsDataUrl(includeUILayer = true) {
    const appCanvas3 = document.getElementById("appCanvas");
    const appContainer2 = document.getElementById("appContainer");
    if (!appCanvas3 || !appContainer2) return null;
    let dataUrl = null;
    try {
      if (includeUILayer) {
        const savedStyle = appContainer2.style.cssText;
        appContainer2.style.transform = "none";
        appContainer2.style.position = "relative";
        appContainer2.style.left = "0";
        appContainer2.style.top = "0";
        dataUrl = await toPng(appContainer2, {
          width: appCanvas3.width,
          height: appCanvas3.height
        });
        appContainer2.style.cssText = savedStyle;
      } else {
        dataUrl = appCanvas3.toDataURL("image/webp");
      }
    } catch (e) {
      return null;
    }
    return dataUrl && dataUrl !== "data:," ? dataUrl : null;
  }
  /**
   * 캔버스를 캡처하여 HTMLImageElement로 반환합니다.
   * AI 지침: 게임 로직에서 캡처한 이미지를 바로 사용하려면 이 함수를 사용하세요. (예: 캔버스에 다시 그리기, UI에 표시 등)
   * @param includeUILayer - true이면 UI 레이어 포함, false이면 appCanvas만 캡처
   * @returns 로드된 HTMLImageElement 또는 캡처 실패 시 null
   */
  static async captureCanvasAsImage(includeUILayer = true) {
    const dataUrl = await this.captureCanvasAsDataUrl(includeUILayer);
    if (!dataUrl) return null;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
  }
};
// ---------------------------------------------------------------------------
// 앱 저장소 — 유저별 데이터 저장/복구 (postMessage 게이트웨이)
// ---------------------------------------------------------------------------
// 앱(iframe)은 cross-origin이라 localStorage/IndexedDB를 플랫폼과 공유할 수 없으므로,
// 부모(플랫폼) 창에 postMessage로 요청을 보내고 응답을 Promise로 받는다.
// 실제 영속화는 플랫폼 → 서버에서 로그인 유저별로 처리된다.
// 비로그인 유저: 플랫폼이 reason:"not-logged-in"으로 응답 → 여기서 조용히
// graceful degrade(load→null / keys→[] / save·remove→no-op)하므로 앱 코드는
// 비로그인을 신경 쓸 필요가 없다. (네트워크/서버 오류는 그대로 throw)
_AppHelper.storageSeq = 0;
/**
 * 앱 저장소 — 로그인 유저별 데이터 저장/복구.
 * AI 지침: 게임 진행도, 점수, 유저 설정, 유저가 만든 문서 등 다음 방문 시에도
 * 유지돼야 하는 값을 저장할 때 사용하세요. localStorage/IndexedDB는 사용하지 말고
 * 반드시 이 저장소를 쓰세요.
 */
_AppHelper.storage = {
  /**
   * 유저별 데이터를 플랫폼에 저장합니다. (로그인한 유저 1명 기준)
   * data는 JSON 직렬화 가능한 plain 데이터여야 합니다. (Date/Map/Set/함수/클래스 인스턴스 불가)
   * @param key - 저장 구역을 구분하는 키 (예: "progress", "settings", "doc-1")
   * @param data - 저장할 plain 데이터
   */
  save: async (key, data) => {
    if (!key || typeof key !== "string") {
      throw new Error("AppHelper.storage.save: key must be a non-empty string");
    }
    await _AppHelper.requestStorage("storage-save", { key, data });
  },
  /**
   * 플랫폼에 저장해 둔 유저별 데이터를 불러옵니다.
   * 저장된 값이 없으면 null을 반환하므로 호출부에서 기본값 처리를 해야 합니다.
   * @param key - save에서 사용한 것과 동일한 키
   * @returns 저장된 데이터, 없으면 null
   */
  load: async (key) => {
    if (!key || typeof key !== "string") {
      throw new Error("AppHelper.storage.load: key must be a non-empty string");
    }
    const data = await _AppHelper.requestStorage("storage-load", { key });
    return data ?? null;
  },
  /**
   * 이 앱에 현재 유저가 저장해 둔 모든 key 목록을 반환합니다.
   * (예: 유저가 만든 문서/슬롯 목록 열거에 사용)
   * @returns key 문자열 배열, 저장된 게 없으면 빈 배열
   */
  keys: async () => {
    const result = await _AppHelper.requestStorage("storage-keys", {});
    return result ?? [];
  },
  /**
   * key에 저장된 데이터를 삭제합니다.
   * @param key - 삭제할 키
   */
  remove: async (key) => {
    if (!key || typeof key !== "string") {
      throw new Error("AppHelper.storage.remove: key must be a non-empty string");
    }
    await _AppHelper.requestStorage("storage-remove", { key });
  }
};
var AppHelper = _AppHelper;

// app.ts
var assetList;
var appData;
var textData;
var theme;
var mascot = "\u{1F4A7}";
var motif = "";
var layoutId = "softLeft";
var appCanvas;
var ctx;
var uiLayer;
var currentState = "START";
var cardIndex = 0;
var quizIndex = 0;
var score = 0;
var checklistStatus = [];
var quizAnswered = false;
var time = 0;
var animationFrameId = 0;
var confetti = [];
var celebrating = false;
var BUBBLES = [
  { x: 230, y: 240, r: 50, phase: 0 },
  { x: 1750, y: 880, r: 90, phase: 1.2 },
  { x: 1620, y: 170, r: 40, phase: 2.4 },
  { x: 160, y: 860, r: 70, phase: 3.6 },
  { x: 780, y: 990, r: 30, phase: 4.8 },
  { x: 90, y: 520, r: 35, phase: 0.6 }
];
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}, ${alpha})`;
}
var LAYOUTS = {
  // 정형외과 — 좌측 사이드바
  sidebarL: {
    radius: 32,
    chrome: "sidebarL",
    mascot: { left: 13.5, top: 31, size: 196 },
    short: { left: 32, top: 12, width: 63, height: 76 },
    tall: { left: 32, top: 6, width: 63, height: 88 }
  },
  // 소아과 — 상단 히어로(큰 캐릭터)
  topHero: {
    radius: 46,
    chrome: "topHero",
    mascot: { left: 50, top: 14, size: 200 },
    short: { left: 13, top: 29, width: 74, height: 68 },
    tall: { left: 11, top: 25, width: 78, height: 74 }
  },
  // 치과 — 상단 헤더바 + 중앙
  topBar: {
    radius: 28,
    chrome: "topBar",
    mascot: { left: 50, top: 9.5, size: 116 },
    short: { left: 16, top: 17, width: 68, height: 73 },
    tall: { left: 13, top: 16, width: 74, height: 81 }
  },
  // 안과 — 중앙 집중(좁은 컬럼)
  centered: {
    radius: 40,
    chrome: "none",
    mascot: { left: 50, top: 13, size: 162 },
    short: { left: 25, top: 23, width: 50, height: 71 },
    tall: { left: 22, top: 22, width: 56, height: 75 }
  },
  // 내과 — 문서/클립보드(우측 캐릭터)
  document: {
    radius: 18,
    chrome: "none",
    mascot: { left: 80, top: 33, size: 196 },
    short: { left: 5, top: 13, width: 66, height: 72 },
    tall: { left: 5, top: 7, width: 68, height: 87 }
  },
  // 요양병원 — 큰 글씨 + 하단바
  bottomBar: {
    radius: 34,
    chrome: "bottomBar",
    mascot: { left: 50, top: 10, size: 138 },
    short: { left: 9, top: 15, width: 82, height: 70 },
    tall: { left: 7, top: 14, width: 86, height: 76 }
  },
  // 산부인과 — 좌측 캐릭터 soft
  softLeft: {
    radius: 52,
    chrome: "none",
    mascot: { left: 14, top: 41, size: 208 },
    short: { left: 37, top: 12, width: 58, height: 76 },
    tall: { left: 35, top: 6, width: 60, height: 88 }
  },
  // 동물병원 — 우측 캐릭터(미러)
  mirrorR: {
    radius: 40,
    chrome: "none",
    mascot: { left: 80, top: 41, size: 208 },
    short: { left: 5, top: 12, width: 58, height: 76 },
    tall: { left: 5, top: 8, width: 58, height: 84 }
  }
};
function L() {
  return LAYOUTS[layoutId] || LAYOUTS.softLeft;
}
function injectStyles() {
  if (document.getElementById("appAnims")) return;
  const s = document.createElement("style");
  s.id = "appAnims";
  s.textContent = `
@keyframes fadeInUp { from { opacity:0; transform:translateY(48px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
@keyframes pop { 0%{transform:scale(0.6);} 60%{transform:scale(1.18);} 100%{transform:scale(1);} }
@keyframes popIn { 0%{transform:scale(0);opacity:0;} 70%{transform:scale(1.2);} 100%{transform:scale(1);opacity:1;} }
@keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-14px);} 40%{transform:translateX(14px);} 60%{transform:translateX(-9px);} 80%{transform:translateX(9px);} }
@keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.04);} }
@keyframes floatY { 0%,100%{transform:translate(-50%,-50%);} 50%{transform:translate(-50%,calc(-50% - 16px));} }
`;
  document.head.appendChild(s);
}
function clearUI() {
  while (uiLayer.firstChild) uiLayer.removeChild(uiLayer.firstChild);
}
function makeMascotEl() {
  const lay = L();
  if (!lay.mascot) return document.createElement("div");
  const sz = lay.mascot.size;
  const el = AppHelper.createUIElement("div", "", {
    position: "absolute",
    left: lay.mascot.left + "%",
    top: lay.mascot.top + "%",
    width: sz + "px",
    height: sz + "px",
    transform: "translate(-50%,-50%)",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    border: `${Math.round(sz * 0.045)}px solid ${hexToRgba(theme.charBottom, 0.9)}`,
    boxShadow: `0 14px 32px ${hexToRgba(theme.primary, 0.28)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: Math.round(sz * 0.5) + "px",
    zIndex: "3",
    pointerEvents: "none",
    animation: "floatY 3.2s ease-in-out infinite"
  }, mascot);
  return el;
}
function addChrome() {
  const lay = L();
  const grad = `linear-gradient(160deg, ${theme.primary}, ${theme.primaryDark})`;
  const common = { position: "absolute", zIndex: "0", pointerEvents: "none", background: grad };
  if (lay.chrome === "sidebarL") {
    uiLayer.appendChild(AppHelper.createUIElement("div", "", { ...common, left: "0", top: "0", width: "27%", height: "100%", borderRadius: "0 56px 56px 0" }));
  } else if (lay.chrome === "topHero") {
    uiLayer.appendChild(AppHelper.createUIElement("div", "", { ...common, left: "0", top: "0", width: "100%", height: "30%", borderRadius: "0 0 70px 70px" }));
  } else if (lay.chrome === "topBar") {
    uiLayer.appendChild(AppHelper.createUIElement("div", "", { ...common, left: "4%", top: "3.5%", width: "92%", height: "11%", borderRadius: "30px" }));
  } else if (lay.chrome === "bottomBar") {
    uiLayer.appendChild(AppHelper.createUIElement("div", "", { ...common, left: "0", bottom: "0", width: "100%", height: "9%", borderRadius: "60px 60px 0 0" }));
  }
}
function applyScreen(screen) {
  clearUI();
  addChrome();
  const lay = L();
  if (lay.mascot) uiLayer.appendChild(makeMascotEl());
  const r = screen === "START" || screen === "RESULT" ? lay.short : lay.tall;
  const card = AppHelper.createUIElement("div", "", {
    position: "absolute",
    left: r.left + "%",
    top: r.top + "%",
    width: r.width + "%",
    height: r.height + "%",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: lay.radius + "px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    boxShadow: `0 18px 40px ${hexToRgba(theme.primary, 0.18)}`,
    pointerEvents: "auto",
    fontFamily: "sans-serif",
    zIndex: "1",
    animation: "fadeInUp 0.5s ease both",
    overflow: "hidden"
  });
  uiLayer.appendChild(card);
  return card;
}
function setStyle(el, s) {
  Object.assign(el.style, s);
}
function showScreen(state) {
  currentState = state;
  celebrating = false;
  confetti = [];
  if (state === "START") renderStart();
  else if (state === "CARDS") renderCards();
  else if (state === "CHECKLIST") renderChecklist();
  else if (state === "QUIZ") {
    quizAnswered = false;
    renderQuiz();
  } else if (state === "RESULT") renderResult();
}
function renderStart() {
  const c = applyScreen("START");
  setStyle(c, { justifyContent: "center", padding: "4% 6%", rowGap: "3%" });
  const tg = AppHelper.createUIElement("div", "", { textAlign: "center" });
  tg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "34px", color: theme.primary, fontWeight: "bold", marginBottom: "14px" }, textData.startSub));
  tg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "60px", color: "#333", fontWeight: "900", lineHeight: "1.25", whiteSpace: "pre-line" }, textData.startTitle));
  c.appendChild(tg);
  c.appendChild(AppHelper.createUIElement("div", "", { fontSize: "36px", color: "#666", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.45" }, textData.startDesc));
  const guide = AppHelper.createUIElement("div", "", { display: "flex", width: "94%", justifyContent: "space-between", columnGap: "3%" });
  for (const g of textData.usageGuide) {
    const cell = AppHelper.createUIElement("div", "", { flex: "1", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: hexToRgba(theme.primary, 0.08), borderRadius: "20px", padding: "14px 6px", rowGap: "8px" });
    cell.appendChild(AppHelper.createUIElement("div", "", { fontSize: "36px" }, g.icon));
    cell.appendChild(AppHelper.createUIElement("div", "", { fontSize: "23px", color: "#555", textAlign: "center", lineHeight: "1.3", whiteSpace: "pre-line" }, g.label));
    guide.appendChild(cell);
  }
  c.appendChild(guide);
  c.appendChild(AppHelper.createUIElement("button", "startBtn", {
    width: "82%",
    minHeight: "108px",
    padding: "18px 0",
    marginTop: "1%",
    fontSize: "48px",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    backgroundColor: theme.primary,
    color: "#FFF",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: `0 10px 24px ${hexToRgba(theme.primary, 0.35)}`,
    animation: "pulse 2s ease-in-out infinite"
  }, textData.startBtn, [{ event: "click", handler: () => showScreen("CARDS") }]));
}
function renderCards() {
  const total = textData.cards.length;
  const card = textData.cards[cardIndex];
  const isLast = cardIndex === total - 1;
  const c = applyScreen("CARDS");
  setStyle(c, { justifyContent: "flex-start", padding: "4% 5% 5%" });
  const header = AppHelper.createUIElement("div", "", { width: "100%", textAlign: "center", marginBottom: "2%" });
  header.appendChild(AppHelper.createUIElement("div", "", { fontSize: "30px", color: theme.primary, fontWeight: "bold" }, `${textData.cardsTitle}  ${cardIndex + 1} / ${total}`));
  c.appendChild(header);
  const middle = AppHelper.createUIElement("div", "", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "4%" });
  const box = AppHelper.createUIElement("div", "", { width: "86%", backgroundColor: hexToRgba(theme.primary, 0.07), border: `3px solid ${hexToRgba(theme.primary, 0.25)}`, borderRadius: "30px", padding: "5% 6%", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "20px", animation: "slideIn 0.3s ease both" });
  box.appendChild(AppHelper.createUIElement("div", "", { width: "140px", height: "140px", minHeight: "140px", borderRadius: "50%", backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "78px", boxShadow: `0 8px 20px ${hexToRgba(theme.primary, 0.2)}` }, card.icon));
  if (card.title) {
    box.appendChild(AppHelper.createUIElement("div", "", { fontSize: "48px", color: "#333", fontWeight: "900", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.3" }, card.title));
    box.appendChild(AppHelper.createUIElement("div", "", { fontSize: "36px", color: "#555", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.5" }, card.desc));
  } else {
    box.appendChild(AppHelper.createUIElement("div", "", { fontSize: "44px", color: "#333", fontWeight: "bold", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.45" }, card.desc));
  }
  const dots = AppHelper.createUIElement("div", "", { display: "flex", columnGap: "14px", justifyContent: "center", marginTop: "1%" });
  for (let i = 0; i < total; i++) dots.appendChild(AppHelper.createUIElement("div", "", { width: i === cardIndex ? "42px" : "16px", height: "16px", borderRadius: "8px", backgroundColor: i === cardIndex ? theme.primary : hexToRgba(theme.primary, 0.25), transition: "all 0.25s" }));
  middle.appendChild(box);
  middle.appendChild(dots);
  c.appendChild(middle);
  const nav = AppHelper.createUIElement("div", "", { width: "100%", display: "flex", justifyContent: "space-between", columnGap: "4%", marginTop: "2%" });
  nav.appendChild(AppHelper.createUIElement("button", "", { width: "26%", minHeight: "92px", padding: "16px 0", fontSize: "36px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: cardIndex === 0 ? "#EEE" : "#FFF", color: cardIndex === 0 ? "#BBB" : theme.primary, border: `3px solid ${cardIndex === 0 ? "#EEE" : hexToRgba(theme.primary, 0.4)}`, borderRadius: "50px", cursor: cardIndex === 0 ? "default" : "pointer" }, textData.cardPrev, [{ event: "click", handler: () => {
    if (cardIndex > 0) {
      cardIndex--;
      renderCards();
    }
  } }]));
  nav.appendChild(AppHelper.createUIElement("button", "", { flex: "1", minHeight: "92px", padding: "16px 0", fontSize: "38px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer", boxShadow: `0 8px 18px ${hexToRgba(theme.primary, 0.3)}` }, isLast ? textData.cardDone : textData.cardNext, [{ event: "click", handler: () => {
    if (isLast) {
      cardIndex = 0;
      showScreen("CHECKLIST");
    } else {
      cardIndex++;
      renderCards();
    }
  } }]));
  c.appendChild(nav);
}
function renderChecklist() {
  const c = applyScreen("CHECKLIST");
  setStyle(c, { justifyContent: "flex-start", padding: "4% 5% 5%" });
  const total = textData.checklistItems.length;
  const done = checklistStatus.filter(Boolean).length;
  const hg = AppHelper.createUIElement("div", "", { textAlign: "center", marginBottom: "1.5%", width: "100%" });
  hg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "46px", color: theme.primary, fontWeight: "900", marginBottom: "6px" }, textData.checklistTitle));
  hg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "28px", color: "#666", whiteSpace: "pre-line" }, textData.checklistDesc));
  c.appendChild(hg);
  const pw = AppHelper.createUIElement("div", "", { width: "100%", marginBottom: "2%", display: "flex", flexDirection: "column", alignItems: "center" });
  pw.appendChild(AppHelper.createUIElement("div", "", { fontSize: "28px", color: theme.primary, fontWeight: "bold", marginBottom: "8px" }, (textData.checklistProgress || "{done}/{total}").replace("{done}", String(done)).replace("{total}", String(total))));
  const track = AppHelper.createUIElement("div", "", { width: "86%", height: "14px", backgroundColor: "#EFECEA", borderRadius: "10px", overflow: "hidden" });
  track.appendChild(AppHelper.createUIElement("div", "", { width: `${done / total * 100}%`, height: "100%", backgroundColor: theme.primary, borderRadius: "10px", transition: "width 0.35s ease" }));
  pw.appendChild(track);
  c.appendChild(pw);
  const list = AppHelper.createUIElement("div", "", { width: "100%", flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", rowGap: "10px" });
  for (let i = 0; i < total; i++) {
    const on = checklistStatus[i];
    const it = textData.checklistItems[i];
    const row = AppHelper.createUIElement("div", "", { width: "100%", flex: "1", minHeight: "0", display: "flex", alignItems: "center", backgroundColor: on ? hexToRgba(theme.primary, 0.08) : "#F8F8F8", borderRadius: "18px", padding: "0 3.5%", boxSizing: "border-box", cursor: "pointer", border: on ? `3px solid ${theme.primary}` : "3px solid transparent", transition: "all 0.2s" }, "", [{ event: "click", handler: () => {
      checklistStatus[i] = !checklistStatus[i];
      renderChecklist();
    } }]);
    row.appendChild(AppHelper.createUIElement("div", "", { width: "60px", height: "60px", minWidth: "60px", borderRadius: "16px", backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", marginRight: "3.5%", boxShadow: on ? `0 4px 12px ${hexToRgba(theme.primary, 0.25)}` : "0 2px 8px rgba(0,0,0,0.06)" }, it.icon));
    row.appendChild(AppHelper.createUIElement("div", "", { fontSize: "30px", color: on ? "#333" : "#777", fontWeight: on ? "bold" : "normal", flex: "1", lineHeight: "1.3" }, it.label));
    const ck = AppHelper.createUIElement("div", "", { width: "48px", height: "48px", minWidth: "48px", borderRadius: "24px", border: on ? "none" : "4px solid #CCC", backgroundColor: on ? theme.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "2.5%", boxSizing: "border-box" });
    if (on) {
      ck.style.animation = "pop 0.3s ease";
      ck.appendChild(AppHelper.createUIElement("div", "", { color: "#FFF", fontSize: "30px", fontWeight: "bold" }, "\u2713"));
    }
    row.appendChild(ck);
    list.appendChild(row);
  }
  c.appendChild(list);
  const all = checklistStatus.every(Boolean);
  c.appendChild(AppHelper.createUIElement("div", "", { fontSize: "25px", color: "#AAA", marginTop: "1.5%", textAlign: "center", opacity: all ? "0" : "1", transition: "opacity 0.3s" }, textData.checklistHint || ""));
  c.appendChild(AppHelper.createUIElement("button", "checkNextBtn", { width: "80%", minHeight: "92px", padding: "16px 0", marginTop: "1.5%", fontSize: "40px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: all ? theme.primary : "#DDD", color: "#FFF", border: "none", borderRadius: "50px", cursor: all ? "pointer" : "not-allowed", boxShadow: all ? `0 10px 20px ${hexToRgba(theme.primary, 0.3)}` : "none", transition: "background-color 0.3s", animation: all ? "pop 0.3s ease" : "none" }, textData.checklistNext, [{ event: "click", handler: () => {
    if (all) showScreen("QUIZ");
  } }]));
}
function renderQuiz() {
  const q = textData.quizItems[quizIndex];
  const total = textData.quizItems.length;
  const isLast = quizIndex === total - 1;
  const c = applyScreen("QUIZ");
  setStyle(c, { justifyContent: "flex-start", padding: "5% 5% 6%" });
  const track = AppHelper.createUIElement("div", "", { width: "100%", height: "14px", backgroundColor: "#EFECEA", borderRadius: "10px", overflow: "hidden", marginBottom: "2%" });
  track.appendChild(AppHelper.createUIElement("div", "", { width: `${(quizIndex + 1) / total * 100}%`, height: "100%", backgroundColor: theme.primary, borderRadius: "10px", transition: "width 0.35s ease" }));
  c.appendChild(track);
  const mid = AppHelper.createUIElement("div", "", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "6%" });
  const hg = AppHelper.createUIElement("div", "", { width: "100%", textAlign: "center" });
  hg.appendChild(AppHelper.createUIElement("div", "", { display: "inline-block", backgroundColor: theme.primary, color: "#FFF", fontSize: "32px", fontWeight: "bold", padding: "9px 28px", borderRadius: "30px", marginBottom: "22px" }, `Q${quizIndex + 1} / ${total}`));
  hg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "50px", color: "#333", fontWeight: "900", whiteSpace: "pre-line", lineHeight: "1.5" }, q.q));
  const ox = AppHelper.createUIElement("div", "", { display: "flex", width: "88%", height: "180px", minHeight: "180px", justifyContent: "space-between" });
  const bO = AppHelper.createUIElement("button", "btnO", { width: "45%", height: "100%", fontSize: "120px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: "#4CAF50", color: "#FFF", border: "none", borderRadius: "36px", boxShadow: "0 10px 20px rgba(76,175,80,0.4)", cursor: "pointer", transition: "all 0.3s" }, "O");
  const bX = AppHelper.createUIElement("button", "btnX", { width: "45%", height: "100%", fontSize: "120px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: "#F44336", color: "#FFF", border: "none", borderRadius: "36px", boxShadow: "0 10px 20px rgba(244,67,54,0.4)", cursor: "pointer", transition: "all 0.3s" }, "X");
  ox.appendChild(bO);
  ox.appendChild(bX);
  const fb = AppHelper.createUIElement("div", "", { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "16px", opacity: "0", transition: "opacity 0.3s" });
  const mark = AppHelper.createUIElement("div", "", { fontSize: "54px", fontWeight: "900" });
  const expl = AppHelper.createUIElement("div", "", { fontSize: "36px", color: "#555", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.5", width: "95%" });
  const nx = AppHelper.createUIElement("button", "nextBtn", { width: "80%", minHeight: "100px", padding: "18px 0", marginTop: "8px", fontSize: "42px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer", boxShadow: `0 8px 18px ${hexToRgba(theme.primary, 0.3)}` }, isLast ? textData.lastBtn || textData.nextBtn : textData.nextBtn);
  fb.appendChild(mark);
  fb.appendChild(expl);
  fb.appendChild(nx);
  mid.appendChild(hg);
  mid.appendChild(ox);
  mid.appendChild(fb);
  c.appendChild(mid);
  const ans = (a) => {
    if (quizAnswered) return;
    quizAnswered = true;
    const ok = a === q.a;
    if (ok) score++;
    bO.style.opacity = a === "O" ? "1" : "0.3";
    bX.style.opacity = a === "X" ? "1" : "0.3";
    (a === "O" ? bO : bX).style.animation = ok ? "pop 0.4s ease" : "shake 0.4s ease";
    mark.textContent = ok ? textData.correctText || "\uC815\uB2F5\uC774\uC5D0\uC694!" : textData.wrongText || "\uB2E4\uC2DC \uD655\uC778\uD574\uC694";
    mark.style.color = ok ? "#4CAF50" : "#F44336";
    mark.style.animation = "popIn 0.4s ease both";
    expl.textContent = q.expl;
    fb.style.opacity = "1";
    nx.addEventListener("click", () => {
      quizIndex++;
      if (quizIndex >= total) showScreen("RESULT");
      else showScreen("QUIZ");
    });
  };
  bO.addEventListener("click", () => ans("O"));
  bX.addEventListener("click", () => ans("X"));
}
function renderResult() {
  const total = textData.quizItems.length;
  const perfect = score === total;
  if (perfect) startCelebration();
  const c = applyScreen("RESULT");
  setStyle(c, { justifyContent: "center", padding: "5% 6%", rowGap: "3%" });
  const h = AppHelper.createUIElement("div", "", { textAlign: "center" });
  h.appendChild(AppHelper.createUIElement("div", "", { fontSize: "60px", color: theme.primary, fontWeight: "900", marginBottom: "14px" }, textData.resultTitle));
  h.appendChild(AppHelper.createUIElement("div", "", { fontSize: "34px", color: "#555", whiteSpace: "pre-line", lineHeight: "1.5" }, perfect ? textData.resultPerfect : textData.resultGood));
  c.appendChild(h);
  const sg = AppHelper.createUIElement("div", "", { display: "flex", flexDirection: "column", alignItems: "center", rowGap: "10px" });
  sg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "34px", color: "#666" }, textData.resultScore));
  sg.appendChild(AppHelper.createUIElement("div", "", { display: "inline-block", fontSize: "64px", color: "#FFF", backgroundColor: perfect ? theme.primary : "#333", padding: "14px 52px", borderRadius: "50px", fontWeight: "bold", letterSpacing: "5px", animation: "popIn 0.5s ease both" }, `${score} / ${total}`));
  c.appendChild(sg);
  const ct = textData.contact;
  const cc = AppHelper.createUIElement("div", "", { width: "88%", backgroundColor: hexToRgba(theme.primary, 0.08), borderRadius: "26px", padding: "22px 30px", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "8px" });
  cc.appendChild(AppHelper.createUIElement("div", "", { fontSize: "32px", color: "#333", fontWeight: "900" }, `\u{1F3E5}  ${ct.name}`));
  cc.appendChild(AppHelper.createUIElement("div", "", { fontSize: "38px", color: theme.primary, fontWeight: "bold" }, `\u{1F4DE}  ${ct.phone}`));
  cc.appendChild(AppHelper.createUIElement("div", "", { fontSize: "27px", color: "#777" }, `\u{1F558}  ${ct.hours}`));
  if (ct.note) cc.appendChild(AppHelper.createUIElement("div", "", { fontSize: "26px", color: "#888", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.4", marginTop: "4px" }, ct.note));
  c.appendChild(cc);
  c.appendChild(AppHelper.createUIElement("button", "restartBtn", { width: "80%", minHeight: "104px", padding: "18px 0", marginTop: "1%", fontSize: "44px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer", boxShadow: `0 10px 20px ${hexToRgba(theme.primary, 0.3)}` }, textData.restartBtn, [{ event: "click", handler: () => {
    quizIndex = 0;
    score = 0;
    cardIndex = 0;
    for (let i = 0; i < checklistStatus.length; i++) checklistStatus[i] = false;
    showScreen("START");
  } }]));
}
function startCelebration() {
  celebrating = true;
  confetti = [];
  const cols = [theme.primary, theme.primaryDark, "#4CAF50", "#FFD54F", "#FF69B4", "#80DEEA"];
  for (let i = 0; i < 80; i++) confetti.push({ x: Math.random() * appData.logicalWidth, y: -Math.random() * appData.logicalHeight * 0.4, vx: (Math.random() - 0.5) * 4, vy: 4 + Math.random() * 6, size: 14 + Math.random() * 18, color: cols[Math.floor(Math.random() * cols.length)], rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3 });
}
function drawConfetti() {
  if (!celebrating) return;
  for (const p of confetti) {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.y > appData.logicalHeight + 40) {
      p.y = -40;
      p.x = Math.random() * appData.logicalWidth;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  }
}
function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, appCanvas.height);
  g.addColorStop(0, theme.bgTop);
  g.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, appCanvas.width, appCanvas.height);
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const b of BUBBLES) {
    const dy = Math.sin(time * 0.8 + b.phase) * 25;
    if (motif) {
      ctx.globalAlpha = 0.15;
      ctx.font = `${b.r * 1.9}px sans-serif`;
      ctx.fillText(motif, b.x, b.y + dy);
    } else {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath();
      ctx.arc(b.x, b.y + dy, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}
function loop() {
  time += 0.016;
  ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
  drawBackground();
  drawConfetti();
  animationFrameId = requestAnimationFrame(loop);
}
async function initApp() {
  appData = await AppHelper.loadAppData();
  textData = await AppHelper.loadTextData();
  assetList = await AppHelper.loadAssetList();
  theme = textData.theme;
  mascot = textData.mascot || "\u{1F4A7}";
  motif = textData.motif || "";
  layoutId = textData.layout || "softLeft";
  appCanvas = document.getElementById("appCanvas");
  uiLayer = document.getElementById("uiLayer");
  appCanvas.width = appData.logicalWidth;
  appCanvas.height = appData.logicalHeight;
  ctx = appCanvas.getContext("2d");
  injectStyles();
  checklistStatus = new Array(textData.checklistItems.length).fill(false);
  showScreen("START");
  loop();
}

// main.ts
var logicalWidth = 0;
var logicalHeight = 0;
var appCanvas2 = document.getElementById("appCanvas");
var uiLayer2 = document.getElementById("uiLayer");
var appContainer = document.getElementById("appContainer");
var isCanvasLayoutUpdating = false;
function UpdateCanvasLayout() {
  if (!isCanvasLayoutUpdating) {
    window.requestAnimationFrame(() => {
      isCanvasLayoutUpdating = true;
      if (appCanvas2.width !== 1 && appCanvas2.height !== 1) {
        if (logicalWidth === 0 && logicalHeight === 0) {
          logicalWidth = appCanvas2.width;
          logicalHeight = appCanvas2.height;
        }
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        appContainer.style.cssText = "";
        appCanvas2.style.cssText = "";
        uiLayer2.style.cssText = "";
        const aspectCanvas = appCanvas2.width / appCanvas2.height;
        let displayWidth;
        let displayHeight;
        if (vw / vh > aspectCanvas) {
          displayHeight = vh;
          displayWidth = vh * aspectCanvas;
        } else {
          displayWidth = vw;
          displayHeight = vw / aspectCanvas;
        }
        const appContainerScale = displayWidth / appCanvas2.width;
        appContainer.style.position = "absolute";
        appContainer.style.width = appCanvas2.width + "px";
        appContainer.style.height = appCanvas2.height + "px";
        appContainer.style.transformOrigin = "top left";
        appContainer.style.transform = `scale(${appContainerScale})`;
        appContainer.style.left = (vw - displayWidth) / 2 + "px";
        appContainer.style.top = (vh - displayHeight) / 2 + "px";
        appCanvas2.style.position = "absolute";
        appCanvas2.style.width = appCanvas2.width + "px";
        appCanvas2.style.height = "auto";
        appCanvas2.style.top = "0";
        appCanvas2.style.left = "0";
        appCanvas2.style.touchAction = "none";
        const uiLayerScale = appCanvas2.width / logicalWidth;
        ;
        uiLayer2.style.position = "absolute";
        uiLayer2.style.width = logicalWidth + "px";
        uiLayer2.style.height = logicalHeight + "px";
        uiLayer2.style.transformOrigin = "top left";
        uiLayer2.style.transform = `scale(${uiLayerScale})`;
        uiLayer2.style.top = "0";
        uiLayer2.style.left = "0";
      }
      isCanvasLayoutUpdating = false;
    });
  }
}
function SetCanvasFocus() {
  if (document.activeElement !== appCanvas2) {
    window.focus();
    appCanvas2.focus();
  }
}
var resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.target === appCanvas2) {
      UpdateCanvasLayout();
    }
  }
});
var isCapturing = false;
var lastPingTime = 0;
var lastCaptureTime = 0;
var lastResolutionTime = 0;
var MIN_PARENT_MESSAGE_INTERVAL = 1e3;
window.parent.postMessage({
  source: "typingx-x-iframe",
  type: "ping-pong-ready"
}, "*");
window.addEventListener("message", async (event) => {
  if (!event.data || event.data.source !== "alparka-parent") return;
  const now = Date.now();
  if (event.data.type === "ping" && now - lastPingTime > MIN_PARENT_MESSAGE_INTERVAL) {
    lastPingTime = now;
    window.parent.postMessage({
      source: "typingx-x-iframe",
      type: "pong"
    }, "*");
  } else if (event.data.type === "request-canvas-capture" && now - lastCaptureTime > MIN_PARENT_MESSAGE_INTERVAL && !isCapturing) {
    lastCaptureTime = now;
    isCapturing = true;
    try {
      const dataUrl = await AppHelper.captureCanvasAsDataUrl(true);
      if (dataUrl) {
        window.parent.postMessage({
          source: "typingx-x-iframe",
          type: "canvas-capture",
          payload: { dataUrl }
        }, "*");
      }
    } finally {
      isCapturing = false;
    }
  } else if (event.data.type === "request-app-resolution" && now - lastResolutionTime > MIN_PARENT_MESSAGE_INTERVAL) {
    lastResolutionTime = now;
    window.parent.postMessage({
      source: "typingx-x-iframe",
      type: "app-resolution",
      payload: { width: appCanvas2.width, height: appCanvas2.height }
    }, "*");
  }
});
window.addEventListener("resize", UpdateCanvasLayout);
appCanvas2.addEventListener("pointerdown", SetCanvasFocus);
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    resizeObserver.observe(appCanvas2);
    initApp();
    SetCanvasFocus();
    UpdateCanvasLayout();
  }, 0);
});
