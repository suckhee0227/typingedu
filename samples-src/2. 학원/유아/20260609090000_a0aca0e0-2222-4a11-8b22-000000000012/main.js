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
var brandIcon = "\u{1F4D0}";
var appCanvas;
var ctx;
var uiLayer;
var currentState = "START";
var cardIndex = 0;
var quizIndex = 0;
var score = 0;
var points = 0;
var checklistStatus = [];
var quizAnswered = false;
var time = 0;
var animationFrameId = 0;
var confetti = [];
var celebrating = false;
var POINT_PER_Q = 10;

var DOODLES = [
  { x: 240, y: 250, s: 120, ch: "✏️", phase: 0.0 },
  { x: 1680, y: 240, s: 150, ch: "\u{1F4D0}", phase: 1.3 },
  { x: 1560, y: 880, s: 130, ch: "\u{1F4DA}", phase: 2.5 },
  { x: 200, y: 860, s: 130, ch: "\u{1F522}", phase: 3.6 },
  { x: 960, y: 1010, s: 100, ch: "➗", phase: 4.7 },
  { x: 70, y: 540, s: 90, ch: "\u{1F4CF}", phase: 0.7 }
];

var STEP_LABELS = ["시작", "학습 카드", "점검", "퀴즈", "완료"];
var STATE_STEP = { START: 0, CARDS: 1, CHECKLIST: 2, QUIZ: 3, RESULT: 4 };
var MARGIN = "#E8857F"; // 노트 빨간 마진선

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}, ${alpha})`;
}
function el(tag, styles, text, ev) { return AppHelper.createUIElement(tag, "", styles || {}, text || "", ev || []); }
function setStyle(node, s) { Object.assign(node.style, s); }

function injectStyles() {
  if (document.getElementById("appAnims")) return;
  const s = document.createElement("style");
  s.id = "appAnims";
  s.textContent = `
@keyframes fadeInUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn { from { opacity:0; transform:translateX(46px); } to { opacity:1; transform:translateX(0); } }
@keyframes pop { 0%{transform:scale(0.6);} 60%{transform:scale(1.16);} 100%{transform:scale(1);} }
@keyframes popIn { 0%{transform:scale(0);opacity:0;} 70%{transform:scale(1.18);} 100%{transform:scale(1);opacity:1;} }
@keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-13px);} 40%{transform:translateX(13px);} 60%{transform:translateX(-8px);} 80%{transform:translateX(8px);} }
@keyframes pulseShadow { 0%,100%{ box-shadow:0 12px 26px var(--ps); } 50%{ box-shadow:0 18px 40px var(--ps); } }
@keyframes wobble { 0%,100%{transform:rotate(-11deg) scale(1);} 50%{transform:rotate(-8deg) scale(1.04);} }
@keyframes stampIn { 0%{transform:rotate(20deg) scale(2.4);opacity:0;} 60%{transform:rotate(-14deg) scale(0.9);opacity:1;} 100%{transform:rotate(-11deg) scale(1);opacity:1;} }
`;
  document.head.appendChild(s);
}
function clearUI() { while (uiLayer.firstChild) uiLayer.removeChild(uiLayer.firstChild); }

// ── 과목 탭(공책 인덱스 탭) ──
function subjectTab() {
  const grad = `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`;
  const tab = el("div", {
    position: "absolute", left: "6%", top: "0", zIndex: "2", pointerEvents: "none",
    display: "flex", alignItems: "center", columnGap: "16px",
    background: grad, padding: "26px 40px 18px", borderRadius: "0 0 28px 28px",
    boxShadow: `0 10px 24px ${hexToRgba(theme.primary, 0.32)}`
  });
  tab.appendChild(el("div", {
    width: "66px", height: "66px", minWidth: "66px", borderRadius: "18px", backgroundColor: "rgba(255,255,255,0.22)",
    border: "2px solid rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px"
  }, brandIcon));
  const tx = el("div", { display: "flex", flexDirection: "column", rowGap: "2px" });
  tx.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: "#FFF" }, textData.brandLabel || ""));
  tx.appendChild(el("div", { fontSize: "21px", fontWeight: "bold", color: "rgba(255,255,255,0.9)" }, textData.startSub || ""));
  tab.appendChild(tx);
  return tab;
}

// ── 진도 표시(자/ruler + 연필 마커) ──
function rulerProgress(cur) {
  const wrap = el("div", { position: "absolute", right: "6%", top: "3%", zIndex: "2", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "flex-end", rowGap: "8px" });
  wrap.appendChild(el("div", { fontSize: "20px", fontWeight: "900", color: theme.primary, letterSpacing: "1px" }, `학습 진도  ${cur + 1} / ${STEP_LABELS.length}`));
  const row = el("div", { display: "flex", alignItems: "center", columnGap: "10px", backgroundColor: "rgba(255,255,255,0.85)", border: `2px solid ${hexToRgba(theme.primary, 0.18)}`, borderRadius: "30px", padding: "8px 16px" });
  for (let i = 0; i < STEP_LABELS.length; i++) {
    const on = i === cur, done = i < cur;
    const seg = el("div", { display: "flex", alignItems: "center", columnGap: "8px" });
    seg.appendChild(el("div", {
      width: "30px", height: "30px", minWidth: "30px", borderRadius: "9px",
      backgroundColor: on ? theme.primary : done ? hexToRgba(theme.primary, 0.5) : hexToRgba(theme.primary, 0.13),
      color: on || done ? "#FFF" : theme.primary, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "16px", fontWeight: "900"
    }, done ? "✓" : on ? "✏️" : String(i + 1)));
    if (on) seg.appendChild(el("div", { fontSize: "21px", fontWeight: "900", color: theme.primary }, STEP_LABELS[i]));
    row.appendChild(seg);
  }
  wrap.appendChild(row);
  return wrap;
}

function addChrome(state) {
  uiLayer.appendChild(subjectTab());
  uiLayer.appendChild(rulerProgress(STATE_STEP[state] || 0));
}

// ── 노트 페이지 패널 ──
function applyScreen(state) {
  clearUI();
  addChrome(state);
  const rule = hexToRgba(theme.primary, 0.06);
  const card = el("div", {
    position: "absolute", left: "6%", top: "15.5%", width: "88%", height: "80%",
    backgroundColor: "#FFFFFF",
    backgroundImage: `repeating-linear-gradient(0deg, transparent 0, transparent 47px, ${rule} 47px, ${rule} 48px), linear-gradient(90deg, transparent 0, transparent 70px, ${hexToRgba(MARGIN, 0.55)} 70px, ${hexToRgba(MARGIN, 0.55)} 73px, transparent 73px)`,
    borderRadius: "22px", display: "flex", flexDirection: "column", boxSizing: "border-box",
    boxShadow: `0 24px 56px ${hexToRgba(theme.primary, 0.2)}`, pointerEvents: "auto",
    fontFamily: "sans-serif", zIndex: "1", animation: "fadeInUp 0.5s ease both", overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.04)"
  });
  // 좌상단 펀치홀 2개(공책 느낌)
  for (const ty of ["26%", "70%"]) {
    card.appendChild(el("div", { position: "absolute", left: "32px", top: ty, width: "18px", height: "18px", borderRadius: "50%", backgroundColor: hexToRgba(theme.primary, 0.12) }));
  }
  uiLayer.appendChild(card);
  return card;
}

function showScreen(state) {
  currentState = state;
  celebrating = false; confetti = [];
  if (state === "START") renderStart();
  else if (state === "CARDS") renderCards();
  else if (state === "CHECKLIST") renderChecklist();
  else if (state === "QUIZ") { quizAnswered = false; renderQuiz(); }
  else if (state === "RESULT") renderResult();
}

function pillBtn(text, big, ev) {
  return el("button", {
    minHeight: big ? "104px" : "88px", padding: big ? "18px 0" : "14px 0",
    fontSize: big ? "44px" : "34px", fontWeight: "900", fontFamily: "sans-serif",
    backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "22px", cursor: "pointer",
    boxShadow: `0 12px 26px ${hexToRgba(theme.primary, 0.38)}`
  }, text, ev);
}

function targetRow() {
  const ind = el("div", { display: "flex", flexDirection: "column", rowGap: "12px" });
  ind.appendChild(el("div", { fontSize: "22px", fontWeight: "900", color: "#9AA0B5" }, textData.industriesTitle || ""));
  const chips = el("div", { display: "flex", flexWrap: "wrap", gap: "11px" });
  for (const g of (textData.industries || [])) {
    const ch = el("div", { display: "flex", alignItems: "center", columnGap: "8px", backgroundColor: hexToRgba(theme.accent, 0.12), border: `2px solid ${hexToRgba(theme.accent, 0.3)}`, borderRadius: "14px", padding: "9px 18px" });
    ch.appendChild(el("div", { fontSize: "24px" }, g.icon));
    ch.appendChild(el("div", { fontSize: "23px", fontWeight: "bold", color: "#54607A" }, g.label));
    chips.appendChild(ch);
  }
  ind.appendChild(chips);
  return ind;
}

function goalPanel() {
  const right = el("div", {
    flex: "1", display: "flex", flexDirection: "column", rowGap: "3%",
    background: `linear-gradient(160deg, ${hexToRgba(theme.primary, 0.09)}, ${hexToRgba(theme.accent, 0.10)})`,
    borderRadius: "18px", padding: "4%", boxSizing: "border-box", border: `2px dashed ${hexToRgba(theme.primary, 0.25)}`
  });
  const learn = el("div", { display: "flex", flexDirection: "column", rowGap: "14px" });
  learn.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: theme.ink }, `\u{1F3AF}  ${textData.learnTitle || ""}`));
  for (const t of (textData.learnList || [])) {
    const row = el("div", { display: "flex", alignItems: "center", columnGap: "12px" });
    row.appendChild(el("div", { width: "32px", height: "32px", minWidth: "32px", borderRadius: "9px", backgroundColor: theme.primary, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", fontWeight: "900" }, "✓"));
    row.appendChild(el("div", { fontSize: "25px", color: "#3C4258", fontWeight: "bold" }, t));
    learn.appendChild(row);
  }
  right.appendChild(learn);
  const usage = el("div", { display: "flex", flexDirection: "column", rowGap: "9px", borderTop: `2px solid ${hexToRgba(theme.primary, 0.18)}`, paddingTop: "4%" });
  usage.appendChild(el("div", { fontSize: "24px", fontWeight: "900", color: "#7E74AE" }, `\u{1F4D6}  ${textData.usageTitle || ""}`));
  for (const t of (textData.usageList || [])) usage.appendChild(el("div", { fontSize: "22px", color: "#6A708A", lineHeight: "1.35" }, `· ${t}`));
  right.appendChild(usage);
  return right;
}

// ───────── START ─────────
function renderStart() {
  const c = applyScreen("START");
  setStyle(c, { flexDirection: "row", padding: "3.6% 3.6% 3.6% 7%", columnGap: "3.2%" });
  const left = el("div", { flex: "1.12", display: "flex", flexDirection: "column", justifyContent: "space-between" });
  const lt = el("div", { display: "flex", flexDirection: "column", rowGap: "18px" });
  lt.appendChild(el("div", { alignSelf: "flex-start", backgroundColor: hexToRgba(theme.primary, 0.12), color: theme.primary, fontSize: "26px", fontWeight: "900", padding: "9px 24px", borderRadius: "14px" }, textData.startSub));
  lt.appendChild(el("div", { fontSize: "60px", fontWeight: "900", color: theme.ink, lineHeight: "1.2", whiteSpace: "pre-line" }, textData.startTitle));
  lt.appendChild(el("div", { fontSize: "30px", color: "#5B6175", lineHeight: "1.5", whiteSpace: "pre-line" }, textData.startDesc));
  left.appendChild(lt);
  left.appendChild(targetRow());
  const sb = pillBtn(textData.startBtn, true, [{ event: "click", handler: () => { cardIndex = 0; showScreen("CARDS"); } }]);
  setStyle(sb, { width: "78%", marginTop: "6px" });
  sb.style.setProperty("--ps", hexToRgba(theme.primary, 0.4));
  sb.style.animation = "pulseShadow 2.2s ease-in-out infinite";
  left.appendChild(sb);
  c.appendChild(left);
  c.appendChild(goalPanel());
}

// ───────── CARDS (플래시카드) ─────────
function renderCards() {
  const total = textData.cards.length;
  const card = textData.cards[cardIndex];
  const isLast = cardIndex === total - 1;
  const c = applyScreen("CARDS");
  setStyle(c, { padding: "3.2% 4.5% 3.6% 7%", rowGap: "1.5%" });

  const header = el("div", { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" });
  header.appendChild(el("div", { fontSize: "34px", fontWeight: "900", color: theme.ink }, `\u{1F4DA}  ${textData.cardsTitle}`));
  header.appendChild(el("div", { fontSize: "28px", fontWeight: "900", color: theme.primary, backgroundColor: hexToRgba(theme.primary, 0.1), padding: "8px 22px", borderRadius: "14px" }, `${cardIndex + 1} / ${total}`));
  c.appendChild(header);

  const middle = el("div", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "3%" });
  const flash = el("div", {
    width: "84%", backgroundColor: "#FFFFFF", borderRadius: "22px", border: `3px solid ${hexToRgba(theme.primary, 0.18)}`,
    boxShadow: `0 14px 32px ${hexToRgba(theme.primary, 0.18)}`, overflow: "hidden", animation: "slideIn 0.3s ease both",
    display: "flex", flexDirection: "column"
  });
  // 카드 상단 탭
  flash.appendChild(el("div", { background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, color: "#FFF", fontSize: "24px", fontWeight: "900", padding: "12px 28px", display: "flex", alignItems: "center", columnGap: "12px" }, `${card.icon}  개념 ${cardIndex + 1}`));
  const body = el("div", { display: "flex", alignItems: "center", columnGap: "5%", padding: "4% 5%" });
  body.appendChild(el("div", { width: "150px", height: "150px", minWidth: "150px", borderRadius: "24px", backgroundColor: hexToRgba(theme.primary, 0.08), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "84px" }, card.icon));
  const txt = el("div", { display: "flex", flexDirection: "column", rowGap: "16px", flex: "1" });
  txt.appendChild(el("div", { fontSize: "46px", fontWeight: "900", color: theme.ink, whiteSpace: "pre-line", lineHeight: "1.25" }, card.title));
  txt.appendChild(el("div", { fontSize: "32px", color: "#5B6175", whiteSpace: "pre-line", lineHeight: "1.5" }, card.desc));
  body.appendChild(txt);
  flash.appendChild(body);
  middle.appendChild(flash);

  const dots = el("div", { display: "flex", columnGap: "12px", justifyContent: "center" });
  for (let i = 0; i < total; i++) dots.appendChild(el("div", { width: i === cardIndex ? "44px" : "16px", height: "16px", borderRadius: "8px", backgroundColor: i === cardIndex ? theme.primary : hexToRgba(theme.primary, 0.22), transition: "all 0.25s" }));
  middle.appendChild(dots);
  c.appendChild(middle);

  const nav = el("div", { width: "100%", display: "flex", justifyContent: "space-between", columnGap: "4%" });
  nav.appendChild(el("button", { width: "26%", minHeight: "90px", padding: "16px 0", fontSize: "34px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: cardIndex === 0 ? "#EFEFF4" : "#FFF", color: cardIndex === 0 ? "#BBB" : theme.primary, border: `3px solid ${cardIndex === 0 ? "#EFEFF4" : hexToRgba(theme.primary, 0.35)}`, borderRadius: "20px", cursor: cardIndex === 0 ? "default" : "pointer" }, textData.cardPrev, [{ event: "click", handler: () => { if (cardIndex > 0) { cardIndex--; renderCards(); } } }]));
  nav.appendChild(el("button", { flex: "1", minHeight: "90px", padding: "16px 0", fontSize: "38px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "20px", cursor: "pointer", boxShadow: `0 10px 22px ${hexToRgba(theme.primary, 0.32)}` }, isLast ? textData.cardDone : textData.cardNext, [{ event: "click", handler: () => { if (isLast) { showScreen("CHECKLIST"); } else { cardIndex++; renderCards(); } } }]));
  c.appendChild(nav);
}

// ───────── CHECKLIST ─────────
function renderChecklist() {
  const c = applyScreen("CHECKLIST");
  setStyle(c, { flexDirection: "row", padding: "3.2% 3.6% 3.2% 7%", columnGap: "3%" });
  const total = textData.checklistItems.length;
  const done = checklistStatus.filter(Boolean).length;
  const all = checklistStatus.every(Boolean);

  const left = el("div", { flex: "1.55", display: "flex", flexDirection: "column" });
  const hg = el("div", { marginBottom: "2%" });
  hg.appendChild(el("div", { fontSize: "38px", fontWeight: "900", color: theme.ink, marginBottom: "6px" }, `✅  ${textData.checklistTitle}`));
  hg.appendChild(el("div", { fontSize: "25px", color: "#6A708A", whiteSpace: "pre-line" }, textData.checklistDesc));
  left.appendChild(hg);

  const pw = el("div", { display: "flex", alignItems: "center", columnGap: "18px", marginBottom: "2%" });
  const track = el("div", { flex: "1", height: "16px", backgroundColor: hexToRgba(theme.primary, 0.12), borderRadius: "10px", overflow: "hidden" });
  track.appendChild(el("div", { width: `${(done / total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: "10px", transition: "width 0.35s ease" }));
  pw.appendChild(track);
  pw.appendChild(el("div", { fontSize: "25px", fontWeight: "900", color: theme.primary, whiteSpace: "nowrap" }, (textData.checklistProgress || "{done}/{total}").replace("{done}", String(done)).replace("{total}", String(total))));
  left.appendChild(pw);

  const list = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", rowGap: "12px" });
  for (let i = 0; i < total; i++) {
    const on = checklistStatus[i];
    const it = textData.checklistItems[i];
    const row = el("div", { flex: "1", minHeight: "0", display: "flex", alignItems: "center", borderRadius: "16px", padding: "0 3%", boxSizing: "border-box", cursor: "pointer", transition: "all 0.2s", backgroundColor: on ? hexToRgba(theme.primary, 0.09) : "rgba(247,247,251,0.85)", border: on ? `3px solid ${theme.primary}` : "3px solid transparent" }, "", [{ event: "click", handler: () => { checklistStatus[i] = !checklistStatus[i]; renderChecklist(); } }]);
    row.appendChild(el("div", { width: "58px", height: "58px", minWidth: "58px", borderRadius: "14px", backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginRight: "3%", boxShadow: on ? `0 6px 14px ${hexToRgba(theme.primary, 0.25)}` : "0 2px 8px rgba(0,0,0,0.05)" }, it.icon));
    row.appendChild(el("div", { fontSize: "28px", color: on ? theme.ink : "#7B8197", fontWeight: on ? "900" : "bold", flex: "1", lineHeight: "1.3" }, it.label));
    const ck = el("div", { width: "48px", height: "48px", minWidth: "48px", borderRadius: "12px", border: on ? "none" : "4px solid #CFCFE0", backgroundColor: on ? theme.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" });
    if (on) { ck.style.animation = "pop 0.3s ease"; ck.appendChild(el("div", { color: "#FFF", fontSize: "28px", fontWeight: "900" }, "✓")); }
    row.appendChild(ck);
    list.appendChild(row);
  }
  left.appendChild(list);
  c.appendChild(left);

  const right = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", rowGap: "3%" });
  const tip = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", rowGap: "16px", background: `linear-gradient(160deg, ${hexToRgba(theme.accent, 0.14)}, ${hexToRgba(theme.primary, 0.12)})`, borderRadius: "18px", padding: "8% 7%", boxSizing: "border-box", border: `2px dashed ${hexToRgba(theme.accent, 0.4)}` });
  tip.appendChild(el("div", { alignSelf: "flex-start", backgroundColor: theme.accent, color: "#FFF", fontSize: "25px", fontWeight: "900", padding: "8px 22px", borderRadius: "14px" }, `\u{1F4A1} ${textData.tipTitle || "TIP"}`));
  tip.appendChild(el("div", { fontSize: "30px", color: theme.ink, fontWeight: "bold", lineHeight: "1.5", whiteSpace: "pre-line" }, textData.tipDesc || ""));
  right.appendChild(tip);

  right.appendChild(el("div", { fontSize: "23px", color: "#AAB", textAlign: "center", opacity: all ? "0" : "1", transition: "opacity 0.3s" }, textData.checklistHint || ""));
  const nb = el("button", { width: "100%", minHeight: "98px", padding: "16px 0", fontSize: "38px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: all ? theme.primary : "#D7D7E2", color: "#FFF", border: "none", borderRadius: "20px", cursor: all ? "pointer" : "not-allowed", boxShadow: all ? `0 12px 24px ${hexToRgba(theme.primary, 0.32)}` : "none", transition: "background-color 0.3s", animation: all ? "pop 0.3s ease" : "none" }, textData.checklistNext, [{ event: "click", handler: () => { if (all) { quizIndex = 0; showScreen("QUIZ"); } } }]);
  right.appendChild(nb);
  c.appendChild(right);
}

// ───────── QUIZ ─────────
function renderQuiz() {
  const q = textData.quizItems[quizIndex];
  const total = textData.quizItems.length;
  const isLast = quizIndex === total - 1;
  const c = applyScreen("QUIZ");
  setStyle(c, { padding: "3.2% 5% 4% 7%", rowGap: "1%" });

  const top = el("div", { width: "100%", display: "flex", alignItems: "center", columnGap: "20px" });
  const track = el("div", { flex: "1", height: "16px", backgroundColor: hexToRgba(theme.primary, 0.12), borderRadius: "10px", overflow: "hidden" });
  track.appendChild(el("div", { width: `${((quizIndex + 1) / total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: "10px", transition: "width 0.35s ease" }));
  top.appendChild(track);
  top.appendChild(el("div", { fontSize: "26px", fontWeight: "900", color: theme.primary, whiteSpace: "nowrap" }, `⭐ ${points}점`));
  c.appendChild(top);

  const mid = el("div", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "4%" });
  const hg = el("div", { width: "100%", textAlign: "center" });
  hg.appendChild(el("div", { display: "inline-block", backgroundColor: theme.primary, color: "#FFF", fontSize: "30px", fontWeight: "900", padding: "9px 28px", borderRadius: "16px", marginBottom: "22px" }, `Q${quizIndex + 1} / ${total}`));
  hg.appendChild(el("div", { fontSize: "48px", fontWeight: "900", color: theme.ink, whiteSpace: "pre-line", lineHeight: "1.45" }, q.q));
  const ox = el("div", { display: "flex", width: "84%", height: "180px", minHeight: "180px", justifyContent: "space-between" });
  const bO = el("button", { width: "46%", height: "100%", fontSize: "112px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: "#21B07A", color: "#FFF", border: "none", borderRadius: "24px", boxShadow: "0 12px 24px rgba(33,176,122,0.4)", cursor: "pointer", transition: "all 0.3s" }, "O");
  const bX = el("button", { width: "46%", height: "100%", fontSize: "112px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: "#E0504F", color: "#FFF", border: "none", borderRadius: "24px", boxShadow: "0 12px 24px rgba(224,80,79,0.4)", cursor: "pointer", transition: "all 0.3s" }, "X");
  ox.appendChild(bO); ox.appendChild(bX);
  const fb = el("div", { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "14px", opacity: "0", transition: "opacity 0.3s" });
  const mark = el("div", { fontSize: "48px", fontWeight: "900" });
  const expl = el("div", { fontSize: "31px", color: "#5B6175", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.5", width: "92%" });
  const nx = el("button", { width: "78%", minHeight: "96px", padding: "16px 0", fontSize: "38px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "20px", cursor: "pointer", boxShadow: `0 10px 22px ${hexToRgba(theme.primary, 0.32)}` }, isLast ? (textData.lastBtn || textData.nextBtn) : textData.nextBtn);
  fb.appendChild(mark); fb.appendChild(expl); fb.appendChild(nx);
  mid.appendChild(hg); mid.appendChild(ox); mid.appendChild(fb);
  c.appendChild(mid);

  const ans = (a) => {
    if (quizAnswered) return; quizAnswered = true;
    const ok = a === q.a;
    if (ok) { score++; points += POINT_PER_Q; }
    bO.style.opacity = a === "O" ? "1" : "0.3"; bX.style.opacity = a === "X" ? "1" : "0.3";
    (a === "O" ? bO : bX).style.animation = ok ? "pop 0.4s ease" : "shake 0.4s ease";
    mark.textContent = ok ? `${textData.correctText || "정답이에요!"}  ${textData.quizPointLabel || "+10"}` : (textData.wrongText || "다시 확인해요");
    mark.style.color = ok ? "#21B07A" : "#E0504F"; mark.style.animation = "popIn 0.4s ease both";
    expl.textContent = q.expl; fb.style.opacity = "1";
    nx.addEventListener("click", () => { quizIndex++; if (quizIndex >= total) showScreen("RESULT"); else showScreen("QUIZ"); });
  };
  bO.addEventListener("click", () => ans("O"));
  bX.addEventListener("click", () => ans("X"));
}

// ───────── RESULT (도장) ─────────
function renderResult() {
  const total = textData.quizItems.length;
  const perfect = score === total;
  if (perfect) startCelebration();
  const c = applyScreen("RESULT");
  setStyle(c, { flexDirection: "row", padding: "3.4% 3.6% 3.4% 7%", columnGap: "3.2%" });

  const left = el("div", { flex: "1.05", display: "flex", flexDirection: "column", justifyContent: "center", rowGap: "4%" });
  const h = el("div", { display: "flex", alignItems: "center", columnGap: "26px" });
  const htx = el("div", {});
  htx.appendChild(el("div", { fontSize: "54px", fontWeight: "900", color: theme.primary, marginBottom: "10px" }, textData.resultTitle));
  htx.appendChild(el("div", { fontSize: "30px", color: "#5B6175", whiteSpace: "pre-line", lineHeight: "1.5" }, perfect ? textData.resultPerfect : textData.resultGood));
  h.appendChild(htx);
  // 도장 스탬프
  const stamp = el("div", { width: "150px", height: "150px", minWidth: "150px", borderRadius: "50%", border: `5px solid ${MARGIN}`, color: MARGIN, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", fontWeight: "900", animation: "stampIn 0.6s ease both, wobble 3s ease-in-out 0.6s infinite", boxShadow: `inset 0 0 0 3px ${hexToRgba(MARGIN, 0.3)}` });
  stamp.appendChild(el("div", { fontSize: "30px", lineHeight: "1.1" }, "참 잘\n했어요"));
  stamp.appendChild(el("div", { fontSize: "40px", marginTop: "4px" }, "💯"));
  h.appendChild(stamp);
  left.appendChild(h);

  const sg = el("div", { display: "flex", alignItems: "center", columnGap: "22px" });
  const badge = el("div", { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(150deg, ${theme.primary}, ${theme.primaryDark})`, borderRadius: "20px", padding: "20px 38px", color: "#FFF", animation: "popIn 0.5s ease both", boxShadow: `0 14px 30px ${hexToRgba(theme.primary, 0.35)}` });
  badge.appendChild(el("div", { fontSize: "25px", fontWeight: "bold", opacity: "0.9" }, textData.resultScore));
  badge.appendChild(el("div", { fontSize: "56px", fontWeight: "900", letterSpacing: "3px" }, `${points}점`));
  sg.appendChild(badge);
  const sr = el("div", { display: "flex", flexDirection: "column", rowGap: "6px" });
  sr.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: theme.ink }, `정답 ${score} / ${total}`));
  sr.appendChild(el("div", { fontSize: "23px", color: "#8B91A6" }, `문항당 +${POINT_PER_Q}점`));
  sg.appendChild(sr);
  left.appendChild(sg);

  const eff = el("div", { display: "flex", flexDirection: "column", rowGap: "12px" });
  eff.appendChild(el("div", { fontSize: "23px", fontWeight: "900", color: "#9AA0B5" }, textData.effectsTitle || ""));
  const echips = el("div", { display: "flex", flexWrap: "wrap", gap: "11px" });
  for (const e of (textData.effects || [])) {
    const ec = el("div", { display: "flex", alignItems: "center", columnGap: "8px", backgroundColor: hexToRgba(theme.accent, 0.13), border: `2px solid ${hexToRgba(theme.accent, 0.3)}`, borderRadius: "14px", padding: "9px 18px" });
    ec.appendChild(el("div", { fontSize: "24px" }, e.icon));
    ec.appendChild(el("div", { fontSize: "23px", fontWeight: "900", color: "#2C7A6E" }, e.label));
    echips.appendChild(ec);
  }
  eff.appendChild(echips);
  left.appendChild(eff);

  const right = el("div", { flex: "1", display: "flex", flexDirection: "column", rowGap: "3%" });
  const ct = textData.contact || {};
  const cc = el("div", { display: "flex", flexDirection: "column", rowGap: "10px", background: `linear-gradient(160deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`, borderRadius: "18px", padding: "4% 5%", boxSizing: "border-box", border: `2px dashed ${hexToRgba(theme.primary, 0.25)}` });
  cc.appendChild(el("div", { fontSize: "26px", fontWeight: "900", color: theme.ink }, `\u{1F3EB} ${textData.contactTitle || "학원 안내"}`));
  cc.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: theme.ink }, ct.name || ""));
  if (ct.phone) cc.appendChild(el("div", { fontSize: "33px", fontWeight: "900", color: theme.primary }, `\u{1F4F1}  ${ct.phone}`));
  const sub = el("div", { display: "flex", flexWrap: "wrap", columnGap: "20px", rowGap: "6px" });
  if (ct.kakao) sub.appendChild(el("div", { fontSize: "23px", color: "#6A708A", fontWeight: "bold" }, `\u{1F4AC} ${ct.kakao}`));
  if (ct.instagram) sub.appendChild(el("div", { fontSize: "23px", color: "#6A708A", fontWeight: "bold" }, `\u{1F4F8} ${ct.instagram}`));
  cc.appendChild(sub);
  if (ct.note) cc.appendChild(el("div", { fontSize: "22px", color: "#8B91A6", whiteSpace: "pre-line", lineHeight: "1.4" }, ct.note));
  right.appendChild(cc);

  const acts = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "flex-end", rowGap: "13px" });
  acts.appendChild(el("div", { fontSize: "23px", fontWeight: "900", color: "#9AA0B5" }, textData.actionsTitle || ""));
  const secBtn = (label, handler) => el("button", { width: "100%", minHeight: "82px", padding: "13px 0", fontSize: "30px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: "#FFF", color: theme.primary, border: `3px solid ${hexToRgba(theme.primary, 0.3)}`, borderRadius: "18px", cursor: "pointer" }, label, [{ event: "click", handler }]);
  acts.appendChild(secBtn(textData.reviewCardsBtn || "개념 카드 다시 보기", () => { cardIndex = 0; showScreen("CARDS"); }));
  acts.appendChild(secBtn(textData.reviewChecklistBtn || "학습 점검 다시 보기", () => { showScreen("CHECKLIST"); }));
  const restart = pillBtn(`\u{1F501}  ${textData.restartBtn || "처음으로"}`, false, [{ event: "click", handler: () => { quizIndex = 0; score = 0; points = 0; cardIndex = 0; for (let i = 0; i < checklistStatus.length; i++) checklistStatus[i] = false; showScreen("START"); } }]);
  setStyle(restart, { width: "100%" });
  acts.appendChild(restart);
  right.appendChild(acts);

  c.appendChild(left);
  c.appendChild(right);
}

// ───────── 캔버스 배경(모눈) / 축하 ─────────
function startCelebration() {
  celebrating = true; confetti = [];
  const cols = [theme.primary, theme.primaryDark, theme.accent, "#FFD54F", "#FF8FB1", "#7CC4FF"];
  for (let i = 0; i < 90; i++) confetti.push({ x: Math.random() * appData.logicalWidth, y: -Math.random() * appData.logicalHeight * 0.4, vx: (Math.random() - 0.5) * 4, vy: 4 + Math.random() * 6, size: 14 + Math.random() * 18, color: cols[Math.floor(Math.random() * cols.length)], rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3 });
}
function drawConfetti() {
  if (!celebrating) return;
  for (const p of confetti) {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    if (p.y > appData.logicalHeight + 40) { p.y = -40; p.x = Math.random() * appData.logicalWidth; }
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62); ctx.restore();
  }
}
function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, appCanvas.width, appCanvas.height);
  g.addColorStop(0, theme.bgTop); g.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, appCanvas.width, appCanvas.height);
  // 모눈종이 그리드
  ctx.save();
  ctx.strokeStyle = hexToRgba(theme.primary, 0.06); ctx.lineWidth = 1;
  for (let x = 0; x <= appCanvas.width; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, appCanvas.height); ctx.stroke(); }
  for (let y = 0; y <= appCanvas.height; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(appCanvas.width, y); ctx.stroke(); }
  ctx.strokeStyle = hexToRgba(theme.primary, 0.1); ctx.lineWidth = 1.5;
  for (let x = 0; x <= appCanvas.width; x += 300) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, appCanvas.height); ctx.stroke(); }
  for (let y = 0; y <= appCanvas.height; y += 300) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(appCanvas.width, y); ctx.stroke(); }
  ctx.restore();
  // 떠다니는 학습 도구 도들
  ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const d of DOODLES) {
    const dy = Math.sin(time * 0.7 + d.phase) * 16;
    ctx.globalAlpha = 0.08; ctx.font = `${d.s}px sans-serif`;
    ctx.fillText(d.ch, d.x, d.y + dy);
  }
  ctx.restore();
}
function loop() {
  time += 0.016;
  ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
  drawBackground(); drawConfetti();
  animationFrameId = requestAnimationFrame(loop);
}

async function initApp() {
  appData = await AppHelper.loadAppData();
  textData = await AppHelper.loadTextData();
  assetList = await AppHelper.loadAssetList();
  theme = textData.theme;
  brandIcon = textData.brandIcon || "\u{1F4D0}";
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
