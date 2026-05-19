var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

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
function toArray(arrayLike) {
  const arr = [];
  for (let i = 0, l = arrayLike.length; i < l; i++) {
    arr.push(arrayLike[i]);
  }
  return arr;
}
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
var uuid, styleProps, canvasDimensionLimit, isInstanceOfElement;
var init_util = __esm({
  "node_modules/html-to-image/es/util.js"() {
    uuid = /* @__PURE__ */ (() => {
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
    styleProps = null;
    canvasDimensionLimit = 16384;
    isInstanceOfElement = (node, instance) => {
      if (node instanceof instance)
        return true;
      const nodePrototype = Object.getPrototypeOf(node);
      if (nodePrototype === null)
        return false;
      return nodePrototype.constructor.name === instance.name || isInstanceOfElement(nodePrototype, instance);
    };
  }
});

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
var init_clone_pseudos = __esm({
  "node_modules/html-to-image/es/clone-pseudos.js"() {
    init_util();
  }
});

// node_modules/html-to-image/es/mimes.js
function getExtension(url) {
  const match = /\.([^./]*?)$/g.exec(url);
  return match ? match[1] : "";
}
function getMimeType(url) {
  const extension = getExtension(url).toLowerCase();
  return mimes[extension] || "";
}
var WOFF, JPEG, mimes;
var init_mimes = __esm({
  "node_modules/html-to-image/es/mimes.js"() {
    WOFF = "application/font-woff";
    JPEG = "image/jpeg";
    mimes = {
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
  }
});

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
var cache;
var init_dataurl = __esm({
  "node_modules/html-to-image/es/dataurl.js"() {
    cache = {};
  }
});

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
var isSlotElement, isSVGElement;
var init_clone_node = __esm({
  "node_modules/html-to-image/es/clone-node.js"() {
    init_clone_pseudos();
    init_util();
    init_mimes();
    init_dataurl();
    isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SLOT";
    isSVGElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SVG";
  }
});

// node_modules/html-to-image/es/embed-resources.js
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
var URL_REGEX, URL_WITH_FORMAT_REGEX, FONT_SRC_REGEX;
var init_embed_resources = __esm({
  "node_modules/html-to-image/es/embed-resources.js"() {
    init_util();
    init_mimes();
    init_dataurl();
    URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
    URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
    FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
  }
});

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
var init_embed_images = __esm({
  "node_modules/html-to-image/es/embed-images.js"() {
    init_embed_resources();
    init_util();
    init_dataurl();
    init_mimes();
  }
});

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
var init_apply_style = __esm({
  "node_modules/html-to-image/es/apply-style.js"() {
  }
});

// node_modules/html-to-image/es/embed-webfonts.js
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
var cssFetchCache;
var init_embed_webfonts = __esm({
  "node_modules/html-to-image/es/embed-webfonts.js"() {
    init_util();
    init_dataurl();
    init_embed_resources();
    cssFetchCache = {};
  }
});

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
var init_es = __esm({
  "node_modules/html-to-image/es/index.js"() {
    init_clone_node();
    init_embed_images();
    init_apply_style();
    init_embed_webfonts();
    init_util();
  }
});

// public/20260331074210_e5ed62d3-3bb2-4bb6-bcf6-771a5cc1922a/appHelper.ts
var AppHelper;
var init_appHelper = __esm({
  "public/20260331074210_e5ed62d3-3bb2-4bb6-bcf6-771a5cc1922a/appHelper.ts"() {
    init_es();
    AppHelper = class {
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
        const lang = new URLSearchParams(window.location.search).get("lang") || textData2.default_language;
        const texts = textData2[lang] || textData2[textData2.default_language] || {};
        return texts;
      }
      static async loadAssetList() {
        const data = await this.fetchRawData();
        return data.assetList;
      }
      /**
       * 브라우저 클라이언트 좌표를 캔버스의 논리 해상도 좌표로 변환합니다.
       * AI 지침: appCanvas 규칙에 따라 모든 마우스/터치 좌표 보정에 이 함수를 사용하세요.
       * @param clientX - event.clientX
       * @param clientY - event.clientY
       * @param appCanvas - 기준이 되는 HTMLCanvasElement
       */
      static getRelativeCoordinates(clientX, clientY, appCanvas2) {
        const rect = appCanvas2.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const scaleX = appCanvas2.width / rect.width;
        const scaleY = appCanvas2.height / rect.height;
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
        const appCanvas2 = document.getElementById("appCanvas");
        const appContainer = document.getElementById("appContainer");
        if (!appCanvas2 || !appContainer) return null;
        let dataUrl = null;
        try {
          if (includeUILayer) {
            const savedStyle = appContainer.style.cssText;
            appContainer.style.transform = "none";
            appContainer.style.position = "relative";
            appContainer.style.left = "0";
            appContainer.style.top = "0";
            dataUrl = await toPng(appContainer, {
              width: appCanvas2.width,
              height: appCanvas2.height
            });
            appContainer.style.cssText = savedStyle;
          } else {
            dataUrl = appCanvas2.toDataURL("image/webp");
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
  }
});

// public/20260331074210_e5ed62d3-3bb2-4bb6-bcf6-771a5cc1922a/app.ts
function getCurrencyChartYearFromCoords(chartCanvas, histories, x, y) {
  const allPoints = [];
  for (const hist of histories) {
    for (const p of hist.data) {
      allPoints.push(p);
    }
  }
  if (allPoints.length === 0) return null;
  let minYear = allPoints[0].year;
  let maxYear = allPoints[0].year;
  for (const p of allPoints) {
    if (p.year < minYear) minYear = p.year;
    if (p.year > maxYear) maxYear = p.year;
  }
  const padding = { top: 30, right: 110, bottom: 55, left: 70 };
  const chartW = chartCanvas.width - padding.left - padding.right;
  const chartH = chartCanvas.height - padding.top - padding.bottom;
  const yearRange = Math.max(1, maxYear - minYear);
  if (x < padding.left || x > padding.left + chartW || y < padding.top || y > padding.top + chartH) {
    return null;
  }
  const relative = (x - padding.left) / chartW;
  return Math.round(minYear + relative * yearRange);
}
function showCurrencyComparisonOverlay() {
  if (!textData || !appData || !uiLayer || !appData.currencyValueHistory || appData.currencyValueHistory.length === 0)
    return;
  const existing = document.getElementById("currencyOverlay");
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
    const idx = activeUIElements.indexOf(existing);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const overlay = AppHelper.createUIElement("div", "currencyOverlay", {
    position: "absolute",
    left: "4%",
    top: "4%",
    width: "92%",
    height: "92%",
    backgroundColor: "rgba(6, 12, 32, 0.97)",
    borderRadius: "16px",
    padding: "2%",
    border: "2px solid rgba(96, 165, 250, 0.35)",
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    zIndex: "180"
  });
  uiLayer.appendChild(overlay);
  activeUIElements.push(overlay);
  const header = AppHelper.createUIElement("div", "currencyHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(header);
  const title = AppHelper.createUIElement(
    "div",
    "currencyTitle",
    {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#60a5fa",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    textData.currencyFeatureTitle || "\u{1F4B1} \uAE30\uCD95\uD1B5\uD654\uBCC4 \uC5F0\uB3C4\uBCC4 \uAC00\uCE58 \uBCC0\uD654 \uBE44\uAD50"
  );
  header.appendChild(title);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "currencyCloseBtn",
    {
      padding: "0.8% 2%",
      fontSize: "15px",
      color: "#ffffff",
      backgroundColor: "rgba(120, 60, 60, 0.85)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "1px solid rgba(220, 120, 120, 0.4)"
    },
    `\u2715 ${textData.closeBtn}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showCurrencyFeature = false;
          hoveredCurrencyYear = null;
          selectedCurrencyYear = null;
          const el = document.getElementById("currencyOverlay");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
            const idx = activeUIElements.indexOf(el);
            if (idx >= 0) activeUIElements.splice(idx, 1);
          }
        }
      }
    ]
  );
  header.appendChild(closeBtn);
  const desc = AppHelper.createUIElement(
    "div",
    "currencyDesc",
    {
      fontSize: "13px",
      color: "#c0d8ff",
      lineHeight: "1.6",
      marginBottom: "1.5%",
      boxSizing: "border-box",
      pointerEvents: "none",
      flexShrink: "0"
    },
    textData.currencyFeatureDesc || "USD, EUR, JPY, GBP \uAC19\uC740 \uC8FC\uC694 \uAE30\uCD95\uD1B5\uD654\uB97C \uC120\uD0DD\uD574 \uC5F0\uB3C4\uBCC4 \uAC00\uCE58 \uD750\uB984\uC744 \uBE44\uAD50\uD558\uACE0, \uD2B9\uC815 \uC2DC\uC810\uC5D0 \uC65C \uC62C\uB790\uAC70\uB098 \uB0B4\uB838\uB294\uC9C0 \uC124\uBA85\uC744 \uD568\uAED8 \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
  );
  overlay.appendChild(desc);
  const selectorLabel = AppHelper.createUIElement(
    "div",
    "currencySelectorLabel",
    {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#fbbf24",
      marginBottom: "0.8%",
      boxSizing: "border-box",
      pointerEvents: "none",
      flexShrink: "0"
    },
    textData.currencyFeatureSelectPrompt || "\uBE44\uAD50\uD560 \uD1B5\uD654\uB97C \uC120\uD0DD\uD558\uC138\uC694"
  );
  overlay.appendChild(selectorLabel);
  const selectorRow = AppHelper.createUIElement("div", "currencySelectorRow", {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(selectorRow);
  const colors = getDefaultCurrencyColors();
  for (const hist of appData.currencyValueHistory) {
    const active = selectedCurrencyIds.includes(hist.currencyId);
    const color = colors[hist.currencyId] || "#ffffff";
    const btn = AppHelper.createUIElement(
      "div",
      `currencySelect_${hist.currencyId}`,
      {
        padding: "0.7% 1.8%",
        fontSize: "13px",
        fontWeight: "bold",
        color: active ? "#ffffff" : color,
        backgroundColor: active ? color + "cc" : "rgba(20, 35, 70, 0.8)",
        borderRadius: "999px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: `1px solid ${color}70`
      },
      `\u25CF ${getCurrencyName(hist.currencyId)}`,
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            toggleCurrencySelection(hist.currencyId);
          }
        }
      ]
    );
    selectorRow.appendChild(btn);
  }
  const selectedHistories = [];
  for (const cid of selectedCurrencyIds) {
    const hist = getCurrencyHistoryById(cid);
    if (hist) selectedHistories.push(hist);
  }
  const effectiveReasonYear = selectedCurrencyYear !== null ? selectedCurrencyYear : hoveredCurrencyYear;
  const mainLayout = AppHelper.createUIElement("div", "currencyMainLayout", {
    display: "flex",
    gap: "1.5%",
    flex: "1",
    minHeight: "0",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  overlay.appendChild(mainLayout);
  const chartPanel = AppHelper.createUIElement("div", "currencyChartPanel", {
    flex: "1.4",
    minWidth: "0",
    backgroundColor: "rgba(12, 22, 50, 0.7)",
    borderRadius: "12px",
    padding: "1.5%",
    border: "1px solid rgba(96, 165, 250, 0.22)",
    boxSizing: "border-box",
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    minHeight: "0"
  });
  mainLayout.appendChild(chartPanel);
  const chartHint = AppHelper.createUIElement(
    "div",
    "currencyChartHint",
    {
      fontSize: "12px",
      color: "rgba(190, 215, 255, 0.7)",
      marginBottom: "1%",
      lineHeight: "1.5",
      boxSizing: "border-box",
      pointerEvents: "none",
      flexShrink: "0"
    },
    textData.currencyFeatureChartHint || "\uB9C8\uC6B0\uC2A4\uB97C \uC6C0\uC9C1\uC774\uBA74 \uC5F0\uB3C4\uAC00 \uBBF8\uB9AC \uAC15\uC870\uB418\uACE0, \uD074\uB9AD\uD558\uBA74 \uD574\uB2F9 \uC5F0\uB3C4\uC758 \uC6D0\uC778 \uC124\uBA85\uC774 \uC624\uB978\uCABD \uD328\uB110\uC5D0 \uACE0\uC815\uB429\uB2C8\uB2E4."
  );
  chartPanel.appendChild(chartHint);
  const chartCanvas = AppHelper.createUIElement("canvas", "currencyChartCanvas", {
    width: "100%",
    height: "100%",
    minHeight: "320px",
    backgroundColor: "rgba(8, 18, 40, 0.9)",
    borderRadius: "10px",
    boxSizing: "border-box",
    pointerEvents: "auto",
    flex: "1"
  });
  chartCanvas.width = 980;
  chartCanvas.height = 520;
  chartPanel.appendChild(chartCanvas);
  const chartCtx = chartCanvas.getContext("2d");
  if (chartCtx) {
    drawCurrencyComparisonChart(chartCtx, chartCanvas.width, chartCanvas.height, selectedHistories);
  }
  chartCanvas.addEventListener("pointermove", (e) => {
    const pe = e;
    const coords = AppHelper.getRelativeCoordinates(pe.clientX, pe.clientY, chartCanvas);
    const nextYear = getCurrencyChartYearFromCoords(chartCanvas, selectedHistories, coords.x, coords.y);
    if (hoveredCurrencyYear !== nextYear) {
      hoveredCurrencyYear = nextYear;
      showCurrencyComparisonOverlay();
    }
  });
  chartCanvas.addEventListener("pointerleave", () => {
    if (hoveredCurrencyYear !== null) {
      hoveredCurrencyYear = null;
      showCurrencyComparisonOverlay();
    }
  });
  chartCanvas.addEventListener("pointerup", (e) => {
    const pe = e;
    const coords = AppHelper.getRelativeCoordinates(pe.clientX, pe.clientY, chartCanvas);
    const clickedYear = getCurrencyChartYearFromCoords(chartCanvas, selectedHistories, coords.x, coords.y);
    if (clickedYear === null) return;
    selectedCurrencyYear = clickedYear;
    hoveredCurrencyYear = clickedYear;
    isCurrencyReasonPanelExpanded = true;
    showCurrencyComparisonOverlay();
  });
  const rightPanel = AppHelper.createUIElement("div", "currencyRightPanel", {
    flex: "1",
    minWidth: "0",
    display: "flex",
    flexDirection: "column",
    gap: "1%",
    boxSizing: "border-box",
    pointerEvents: "none",
    minHeight: "0"
  });
  mainLayout.appendChild(rightPanel);
  const selectionSummary = AppHelper.createUIElement("div", "currencySelectionSummary", {
    backgroundColor: "rgba(12, 22, 50, 0.7)",
    borderRadius: "12px",
    padding: "1.3% 1.5%",
    border: "1px solid rgba(96, 165, 250, 0.18)",
    boxSizing: "border-box",
    pointerEvents: "auto",
    flexShrink: "0"
  });
  rightPanel.appendChild(selectionSummary);
  const summaryTop = AppHelper.createUIElement("div", "currencySelectionSummaryTop", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  selectionSummary.appendChild(summaryTop);
  const summaryText = AppHelper.createUIElement(
    "div",
    "currencySelectionSummaryText",
    {
      fontSize: "13px",
      color: "#dce8ff",
      lineHeight: "1.5",
      boxSizing: "border-box",
      pointerEvents: "none",
      fontWeight: "bold"
    },
    effectiveReasonYear !== null ? `${textData.currencyFeatureSelectedYearLabel || "\uC120\uD0DD\uB41C \uC2DC\uC810"} \xB7 ${effectiveReasonYear}\uB144` : textData.currencyFeatureSelectedYearEmpty || "\uC544\uC9C1 \uC120\uD0DD\uB41C \uC2DC\uC810\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"
  );
  summaryTop.appendChild(summaryText);
  if (selectedCurrencyYear !== null) {
    const clearBtn = AppHelper.createUIElement(
      "div",
      "currencySelectionClearBtn",
      {
        padding: "4px 10px",
        fontSize: "11px",
        color: "#ffffff",
        backgroundColor: "rgba(80, 110, 170, 0.7)",
        borderRadius: "999px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: "1px solid rgba(140, 180, 255, 0.35)",
        whiteSpace: "nowrap"
      },
      textData.currencyFeatureClearSelection || "\uC120\uD0DD \uD574\uC81C",
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            selectedCurrencyYear = null;
            showCurrencyComparisonOverlay();
          }
        }
      ]
    );
    summaryTop.appendChild(clearBtn);
  }
  const summarySub = AppHelper.createUIElement(
    "div",
    "currencySelectionSummarySub",
    {
      fontSize: "12px",
      color: "rgba(190, 215, 255, 0.68)",
      marginTop: "0.7%",
      lineHeight: "1.5",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    selectedCurrencyYear !== null ? textData.currencyFeaturePinnedStateDesc || "\uD604\uC7AC \uC120\uD0DD\uD55C \uC5F0\uB3C4\uC758 \uC124\uBA85\uC774 \uACE0\uC815\uB418\uC5B4 \uC788\uC5B4 \uB9C8\uC6B0\uC2A4\uB97C \uC62E\uACA8\uB3C4 \uB0B4\uC6A9\uC774 \uC720\uC9C0\uB429\uB2C8\uB2E4." : textData.currencyFeatureHoverStateDesc || "\uADF8\uB798\uD504\uB97C \uD074\uB9AD\uD558\uBA74 \uD574\uB2F9 \uC5F0\uB3C4\uC758 \uC124\uBA85\uC774 \uACE0\uC815\uB429\uB2C8\uB2E4. \uD074\uB9AD \uC804\uC5D0\uB294 \uB9C8\uC6B0\uC2A4\uB97C \uC62C\uB9B0 \uC704\uCE58\uAC00 \uBBF8\uB9AC\uBCF4\uAE30\uB85C \uD45C\uC2DC\uB429\uB2C8\uB2E4."
  );
  selectionSummary.appendChild(summarySub);
  const reasonPanel = AppHelper.createUIElement("div", "currencyReasonPanel", {
    flex: "1",
    minWidth: "0",
    overflowY: isCurrencyReasonPanelExpanded ? "auto" : "hidden",
    backgroundColor: "rgba(12, 22, 50, 0.7)",
    borderRadius: "12px",
    padding: "1.5%",
    border: "1px solid rgba(251, 191, 36, 0.18)",
    boxSizing: "border-box",
    pointerEvents: "auto",
    minHeight: "0",
    display: "flex",
    flexDirection: "column"
  });
  rightPanel.appendChild(reasonPanel);
  renderCurrencyReasonsPanel(reasonPanel, effectiveReasonYear);
}
function renderCurrencyReasonsPanel(container, year) {
  if (!textData || !appData) return;
  const colors = getDefaultCurrencyColors();
  const topBar = AppHelper.createUIElement("div", "currencyReasonTopBar", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "1%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  container.appendChild(topBar);
  const titleWrap = AppHelper.createUIElement("div", "currencyReasonTitleWrap", {
    flex: "1",
    minWidth: "0",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  topBar.appendChild(titleWrap);
  const title = AppHelper.createUIElement(
    "div",
    "currencyReasonHeader",
    {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fbbf24",
      marginBottom: "0.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `${textData.currencyFeatureReasonTitle || "\uB4F1\uB77D \uC6D0\uC778 \uC124\uBA85"}${year !== null ? ` \xB7 ${year}\uB144` : ""}`
  );
  titleWrap.appendChild(title);
  const desc = AppHelper.createUIElement(
    "div",
    "currencyReasonHeaderDesc",
    {
      fontSize: "12px",
      color: "rgba(190, 215, 255, 0.7)",
      lineHeight: "1.5",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    selectedCurrencyYear !== null ? textData.currencyFeaturePinnedReasonDesc || "\uC120\uD0DD\uD55C \uC5F0\uB3C4\uC758 \uC8FC\uC694 \uB4F1\uB77D \uBC30\uACBD\uC774 \uC544\uB798\uC5D0 \uACE0\uC815\uB418\uC5B4 \uD45C\uC2DC\uB429\uB2C8\uB2E4. \uD544\uC694\uD55C \uACBD\uC6B0 \uD3BC\uCCD0\uC11C \uC790\uC138\uD55C \uB0B4\uC6A9\uC744 \uB354 \uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4." : textData.currencyFeatureReasonDesc || "\uADF8\uB798\uD504 \uC704\uC5D0\uC11C \uD2B9\uC815 \uC5F0\uB3C4\uB97C \uC120\uD0DD\uD558\uBA74, \uAC01 \uD1B5\uD654 \uAC00\uCE58\uAC00 \uADF8 \uC2DC\uC810\uC5D0 \uC624\uB974\uAC70\uB098 \uB0B4\uB9B0 \uC774\uC720\uB97C \uD568\uAED8 \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
  );
  titleWrap.appendChild(desc);
  const actionWrap = AppHelper.createUIElement("div", "currencyReasonActions", {
    display: "flex",
    gap: "8px",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  topBar.appendChild(actionWrap);
  const toggleBtn = AppHelper.createUIElement(
    "div",
    "currencyReasonToggleBtn",
    {
      padding: "5px 10px",
      fontSize: "11px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(80, 120, 190, 0.7)",
      borderRadius: "999px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "1px solid rgba(140, 180, 255, 0.35)",
      whiteSpace: "nowrap"
    },
    isCurrencyReasonPanelExpanded ? textData.currencyFeatureCollapse || "\uAC04\uB2E8\uD788 \uBCF4\uAE30" : textData.currencyFeatureExpand || "\uC790\uC138\uD788 \uBCF4\uAE30",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          isCurrencyReasonPanelExpanded = !isCurrencyReasonPanelExpanded;
          showCurrencyComparisonOverlay();
        }
      }
    ]
  );
  actionWrap.appendChild(toggleBtn);
  if (selectedCurrencyYear !== null) {
    const clearBtn = AppHelper.createUIElement(
      "div",
      "currencyReasonClearBtn",
      {
        padding: "5px 10px",
        fontSize: "11px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "rgba(140, 70, 70, 0.75)",
        borderRadius: "999px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: "1px solid rgba(220, 120, 120, 0.35)",
        whiteSpace: "nowrap"
      },
      textData.currencyFeatureClearSelection || "\uC120\uD0DD \uD574\uC81C",
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            selectedCurrencyYear = null;
            showCurrencyComparisonOverlay();
          }
        }
      ]
    );
    actionWrap.appendChild(clearBtn);
  }
  if (year === null) {
    const noSel = AppHelper.createUIElement(
      "div",
      "currencyReasonEmpty",
      {
        padding: "2%",
        backgroundColor: "rgba(20, 35, 70, 0.55)",
        borderRadius: "10px",
        color: "rgba(180, 210, 255, 0.7)",
        fontSize: "13px",
        boxSizing: "border-box",
        pointerEvents: "none",
        flexShrink: "0"
      },
      textData.currencyFeatureNoReason || "\uADF8\uB798\uD504\uC5D0\uC11C \uC5F0\uB3C4\uB97C \uC120\uD0DD\uD558\uBA74 \uD574\uB2F9 \uC2DC\uC810\uC758 \uB4F1\uB77D \uC6D0\uC778\uC744 \uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    );
    container.appendChild(noSel);
    return;
  }
  const allSections = [];
  for (const currencyId of selectedCurrencyIds) {
    const reasons = getCurrencyReasonsForYear(currencyId, year);
    if (reasons.length > 0) {
      allSections.push({ currencyId, reasons });
    }
  }
  if (allSections.length === 0) {
    const noReason = AppHelper.createUIElement(
      "div",
      "currencyReasonNoItem",
      {
        padding: "2%",
        backgroundColor: "rgba(20, 35, 70, 0.55)",
        borderRadius: "10px",
        color: "rgba(180, 210, 255, 0.7)",
        fontSize: "13px",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      textData.currencyFeatureNoReason || "\uC120\uD0DD\uD55C \uC5F0\uB3C4\uC5D0 \uB300\uD55C \uC124\uBA85 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."
    );
    container.appendChild(noReason);
    return;
  }
  const summaryBox = AppHelper.createUIElement("div", "currencyReasonSummaryBox", {
    padding: "1.3% 1.5%",
    marginBottom: "1.2%",
    backgroundColor: "rgba(20, 35, 70, 0.5)",
    borderRadius: "10px",
    border: "1px solid rgba(120, 170, 255, 0.2)",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  container.appendChild(summaryBox);
  const summaryTitle = AppHelper.createUIElement(
    "div",
    "currencyReasonSummaryTitle",
    {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#93c5fd",
      marginBottom: "0.7%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    textData.currencyFeatureSummaryTitle || "\uBE60\uB978 \uC694\uC57D"
  );
  summaryBox.appendChild(summaryTitle);
  for (let s = 0; s < allSections.length; s++) {
    const sectionInfo = allSections[s];
    const firstReason = sectionInfo.reasons[0];
    const dirColor = firstReason.direction === "up" ? "#4ecdc4" : firstReason.direction === "down" ? "#ff6b6b" : "#ffe66d";
    const dirLabel = firstReason.direction === "up" ? textData.impactUp : firstReason.direction === "down" ? textData.impactDown : textData.impactVolatile;
    const summaryRow = AppHelper.createUIElement(
      "div",
      `currencyReasonSummaryRow_${sectionInfo.currencyId}_${s}`,
      {
        fontSize: "12px",
        color: "#dbeafe",
        lineHeight: "1.6",
        marginBottom: s < allSections.length - 1 ? "0.4%" : "0",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u25CF ${getCurrencyName(sectionInfo.currencyId)} \xB7 ${dirLabel} \xB7 ${firstReason.title}`
    );
    summaryRow.style.color = dirColor;
    summaryBox.appendChild(summaryRow);
  }
  const listWrap = AppHelper.createUIElement("div", "currencyReasonListWrap", {
    flex: "1",
    minHeight: "0",
    overflowY: isCurrencyReasonPanelExpanded ? "auto" : "hidden",
    boxSizing: "border-box",
    pointerEvents: "auto"
  });
  container.appendChild(listWrap);
  const compactLimit = 1;
  for (const sectionInfo of allSections) {
    const currencyId = sectionInfo.currencyId;
    const reasons = isCurrencyReasonPanelExpanded ? sectionInfo.reasons : sectionInfo.reasons.slice(0, compactLimit);
    const section = AppHelper.createUIElement("div", `currencyReasonSection_${currencyId}`, {
      marginBottom: "1.5%",
      padding: "1.5%",
      backgroundColor: "rgba(15, 28, 58, 0.7)",
      borderRadius: "10px",
      border: `1px solid ${colors[currencyId] || "#ffffff"}50`,
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    listWrap.appendChild(section);
    const sectionHeader = AppHelper.createUIElement("div", `currencyReasonSectionHeader_${currencyId}`, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1%",
      boxSizing: "border-box",
      pointerEvents: "none",
      gap: "8px"
    });
    section.appendChild(sectionHeader);
    const sectionTitle = AppHelper.createUIElement(
      "div",
      `currencyReasonSectionTitle_${currencyId}`,
      {
        fontSize: "14px",
        fontWeight: "bold",
        color: colors[currencyId] || "#ffffff",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u25CF ${getCurrencyName(currencyId)}`
    );
    sectionHeader.appendChild(sectionTitle);
    const countBadge = AppHelper.createUIElement(
      "div",
      `currencyReasonCount_${currencyId}`,
      {
        fontSize: "10px",
        color: "#dbeafe",
        backgroundColor: "rgba(80, 120, 190, 0.25)",
        padding: "2px 7px",
        borderRadius: "999px",
        boxSizing: "border-box",
        pointerEvents: "none",
        whiteSpace: "nowrap"
      },
      `${sectionInfo.reasons.length}${textData.currencyFeatureReasonCountSuffix || "\uAC74"}`
    );
    sectionHeader.appendChild(countBadge);
    for (let i = 0; i < reasons.length; i++) {
      const reason = reasons[i];
      const dirColor = reason.direction === "up" ? "#4ecdc4" : reason.direction === "down" ? "#ff6b6b" : "#ffe66d";
      const dirLabel = reason.direction === "up" ? textData.impactUp : reason.direction === "down" ? textData.impactDown : textData.impactVolatile;
      const card = AppHelper.createUIElement("div", `currencyReasonCard_${currencyId}_${i}`, {
        padding: "1.2% 1.5%",
        marginBottom: "0.8%",
        backgroundColor: "rgba(24, 42, 82, 0.65)",
        borderRadius: "8px",
        borderLeft: `4px solid ${dirColor}`,
        boxSizing: "border-box",
        pointerEvents: "none"
      });
      section.appendChild(card);
      const topRow = AppHelper.createUIElement("div", `currencyReasonTop_${currencyId}_${i}`, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.5%",
        boxSizing: "border-box",
        pointerEvents: "none",
        gap: "8px"
      });
      card.appendChild(topRow);
      const titleEl = AppHelper.createUIElement(
        "div",
        `currencyReasonTitle_${currencyId}_${i}`,
        {
          fontSize: "13px",
          fontWeight: "bold",
          color: "#ffffff",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        reason.title
      );
      topRow.appendChild(titleEl);
      const dirEl = AppHelper.createUIElement(
        "div",
        `currencyReasonDir_${currencyId}_${i}`,
        {
          fontSize: "11px",
          fontWeight: "bold",
          color: dirColor,
          boxSizing: "border-box",
          pointerEvents: "none",
          whiteSpace: "nowrap"
        },
        dirLabel
      );
      topRow.appendChild(dirEl);
      const periodEl = AppHelper.createUIElement(
        "div",
        `currencyReasonPeriod_${currencyId}_${i}`,
        {
          fontSize: "11px",
          color: "rgba(190, 215, 255, 0.55)",
          marginBottom: "0.5%",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        `${reason.startYear}~${reason.endYear}`
      );
      card.appendChild(periodEl);
      const reasonTextToShow = !isCurrencyReasonPanelExpanded && reason.reason.length > 110 ? `${reason.reason.slice(0, 110)}...` : reason.reason;
      const reasonEl = AppHelper.createUIElement(
        "div",
        `currencyReasonText_${currencyId}_${i}`,
        {
          fontSize: "13px",
          color: "#dce8ff",
          lineHeight: "1.6",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        reasonTextToShow
      );
      card.appendChild(reasonEl);
      if (reason.categories.length > 0) {
        const tagRow = AppHelper.createUIElement("div", `currencyReasonTags_${currencyId}_${i}`, {
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "0.8%",
          boxSizing: "border-box",
          pointerEvents: "none"
        });
        card.appendChild(tagRow);
        for (let j = 0; j < reason.categories.length; j++) {
          const catId = reason.categories[j];
          const label = textData.currencyCategoryLabels && textData.currencyCategoryLabels[catId] || catId;
          const tag = AppHelper.createUIElement(
            "span",
            `currencyReasonTag_${currencyId}_${i}_${j}`,
            {
              fontSize: "10px",
              color: "#bcd3ff",
              backgroundColor: "rgba(80, 120, 190, 0.25)",
              padding: "2px 7px",
              borderRadius: "999px",
              boxSizing: "border-box",
              pointerEvents: "none"
            },
            label
          );
          tagRow.appendChild(tag);
        }
      }
    }
    if (!isCurrencyReasonPanelExpanded && sectionInfo.reasons.length > compactLimit) {
      const moreHint = AppHelper.createUIElement(
        "div",
        `currencyReasonMoreHint_${currencyId}`,
        {
          fontSize: "11px",
          color: "rgba(190, 215, 255, 0.65)",
          marginTop: "0.3%",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        (textData.currencyFeatureMoreReasonHint || "\uB098\uBA38\uC9C0 \uC124\uBA85\uC740 '\uC790\uC138\uD788 \uBCF4\uAE30'\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.").replace(/\{count\}/g, String(sectionInfo.reasons.length - compactLimit))
      );
      section.appendChild(moreHint);
    }
  }
}
function drawCurrencyComparisonChart(c, w, h, histories) {
  if (!textData || histories.length === 0) return;
  const colors = getDefaultCurrencyColors();
  const padding = { top: 30, right: 110, bottom: 55, left: 70 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const allPoints = [];
  for (const hist of histories) {
    for (const p of hist.data) {
      allPoints.push(p);
    }
  }
  if (allPoints.length === 0) return;
  let minYear = allPoints[0].year;
  let maxYear = allPoints[0].year;
  let minValue = allPoints[0].valueIndex;
  let maxValue = allPoints[0].valueIndex;
  for (const p of allPoints) {
    if (p.year < minYear) minYear = p.year;
    if (p.year > maxYear) maxYear = p.year;
    if (p.valueIndex < minValue) minValue = p.valueIndex;
    if (p.valueIndex > maxValue) maxValue = p.valueIndex;
  }
  const valuePad = Math.max(5, (maxValue - minValue) * 0.08);
  minValue -= valuePad;
  maxValue += valuePad;
  c.clearRect(0, 0, w, h);
  c.fillStyle = "rgba(8, 18, 40, 1)";
  c.fillRect(0, 0, w, h);
  c.strokeStyle = "rgba(90, 130, 200, 0.18)";
  c.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + chartH / 5 * i;
    c.beginPath();
    c.moveTo(padding.left, y);
    c.lineTo(padding.left + chartW, y);
    c.stroke();
    const labelValue = maxValue - (maxValue - minValue) / 5 * i;
    c.fillStyle = "rgba(180, 210, 255, 0.65)";
    c.font = "12px sans-serif";
    c.textAlign = "right";
    c.textBaseline = "middle";
    c.fillText(labelValue.toFixed(0), padding.left - 8, y);
  }
  const yearRange = Math.max(1, maxYear - minYear);
  const yearStep = Math.max(1, Math.floor(yearRange / 8));
  for (let year = minYear; year <= maxYear; year += yearStep) {
    const x = padding.left + (year - minYear) / yearRange * chartW;
    c.strokeStyle = "rgba(90, 130, 200, 0.10)";
    c.beginPath();
    c.moveTo(x, padding.top);
    c.lineTo(x, padding.top + chartH);
    c.stroke();
    c.fillStyle = "rgba(180, 210, 255, 0.65)";
    c.font = "12px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "top";
    c.fillText(String(year), x, padding.top + chartH + 8);
  }
  if (hoveredCurrencyYear !== null) {
    const hoverX = padding.left + (hoveredCurrencyYear - minYear) / yearRange * chartW;
    c.strokeStyle = "rgba(255,255,255,0.2)";
    c.setLineDash([4, 4]);
    c.beginPath();
    c.moveTo(hoverX, padding.top);
    c.lineTo(hoverX, padding.top + chartH);
    c.stroke();
    c.setLineDash([]);
  }
  if (selectedCurrencyYear !== null) {
    const selectedX = padding.left + (selectedCurrencyYear - minYear) / yearRange * chartW;
    c.strokeStyle = "rgba(251, 191, 36, 0.9)";
    c.lineWidth = 2;
    c.setLineDash([6, 4]);
    c.beginPath();
    c.moveTo(selectedX, padding.top);
    c.lineTo(selectedX, padding.top + chartH);
    c.stroke();
    c.setLineDash([]);
    c.fillStyle = "rgba(251, 191, 36, 0.16)";
    c.fillRect(selectedX - 8, padding.top, 16, chartH);
    c.fillStyle = "#fbbf24";
    c.font = "bold 12px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "bottom";
    c.fillText(`${selectedCurrencyYear}`, selectedX, padding.top - 6);
    c.lineWidth = 1;
  }
  for (const hist of histories) {
    const lineColor = colors[hist.currencyId] || "#ffffff";
    c.beginPath();
    c.lineWidth = 3;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.strokeStyle = lineColor;
    for (let i = 0; i < hist.data.length; i++) {
      const p = hist.data[i];
      const x = padding.left + (p.year - minYear) / yearRange * chartW;
      const y = padding.top + chartH - (p.valueIndex - minValue) / (maxValue - minValue) * chartH;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();
    for (let i = 0; i < hist.data.length; i++) {
      const p = hist.data[i];
      const x = padding.left + (p.year - minYear) / yearRange * chartW;
      const y = padding.top + chartH - (p.valueIndex - minValue) / (maxValue - minValue) * chartH;
      const isHoveredPoint = hoveredCurrencyYear === p.year;
      const isSelectedPoint = selectedCurrencyYear === p.year;
      if (isSelectedPoint) {
        const glow = c.createRadialGradient(x, y, 0, x, y, 12);
        glow.addColorStop(0, "rgba(251, 191, 36, 0.4)");
        glow.addColorStop(1, "rgba(251, 191, 36, 0)");
        c.fillStyle = glow;
        c.beginPath();
        c.arc(x, y, 12, 0, Math.PI * 2);
        c.fill();
      }
      c.beginPath();
      c.arc(x, y, isSelectedPoint ? 7 : isHoveredPoint ? 5 : 3, 0, Math.PI * 2);
      c.fillStyle = isSelectedPoint ? "#fbbf24" : lineColor;
      c.fill();
      c.strokeStyle = "#ffffff";
      c.lineWidth = isSelectedPoint ? 2 : 1;
      c.stroke();
    }
  }
  let legendY = padding.top + 5;
  for (const hist of histories) {
    const lineColor = colors[hist.currencyId] || "#ffffff";
    c.fillStyle = lineColor;
    c.beginPath();
    c.arc(w - 95, legendY + 8, 5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#e5efff";
    c.font = "12px sans-serif";
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.fillText(getCurrencyName(hist.currencyId), w - 82, legendY + 8);
    legendY += 22;
  }
  c.fillStyle = "rgba(220, 235, 255, 0.85)";
  c.font = "bold 13px sans-serif";
  c.textAlign = "left";
  c.textBaseline = "top";
  c.fillText(textData.currencyFeatureCompareLabel || "\uAC00\uCE58 \uC9C0\uC218", padding.left, 8);
}
function toggleCurrencySelection(currencyId) {
  const idx = selectedCurrencyIds.indexOf(currencyId);
  if (idx >= 0) {
    if (selectedCurrencyIds.length <= 1) return;
    selectedCurrencyIds.splice(idx, 1);
  } else {
    selectedCurrencyIds.push(currencyId);
  }
  if (selectedCurrencyYear !== null) {
    let hasAnyReason = false;
    for (const cid of selectedCurrencyIds) {
      if (getCurrencyReasonsForYear(cid, selectedCurrencyYear).length > 0) {
        hasAnyReason = true;
        break;
      }
    }
    if (!hasAnyReason) selectedCurrencyYear = null;
  }
  hoveredCurrencyYear = null;
  showCurrencyComparisonOverlay();
}
function getCurrencyReasonsForYear(currencyId, year) {
  if (!appData || !appData.currencyReasonEvents) return [];
  return appData.currencyReasonEvents.filter((item) => item.currencyId === currencyId && year >= item.startYear && year <= item.endYear).sort((a, b) => a.startYear - b.startYear);
}
function getCurrencyHistoryById(currencyId) {
  if (!appData || !appData.currencyValueHistory) return null;
  return appData.currencyValueHistory.find((item) => item.currencyId === currencyId) || null;
}
function getCurrencyName(currencyId) {
  if (!textData) return currencyId.toUpperCase();
  const names = textData.currencyNames || {};
  return names[currencyId] || currencyId.toUpperCase();
}
function getDefaultCurrencyColors() {
  return {
    usd: "#60a5fa",
    eur: "#fbbf24",
    jpy: "#a78bfa",
    gbp: "#34d399",
    chf: "#f472b6",
    cny: "#f87171"
  };
}
function drawSharpCountryLabel(c, countryName, x, y, fontPx) {
  const safeFontPx = Math.max(12, Math.round(fontPx));
  const texture = getCountryLabelTexture(countryName, safeFontPx);
  const drawScale = 1 / (LABEL_RENDER_SCALE * LABEL_CACHE_PIXEL_RATIO);
  const drawWidth = texture.width * drawScale;
  const drawHeight = texture.height * drawScale;
  c.save();
  c.imageSmoothingEnabled = true;
  c.imageSmoothingQuality = "high";
  c.translate(Math.round(x), Math.round(y));
  c.drawImage(texture, -drawWidth / 2, -drawHeight, drawWidth, drawHeight);
  c.restore();
}
function getCountryLabelTexture(countryName, fontPx) {
  const safeFontPx = Math.max(12, Math.round(fontPx));
  const cacheKey = `${countryName}_${safeFontPx}`;
  const cached = countryLabelTextureCache.get(cacheKey);
  if (cached) return cached;
  const scale = LABEL_RENDER_SCALE * LABEL_CACHE_PIXEL_RATIO;
  const paddingX = 16;
  const paddingY = 10;
  const measureCanvas = AppHelper.createUIElement("canvas", "", {});
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) {
    countryLabelTextureCache.set(cacheKey, measureCanvas);
    return measureCanvas;
  }
  measureCtx.font = `${LABEL_FONT_WEIGHT} ${safeFontPx * scale}px ${LABEL_FONT_FAMILY}`;
  const metrics = measureCtx.measureText(countryName);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(safeFontPx * scale * 1.2);
  const canvas = AppHelper.createUIElement("canvas", "", {});
  canvas.width = Math.max(1, textWidth + paddingX * 2);
  canvas.height = Math.max(1, textHeight + paddingY * 2);
  const c = canvas.getContext("2d");
  if (!c) {
    countryLabelTextureCache.set(cacheKey, canvas);
    return canvas;
  }
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.imageSmoothingEnabled = true;
  c.imageSmoothingQuality = "high";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = `${LABEL_FONT_WEIGHT} ${safeFontPx * scale}px ${LABEL_FONT_FAMILY}`;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  c.lineJoin = "round";
  c.lineCap = "round";
  c.strokeStyle = "rgba(0, 0, 0, 0.92)";
  c.lineWidth = Math.max(4, safeFontPx * scale * 0.16);
  c.miterLimit = 2;
  c.strokeText(countryName, centerX, centerY);
  c.fillStyle = "rgba(255, 255, 255, 0.98)";
  c.fillText(countryName, centerX, centerY);
  countryLabelTextureCache.set(cacheKey, canvas);
  return canvas;
}
function clearCountryLabelTextureCache() {
  countryLabelTextureCache.clear();
}
function buildCompanyDetailDb(resourceId, resourceName) {
  if (!textData) return {};
  const st = textData;
  const db = {
    tungsten: {
      Kennametal: {
        business: st.compBizKennametal || "\uBBF8\uAD6D\uC758 \uCD08\uACBD\uD569\uAE08 \uC808\uC0AD\uACF5\uAD6C \uC81C\uC870 \uC804\uBB38\uAE30\uC5C5. \uAE08\uC18D \uAC00\uACF5, \uAD11\uC0B0 \uC7A5\uBE44, \uAC74\uC124 \uACF5\uAD6C \uB4F1\uC744 \uC0DD\uC0B0\uD558\uBA70, \uD145\uC2A4\uD150 \uCE74\uBC14\uC774\uB4DC(WC)\uAC00 \uD575\uC2EC \uC6D0\uB8CC\uC785\uB2C8\uB2E4.",
        whyDamaged: st.compWhyKennametal || "{country}\uC758 {resource} \uAC10\uC0B0\uC73C\uB85C \uCD08\uACBD\uD569\uAE08 \uC6D0\uC790\uC7AC \uAC00\uACA9\uC774 \uAE09\uB4F1\uD558\uBA74, \uC808\uC0AD\uACF5\uAD6C \uC81C\uC870 \uC6D0\uAC00\uAC00 \uD06C\uAC8C \uC0C1\uC2B9\uD569\uB2C8\uB2E4. \uACE0\uAC1D\uC0AC(\uC790\uB3D9\uCC28\xB7\uD56D\uACF5 \uC81C\uC870\uC5C5)\uC5D0 \uAC00\uACA9\uC744 \uC804\uAC00\uD558\uAE30 \uC5B4\uB824\uC6CC \uB9C8\uC9C4\uC774 \uC555\uBC15\uB429\uB2C8\uB2E4.",
        resourceUsage: st.compUsageKennametal || "\uD145\uC2A4\uD150 \uCE74\uBC14\uC774\uB4DC(WC)\uB97C \uC8FC\uC6D0\uB8CC\uB85C \uCD08\uACBD\uD569\uAE08 \uC778\uC11C\uD2B8, \uB4DC\uB9B4 \uBE44\uD2B8, \uBC00\uB9C1 \uACF5\uAD6C \uB4F1\uC744 \uC81C\uC870\uD569\uB2C8\uB2E4. \uC5F0\uAC04 \uC218\uCC9C \uD1A4\uC758 {resource}\uC744 \uC18C\uBE44\uD569\uB2C8\uB2E4."
      },
      "Lockheed Martin": {
        business: st.compBizLockheed || "\uC138\uACC4 \uCD5C\uB300 \uBC29\uC704\uC0B0\uC5C5\uCCB4. F-35 \uC804\uD22C\uAE30, \uBBF8\uC0AC\uC77C \uBC29\uC5B4 \uC2DC\uC2A4\uD15C, \uC6B0\uC8FC \uD0D0\uC0AC \uC7A5\uBE44 \uB4F1\uC744 \uC81C\uC870\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyLockheed || "\uD145\uC2A4\uD150\uC740 \uAD00\uD1B5\uD0C4(APFSDS), \uBBF8\uC0AC\uC77C \uD0C4\uB450, \uBC29\uD0C4 \uC7A5\uAC11 \uB4F1 \uD575\uC2EC \uAD70\uC218\uD488\uC758 \uD544\uC218 \uC18C\uC7AC\uC785\uB2C8\uB2E4. {country}\uC758 \uAC10\uC0B0\uC73C\uB85C \uAD70\uC218\uC6A9 \uD145\uC2A4\uD150 \uC870\uB2EC\uC774 \uC5B4\uB824\uC6CC\uC9C0\uBA74 \uBB34\uAE30 \uC0DD\uC0B0 \uC77C\uC815\uC5D0 \uCC28\uC9C8\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageLockheed || "\uBC29\uD0C4 \uC7A5\uAC11\uD310, \uAD00\uD1B5\uD0C4 \uCF54\uC5B4, \uB85C\uCF13 \uB178\uC990 \uB0B4\uC5F4 \uBD80\uD488 \uB4F1\uC5D0 \uACE0\uC21C\uB3C4 \uD145\uC2A4\uD150\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      "H.C. Starck": {
        business: st.compBizHCStarck || "\uB3C5\uC77C\uC758 \uD145\uC2A4\uD150 \uBD84\uB9D0 \uBC0F \uD2B9\uC218\uAE08\uC18D \uAC00\uACF5 \uC804\uBB38\uAE30\uC5C5. \uBC18\uB3C4\uCCB4, \uC758\uB8CC, \uD56D\uACF5 \uBD84\uC57C\uC5D0 \uACE0\uC21C\uB3C4 \uD145\uC2A4\uD150 \uC81C\uD488\uC744 \uACF5\uAE09\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyHCStarck || "\uD145\uC2A4\uD150 \uC6D0\uAD11 \uC218\uC785\uC5D0 \uC758\uC874\uD558\uACE0 \uC788\uC5B4, \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uAC00\uACF5\xB7\uC815\uC81C \uB77C\uC778 \uAC00\uB3D9\uB960\uC774 \uD558\uB77D\uD558\uACE0 \uACE0\uAC1D\uC0AC \uB0A9\uAE30 \uC9C0\uC5F0\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageHCStarck || "\uD145\uC2A4\uD150 \uBD84\uB9D0\uC744 \uC815\uC81C\uD558\uC5EC \uBC18\uB3C4\uCCB4 \uC2A4\uD37C\uD130\uB9C1 \uD0C0\uAC9F, \uC758\uB8CC\uAE30\uAE30\uC6A9 X\uC120 \uCC28\uD3D0\uC7AC, \uD56D\uACF5 \uBD80\uD488 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4."
      },
      "Sumitomo Electric": {
        business: st.compBizSumitomo || "\uC77C\uBCF8\uC758 \uC885\uD569 \uC804\uAE30\xB7\uAE08\uC18D \uAE30\uC5C5. \uCD08\uACBD\uD569\uAE08 \uACF5\uAD6C, \uC804\uC120, \uAD11\uD1B5\uC2E0 \uBD80\uD488 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhySumitomo || "\uCD08\uACBD\uD569\uAE08 \uC808\uC0AD\uACF5\uAD6C\uC758 \uD575\uC2EC \uC6D0\uB8CC\uC778 \uD145\uC2A4\uD150 \uC218\uC785\uC774 \uCC28\uC9C8\uC744 \uBE5A\uC73C\uBA74, \uC790\uB3D9\uCC28\xB7\uAE30\uACC4 \uC81C\uC870\uC5C5\uC5D0 \uB0A9\uD488\uD558\uB294 \uACF5\uAD6C \uC0DD\uC0B0\uC5D0 \uC9C1\uC811\uC801 \uD0C0\uACA9\uC744 \uBC1B\uC2B5\uB2C8\uB2E4.",
        resourceUsage: st.compUsageSumitomo || "\uD145\uC2A4\uD150 \uCE74\uBC14\uC774\uB4DC \uAE30\uBC18 \uCD08\uACBD\uD569\uAE08 \uC778\uC11C\uD2B8\uC640 \uC640\uC774\uC5B4 \uBC29\uC804 \uAC00\uACF5\uC6A9 \uC804\uADF9\uC120\uC744 \uC81C\uC870\uD569\uB2C8\uB2E4."
      },
      \uC0BC\uC131\uC804\uC790: {
        business: st.compBizSamsung || "\uC138\uACC4 \uCD5C\uB300 \uBA54\uBAA8\uB9AC \uBC18\uB3C4\uCCB4 \uC81C\uC870\uC5C5\uCCB4\uC774\uC790 \uAE00\uB85C\uBC8C \uC804\uC790\uAE30\uC5C5. \uC2A4\uB9C8\uD2B8\uD3F0, \uB514\uC2A4\uD50C\uB808\uC774, \uAC00\uC804\uC81C\uD488 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhySamsung || "\uBC18\uB3C4\uCCB4 \uBC30\uC120 \uACF5\uC815\uC5D0 \uD145\uC2A4\uD150 \uC2A4\uD37C\uD130\uB9C1 \uD0C0\uAC9F\uC774 \uD544\uC218\uC801\uC785\uB2C8\uB2E4. \uD145\uC2A4\uD150 \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uBC18\uB3C4\uCCB4 \uC0DD\uC0B0\uB77C\uC778 \uAC00\uB3D9\uC5D0 \uC9C0\uC7A5\uC774 \uC0DD\uAE38 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
        resourceUsage: st.compUsageSamsung || "\uBC18\uB3C4\uCCB4 \uBC30\uC120 \uACF5\uC815\uC5D0\uC11C \uD145\uC2A4\uD150\uC744 \uC804\uADF9 \uBC0F \uBC30\uB9AC\uC5B4 \uAE08\uC18D\uC73C\uB85C \uC0AC\uC6A9\uD569\uB2C8\uB2E4. \uBBF8\uC138 \uACF5\uC815\uC77C\uC218\uB85D \uD145\uC2A4\uD150 \uC758\uC874\uB3C4\uAC00 \uB192\uC544\uC9D1\uB2C8\uB2E4."
      },
      Sandvik: {
        business: st.compBizSandvik || "\uC2A4\uC6E8\uB374\uC758 \uCD08\uACBD\uD569\uAE08 \uC808\uC0AD\uACF5\uAD6C \uBC0F \uAD11\uC0B0 \uC7A5\uBE44 \uAE00\uB85C\uBC8C 1\uC704 \uAE30\uC5C5. \uAC74\uC124, \uC790\uB3D9\uCC28, \uD56D\uACF5 \uBD84\uC57C\uC5D0 \uACF5\uAD6C\uB97C \uACF5\uAE09\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhySandvik || "\uC804 \uC138\uACC4 \uC808\uC0AD\uACF5\uAD6C \uC2DC\uC7A5\uC758 \uC57D 20%\uB97C \uCC28\uC9C0\uD558\uB294 \uB9CC\uD07C, \uD145\uC2A4\uD150 \uC870\uB2EC \uAC00\uACA9 \uC0C1\uC2B9\uC774 \uC9C1\uC811\uC801\uC73C\uB85C \uC774\uC775\uB960\uC744 \uC555\uBC15\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageSandvik || "\uD145\uC2A4\uD150 \uCE74\uBC14\uC774\uB4DC\uB97C \uC8FC\uC6D0\uB8CC\uB85C \uCF54\uB85C\uB9CC\uD2B8 \uBE0C\uB79C\uB4DC\uC758 \uC808\uC0AD \uC778\uC11C\uD2B8, \uB4DC\uB9B4, \uC5D4\uB4DC\uBC00 \uB4F1\uC744 \uC81C\uC870\uD569\uB2C8\uB2E4."
      },
      Bosch: {
        business: st.compBizBosch || "\uB3C5\uC77C\uC758 \uC138\uACC4 \uCD5C\uB300 \uC790\uB3D9\uCC28 \uBD80\uD488 \uBC0F \uC0B0\uC5C5\uAE30\uC220 \uAE30\uC5C5. \uC804\uB3D9\uACF5\uAD6C, \uC790\uB3D9\uCC28 \uC804\uC7A5 \uBD80\uD488, IoT \uC194\uB8E8\uC158 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyBosch || "\uC804\uB3D9\uACF5\uAD6C\uC758 \uB4DC\uB9B4 \uBE44\uD2B8\uC640 \uC808\uC0AD\uB0A0\uC5D0 \uD145\uC2A4\uD150 \uCE74\uBC14\uC774\uB4DC\uAC00 \uD544\uC218\uC801\uC774\uBA70, \uC790\uB3D9\uCC28 \uBD80\uD488 \uAC00\uACF5 \uACF5\uC815\uC5D0\uB3C4 \uCD08\uACBD\uD569\uAE08 \uACF5\uAD6C\uAC00 \uB300\uB7C9\uC73C\uB85C \uC0AC\uC6A9\uB429\uB2C8\uB2E4.",
        resourceUsage: st.compUsageBosch || "\uC804\uB3D9\uACF5\uAD6C \uB4DC\uB9B4 \uBE44\uD2B8, CNC \uAC00\uACF5\uC6A9 \uCD08\uACBD\uD569\uAE08 \uC778\uC11C\uD2B8, \uC790\uB3D9\uCC28 \uBD80\uD488 \uC815\uBC00 \uAC00\uACF5 \uACF5\uAD6C\uC5D0 \uD145\uC2A4\uD150\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      Intel: {
        business: st.compBizIntel || "\uC138\uACC4 \uCD5C\uB300 CPU \uBC0F \uBC18\uB3C4\uCCB4 \uC124\uACC4\xB7\uC81C\uC870 \uAE30\uC5C5. PC, \uC11C\uBC84, AI \uCE69 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyIntel || "\uBC18\uB3C4\uCCB4 \uBBF8\uC138 \uBC30\uC120 \uACF5\uC815\uC5D0 \uD145\uC2A4\uD150\uC774 \uD544\uC218\uC801\uC73C\uB85C \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uACF5\uAE09 \uBD80\uC871 \uC2DC \uCD5C\uCCA8\uB2E8 \uCE69 \uC0DD\uC0B0\uC5D0 \uBCD1\uBAA9\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageIntel || "\uBC18\uB3C4\uCCB4 \uCE69 \uB0B4\uBD80 \uAE08\uC18D \uBC30\uC120\uC758 \uCF58\uD0DD\uD2B8 \uD50C\uB7EC\uADF8\uC640 \uBE44\uC544 \uCDA9\uC804 \uC18C\uC7AC\uB85C \uD145\uC2A4\uD150\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      "Applied Materials": {
        business: st.compBizAppliedMaterials || "\uBC18\uB3C4\uCCB4 \uC81C\uC870 \uC7A5\uBE44 \uC138\uACC4 1\uC704 \uAE30\uC5C5. \uC99D\uCC29, \uC2DD\uAC01, CMP \uB4F1 \uD575\uC2EC \uACF5\uC815 \uC7A5\uBE44\uB97C \uACF5\uAE09\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyAppliedMaterials || "\uD145\uC2A4\uD150 \uC99D\uCC29(CVD) \uC7A5\uBE44\uC640 \uD145\uC2A4\uD150 \uC2A4\uD37C\uD130\uB9C1 \uD0C0\uAC9F\uC744 \uBC18\uB3C4\uCCB4 \uACF5\uC7A5\uC5D0 \uACF5\uAE09\uD558\uB294\uB370, \uC6D0\uC790\uC7AC \uBD80\uC871 \uC2DC \uC7A5\uBE44 \uB0A9\uAE30 \uBC0F \uC18C\uBAA8\uC7AC \uACF5\uAE09\uC5D0 \uCC28\uC9C8\uC774 \uC0DD\uAE41\uB2C8\uB2E4.",
        resourceUsage: st.compUsageAppliedMaterials || "\uD145\uC2A4\uD150 CVD \uC99D\uCC29 \uC7A5\uBE44\uC640 \uAD00\uB828 \uC18C\uBAA8\uC7AC(\uD145\uC2A4\uD150 \uD0C0\uAC9F, \uC804\uAD6C\uCCB4)\uB97C \uBC18\uB3C4\uCCB4 \uC81C\uC870\uC0AC\uC5D0 \uACF5\uAE09\uD569\uB2C8\uB2E4."
      },
      SK\uD558\uC774\uB2C9\uC2A4: {
        business: st.compBizSKHynix || "\uC138\uACC4 2\uC704 \uBA54\uBAA8\uB9AC \uBC18\uB3C4\uCCB4 \uAE30\uC5C5. DRAM, NAND Flash, HBM \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhySKHynix || "DRAM \uBC0F 3D NAND \uC81C\uC870 \uACF5\uC815\uC5D0\uC11C \uD145\uC2A4\uD150 \uBC30\uC120\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uD2B9\uD788 HBM \uB4F1 \uCC28\uC138\uB300 \uBA54\uBAA8\uB9AC \uC0DD\uC0B0 \uD655\uB300 \uC2DC \uD145\uC2A4\uD150 \uC218\uC694\uAC00 \uC99D\uAC00\uD558\uC5EC \uACF5\uAE09 \uCC28\uC9C8\uC758 \uC601\uD5A5\uC774 \uD07D\uB2C8\uB2E4.",
        resourceUsage: st.compUsageSKHynix || "\uBA54\uBAA8\uB9AC \uBC18\uB3C4\uCCB4 \uC6CC\uB4DC\uB77C\uC778, \uBE44\uD2B8\uB77C\uC778 \uB4F1\uC758 \uAE08\uC18D \uBC30\uC120\uC5D0 \uD145\uC2A4\uD150\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      }
    },
    rare_earth: {
      Tesla: {
        business: st.compBizTesla || "\uC138\uACC4 \uCD5C\uB300 \uC804\uAE30\uCC28 \uC81C\uC870\uC0AC. \uC804\uAE30\uCC28, \uC5D0\uB108\uC9C0 \uC800\uC7A5 \uC2DC\uC2A4\uD15C, \uD0DC\uC591\uAD11 \uD328\uB110 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyTesla || "\uC804\uAE30\uCC28 \uAD6C\uB3D9 \uBAA8\uD130\uC5D0 \uB124\uC624\uB514\uBBB4 \uC601\uAD6C\uC790\uC11D\uC774 \uD575\uC2EC\uC801\uC73C\uB85C \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uD76C\uD1A0\uB958 \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uBAA8\uD130 \uC0DD\uC0B0 \uBE44\uC6A9\uC774 \uAE09\uB4F1\uD558\uACE0, \uCC28\uB7C9 \uC778\uB3C4 \uC77C\uC815\uC5D0 \uC9C0\uC5F0\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageTesla || "\uC601\uAD6C\uC790\uC11D \uB3D9\uAE30 \uBAA8\uD130(PMSM)\uC5D0 \uB124\uC624\uB514\uBBB4-\uCCA0-\uBCF4\uB860(NdFeB) \uC790\uC11D\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4. \uCC28\uB7C9 1\uB300\uB2F9 \uC57D 1~2kg\uC758 \uD76C\uD1A0\uB958\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4."
      },
      Apple: {
        business: st.compBizApple || "\uC138\uACC4 \uCD5C\uB300 IT \uAE30\uC5C5. iPhone, Mac, iPad, AirPods \uB4F1 \uD504\uB9AC\uBBF8\uC5C4 \uC804\uC790\uAE30\uAE30\uB97C \uC124\uACC4\xB7\uD310\uB9E4\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyApple || "\uC2A4\uB9C8\uD2B8\uD3F0 \uCE74\uBA54\uB77C \uB80C\uC988, \uD585\uD2F1 \uBAA8\uD130, \uC2A4\uD53C\uCEE4\uC5D0 \uD76C\uD1A0\uB958 \uC790\uC11D\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uACF5\uAE09 \uBD80\uC871 \uC2DC iPhone \uC0DD\uC0B0 \uCC28\uC9C8\uACFC \uBD80\uD488 \uB2E8\uAC00 \uC0C1\uC2B9\uC774 \uBD88\uAC00\uD53C\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageApple || "iPhone \uD585\uD2F1 \uC5D4\uC9C4(Taptic Engine), \uCE74\uBA54\uB77C OIS \uBAA8\uB4C8, \uC2A4\uD53C\uCEE4 \uC790\uC11D\uC5D0 \uB124\uC624\uB514\uBBB4 \uC601\uAD6C\uC790\uC11D\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      Toyota: {
        business: st.compBizToyota || "\uC138\uACC4 \uCD5C\uB300 \uC790\uB3D9\uCC28 \uC81C\uC870\uC0AC. \uD558\uC774\uBE0C\uB9AC\uB4DC(\uD504\uB9AC\uC6B0\uC2A4), \uC804\uAE30\uCC28, \uC218\uC18C\uCC28(\uBBF8\uB77C\uC774) \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyToyota || "\uD558\uC774\uBE0C\uB9AC\uB4DC \uBC0F \uC804\uAE30\uCC28 \uBAA8\uD130\uC5D0 \uD76C\uD1A0\uB958 \uC601\uAD6C\uC790\uC11D\uC774 \uD544\uC218\uC801\uC785\uB2C8\uB2E4. \uC138\uACC4 \uCD5C\uB2E4 \uD558\uC774\uBE0C\uB9AC\uB4DC \uD310\uB9E4\uC0AC\uB85C\uC11C \uD76C\uD1A0\uB958 \uC218\uAE09 \uB9AC\uC2A4\uD06C\uC5D0 \uAC00\uC7A5 \uBBFC\uAC10\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageToyota || "\uD558\uC774\uBE0C\uB9AC\uB4DC/\uC804\uAE30\uCC28 \uAD6C\uB3D9 \uBAA8\uD130\uC5D0 \uB124\uC624\uB514\uBBB4 \uC790\uC11D\uC744 \uC0AC\uC6A9\uD558\uBA70, \uCC28\uB7C9 1\uB300\uB2F9 \uC57D 1~3kg\uC758 \uD76C\uD1A0\uB958\uB97C \uC18C\uBE44\uD569\uB2C8\uB2E4."
      },
      Siemens: {
        business: st.compBizSiemens || "\uB3C5\uC77C\uC758 \uAE00\uB85C\uBC8C \uC0B0\uC5C5 \uC790\uB3D9\uD654\xB7\uC5D0\uB108\uC9C0 \uAE30\uC5C5. \uD48D\uB825 \uD130\uBE48, \uC758\uB8CC\uC7A5\uBE44(MRI), \uC0B0\uC5C5 \uBAA8\uD130 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhySiemens || "\uD48D\uB825 \uBC1C\uC804\uAE30 \uC9C1\uC811\uAD6C\uB3D9 \uD130\uBE48\uC5D0 \uB300\uB7C9\uC758 \uB124\uC624\uB514\uBBB4 \uC790\uC11D\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uD76C\uD1A0\uB958 \uAC00\uACA9 \uAE09\uB4F1 \uC2DC \uD48D\uB825 \uD504\uB85C\uC81D\uD2B8 \uC218\uC8FC \uACBD\uC7C1\uB825\uC774 \uC57D\uD654\uB429\uB2C8\uB2E4.",
        resourceUsage: st.compUsageSiemens || "\uB300\uD615 \uD48D\uB825 \uD130\uBE48 \uBC1C\uC804\uAE30\uC5D0 \uC601\uAD6C\uC790\uC11D\uC744 \uC0AC\uC6A9\uD558\uBA70, \uD130\uBE48 1\uAE30\uB2F9 \uC218\uBC31 kg\uC758 \uD76C\uD1A0\uB958\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4."
      },
      \uD604\uB300\uC790\uB3D9\uCC28: {
        business: st.compBizHyundai || "\uD55C\uAD6D \uCD5C\uB300 \uC790\uB3D9\uCC28 \uC81C\uC870\uC0AC. \uC804\uAE30\uCC28(\uC544\uC774\uC624\uB2C9), \uC218\uC18C\uCC28(\uB125\uC3D8), \uB0B4\uC5F0\uAE30\uAD00\uCC28 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyHyundai || "\uC804\uAE30\uCC28 \uBC0F \uD558\uC774\uBE0C\uB9AC\uB4DC \uBAA8\uD130\uC5D0 \uD76C\uD1A0\uB958 \uC601\uAD6C\uC790\uC11D\uC774 \uD544\uC218\uC801\uC785\uB2C8\uB2E4. \uC804\uAE30\uCC28 \uB77C\uC778\uC5C5 \uD655\uB300 \uC804\uB7B5\uC5D0 \uC9C1\uC811\uC801 \uD0C0\uACA9\uC744 \uC90D\uB2C8\uB2E4.",
        resourceUsage: st.compUsageHyundai || "\uC544\uC774\uC624\uB2C9 \uC2DC\uB9AC\uC988 \uC804\uAE30\uCC28 \uAD6C\uB3D9 \uBAA8\uD130\uC5D0 \uB124\uC624\uB514\uBBB4 \uC601\uAD6C\uC790\uC11D\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      Renault: {
        business: st.compBizRenault || "\uD504\uB791\uC2A4 \uB300\uD45C \uC790\uB3D9\uCC28 \uAE30\uC5C5. \uC18C\uD615 \uC804\uAE30\uCC28(Zoe, Megane E-Tech) \uBC0F \uD558\uC774\uBE0C\uB9AC\uB4DC\uCC28\uB97C \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyRenault || "\uC720\uB7FD \uC804\uAE30\uCC28 \uC2DC\uC7A5 \uD655\uB300\uC5D0 \uB530\uB77C \uAD6C\uB3D9 \uBAA8\uD130\uC6A9 \uD76C\uD1A0\uB958 \uC790\uC11D \uC218\uC694\uAC00 \uAE09\uC99D\uD558\uACE0 \uC788\uC73C\uBA70, \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uC0DD\uC0B0 \uACC4\uD68D\uC5D0 \uCC28\uC9C8\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageRenault || "\uC804\uAE30\uCC28 \uBC0F \uD558\uC774\uBE0C\uB9AC\uB4DC \uAD6C\uB3D9 \uBAA8\uD130\uC5D0 \uD76C\uD1A0\uB958 \uC601\uAD6C\uC790\uC11D\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      "General Motors": {
        business: st.compBizGM || "\uBBF8\uAD6D \uCD5C\uB300 \uC790\uB3D9\uCC28 \uC81C\uC870\uC0AC. \uC804\uAE30\uCC28(Ultium \uD50C\uB7AB\uD3FC), \uD53D\uC5C5\uD2B8\uB7ED, SUV \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyGM || "Ultium \uD50C\uB7AB\uD3FC \uAE30\uBC18 \uC804\uAE30\uCC28 \uB300\uB7C9 \uC0DD\uC0B0\uC744 \uC704\uD574 \uC601\uAD6C\uC790\uC11D \uBAA8\uD130\uC6A9 \uD76C\uD1A0\uB958\uAC00 \uD544\uC218\uC801\uC785\uB2C8\uB2E4.",
        resourceUsage: st.compUsageGM || "\uC804\uAE30\uCC28 \uAD6C\uB3D9 \uBAA8\uD130 \uBC0F \uAC01\uC885 \uC13C\uC11C\uC5D0 \uD76C\uD1A0\uB958 \uC790\uC11D\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      "Shin-Etsu Chemical": {
        business: st.compBizShinEtsu || "\uC77C\uBCF8\uC758 \uC138\uACC4 \uCD5C\uB300 \uD76C\uD1A0\uB958 \uC790\uC11D \uBC0F \uBC18\uB3C4\uCCB4 \uC2E4\uB9AC\uCF58 \uC6E8\uC774\uD37C \uC81C\uC870\uC0AC.",
        whyDamaged: st.compWhyShinEtsu || "\uD76C\uD1A0\uB958 \uC6D0\uB8CC\uB97C \uB300\uB7C9 \uC218\uC785\uD558\uC5EC \uB124\uC624\uB514\uBBB4 \uC790\uC11D\uC744 \uAC00\uACF5\xB7\uD310\uB9E4\uD558\uB294 \uAE30\uC5C5\uC73C\uB85C, \uC6D0\uC790\uC7AC \uACF5\uAE09 \uCC28\uC9C8\uC774 \uC9C1\uC811\uC801\uC73C\uB85C \uB9E4\uCD9C\uC5D0 \uC601\uD5A5\uC744 \uBBF8\uCE69\uB2C8\uB2E4.",
        resourceUsage: st.compUsageShinEtsu || "\uB124\uC624\uB514\uBBB4-\uCCA0-\uBCF4\uB860(NdFeB) \uC18C\uACB0 \uC790\uC11D\uC744 \uC81C\uC870\uD558\uC5EC \uC804\uAE30\uCC28, \uD48D\uB825, \uAC00\uC804 \uC5C5\uCCB4\uC5D0 \uACF5\uAE09\uD569\uB2C8\uB2E4."
      }
    },
    lithium: {
      CATL: {
        business: st.compBizCATL || "\uC911\uAD6D\uC758 \uC138\uACC4 \uCD5C\uB300 \uC804\uAE30\uCC28 \uBC30\uD130\uB9AC \uC81C\uC870\uC0AC. \uB9AC\uD2AC\uC774\uC628 \uBC30\uD130\uB9AC \uC140, \uD329, ESS\uB97C \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyCATL || "\uBC30\uD130\uB9AC \uC591\uADF9\uC7AC\uC758 \uD575\uC2EC \uC6D0\uB8CC\uC778 \uB9AC\uD2AC \uAC00\uACA9 \uAE09\uB4F1 \uC2DC \uBC30\uD130\uB9AC \uC81C\uC870 \uC6D0\uAC00\uAC00 \uD06C\uAC8C \uC0C1\uC2B9\uD558\uBA70, \uC644\uC131\uCC28 \uC5C5\uCCB4\uC640\uC758 \uAC00\uACA9 \uD611\uC0C1\uC5D0\uC11C \uB9C8\uC9C4\uC774 \uC555\uBC15\uB429\uB2C8\uB2E4.",
        resourceUsage: st.compUsageCATL || "LFP \uBC0F NMC \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC\uC5D0 \uD0C4\uC0B0\uB9AC\uD2AC/\uC218\uC0B0\uD654\uB9AC\uD2AC\uC744 \uB300\uB7C9\uC73C\uB85C \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      BYD: {
        business: st.compBizBYD || "\uC911\uAD6D\uC758 \uC804\uAE30\uCC28\xB7\uBC30\uD130\uB9AC \uC218\uC9C1\uACC4\uC5F4\uD654 \uAE30\uC5C5. \uC804\uAE30\uCC28 \uD310\uB9E4 \uC138\uACC4 1\uC704\uC774\uBA70 \uBE14\uB808\uC774\uB4DC \uBC30\uD130\uB9AC\uB97C \uC790\uCCB4 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyBYD || "\uC790\uCCB4 \uBC30\uD130\uB9AC(\uBE14\uB808\uC774\uB4DC LFP)\uC640 \uC804\uAE30\uCC28\uB97C \uB3D9\uC2DC\uC5D0 \uC0DD\uC0B0\uD558\uB294 \uC218\uC9C1\uACC4\uC5F4\uD654 \uAD6C\uC870\uB85C, \uB9AC\uD2AC \uAC00\uACA9 \uC0C1\uC2B9\uC774 \uCC28\uB7C9 \uAC00\uACA9 \uACBD\uC7C1\uB825\uC5D0 \uC9C1\uC811 \uC601\uD5A5\uC744 \uBBF8\uCE69\uB2C8\uB2E4.",
        resourceUsage: st.compUsageBYD || "LFP(\uB9AC\uD2AC\uC778\uC0B0\uCCA0) \uBC30\uD130\uB9AC\uC5D0 \uD0C4\uC0B0\uB9AC\uD2AC\uC744 \uD575\uC2EC \uC6D0\uB8CC\uB85C \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      LG\uC5D0\uB108\uC9C0\uC194\uB8E8\uC158: {
        business: st.compBizLGES || "\uD55C\uAD6D\uC758 \uAE00\uB85C\uBC8C 2\uC704 \uC804\uAE30\uCC28 \uBC30\uD130\uB9AC \uC81C\uC870\uC0AC. Tesla, GM, \uD604\uB300\uCC28 \uB4F1\uC5D0 \uBC30\uD130\uB9AC\uB97C \uACF5\uAE09\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyLGES || "NMC \uBC0F LFP \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC\uC5D0 \uB9AC\uD2AC\uC774 \uD544\uC218\uC801\uC774\uBA70, \uB9AC\uD2AC \uC870\uB2EC \uBE44\uC6A9 \uC0C1\uC2B9\uC740 \uACE7\uBC14\uB85C \uBC30\uD130\uB9AC \uC140 \uAC00\uACA9\uC5D0 \uBC18\uC601\uB418\uC5B4 \uC218\uC8FC \uACBD\uC7C1\uB825\uC774 \uC57D\uD654\uB429\uB2C8\uB2E4.",
        resourceUsage: st.compUsageLGES || "\uBC30\uD130\uB9AC \uC591\uADF9\uC7AC(NCM, NCMA, LFP) \uC81C\uC870\uC5D0 \uC218\uC0B0\uD654\uB9AC\uD2AC \uBC0F \uD0C4\uC0B0\uB9AC\uD2AC\uC744 \uB300\uB7C9 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      Panasonic: {
        business: st.compBizPanasonic || "\uC77C\uBCF8\uC758 \uC885\uD569 \uC804\uC790\uAE30\uC5C5\uC774\uC790 Tesla\uC758 \uC8FC\uC694 \uBC30\uD130\uB9AC \uACF5\uAE09\uC0AC. \uC6D0\uD1B5\uD615 \uBC30\uD130\uB9AC(2170, 4680)\uB97C \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyPanasonic || "Tesla\u5411 \uBC30\uD130\uB9AC \uC0DD\uC0B0\uC5D0 \uACE0\uC21C\uB3C4 \uC218\uC0B0\uD654\uB9AC\uD2AC\uC774 \uD544\uC218\uC801\uC774\uBA70, \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uAE30\uAC00\uD329\uD1A0\uB9AC \uAC00\uB3D9\uC5D0 \uC9C1\uC811\uC801 \uC601\uD5A5\uC744 \uBBF8\uCE69\uB2C8\uB2E4.",
        resourceUsage: st.compUsagePanasonic || "NCA \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC\uC5D0 \uC218\uC0B0\uD654\uB9AC\uD2AC\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4. Tesla 4680 \uBC30\uD130\uB9AC \uC591\uC0B0\uC5D0 \uB300\uB7C9\uC758 \uB9AC\uD2AC\uC774 \uD544\uC694\uD569\uB2C8\uB2E4."
      },
      \uC0BC\uC131SDI: {
        business: st.compBizSamsungSDI || "\uD55C\uAD6D\uC758 \uAE00\uB85C\uBC8C \uBC30\uD130\uB9AC \uAE30\uC5C5. BMW, \uC2A4\uD154\uB780\uD2F0\uC2A4 \uB4F1\uC5D0 \uC804\uAE30\uCC28 \uBC30\uD130\uB9AC\uB97C \uACF5\uAE09\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhySamsungSDI || "NMC \uAE30\uBC18 \uAC01\uD615 \uBC30\uD130\uB9AC\uC758 \uC591\uADF9\uC7AC\uC5D0 \uB9AC\uD2AC\uC774 \uD575\uC2EC\uC801\uC73C\uB85C \uC0AC\uC6A9\uB418\uBA70, \uC870\uB2EC \uAC00\uACA9 \uBCC0\uB3D9\uC774 \uC218\uC775\uC131\uC5D0 \uC9C1\uC811 \uC601\uD5A5\uC744 \uC90D\uB2C8\uB2E4.",
        resourceUsage: st.compUsageSamsungSDI || "\uAC01\uD615 NMC \uBC30\uD130\uB9AC \uC140 \uC81C\uC870\uC5D0 \uC218\uC0B0\uD654\uB9AC\uD2AC\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      Volkswagen: {
        business: st.compBizVW || "\uB3C5\uC77C\uC758 \uC138\uACC4 \uCD5C\uB300 \uC790\uB3D9\uCC28 \uADF8\uB8F9. ID \uC2DC\uB9AC\uC988 \uC804\uAE30\uCC28\uC640 \uC790\uCCB4 \uBC30\uD130\uB9AC \uC140 \uD329\uD1A0\uB9AC(PowerCo)\uB97C \uC6B4\uC601\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyVW || "\uC720\uB7FD \uCD5C\uB300 \uC804\uAE30\uCC28 \uC804\uD658 \uD22C\uC790\uB97C \uC9C4\uD589 \uC911\uC774\uBA70, \uB9AC\uD2AC \uD655\uBCF4 \uC2E4\uD328 \uC2DC \uC804\uAE30\uCC28 \uC0DD\uC0B0 \uBAA9\uD45C \uB2EC\uC131\uC774 \uC5B4\uB824\uC6CC\uC9D1\uB2C8\uB2E4.",
        resourceUsage: st.compUsageVW || "\uC790\uCCB4 \uBC30\uD130\uB9AC \uC0DD\uC0B0(PowerCo)\uACFC \uC678\uC8FC \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC \uBAA8\uB450\uC5D0 \uB9AC\uD2AC\uC744 \uB300\uB7C9 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      }
    },
    cobalt: {
      LG\uC5D0\uB108\uC9C0\uC194\uB8E8\uC158: {
        business: st.compBizLGESCo || "\uD55C\uAD6D\uC758 \uAE00\uB85C\uBC8C \uBC30\uD130\uB9AC \uAE30\uC5C5. NMC \uBC30\uD130\uB9AC\uC758 \uD575\uC2EC \uC591\uADF9\uC7AC\uC5D0 \uCF54\uBC1C\uD2B8\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyLGESCo || "NMC 811 \uB4F1 \uD558\uC774\uB2C8\uCF08 \uBC30\uD130\uB9AC\uC5D0\uB3C4 \uCF54\uBC1C\uD2B8\uAC00 \uD544\uC218\uC801\uC73C\uB85C \uD3EC\uD568\uB418\uBA70, \uCF54\uBC1C\uD2B8 \uAC00\uACA9 \uAE09\uB4F1 \uC2DC \uBC30\uD130\uB9AC \uC6D0\uAC00\uC5D0 \uC9C1\uC811 \uBC18\uC601\uB429\uB2C8\uB2E4.",
        resourceUsage: st.compUsageLGESCo || "NMC(\uB2C8\uCF08-\uB9DD\uAC04-\uCF54\uBC1C\uD2B8) \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC\uC5D0 \uCF54\uBC1C\uD2B8\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      Panasonic: {
        business: st.compBizPanasonicCo || "\uC77C\uBCF8\uC758 \uBC30\uD130\uB9AC \uC81C\uC870\uC0AC\uC774\uC790 Tesla\uC758 \uD575\uC2EC \uACF5\uAE09\uC0AC.",
        whyDamaged: st.compWhyPanasonicCo || "NCA \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC\uC5D0 \uCF54\uBC1C\uD2B8\uAC00 \uD3EC\uD568\uB418\uC5B4 \uC788\uC5B4, \uCF54\uBC1C\uD2B8 \uC218\uAE09 \uBD88\uC548 \uC2DC \uBC30\uD130\uB9AC \uC0DD\uC0B0\uC5D0 \uCC28\uC9C8\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsagePanasonicCo || "NCA(\uB2C8\uCF08-\uCF54\uBC1C\uD2B8-\uC54C\uB8E8\uBBF8\uB284) \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC\uC5D0 \uCF54\uBC1C\uD2B8\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      Boeing: {
        business: st.compBizBoeing || "\uC138\uACC4 \uCD5C\uB300 \uD56D\uACF5\uAE30 \uC81C\uC870\uC0AC. \uC0C1\uC5C5\uC6A9 \uC5EC\uAC1D\uAE30(737, 787), \uAD70\uC6A9\uAE30, \uC6B0\uC8FC \uBC1C\uC0AC\uCCB4 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyBoeing || "\uD56D\uACF5\uAE30 \uC81C\uD2B8 \uC5D4\uC9C4\uC758 \uACE0\uC628 \uD130\uBE48 \uBE14\uB808\uC774\uB4DC\uC5D0 \uCF54\uBC1C\uD2B8 \uCD08\uD569\uAE08\uC774 \uD544\uC218\uC801\uC785\uB2C8\uB2E4. \uCF54\uBC1C\uD2B8 \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uC5D4\uC9C4 \uBD80\uD488 \uC870\uB2EC\uC5D0 \uC5B4\uB824\uC6C0\uC774 \uC0DD\uAE41\uB2C8\uB2E4.",
        resourceUsage: st.compUsageBoeing || "\uC81C\uD2B8 \uC5D4\uC9C4 \uD130\uBE48 \uBE14\uB808\uC774\uB4DC, \uC5F0\uC18C\uAE30 \uB77C\uC774\uB108 \uB4F1 \uADF9\uD55C \uACE0\uC628 \uBD80\uD488\uC5D0 \uCF54\uBC1C\uD2B8 \uAE30\uBC18 \uCD08\uD569\uAE08\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      BMW: {
        business: st.compBizBMW || "\uB3C5\uC77C\uC758 \uD504\uB9AC\uBBF8\uC5C4 \uC790\uB3D9\uCC28 \uC81C\uC870\uC0AC. i4, iX \uB4F1 \uC804\uAE30\uCC28\uC640 \uB0B4\uC5F0\uAE30\uAD00 \uCC28\uB7C9\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyBMW || "\uC804\uAE30\uCC28 \uBC30\uD130\uB9AC\uC5D0 \uCF54\uBC1C\uD2B8\uAC00 \uD3EC\uD568\uB418\uC5B4 \uC788\uC73C\uBA70, ESG \uAE30\uC900\uC5D0 \uB9DE\uB294 \uC724\uB9AC\uC801 \uCF54\uBC1C\uD2B8 \uC870\uB2EC\uC5D0\uB3C4 \uCD94\uAC00 \uBE44\uC6A9\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageBMW || "\uC804\uAE30\uCC28 \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC(NMC)\uC5D0 \uCF54\uBC1C\uD2B8\uB97C \uC0AC\uC6A9\uD558\uBA70, \uC724\uB9AC\uC801 \uACF5\uAE09\uB9DD \uAD00\uB9AC\uB97C \uC911\uC2DC\uD569\uB2C8\uB2E4."
      },
      Airbus: {
        business: st.compBizAirbus || "\uC720\uB7FD \uCD5C\uB300 \uD56D\uACF5\uAE30 \uC81C\uC870\uC0AC. A320, A350 \uB4F1 \uC5EC\uAC1D\uAE30\uC640 \uAD70\uC6A9 \uD5EC\uB9AC\uCF65\uD130\uB97C \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyAirbus || "\uD56D\uACF5\uAE30 \uC5D4\uC9C4 \uCD08\uD569\uAE08\uC5D0 \uCF54\uBC1C\uD2B8\uAC00 \uD544\uC218\uC801\uC774\uBA70, CFM LEAP \uC5D4\uC9C4 \uB4F1 \uD575\uC2EC \uBD80\uD488 \uACF5\uAE09\uC5D0 \uC601\uD5A5\uC744 \uBC1B\uC2B5\uB2C8\uB2E4.",
        resourceUsage: st.compUsageAirbus || "\uC5D4\uC9C4 \uD130\uBE48 \uBD80\uD488 \uBC0F \uB79C\uB529 \uAE30\uC5B4 \uCD08\uD569\uAE08\uC5D0 \uCF54\uBC1C\uD2B8\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      }
    },
    copper: {
      "State Grid": {
        business: st.compBizStateGrid || "\uC911\uAD6D \uAD6D\uAC00\uC804\uB825\uB9DD\uACF5\uC0AC. \uC138\uACC4 \uCD5C\uB300 \uC804\uB825 \uC720\uD2F8\uB9AC\uD2F0 \uAE30\uC5C5\uC73C\uB85C, \uC911\uAD6D \uC804\uC5ED\uC758 \uC1A1\uC804\xB7\uBC30\uC804\uB9DD\uC744 \uC6B4\uC601\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyStateGrid || "\uC1A1\uC804\uC120, \uBCC0\uC555\uAE30 \uCF54\uC77C, \uBC30\uC804 \uCF00\uC774\uBE14 \uB4F1\uC5D0 \uB9C9\uB300\uD55C \uC591\uC758 \uAD6C\uB9AC\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4. \uAD6C\uB9AC \uAC00\uACA9 \uAE09\uB4F1 \uC2DC \uC804\uB825 \uC778\uD504\uB77C \uD22C\uC790 \uBE44\uC6A9\uC774 \uD06C\uAC8C \uC99D\uAC00\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageStateGrid || "\uACE0\uC555 \uC1A1\uC804\uC120, \uBCC0\uC555\uAE30, \uBC30\uC804 \uCF00\uC774\uBE14 \uB4F1 \uC804\uB825\uB9DD \uC778\uD504\uB77C \uC804\uBC18\uC5D0 \uAD6C\uB9AC\uB97C \uB300\uB7C9 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      "General Electric": {
        business: st.compBizGE || "\uBBF8\uAD6D\uC758 \uAE00\uB85C\uBC8C \uC5D0\uB108\uC9C0\xB7\uD56D\uACF5 \uAE30\uC5C5. \uAC00\uC2A4\uD130\uBE48, \uD48D\uB825 \uD130\uBE48, \uD56D\uACF5\uAE30 \uC5D4\uC9C4 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyGE || "\uBC1C\uC804\uAE30 \uCF54\uC77C, \uD48D\uB825 \uD130\uBE48 \uBC1C\uC804\uAE30, \uBCC0\uC555\uAE30 \uB4F1\uC5D0 \uAD6C\uB9AC\uAC00 \uB300\uB7C9 \uC0AC\uC6A9\uB418\uBA70, \uAC00\uACA9 \uC0C1\uC2B9 \uC2DC \uC5D0\uB108\uC9C0 \uC7A5\uBE44 \uC81C\uC870 \uC6D0\uAC00\uAC00 \uC99D\uAC00\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageGE || "\uBC1C\uC804\uAE30 \uC2A4\uD14C\uC774\uD130 \uCF54\uC77C, \uD48D\uB825 \uBC1C\uC804\uAE30, \uBCC0\uC555\uAE30 \uAD8C\uC120\uC5D0 \uAD6C\uB9AC\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      LS\uC804\uC120: {
        business: st.compBizLS || "\uD55C\uAD6D \uCD5C\uB300 \uC804\uB825 \uCF00\uC774\uBE14 \uC81C\uC870\uC0AC. \uCD08\uACE0\uC555 \uD574\uC800 \uCF00\uC774\uBE14, \uC804\uB825 \uCF00\uC774\uBE14, \uD1B5\uC2E0 \uCF00\uC774\uBE14\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyLS || "\uAD6C\uB9AC\uAC00 \uC804\uC120 \uC81C\uC870\uC758 \uD575\uC2EC \uC6D0\uC790\uC7AC\uB85C, \uAD6C\uB9AC \uAC00\uACA9 \uC0C1\uC2B9\uC774 \uACE7\uBC14\uB85C \uC81C\uD488 \uC6D0\uAC00\uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4. \uD574\uC678 \uD574\uC800 \uCF00\uC774\uBE14 \uD504\uB85C\uC81D\uD2B8 \uC218\uC8FC\uC5D0\uB3C4 \uAC00\uACA9 \uACBD\uC7C1\uB825\uC774 \uC57D\uD654\uB429\uB2C8\uB2E4.",
        resourceUsage: st.compUsageLS || "\uC804\uB825 \uCF00\uC774\uBE14, \uD574\uC800 \uCF00\uC774\uBE14, \uD1B5\uC2E0 \uCF00\uC774\uBE14\uC758 \uB3C4\uCCB4(Conductor)\uC5D0 \uAD6C\uB9AC\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      }
    },
    nickel: {
      POSCO: {
        business: st.compBizPOSCO || "\uD55C\uAD6D \uCD5C\uB300 \uCCA0\uAC15 \uAE30\uC5C5. \uC2A4\uD14C\uC778\uB9AC\uC2A4\uAC15, \uC790\uB3D9\uCC28 \uAC15\uD310, \uBC30\uD130\uB9AC \uC18C\uC7AC(\uD3EC\uC2A4\uCF54\uD4E8\uCC98\uC5E0)\uB97C \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyPOSCO || "\uC2A4\uD14C\uC778\uB9AC\uC2A4\uAC15(STS 304, 316)\uC5D0 \uC57D 8~10%\uC758 \uB2C8\uCF08\uC774 \uD544\uC694\uD558\uBA70, \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC \uC804\uAD6C\uCCB4\uC5D0\uB3C4 \uB2C8\uCF08\uC774 \uD575\uC2EC \uC6D0\uB8CC\uC785\uB2C8\uB2E4. \uB2C8\uCF08 \uAC00\uACA9 \uAE09\uB4F1 \uC2DC \uB450 \uC0AC\uC5C5 \uBAA8\uB450 \uC6D0\uAC00 \uC555\uBC15\uC744 \uBC1B\uC2B5\uB2C8\uB2E4.",
        resourceUsage: st.compUsagePOSCO || "\uC2A4\uD14C\uC778\uB9AC\uC2A4\uAC15 \uC81C\uC870 \uBC0F \uD3EC\uC2A4\uCF54\uD4E8\uCC98\uC5E0\uC758 \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC \uC804\uAD6C\uCCB4(pCAM)\uC5D0 \uB2C8\uCF08\uC744 \uB300\uB7C9 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      Tsingshan: {
        business: st.compBizTsingshan || "\uC911\uAD6D\uC758 \uC138\uACC4 \uCD5C\uB300 \uB2C8\uCF08\xB7\uC2A4\uD14C\uC778\uB9AC\uC2A4\uAC15 \uAE30\uC5C5. \uC778\uB3C4\uB124\uC2DC\uC544\uC5D0 \uB300\uADDC\uBAA8 \uB2C8\uCF08 \uC81C\uB828\uC18C\uB97C \uC6B4\uC601\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyTsingshan || "\uB2C8\uCF08 \uC6D0\uAD11\uC744 \uB300\uB7C9 \uC218\uC785\uD558\uC5EC NPI(\uB2C8\uCF08 \uC120\uCCA0)\uC640 \uC2A4\uD14C\uC778\uB9AC\uC2A4\uAC15\uC744 \uC0DD\uC0B0\uD558\uB294 \uAD6C\uC870\uB85C, \uB2C8\uCF08 \uACF5\uAE09 \uCC28\uC9C8\uC774 \uC804\uCCB4 \uC0DD\uC0B0\uC5D0 \uC9C1\uACB0\uB429\uB2C8\uB2E4.",
        resourceUsage: st.compUsageTsingshan || "\uB2C8\uCF08 \uC6D0\uAD11\uC744 NPI\uB85C \uC81C\uB828\uD55C \uB4A4 \uC2A4\uD14C\uC778\uB9AC\uC2A4\uAC15 \uBC0F \uBC30\uD130\uB9AC\uAE09 \uB2C8\uCF08 \uC81C\uD488\uC73C\uB85C \uAC00\uACF5\uD569\uB2C8\uB2E4."
      },
      LG\uC5D0\uB108\uC9C0\uC194\uB8E8\uC158: {
        business: st.compBizLGESNi || "\uD55C\uAD6D\uC758 \uAE00\uB85C\uBC8C \uBC30\uD130\uB9AC \uAE30\uC5C5. \uD558\uC774\uB2C8\uCF08(NMC 811, NCMA) \uBC30\uD130\uB9AC\uB97C \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyLGESNi || "\uD558\uC774\uB2C8\uCF08 \uBC30\uD130\uB9AC\uC77C\uC218\uB85D \uB2C8\uCF08 \uBE44\uC911\uC774 \uB192\uC544(80% \uC774\uC0C1) \uB2C8\uCF08 \uAC00\uACA9 \uBCC0\uB3D9\uC5D0 \uB9E4\uC6B0 \uBBFC\uAC10\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageLGESNi || "NMC 811, NCMA \uBC30\uD130\uB9AC \uC591\uADF9\uC7AC\uC5D0 \uACE0\uC21C\uB3C4 \uB2C8\uCF08(Class 1)\uC744 \uB300\uB7C9 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      }
    },
    graphite: {
      LG\uC5D0\uB108\uC9C0\uC194\uB8E8\uC158: {
        business: st.compBizLGESGr || "\uD55C\uAD6D\uC758 \uAE00\uB85C\uBC8C \uBC30\uD130\uB9AC \uAE30\uC5C5. \uBC30\uD130\uB9AC \uC74C\uADF9\uC7AC\uC758 \uD575\uC2EC \uC6D0\uB8CC\uB85C \uD751\uC5F0\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyLGESGr || "\uB9AC\uD2AC\uC774\uC628 \uBC30\uD130\uB9AC \uC74C\uADF9\uC7AC\uC758 \uC57D 95%\uAC00 \uD751\uC5F0(\uCC9C\uC5F0+\uC778\uC870)\uC73C\uB85C \uC774\uB8E8\uC5B4\uC838 \uC788\uC2B5\uB2C8\uB2E4. \uC911\uAD6D\uC758 \uD751\uC5F0 \uC218\uCD9C \uD1B5\uC81C \uC2DC \uC74C\uADF9\uC7AC \uC870\uB2EC\uC5D0 \uC2EC\uAC01\uD55C \uCC28\uC9C8\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageLGESGr || "\uBC30\uD130\uB9AC \uC74C\uADF9\uC7AC(Anode)\uC5D0 \uCC9C\uC5F0\uD751\uC5F0\uACFC \uC778\uC870\uD751\uC5F0\uC744 \uD63C\uD569\uD558\uC5EC \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      \uC0BC\uC131SDI: {
        business: st.compBizSamsungSDIGr || "\uD55C\uAD6D\uC758 \uAE00\uB85C\uBC8C \uBC30\uD130\uB9AC \uAE30\uC5C5. \uC6D0\uD1B5\uD615\xB7\uAC01\uD615 \uBC30\uD130\uB9AC\uB97C \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhySamsungSDIGr || "\uBC30\uD130\uB9AC \uC74C\uADF9\uC7AC\uC5D0 \uD751\uC5F0\uC774 \uD544\uC218\uC801\uC774\uBA70, \uC74C\uADF9\uC7AC 1\uAC1C\uB2F9 \uC591\uADF9\uC7AC\uBCF4\uB2E4 \uB354 \uB9CE\uC740 \uC591\uC758 \uD751\uC5F0\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageSamsungSDIGr || "\uBC30\uD130\uB9AC \uC74C\uADF9\uC7AC\uC5D0 \uAD6C\uD615\uD654 \uCC9C\uC5F0\uD751\uC5F0\uACFC \uC778\uC870\uD751\uC5F0\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      "SGL Carbon": {
        business: st.compBizSGLCarbon || "\uB3C5\uC77C\uC758 \uD2B9\uC218 \uD751\uC5F0\xB7\uD0C4\uC18C \uC18C\uC7AC \uAE30\uC5C5. \uBC30\uD130\uB9AC \uC18C\uC7AC, \uBC18\uB3C4\uCCB4 \uBD80\uD488, \uC0B0\uC5C5\uC6A9 \uD751\uC5F0 \uC81C\uD488\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhySGLCarbon || "\uD751\uC5F0 \uC6D0\uB8CC\uC758 \uC0C1\uB2F9 \uBD80\uBD84\uC744 \uC911\uAD6D\uC5D0\uC11C \uC218\uC785\uD558\uACE0 \uC788\uC5B4, \uC218\uCD9C \uD1B5\uC81C \uC2DC \uC6D0\uB8CC \uC870\uB2EC\uC774 \uC5B4\uB824\uC6CC\uC9C0\uACE0 \uC0DD\uC0B0\uC774 \uAC10\uC18C\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageSGLCarbon || "\uBC30\uD130\uB9AC \uC74C\uADF9\uC7AC\uC6A9 \uD751\uC5F0, \uBC18\uB3C4\uCCB4 \uC6E8\uC774\uD37C \uBCF4\uD2B8, \uC81C\uCCA0\uC18C \uC804\uADF9\uBD09 \uB4F1\uC744 \uD751\uC5F0\uC73C\uB85C \uC81C\uC870\uD569\uB2C8\uB2E4."
      }
    },
    titanium: {
      Boeing: {
        business: st.compBizBoeingTi || "\uC138\uACC4 \uCD5C\uB300 \uD56D\uACF5\uAE30 \uC81C\uC870\uC0AC. 787 \uB4DC\uB9BC\uB77C\uC774\uB108\uC758 \uAE30\uCCB4 \uAD6C\uC870\uC5D0 \uC57D 15%\uAC00 \uD2F0\uD0C0\uB284\uC785\uB2C8\uB2E4.",
        whyDamaged: st.compWhyBoeingTi || "\uD56D\uACF5\uAE30 \uAE30\uCCB4 \uAD6C\uC870\uC7AC, \uB79C\uB529 \uAE30\uC5B4, \uC5D4\uC9C4 \uBD80\uD488\uC5D0 \uD2F0\uD0C0\uB284\uC774 \uD544\uC218\uC801\uC785\uB2C8\uB2E4. \uB7EC\uC2DC\uC544 VSMPO \uC758\uC874\uB3C4\uAC00 \uB192\uC558\uC73C\uBA70, \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uD56D\uACF5\uAE30 \uC778\uB3C4\uC5D0 \uC9C0\uC5F0\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageBoeingTi || "787 \uAE30\uCCB4 \uAD6C\uC870\uC758 \uC57D 15%, \uC5D4\uC9C4 \uD32C \uBE14\uB808\uC774\uB4DC, \uB79C\uB529 \uAE30\uC5B4\uC5D0 \uD2F0\uD0C0\uB284 \uD569\uAE08(Ti-6Al-4V)\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      Airbus: {
        business: st.compBizAirbusTi || "\uC720\uB7FD \uCD5C\uB300 \uD56D\uACF5\uAE30 \uC81C\uC870\uC0AC. A350 \uAE30\uCCB4\uC758 \uC57D 14%\uAC00 \uD2F0\uD0C0\uB284\uC73C\uB85C \uAD6C\uC131\uB429\uB2C8\uB2E4.",
        whyDamaged: st.compWhyAirbusTi || "A350 \uB4F1 \uCD5C\uC2E0 \uAE30\uC885\uC5D0 \uD2F0\uD0C0\uB284 \uC0AC\uC6A9\uB7C9\uC774 \uC99D\uAC00\uD558\uACE0 \uC788\uC73C\uBA70, \uD2F0\uD0C0\uB284 \uACF5\uAE09 \uBD88\uC548 \uC2DC \uD56D\uACF5\uAE30 \uC0DD\uC0B0 \uC77C\uC815\uC5D0 \uC9C1\uC811\uC801 \uC601\uD5A5\uC744 \uBC1B\uC2B5\uB2C8\uB2E4.",
        resourceUsage: st.compUsageAirbusTi || "\uAE30\uCCB4 \uAD6C\uC870 \uD504\uB808\uC784, \uD30C\uC77C\uB860, \uC5D4\uC9C4 \uB9C8\uC6B4\uD2B8 \uB4F1\uC5D0 \uD2F0\uD0C0\uB284 \uD569\uAE08\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      "Rolls-Royce": {
        business: st.compBizRollsRoyce || "\uC601\uAD6D\uC758 \uD56D\uACF5\uAE30 \uC5D4\uC9C4 \uC81C\uC870\uC0AC. \uD2B8\uB80C\uD2B8(Trent) \uC2DC\uB9AC\uC988 \uB300\uD615 \uD130\uBCF4\uD32C \uC5D4\uC9C4\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyRollsRoyce || "\uC5D4\uC9C4 \uD32C \uBE14\uB808\uC774\uB4DC, \uCEF4\uD504\uB808\uC11C \uB514\uC2A4\uD06C \uB4F1 \uACE0\uC628\xB7\uACE0\uC751\uB825 \uBD80\uD488\uC5D0 \uD2F0\uD0C0\uB284\uC774 \uD544\uC218\uC801\uC774\uBA70, \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uC5D4\uC9C4 \uC0DD\uC0B0\xB7\uC815\uBE44\uC5D0 \uCC28\uC9C8\uC774 \uC0DD\uAE41\uB2C8\uB2E4.",
        resourceUsage: st.compUsageRollsRoyce || "\uC5D4\uC9C4 \uD32C \uBE14\uB808\uC774\uB4DC, \uCEF4\uD504\uB808\uC11C \uBD80\uD488\uC5D0 \uD2F0\uD0C0\uB284 \uD569\uAE08\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      }
    },
    vanadium: {
      Nucor: {
        business: st.compBizNucor || "\uBBF8\uAD6D \uCD5C\uB300 \uCCA0\uAC15 \uAE30\uC5C5. \uC804\uAE30\uB85C(EAF) \uAE30\uBC18\uC73C\uB85C \uCCA0\uADFC, H\uBE54, \uAC15\uD310 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyNucor || "\uACE0\uAC15\uB3C4 \uCCA0\uADFC(HSLA)\uC5D0 \uBC14\uB098\uB4D0\uC744 \uC18C\uB7C9 \uCCA8\uAC00\uD558\uC5EC \uAC15\uB3C4\uB97C \uB192\uC774\uB294\uB370, \uBC14\uB098\uB4D0 \uAC00\uACA9 \uAE09\uB4F1 \uC2DC \uACE0\uAC15\uB3C4 \uCCA0\uADFC \uC0DD\uC0B0 \uC6D0\uAC00\uAC00 \uC0C1\uC2B9\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsageNucor || "\uAC74\uC124\uC6A9 \uACE0\uAC15\uB3C4 \uCCA0\uADFC\uC5D0 \uBC14\uB098\uB4D0\uC744 0.03~0.15% \uCCA8\uAC00\uD558\uC5EC \uD56D\uBCF5\uAC15\uB3C4\uB97C \uD5A5\uC0C1\uC2DC\uD0B5\uB2C8\uB2E4."
      },
      POSCO: {
        business: st.compBizPOSCOVa || "\uD55C\uAD6D \uCD5C\uB300 \uCCA0\uAC15 \uAE30\uC5C5. \uACE0\uAC15\uB3C4 \uC790\uB3D9\uCC28 \uAC15\uD310 \uBC0F \uD2B9\uC218\uAC15\uC5D0 \uBC14\uB098\uB4D0\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyPOSCOVa || "\uACE0\uAC15\uB3C4 \uC790\uB3D9\uCC28 \uAC15\uD310\uACFC \uAC74\uC124\uC6A9 \uCCA0\uADFC\uC5D0 \uBC14\uB098\uB4D0\uC774 \uD569\uAE08 \uC6D0\uC18C\uB85C \uC0AC\uC6A9\uB418\uBA70, \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uD2B9\uC218\uAC15 \uC0DD\uC0B0\uC5D0 \uC601\uD5A5\uC744 \uBBF8\uCE69\uB2C8\uB2E4.",
        resourceUsage: st.compUsagePOSCOVa || "HSLA\uAC15, \uC790\uB3D9\uCC28 \uACE0\uC7A5\uB825 \uAC15\uD310, \uAC74\uC124\uC6A9 \uACE0\uAC15\uB3C4 \uCCA0\uADFC\uC5D0 \uBC14\uB098\uB4D0\uC744 \uBBF8\uB7C9 \uCCA8\uAC00\uD569\uB2C8\uB2E4."
      }
    },
    platinum: {
      Toyota: {
        business: st.compBizToyotaPt || "\uC138\uACC4 \uCD5C\uB300 \uC790\uB3D9\uCC28 \uAE30\uC5C5\uC774\uC790 \uC218\uC18C\uCC28(\uBBF8\uB77C\uC774) \uC120\uB450\uC8FC\uC790.",
        whyDamaged: st.compWhyToyotaPt || "\uBBF8\uB77C\uC774 \uC218\uC18C\uC5F0\uB8CC\uC804\uC9C0\uC5D0 \uBC31\uAE08 \uCD09\uB9E4\uAC00 \uD544\uC218\uC801\uC774\uBA70, \uB0B4\uC5F0\uAE30\uAD00 \uCC28\uB7C9\uC758 \uBC30\uAE30\uAC00\uC2A4 \uCD09\uB9E4 \uBCC0\uD658\uC7A5\uCE58\uC5D0\uB3C4 \uBC31\uAE08\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4.",
        resourceUsage: st.compUsageToyotaPt || "\uC218\uC18C \uC5F0\uB8CC\uC804\uC9C0 MEA(\uB9C9-\uC804\uADF9 \uC811\uD569\uCCB4) \uCD09\uB9E4\uC640 \uBC30\uAE30\uAC00\uC2A4 \uC815\uD654 \uCD09\uB9E4\uC5D0 \uBC31\uAE08\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      BASF: {
        business: st.compBizBASF || "\uB3C5\uC77C\uC758 \uC138\uACC4 \uCD5C\uB300 \uD654\uD559\uAE30\uC5C5. \uC790\uB3D9\uCC28 \uCD09\uB9E4, \uBC30\uD130\uB9AC \uC18C\uC7AC, \uD654\uD559 \uC81C\uD488 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyBASF || "\uC790\uB3D9\uCC28 \uBC30\uAE30\uAC00\uC2A4 \uCD09\uB9E4 \uBCC0\uD658\uC7A5\uCE58\uC758 \uC138\uACC4 \uCD5C\uB300 \uACF5\uAE09\uC0AC \uC911 \uD558\uB098\uB85C, \uBC31\uAE08\xB7\uD314\uB77C\uB4D0\xB7\uB85C\uB4D0 \uB4F1 \uADC0\uAE08\uC18D \uAC00\uACA9\uC774 \uC9C1\uC811\uC801\uC73C\uB85C \uCD09\uB9E4 \uC81C\uC870 \uC6D0\uAC00\uC5D0 \uC601\uD5A5\uC744 \uBBF8\uCE69\uB2C8\uB2E4.",
        resourceUsage: st.compUsageBASF || "\uC0BC\uC6D0\uCD09\uB9E4(TWC) \uBC0F \uB514\uC824\uC0B0\uD654\uCD09\uB9E4(DOC)\uC5D0 \uBC31\uAE08\uC871 \uAE08\uC18D(PGM)\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      "Johnson Matthey": {
        business: st.compBizJM || "\uC601\uAD6D\uC758 \uD2B9\uC218 \uD654\uD559 \uBC0F \uADC0\uAE08\uC18D \uAC00\uACF5 \uAE30\uC5C5. \uC790\uB3D9\uCC28 \uCD09\uB9E4, \uC218\uC18C \uAE30\uC220, \uADC0\uAE08\uC18D \uC7AC\uD65C\uC6A9\uC744 \uC804\uBB38\uC73C\uB85C \uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyJM || "\uBC31\uAE08\uC871 \uAE08\uC18D\uC758 \uAC00\uACF5\xB7\uC7AC\uD65C\uC6A9\uC774 \uD575\uC2EC \uC0AC\uC5C5\uC774\uBBC0\uB85C, \uC6D0\uC790\uC7AC \uAC00\uACA9 \uBCC0\uB3D9\uC774 \uB9E4\uCD9C\uACFC \uB9C8\uC9C4\uC5D0 \uC9C1\uC811 \uC601\uD5A5\uC744 \uBBF8\uCE69\uB2C8\uB2E4.",
        resourceUsage: st.compUsageJM || "\uC790\uB3D9\uCC28 \uCD09\uB9E4 \uC81C\uC870, \uC218\uC18C \uC5F0\uB8CC\uC804\uC9C0 \uCD09\uB9E4, \uADC0\uAE08\uC18D \uC815\uC81C \uBC0F \uC7AC\uD65C\uC6A9\uC5D0 \uBC31\uAE08\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      },
      "Plug Power": {
        business: st.compBizPlugPower || "\uBBF8\uAD6D\uC758 \uC218\uC18C \uC5F0\uB8CC\uC804\uC9C0 \uC804\uBB38 \uAE30\uC5C5. \uC9C0\uAC8C\uCC28\uC6A9 \uC5F0\uB8CC\uC804\uC9C0, \uC218\uC18C \uC0DD\uC0B0 \uC804\uD574\uC870 \uB4F1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4.",
        whyDamaged: st.compWhyPlugPower || "PEM \uC5F0\uB8CC\uC804\uC9C0 \uCD09\uB9E4\uC5D0 \uBC31\uAE08\uC774 \uD544\uC218\uC801\uC774\uBA70, \uBC31\uAE08 \uAC00\uACA9 \uAE09\uB4F1 \uC2DC \uC5F0\uB8CC\uC804\uC9C0 \uC2DC\uC2A4\uD15C \uC6D0\uAC00\uAC00 \uD06C\uAC8C \uC0C1\uC2B9\uD569\uB2C8\uB2E4.",
        resourceUsage: st.compUsagePlugPower || "PEM \uC5F0\uB8CC\uC804\uC9C0 \uBC0F PEM \uC804\uD574\uC870\uC758 \uCD09\uB9E4 \uCE35\uC5D0 \uBC31\uAE08\uC744 \uC0AC\uC6A9\uD569\uB2C8\uB2E4."
      }
    }
  };
  return db[resourceId] || {};
}
function showNationSimResultFullscreenModal() {
  if (!textData || !appData || !uiLayer || !nationSimResult) return;
  const existingModal = document.getElementById("nationSimFullscreenModal");
  if (existingModal && existingModal.parentNode) {
    existingModal.parentNode.removeChild(existingModal);
    const idx = activeUIElements.indexOf(existingModal);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const st = textData;
  const resName = nationSimResult.resourceName;
  const countryName = nationSimResult.sourceCountryName;
  const modal = AppHelper.createUIElement("div", "nationSimFullscreenModal", {
    position: "absolute",
    left: "0%",
    top: "0%",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    backgroundColor: "rgba(2, 5, 15, 0.98)",
    pointerEvents: "auto",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    zIndex: "200"
  });
  uiLayer.appendChild(modal);
  activeUIElements.push(modal);
  const innerContent = AppHelper.createUIElement("div", "nationSimFsInner", {
    padding: "2% 4%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flex: "1",
    overflowY: "auto"
  });
  modal.appendChild(innerContent);
  const headerRow = AppHelper.createUIElement("div", "nationSimFsHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  innerContent.appendChild(headerRow);
  const headerTitle = AppHelper.createUIElement(
    "div",
    "nationSimFsTitle",
    {
      fontSize: "26px",
      fontWeight: "bold",
      color: "#ff6b6b",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F4CA} ${st.nationSimResultTitle || "\uD30C\uAE09 \uD6A8\uACFC \uBD84\uC11D \uACB0\uACFC"} - ${countryName} \xB7 ${resName} ${nationSimResult.reductionPercent}% \uAC10\uC0B0`
  );
  headerRow.appendChild(headerTitle);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "nationSimFsClose",
    {
      padding: "1% 2.5%",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.9)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "1px solid rgba(200, 100, 100, 0.5)"
    },
    `\u2715 ${st.simFsCloseBtn || "\uB2EB\uAE30"}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          const el = document.getElementById("nationSimFullscreenModal");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
            const idx2 = activeUIElements.indexOf(el);
            if (idx2 >= 0) activeUIElements.splice(idx2, 1);
          }
        }
      }
    ]
  );
  headerRow.appendChild(closeBtn);
  const resultsContainer = AppHelper.createUIElement("div", "nationSimFsResults", {
    boxSizing: "border-box",
    pointerEvents: "auto",
    overflowY: "auto"
  });
  innerContent.appendChild(resultsContainer);
  renderNationSimResults(resultsContainer, nationSimResult, true);
}
function showNationSimulationOverlay() {
  if (!textData || !appData || !uiLayer) return;
  const existingOverlay = document.getElementById("nationSimOverlay");
  if (existingOverlay && existingOverlay.parentNode) {
    existingOverlay.parentNode.removeChild(existingOverlay);
    const idx = activeUIElements.indexOf(existingOverlay);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const st = textData;
  const overlay = AppHelper.createUIElement("div", "nationSimOverlay", {
    position: "absolute",
    left: "3%",
    top: "3%",
    width: "94%",
    height: "94%",
    boxSizing: "border-box",
    backgroundColor: "rgba(10, 5, 25, 0.97)",
    borderRadius: "16px",
    padding: "2%",
    border: "2px solid rgba(255, 150, 100, 0.4)",
    pointerEvents: "auto",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    zIndex: "115"
  });
  uiLayer.appendChild(overlay);
  activeUIElements.push(overlay);
  const headerRow = AppHelper.createUIElement("div", "nsHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(headerRow);
  const headerTitle = AppHelper.createUIElement(
    "div",
    "nsTitle",
    {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#ff9a76",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.nationSimTitle || "\u{1F30D} \uAD6D\uAC00 \uC790\uC6D0 \uAC10\uC0B0 \uD30C\uAE09 \uC2DC\uBBAC\uB808\uC774\uC158"
  );
  headerRow.appendChild(headerTitle);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "nsClose",
    {
      padding: "1% 2%",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box"
    },
    `\u2715 ${textData.closeBtn}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showNationSimulation = false;
          nationSimResult = null;
          const el = document.getElementById("nationSimOverlay");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
            const idx2 = activeUIElements.indexOf(el);
            if (idx2 >= 0) activeUIElements.splice(idx2, 1);
          }
        }
      }
    ]
  );
  headerRow.appendChild(closeBtn);
  const desc = AppHelper.createUIElement(
    "div",
    "nsDesc",
    {
      fontSize: "14px",
      color: "#c0d8ff",
      marginBottom: "1.5%",
      lineHeight: "1.5",
      boxSizing: "border-box",
      flexShrink: "0"
    },
    st.nationSimDesc || "\uD2B9\uC815 \uAD6D\uAC00\uAC00 \uD2B9\uC815 \uC790\uC6D0\uC758 \uC0DD\uC0B0\uC744 \uAC10\uCD95\uD560 \uACBD\uC6B0 \uC804 \uC138\uACC4 \uC8FC\uC694 \uAD6D\uAC00, \uC0B0\uC5C5, \uAE30\uC5C5\uBCC4\uB85C \uBC1C\uC0DD\uD558\uB294 \uD30C\uAE09 \uD6A8\uACFC\uC640 \uC608\uC0C1 \uC190\uC2E4\uC561\uC744 \uBD84\uC11D\uD569\uB2C8\uB2E4."
  );
  overlay.appendChild(desc);
  const controlsSection = AppHelper.createUIElement("div", "nsControls", {
    display: "flex",
    flexWrap: "wrap",
    gap: "2%",
    marginBottom: "1%",
    padding: "1.5%",
    backgroundColor: "rgba(30, 20, 50, 0.7)",
    borderRadius: "12px",
    boxSizing: "border-box",
    border: "1px solid rgba(255, 150, 100, 0.2)",
    flexShrink: "0"
  });
  overlay.appendChild(controlsSection);
  const countryGroup = AppHelper.createUIElement("div", "nsCountryGroup", {
    flex: "1",
    minWidth: "200px",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  controlsSection.appendChild(countryGroup);
  const countryLabel = AppHelper.createUIElement(
    "div",
    "nsCountryLabel",
    {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#ff9a76",
      marginBottom: "1%",
      boxSizing: "border-box"
    },
    st.nationSimSelectCountry || "\u{1F3F3} \uAC10\uC0B0 \uAD6D\uAC00 \uC120\uD0DD"
  );
  countryGroup.appendChild(countryLabel);
  const countryGrid = AppHelper.createUIElement("div", "nsCountryGrid", {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    maxHeight: "75px",
    overflowY: "auto",
    boxSizing: "border-box",
    pointerEvents: "auto"
  });
  countryGroup.appendChild(countryGrid);
  for (const c of appData.countries) {
    const cName = textData.countryNames[c.id] || c.id;
    const isSelected = nationSimCountryId === c.id;
    const cBtn = AppHelper.createUIElement(
      "div",
      `nsC_${c.id}`,
      {
        padding: "3px 8px",
        fontSize: "12px",
        color: isSelected ? "#ffffff" : "rgba(255, 200, 180, 0.7)",
        backgroundColor: isSelected ? "rgba(200, 80, 60, 0.8)" : "rgba(60, 30, 40, 0.7)",
        borderRadius: "5px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: isSelected ? "1px solid rgba(255, 120, 100, 0.8)" : "1px solid rgba(150, 60, 60, 0.3)",
        whiteSpace: "nowrap"
      },
      cName,
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            nationSimCountryId = c.id;
            nationSimResourceId = null;
            nationSimResult = null;
            showNationSimulationOverlay();
          }
        }
      ]
    );
    countryGrid.appendChild(cBtn);
  }
  if (nationSimCountryId) {
    const country = appData.countries.find((c) => c.id === nationSimCountryId);
    if (country) {
      const resGroup = AppHelper.createUIElement("div", "nsResGroup", {
        flex: "1",
        minWidth: "200px",
        boxSizing: "border-box"
      });
      controlsSection.appendChild(resGroup);
      const resLabel = AppHelper.createUIElement(
        "div",
        "nsResLabel",
        {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#ffe66d",
          marginBottom: "1%"
        },
        st.nationSimSelectResource || "\u{1F48E} \uAC10\uC0B0 \uC790\uC6D0 \uC120\uD0DD"
      );
      resGroup.appendChild(resLabel);
      const resGrid = AppHelper.createUIElement("div", "nsResGrid", {
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        maxHeight: "75px",
        overflowY: "auto",
        pointerEvents: "auto",
        boxSizing: "border-box"
      });
      resGroup.appendChild(resGrid);
      for (const cr of country.resources) {
        if (cr.production === 0) continue;
        const res = appData.resources.find((r) => r.id === cr.resourceId);
        if (!res) continue;
        const rName = textData.resourceNames[cr.resourceId] || cr.resourceId;
        const isSelected = nationSimResourceId === cr.resourceId;
        const rBtn = AppHelper.createUIElement(
          "div",
          `nsR_${cr.resourceId}`,
          {
            padding: "3px 8px",
            fontSize: "12px",
            color: isSelected ? "#ffffff" : res.color,
            backgroundColor: isSelected ? res.color + "cc" : "rgba(40, 30, 50, 0.7)",
            borderRadius: "5px",
            cursor: "pointer",
            pointerEvents: "auto",
            boxSizing: "border-box",
            border: `1px solid ${res.color}60`,
            whiteSpace: "nowrap"
          },
          `\u25CF ${rName}`,
          [
            {
              event: "pointerup",
              handler: () => {
                playClickSound();
                nationSimResourceId = cr.resourceId;
                nationSimResult = null;
                showNationSimulationOverlay();
              }
            }
          ]
        );
        resGrid.appendChild(rBtn);
      }
    }
  }
  if (nationSimCountryId && nationSimResourceId) {
    const sliderSection = AppHelper.createUIElement("div", "nsSliderSection", {
      width: "100%",
      marginTop: "1%",
      boxSizing: "border-box"
    });
    controlsSection.appendChild(sliderSection);
    const sliderLabel = AppHelper.createUIElement(
      "div",
      "nsSliderLabel",
      {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#ff6b6b",
        marginBottom: "1%",
        boxSizing: "border-box"
      },
      st.nationSimReduction || "\u2699 \uC0DD\uC0B0 \uAC10\uCD95 \uBE44\uC728 (%)"
    );
    sliderSection.appendChild(sliderLabel);
    const sliderRow = AppHelper.createUIElement("div", "nsSliderRow", {
      display: "flex",
      alignItems: "center",
      gap: "2%",
      pointerEvents: "auto",
      boxSizing: "border-box"
    });
    sliderSection.appendChild(sliderRow);
    const minLabel = AppHelper.createUIElement(
      "span",
      "nsMinLabel",
      {
        fontSize: "12px",
        color: "#ff6b6b",
        boxSizing: "border-box",
        pointerEvents: "none",
        whiteSpace: "nowrap"
      },
      "1%"
    );
    sliderRow.appendChild(minLabel);
    const slider = AppHelper.createUIElement("input", "nsSlider", {
      flex: "1",
      height: "8px",
      cursor: "pointer",
      accentColor: "#ff6b6b",
      boxSizing: "border-box"
    });
    slider.type = "range";
    slider.min = "1";
    slider.max = "100";
    slider.value = String(nationSimReductionPercent);
    slider.addEventListener("input", (e) => {
      nationSimReductionPercent = parseInt(e.target.value, 10);
      const disp = document.getElementById("nsChangeDisplay");
      if (disp) disp.innerText = `${nationSimReductionPercent}% \uAC10\uC0B0`;
      const quickValues2 = [10, 20, 30, 50, 70, 100];
      for (const qv of quickValues2) {
        const qBtn = document.getElementById(`nsQ_${qv}`);
        if (qBtn) {
          const isActive = nationSimReductionPercent === qv;
          qBtn.style.color = isActive ? "#ffffff" : "#ff6b6b";
          qBtn.style.backgroundColor = isActive ? "#ff6b6bcc" : "rgba(60, 30, 40, 0.7)";
        }
      }
    });
    sliderRow.appendChild(slider);
    const maxLabel = AppHelper.createUIElement(
      "span",
      "nsMaxLabel",
      {
        fontSize: "12px",
        color: "#ff6b6b",
        boxSizing: "border-box",
        pointerEvents: "none",
        whiteSpace: "nowrap"
      },
      "100%"
    );
    sliderRow.appendChild(maxLabel);
    const quickBtnRow = AppHelper.createUIElement("div", "nsQuickBtns", {
      display: "flex",
      gap: "4px",
      marginTop: "1%",
      flexWrap: "wrap",
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    sliderSection.appendChild(quickBtnRow);
    const quickValues = [10, 20, 30, 50, 70, 100];
    for (const qv of quickValues) {
      const isActive = nationSimReductionPercent === qv;
      const qColor = "#ff6b6b";
      const qBtn = AppHelper.createUIElement(
        "div",
        `nsQ_${qv}`,
        {
          padding: "3px 10px",
          fontSize: "12px",
          fontWeight: "bold",
          color: isActive ? "#ffffff" : qColor,
          backgroundColor: isActive ? qColor + "cc" : "rgba(60, 30, 40, 0.7)",
          borderRadius: "5px",
          cursor: "pointer",
          pointerEvents: "auto",
          boxSizing: "border-box",
          border: `1px solid ${qColor}60`
        },
        `${qv}%`,
        [
          {
            event: "pointerup",
            handler: () => {
              playClickSound();
              nationSimReductionPercent = qv;
              showNationSimulationOverlay();
            }
          }
        ]
      );
      quickBtnRow.appendChild(qBtn);
    }
    const bottomRow = AppHelper.createUIElement("div", "nsBottomRow", {
      display: "flex",
      alignItems: "center",
      gap: "2%",
      marginTop: "1.5%",
      pointerEvents: "auto",
      boxSizing: "border-box"
    });
    sliderSection.appendChild(bottomRow);
    const changeDisplay = AppHelper.createUIElement(
      "div",
      "nsChangeDisplay",
      {
        flex: "1",
        fontSize: "20px",
        fontWeight: "bold",
        color: "#ff6b6b",
        textAlign: "center",
        boxSizing: "border-box"
      },
      `${nationSimReductionPercent}% \uAC10\uC0B0`
    );
    bottomRow.appendChild(changeDisplay);
    const runBtn = AppHelper.createUIElement(
      "div",
      "nsRunBtn",
      {
        flex: "2",
        padding: "1.5% 3%",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "rgba(200, 60, 60, 0.8)",
        borderRadius: "8px",
        cursor: "pointer",
        pointerEvents: "auto",
        textAlign: "center",
        border: "1px solid rgba(255, 100, 100, 0.6)",
        boxSizing: "border-box"
      },
      st.nationSimRunBtn || "\u{1F680} \uD30C\uAE09 \uD6A8\uACFC \uBD84\uC11D",
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            runNationSimulation();
            if (nationSimResult) {
              showNationSimulationOverlay();
              showNationSimResultFullscreenModal();
            } else {
              showNationSimulationOverlay();
            }
          }
        }
      ]
    );
    bottomRow.appendChild(runBtn);
  }
  if (nationSimResult) {
    const resultsWrapper = AppHelper.createUIElement("div", "nsResultsWrapper", {
      flex: "1",
      minHeight: "0",
      overflowY: "auto",
      pointerEvents: "auto",
      borderTop: "1px solid rgba(255, 150, 100, 0.2)",
      marginTop: "1%",
      paddingTop: "1.5%",
      boxSizing: "border-box"
    });
    overlay.appendChild(resultsWrapper);
    renderNationSimResults(resultsWrapper, nationSimResult);
  }
}
function renderNationSimResults(container, result, isFullscreen = false) {
  const st = textData;
  if (!appData) return;
  const res = appData.resources.find((r) => r.id === result.resourceId);
  const idPrefix = isFullscreen ? "fs_" : "ov_";
  const summary = AppHelper.createUIElement("div", `${idPrefix}nsSummary`, {
    padding: "3%",
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderRadius: "10px",
    marginBottom: "3%",
    border: "1px solid rgba(255, 107, 107, 0.5)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  });
  const textCol = AppHelper.createUIElement("div", `${idPrefix}nsSumText`);
  summary.appendChild(textCol);
  const title = AppHelper.createUIElement(
    "div",
    `${idPrefix}nsSumTitle`,
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#ff6b6b",
      marginBottom: "2%"
    },
    `${st.nationSimTotalLoss || "\uAE00\uB85C\uBC8C \uACBD\uC81C \uC608\uC0C1 \uC190\uC2E4\uC561"}: ${result.totalGlobalLoss.toLocaleString()} ${st.unitBillion || "\uC5B5 \uB2EC\uB7EC"}`
  );
  textCol.appendChild(title);
  const desc = AppHelper.createUIElement(
    "div",
    `${idPrefix}nsSumDesc`,
    {
      fontSize: "14px",
      color: "#ffecd2"
    },
    `${result.sourceCountryName}\uC758 ${result.resourceName} ${result.reductionPercent}% \uAC10\uC0B0 \uC2DC \uD30C\uAE09 \uD6A8\uACFC`
  );
  textCol.appendChild(desc);
  if (!isFullscreen) {
    const fullscreenBtn = AppHelper.createUIElement(
      "div",
      `${idPrefix}nsFullscreenBtn`,
      {
        padding: "2% 4%",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "rgba(255, 100, 100, 0.7)",
        borderRadius: "6px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: "1px solid rgba(255, 150, 150, 0.5)",
        whiteSpace: "nowrap"
      },
      st.simFullscreenBtn || "\u{1F50D} \uACB0\uACFC \uD06C\uAC8C \uBCF4\uAE30",
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            showNationSimResultFullscreenModal();
          }
        }
      ]
    );
    summary.appendChild(fullscreenBtn);
  }
  container.appendChild(summary);
  const explanationBanner = AppHelper.createUIElement("div", `${idPrefix}nsExplanationBanner`, {
    padding: "2% 3%",
    marginBottom: "2%",
    backgroundColor: "rgba(60, 140, 255, 0.15)",
    borderRadius: "10px",
    border: "1px solid rgba(60, 140, 255, 0.3)",
    boxSizing: "border-box"
  });
  const explanationIcon = AppHelper.createUIElement(
    "div",
    `${idPrefix}nsExplIcon`,
    {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "1%"
    },
    `\u{1F4A1} ${st.nationSimExplTitle || "\uBD84\uC11D \uACB0\uACFC \uC77D\uB294 \uBC95"}`
  );
  explanationBanner.appendChild(explanationIcon);
  const explanationText = AppHelper.createUIElement(
    "div",
    `${idPrefix}nsExplText`,
    {
      fontSize: "13px",
      color: "#c0d8ff",
      lineHeight: "1.7"
    },
    (st.nationSimExplDesc || "\uC544\uB798 \uACB0\uACFC\uB294 {country}\uC774(\uAC00) {resource} \uC0DD\uC0B0\uC744 {percent}% \uC904\uC600\uC744 \uB54C, \uD574\uB2F9 \uC790\uC6D0\uC744 \uC218\uC785\uD558\uC5EC \uC0AC\uC6A9\uD558\uB294 \uAD6D\uAC00\xB7\uC0B0\uC5C5\xB7\uAE30\uC5C5\uC5D0 \uBC1C\uC0DD\uD558\uB294 '\uACF5\uAE09 \uCC28\uC9C8\uB85C \uC778\uD55C \uD53C\uD574'\uB97C \uCD94\uC815\uD55C \uAC83\uC785\uB2C8\uB2E4. \uAC01 \uAE30\uC5C5\uC758 \uC190\uD574\uC561\uC740 \uD574\uB2F9 \uAE30\uC5C5\uC774 {resource}\uC744(\uB97C) \uC6D0\uC790\uC7AC\uB85C \uC0AC\uC6A9\uD558\uAE30 \uB54C\uBB38\uC5D0 \uBC1C\uC0DD\uD558\uB294 \uC870\uB2EC \uBE44\uC6A9 \uC0C1\uC2B9 \uBC0F \uC0DD\uC0B0 \uCC28\uC9C8\uC5D0 \uB530\uB978 \uC608\uC0C1 \uD53C\uD574 \uAE08\uC561\uC785\uB2C8\uB2E4.").replace(/\{country\}/g, result.sourceCountryName).replace(/\{resource\}/g, result.resourceName).replace(/\{percent\}/g, String(result.reductionPercent))
  );
  explanationBanner.appendChild(explanationText);
  container.appendChild(explanationBanner);
  const listContainer = AppHelper.createUIElement("div", `${idPrefix}nsList`);
  container.appendChild(listContainer);
  const companyDetailDb = buildCompanyDetailDb(result.resourceId, result.resourceName);
  result.impactedCountries.forEach((cData, cIdx) => {
    const cItem = AppHelper.createUIElement("div", `${idPrefix}nsC_${cIdx}`, {
      marginBottom: "2%",
      backgroundColor: "rgba(20, 30, 60, 0.8)",
      borderRadius: "8px",
      border: "1px solid rgba(100, 150, 255, 0.3)",
      overflow: "hidden"
    });
    listContainer.appendChild(cItem);
    const cHeader = AppHelper.createUIElement("div", `${idPrefix}nsCH_${cIdx}`, {
      padding: "2% 3%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: cData.isExpanded ? "rgba(60, 140, 255, 0.2)" : "transparent",
      pointerEvents: "auto"
    });
    cItem.appendChild(cHeader);
    const cLeftCol = AppHelper.createUIElement("div", `${idPrefix}nsCLeft_${cIdx}`, {
      display: "flex",
      flexDirection: "column",
      pointerEvents: "none"
    });
    const cName = AppHelper.createUIElement(
      "span",
      "",
      {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#60a5fa",
        pointerEvents: "none"
      },
      `\u{1F3F3}\uFE0F ${cData.countryName}`
    );
    cLeftCol.appendChild(cName);
    const cContext = AppHelper.createUIElement(
      "span",
      "",
      {
        fontSize: "11px",
        color: "rgba(180, 210, 255, 0.6)",
        marginTop: "2px",
        pointerEvents: "none"
      },
      (st.nationSimCountryContext || "{resource} \uC218\uC785 \uC758\uC874\uAD6D \u2014 \uACF5\uAE09 \uCC28\uC9C8 \uC2DC \uC608\uC0C1 \uD53C\uD574").replace(
        /\{resource\}/g,
        result.resourceName
      )
    );
    cLeftCol.appendChild(cContext);
    const cLoss = AppHelper.createUIElement(
      "span",
      "",
      {
        fontSize: "14px",
        color: "#ff9a76",
        fontWeight: "bold",
        pointerEvents: "none"
      },
      `${st.nationSimCountryLoss || "\uC608\uC0C1 \uACBD\uC81C \uD53C\uD574:"} ${cData.countryLoss.toLocaleString()} ${st.unitBillion || "\uC5B5 \uB2EC\uB7EC"}`
    );
    cHeader.appendChild(cLeftCol);
    cHeader.appendChild(cLoss);
    const sContainer = AppHelper.createUIElement("div", `${idPrefix}nsSC_${cIdx}`, {
      display: cData.isExpanded ? "block" : "none",
      padding: "0 3% 2% 3%",
      boxSizing: "border-box"
    });
    cItem.appendChild(sContainer);
    cHeader.addEventListener("pointerup", () => {
      playClickSound();
      cData.isExpanded = !cData.isExpanded;
      cHeader.style.backgroundColor = cData.isExpanded ? "rgba(60, 140, 255, 0.2)" : "transparent";
      sContainer.style.display = cData.isExpanded ? "block" : "none";
    });
    cData.sectors.forEach((sData, sIdx) => {
      const sItem = AppHelper.createUIElement("div", `${idPrefix}nsS_${cIdx}_${sIdx}`, {
        marginTop: "2%",
        backgroundColor: "rgba(30, 50, 80, 0.5)",
        borderRadius: "6px",
        borderLeft: "3px solid #ffe66d",
        overflow: "hidden"
      });
      sContainer.appendChild(sItem);
      const sHeader = AppHelper.createUIElement("div", `${idPrefix}nsSH_${cIdx}_${sIdx}`, {
        padding: "1.5% 3%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: sData.isExpanded ? "rgba(255, 230, 109, 0.15)" : "transparent",
        pointerEvents: "auto"
      });
      sItem.appendChild(sHeader);
      const sLeftCol = AppHelper.createUIElement("div", `${idPrefix}nsSLeft_${cIdx}_${sIdx}`, {
        display: "flex",
        flexDirection: "column",
        pointerEvents: "none"
      });
      const sName = AppHelper.createUIElement(
        "span",
        "",
        {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#ffe66d",
          pointerEvents: "none"
        },
        `\u{1F3ED} ${sData.sectorName}`
      );
      sLeftCol.appendChild(sName);
      const sContext = AppHelper.createUIElement(
        "span",
        "",
        {
          fontSize: "11px",
          color: "rgba(255, 230, 150, 0.5)",
          marginTop: "2px",
          pointerEvents: "none"
        },
        (st.nationSimSectorContext || "{resource}\uC744(\uB97C) \uD575\uC2EC \uC6D0\uC790\uC7AC\uB85C \uC0AC\uC6A9\uD558\uB294 \uC0B0\uC5C5 \uBD84\uC57C").replace(
          /\{resource\}/g,
          result.resourceName
        )
      );
      sLeftCol.appendChild(sContext);
      const sLoss = AppHelper.createUIElement(
        "span",
        "",
        {
          fontSize: "13px",
          color: "#ff6b6b",
          pointerEvents: "none"
        },
        `${st.nationSimSectorLoss || "\uC0B0\uC5C5 \uD53C\uD574 \uCD94\uC815:"} ${sData.sectorLoss.toLocaleString()} ${st.unitMillion || "\uBC31\uB9CC \uB2EC\uB7EC"}`
      );
      sHeader.appendChild(sLeftCol);
      sHeader.appendChild(sLoss);
      const compContainer = AppHelper.createUIElement("div", `${idPrefix}nsCompC_${cIdx}_${sIdx}`, {
        display: sData.isExpanded ? "block" : "none",
        padding: "2% 3%",
        backgroundColor: "rgba(10, 20, 35, 0.6)"
      });
      sItem.appendChild(compContainer);
      sHeader.addEventListener("pointerup", () => {
        playClickSound();
        sData.isExpanded = !sData.isExpanded;
        sHeader.style.backgroundColor = sData.isExpanded ? "rgba(255, 230, 109, 0.15)" : "transparent";
        compContainer.style.display = sData.isExpanded ? "block" : "none";
      });
      sData.companies.forEach((comp, compIdx) => {
        const compDetail = companyDetailDb[comp.companyName];
        const isClickable = !!compDetail;
        const compItem = AppHelper.createUIElement("div", `${idPrefix}nsComp_${cIdx}_${sIdx}_${compIdx}`, {
          padding: "1.5%",
          marginBottom: "1%",
          backgroundColor: "rgba(25, 40, 70, 0.6)",
          borderRadius: "4px",
          borderLeft: "2px solid #4ecdc4",
          cursor: isClickable ? "pointer" : "default",
          pointerEvents: "auto",
          transition: "background-color 0.2s ease"
        });
        compContainer.appendChild(compItem);
        const compMainRow = AppHelper.createUIElement("div", `${idPrefix}nsCompMain_${cIdx}_${sIdx}_${compIdx}`, {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none"
        });
        compItem.appendChild(compMainRow);
        const compLeftCol = AppHelper.createUIElement("div", "", {
          display: "flex",
          flexDirection: "column",
          pointerEvents: "none"
        });
        const compNameRow = AppHelper.createUIElement("div", "", {
          display: "flex",
          alignItems: "center",
          gap: "6px",
          pointerEvents: "none"
        });
        const compName = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#ffffff",
            pointerEvents: "none"
          },
          `\u{1F3E2} ${comp.companyName}`
        );
        compNameRow.appendChild(compName);
        if (isClickable) {
          const clickHint = AppHelper.createUIElement(
            "span",
            "",
            {
              fontSize: "10px",
              color: "#4ecdc4",
              backgroundColor: "rgba(78, 205, 196, 0.15)",
              padding: "1px 6px",
              borderRadius: "3px",
              pointerEvents: "none"
            },
            st.compClickHint || "\uD074\uB9AD\uD558\uC5EC \uC0C1\uC138\uBCF4\uAE30"
          );
          compNameRow.appendChild(clickHint);
        }
        compLeftCol.appendChild(compNameRow);
        const compContext = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "11px",
            color: "rgba(160, 192, 255, 0.5)",
            marginTop: "2px",
            pointerEvents: "none"
          },
          (st.nationSimCompContext || "{resource} \uC870\uB2EC \uCC28\uC9C8\uC5D0 \uB530\uB978 \uC0DD\uC0B0 \uBE44\uC6A9 \uC0C1\uC2B9 \uD53C\uD574").replace(
            /\{resource\}/g,
            result.resourceName
          )
        );
        compLeftCol.appendChild(compContext);
        const compInfo = AppHelper.createUIElement("div", "", {
          fontSize: "12px",
          color: "#a0c0ff",
          textAlign: "right",
          pointerEvents: "none"
        });
        const usage = AppHelper.createUIElement(
          "div",
          "",
          {
            marginBottom: "4px"
          },
          `${st.nationSimCompUsage || "\uC790\uC6D0 \uC0AC\uC6A9\uB7C9:"} ${comp.usageAmount.toLocaleString()} ${st.unitTon || "\uD1A4"}`
        );
        const damage = AppHelper.createUIElement(
          "div",
          "",
          {
            color: "#ff6b6b",
            fontWeight: "bold"
          },
          `${st.nationSimCompDamage || "\uC608\uC0C1 \uD53C\uD574\uC561:"} ${comp.damageAmount.toLocaleString()} ${st.unitMillion || "\uBC31\uB9CC \uB2EC\uB7EC"}`
        );
        compInfo.appendChild(usage);
        compInfo.appendChild(damage);
        compMainRow.appendChild(compLeftCol);
        compMainRow.appendChild(compInfo);
        const detailPanelId = `${idPrefix}nsCompDetail_${cIdx}_${sIdx}_${compIdx}`;
        const detailPanel = AppHelper.createUIElement("div", detailPanelId, {
          display: "none",
          marginTop: "2%",
          padding: "2.5%",
          backgroundColor: "rgba(15, 30, 55, 0.9)",
          borderRadius: "8px",
          border: "1px solid rgba(78, 205, 196, 0.3)",
          boxSizing: "border-box",
          pointerEvents: "none"
        });
        compItem.appendChild(detailPanel);
        if (isClickable && compDetail) {
          const detailTitle = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "14px",
              fontWeight: "bold",
              color: "#4ecdc4",
              marginBottom: "2%"
            },
            `\u{1F4CB} ${comp.companyName} ${st.compDetailTitle || "\uC0C1\uC138 \uBD84\uC11D"}`
          );
          detailPanel.appendChild(detailTitle);
          const bizSection = AppHelper.createUIElement("div", "", {
            marginBottom: "2%",
            padding: "2%",
            backgroundColor: "rgba(30, 60, 100, 0.4)",
            borderRadius: "6px",
            borderLeft: "3px solid #60a5fa"
          });
          const bizTitle = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "12px",
              fontWeight: "bold",
              color: "#60a5fa",
              marginBottom: "1%"
            },
            `\u{1F3E2} ${st.compBizTitle || "\uC8FC\uC694 \uC0AC\uC5C5 \uBD84\uC57C"}`
          );
          bizSection.appendChild(bizTitle);
          const bizDesc = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "13px",
              color: "#e0e8ff",
              lineHeight: "1.7"
            },
            compDetail.business
          );
          bizSection.appendChild(bizDesc);
          detailPanel.appendChild(bizSection);
          const whySection = AppHelper.createUIElement("div", "", {
            marginBottom: "2%",
            padding: "2%",
            backgroundColor: "rgba(80, 30, 30, 0.3)",
            borderRadius: "6px",
            borderLeft: "3px solid #ff6b6b"
          });
          const whyTitle = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "12px",
              fontWeight: "bold",
              color: "#ff6b6b",
              marginBottom: "1%"
            },
            `\u26A0\uFE0F ${st.compWhyDamageTitle || "\uD53C\uD574 \uBC1C\uC0DD \uC6D0\uC778"}`
          );
          whySection.appendChild(whyTitle);
          const whyDesc = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "13px",
              color: "#ffd4d4",
              lineHeight: "1.7"
            },
            compDetail.whyDamaged.replace(/\{resource\}/g, result.resourceName).replace(/\{country\}/g, result.sourceCountryName).replace(/\{percent\}/g, String(result.reductionPercent))
          );
          whySection.appendChild(whyDesc);
          detailPanel.appendChild(whySection);
          if (compDetail.resourceUsage) {
            const usageSection = AppHelper.createUIElement("div", "", {
              padding: "2%",
              backgroundColor: "rgba(30, 50, 80, 0.4)",
              borderRadius: "6px",
              borderLeft: "3px solid #ffe66d"
            });
            const usageTitle = AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: "12px",
                fontWeight: "bold",
                color: "#ffe66d",
                marginBottom: "1%"
              },
              `\u{1F517} ${st.compResourceUsageTitle || "\uC790\uC6D0 \uD65C\uC6A9 \uBC29\uC2DD"}`
            );
            usageSection.appendChild(usageTitle);
            const usageDesc = AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: "13px",
                color: "#e0e8ff",
                lineHeight: "1.7"
              },
              compDetail.resourceUsage.replace(/\{resource\}/g, result.resourceName)
            );
            usageSection.appendChild(usageDesc);
            detailPanel.appendChild(usageSection);
          }
          compItem.addEventListener("pointerup", (e) => {
            e.stopPropagation();
            playClickSound();
            const isVisible = detailPanel.style.display !== "none";
            detailPanel.style.display = isVisible ? "none" : "block";
            compItem.style.backgroundColor = isVisible ? "rgba(25, 40, 70, 0.6)" : "rgba(35, 55, 90, 0.8)";
            compItem.style.borderLeft = isVisible ? "2px solid #4ecdc4" : "2px solid #ffe66d";
          });
          compItem.addEventListener("pointerenter", () => {
            compItem.style.backgroundColor = "rgba(35, 55, 90, 0.7)";
          });
          compItem.addEventListener("pointerleave", () => {
            const isOpen = detailPanel.style.display !== "none";
            compItem.style.backgroundColor = isOpen ? "rgba(35, 55, 90, 0.8)" : "rgba(25, 40, 70, 0.6)";
          });
        }
      });
    });
  });
  const disclaimer = AppHelper.createUIElement(
    "div",
    `${idPrefix}nsDisclaimer`,
    {
      fontSize: "11px",
      color: "rgba(180, 210, 255, 0.4)",
      marginTop: "2%",
      padding: "1.5%",
      backgroundColor: "rgba(15, 25, 50, 0.5)",
      borderRadius: "6px",
      textAlign: "center",
      lineHeight: "1.5",
      boxSizing: "border-box",
      border: "1px solid rgba(80, 120, 180, 0.15)"
    },
    st.nationSimDisclaimer || "\u26A0 \uBCF8 \uBD84\uC11D\uC740 \uC2DC\uBBAC\uB808\uC774\uC158 \uAE30\uBC18\uC758 \uAC00\uC0C1 \uC2DC\uB098\uB9AC\uC624 \uC608\uCE21\uC774\uBA70, \uC2E4\uC81C \uACBD\uC81C \uD53C\uD574\uC640 \uB2E4\uB97C \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uCC38\uACE0\uC6A9\uC73C\uB85C\uB9CC \uD65C\uC6A9\uD574 \uC8FC\uC138\uC694."
  );
  container.appendChild(disclaimer);
}
function runNationSimulation() {
  if (!appData || !textData || !nationSimCountryId || !nationSimResourceId) {
    nationSimResult = null;
    return;
  }
  const country = appData.countries.find((c) => c.id === nationSimCountryId);
  const res = appData.resources.find((r) => r.id === nationSimResourceId);
  if (!country || !res) return;
  const countryName = textData.countryNames[country.id] || country.id;
  const resName = textData.resourceNames[res.id] || res.id;
  const reduction = nationSimReductionPercent;
  const st = textData;
  const countryRes = country.resources.find((cr) => cr.resourceId === res.id);
  if (!countryRes) return;
  let totalGlobalProd = 0;
  for (const c of appData.countries) {
    for (const cr of c.resources) {
      if (cr.resourceId === res.id) {
        totalGlobalProd += cr.production;
      }
    }
  }
  const prodShare = totalGlobalProd > 0 ? countryRes.production / totalGlobalProd : 0;
  const reducedAmount = countryRes.production * (reduction / 100);
  const supplyShortfallRatio = totalGlobalProd > 0 ? reducedAmount / totalGlobalProd : 0;
  const priceHist = appData.priceHistory.find((p) => p.resourceId === res.id);
  const latestPrice = priceHist && priceHist.data.length > 0 ? priceHist.data[priceHist.data.length - 1].price : 100;
  const economicImpactBase = supplyShortfallRatio * res.strategicImportance * latestPrice * 0.1;
  const vCountries = res.vulnerableCountries || ["\uBBF8\uAD6D", "\uC77C\uBCF8", "\uB3C5\uC77C", "\uD55C\uAD6D"];
  const vCompanies = res.vulnerableCompanies || ["Tesla", "Apple", "Samsung", "Toyota"];
  const applications = res.applications || ["\uC804\uAE30\uCC28", "\uBC18\uB3C4\uCCB4", "\uBC29\uC704\uC0B0\uC5C5", "\uC7AC\uC0DD\uC5D0\uB108\uC9C0"];
  const sectorCompanyDb = {};
  const companyCountryMap = {};
  for (const vc of vCountries) {
    companyCountryMap[vc] = [];
  }
  for (const comp of vCompanies) {
    const match = comp.match(/\(([^)]+)\)/);
    if (match) {
      const cName = match[1];
      if (companyCountryMap[cName]) {
        companyCountryMap[cName].push(comp.replace(/\s*\(.*?\)\s*/g, "").trim());
      }
    }
  }
  const extendedCompanyDb = {
    tungsten: {
      \uBBF8\uAD6D: [
        "Kennametal",
        "Lockheed Martin",
        "Raytheon",
        "General Dynamics",
        "Intel",
        "Applied Materials",
        "Northrop Grumman",
        "L3Harris"
      ],
      \uB3C5\uC77C: ["H.C. Starck", "Bosch", "Siemens", "ThyssenKrupp", "Trumpf", "Schunk Group", "Walter AG"],
      \uC77C\uBCF8: ["Sumitomo Electric", "Mitsubishi Materials", "Toshiba", "Allied Material", "Hitachi Metals", "Tungaloy"],
      \uD55C\uAD6D: ["\uC0BC\uC131\uC804\uC790", "SK\uD558\uC774\uB2C9\uC2A4", "\uD55C\uAD6D\uC57C\uAE08", "\uB300\uAD6C\uD14D", "\uD604\uB300\uC704\uC544", "\uB450\uC0B0"],
      \uC2A4\uC6E8\uB374: ["Sandvik", "Atlas Copco", "Seco Tools", "Epiroc", "SKF"]
    },
    rare_earth: {
      \uBBF8\uAD6D: ["Tesla", "Apple", "General Motors", "Ford", "Raytheon", "Lockheed Martin", "GE Vernova", "Rivian"],
      \uC77C\uBCF8: ["Toyota", "Honda", "Shin-Etsu Chemical", "TDK", "Nidec", "Panasonic", "Hitachi", "Mitsubishi Electric"],
      \uB3C5\uC77C: ["Siemens", "Volkswagen", "BMW", "Bosch", "BASF", "Enercon", "Continental"],
      \uD55C\uAD6D: ["\uD604\uB300\uC790\uB3D9\uCC28", "\uC0BC\uC131\uC804\uC790", "LG\uC804\uC790", "\uAE30\uC544", "SK\uD558\uC774\uB2C9\uC2A4", "\uD55C\uD654\uC194\uB8E8\uC158"],
      \uD504\uB791\uC2A4: ["Renault", "Schneider Electric", "Safran", "Valeo", "Stellantis", "TotalEnergies"]
    },
    lithium: {
      \uC911\uAD6D: ["CATL", "BYD", "CALB", "EVE Energy", "Gotion High-Tech", "Ganfeng Lithium"],
      \uD55C\uAD6D: ["LG\uC5D0\uB108\uC9C0\uC194\uB8E8\uC158", "\uC0BC\uC131SDI", "SK\uC628", "\uD3EC\uC2A4\uCF54\uD4E8\uCC98\uC5E0", "\uC5D0\uCF54\uD504\uB85CBM"],
      \uC77C\uBCF8: ["Panasonic", "Toyota", "Honda", "Murata Manufacturing", "GS Yuasa"],
      \uBBF8\uAD6D: ["Tesla", "General Motors", "Ford", "Rivian", "QuantumScape", "Lucid Motors"],
      \uB3C5\uC77C: ["Volkswagen", "BMW", "Mercedes-Benz", "BASF", "Varta", "Northvolt DE"]
    },
    cobalt: {
      \uD55C\uAD6D: ["LG\uC5D0\uB108\uC9C0\uC194\uB8E8\uC158", "\uC0BC\uC131SDI", "SK\uC628", "\uD3EC\uC2A4\uCF54\uD4E8\uCC98\uC5E0", "\uC5D0\uCF54\uD504\uB85C"],
      \uC77C\uBCF8: ["Panasonic", "GS Yuasa", "Sumitomo Metal Mining", "\u4F4F\u53CB\u5316\u5B66"],
      \uBBF8\uAD6D: ["Tesla", "Boeing", "General Motors", "Apple", "Honeywell"],
      \uB3C5\uC77C: ["BMW", "Volkswagen", "BASF", "Mercedes-Benz", "Umicore DE"],
      \uD504\uB791\uC2A4: ["Airbus", "Saft (TotalEnergies)", "Renault", "Stellantis"]
    },
    copper: {
      \uC911\uAD6D: ["State Grid", "China Southern Power Grid", "Midea", "Haier", "BYD", "CRRC"],
      \uBBF8\uAD6D: ["General Electric", "Tesla", "Prysmian NA", "Eaton", "Southwire", "Encore Wire"],
      \uB3C5\uC77C: ["Siemens", "Aurubis", "ThyssenKrupp", "Infineon", "Continental"],
      \uC77C\uBCF8: ["Mitsubishi Electric", "Sumitomo Electric", "Fujikura", "Furukawa Electric", "Hitachi"],
      \uD55C\uAD6D: ["LS\uC804\uC120", "\uD604\uB300\uC804\uAE30", "\uC0BC\uC131\uC804\uC790", "HD\uD604\uB300\uC77C\uB809\uD2B8\uB9AD", "LS\uC77C\uB809\uD2B8\uB9AD"]
    },
    nickel: {
      \uC911\uAD6D: ["Tsingshan", "CNGR Advanced Material", "Huayou Cobalt", "GEM", "Jinchuan Group"],
      \uD55C\uAD6D: ["POSCO", "LG\uC5D0\uB108\uC9C0\uC194\uB8E8\uC158", "\uC0BC\uC131SDI", "SK\uC628", "\uD3EC\uC2A4\uCF54\uD4E8\uCC98\uC5E0"],
      \uC77C\uBCF8: ["Panasonic", "Sumitomo Metal Mining", "Pacific Metals", "Nippon Steel"],
      \uBBF8\uAD6D: ["Tesla", "General Motors", "Arconic", "Special Metals"],
      \uB3C5\uC77C: ["ThyssenKrupp", "Volkswagen", "BASF", "Salzgitter", "Outokumpu DE"]
    },
    graphite: {
      \uD55C\uAD6D: ["LG\uC5D0\uB108\uC9C0\uC194\uB8E8\uC158", "\uC0BC\uC131SDI", "SK\uC628", "\uD3EC\uC2A4\uCF54\uD4E8\uCC98\uC5E0", "\uB300\uC8FC\uC804\uC790\uC7AC\uB8CC"],
      \uC77C\uBCF8: ["Panasonic", "Tokai Carbon", "Nippon Carbon", "Showa Denko"],
      \uBBF8\uAD6D: ["Tesla", "General Motors", "Westinghouse", "GrafTech"],
      \uB3C5\uC77C: ["SGL Carbon", "Volkswagen", "BMW", "Schunk Group"],
      \uC778\uB3C4: ["Tata Motors", "Graphite India", "HEG Limited", "Bharat Forge"]
    },
    titanium: {
      \uBBF8\uAD6D: ["Boeing", "Lockheed Martin", "RTX (Raytheon)", "Howmet Aerospace", "GE Aerospace", "Northrop Grumman"],
      \uD504\uB791\uC2A4: ["Airbus", "Safran", "Dassault Aviation", "Thales", "Aubert & Duval"],
      \uC601\uAD6D: ["Rolls-Royce", "BAE Systems", "GKN Aerospace", "Meggitt"],
      \uB3C5\uC77C: ["MTU Aero Engines", "Airbus DE", "Liebherr Aerospace", "Premium Aerotec"],
      \uC77C\uBCF8: ["Kawasaki Heavy Industries", "IHI", "Mitsubishi Heavy Industries", "Toho Titanium"]
    },
    vanadium: {
      \uBBF8\uAD6D: ["Nucor", "Steel Dynamics", "US Steel", "Carpenter Technology", "General Electric"],
      \uC77C\uBCF8: ["Sumitomo Electric", "Nippon Steel", "JFE Steel", "Kobe Steel"],
      \uB3C5\uC77C: ["ThyssenKrupp", "Salzgitter", "Dillinger", "Voestalpine DE"],
      \uD55C\uAD6D: ["POSCO", "\uD604\uB300\uC81C\uCCA0", "\uB3D9\uAD6D\uC81C\uAC15", "\uC138\uC544\uBCA0\uC2A4\uD2F8"],
      \uC778\uB3C4: ["Tata Steel", "JSW Steel", "SAIL", "Jindal Steel"]
    },
    platinum: {
      \uB3C5\uC77C: ["BASF", "Volkswagen", "BMW", "Mercedes-Benz", "Umicore DE", "Continental"],
      \uC77C\uBCF8: ["Toyota", "Honda", "Nissan", "Mazda", "N.E. Chemcat"],
      \uBBF8\uAD6D: ["General Motors", "Ford", "Plug Power", "Bloom Energy", "Cummins"],
      \uD55C\uAD6D: ["\uD604\uB300\uC790\uB3D9\uCC28", "\uAE30\uC544", "\uB450\uC0B0\uD4E8\uC5BC\uC140", "S-Fuelcell", "\uCF54\uC624\uB871\uC778\uB354\uC2A4\uD2B8\uB9AC"],
      \uC601\uAD6D: ["Johnson Matthey", "Jaguar Land Rover", "Ricardo", "Ceres Power"]
    }
  };
  const impactedCountries = [];
  let totalGlobalLoss = 0;
  const countryWeights = [];
  let totalWeight = 0;
  for (let i = 0; i < vCountries.length; i++) {
    const w = Math.max(1, vCountries.length - i) * (0.85 + Math.random() * 0.3);
    countryWeights.push(w);
    totalWeight += w;
  }
  const baseGlobalLoss = economicImpactBase * (50 + reduction * 2);
  const rawTotalGlobalLoss = Math.floor(baseGlobalLoss * (0.9 + Math.random() * 0.2));
  for (let i = 0; i < vCountries.length; i++) {
    const currentCountry = vCountries[i];
    const countryFraction = countryWeights[i] / totalWeight;
    const cLoss = Math.max(1, Math.floor(rawTotalGlobalLoss * countryFraction));
    totalGlobalLoss += cLoss;
    const sectors = [];
    const resDb = extendedCompanyDb[res.id];
    let countryCompanies = [];
    if (resDb && resDb[currentCountry]) {
      countryCompanies = [...resDb[currentCountry]];
    }
    const fromVulnerable = vCompanies.filter((c) => c.includes(`(${currentCountry})`)).map((c) => c.replace(/\s*\(.*?\)\s*/g, "").trim());
    for (const fc of fromVulnerable) {
      if (!countryCompanies.includes(fc)) {
        countryCompanies.push(fc);
      }
    }
    if (countryCompanies.length === 0) {
      countryCompanies = [
        `${currentCountry} Industrial Corp`,
        `${currentCountry} Advanced Materials`,
        `${currentCountry} Tech Industries`,
        `${currentCountry} Manufacturing Co.`
      ];
    }
    const numSectors = Math.min(
      applications.length,
      Math.max(2, Math.min(4, 2 + Math.floor(countryCompanies.length / 3)))
    );
    const sectorWeights = [];
    let sectorWeightSum = 0;
    for (let j = 0; j < numSectors; j++) {
      const sw = (numSectors - j) * (0.7 + Math.random() * 0.6);
      sectorWeights.push(sw);
      sectorWeightSum += sw;
    }
    const countryLossInMillion = cLoss * 100;
    const sectorCompanyAssignment = {};
    for (let j = 0; j < numSectors; j++) {
      sectorCompanyAssignment[j] = [];
    }
    const shuffledCompanies = [...countryCompanies].sort(() => Math.random() - 0.5);
    for (let k = 0; k < shuffledCompanies.length; k++) {
      const sectorIdx = k % numSectors;
      sectorCompanyAssignment[sectorIdx].push(shuffledCompanies[k]);
    }
    for (let j = 0; j < numSectors; j++) {
      while (sectorCompanyAssignment[j].length < 2) {
        const sectorName = applications[j % applications.length];
        const suffix = sectorCompanyAssignment[j].length + 1;
        sectorCompanyAssignment[j].push(`${currentCountry} ${sectorName} #${suffix}`);
      }
    }
    let allocatedSectorLoss = 0;
    for (let j = 0; j < numSectors; j++) {
      const sectorFraction = sectorWeights[j] / sectorWeightSum;
      let sectorLoss;
      if (j === numSectors - 1) {
        sectorLoss = countryLossInMillion - allocatedSectorLoss;
      } else {
        sectorLoss = Math.floor(countryLossInMillion * sectorFraction);
      }
      sectorLoss = Math.max(1, sectorLoss);
      allocatedSectorLoss += sectorLoss;
      const sectorName = applications[j % applications.length];
      const assignedComps = sectorCompanyAssignment[j];
      const companies = [];
      const compWeights = [];
      let compWeightSum = 0;
      for (let k = 0; k < assignedComps.length; k++) {
        const cw = (assignedComps.length - k) * (0.6 + Math.random() * 0.8);
        compWeights.push(cw);
        compWeightSum += cw;
      }
      const companyShareOfSector = 0.5 + Math.random() * 0.35;
      const totalCompanyDamage = Math.floor(sectorLoss * companyShareOfSector);
      let allocatedCompDamage = 0;
      for (let k = 0; k < assignedComps.length; k++) {
        const compName = assignedComps[k];
        const compFraction = compWeights[k] / compWeightSum;
        let compLoss;
        if (k === assignedComps.length - 1) {
          compLoss = totalCompanyDamage - allocatedCompDamage;
        } else {
          compLoss = Math.floor(totalCompanyDamage * compFraction);
        }
        compLoss = Math.max(1, compLoss);
        allocatedCompDamage += compLoss;
        const compUsage = Math.max(1, Math.floor(compLoss * (0.3 + Math.random() * 0.5)));
        companies.push({
          companyName: compName,
          usageAmount: compUsage,
          damageAmount: compLoss
        });
      }
      sectors.push({
        sectorName,
        sectorLoss,
        companies,
        isExpanded: false
      });
    }
    impactedCountries.push({
      countryName: currentCountry,
      countryLoss: cLoss,
      sectors,
      isExpanded: false
    });
  }
  nationSimResult = {
    sourceCountryId: country.id,
    sourceCountryName: countryName,
    resourceId: res.id,
    resourceName: resName,
    reductionPercent: reduction,
    totalGlobalLoss,
    impactedCountries
  };
}
function showISSModal() {
  if (!textData || !uiLayer) return;
  const st = textData;
  const existingModal = document.getElementById("issModal");
  if (existingModal && existingModal.parentNode) {
    existingModal.parentNode.removeChild(existingModal);
    const idx = activeUIElements.indexOf(existingModal);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const modal = AppHelper.createUIElement("div", "issModal", {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "600px",
    backgroundColor: "rgba(10, 20, 35, 0.95)",
    borderRadius: "16px",
    padding: "3%",
    border: "2px solid rgba(100, 200, 255, 0.6)",
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    zIndex: "200",
    boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
    boxSizing: "border-box"
  });
  uiLayer.appendChild(modal);
  activeUIElements.push(modal);
  const headerRow = AppHelper.createUIElement("div", "issModalHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4%",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  modal.appendChild(headerRow);
  const title = AppHelper.createUIElement(
    "div",
    "issModalTitle",
    {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#60a5fa",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.issModalTitle || "\u{1F6F0}\uFE0F \uAD6D\uC81C\uC6B0\uC8FC\uC815\uAC70\uC7A5(ISS)\uACFC \uC6B0\uC8FC \uC790\uC6D0 \uC5F0\uAD6C"
  );
  headerRow.appendChild(title);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "issModalClose",
    {
      padding: "1% 3%",
      fontSize: "14px",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "1px solid rgba(255, 100, 100, 0.5)"
    },
    `\u2715 ${textData.closeBtn || "\uB2EB\uAE30"}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          if (modal.parentNode) modal.parentNode.removeChild(modal);
          const idx = activeUIElements.indexOf(modal);
          if (idx >= 0) activeUIElements.splice(idx, 1);
        }
      }
    ]
  );
  headerRow.appendChild(closeBtn);
  const desc = AppHelper.createUIElement(
    "div",
    "issModalDesc",
    {
      fontSize: "15px",
      color: "#c0d8ff",
      marginBottom: "4%",
      lineHeight: "1.6",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.issModalDesc || "\uAD6D\uC81C\uC6B0\uC8FC\uC815\uAC70\uC7A5\uC740 \uC9C0\uAD6C \uC800\uADA4\uB3C4\uC5D0\uC11C \uBBF8\uC138\uC911\uB825 \uD658\uACBD\uC744 \uC774\uC6A9\uD574 \uCCA8\uB2E8 \uC2E0\uC18C\uC7AC \uAC1C\uBC1C\uACFC \uC6B0\uC8FC \uC790\uC6D0 \uD0D0\uC0AC\uB97C \uC704\uD55C \uC804\uCD08\uAE30\uC9C0 \uC5ED\uD560\uC744 \uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4."
  );
  modal.appendChild(desc);
  const detailsContainer = AppHelper.createUIElement("div", "issDetailsContainer", {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxSizing: "border-box"
  });
  modal.appendChild(detailsContainer);
  const details = st.issDetails || [];
  for (let i = 0; i < details.length; i++) {
    const d = details[i];
    const card = AppHelper.createUIElement("div", `issD_${i}`, {
      backgroundColor: "rgba(30, 50, 80, 0.5)",
      padding: "3%",
      borderRadius: "10px",
      borderLeft: "4px solid #60a5fa",
      boxSizing: "border-box"
    });
    const dTitle = AppHelper.createUIElement(
      "div",
      "",
      {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: "2%"
      },
      d.title
    );
    card.appendChild(dTitle);
    const dDesc = AppHelper.createUIElement(
      "div",
      "",
      {
        fontSize: "14px",
        color: "#e0e8ff",
        lineHeight: "1.5"
      },
      d.desc
    );
    card.appendChild(dDesc);
    detailsContainer.appendChild(card);
  }
}
function drawISS(c, time) {
  if (!issProjected || !textData || issProjected.radius <= 0) return;
  const proj = issProjected;
  const st = textData;
  const r = Math.max(0.1, proj.radius);
  const hoverScale = hoveredISS ? 1.3 : 1;
  const size = r * hoverScale;
  c.save();
  c.translate(proj.x, proj.y);
  const pulse = 1 + 0.1 * Math.sin(time * 6);
  const glowRadius = size * 4 * pulse;
  const glow = c.createRadialGradient(0, 0, size * 0.5, 0, 0, glowRadius);
  glow.addColorStop(0, hoveredISS ? "rgba(100, 200, 255, 0.5)" : "rgba(200, 230, 255, 0.2)");
  glow.addColorStop(1, "rgba(200, 230, 255, 0)");
  c.fillStyle = glow;
  c.beginPath();
  c.arc(0, 0, glowRadius, 0, Math.PI * 2);
  c.fill();
  const baseRotation = time * 0.2;
  c.rotate(baseRotation);
  c.fillStyle = "#a0a0a0";
  c.fillRect(-size * 3, -size * 0.1, size * 6, size * 0.2);
  c.strokeStyle = "#505050";
  c.lineWidth = Math.max(0.5, size * 0.05);
  c.beginPath();
  for (let i = -3; i <= 2.8; i += 0.4) {
    c.moveTo(size * i, -size * 0.1);
    c.lineTo(size * (i + 0.2), size * 0.1);
    c.lineTo(size * (i + 0.4), -size * 0.1);
  }
  c.stroke();
  const panelWidth = size * 1.6;
  const panelHeight = size * 0.8;
  const drawPanel = (xOffset, yDir) => {
    c.save();
    c.translate(xOffset, yDir * size * 0.1);
    c.fillStyle = "#888888";
    c.fillRect(-size * 0.05, 0, size * 0.1, yDir * size * 0.6);
    c.translate(0, yDir * size * 0.6 + yDir * panelHeight * 0.5);
    const tilt = yDir * 0.15 * Math.sin(time + xOffset);
    c.transform(1, tilt, 0, 1, 0, 0);
    const panelGrad = c.createLinearGradient(0, -panelHeight / 2, 0, panelHeight / 2);
    panelGrad.addColorStop(0, "#1e3a8a");
    panelGrad.addColorStop(0.5, "#3b82f6");
    panelGrad.addColorStop(1, "#1e3a8a");
    c.fillStyle = panelGrad;
    c.fillRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight);
    c.strokeStyle = "rgba(255, 255, 255, 0.4)";
    c.lineWidth = Math.max(0.5, size * 0.05);
    c.beginPath();
    for (let i = 1; i < 4; i++) {
      c.moveTo(-panelWidth / 2 + panelWidth / 4 * i, -panelHeight / 2);
      c.lineTo(-panelWidth / 2 + panelWidth / 4 * i, panelHeight / 2);
    }
    c.moveTo(-panelWidth / 2, 0);
    c.lineTo(panelWidth / 2, 0);
    c.stroke();
    const sheen = c.createLinearGradient(-panelWidth / 2, -panelHeight / 2, panelWidth / 2, panelHeight / 2);
    const sheenAlpha = 0.15 + 0.15 * Math.sin(time * 2 + xOffset);
    sheen.addColorStop(0, `rgba(255, 255, 255, 0)`);
    sheen.addColorStop(0.5, `rgba(255, 255, 255, ${sheenAlpha})`);
    sheen.addColorStop(1, `rgba(255, 255, 255, 0)`);
    c.fillStyle = sheen;
    c.fillRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight);
    c.restore();
  };
  drawPanel(-size * 2.2, -1);
  drawPanel(-size * 2.2, 1);
  drawPanel(-size * 1.2, -1);
  drawPanel(-size * 1.2, 1);
  drawPanel(size * 1.2, -1);
  drawPanel(size * 1.2, 1);
  drawPanel(size * 2.2, -1);
  drawPanel(size * 2.2, 1);
  c.fillStyle = "#e5e7eb";
  c.fillRect(-size * 0.1, size * 0.2, size * 0.2, size * 1.2);
  c.fillRect(-size * 0.1, -size * 1.4, size * 0.2, size * 1.2);
  c.strokeStyle = "#9ca3af";
  c.lineWidth = Math.max(0.5, size * 0.04);
  c.strokeRect(-size * 0.1, size * 0.2, size * 0.2, size * 1.2);
  c.strokeRect(-size * 0.1, -size * 1.4, size * 0.2, size * 1.2);
  const drawCylinder = (x, y, w, h, horizontal) => {
    c.save();
    c.translate(x, y);
    const grad = horizontal ? c.createLinearGradient(0, -h / 2, 0, h / 2) : c.createLinearGradient(-w / 2, 0, w / 2, 0);
    grad.addColorStop(0, "#9ca3af");
    grad.addColorStop(0.3, "#ffffff");
    grad.addColorStop(0.8, "#d1d5db");
    grad.addColorStop(1, "#4b5563");
    c.fillStyle = grad;
    c.fillRect(-w / 2, -h / 2, w, h);
    if (horizontal) {
      c.beginPath();
      c.ellipse(-w / 2, 0, Math.max(0.1, w * 0.05), Math.max(0.1, h / 2), 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.ellipse(w / 2, 0, Math.max(0.1, w * 0.05), Math.max(0.1, h / 2), 0, 0, Math.PI * 2);
      c.fill();
    } else {
      c.beginPath();
      c.ellipse(0, -h / 2, Math.max(0.1, w / 2), Math.max(0.1, h * 0.05), 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.ellipse(0, h / 2, Math.max(0.1, w / 2), Math.max(0.1, h * 0.05), 0, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  };
  drawCylinder(0, 0, size * 0.6, size * 1.8, false);
  drawCylinder(size * 0.4, 0, size * 1.2, size * 0.5, true);
  drawCylinder(-size * 0.5, 0, size * 1, size * 0.4, true);
  c.strokeStyle = "#4b5563";
  c.lineWidth = Math.max(0.5, size * 0.05);
  c.beginPath();
  c.moveTo(-size * 0.3, -size * 0.5);
  c.lineTo(size * 0.3, -size * 0.5);
  c.moveTo(-size * 0.3, size * 0.5);
  c.lineTo(size * 0.3, size * 0.5);
  c.moveTo(size * 0.5, -size * 0.25);
  c.lineTo(size * 0.5, size * 0.25);
  c.moveTo(size * 0.8, -size * 0.25);
  c.lineTo(size * 0.8, size * 0.25);
  c.moveTo(-size * 0.5, -size * 0.2);
  c.lineTo(-size * 0.5, size * 0.2);
  c.stroke();
  c.fillStyle = "#1f2937";
  c.beginPath();
  c.arc(size * 0.5, size * 0.25, size * 0.15, 0, Math.PI);
  c.fill();
  c.fillStyle = "#60a5fa";
  c.beginPath();
  c.arc(size * 0.5, size * 0.25, size * 0.08, 0, Math.PI);
  c.fill();
  const blink = time * 1.5 % 2 < 1;
  if (blink) {
    c.fillStyle = "#ef4444";
    c.beginPath();
    c.arc(-size * 3, -size * 0.2, Math.max(0.5, size * 0.1), 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#22c55e";
    c.beginPath();
    c.arc(size * 3, -size * 0.2, Math.max(0.5, size * 0.1), 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
  if (hoveredISS) {
    const textYOffset = size * 2.5 + 15 + Math.sin(time * 6) * 4;
    c.font = `bold ${Math.max(12, r * 0.6)}px sans-serif`;
    c.textAlign = "center";
    c.textBaseline = "bottom";
    c.fillStyle = "#60a5fa";
    c.shadowColor = "rgba(0,0,0,0.9)";
    c.shadowBlur = 6;
    c.fillText(st.issHoverText || "\u{1F6F0}\uFE0F \uAD6D\uC81C\uC6B0\uC8FC\uC815\uAC70\uC7A5 (\uD074\uB9AD)", proj.x, proj.y - textYOffset);
    c.shadowBlur = 0;
  }
}
function calculateISS(cx, cy) {
  if (!appData) return;
  const scaledGlobeRadius = appData.globeRadius * zoomLevel;
  const orbitRadius = scaledGlobeRadius * 1.15;
  const issBaseRadius = scaledGlobeRadius * 0.05;
  let pt = {
    x: Math.cos(issOrbitAngle) * orbitRadius,
    y: Math.sin(issOrbitAngle) * orbitRadius * 0.5,
    z: Math.sin(issOrbitAngle) * orbitRadius
  };
  pt = rotateX(pt, globeRotation.rotX);
  const fov = 800;
  const perspective = fov / (fov + pt.z);
  issProjected = {
    x: cx + pt.x * perspective,
    y: cy + pt.y * perspective,
    radius: issBaseRadius * perspective,
    visible: pt.z < scaledGlobeRadius * 0.95,
    z: pt.z
  };
}
function showChinaConsumptionModal() {
  if (!textData || !uiLayer) return;
  const st = textData;
  const existingModal = document.getElementById("chinaModal");
  if (existingModal && existingModal.parentNode) {
    existingModal.parentNode.removeChild(existingModal);
    const idx = activeUIElements.indexOf(existingModal);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const modal = AppHelper.createUIElement("div", "chinaModal", {
    position: "absolute",
    left: "5%",
    top: "5%",
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(15, 20, 35, 0.98)",
    borderRadius: "16px",
    padding: "2% 3%",
    border: "2px solid rgba(255, 107, 107, 0.6)",
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    zIndex: "200",
    boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
    boxSizing: "border-box"
  });
  uiLayer.appendChild(modal);
  activeUIElements.push(modal);
  const headerRow = AppHelper.createUIElement("div", "chinaModalHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  modal.appendChild(headerRow);
  const title = AppHelper.createUIElement(
    "div",
    "chinaModalTitle",
    {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#ff6b6b",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.chinaModalTitle || "\u{1F1E8}\u{1F1F3} \uC911\uAD6D\uC740 \uC65C '\uC790\uC6D0 \uBE14\uB799\uD640'\uC774 \uB418\uC5C8\uC744\uAE4C?"
  );
  headerRow.appendChild(title);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "chinaModalClose",
    {
      padding: "1% 2%",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "1px solid rgba(255, 100, 100, 0.5)"
    },
    `\u2715 ${textData.closeBtn || "\uB2EB\uAE30"}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          if (modal.parentNode) modal.parentNode.removeChild(modal);
          const idx = activeUIElements.indexOf(modal);
          if (idx >= 0) activeUIElements.splice(idx, 1);
        }
      }
    ]
  );
  headerRow.appendChild(closeBtn);
  const contentArea = AppHelper.createUIElement("div", "chinaModalContent", {
    flex: "1",
    overflowY: "auto",
    boxSizing: "border-box",
    pointerEvents: "auto"
  });
  modal.appendChild(contentArea);
  const desc = AppHelper.createUIElement(
    "div",
    "chinaModalDesc",
    {
      fontSize: "15px",
      color: "#c0d8ff",
      marginBottom: "2%",
      lineHeight: "1.6",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.chinaModalDesc || "\uC804 \uC138\uACC4 \uC8FC\uC694 \uC790\uC6D0\uC758 \uC5C4\uCCAD\uB09C \uC591\uC774 \uC911\uAD6D\uC73C\uB85C \uBE68\uB824 \uB4E4\uC5B4\uAC11\uB2C8\uB2E4. \uADF8 \uACBD\uC81C\uC801, \uC0B0\uC5C5\uC801 \uC774\uC720\uB97C \uC54C\uAE30 \uC27D\uAC8C \uC124\uBA85\uD574 \uB4DC\uB9BD\uB2C8\uB2E4."
  );
  contentArea.appendChild(desc);
  const reasonsGrid = AppHelper.createUIElement("div", "chinaReasonsGrid", {
    display: "flex",
    flexWrap: "wrap",
    gap: "2%",
    marginBottom: "3%",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  contentArea.appendChild(reasonsGrid);
  const reasons = st.chinaReasons || [];
  for (let i = 0; i < reasons.length; i++) {
    const r = reasons[i];
    const rCard = AppHelper.createUIElement("div", `chinaR_${i}`, {
      flex: "1",
      minWidth: "250px",
      backgroundColor: "rgba(30, 40, 60, 0.6)",
      borderRadius: "12px",
      padding: "2%",
      border: "1px solid rgba(255, 107, 107, 0.3)",
      boxSizing: "border-box",
      marginBottom: "2%"
    });
    const rTitle = AppHelper.createUIElement(
      "div",
      `chinaRT_${i}`,
      {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#ff9a76",
        marginBottom: "4%"
      },
      `${r.icon} ${r.title}`
    );
    rCard.appendChild(rTitle);
    const rDesc = AppHelper.createUIElement(
      "div",
      `chinaRD_${i}`,
      {
        fontSize: "14px",
        color: "#e0e8ff",
        lineHeight: "1.6"
      },
      r.desc
    );
    rCard.appendChild(rDesc);
    reasonsGrid.appendChild(rCard);
  }
  const statsTitle = AppHelper.createUIElement(
    "div",
    "chinaStatsTitle",
    {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "2%",
      borderBottom: "2px solid rgba(96, 165, 250, 0.4)",
      paddingBottom: "1%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    "\u{1F4CA} \uAD6C\uCCB4\uC801 \uC0AC\uB840 \uBC0F \uD574\uC124 (\uC0DD\uC0B0\uB7C9 \uB300\uBE44 \uC18C\uBE44\uB7C9\uC758 \uC5ED\uC124)"
  );
  contentArea.appendChild(statsTitle);
  const stats = st.chinaStats || [];
  for (let i = 0; i < stats.length; i++) {
    const s = stats[i];
    let resColor = "#ffffff";
    if (appData) {
      const resData = appData.resources.find((r) => r.id === s.resourceId);
      if (resData) resColor = resData.color;
    }
    const sCard = AppHelper.createUIElement("div", `chinaS_${i}`, {
      backgroundColor: "rgba(20, 30, 50, 0.8)",
      borderRadius: "10px",
      padding: "2%",
      borderLeft: `4px solid ${resColor}`,
      boxSizing: "border-box",
      marginBottom: "2%",
      pointerEvents: "none"
    });
    const sHeader = AppHelper.createUIElement(
      "div",
      `chinaST_${i}`,
      {
        fontSize: "16px",
        fontWeight: "bold",
        color: resColor,
        marginBottom: "1%"
      },
      s.statTitle
    );
    sCard.appendChild(sHeader);
    const sExpl = AppHelper.createUIElement(
      "div",
      `chinaSE_${i}`,
      {
        fontSize: "14px",
        color: "#c0d8ff",
        lineHeight: "1.6"
      },
      s.explanation
    );
    sCard.appendChild(sExpl);
    contentArea.appendChild(sCard);
  }
}
function showTermExplanationModal() {
  if (!textData || !uiLayer) return;
  const st = textData;
  const existingModal = document.getElementById("termModal");
  if (existingModal && existingModal.parentNode) {
    existingModal.parentNode.removeChild(existingModal);
    const idx = activeUIElements.indexOf(existingModal);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const modal = AppHelper.createUIElement("div", "termModal", {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "500px",
    backgroundColor: "rgba(15, 25, 50, 0.95)",
    borderRadius: "12px",
    padding: "3%",
    border: "2px solid rgba(100, 180, 255, 0.6)",
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    zIndex: "200",
    boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
    boxSizing: "border-box"
  });
  uiLayer.appendChild(modal);
  activeUIElements.push(modal);
  const title = AppHelper.createUIElement(
    "div",
    "termTitle",
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "4%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.prodVsMiningTitle || "\u{1F4A1} \uC0DD\uC0B0\uB7C9\uACFC \uCC44\uAD74\uB7C9\uC758 \uCC28\uC774"
  );
  modal.appendChild(title);
  const desc = AppHelper.createUIElement(
    "div",
    "termDesc",
    {
      fontSize: "14px",
      color: "#c0d8ff",
      lineHeight: "1.6",
      whiteSpace: "pre-wrap",
      marginBottom: "5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.prodVsMiningDesc || "\u2022 \uCC44\uAD74\uB7C9(Mining): \uAD11\uC0B0\uC5D0\uC11C \uC790\uC5F0 \uC0C1\uD0DC\uC758 \uAD11\uBB3C\uC744 \uCE90\uB0B8 \uC6D0\uAD11\uC758 \uC591\uC785\uB2C8\uB2E4.\n\u2022 \uC0DD\uC0B0\uB7C9(Production): \uCC44\uAD74\uB41C \uAD11\uBB3C\uC744 \uC81C\uB828 \uBC0F \uC815\uC81C\uD558\uC5EC \uC2E4\uC81C \uC0B0\uC5C5\uC5D0 \uC0AC\uC6A9\uD560 \uC218 \uC788\uB294 \uC0C1\uD0DC\uB85C \uAC00\uACF5\uD55C \uC591\uC785\uB2C8\uB2E4.\n\n\u203B \uAE00\uB85C\uBC8C \uACF5\uAE09\uB9DD\uC758 \uD575\uC2EC \uD2B9\uC9D5: \uB9CE\uC740 \uC790\uC6D0\uB4E4\uC774 \uC2E4\uC81C\uB85C \uCC44\uAD74\uB418\uB294 \uAD6D\uAC00\uC640, \uC774\uB97C \uC815\uC81C/\uAC00\uACF5(\uC0DD\uC0B0)\uD558\uB294 \uAD6D\uAC00\uAC00 \uB2E4\uB985\uB2C8\uB2E4."
  );
  modal.appendChild(desc);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "termClose",
    {
      marginTop: "2%",
      padding: "2% 0",
      fontSize: "15px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(60, 140, 255, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      textAlign: "center",
      boxSizing: "border-box",
      border: "1px solid rgba(100, 180, 255, 0.6)"
    },
    textData.closeBtn || "\uB2EB\uAE30",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          if (modal.parentNode) modal.parentNode.removeChild(modal);
          const idx = activeUIElements.indexOf(modal);
          if (idx >= 0) activeUIElements.splice(idx, 1);
        }
      }
    ]
  );
  modal.appendChild(closeBtn);
}
function showMoonSimulationUI() {
  if (!textData || !uiLayer) return;
  clearUI();
  const st = textData;
  const overlay = AppHelper.createUIElement("div", "moonSimOverlay", {
    position: "absolute",
    left: "5%",
    top: "5%",
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(10, 15, 30, 0.95)",
    borderRadius: "16px",
    padding: "3%",
    border: "2px solid rgba(255, 230, 150, 0.5)",
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    boxShadow: "0 0 30px rgba(255, 230, 150, 0.2)",
    overflowY: "auto"
  });
  uiLayer.appendChild(overlay);
  activeUIElements.push(overlay);
  const title = AppHelper.createUIElement(
    "div",
    "moonSimTitle",
    {
      fontSize: "26px",
      fontWeight: "bold",
      color: "#ffe66d",
      marginBottom: "2%",
      textAlign: "center",
      pointerEvents: "none",
      boxSizing: "border-box",
      flexShrink: "0"
    },
    st.moonSimTitle || "\u{1F315} \uB2EC \uC790\uC6D0(\uD5EC\uB968-3) \uCC44\uAD74 \uBC0F \uAC1C\uBC1C \uC2DC\uBBAC\uB808\uC774\uC158"
  );
  overlay.appendChild(title);
  const desc = AppHelper.createUIElement(
    "div",
    "moonSimDesc",
    {
      fontSize: "14px",
      color: "#c0d8ff",
      marginBottom: "3%",
      textAlign: "center",
      lineHeight: "1.6",
      pointerEvents: "none",
      boxSizing: "border-box",
      flexShrink: "0"
    },
    st.moonSimDesc || "\uB2EC \uD45C\uBA74\uC5D0 \uD48D\uBD80\uD558\uAC8C \uB9E4\uC7A5\uB41C \uD5EC\uB968-3\uB294 \uBC29\uC0AC\uB2A5 \uBC1C\uC0DD\uC774 \uC5C6\uB294 \uCC28\uC138\uB300 \uD575\uC735\uD569 \uBC1C\uC804\uC758 \uC644\uBCBD\uD55C \uCCAD\uC815 \uC5F0\uB8CC\uC785\uB2C8\uB2E4. \uC9C0\uAD6C\uC5D0\uB294 \uC218\uBC31 kg\uBC16\uC5D0 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC9C0\uB9CC, \uB2EC\uC5D0\uB294 \uC57D 110\uB9CC \uD1A4\uC758 \uD5EC\uB968-3\uAC00 \uB9E4\uC7A5\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uB2E8 1\uD1A4\uC73C\uB85C \uC9C0\uAD6C \uC804\uCCB4\uAC00 \uBA70\uCE60\uAC04 \uC0AC\uC6A9\uD560 \uC5D0\uB108\uC9C0\uB97C \uC0DD\uC0B0\uD560 \uC218 \uC788\uC5B4, \uBBF8\uB798 \uC5D0\uB108\uC9C0 \uD328\uAD8C\uC758 \uD575\uC2EC\uC785\uB2C8\uB2E4."
  );
  overlay.appendChild(desc);
  const topContentRow = AppHelper.createUIElement("div", "moonSimTopContent", {
    display: "flex",
    flexWrap: "wrap",
    gap: "2%",
    marginBottom: "2%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(topContentRow);
  const statsPanel = AppHelper.createUIElement("div", "moonStats", {
    flex: "1",
    minWidth: "300px",
    backgroundColor: "rgba(20, 30, 60, 0.6)",
    borderRadius: "12px",
    padding: "2%",
    border: "1px solid rgba(100, 150, 255, 0.3)",
    boxSizing: "border-box",
    pointerEvents: "none",
    marginBottom: "2%"
  });
  topContentRow.appendChild(statsPanel);
  const statTitle = AppHelper.createUIElement(
    "div",
    "moonStatTitle",
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "4%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.moonStatTitle || "\u{1F4CA} \uD5EC\uB968-3 \uC790\uC6D0 \uAC00\uCE58 \uBC0F \uD2B9\uC9D5"
  );
  statsPanel.appendChild(statTitle);
  const stats = st.moonStatsDetails || [
    { label: "\uB2EC \uB9E4\uC7A5\uB7C9 \uCD94\uC815\uCE58", value: "\uC57D 110\uB9CC \uD1A4", icon: "\u{1F4E6}" },
    { label: "\uC9C0\uAD6C \uB9E4\uC7A5\uB7C9", value: "\uC218\uBC31 kg \uC218\uC900 (\uADF9\uD76C\uADC0)", icon: "\u{1F30D}" },
    { label: "\uC5D0\uB108\uC9C0 \uD6A8\uC728", value: "\uC6B0\uB77C\uB284\uC758 10\uBC30 (\uC11D\uD0C4\uC758 \uCC9C\uB9CC \uBC30 \uC774\uC0C1)", icon: "\u26A1" },
    { label: "\uCE5C\uD658\uACBD\uC131", value: "\uBC29\uC0AC\uC131 \uD3D0\uAE30\uBB3C \uBC30\uCD9C \uC81C\uB85C", icon: "\u{1F331}" },
    { label: "\uC7A0\uC7AC\uC801 \uACBD\uC81C \uAC00\uCE58", value: "\uD1A4\uB2F9 \uC57D 30\uC5B5 \uB2EC\uB7EC \uC774\uC0C1", icon: "\u{1F4B0}" }
  ];
  for (const s of stats) {
    const row = AppHelper.createUIElement("div", "", {
      display: "flex",
      justifyContent: "space-between",
      padding: "2.5% 0",
      borderBottom: "1px solid rgba(100, 150, 255, 0.1)",
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    const labelEl = AppHelper.createUIElement(
      "span",
      "",
      { color: "#a0c0ff", fontSize: "14px", boxSizing: "border-box" },
      `${s.icon} ${s.label}`
    );
    const valEl = AppHelper.createUIElement(
      "span",
      "",
      {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "14px",
        boxSizing: "border-box",
        textAlign: "right",
        paddingLeft: "10px"
      },
      s.value
    );
    row.appendChild(labelEl);
    row.appendChild(valEl);
    statsPanel.appendChild(row);
  }
  const countryPanel = AppHelper.createUIElement("div", "moonCountryStatus", {
    flex: "1.5",
    minWidth: "300px",
    backgroundColor: "rgba(20, 30, 60, 0.6)",
    borderRadius: "12px",
    padding: "2%",
    border: "1px solid rgba(255, 150, 100, 0.3)",
    boxSizing: "border-box",
    pointerEvents: "auto",
    marginBottom: "2%"
  });
  topContentRow.appendChild(countryPanel);
  const countryTitle = AppHelper.createUIElement(
    "div",
    "moonCountryTitle",
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#ff9a76",
      marginBottom: "3%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.moonCountryStatusTitle || "\u{1F680} \uAD6D\uAC00\uBCC4 \uB2EC \uC790\uC6D0 \uD655\uBCF4 \uACBD\uC7C1 \uD604\uD669"
  );
  countryPanel.appendChild(countryTitle);
  const countryData = st.moonCountryStatus || [
    {
      country: "\uBBF8\uAD6D (\uC544\uB974\uD14C\uBBF8\uC2A4 \uACC4\uD68D)",
      status: "2025\uB144 \uC774\uD6C4 \uC720\uC778 \uCC29\uB959 \uBAA9\uD45C. \uB3D9\uB9F9\uAD6D\uB4E4\uACFC \uC544\uB974\uD14C\uBBF8\uC2A4 \uD611\uC815\uC744 \uB9FA\uACE0, \uB2EC \uB0A8\uADF9\uC5D0\uC11C \uBB3C\uACFC \uC790\uC6D0\uC744 \uCC44\uAD74\uD560 \uAE30\uC9C0 \uAC74\uC124 \uC8FC\uB3C4 \uC911."
    },
    {
      country: "\uC911\uAD6D (\uCC3D\uC5B4 \uACC4\uD68D)",
      status: "\uCC3D\uC5B4 5\uD638\uB85C \uB2EC \uC0D8\uD50C \uADC0\uD658 \uC131\uACF5, \uD5EC\uB968-3 \uCD94\uCD9C \uC5F0\uAD6C \uC9C4\uD589. \uB7EC\uC2DC\uC544\uC640 \uD611\uB825\uD558\uC5EC \uAD6D\uC81C \uB2EC \uC5F0\uAD6C\uAE30\uC9C0(ILRS) \uAC74\uC124 \uCD94\uC9C4."
    },
    {
      country: "\uB7EC\uC2DC\uC544 (\uB8E8\uB098 \uACC4\uD68D)",
      status: "\uB2EC \uB0A8\uADF9 \uCC29\uB959 \uC7AC\uB3C4\uC804 \uC911. \uC911\uAD6D\uACFC \uD611\uB825\uD558\uC5EC \uB3C5\uC790\uC801\uC778 \uC6B0\uC8FC \uC815\uAC70\uC7A5 \uBC0F \uB2EC \uC790\uC6D0 \uCC44\uAD74\uB9DD \uAD6C\uCD95 \uBAA9\uD45C."
    },
    {
      country: "\uC778\uB3C4 (\uCC2C\uB4DC\uB77C\uC580 \uACC4\uD68D)",
      status: "\uCC2C\uB4DC\uB77C\uC580 3\uD638\uB85C \uC138\uACC4 \uCD5C\uCD08 \uB2EC \uB0A8\uADF9 \uADFC\uCC98 \uCC29\uB959 \uC131\uACF5. \uC800\uBE44\uC6A9 \uD0D0\uC0AC \uAE30\uC220\uB85C \uB2EC \uC218\uC790\uC6D0 \uBC0F \uAD11\uBB3C \uD0D0\uC0AC \uBCF8\uACA9\uD654."
    }
  ];
  for (let i = 0; i < countryData.length; i++) {
    const cData = countryData[i];
    const item = AppHelper.createUIElement("div", `moonCD_${i}`, {
      marginBottom: "2.5%",
      padding: "2%",
      backgroundColor: "rgba(30, 45, 80, 0.5)",
      borderRadius: "8px",
      boxSizing: "border-box",
      borderLeft: "3px solid #ff9a76",
      pointerEvents: "none"
    });
    const cName = AppHelper.createUIElement(
      "div",
      "",
      {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: "1%"
      },
      `\u{1F3F3}\uFE0F ${cData.country}`
    );
    const cStatus = AppHelper.createUIElement(
      "div",
      "",
      {
        fontSize: "13px",
        color: "#e0e8ff",
        lineHeight: "1.5"
      },
      cData.status
    );
    item.appendChild(cName);
    item.appendChild(cStatus);
    countryPanel.appendChild(item);
  }
  const he3Panel = AppHelper.createUIElement("div", "moonHe3Panel", {
    width: "100%",
    backgroundColor: "rgba(20, 40, 80, 0.4)",
    borderRadius: "12px",
    padding: "2%",
    border: "1px solid rgba(150, 200, 255, 0.3)",
    boxSizing: "border-box",
    pointerEvents: "auto",
    marginBottom: "2%",
    flexShrink: "0"
  });
  overlay.appendChild(he3Panel);
  const he3Title = AppHelper.createUIElement(
    "div",
    "he3Title",
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#a0c0ff",
      marginBottom: "2%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.moonHe3Title || "\u{1F4A1} \uD5EC\uB968-3, \uC65C \uADF8\uB807\uAC8C \uBE44\uC2F8\uACE0 \uC911\uC694\uD560\uAE4C\uC694?"
  );
  he3Panel.appendChild(he3Title);
  const he3Grid = AppHelper.createUIElement("div", "he3Grid", {
    display: "flex",
    flexWrap: "wrap",
    gap: "2%",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  he3Panel.appendChild(he3Grid);
  const he3Details = st.moonHe3Details || [
    {
      title: "\u{1F30D} \uC9C0\uAD6C\uC0C1\uC758 \uADF9\uB2E8\uC801 \uD76C\uC18C\uC131",
      desc: "\uD0DC\uC591\uD48D\uC744 \uD1B5\uD574 \uC6B0\uC8FC\uB85C \uD37C\uC9C0\uB294 \uD5EC\uB968-3\uB294 \uC9C0\uAD6C \uB300\uAE30\uC640 \uC790\uAE30\uC7A5\uC5D0 \uB9C9\uD600 \uC9C0\uD45C\uBA74\uC5D0 \uB3C4\uB2EC\uD558\uC9C0 \uBABB\uD569\uB2C8\uB2E4. \uC218\uC2ED kg\uBC16\uC5D0 \uC874\uC7AC\uD558\uC9C0 \uC54A\uB294 \uCD08\uD76C\uADC0 \uBB3C\uC9C8\uC785\uB2C8\uB2E4."
    },
    {
      title: "\u269B\uFE0F \uBC29\uC0AC\uB2A5 \uC5C6\uB294 '\uAFC8\uC758 \uD575\uC735\uD569'",
      desc: "\uD5EC\uB968-3 \uAE30\uBC18\uC758 \uD575\uC735\uD569 \uBC1C\uC804\uC740 \uACE0\uC900\uC704 \uBC29\uC0AC\uC131 \uD3D0\uAE30\uBB3C\uC774 \uBC1C\uC0DD\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uD3ED\uBC1C \uC704\uD5D8\uB3C4 \uC5C6\uC5B4 \uC778\uB958\uC758 \uC644\uBCBD\uD55C \uCCAD\uC815 \uC5D0\uB108\uC9C0\uC6D0\uC774 \uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    },
    {
      title: "\u26A1 \uC555\uB3C4\uC801\uC778 \uC5D0\uB108\uC9C0 \uD6A8\uC728",
      desc: "\uB2E8 1g\uC73C\uB85C \uC11D\uD0C4 40\uD1A4\uC758 \uC5D0\uB108\uC9C0\uB97C \uB9CC\uB4ED\uB2C8\uB2E4. \uC57D 100\uD1A4\uB9CC \uC9C0\uAD6C\uB85C \uAC00\uC838\uC624\uBA74 \uC778\uB958 \uC804\uCCB4\uAC00 1\uB144\uAC04 \uC0AC\uC6A9\uD560 \uC5D0\uB108\uC9C0\uB97C \uCDA9\uB2F9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    },
    {
      title: "\u26CF\uFE0F \uCC9C\uBB38\uD559\uC801\uC778 \uCC44\uAD74 \uBC0F \uC6B4\uC1A1 \uBE44\uC6A9",
      desc: "\uB2EC \uD45C\uBA74\uC758 \uD759 150\uD1A4\uC744 \uC12D\uC528 600\uB3C4 \uC774\uC0C1\uC73C\uB85C \uAC00\uC5F4\uD574\uC57C 1g\uC744 \uC5BB\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uADF9\uD55C\uC758 \uC815\uC81C \uACFC\uC815\uACFC \uC6B0\uC8FC \uC6B4\uC1A1 \uBE44\uC6A9\uC774 \uAC00\uACA9\uC744 \uCC9C\uC815\uBD80\uC9C0\uB85C \uB9CC\uB4ED\uB2C8\uB2E4."
    }
  ];
  for (let i = 0; i < he3Details.length; i++) {
    const item = he3Details[i];
    const card = AppHelper.createUIElement("div", `he3Card_${i}`, {
      flex: "1",
      minWidth: "220px",
      backgroundColor: "rgba(10, 20, 40, 0.5)",
      padding: "1.5%",
      borderRadius: "8px",
      borderLeft: "3px solid #a0c0ff",
      marginBottom: "1%",
      boxSizing: "border-box"
    });
    const cTitle = AppHelper.createUIElement(
      "div",
      "",
      {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: "4%"
      },
      item.title
    );
    card.appendChild(cTitle);
    const cDesc = AppHelper.createUIElement(
      "div",
      "",
      {
        fontSize: "13px",
        color: "#c0d8ff",
        lineHeight: "1.5"
      },
      item.desc
    );
    card.appendChild(cDesc);
    he3Grid.appendChild(card);
  }
  const actionPanel = AppHelper.createUIElement("div", "moonAction", {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(20, 30, 60, 0.6)",
    borderRadius: "12px",
    padding: "3%",
    border: "1px solid rgba(100, 150, 255, 0.3)",
    boxSizing: "border-box",
    pointerEvents: "auto",
    flexShrink: "0"
  });
  overlay.appendChild(actionPanel);
  const actionBtn = AppHelper.createUIElement(
    "div",
    "moonActionBtn",
    {
      padding: "1.5% 4%",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(255, 180, 50, 0.8)",
      borderRadius: "12px",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(255, 180, 50, 0.4)",
      border: "2px solid rgba(255, 200, 100, 0.8)",
      pointerEvents: "auto",
      textAlign: "center",
      boxSizing: "border-box",
      marginBottom: "2%"
    },
    st.moonActionBtnLabel || "\u{1F680} \uB2EC \uD45C\uBA74 \uAC00\uC0C1 \uCC44\uAD74 \uAE30\uC9C0 \uAC74\uC124",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          const el = document.getElementById("moonActionBtn");
          if (el) {
            el.innerText = st.moonActionBtnComplete || "\u2705 \uAE30\uC9C0 \uAC74\uC124 \uC644\uB8CC! (\uCC44\uAD74 \uB370\uC774\uD130 \uBD84\uC11D \uC911...)";
            el.style.backgroundColor = "rgba(50, 200, 100, 0.8)";
            el.style.borderColor = "rgba(100, 255, 150, 0.8)";
            el.style.boxShadow = "0 4px 15px rgba(50, 200, 100, 0.4)";
            el.style.pointerEvents = "none";
          }
        }
      }
    ]
  );
  actionPanel.appendChild(actionBtn);
  const backBtn = AppHelper.createUIElement(
    "div",
    "moonBackBtn",
    {
      padding: "1% 3%",
      fontSize: "14px",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "1px solid rgba(200, 100, 100, 0.5)"
    },
    st.moonBackBtnLabel || "\uC9C0\uAD6C\uB85C \uADC0\uD658\uD558\uAE30",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          currentState = 2 /* GLOBE */;
          moonOrbitAngle = 0;
          showGlobeUI();
        }
      }
    ]
  );
  actionPanel.appendChild(backBtn);
}
function drawMoon(c, isTransition = false) {
  if (!moonProjected || !textData || moonProjected.radius <= 0) return;
  const proj = moonProjected;
  const st = textData;
  const r = Math.max(0.1, proj.radius);
  const time = titleAnimTime;
  const hoverScale = hoveredMoon && !isTransition ? 1.3 : 1;
  const pulse = 1 + 0.1 * Math.sin(time * 4);
  const glowR = r * 1.6 * hoverScale * pulse;
  const glow = c.createRadialGradient(proj.x, proj.y, r, proj.x, proj.y, glowR);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.5)");
  glow.addColorStop(0.4, "rgba(255, 230, 150, 0.2)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  c.beginPath();
  c.arc(proj.x, proj.y, glowR, 0, Math.PI * 2);
  c.fillStyle = glow;
  c.fill();
  c.save();
  c.translate(proj.x, proj.y);
  c.rotate(time * 0.5);
  c.strokeStyle = hoveredMoon ? "rgba(255, 230, 150, 0.8)" : "rgba(255, 230, 150, 0.4)";
  c.lineWidth = hoveredMoon ? 2 : 1.5;
  c.setLineDash([10, 15, 5, 10]);
  c.beginPath();
  c.arc(0, 0, r * 1.8 * hoverScale, 0, Math.PI * 2);
  c.stroke();
  c.rotate(-time * 0.8);
  c.strokeStyle = hoveredMoon ? "rgba(100, 200, 255, 0.6)" : "rgba(100, 200, 255, 0.3)";
  c.lineWidth = 1;
  c.setLineDash([5, 20]);
  c.beginPath();
  c.arc(0, 0, r * 2.2 * hoverScale, 0, Math.PI * 2);
  c.stroke();
  const particleCount = 8;
  for (let i = 0; i < particleCount; i++) {
    const angle = i / particleCount * Math.PI * 2 + time * 0.8;
    const distance = r * 1.5 * hoverScale + Math.sin(time * 3 + i) * r * 0.4;
    const px2 = Math.cos(angle) * distance;
    const py = Math.sin(angle) * distance;
    const pSize = 1.5 + Math.sin(time * 8 + i) * 1;
    c.beginPath();
    c.arc(px2, py, Math.max(0.1, pSize), 0, Math.PI * 2);
    c.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.6 * Math.sin(time * 5 + i)})`;
    c.fill();
  }
  c.restore();
  const grad = c.createRadialGradient(proj.x - r * 0.3, proj.y - r * 0.3, 0, proj.x, proj.y, r);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.6, "#a0a0a0");
  grad.addColorStop(1, "#303030");
  c.beginPath();
  c.arc(proj.x, proj.y, r, 0, Math.PI * 2);
  c.fillStyle = grad;
  c.fill();
  c.fillStyle = "rgba(0,0,0,0.15)";
  c.beginPath();
  c.arc(proj.x - r * 0.2, proj.y - r * 0.1, r * 0.2, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(proj.x + r * 0.3, proj.y + r * 0.2, r * 0.15, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(proj.x - r * 0.1, proj.y + r * 0.4, r * 0.25, 0, Math.PI * 2);
  c.fill();
  if (hoveredMoon && !isTransition || isTransition) {
    const textYOffset = isTransition ? r * 1.5 + 10 : r + 15 + Math.sin(time * 6) * 4;
    c.font = `bold ${Math.max(12, r * 0.4)}px sans-serif`;
    c.textAlign = "center";
    c.textBaseline = "bottom";
    c.fillStyle = "#ffe66d";
    c.shadowColor = "rgba(0,0,0,0.9)";
    c.shadowBlur = 6;
    c.fillText(st.moonHoverText || "\u{1F315} \uB2EC \uD0D0\uC0AC", proj.x, proj.y - textYOffset);
    c.shadowBlur = 0;
  }
}
function calculateMoon(cx, cy) {
  if (!appData) return;
  const scaledGlobeRadius = appData.globeRadius * zoomLevel;
  const orbitRadius = scaledGlobeRadius * 1.6;
  const moonBaseRadius = scaledGlobeRadius * 0.12;
  let pt = {
    x: Math.cos(moonOrbitAngle) * orbitRadius,
    y: Math.sin(moonOrbitAngle * 1.5) * 40 * zoomLevel,
    z: Math.sin(moonOrbitAngle) * orbitRadius
  };
  pt = rotateX(pt, globeRotation.rotX);
  const fov = 800;
  const perspective = fov / (fov + pt.z);
  moonProjected = {
    x: cx + pt.x * perspective,
    y: cy + pt.y * perspective,
    radius: moonBaseRadius * perspective,
    visible: pt.z < scaledGlobeRadius * 0.8,
    z: pt.z
  };
}
function showResourceSummaryPanel(res) {
  if (!textData || !uiLayer) return;
  const st = textData;
  const resName = textData.resourceNames[res.id] || res.id;
  const panel = AppHelper.createUIElement("div", "resSummaryPanel", {
    position: "absolute",
    left: "50%",
    bottom: "2%",
    transform: "translateX(-50%)",
    width: "75%",
    minWidth: "320px",
    maxWidth: "1000px",
    backgroundColor: "rgba(10, 20, 50, 0.95)",
    borderRadius: "12px",
    padding: "1.5% 2%",
    border: `2px solid ${res.color}80`,
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: "50",
    boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 15px ${res.color}40`,
    boxSizing: "border-box"
  });
  uiLayer.appendChild(panel);
  activeUIElements.push(panel);
  const headerRow = AppHelper.createUIElement("div", "resSumHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  panel.appendChild(headerRow);
  const title = AppHelper.createUIElement(
    "div",
    "resSumTitle",
    {
      fontSize: "16px",
      fontWeight: "bold",
      color: res.color,
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u25CF ${resName} \u2014 ${st.resSumInfoTitle || "\uC8FC\uC694 \uD0C0\uACA9 \uB300\uC0C1 \uC815\uBCF4"}`
  );
  headerRow.appendChild(title);
  const btnGroup = AppHelper.createUIElement("div", "resSumBtnGroup", {
    display: "flex",
    gap: "8px",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  headerRow.appendChild(btnGroup);
  const detailBtn = AppHelper.createUIElement(
    "div",
    "resSumDetailBtn",
    {
      padding: "6px 14px",
      fontSize: "13px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(60, 140, 255, 0.8)",
      borderRadius: "6px",
      cursor: "pointer",
      boxSizing: "border-box",
      pointerEvents: "auto",
      border: "1px solid rgba(100, 180, 255, 0.6)"
    },
    `\u2139 ${textData.resourceInfoBtn || "\uC0C1\uC138 \uC815\uBCF4 \uC804\uCCB4\uBCF4\uAE30"}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          detailResourceId = res.id;
          currentResourceDetailTab = "info" /* INFO */;
          showResourceDetail = true;
          showResourceDetailOverlay();
        }
      }
    ]
  );
  btnGroup.appendChild(detailBtn);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "resSumCloseBtn",
    {
      padding: "6px 14px",
      fontSize: "13px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.8)",
      borderRadius: "6px",
      cursor: "pointer",
      boxSizing: "border-box",
      pointerEvents: "auto",
      border: "1px solid rgba(200, 100, 100, 0.6)"
    },
    `\u2715 ${textData.closeBtn || "\uB2EB\uAE30"}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          const el = document.getElementById("resSummaryPanel");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
            const idx = activeUIElements.indexOf(el);
            if (idx >= 0) activeUIElements.splice(idx, 1);
          }
        }
      }
    ]
  );
  btnGroup.appendChild(closeBtn);
  const contentRow = AppHelper.createUIElement("div", "resSumContent", {
    display: "flex",
    gap: "2%",
    flexWrap: "wrap",
    boxSizing: "border-box",
    pointerEvents: "none",
    alignItems: "stretch"
  });
  panel.appendChild(contentRow);
  if (res.vulnerableCountries && res.vulnerableCountries.length > 0) {
    const countryCol = AppHelper.createUIElement("div", "resSumCountryCol", {
      flex: "1",
      minWidth: "150px",
      backgroundColor: "rgba(60, 20, 20, 0.4)",
      padding: "1.5%",
      borderRadius: "8px",
      borderLeft: "4px solid #ff6b6b",
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    contentRow.appendChild(countryCol);
    const cTitle = AppHelper.createUIElement(
      "div",
      "resSumCTitle",
      {
        fontSize: "14px",
        color: "#ff6b6b",
        fontWeight: "bold",
        marginBottom: "8px",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u26A0\uFE0F ${st.resVulnerableCountriesTitle || "\uC218\uAE09 \uBB38\uC81C \uC2DC \uD0C0\uACA9 \uC785\uB294 \uAD6D\uAC00"}`
    );
    countryCol.appendChild(cTitle);
    const cList = AppHelper.createUIElement(
      "div",
      "resSumCList",
      {
        fontSize: "13px",
        color: "#ffffff",
        lineHeight: "1.6",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      res.vulnerableCountries.join(", ")
    );
    countryCol.appendChild(cList);
  }
  if (res.vulnerableCompanies && res.vulnerableCompanies.length > 0) {
    const compCol = AppHelper.createUIElement("div", "resSumCompCol", {
      flex: "1",
      minWidth: "150px",
      backgroundColor: "rgba(60, 40, 20, 0.4)",
      padding: "1.5%",
      borderRadius: "8px",
      borderLeft: "4px solid #ff9a76",
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    contentRow.appendChild(compCol);
    const coTitle = AppHelper.createUIElement(
      "div",
      "resSumCoTitle",
      {
        fontSize: "14px",
        color: "#ff9a76",
        fontWeight: "bold",
        marginBottom: "8px",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u{1F3E2} ${st.resVulnerableCompaniesTitle || "\uC218\uAE09 \uBB38\uC81C \uC2DC \uD0C0\uACA9 \uC785\uB294 \uAE30\uC5C5"}`
    );
    compCol.appendChild(coTitle);
    const coList = AppHelper.createUIElement(
      "div",
      "resSumCoList",
      {
        fontSize: "13px",
        color: "#ffecd2",
        lineHeight: "1.6",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      res.vulnerableCompanies.join(", ")
    );
    compCol.appendChild(coList);
  }
  const reasonTextStr = st.vulnerableReasons && st.vulnerableReasons[res.id] || "\uD574\uB2F9 \uC790\uC6D0\uC740 \uC18C\uC218 \uAD6D\uAC00\uC5D0 \uB9E4\uC7A5 \uBC0F \uC0DD\uC0B0\uC774 \uC9D1\uC911\uB418\uC5B4 \uC788\uC5B4 \uC218\uAE09 \uBB38\uC81C \uBC1C\uC0DD \uC2DC \uAD00\uB828 \uAE00\uB85C\uBC8C \uACF5\uAE09\uB9DD\uC5D0 \uC2EC\uAC01\uD55C \uCC28\uC9C8\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4.";
  const reasonCol = AppHelper.createUIElement("div", "resSumReasonCol", {
    flex: "1.2",
    minWidth: "200px",
    backgroundColor: "rgba(226, 232, 240, 0.95)",
    color: "#0f172a",
    padding: "1.5% 2%",
    borderRadius: "16px 16px 16px 2px",
    boxSizing: "border-box",
    pointerEvents: "auto",
    border: `2px solid ${res.color}cc`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "2px 4px 12px rgba(0,0,0,0.5)",
    marginLeft: "1%",
    position: "relative"
  });
  contentRow.appendChild(reasonCol);
  const reasonBubbleTitle = AppHelper.createUIElement(
    "div",
    "resSumReasonTitle",
    {
      fontSize: "13px",
      fontWeight: "bold",
      color: "#334155",
      marginBottom: "6px",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    "\u{1F4AC} \uD0C0\uACA9 \uBC1C\uC0DD \uC6D0\uC778"
  );
  reasonCol.appendChild(reasonBubbleTitle);
  const reasonBubbleText = AppHelper.createUIElement(
    "div",
    "resSumReasonText",
    {
      fontSize: "13px",
      color: "#0f172a",
      lineHeight: "1.5",
      boxSizing: "border-box",
      pointerEvents: "none",
      fontWeight: "bold"
    },
    reasonTextStr
  );
  reasonCol.appendChild(reasonBubbleText);
}
function generateResourceAnalogies(resourceId) {
  if (!appData || !textData) return [];
  const st = textData;
  const res = appData.resources.find((r) => r.id === resourceId);
  if (!res) return [];
  const resName = textData.resourceNames[resourceId] || resourceId;
  let totalProd = 0;
  let topCountryId = "";
  let topCountryProd = 0;
  let totalReserves = 0;
  for (const c of appData.countries) {
    for (const cr of c.resources) {
      if (cr.resourceId === resourceId) {
        totalProd += cr.production;
        totalReserves += cr.reserves;
        if (cr.production > topCountryProd) {
          topCountryProd = cr.production;
          topCountryId = c.id;
        }
      }
    }
  }
  const topCountryName = textData.countryNames[topCountryId] || topCountryId;
  const topCountryShare = totalProd > 0 ? (topCountryProd / totalProd * 100).toFixed(1) : "0";
  const priceHist = appData.priceHistory.find((p) => p.resourceId === resourceId);
  const latestPrice = priceHist && priceHist.data.length > 0 ? priceHist.data[priceHist.data.length - 1].price : 0;
  const analogies = [];
  const analogyData = {
    tungsten: {
      weightAnalogy: (st.analogyTungstenWeight || "\uC804 \uC138\uACC4\uC5D0\uC11C 1\uB144\uAC04 \uC0DD\uC0B0\uB418\uB294 \uD145\uC2A4\uD150({total}\uD1A4)\uC740 \uB300\uD615 \uD2B8\uB7ED \uC57D {trucks}\uB300\uC5D0 \uC2E4\uC744 \uC218 \uC788\uB294 \uC591\uC785\uB2C8\uB2E4. \uC0DD\uAC01\uBCF4\uB2E4 \uC801\uC8E0?").replace("{total}", totalProd.toLocaleString()).replace("{trucks}", Math.round(totalProd / 10).toLocaleString()),
      priceAnalogy: (st.analogyTungstenPrice || "\uD145\uC2A4\uD150 1kg\uC758 \uAC00\uACA9\uC740 \uC57D \uACE0\uAE09 \uB808\uC2A4\uD1A0\uB791 \uCF54\uC2A4 \uC694\uB9AC {meals}\uC778\uBD84\uC5D0 \uD574\uB2F9\uD569\uB2C8\uB2E4.").replace("{meals}", Math.round(latestPrice * 10 / 80).toLocaleString()),
      scarcityAnalogy: st.analogyTungstenScarcity || "\uD145\uC2A4\uD150\uC740 \uC9C0\uAD6C \uC9C0\uAC01\uC5D0\uC11C \uCC28\uC9C0\uD558\uB294 \uBE44\uC728\uC774 0.00011%\uC5D0 \uBD88\uACFC\uD569\uB2C8\uB2E4. \uC62C\uB9BC\uD53D \uC218\uC601\uC7A5\uC5D0 \uBAA8\uB798\uC54C \uD558\uB098\uB97C \uB123\uC740 \uAC83\uACFC \uBE44\uC2B7\uD55C \uBE44\uC728\uC774\uC5D0\uC694.",
      usageAnalogy: st.analogyTungstenUsage || "\uC5EC\uB7EC\uBD84\uC774 \uC0AC\uC6A9\uD558\uB294 \uC2A4\uB9C8\uD2B8\uD3F0 \uC548\uC758 \uBC18\uB3C4\uCCB4 \uD68C\uB85C\uC5D0\uB3C4 \uD145\uC2A4\uD150\uC774 \uB4E4\uC5B4\uAC11\uB2C8\uB2E4. \uC2A4\uB9C8\uD2B8\uD3F0 1\uB300\uB2F9 \uC57D 0.05g\uC774\uC9C0\uB9CC, \uC804 \uC138\uACC4 \uC5F0\uAC04 \uC2A4\uB9C8\uD2B8\uD3F0 \uC0DD\uC0B0\uB7C9\uC744 \uACE0\uB824\uD558\uBA74 \uC218\uBC31 \uD1A4\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.",
      reserveAnalogy: (st.analogyTungstenReserve || "\uC804 \uC138\uACC4 \uD145\uC2A4\uD150 \uB9E4\uC7A5\uB7C9({reserves}\uD1A4)\uC740 \uD604\uC7AC \uC0DD\uC0B0 \uC18D\uB3C4\uB85C \uC57D {years}\uB144\uAC04 \uC0AC\uC6A9\uD560 \uC218 \uC788\uB294 \uC591\uC785\uB2C8\uB2E4. \uC6B0\uB9AC \uC190\uC8FC \uC138\uB300\uAE4C\uC9C0\uB294 \uBC84\uD2F8 \uC218 \uC788\uC744\uAE4C\uC694?").replace("{reserves}", totalReserves.toLocaleString()).replace("{years}", totalProd > 0 ? Math.round(totalReserves / totalProd).toString() : "?"),
      dominanceAnalogy: (st.analogyTungstenDominance || "{country}\uC758 \uD145\uC2A4\uD150 \uC810\uC720\uC728({share}%)\uC744 \uD559\uAD50 \uAD50\uC2E4\uB85C \uBE44\uC720\uD558\uBA74, 40\uBA85\uC758 \uD559\uC0DD \uC911 {students}\uBA85\uC774 {country} \uD559\uC0DD\uC778 \uC148\uC785\uB2C8\uB2E4.").replace(/\{country\}/g, topCountryName).replace("{share}", topCountryShare).replace("{students}", Math.round(parseFloat(topCountryShare) * 0.4).toString())
    },
    rare_earth: {
      weightAnalogy: (st.analogyRareEarthWeight || "\uC804 \uC138\uACC4 \uC5F0\uAC04 \uD76C\uD1A0\uB958 \uC0DD\uC0B0\uB7C9({total}\uD1A4)\uC740 \uB300\uD615 \uD654\uBB3C\uC120 1\uCC99\uC758 \uC801\uC7AC\uB7C9\uC5D0\uB3C4 \uBBF8\uCE58\uC9C0 \uBABB\uD569\uB2C8\uB2E4. \uD558\uC9C0\uB9CC \uC774\uAC83\uC73C\uB85C \uC218\uC5B5 \uB300\uC758 \uC804\uC790\uAE30\uAE30\uAC00 \uB9CC\uB4E4\uC5B4\uC9D1\uB2C8\uB2E4.").replace("{total}", totalProd.toLocaleString()),
      priceAnalogy: (st.analogyRareEarthPrice || "\uB124\uC624\uB514\uBBB4(\uD76C\uD1A0\uB958 \uD575\uC2EC \uC6D0\uC18C) 1kg \uAC00\uACA9\uC740 \uC57D {price}\uC6D0\uC73C\uB85C, \uBC30\uB2EC \uCE58\uD0A8 \uC57D {chickens}\uB9C8\uB9AC \uAC00\uACA9\uC785\uB2C8\uB2E4. \uD558\uC9C0\uB9CC 1kg\uC73C\uB85C \uC804\uAE30\uCC28 \uBAA8\uD130 \uC218\uC2ED \uAC1C\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC5B4\uC694!").replace("{price}", (latestPrice * 1350).toLocaleString()).replace("{chickens}", Math.round(latestPrice * 1350 / 2e4).toString()),
      scarcityAnalogy: st.analogyRareEarthScarcity || "'\uD76C\uD1A0\uB958'\uB77C\uB294 \uC774\uB984\uACFC \uB2EC\uB9AC \uC9C0\uAC01\uC5D0 \uAF64 \uC874\uC7AC\uD558\uC9C0\uB9CC, \uACBD\uC81C\uC801\uC73C\uB85C \uCC44\uAD74 \uAC00\uB2A5\uD55C \uACF3\uC774 \uADF9\uD788 \uC801\uC2B5\uB2C8\uB2E4. \uBC14\uB2E4\uC5D0 \uBB3C\uC740 \uB9CE\uC9C0\uB9CC \uB9C8\uC2E4 \uC218 \uC788\uB294 \uAE68\uB057\uD55C \uBB3C\uC774 \uC801\uC740 \uAC83\uACFC \uBE44\uC2B7\uD574\uC694.",
      usageAnalogy: st.analogyRareEarthUsage || "\uC804\uAE30\uCC28 1\uB300\uC758 \uBAA8\uD130\uC5D0 \uC57D 1~2kg\uC758 \uD76C\uD1A0\uB958 \uC790\uC11D\uC774 \uB4E4\uC5B4\uAC11\uB2C8\uB2E4. 2024\uB144 \uC804 \uC138\uACC4 \uC804\uAE30\uCC28 \uD310\uB9E4\uB7C9\uC774 \uC57D 1,700\uB9CC \uB300\uC774\uB2C8, \uC790\uB3D9\uCC28 \uBAA8\uD130\uB9CC\uC73C\uB85C\uB3C4 \uC218\uB9CC \uD1A4\uC774 \uD544\uC694\uD55C \uC148\uC774\uC5D0\uC694.",
      reserveAnalogy: (st.analogyRareEarthReserve || "\uC804 \uC138\uACC4 \uD76C\uD1A0\uB958 \uB9E4\uC7A5\uB7C9\uC740 \uD604\uC7AC \uC18D\uB3C4\uB85C \uC57D {years}\uB144\uAC04 \uCC44\uAD74 \uAC00\uB2A5\uD569\uB2C8\uB2E4. \uD558\uC9C0\uB9CC \uC804\uAE30\uCC28\uC640 \uD48D\uB825\uBC1C\uC804 \uC218\uC694\uAC00 \uAE09\uC99D\uD558\uBA74 \uC774 \uAE30\uAC04\uC740 \uD06C\uAC8C \uC904\uC5B4\uB4E4 \uC218 \uC788\uC5B4\uC694.").replace("{years}", totalProd > 0 ? Math.round(totalReserves / totalProd).toString() : "?"),
      dominanceAnalogy: (st.analogyRareEarthDominance || "{country}\uC740 \uD76C\uD1A0\uB958 \uC2DC\uC7A5\uC758 {share}%\uB97C \uC7A5\uC545\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uC774\uB294 \uB9C8\uCE58 \uD55C \uBC18\uC758 \uAE09\uC2DD\uC744 \uD55C \uBA85\uC758 \uD559\uC0DD\uC774 \uAC70\uC758 \uB2E4 \uB098\uB220\uC8FC\uB294 \uAC83\uACFC \uAC19\uC740 \uC0C1\uD669\uC774\uC5D0\uC694.").replace(/\{country\}/g, topCountryName).replace("{share}", topCountryShare)
    },
    lithium: {
      weightAnalogy: (st.analogyLithiumWeight || "\uC804 \uC138\uACC4 \uC5F0\uAC04 \uB9AC\uD2AC \uC0DD\uC0B0\uB7C9({total}\uD1A4)\uC740 \uC62C\uB9BC\uD53D \uC218\uC601\uC7A5 \uC57D {pools}\uAC1C\uB97C \uCC44\uC6B8 \uC218 \uC788\uB294 \uBB34\uAC8C\uC785\uB2C8\uB2E4. \uC774\uAC83\uC73C\uB85C \uC57D {evs}\uB9CC \uB300\uC758 \uC804\uAE30\uCC28 \uBC30\uD130\uB9AC\uB97C \uB9CC\uB4ED\uB2C8\uB2E4.").replace("{total}", totalProd.toLocaleString()).replace("{pools}", Math.round(totalProd / 2500).toString()).replace("{evs}", Math.round(totalProd / 8 / 1e4).toString()),
      priceAnalogy: (st.analogyLithiumPrice || "\uD0C4\uC0B0\uB9AC\uD2AC 1kg \uAC00\uACA9\uC740 \uC57D {won}\uC6D0\uC73C\uB85C, \uCEE4\uD53C \uC804\uBB38\uC810 \uC544\uBA54\uB9AC\uCE74\uB178 \uC57D {coffees}\uC794 \uAC00\uACA9\uC785\uB2C8\uB2E4. \uC804\uAE30\uCC28 1\uB300\uC5D0 \uB4E4\uC5B4\uAC00\uB294 \uB9AC\uD2AC \uBE44\uC6A9\uC740 \uC57D {carCost}\uB9CC\uC6D0\uC774\uC5D0\uC694.").replace("{won}", Math.round(latestPrice * 1.35).toLocaleString()).replace("{coffees}", Math.round(latestPrice * 1.35 / 4500).toString()).replace("{carCost}", Math.round(latestPrice * 8 * 1.35 / 1e4).toString()),
      scarcityAnalogy: st.analogyLithiumScarcity || "\uB9AC\uD2AC\uC740 \uC9C0\uAD6C\uC5D0 \uD48D\uBD80\uD558\uC9C0\uB9CC \uB18D\uB3C4\uAC00 \uB0AE\uC544 \uCC44\uAD74\uC774 \uC5B4\uB835\uC2B5\uB2C8\uB2E4. \uBC14\uB2F7\uBB3C\uC5D0\uB3C4 \uB9AC\uD2AC\uC774 \uC788\uC9C0\uB9CC, \uC18C\uAE08\uBB3C\uC5D0\uC11C \uC124\uD0D5\uC744 \uACE8\uB77C\uB0B4\uB294 \uAC83\uCC98\uB7FC \uBD84\uB9AC\uAC00 \uAE4C\uB2E4\uB85C\uC6CC\uC694.",
      usageAnalogy: st.analogyLithiumUsage || "\uC5EC\uB7EC\uBD84\uC758 \uC2A4\uB9C8\uD2B8\uD3F0 \uBC30\uD130\uB9AC\uC5D0 \uC57D 1~3g\uC758 \uB9AC\uD2AC\uC774 \uB4E4\uC5B4\uAC11\uB2C8\uB2E4. \uC804\uAE30\uCC28\uC5D0\uB294 \uC57D 8~12kg\uC774 \uD544\uC694\uD558\uB2C8, \uC2A4\uB9C8\uD2B8\uD3F0 \uC57D 4,000\uB300\uBD84\uC758 \uB9AC\uD2AC\uC774 \uC790\uB3D9\uCC28 1\uB300\uC5D0 \uC4F0\uC774\uB294 \uC148\uC774\uC5D0\uC694!",
      reserveAnalogy: (st.analogyLithiumReserve || "\uC804 \uC138\uACC4 \uB9AC\uD2AC \uB9E4\uC7A5\uB7C9({reserves}\uD1A4)\uC744 \uC804\uAE30\uCC28\uB85C \uD658\uC0B0\uD558\uBA74 \uC57D {evs}\uC5B5 \uB300\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB9CE\uC544 \uBCF4\uC774\uC9C0\uB9CC, \uC804 \uC138\uACC4 \uC790\uB3D9\uCC28\uAC00 14\uC5B5 \uB300\uC778 \uAC78 \uC0DD\uAC01\uD558\uBA74 \uC5EC\uC720\uB86D\uC9C0 \uC54A\uC544\uC694.").replace("{reserves}", totalReserves.toLocaleString()).replace("{evs}", (totalReserves / 8 / 1e8).toFixed(1)),
      dominanceAnalogy: st.analogyLithiumDominance || "'\uB9AC\uD2AC \uC0BC\uAC01\uC9C0\uB300'(\uCE60\uB808\xB7\uC544\uB974\uD5E8\uD2F0\uB098\xB7\uBCFC\uB9AC\uBE44\uC544)\uC5D0 \uC804 \uC138\uACC4 \uB9E4\uC7A5\uB7C9\uC758 \uC57D 60%\uAC00 \uBAB0\uB824 \uC788\uC2B5\uB2C8\uB2E4. \uB9C8\uCE58 \uC138\uACC4\uC758 \uBB3C\uC774 \uD2B9\uC815 \uC138 \uB098\uB77C\uC5D0\uB9CC \uC9D1\uC911\uB41C \uAC83\uACFC \uBE44\uC2B7\uD55C \uC0C1\uD669\uC774\uC5D0\uC694."
    },
    cobalt: {
      weightAnalogy: (st.analogyCobaltWeight || "\uC804 \uC138\uACC4 \uC5F0\uAC04 \uCF54\uBC1C\uD2B8 \uC0DD\uC0B0\uB7C9({total}\uD1A4)\uC740 \uB300\uD615 \uC5EC\uAC1D\uAE30(\uBCF4\uC789 747) \uC57D {planes}\uB300 \uBB34\uAC8C\uC5D0 \uD574\uB2F9\uD569\uB2C8\uB2E4.").replace("{total}", totalProd.toLocaleString()).replace("{planes}", Math.round(totalProd / 180).toString()),
      priceAnalogy: (st.analogyCobaltPrice || "\uCF54\uBC1C\uD2B8 1kg \uAC00\uACA9\uC740 \uC57D {won}\uC6D0\uC73C\uB85C, \uD3B8\uC758\uC810 \uC0BC\uAC01\uAE40\uBC25 \uC57D {gimbap}\uAC1C\uB97C \uC0B4 \uC218 \uC788\uB294 \uAE08\uC561\uC785\uB2C8\uB2E4.").replace("{won}", Math.round(latestPrice * 1.35).toLocaleString()).replace("{gimbap}", Math.round(latestPrice * 1.35 / 1500).toString()),
      scarcityAnalogy: st.analogyCobaltScarcity || "\uCF54\uBC1C\uD2B8\uC758 \uC57D 70%\uAC00 \uCF69\uACE0\uBBFC\uC8FC\uACF5\uD654\uAD6D \uD55C \uB098\uB77C\uC5D0\uC11C \uC0DD\uC0B0\uB429\uB2C8\uB2E4. \uC774\uB294 \uC804 \uC138\uACC4 \uC0AC\uACFC\uC758 70%\uAC00 \uD55C \uB18D\uC7A5\uC5D0\uC11C\uB9CC \uC7AC\uBC30\uB418\uB294 \uAC83\uACFC \uAC19\uC740 \uADF9\uB2E8\uC801 \uC9D1\uC911\uC774\uC5D0\uC694.",
      usageAnalogy: st.analogyCobaltUsage || "\uC804\uAE30\uCC28 \uBC30\uD130\uB9AC 1\uAC1C\uC5D0 \uC57D 5~10kg\uC758 \uCF54\uBC1C\uD2B8\uAC00 \uB4E4\uC5B4\uAC11\uB2C8\uB2E4. \uC2A4\uB9C8\uD2B8\uD3F0 \uBC30\uD130\uB9AC\uC5D0\uB3C4 \uC57D 5~10g\uC774 \uC0AC\uC6A9\uB418\uC5B4, \uC6B0\uB9AC \uC8FC\uBA38\uB2C8 \uC18D\uC5D0\uB3C4 \uCF69\uACE0\uC758 \uAD11\uBB3C\uC774 \uB4E4\uC5B4\uC788\uB294 \uC148\uC774\uC5D0\uC694.",
      reserveAnalogy: (st.analogyCobaltReserve || "\uD604\uC7AC \uCF54\uBC1C\uD2B8 \uB9E4\uC7A5\uB7C9\uC73C\uB85C \uC57D {years}\uB144\uAC04 \uC0DD\uC0B0\uD560 \uC218 \uC788\uC9C0\uB9CC, \uC804\uAE30\uCC28 \uC218\uC694 \uAE09\uC99D \uC2DC \uC774 \uAE30\uAC04\uC740 \uD06C\uAC8C \uB2E8\uCD95\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4.").replace("{years}", totalProd > 0 ? Math.round(totalReserves / totalProd).toString() : "?"),
      dominanceAnalogy: st.analogyCobaltDominance || "\uCF69\uACE0\uBBFC\uC8FC\uACF5\uD654\uAD6D\uC758 \uCF54\uBC1C\uD2B8 \uC810\uC720\uC728\uC740 \uD55C \uB098\uB77C\uAC00 \uC804 \uC138\uACC4 \uCEE4\uD53C \uC0DD\uC0B0\uC744 \uAC70\uC758 \uB3C5\uC810\uD558\uB294 \uAC83\uACFC \uBE44\uC2B7\uD55C \uC218\uC900\uC758 \uC9D1\uC911\uB3C4\uC785\uB2C8\uB2E4."
    },
    copper: {
      weightAnalogy: (st.analogyCopperWeight || "\uC804 \uC138\uACC4 \uC5F0\uAC04 \uAD6C\uB9AC \uC0DD\uC0B0\uB7C9({total}\uCC9C\uD1A4, \uC57D {mil}\uBC31\uB9CC\uD1A4)\uC740 \uC5D0\uD3A0\uD0D1(7,300\uD1A4) \uC57D {eiffels}\uAC1C\uB97C \uB9CC\uB4E4 \uC218 \uC788\uB294 \uC591\uC785\uB2C8\uB2E4!").replace("{total}", totalProd.toLocaleString()).replace("{mil}", (totalProd / 1e3).toFixed(1)).replace("{eiffels}", Math.round(totalProd * 1e3 / 7300).toLocaleString()),
      priceAnalogy: (st.analogyCopperPrice || "\uAD6C\uB9AC 1\uD1A4\uC758 \uAC00\uACA9\uC740 \uC57D {won}\uB9CC\uC6D0\uC73C\uB85C, \uC18C\uD615\uCC28 1\uB300 \uAC00\uACA9\uACFC \uBE44\uC2B7\uD569\uB2C8\uB2E4. \uC804\uAE30\uCC28\uC5D0\uB294 \uC77C\uBC18 \uC790\uB3D9\uCC28\uBCF4\uB2E4 \uC57D 4\uBC30 \uB9CE\uC740 \uAD6C\uB9AC\uAC00 \uB4E4\uC5B4\uAC00\uC694.").replace("{won}", Math.round(latestPrice * 1350 / 1e4).toString()),
      scarcityAnalogy: st.analogyCopperScarcity || "\uAD6C\uB9AC\uB294 100% \uC7AC\uD65C\uC6A9\uC774 \uAC00\uB2A5\uD55C \uAE08\uC18D\uC785\uB2C8\uB2E4. \uC9C0\uAE08 \uC0AC\uC6A9 \uC911\uC778 \uAD6C\uB9AC \uB3D9\uC804\uC774\uB098 \uC804\uC120 \uC18D \uAD6C\uB9AC\uAC00 \uC218\uCC9C \uB144 \uC804 \uAD11\uC0B0\uC5D0\uC11C \uCE90\uB0B8 \uAC83\uC77C \uC218\uB3C4 \uC788\uC5B4\uC694!",
      usageAnalogy: st.analogyCopperUsage || "\uC77C\uBC18 \uC8FC\uD0DD \uD55C \uCC44\uC5D0 \uC57D 200kg\uC758 \uAD6C\uB9AC\uAC00 \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uC804\uAE30\uCC28 1\uB300\uC5D0\uB294 \uC57D 80kg, \uD48D\uB825 \uD130\uBE48 1\uAE30\uC5D0\uB294 \uC57D 4.7\uD1A4\uC774 \uD544\uC694\uD574\uC694. \uC804\uAE30\uD654 \uC2DC\uB300 = \uAD6C\uB9AC \uC2DC\uB300\uC785\uB2C8\uB2E4.",
      reserveAnalogy: (st.analogyCopperReserve || "\uC804 \uC138\uACC4 \uAD6C\uB9AC \uB9E4\uC7A5\uB7C9\uC740 \uC57D {years}\uB144\uAC04 \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC591\uC774\uC9C0\uB9CC, \uC804\uAE30\uD654 \uAC00\uC18D\uC73C\uB85C \uC218\uC694\uAC00 \uB9E4\uB144 \uC99D\uAC00\uD558\uACE0 \uC788\uC5B4 \uC2E4\uC81C\uB85C\uB294 \uB354 \uBE68\uB9AC \uACE0\uAC08\uB420 \uC218 \uC788\uC5B4\uC694.").replace("{years}", totalProd > 0 ? Math.round(totalReserves / totalProd).toString() : "?"),
      dominanceAnalogy: (st.analogyCopperDominance || "\uCE60\uB808\uB294 '\uAD6C\uB9AC\uC758 \uC655\uAD6D'\uC73C\uB85C \uC804 \uC138\uACC4 \uC0DD\uC0B0\uC758 \uC57D {share}%\uB97C \uB2F4\uB2F9\uD569\uB2C8\uB2E4. \uCE60\uB808\uC758 \uAD6C\uB9AC \uAD11\uC0B0 \uD558\uB098\uAC00 \uC791\uC740 \uB3C4\uC2DC \uD06C\uAE30\uB9CC \uD574\uC694.").replace("{share}", topCountryShare)
    },
    nickel: {
      weightAnalogy: (st.analogyNickelWeight || "\uC804 \uC138\uACC4 \uC5F0\uAC04 \uB2C8\uCF08 \uC0DD\uC0B0\uB7C9({total}\uCC9C\uD1A4)\uC740 \uC790\uC720\uC758 \uC5EC\uC2E0\uC0C1(\uC57D 27,000\uD1A4) \uC57D {statues}\uAC1C\uB97C \uB9CC\uB4E4 \uC218 \uC788\uB294 \uC591\uC785\uB2C8\uB2E4.").replace("{total}", totalProd.toLocaleString()).replace("{statues}", Math.round(totalProd * 1e3 / 27e3).toString()),
      priceAnalogy: (st.analogyNickelPrice || "\uB2C8\uCF08 1kg \uAC00\uACA9\uC740 \uC57D {won}\uC6D0\uC73C\uB85C, \uC810\uC2EC \uC2DD\uC0AC \uC57D {meals}\uB07C \uBE44\uC6A9\uC785\uB2C8\uB2E4. \uC6B0\uB9AC\uAC00 \uB9E4\uC77C \uC0AC\uC6A9\uD558\uB294 \uC2A4\uD14C\uC778\uB9AC\uC2A4 \uC218\uC800\uC5D0\uB3C4 \uB2C8\uCF08\uC774 \uC57D 8~10% \uB4E4\uC5B4\uC788\uC5B4\uC694.").replace("{won}", Math.round(latestPrice * 1.35).toLocaleString()).replace("{meals}", Math.round(latestPrice * 1.35 / 9e3).toString()),
      scarcityAnalogy: st.analogyNickelScarcity || "500\uC6D0 \uB3D9\uC804\uC758 \uBC18\uC9DD\uC774\uB294 \uD45C\uBA74\uC774 \uBC14\uB85C \uB2C8\uCF08 \uB3C4\uAE08\uC785\uB2C8\uB2E4. \uC6B0\uB9AC \uC9C0\uAC11 \uC18D\uC5D0 \uAC00\uC7A5 \uAC00\uAE4C\uC774 \uC788\uB294 \uC804\uB7B5 \uAD11\uBB3C\uC774 \uBC14\uB85C \uB2C8\uCF08\uC774\uC5D0\uC694.",
      usageAnalogy: st.analogyNickelUsage || "\uACE0\uB2C8\uCF08 \uBC30\uD130\uB9AC(NMC 811) \uAE30\uC900 \uC804\uAE30\uCC28 1\uB300\uC5D0 \uC57D 40~50kg\uC758 \uB2C8\uCF08\uC774 \uD544\uC694\uD569\uB2C8\uB2E4. \uC2A4\uD14C\uC778\uB9AC\uC2A4 \uB0C4\uBE44 \uC57D 200\uAC1C\uB97C \uB9CC\uB4E4 \uC218 \uC788\uB294 \uC591\uC774\uC5D0\uC694.",
      reserveAnalogy: (st.analogyNickelReserve || "\uC804 \uC138\uACC4 \uB2C8\uCF08 \uB9E4\uC7A5\uB7C9\uC740 \uD604\uC7AC \uC0DD\uC0B0 \uC18D\uB3C4\uB85C \uC57D {years}\uB144\uAC04 \uCC44\uAD74 \uAC00\uB2A5\uD569\uB2C8\uB2E4.").replace("{years}", totalProd > 0 ? Math.round(totalReserves / totalProd).toString() : "?"),
      dominanceAnalogy: (st.analogyNickelDominance || "\uC778\uB3C4\uB124\uC2DC\uC544\uAC00 \uC138\uACC4 \uB2C8\uCF08 \uC0DD\uC0B0\uC758 \uC57D {share}%\uB97C \uCC28\uC9C0\uD569\uB2C8\uB2E4. \uC778\uB3C4\uB124\uC2DC\uC544 \uC815\uBD80\uAC00 \uC6D0\uAD11 \uC218\uCD9C\uC744 \uAE08\uC9C0\uD558\uC790 \uC804 \uC138\uACC4 \uC2A4\uD14C\uC778\uB9AC\uC2A4\uAC15 \uAC00\uACA9\uC774 \uCD9C\uB801\uC600\uC5B4\uC694.").replace("{share}", topCountryShare)
    },
    graphite: {
      weightAnalogy: (st.analogyGraphiteWeight || "\uC804 \uC138\uACC4 \uC5F0\uAC04 \uD751\uC5F0 \uC0DD\uC0B0\uB7C9({total}\uCC9C\uD1A4)\uC740 \uC5F0\uD544\uB85C \uD658\uC0B0\uD558\uBA74 \uC57D {pencils}\uC5B5 \uC790\uB8E8\uB97C \uB9CC\uB4E4 \uC218 \uC788\uB294 \uC591\uC774\uC9C0\uB9CC, \uB300\uBD80\uBD84 \uBC30\uD130\uB9AC\uC5D0 \uC4F0\uC785\uB2C8\uB2E4.").replace("{total}", totalProd.toLocaleString()).replace("{pencils}", Math.round(totalProd * 1e6 / 50 / 1e8).toString()),
      priceAnalogy: (st.analogyGraphitePrice || "\uBC30\uD130\uB9AC\uAE09 \uD751\uC5F0 1\uD1A4 \uAC00\uACA9\uC740 \uC57D {won}\uB9CC\uC6D0\uC73C\uB85C, \uAC19\uC740 \uBB34\uAC8C\uC758 \uC300(\uC57D 200\uB9CC\uC6D0)\uBCF4\uB2E4 {compare} \uC815\uB3C4\uC785\uB2C8\uB2E4.").replace("{won}", Math.round(latestPrice * 1350 / 1e4).toString()).replace("{compare}", latestPrice * 1350 / 1e4 > 200 ? "\uBE44\uC309\uB2C8\uB2E4" : "\uBE44\uC2B7\uD569\uB2C8\uB2E4"),
      scarcityAnalogy: st.analogyGraphiteScarcity || "\uD751\uC5F0\uC740 \uB2E4\uC774\uC544\uBAAC\uB4DC\uC640 \uAC19\uC740 \uD0C4\uC18C\uB85C \uC774\uB8E8\uC5B4\uC838 \uC788\uC9C0\uB9CC, \uC6D0\uC790 \uBC30\uC5F4\uC774 \uB2E4\uB985\uB2C8\uB2E4. \uAC19\uC740 \uC7AC\uB8CC\uC778\uB370 \uC313\uB294 \uBC29\uC2DD\uC5D0 \uB530\uB77C \uC5F0\uD544\uC2EC\uB3C4, \uBCF4\uC11D\uB3C4 \uB418\uB294 \uC148\uC774\uC5D0\uC694!",
      usageAnalogy: st.analogyGraphiteUsage || "\uB9AC\uD2AC\uC774\uC628 \uBC30\uD130\uB9AC\uC5D0\uB294 \uC591\uADF9\uC7AC(\uB9AC\uD2AC)\uBCF4\uB2E4 \uC74C\uADF9\uC7AC(\uD751\uC5F0)\uAC00 \uB354 \uB9CE\uC774 \uB4E4\uC5B4\uAC11\uB2C8\uB2E4. \uC804\uAE30\uCC28 1\uB300\uC5D0 \uC57D 50~100kg\uC758 \uD751\uC5F0\uC774 \uD544\uC694\uD574\uC694. \uC5F0\uD544\uC2EC\uC758 \uB300\uBCC0\uC2E0\uC774\uC8E0!",
      reserveAnalogy: (st.analogyGraphiteReserve || "\uC804 \uC138\uACC4 \uD751\uC5F0 \uB9E4\uC7A5\uB7C9\uC740 \uC57D {reserves}\uCC9C\uD1A4\uC73C\uB85C, \uC218\uBC31 \uB144\uAC04 \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC591\uC785\uB2C8\uB2E4. \uD558\uC9C0\uB9CC \uBC30\uD130\uB9AC\uAE09 \uACE0\uC21C\uB3C4 \uD751\uC5F0\uC740 \uD55C\uC815\uC801\uC774\uC5D0\uC694.").replace("{reserves}", totalReserves.toLocaleString()),
      dominanceAnalogy: st.analogyGraphiteDominance || "\uC911\uAD6D\uC774 \uD751\uC5F0 \uAC00\uACF5\uC758 \uC57D 90%\uB97C \uB2F4\uB2F9\uD569\uB2C8\uB2E4. 2023\uB144 \uC218\uCD9C \uD1B5\uC81C \uBC1C\uD45C\uB85C \uC804 \uC138\uACC4 \uBC30\uD130\uB9AC \uC5C5\uACC4\uAC00 \uAE34\uC7A5\uD588\uC5B4\uC694."
    },
    titanium: {
      weightAnalogy: (st.analogyTitaniumWeight || "\uC804 \uC138\uACC4 \uC5F0\uAC04 \uD2F0\uD0C0\uB284 \uC0DD\uC0B0\uB7C9({total}\uCC9C\uD1A4)\uC73C\uB85C \uBCF4\uC789 787 \uD56D\uACF5\uAE30 \uC57D {planes}\uB300\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4. (787\uC758 \uC57D 15%\uAC00 \uD2F0\uD0C0\uB284)").replace("{total}", totalProd.toLocaleString()).replace("{planes}", Math.round(totalProd * 1e3 / 15).toString()),
      priceAnalogy: (st.analogyTitaniumPrice || "\uC2A4\uD3F0\uC9C0 \uD2F0\uD0C0\uB284 1kg \uAC00\uACA9\uC740 \uC57D {won}\uC6D0\uC73C\uB85C, \uAC19\uC740 \uBB34\uAC8C\uC758 \uCCA0\uAC15(\uC57D 1,000\uC6D0)\uBCF4\uB2E4 \uC57D {times}\uBC30 \uBE44\uC309\uB2C8\uB2E4. \uAC00\uBCBC\uC6C0\uACFC \uAC15\uD568\uC758 \uD504\uB9AC\uBBF8\uC5C4\uC774\uC5D0\uC694.").replace("{won}", Math.round(latestPrice * 1.35).toLocaleString()).replace("{times}", Math.round(latestPrice * 1.35 / 1e3).toString()),
      scarcityAnalogy: st.analogyTitaniumScarcity || "\uD2F0\uD0C0\uB284\uC740 \uC9C0\uAC01\uC5D0\uC11C 9\uBC88\uC9F8\uB85C \uD48D\uBD80\uD55C \uC6D0\uC18C\uC774\uC9C0\uB9CC, \uC21C\uC218 \uAE08\uC18D\uC73C\uB85C \uCD94\uCD9C\uD558\uAE30\uAC00 \uB9E4\uC6B0 \uC5B4\uB835\uC2B5\uB2C8\uB2E4. \uB9C8\uCE58 \uACF5\uAE30 \uC911\uC758 \uAE08\uC744 \uBAA8\uC73C\uB294 \uAC83\uCC98\uB7FC \uBE44\uC6A9\uC774 \uB9CE\uC774 \uB4DC\uB294 \uC791\uC5C5\uC774\uC5D0\uC694.",
      usageAnalogy: st.analogyTitaniumUsage || "\uCE58\uACFC \uC784\uD50C\uB780\uD2B8 1\uAC1C\uC5D0 \uC57D 3~5g\uC758 \uD2F0\uD0C0\uB284\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uC778\uACF5 \uACE0\uAD00\uC808\uC5D0\uB294 \uC57D 200~500g\uC774 \uD544\uC694\uD574\uC694. \uC6B0\uB9AC \uBAB8\uACFC \uAC00\uC7A5 \uCE5C\uD55C \uAE08\uC18D\uC774 \uBC14\uB85C \uD2F0\uD0C0\uB284\uC785\uB2C8\uB2E4.",
      reserveAnalogy: (st.analogyTitaniumReserve || "\uD2F0\uD0C0\uB284 \uB9E4\uC7A5\uB7C9\uC740 \uCDA9\uBD84\uD558\uC9C0\uB9CC, \uAC00\uACF5 \uAE30\uC220\uC774 \uD575\uC2EC\uC785\uB2C8\uB2E4. \uC6D0\uC11D\uC740 \uB9CE\uC544\uB3C4 \uC8FC\uBC29\uC7A5\uC774 \uBD80\uC871\uD55C \uB808\uC2A4\uD1A0\uB791\uACFC \uBE44\uC2B7\uD55C \uC0C1\uD669\uC774\uC5D0\uC694.").replace("{reserves}", totalReserves.toLocaleString()),
      dominanceAnalogy: st.analogyTitaniumDominance || "\uB7EC\uC2DC\uC544\uC758 VSMPO-AVISMA\uB294 \uC138\uACC4 \uCD5C\uB300 \uD2F0\uD0C0\uB284 \uC0DD\uC0B0\uAE30\uC5C5\uC73C\uB85C, \uBCF4\uC789\uACFC \uC5D0\uC5B4\uBC84\uC2A4\uC758 \uD575\uC2EC \uACF5\uAE09\uCC98\uC785\uB2C8\uB2E4. \uB7EC\uC2DC\uC544 \uC81C\uC7AC \uC2DC \uD56D\uACF5\uAE30 \uC0DD\uC0B0\uC5D0 \uC9C1\uC811 \uC601\uD5A5\uC744 \uBBF8\uCCD0\uC694."
    },
    vanadium: {
      weightAnalogy: (st.analogyVanadiumWeight || "\uC804 \uC138\uACC4 \uC5F0\uAC04 \uBC14\uB098\uB4D0 \uC0DD\uC0B0\uB7C9({total}\uD1A4)\uC740 \uC18C\uB7C9\uC774\uC9C0\uB9CC, \uC774\uAC83\uC744 \uCCA0\uAC15\uC5D0 \uC18C\uB7C9 \uCCA8\uAC00\uD558\uBA74 \uC218\uCC9C\uB9CC \uD1A4\uC758 \uACE0\uAC15\uB3C4 \uCCA0\uADFC\uC744 \uB9CC\uB4E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.").replace("{total}", totalProd.toLocaleString()),
      priceAnalogy: (st.analogyVanadiumPrice || "\uBC14\uB098\uB4D0(V\u2082O\u2085) 1\uD30C\uC6B4\uB4DC \uAC00\uACA9\uC740 \uC57D {price}\uB2EC\uB7EC\uC785\uB2C8\uB2E4. \uCEE4\uD53C \uD55C \uC794\uBCF4\uB2E4 \uBE44\uC2F8\uC9C0\uB9CC, \uC774 \uC18C\uB7C9\uC73C\uB85C \uAC74\uBB3C \uCCA0\uADFC\uC758 \uAC15\uB3C4\uB97C 2\uBC30\uB85C \uB192\uC77C \uC218 \uC788\uC5B4\uC694.").replace("{price}", latestPrice.toString()),
      scarcityAnalogy: st.analogyVanadiumScarcity || "\uCCA0\uADFC\uC5D0 \uBC14\uB098\uB4D0\uC744 0.1%\uB9CC \uB123\uC5B4\uB3C4 \uAC15\uB3C4\uAC00 \uD06C\uAC8C \uC62C\uB77C\uAC11\uB2C8\uB2E4. \uC694\uB9AC\uC5D0 \uC18C\uAE08 \uD55C \uAF2C\uC9D1\uC744 \uB123\uC73C\uBA74 \uB9DB\uC774 \uD655 \uB2EC\uB77C\uC9C0\uB294 \uAC83\uCC98\uB7FC, \uC18C\uB7C9\uC73C\uB85C \uD070 \uBCC0\uD654\uB97C \uB9CC\uB4DC\uB294 '\uB9C8\uBC95\uC758 \uC6D0\uC18C'\uC5D0\uC694.",
      usageAnalogy: st.analogyVanadiumUsage || "\uBC14\uB098\uB4D0 \uB808\uB3C5\uC2A4 \uD50C\uB85C\uC6B0 \uBC30\uD130\uB9AC(VRFB)\uB294 \uB300\uD615 \uAC74\uBB3C \uD06C\uAE30\uC758 \uC5D0\uB108\uC9C0 \uC800\uC7A5 \uC7A5\uCE58\uB85C, \uB9AC\uD2AC \uBC30\uD130\uB9AC\uBCF4\uB2E4 \uC218\uBA85\uC774 20\uB144 \uC774\uC0C1 \uAE38\uC5B4 \uCC28\uC138\uB300 \uC5D0\uB108\uC9C0 \uC800\uC7A5 \uAE30\uC220\uB85C \uC8FC\uBAA9\uBC1B\uACE0 \uC788\uC5B4\uC694.",
      reserveAnalogy: (st.analogyVanadiumReserve || "\uC804 \uC138\uACC4 \uBC14\uB098\uB4D0 \uB9E4\uC7A5\uB7C9({reserves}\uD1A4)\uC740 \uD604\uC7AC \uC0DD\uC0B0 \uC18D\uB3C4\uB85C \uC57D {years}\uB144\uAC04 \uC0AC\uC6A9 \uAC00\uB2A5\uD569\uB2C8\uB2E4.").replace("{reserves}", totalReserves.toLocaleString()).replace("{years}", totalProd > 0 ? Math.round(totalReserves / totalProd).toString() : "?"),
      dominanceAnalogy: st.analogyVanadiumDominance || "\uC911\uAD6D\xB7\uB7EC\uC2DC\uC544\xB7\uB0A8\uC544\uACF5 3\uAD6D\uC774 \uC804 \uC138\uACC4 \uBC14\uB098\uB4D0\uC758 90% \uC774\uC0C1\uC744 \uC0DD\uC0B0\uD569\uB2C8\uB2E4. \uC138 \uBA85\uC758 \uD559\uC0DD\uC774 \uBC18 \uC804\uCCB4\uC758 \uACFC\uC81C\uB97C \uD558\uACE0 \uC788\uB294 \uC148\uC774\uC5D0\uC694."
    },
    platinum: {
      weightAnalogy: (st.analogyPlatinumWeight || "\uC804 \uC138\uACC4 \uC5F0\uAC04 \uBC31\uAE08 \uC0DD\uC0B0\uB7C9\uC740 \uC57D {total}\uD1A4\uC5D0 \uBD88\uACFC\uD569\uB2C8\uB2E4. \uC774\uB294 \uAE08 \uC5F0\uAC04 \uC0DD\uC0B0\uB7C9(\uC57D 3,000\uD1A4)\uC758 \uC57D 1/15 \uC218\uC900\uC73C\uB85C, \uC62C\uB9BC\uD53D \uC218\uC601\uC7A5\uC758 1/10\uB3C4 \uCC44\uC6B0\uC9C0 \uBABB\uD558\uB294 \uC591\uC774\uC5D0\uC694.").replace("{total}", totalProd.toString()),
      priceAnalogy: (st.analogyPlatinumPrice || "\uBC31\uAE08 1g \uAC00\uACA9\uC740 \uC57D {won}\uC6D0\uC73C\uB85C, \uAE08(\uC57D 90,000\uC6D0/g)\uACFC \uBE44\uC2B7\uD55C \uC218\uC900\uC785\uB2C8\uB2E4. \uBC31\uAE08 \uBC18\uC9C0 \uD558\uB098(\uC57D 5g)\uC758 \uC6D0\uC7AC\uB8CC\uBE44\uB9CC \uC57D {ring}\uB9CC\uC6D0\uC778 \uC148\uC774\uC5D0\uC694.").replace("{won}", Math.round(latestPrice / 31.1 * 1350).toLocaleString()).replace("{ring}", Math.round(latestPrice / 31.1 * 5 * 1350 / 1e4).toString()),
      scarcityAnalogy: st.analogyPlatinumScarcity || "\uC9C0\uAE08\uAE4C\uC9C0 \uC778\uB958\uAC00 \uCC44\uAD74\uD55C \uBC31\uAE08\uC744 \uBAA8\uB450 \uBAA8\uC544\uB3C4 \uAC70\uC2E4 \uD558\uB098\uB97C \uCC44\uC6B0\uAE30 \uC5B4\uB835\uC2B5\uB2C8\uB2E4. \uAE08\uBCF4\uB2E4 30\uBC30 \uB354 \uD76C\uADC0\uD55C \uC6D0\uC18C\uC608\uC694.",
      usageAnalogy: st.analogyPlatinumUsage || "\uC790\uB3D9\uCC28 \uBC30\uAE30\uAC00\uC2A4 \uCD09\uB9E4 \uBCC0\uD658\uC7A5\uCE58 1\uAC1C\uC5D0 \uC57D 3~7g\uC758 \uBC31\uAE08\uC774 \uC0AC\uC6A9\uB429\uB2C8\uB2E4. \uC218\uC18C \uC5F0\uB8CC\uC804\uC9C0\uCC28\uC5D0\uB294 \uB354 \uB9CE\uC740 \uC591\uC774 \uD544\uC694\uD574\uC11C, \uC218\uC18C \uACBD\uC81C\uAC00 \uD655\uB300\uB420\uC218\uB85D \uBC31\uAE08 \uC218\uC694\uB3C4 \uB298\uC5B4\uB098\uC694.",
      reserveAnalogy: (st.analogyPlatinumReserve || "\uC804 \uC138\uACC4 \uBC31\uAE08 \uB9E4\uC7A5\uB7C9\uC758 \uC57D 90%\uAC00 \uB0A8\uC544\uD504\uB9AC\uCE74\uACF5\uD654\uAD6D\uC5D0 \uC9D1\uC911\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uC804 \uC138\uACC4 \uBCF4\uC11D\uD568\uC758 \uC5F4\uC1E0\uB97C \uD55C \uB098\uB77C\uAC00 \uC950\uACE0 \uC788\uB294 \uAC83\uACFC \uAC19\uC544\uC694.").replace("{reserves}", totalReserves.toLocaleString()),
      dominanceAnalogy: st.analogyPlatinumDominance || "\uB0A8\uC544\uACF5\uC5D0\uC11C \uC815\uC804\uC774 \uBC1C\uC0DD\uD558\uBA74 \uC804 \uC138\uACC4 \uBC31\uAE08 \uAC00\uACA9\uC774 \uCD9C\uB801\uC785\uB2C8\uB2E4. \uD55C \uB098\uB77C\uC758 \uC804\uAE30 \uC0AC\uC815\uC774 \uAE00\uB85C\uBC8C \uC790\uB3D9\uCC28\xB7\uC218\uC18C \uC0B0\uC5C5\uC5D0 \uC601\uD5A5\uC744 \uBBF8\uCE58\uB294 \uAC83\uC774\uC5D0\uC694."
    }
  };
  const data = analogyData[resourceId];
  if (data) {
    analogies.push(data.weightAnalogy);
    analogies.push(data.priceAnalogy);
    analogies.push(data.usageAnalogy);
    analogies.push(data.scarcityAnalogy);
    analogies.push(data.reserveAnalogy);
    analogies.push(data.dominanceAnalogy);
  }
  return analogies;
}
function generateStockImpacts(resourceId, priceChangePercent, prodChangePercent, severity) {
  if (!textData) return [];
  const st = textData;
  const stockDb = {
    tungsten: [
      {
        company: "Xiamen Tungsten",
        ticker: "600549.SS",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryChina || "\uC911\uAD6D",
        type: "producer"
      },
      {
        company: "China Molybdenum",
        ticker: "603993.SS",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryChina || "\uC911\uAD6D",
        type: "producer"
      },
      {
        company: "Sandvik AB",
        ticker: "SAND.ST",
        sector: st.stockSectorTooling || "\uC808\uC0AD\uACF5\uAD6C",
        country: st.stockCountrySweden || "\uC2A4\uC6E8\uB374",
        type: "consumer"
      },
      {
        company: "Kennametal",
        ticker: "KMT",
        sector: st.stockSectorTooling || "\uC808\uC0AD\uACF5\uAD6C",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "consumer"
      },
      {
        company: "Lockheed Martin",
        ticker: "LMT",
        sector: st.stockSectorDefense || "\uBC29\uC0B0",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "consumer"
      }
    ],
    rare_earth: [
      {
        company: "China Northern Rare Earth",
        ticker: "600111.SS",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryChina || "\uC911\uAD6D",
        type: "producer"
      },
      {
        company: "MP Materials",
        ticker: "MP",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "producer"
      },
      {
        company: "Lynas Rare Earths",
        ticker: "LYC.AX",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryAustralia || "\uD638\uC8FC",
        type: "producer"
      },
      {
        company: "Tesla",
        ticker: "TSLA",
        sector: st.stockSectorEV || "\uC804\uAE30\uCC28",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "consumer"
      },
      {
        company: "Vestas Wind Systems",
        ticker: "VWS.CO",
        sector: st.stockSectorRenewable || "\uC7AC\uC0DD\uC5D0\uB108\uC9C0",
        country: st.stockCountryDenmark || "\uB374\uB9C8\uD06C",
        type: "consumer"
      },
      {
        company: "Shin-Etsu Chemical",
        ticker: "4063.T",
        sector: st.stockSectorChemical || "\uD654\uD559",
        country: st.stockCountryJapan || "\uC77C\uBCF8",
        type: "processor"
      }
    ],
    lithium: [
      {
        company: "Albemarle",
        ticker: "ALB",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "producer"
      },
      {
        company: "SQM",
        ticker: "SQM",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryChile || "\uCE60\uB808",
        type: "producer"
      },
      {
        company: "Pilbara Minerals",
        ticker: "PLS.AX",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryAustralia || "\uD638\uC8FC",
        type: "producer"
      },
      {
        company: "Ganfeng Lithium",
        ticker: "002460.SZ",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryChina || "\uC911\uAD6D",
        type: "producer"
      },
      {
        company: "CATL",
        ticker: "300750.SZ",
        sector: st.stockSectorBattery || "\uBC30\uD130\uB9AC",
        country: st.stockCountryChina || "\uC911\uAD6D",
        type: "consumer"
      },
      {
        company: "LG Energy Solution",
        ticker: "373220.KS",
        sector: st.stockSectorBattery || "\uBC30\uD130\uB9AC",
        country: st.stockCountryKorea || "\uD55C\uAD6D",
        type: "consumer"
      },
      {
        company: "Samsung SDI",
        ticker: "006400.KS",
        sector: st.stockSectorBattery || "\uBC30\uD130\uB9AC",
        country: st.stockCountryKorea || "\uD55C\uAD6D",
        type: "consumer"
      },
      {
        company: "BYD",
        ticker: "002594.SZ",
        sector: st.stockSectorEV || "\uC804\uAE30\uCC28",
        country: st.stockCountryChina || "\uC911\uAD6D",
        type: "consumer"
      },
      {
        company: "Sodium-ion Tech (\uB300\uCCB4)",
        ticker: "-",
        sector: st.stockSectorAlternative || "\uB300\uCCB4\uAE30\uC220",
        country: "-",
        type: "alternative"
      }
    ],
    cobalt: [
      {
        company: "Glencore",
        ticker: "GLEN.L",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountrySwitzerland || "\uC2A4\uC704\uC2A4",
        type: "producer"
      },
      {
        company: "ERG (ENRC)",
        ticker: "-",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryKazakhstan || "\uCE74\uC790\uD750\uC2A4\uD0C4",
        type: "producer"
      },
      {
        company: "CATL",
        ticker: "300750.SZ",
        sector: st.stockSectorBattery || "\uBC30\uD130\uB9AC",
        country: st.stockCountryChina || "\uC911\uAD6D",
        type: "consumer"
      },
      {
        company: "Panasonic",
        ticker: "6752.T",
        sector: st.stockSectorBattery || "\uBC30\uD130\uB9AC",
        country: st.stockCountryJapan || "\uC77C\uBCF8",
        type: "consumer"
      },
      {
        company: "Umicore",
        ticker: "UMI.BR",
        sector: st.stockSectorRecycling || "\uC7AC\uD65C\uC6A9",
        country: st.stockCountryBelgium || "\uBCA8\uAE30\uC5D0",
        type: "processor"
      }
    ],
    copper: [
      {
        company: "Freeport-McMoRan",
        ticker: "FCX",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "producer"
      },
      {
        company: "BHP Group",
        ticker: "BHP",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryAustralia || "\uD638\uC8FC",
        type: "producer"
      },
      {
        company: "Southern Copper",
        ticker: "SCCO",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryMexico || "\uBA55\uC2DC\uCF54",
        type: "producer"
      },
      {
        company: "Codelco",
        ticker: "-",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryChile || "\uCE60\uB808",
        type: "producer"
      },
      {
        company: "Prysmian Group",
        ticker: "PRY.MI",
        sector: st.stockSectorCable || "\uC804\uC120/\uCF00\uC774\uBE14",
        country: st.stockCountryItaly || "\uC774\uD0C8\uB9AC\uC544",
        type: "consumer"
      },
      {
        company: "Schneider Electric",
        ticker: "SU.PA",
        sector: st.stockSectorElectric || "\uC804\uAE30\uC7A5\uBE44",
        country: st.stockCountryFrance || "\uD504\uB791\uC2A4",
        type: "consumer"
      }
    ],
    nickel: [
      {
        company: "Vale",
        ticker: "VALE",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryBrazil || "\uBE0C\uB77C\uC9C8",
        type: "producer"
      },
      {
        company: "Norilsk Nickel",
        ticker: "GMKN.ME",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryRussia || "\uB7EC\uC2DC\uC544",
        type: "producer"
      },
      {
        company: "PT Vale Indonesia",
        ticker: "INCO.JK",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryIndonesia || "\uC778\uB3C4\uB124\uC2DC\uC544",
        type: "producer"
      },
      {
        company: "POSCO Holdings",
        ticker: "005490.KS",
        sector: st.stockSectorSteel || "\uCCA0\uAC15",
        country: st.stockCountryKorea || "\uD55C\uAD6D",
        type: "consumer"
      },
      {
        company: "SK On",
        ticker: "-",
        sector: st.stockSectorBattery || "\uBC30\uD130\uB9AC",
        country: st.stockCountryKorea || "\uD55C\uAD6D",
        type: "consumer"
      }
    ],
    graphite: [
      {
        company: "BTR New Material",
        ticker: "835185.BJ",
        sector: st.stockSectorMaterial || "\uC18C\uC7AC",
        country: st.stockCountryChina || "\uC911\uAD6D",
        type: "producer"
      },
      {
        company: "Syrah Resources",
        ticker: "SYR.AX",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryAustralia || "\uD638\uC8FC",
        type: "producer"
      },
      {
        company: "Nouveau Monde Graphite",
        ticker: "NMG",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryCanada || "\uCE90\uB098\uB2E4",
        type: "producer"
      },
      {
        company: "Tesla",
        ticker: "TSLA",
        sector: st.stockSectorEV || "\uC804\uAE30\uCC28",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "consumer"
      },
      {
        company: "SGL Carbon",
        ticker: "SGL.DE",
        sector: st.stockSectorMaterial || "\uC18C\uC7AC",
        country: st.stockCountryGermany || "\uB3C5\uC77C",
        type: "processor"
      }
    ],
    titanium: [
      {
        company: "VSMPO-AVISMA",
        ticker: "-",
        sector: st.stockSectorMetal || "\uAE08\uC18D",
        country: st.stockCountryRussia || "\uB7EC\uC2DC\uC544",
        type: "producer"
      },
      {
        company: "Tronox",
        ticker: "TROX",
        sector: st.stockSectorChemical || "\uD654\uD559",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "producer"
      },
      {
        company: "Boeing",
        ticker: "BA",
        sector: st.stockSectorAerospace || "\uD56D\uACF5\uC6B0\uC8FC",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "consumer"
      },
      {
        company: "Airbus",
        ticker: "AIR.PA",
        sector: st.stockSectorAerospace || "\uD56D\uACF5\uC6B0\uC8FC",
        country: st.stockCountryFrance || "\uD504\uB791\uC2A4",
        type: "consumer"
      },
      {
        company: "RTX (Raytheon)",
        ticker: "RTX",
        sector: st.stockSectorDefense || "\uBC29\uC0B0",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "consumer"
      }
    ],
    vanadium: [
      {
        company: "Largo Inc.",
        ticker: "LGO.TO",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountryCanada || "\uCE90\uB098\uB2E4",
        type: "producer"
      },
      {
        company: "Bushveld Minerals",
        ticker: "BMN.L",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountrySouthAfrica || "\uB0A8\uC544\uACF5",
        type: "producer"
      },
      {
        company: "PANGANG Group Vanadium",
        ticker: "000629.SZ",
        sector: st.stockSectorSteel || "\uCCA0\uAC15",
        country: st.stockCountryChina || "\uC911\uAD6D",
        type: "producer"
      },
      {
        company: "Sumitomo Electric",
        ticker: "5802.T",
        sector: st.stockSectorElectric || "\uC804\uAE30\uC7A5\uBE44",
        country: st.stockCountryJapan || "\uC77C\uBCF8",
        type: "consumer"
      },
      {
        company: "Invinity Energy",
        ticker: "IES.L",
        sector: st.stockSectorESS || "\uC5D0\uB108\uC9C0\uC800\uC7A5",
        country: st.stockCountryUK || "\uC601\uAD6D",
        type: "consumer"
      }
    ],
    platinum: [
      {
        company: "Anglo American Platinum",
        ticker: "AMS.JO",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountrySouthAfrica || "\uB0A8\uC544\uACF5",
        type: "producer"
      },
      {
        company: "Impala Platinum",
        ticker: "IMP.JO",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountrySouthAfrica || "\uB0A8\uC544\uACF5",
        type: "producer"
      },
      {
        company: "Sibanye-Stillwater",
        ticker: "SSW.JO",
        sector: st.stockSectorMining || "\uAD11\uC5C5",
        country: st.stockCountrySouthAfrica || "\uB0A8\uC544\uACF5",
        type: "producer"
      },
      {
        company: "BASF",
        ticker: "BAS.DE",
        sector: st.stockSectorChemical || "\uD654\uD559",
        country: st.stockCountryGermany || "\uB3C5\uC77C",
        type: "consumer"
      },
      {
        company: "Johnson Matthey",
        ticker: "JMAT.L",
        sector: st.stockSectorChemical || "\uD654\uD559",
        country: st.stockCountryUK || "\uC601\uAD6D",
        type: "processor"
      },
      {
        company: "Plug Power",
        ticker: "PLUG",
        sector: st.stockSectorHydrogen || "\uC218\uC18C",
        country: st.stockCountryUSA || "\uBBF8\uAD6D",
        type: "consumer"
      }
    ]
  };
  const companies = stockDb[resourceId] || [];
  const impacts = [];
  const absPrice = Math.abs(priceChangePercent);
  const isSupplyDecrease = prodChangePercent < 0;
  for (const comp of companies) {
    let direction = "volatile";
    let impactPct = 0;
    let reason = "";
    if (comp.type === "producer") {
      if (isSupplyDecrease) {
        direction = "up";
        impactPct = absPrice * (0.4 + Math.random() * 0.3);
        reason = (st.stockReasonProducerUp || "{resource} \uAC00\uACA9 \uC0C1\uC2B9\uC73C\uB85C \uB9E4\uCD9C \uBC0F \uC774\uC775 \uC99D\uAC00 \uAE30\uB300").replace(
          "{resource}",
          textData.resourceNames[resourceId] || resourceId
        );
      } else {
        direction = "down";
        impactPct = absPrice * (0.3 + Math.random() * 0.3);
        reason = (st.stockReasonProducerDown || "{resource} \uAC00\uACA9 \uD558\uB77D\uC73C\uB85C \uC218\uC775\uC131 \uC545\uD654 \uC6B0\uB824").replace(
          "{resource}",
          textData.resourceNames[resourceId] || resourceId
        );
      }
    } else if (comp.type === "consumer") {
      if (isSupplyDecrease) {
        direction = "down";
        impactPct = absPrice * (0.2 + Math.random() * 0.25);
        reason = (st.stockReasonConsumerDown || "\uC6D0\uC790\uC7AC \uAC00\uACA9 \uC0C1\uC2B9\uC73C\uB85C \uC6D0\uAC00 \uBD80\uB2F4 \uC99D\uAC00, \uB9C8\uC9C4 \uC555\uBC15 \uC608\uC0C1").replace(
          "{resource}",
          textData.resourceNames[resourceId] || resourceId
        );
      } else {
        direction = "up";
        impactPct = absPrice * (0.15 + Math.random() * 0.2);
        reason = (st.stockReasonConsumerUp || "\uC6D0\uC790\uC7AC \uAC00\uACA9 \uD558\uB77D\uC73C\uB85C \uC6D0\uAC00 \uC808\uAC10, \uC218\uC775\uC131 \uAC1C\uC120 \uAE30\uB300").replace(
          "{resource}",
          textData.resourceNames[resourceId] || resourceId
        );
      }
    } else if (comp.type === "processor") {
      direction = "volatile";
      impactPct = absPrice * (0.15 + Math.random() * 0.2);
      reason = (st.stockReasonProcessor || "\uC6D0\uC790\uC7AC \uAC00\uACA9 \uBCC0\uB3D9\uC73C\uB85C \uAC00\uACF5 \uB9C8\uC9C4 \uBCC0\uB3D9\uC131 \uD655\uB300").replace(
        "{resource}",
        textData.resourceNames[resourceId] || resourceId
      );
    } else if (comp.type === "alternative") {
      if (isSupplyDecrease && absPrice > 10) {
        direction = "up";
        impactPct = absPrice * (0.3 + Math.random() * 0.4);
        reason = (st.stockReasonAlternativeUp || "{resource} \uACF5\uAE09\uB09C\uC73C\uB85C \uB300\uCCB4 \uAE30\uC220 \uC218\uC694 \uAE09\uC99D \uAE30\uB300").replace(
          "{resource}",
          textData.resourceNames[resourceId] || resourceId
        );
      } else {
        direction = "down";
        impactPct = absPrice * (0.1 + Math.random() * 0.15);
        reason = (st.stockReasonAlternativeDown || "{resource} \uC548\uC815\uC801 \uACF5\uAE09\uC73C\uB85C \uB300\uCCB4 \uAE30\uC220 \uD22C\uC790 \uB9E4\uB825 \uAC10\uC18C").replace(
          "{resource}",
          textData.resourceNames[resourceId] || resourceId
        );
      }
    }
    impactPct = Math.round(impactPct * 10) / 10;
    if (severity === "low") impactPct = Math.min(impactPct, 3);
    impacts.push({
      company: comp.company,
      ticker: comp.ticker,
      sector: comp.sector,
      country: comp.country,
      impactDirection: direction,
      impactPercent: impactPct,
      reason
    });
  }
  impacts.sort((a, b) => b.impactPercent - a.impactPercent);
  return impacts;
}
function showSimResultFullscreenModal() {
  if (!textData || !appData || !uiLayer || !simResult) return;
  const existingModal = document.getElementById("simFullscreenModal");
  if (existingModal && existingModal.parentNode) {
    existingModal.parentNode.removeChild(existingModal);
    const idx = activeUIElements.indexOf(existingModal);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const st = textData;
  const res = appData.resources.find((r) => r.id === simResult.resourceId);
  if (!res) return;
  const resName = textData.resourceNames[simResult.resourceId] || simResult.resourceId;
  const countryName = textData.countryNames[simResult.countryId] || simResult.countryId;
  const modal = AppHelper.createUIElement("div", "simFullscreenModal", {
    position: "absolute",
    left: "0%",
    top: "0%",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    backgroundColor: "rgba(2, 5, 15, 0.98)",
    pointerEvents: "auto",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    zIndex: "200"
  });
  uiLayer.appendChild(modal);
  activeUIElements.push(modal);
  const innerContent = AppHelper.createUIElement("div", "simFsInner", {
    padding: "2% 4%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flex: "1",
    overflowY: "auto"
  });
  modal.appendChild(innerContent);
  const headerRow = AppHelper.createUIElement("div", "simFsHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  innerContent.appendChild(headerRow);
  const headerTitle = AppHelper.createUIElement(
    "div",
    "simFsTitle",
    {
      fontSize: "26px",
      fontWeight: "bold",
      color: res.color,
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F4CA} ${st.simResultTitle || "\uC2DC\uBBAC\uB808\uC774\uC158 \uACB0\uACFC"} - ${countryName} \xB7 ${resName}`
  );
  headerRow.appendChild(headerTitle);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "simFsClose",
    {
      padding: "1% 2.5%",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.9)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "1px solid rgba(200, 100, 100, 0.5)"
    },
    `\u2715 ${st.simFsCloseBtn || "\uB2EB\uAE30"}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showSimResultFullscreen = false;
          const el = document.getElementById("simFullscreenModal");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
            const idx2 = activeUIElements.indexOf(el);
            if (idx2 >= 0) activeUIElements.splice(idx2, 1);
          }
        }
      }
    ]
  );
  headerRow.appendChild(closeBtn);
  const resultsContainer = AppHelper.createUIElement("div", "simFsResults", {
    boxSizing: "border-box",
    pointerEvents: "auto",
    overflowY: "auto"
  });
  innerContent.appendChild(resultsContainer);
  renderSimulationResults(resultsContainer, simResult, true);
}
function renderResourceRankingOverlay() {
  if (!textData || !appData || !uiLayer) return;
  const existingOverlay = document.getElementById("resRankOverlay");
  if (existingOverlay && existingOverlay.parentNode) {
    existingOverlay.parentNode.removeChild(existingOverlay);
    const idx = activeUIElements.indexOf(existingOverlay);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const st = textData;
  const overlay = AppHelper.createUIElement("div", "resRankOverlay", {
    position: "absolute",
    left: "3%",
    top: "3%",
    width: "94%",
    height: "94%",
    boxSizing: "border-box",
    backgroundColor: "rgba(5, 10, 35, 0.97)",
    borderRadius: "16px",
    padding: "2%",
    border: "2px solid rgba(100, 180, 255, 0.4)",
    pointerEvents: "auto",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    zIndex: "110"
  });
  uiLayer.appendChild(overlay);
  activeUIElements.push(overlay);
  const headerRow = AppHelper.createUIElement("div", "resRankHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(headerRow);
  const headerTitle = AppHelper.createUIElement(
    "div",
    "resRankTitle",
    {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#60a5fa",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.resRankTitle || "\u{1F3C6} \uC790\uC6D0\uBCC4 \uC218\uC785\uAD6D \uBC0F \uBE44\uCD95\uB7C9 \uC21C\uC704"
  );
  headerRow.appendChild(headerTitle);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "resRankClose",
    {
      padding: "1% 2%",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box"
    },
    `\u2715 ${textData.closeBtn}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showResourceRankingOverlay = false;
          const el = document.getElementById("resRankOverlay");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
            const idx2 = activeUIElements.indexOf(el);
            if (idx2 >= 0) activeUIElements.splice(idx2, 1);
          }
        }
      }
    ]
  );
  headerRow.appendChild(closeBtn);
  const resSelectorRow = AppHelper.createUIElement("div", "resRankSelector", {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(resSelectorRow);
  for (const res of appData.resources) {
    const rName = textData.resourceNames[res.id] || res.id;
    const isActive = rankingSelectedResourceId === res.id;
    const rBtn = AppHelper.createUIElement(
      "div",
      `resRankR_${res.id}`,
      {
        padding: "0.8% 2%",
        fontSize: "13px",
        fontWeight: "bold",
        color: isActive ? "#ffffff" : res.color,
        backgroundColor: isActive ? res.color + "cc" : "rgba(20, 40, 70, 0.7)",
        borderRadius: "6px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: `1px solid ${res.color}60`
      },
      `\u25CF ${rName}`,
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            rankingSelectedResourceId = res.id;
            renderResourceRankingOverlay();
          }
        }
      ]
    );
    resSelectorRow.appendChild(rBtn);
  }
  const tabBar = AppHelper.createUIElement("div", "resRankTabBar", {
    display: "flex",
    gap: "8px",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(tabBar);
  const rankTabs = [
    { key: "top_importer" /* TOP_IMPORTER */, label: st.resRankTopImporter || "\uCD5C\uB300 \uC218\uC785\uAD6D \uC21C\uC704", icon: "\u{1F3ED}" },
    { key: "reserves_rank" /* RESERVES_RANK */, label: st.resRankReservesRank || "\uBE44\uCD95\uB7C9 \uC21C\uC704", icon: "\u{1F48E}" }
  ];
  for (const tab of rankTabs) {
    const isActive = currentResourceRankingTab === tab.key;
    const selectedRes = rankingSelectedResourceId ? appData.resources.find((r) => r.id === rankingSelectedResourceId) : null;
    const activeColor = selectedRes ? selectedRes.color : "#60a5fa";
    const tabBtn = AppHelper.createUIElement(
      "div",
      `resRankTab_${tab.key}`,
      {
        padding: "1% 3%",
        fontSize: "14px",
        fontWeight: "bold",
        color: isActive ? "#ffffff" : "rgba(180, 210, 255, 0.6)",
        backgroundColor: isActive ? activeColor + "aa" : "rgba(20, 40, 70, 0.7)",
        borderRadius: "8px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: isActive ? `1px solid ${activeColor}` : "1px solid rgba(60, 100, 160, 0.3)"
      },
      `${tab.icon} ${tab.label}`,
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            currentResourceRankingTab = tab.key;
            renderResourceRankingOverlay();
          }
        }
      ]
    );
    tabBar.appendChild(tabBtn);
  }
  const contentArea = AppHelper.createUIElement("div", "resRankContent", {
    flex: "1",
    overflowY: "auto",
    boxSizing: "border-box",
    pointerEvents: "auto"
  });
  overlay.appendChild(contentArea);
  if (!rankingSelectedResourceId) {
    const overviewTitle = AppHelper.createUIElement(
      "div",
      "resRankOverviewTitle",
      {
        fontSize: "16px",
        color: "rgba(180, 210, 255, 0.7)",
        textAlign: "center",
        padding: "3% 0",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      st.resRankSelectPrompt || "\uC704\uC5D0\uC11C \uC790\uC6D0\uC744 \uC120\uD0DD\uD558\uBA74 \uC0C1\uC138 \uC21C\uC704\uB97C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4"
    );
    contentArea.appendChild(overviewTitle);
    const summaryGrid = AppHelper.createUIElement("div", "resRankSummaryGrid", {
      display: "flex",
      flexWrap: "wrap",
      gap: "1.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    contentArea.appendChild(summaryGrid);
    for (const res of appData.resources) {
      const rName = textData.resourceNames[res.id] || res.id;
      let topProdCountry = "";
      let topProdVal = 0;
      let topReservesCountry = "";
      let topReservesVal = 0;
      for (const c of appData.countries) {
        for (const cr of c.resources) {
          if (cr.resourceId === res.id) {
            if (cr.production > topProdVal) {
              topProdVal = cr.production;
              topProdCountry = c.id;
            }
            if (cr.reserves > topReservesVal) {
              topReservesVal = cr.reserves;
              topReservesCountry = c.id;
            }
          }
        }
      }
      const card = AppHelper.createUIElement("div", `resRankCard_${res.id}`, {
        flex: "1",
        minWidth: "280px",
        padding: "1.5%",
        backgroundColor: "rgba(15, 30, 65, 0.7)",
        borderRadius: "10px",
        boxSizing: "border-box",
        pointerEvents: "auto",
        cursor: "pointer",
        border: `1px solid ${res.color}30`
      });
      card.addEventListener("pointerup", () => {
        playClickSound();
        rankingSelectedResourceId = res.id;
        renderResourceRankingOverlay();
      });
      summaryGrid.appendChild(card);
      const cardTitle = AppHelper.createUIElement(
        "div",
        `resRankCT_${res.id}`,
        {
          fontSize: "16px",
          fontWeight: "bold",
          color: res.color,
          marginBottom: "1%",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        `\u25CF ${rName}`
      );
      card.appendChild(cardTitle);
      const topProdLabel = AppHelper.createUIElement(
        "div",
        `resRankTP_${res.id}`,
        {
          fontSize: "13px",
          color: "#c0d8ff",
          marginBottom: "0.5%",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        `\u{1F3ED} ${st.resRankTopProducer || "\uCD5C\uB300 \uC0DD\uC0B0\uAD6D"}: ${textData.countryNames[topProdCountry] || "-"} (${topProdVal.toLocaleString()} ${res.unit})`
      );
      card.appendChild(topProdLabel);
      const topResLabel = AppHelper.createUIElement(
        "div",
        `resRankTR_${res.id}`,
        {
          fontSize: "13px",
          color: "#c0d8ff",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        `\u{1F48E} ${st.resRankTopReserves || "\uCD5C\uB300 \uBE44\uCD95\uAD6D"}: ${textData.countryNames[topReservesCountry] || "-"} (${topReservesVal.toLocaleString()} ${textData.reservesUnit})`
      );
      card.appendChild(topResLabel);
      const impLabel = AppHelper.createUIElement(
        "div",
        `resRankImp_${res.id}`,
        {
          fontSize: "12px",
          color: "rgba(180, 210, 255, 0.6)",
          marginTop: "0.5%",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        `\u2B50 ${textData.strategicImportance}: ${res.strategicImportance}/10`
      );
      card.appendChild(impLabel);
    }
  } else {
    const res = appData.resources.find((r) => r.id === rankingSelectedResourceId);
    if (!res) return;
    const rName = textData.resourceNames[rankingSelectedResourceId] || rankingSelectedResourceId;
    const detailTitle = AppHelper.createUIElement(
      "div",
      "resRankDetailTitle",
      {
        fontSize: "20px",
        fontWeight: "bold",
        color: res.color,
        marginBottom: "2%",
        textAlign: "center",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u25CF ${rName} - ${currentResourceRankingTab === "top_importer" /* TOP_IMPORTER */ ? st.resRankTopImporter || "\uCD5C\uB300 \uC218\uC785\uAD6D \uC21C\uC704" : st.resRankReservesRank || "\uBE44\uCD95\uB7C9 \uC21C\uC704"}`
    );
    contentArea.appendChild(detailTitle);
    if (currentResourceRankingTab === "top_importer" /* TOP_IMPORTER */) {
      const countryData = [];
      let totalProd = 0;
      for (const c of appData.countries) {
        for (const cr of c.resources) {
          if (cr.resourceId === rankingSelectedResourceId) {
            totalProd += cr.production;
          }
        }
      }
      for (const c of appData.countries) {
        for (const cr of c.resources) {
          if (cr.resourceId === rankingSelectedResourceId && cr.production > 0) {
            countryData.push({
              id: c.id,
              production: cr.production,
              share: totalProd > 0 ? cr.production / totalProd * 100 : 0
            });
          }
        }
      }
      countryData.sort((a, b) => b.production - a.production);
      const descBox = AppHelper.createUIElement("div", "resRankDesc", {
        padding: "1.5%",
        marginBottom: "2%",
        backgroundColor: "rgba(20, 40, 80, 0.5)",
        borderRadius: "10px",
        boxSizing: "border-box",
        pointerEvents: "none",
        border: `1px solid ${res.color}20`
      });
      contentArea.appendChild(descBox);
      const descText = AppHelper.createUIElement(
        "div",
        "resRankDescText",
        {
          fontSize: "13px",
          color: "rgba(180, 210, 255, 0.8)",
          lineHeight: "1.6",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        `${st.resRankProdDesc || "\uC0DD\uC0B0\uB7C9\uC774 \uB9CE\uC740 \uAD6D\uAC00\uC77C\uC218\uB85D \uD574\uB2F9 \uC790\uC6D0\uC758 \uAE00\uB85C\uBC8C \uACF5\uAE09\uC5D0 \uD070 \uC601\uD5A5\uC744 \uBBF8\uCE69\uB2C8\uB2E4. \uC544\uB798 \uC21C\uC704\uB294 \uC5F0\uAC04 \uC0DD\uC0B0\uB7C9 \uAE30\uC900\uC774\uBA70, \uAE00\uB85C\uBC8C \uC810\uC720\uC728\uC744 \uD568\uAED8 \uD45C\uC2DC\uD569\uB2C8\uB2E4."}`
      );
      descBox.appendChild(descText);
      for (let i = 0; i < countryData.length; i++) {
        const entry = countryData[i];
        const cName = textData.countryNames[entry.id] || entry.id;
        const barWidth = entry.share;
        const row = AppHelper.createUIElement("div", `resRankRow_${i}`, {
          marginBottom: "1.5%",
          padding: "1.2% 1.5%",
          backgroundColor: i === 0 ? "rgba(255, 215, 0, 0.1)" : i === 1 ? "rgba(192, 192, 192, 0.08)" : i === 2 ? "rgba(205, 127, 50, 0.06)" : "rgba(15, 30, 60, 0.4)",
          borderRadius: "8px",
          boxSizing: "border-box",
          pointerEvents: "none",
          border: i < 3 ? `1px solid ${i === 0 ? "rgba(255, 215, 0, 0.3)" : i === 1 ? "rgba(192, 192, 192, 0.3)" : "rgba(205, 127, 50, 0.3)"}` : "1px solid rgba(40, 70, 120, 0.3)"
        });
        contentArea.appendChild(row);
        const medalIcons = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
        const rankStr = i < 3 ? medalIcons[i] : `${i + 1}.`;
        const labelRow = AppHelper.createUIElement("div", `resRankLR_${i}`, {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5%",
          boxSizing: "border-box",
          pointerEvents: "none"
        });
        row.appendChild(labelRow);
        const nameEl = AppHelper.createUIElement(
          "span",
          `resRankN_${i}`,
          {
            fontSize: "15px",
            fontWeight: "bold",
            color: i < 3 ? "#ffffff" : "#c0d8ff",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          `${rankStr} ${cName}`
        );
        labelRow.appendChild(nameEl);
        const valEl = AppHelper.createUIElement(
          "span",
          `resRankV_${i}`,
          {
            fontSize: "14px",
            color: res.color,
            fontWeight: "bold",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          `${entry.production.toLocaleString()} ${res.unit}`
        );
        labelRow.appendChild(valEl);
        const barBg = AppHelper.createUIElement("div", `resRankBg_${i}`, {
          width: "100%",
          height: "10px",
          backgroundColor: "rgba(30, 50, 80, 0.6)",
          borderRadius: "5px",
          overflow: "hidden",
          boxSizing: "border-box",
          pointerEvents: "none"
        });
        row.appendChild(barBg);
        const barFill = AppHelper.createUIElement("div", `resRankFill_${i}`, {
          width: `${barWidth}%`,
          height: "100%",
          borderRadius: "5px",
          boxSizing: "border-box",
          pointerEvents: "none",
          background: `linear-gradient(90deg, ${res.color}60, ${res.color})`
        });
        barBg.appendChild(barFill);
        const shareEl = AppHelper.createUIElement(
          "div",
          `resRankShare_${i}`,
          {
            fontSize: "12px",
            color: "rgba(180, 210, 255, 0.6)",
            marginTop: "0.3%",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          `${st.resRankGlobalShare || "\uAE00\uB85C\uBC8C \uC810\uC720\uC728"}: ${entry.share.toFixed(1)}%`
        );
        row.appendChild(shareEl);
      }
    } else {
      const countryData = [];
      let totalReserves = 0;
      for (const c of appData.countries) {
        for (const cr of c.resources) {
          if (cr.resourceId === rankingSelectedResourceId) {
            totalReserves += cr.reserves;
          }
        }
      }
      for (const c of appData.countries) {
        for (const cr of c.resources) {
          if (cr.resourceId === rankingSelectedResourceId && cr.reserves > 0) {
            countryData.push({
              id: c.id,
              reserves: cr.reserves,
              share: totalReserves > 0 ? cr.reserves / totalReserves * 100 : 0
            });
          }
        }
      }
      countryData.sort((a, b) => b.reserves - a.reserves);
      const descBox = AppHelper.createUIElement("div", "resRankResDesc", {
        padding: "1.5%",
        marginBottom: "2%",
        backgroundColor: "rgba(20, 40, 80, 0.5)",
        borderRadius: "10px",
        boxSizing: "border-box",
        pointerEvents: "none",
        border: `1px solid ${res.color}20`
      });
      contentArea.appendChild(descBox);
      const descText = AppHelper.createUIElement(
        "div",
        "resRankResDescText",
        {
          fontSize: "13px",
          color: "rgba(180, 210, 255, 0.8)",
          lineHeight: "1.6",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        `${st.resRankReservesDesc || "\uB9E4\uC7A5\uB7C9(\uBE44\uCD95\uB7C9)\uC740 \uACBD\uC81C\uC801\uC73C\uB85C \uCC44\uAD74 \uAC00\uB2A5\uD55C \uC790\uC6D0\uC758 \uCD1D\uB7C9\uC744 \uC758\uBBF8\uD569\uB2C8\uB2E4. \uB9E4\uC7A5\uB7C9\uC774 \uB9CE\uC744\uC218\uB85D \uC7A5\uAE30\uC801 \uACF5\uAE09 \uC548\uC815\uC131\uC774 \uB192\uC73C\uBA70, \uD5A5\uD6C4 \uC790\uC6D0 \uD328\uAD8C\uC5D0 \uC911\uC694\uD55C \uC9C0\uD45C\uC785\uB2C8\uB2E4."}`
      );
      descBox.appendChild(descText);
      if (countryData.length === 0) {
        const noData = AppHelper.createUIElement(
          "div",
          "resRankNoData",
          {
            fontSize: "14px",
            color: "rgba(180, 210, 255, 0.5)",
            textAlign: "center",
            padding: "5% 0",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          textData.noData
        );
        contentArea.appendChild(noData);
        return;
      }
      for (let i = 0; i < countryData.length; i++) {
        const entry = countryData[i];
        const cName = textData.countryNames[entry.id] || entry.id;
        const barWidth = entry.share;
        const row = AppHelper.createUIElement("div", `resRankResRow_${i}`, {
          marginBottom: "1.5%",
          padding: "1.2% 1.5%",
          backgroundColor: i === 0 ? "rgba(255, 215, 0, 0.1)" : i === 1 ? "rgba(192, 192, 192, 0.08)" : i === 2 ? "rgba(205, 127, 50, 0.06)" : "rgba(15, 30, 60, 0.4)",
          borderRadius: "8px",
          boxSizing: "border-box",
          pointerEvents: "none",
          border: i < 3 ? `1px solid ${i === 0 ? "rgba(255, 215, 0, 0.3)" : i === 1 ? "rgba(192, 192, 192, 0.3)" : "rgba(205, 127, 50, 0.3)"}` : "1px solid rgba(40, 70, 120, 0.3)"
        });
        contentArea.appendChild(row);
        const medalIcons = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
        const rankStr = i < 3 ? medalIcons[i] : `${i + 1}.`;
        const labelRow = AppHelper.createUIElement("div", `resRankResLR_${i}`, {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5%",
          boxSizing: "border-box",
          pointerEvents: "none"
        });
        row.appendChild(labelRow);
        const nameEl = AppHelper.createUIElement(
          "span",
          `resRankResN_${i}`,
          {
            fontSize: "15px",
            fontWeight: "bold",
            color: i < 3 ? "#ffffff" : "#c0d8ff",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          `${rankStr} ${cName}`
        );
        labelRow.appendChild(nameEl);
        const valEl = AppHelper.createUIElement(
          "span",
          `resRankResV_${i}`,
          {
            fontSize: "14px",
            color: res.color,
            fontWeight: "bold",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          `${entry.reserves.toLocaleString()} ${textData.reservesUnit}`
        );
        labelRow.appendChild(valEl);
        const barBg = AppHelper.createUIElement("div", `resRankResBg_${i}`, {
          width: "100%",
          height: "10px",
          backgroundColor: "rgba(30, 50, 80, 0.6)",
          borderRadius: "5px",
          overflow: "hidden",
          boxSizing: "border-box",
          pointerEvents: "none"
        });
        row.appendChild(barBg);
        const barFill = AppHelper.createUIElement("div", `resRankResFill_${i}`, {
          width: `${barWidth}%`,
          height: "100%",
          borderRadius: "5px",
          boxSizing: "border-box",
          pointerEvents: "none",
          background: `linear-gradient(90deg, #4ecdc460, #4ecdc4)`
        });
        barBg.appendChild(barFill);
        const shareEl = AppHelper.createUIElement(
          "div",
          `resRankResShare_${i}`,
          {
            fontSize: "12px",
            color: "rgba(180, 210, 255, 0.6)",
            marginTop: "0.3%",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          `${st.resRankGlobalShare || "\uAE00\uB85C\uBC8C \uC810\uC720\uC728"}: ${entry.share.toFixed(1)}%`
        );
        row.appendChild(shareEl);
      }
    }
  }
}
function drawSimPriceChart(c, w, h, priceData, res, result) {
  const padding = { top: 25, right: 60, bottom: 35, left: 65 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const data = priceData.data;
  const lastYear = data[data.length - 1].year;
  const allPrices = [...data.map((d) => d.price), result.newPrice];
  let minPrice = Math.min(...allPrices);
  let maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;
  minPrice -= priceRange * 0.1;
  maxPrice += priceRange * 0.1;
  c.fillStyle = "rgba(10, 20, 45, 1)";
  c.fillRect(0, 0, w, h);
  c.strokeStyle = "rgba(60, 100, 160, 0.2)";
  c.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + chartH / 4 * i;
    c.beginPath();
    c.moveTo(padding.left, y);
    c.lineTo(padding.left + chartW, y);
    c.stroke();
    const pv = maxPrice - (maxPrice - minPrice) / 4 * i;
    c.fillStyle = "rgba(180, 210, 255, 0.5)";
    c.font = "11px sans-serif";
    c.textAlign = "right";
    c.textBaseline = "middle";
    c.fillText(pv.toFixed(0), padding.left - 6, y);
  }
  const totalPoints = data.length + 1;
  c.beginPath();
  c.strokeStyle = res.color;
  c.lineWidth = 2;
  for (let i = 0; i < data.length; i++) {
    const x = padding.left + i / (totalPoints - 1) * chartW;
    const y = padding.top + chartH - (data[i].price - minPrice) / (maxPrice - minPrice) * chartH;
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.stroke();
  const lastX = padding.left + (data.length - 1) / (totalPoints - 1) * chartW;
  const lastY = padding.top + chartH - (data[data.length - 1].price - minPrice) / (maxPrice - minPrice) * chartH;
  const projX = padding.left + data.length / (totalPoints - 1) * chartW;
  const projY = padding.top + chartH - (result.newPrice - minPrice) / (maxPrice - minPrice) * chartH;
  c.setLineDash([5, 5]);
  c.strokeStyle = result.priceImpact > 0 ? "#ff6b6b" : "#4ecdc4";
  c.lineWidth = 2.5;
  c.beginPath();
  c.moveTo(lastX, lastY);
  c.lineTo(projX, projY);
  c.stroke();
  c.setLineDash([]);
  const projColor = result.priceImpact > 0 ? "#ff6b6b" : "#4ecdc4";
  const glowGrad = c.createRadialGradient(projX, projY, 0, projX, projY, 15);
  glowGrad.addColorStop(0, projColor + "60");
  glowGrad.addColorStop(1, projColor + "00");
  c.beginPath();
  c.arc(projX, projY, 15, 0, Math.PI * 2);
  c.fillStyle = glowGrad;
  c.fill();
  c.beginPath();
  c.arc(projX, projY, 6, 0, Math.PI * 2);
  c.fillStyle = projColor;
  c.fill();
  c.strokeStyle = "#ffffff";
  c.lineWidth = 2;
  c.stroke();
  c.fillStyle = projColor;
  c.font = "bold 13px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "bottom";
  c.fillText(`${result.newPrice.toLocaleString()}`, projX, projY - 12);
  c.fillStyle = "rgba(180, 210, 255, 0.6)";
  c.font = "11px sans-serif";
  c.fillText(`(${result.priceImpact > 0 ? "+" : ""}${result.priceImpact.toFixed(1)}%)`, projX, projY - 24);
  c.fillStyle = "rgba(180, 210, 255, 0.5)";
  c.font = "11px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "top";
  const step = Math.max(1, Math.floor(data.length / 6));
  for (let i = 0; i < data.length; i += step) {
    const x = padding.left + i / (totalPoints - 1) * chartW;
    c.fillText(String(data[i].year), x, padding.top + chartH + 6);
  }
  c.fillStyle = projColor;
  c.font = "bold 11px sans-serif";
  c.fillText(`${lastYear + 1}?`, projX, padding.top + chartH + 6);
  for (let i = 0; i < data.length; i++) {
    const x = padding.left + i / (totalPoints - 1) * chartW;
    const y = padding.top + chartH - (data[i].price - minPrice) / (maxPrice - minPrice) * chartH;
    c.beginPath();
    c.arc(x, y, 2.5, 0, Math.PI * 2);
    c.fillStyle = res.color;
    c.fill();
  }
}
function createSimStatCard(id, title, value, change, changeColor, icon) {
  const card = AppHelper.createUIElement("div", id, {
    flex: "1",
    minWidth: "180px",
    padding: "1.5%",
    backgroundColor: "rgba(15, 30, 65, 0.7)",
    borderRadius: "10px",
    boxSizing: "border-box",
    pointerEvents: "none",
    border: `1px solid ${changeColor}30`,
    textAlign: "center"
  });
  const iconEl = AppHelper.createUIElement(
    "div",
    `${id}_icon`,
    {
      fontSize: "24px",
      marginBottom: "0.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    icon
  );
  card.appendChild(iconEl);
  const titleEl = AppHelper.createUIElement(
    "div",
    `${id}_title`,
    {
      fontSize: "12px",
      color: "rgba(180, 210, 255, 0.7)",
      marginBottom: "0.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    title
  );
  card.appendChild(titleEl);
  const valueEl = AppHelper.createUIElement(
    "div",
    `${id}_value`,
    {
      fontSize: "14px",
      color: "#c0d8ff",
      fontWeight: "bold",
      marginBottom: "0.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    value
  );
  card.appendChild(valueEl);
  const changeEl = AppHelper.createUIElement(
    "div",
    `${id}_change`,
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: changeColor,
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    change
  );
  card.appendChild(changeEl);
  return card;
}
function renderSimulationResults(container, result, isFullscreen = false) {
  if (!textData || !appData) return;
  const st = textData;
  const res = appData.resources.find((r) => r.id === result.resourceId);
  if (!res) return;
  const resName = textData.resourceNames[result.resourceId] || result.resourceId;
  const countryName = textData.countryNames[result.countryId] || result.countryId;
  const resultsSection = AppHelper.createUIElement("div", "simResults", {
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  container.appendChild(resultsSection);
  const resultHeaderRow = AppHelper.createUIElement("div", "simResultHeaderRow", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  resultsSection.appendChild(resultHeaderRow);
  const resultHeader = AppHelper.createUIElement(
    "div",
    "simResultHeader",
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#60a5fa",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.simResultTitle || "\u{1F4CA} \uC2DC\uBBAC\uB808\uC774\uC158 \uACB0\uACFC"
  );
  resultHeaderRow.appendChild(resultHeader);
  if (!isFullscreen) {
    const fullscreenBtn = AppHelper.createUIElement(
      "div",
      "simFullscreenBtn",
      {
        padding: "0.6% 1.5%",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "rgba(60, 140, 255, 0.7)",
        borderRadius: "6px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: "1px solid rgba(100, 180, 255, 0.5)",
        whiteSpace: "nowrap"
      },
      st.simFullscreenBtn || "\u{1F50D} \uACB0\uACFC \uD06C\uAC8C \uBCF4\uAE30",
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            showSimResultFullscreen = true;
            showSimResultFullscreenModal();
          }
        }
      ]
    );
    resultHeaderRow.appendChild(fullscreenBtn);
  }
  const sevColors = { low: "#4ecdc4", medium: "#ffe66d", high: "#ff9a76", critical: "#ff6b6b" };
  const sevLabels = {
    low: st.simSevLow || "\uC601\uD5A5 \uBBF8\uBBF8",
    medium: st.simSevMedium || "\uBCF4\uD1B5 \uC601\uD5A5",
    high: st.simSevHigh || "\uB192\uC740 \uC601\uD5A5",
    critical: st.simSevCritical || "\uB9E4\uC6B0 \uC2EC\uAC01"
  };
  const sevColor = sevColors[result.severity] || "#ffffff";
  const sevBadge = AppHelper.createUIElement(
    "div",
    "simSevBadge",
    {
      fontSize: isFullscreen ? "16px" : "14px",
      fontWeight: "bold",
      color: sevColor,
      backgroundColor: sevColor + "20",
      padding: "0.5% 2%",
      borderRadius: "20px",
      textAlign: "center",
      marginBottom: "2%",
      boxSizing: "border-box",
      pointerEvents: "none",
      border: `2px solid ${sevColor}60`,
      display: "inline-block",
      width: "auto",
      marginLeft: "auto",
      marginRight: "auto"
    },
    `\u26A0 ${st.simSeverity || "\uC601\uD5A5 \uC218\uC900"}: ${sevLabels[result.severity] || result.severity}`
  );
  const sevWrap = AppHelper.createUIElement("div", "simSevWrap", {
    textAlign: "center",
    marginBottom: "2%",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  sevWrap.appendChild(sevBadge);
  resultsSection.appendChild(sevWrap);
  if (isFullscreen) {
    const scenarioBox = AppHelper.createUIElement("div", "simScenarioBox", {
      padding: "1.5%",
      marginBottom: "2%",
      backgroundColor: "rgba(20, 40, 80, 0.5)",
      borderRadius: "10px",
      boxSizing: "border-box",
      pointerEvents: "none",
      border: `1px solid ${res.color}30`,
      textAlign: "center"
    });
    resultsSection.appendChild(scenarioBox);
    const scenarioText = AppHelper.createUIElement(
      "div",
      "simScenarioText",
      {
        fontSize: "15px",
        color: "#c0d8ff",
        lineHeight: "1.8",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `${st.simScenarioDesc || "\uC2DC\uB098\uB9AC\uC624"}: ${countryName}\uC758 ${resName} ${st.simProdLabel || "\uC0DD\uC0B0\uB7C9"} ${result.changePercent > 0 ? "+" : ""}${result.changePercent}% \uBCC0\uB3D9`
    );
    scenarioBox.appendChild(scenarioText);
  }
  const statsRow = AppHelper.createUIElement("div", "simStatsRow", {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5%",
    marginBottom: "2%",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  resultsSection.appendChild(statsRow);
  const prodCard = createSimStatCard(
    "simProdCard",
    st.simProdLabel || "\uC0DD\uC0B0\uB7C9 \uBCC0\uD654",
    `${result.originalProduction.toLocaleString()} \u2192 ${result.newProduction.toLocaleString()} ${res.unit}`,
    `${result.changePercent > 0 ? "+" : ""}${result.changePercent}%`,
    result.changePercent < 0 ? "#ff6b6b" : "#4ecdc4",
    "\u2699"
  );
  statsRow.appendChild(prodCard);
  const priceChangeStr = result.priceImpact > 0 ? `+${result.priceImpact.toFixed(1)}%` : `${result.priceImpact.toFixed(1)}%`;
  const priceHist = appData.priceHistory.find((p) => p.resourceId === result.resourceId);
  const priceCard = createSimStatCard(
    "simPriceCard",
    st.simPriceLabel || "\uAC00\uACA9 \uBCC0\uD654",
    `${result.originalPrice.toLocaleString()} \u2192 ${result.newPrice.toLocaleString()}`,
    priceChangeStr,
    result.priceImpact > 0 ? "#ff6b6b" : "#4ecdc4",
    "\u{1F4B0}"
  );
  statsRow.appendChild(priceCard);
  const shareCard = createSimStatCard(
    "simShareCard",
    st.simShareLabel || "\uAE00\uB85C\uBC8C \uACF5\uAE09 \uC810\uC720\uC728",
    `${result.supplyShareBefore.toFixed(1)}% \u2192 ${result.supplyShareAfter.toFixed(1)}%`,
    `${result.supplyShareAfter - result.supplyShareBefore > 0 ? "+" : ""}${(result.supplyShareAfter - result.supplyShareBefore).toFixed(1)}%p`,
    result.supplyShareAfter > result.supplyShareBefore ? "#4ecdc4" : "#ff6b6b",
    "\u{1F310}"
  );
  statsRow.appendChild(shareCard);
  if (priceHist && priceHist.data.length > 0) {
    const chartSection = AppHelper.createUIElement("div", "simChartSection", {
      marginBottom: "2%",
      padding: "1.5%",
      backgroundColor: "rgba(15, 30, 65, 0.6)",
      borderRadius: "10px",
      boxSizing: "border-box",
      pointerEvents: "none",
      border: `1px solid ${res.color}30`
    });
    resultsSection.appendChild(chartSection);
    const chartLabel = AppHelper.createUIElement(
      "div",
      "simChartLabel",
      {
        fontSize: isFullscreen ? "16px" : "14px",
        fontWeight: "bold",
        color: "#60a5fa",
        marginBottom: "1%",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      st.simPriceProjection || "\u{1F4C8} \uAC00\uACA9 \uBCC0\uB3D9 \uC608\uCE21"
    );
    chartSection.appendChild(chartLabel);
    const chartHeight = isFullscreen ? "280px" : "180px";
    const chartCanvasH = isFullscreen ? 320 : 200;
    const simChartCanvas = AppHelper.createUIElement("canvas", "simChartCanvas", {
      width: "100%",
      height: chartHeight,
      boxSizing: "border-box",
      borderRadius: "8px",
      backgroundColor: "rgba(10, 20, 45, 0.8)"
    });
    simChartCanvas.width = 900;
    simChartCanvas.height = chartCanvasH;
    chartSection.appendChild(simChartCanvas);
    const sctx = simChartCanvas.getContext("2d");
    if (sctx) {
      drawSimPriceChart(sctx, simChartCanvas.width, simChartCanvas.height, priceHist, res, result);
    }
  }
  const effectsSection = AppHelper.createUIElement("div", "simEffects", {
    padding: "2%",
    backgroundColor: "rgba(15, 30, 65, 0.6)",
    borderRadius: "10px",
    boxSizing: "border-box",
    pointerEvents: "none",
    border: "1px solid rgba(80, 150, 255, 0.2)",
    marginBottom: "2%"
  });
  resultsSection.appendChild(effectsSection);
  const effectsTitle = AppHelper.createUIElement(
    "div",
    "simEffectsTitle",
    {
      fontSize: isFullscreen ? "18px" : "16px",
      fontWeight: "bold",
      color: "#ffe66d",
      marginBottom: "1.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.simGlobalEffects || "\u{1F30D} \uC138\uACC4 \uC815\uC138 \uBCC0\uD654 \uC608\uCE21"
  );
  effectsSection.appendChild(effectsTitle);
  for (let i = 0; i < result.globalEffects.length; i++) {
    const effect = result.globalEffects[i];
    if (!effect) continue;
    const effItem = AppHelper.createUIElement(
      "div",
      `simEff_${i}`,
      {
        fontSize: isFullscreen ? "14px" : "13px",
        color: "#c0d8ff",
        padding: "1.2% 2%",
        marginBottom: "0.8%",
        backgroundColor: "rgba(25, 50, 90, 0.5)",
        borderRadius: "8px",
        boxSizing: "border-box",
        pointerEvents: "none",
        borderLeft: `4px solid ${sevColor}`,
        lineHeight: "1.7"
      },
      `\u25B8 ${effect}`
    );
    effectsSection.appendChild(effItem);
  }
  if (result.stockImpacts && result.stockImpacts.length > 0) {
    const stockSection = AppHelper.createUIElement("div", "simStockSection", {
      padding: "2%",
      backgroundColor: "rgba(15, 30, 65, 0.6)",
      borderRadius: "10px",
      boxSizing: "border-box",
      pointerEvents: "none",
      border: "1px solid rgba(255, 200, 60, 0.25)"
    });
    resultsSection.appendChild(stockSection);
    const stockTitle = AppHelper.createUIElement(
      "div",
      "simStockTitle",
      {
        fontSize: isFullscreen ? "18px" : "16px",
        fontWeight: "bold",
        color: "#fbbf24",
        marginBottom: "1.5%",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      st.simStockImpactTitle || "\u{1F4C9} \uAE00\uB85C\uBC8C \uAE30\uC5C5 \uC8FC\uAC00 \uC601\uD5A5 \uBD84\uC11D"
    );
    stockSection.appendChild(stockTitle);
    const stockDesc = AppHelper.createUIElement(
      "div",
      "simStockDesc",
      {
        fontSize: isFullscreen ? "13px" : "12px",
        color: "rgba(180, 210, 255, 0.6)",
        marginBottom: "1.5%",
        lineHeight: "1.5",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      st.simStockImpactDesc || "\uC2DC\uBBAC\uB808\uC774\uC158 \uACB0\uACFC\uB97C \uBC14\uD0D5\uC73C\uB85C \uAD00\uB828 \uAE00\uB85C\uBC8C \uAE30\uC5C5\uB4E4\uC758 \uC8FC\uAC00 \uBCC0\uB3D9\uC744 \uC608\uCE21\uD569\uB2C8\uB2E4. \uC2E4\uC81C \uD22C\uC790 \uC870\uC5B8\uC774 \uC544\uB2CC \uCC38\uACE0\uC6A9 \uBD84\uC11D\uC785\uB2C8\uB2E4."
    );
    stockSection.appendChild(stockDesc);
    const upStocks = result.stockImpacts.filter((s) => s.impactDirection === "up");
    const downStocks = result.stockImpacts.filter((s) => s.impactDirection === "down");
    const volatileStocks = result.stockImpacts.filter((s) => s.impactDirection === "volatile");
    const renderStockGroup = (stocks, groupLabel, groupColor, groupIcon, groupId) => {
      if (stocks.length === 0) return;
      const groupHeader = AppHelper.createUIElement(
        "div",
        `simStockGH_${groupId}`,
        {
          fontSize: isFullscreen ? "15px" : "14px",
          fontWeight: "bold",
          color: groupColor,
          marginTop: "1.5%",
          marginBottom: "1%",
          padding: "0.5% 1.5%",
          backgroundColor: groupColor + "15",
          borderRadius: "6px",
          boxSizing: "border-box",
          pointerEvents: "none",
          borderLeft: `4px solid ${groupColor}`
        },
        `${groupIcon} ${groupLabel} (${stocks.length}${st.simStockCompanyUnit || "\uAC1C \uAE30\uC5C5"})`
      );
      stockSection.appendChild(groupHeader);
      for (let i = 0; i < stocks.length; i++) {
        const stock = stocks[i];
        const card = AppHelper.createUIElement("div", `simStock_${groupId}_${i}`, {
          display: "flex",
          alignItems: "center",
          gap: "2%",
          padding: "1.2% 2%",
          marginBottom: "0.6%",
          backgroundColor: "rgba(20, 40, 75, 0.6)",
          borderRadius: "8px",
          boxSizing: "border-box",
          pointerEvents: "none",
          border: `1px solid ${groupColor}20`
        });
        stockSection.appendChild(card);
        const arrowIcon = stock.impactDirection === "up" ? "\u{1F4C8}" : stock.impactDirection === "down" ? "\u{1F4C9}" : "\u{1F4CA}";
        const arrowEl = AppHelper.createUIElement(
          "div",
          `simStockA_${groupId}_${i}`,
          {
            fontSize: isFullscreen ? "20px" : "16px",
            boxSizing: "border-box",
            pointerEvents: "none",
            flexShrink: "0"
          },
          arrowIcon
        );
        card.appendChild(arrowEl);
        const infoCol = AppHelper.createUIElement("div", `simStockI_${groupId}_${i}`, {
          flex: "1",
          minWidth: "0",
          boxSizing: "border-box",
          pointerEvents: "none"
        });
        card.appendChild(infoCol);
        const companyRow = AppHelper.createUIElement("div", `simStockCR_${groupId}_${i}`, {
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexWrap: "wrap",
          boxSizing: "border-box",
          pointerEvents: "none"
        });
        infoCol.appendChild(companyRow);
        const companyName = AppHelper.createUIElement(
          "span",
          `simStockCN_${groupId}_${i}`,
          {
            fontSize: isFullscreen ? "14px" : "13px",
            fontWeight: "bold",
            color: "#ffffff",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          stock.company
        );
        companyRow.appendChild(companyName);
        if (stock.ticker !== "-") {
          const tickerBadge = AppHelper.createUIElement(
            "span",
            `simStockTk_${groupId}_${i}`,
            {
              fontSize: "10px",
              color: "rgba(180, 210, 255, 0.7)",
              backgroundColor: "rgba(40, 70, 120, 0.6)",
              padding: "1px 5px",
              borderRadius: "3px",
              boxSizing: "border-box",
              pointerEvents: "none",
              fontFamily: "monospace"
            },
            stock.ticker
          );
          companyRow.appendChild(tickerBadge);
        }
        const sectorBadge = AppHelper.createUIElement(
          "span",
          `simStockSc_${groupId}_${i}`,
          {
            fontSize: "10px",
            color: res.color,
            backgroundColor: res.color + "20",
            padding: "1px 5px",
            borderRadius: "3px",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          stock.sector
        );
        companyRow.appendChild(sectorBadge);
        if (stock.country !== "-") {
          const countryBadge = AppHelper.createUIElement(
            "span",
            `simStockCo_${groupId}_${i}`,
            {
              fontSize: "10px",
              color: "rgba(180, 210, 255, 0.5)",
              boxSizing: "border-box",
              pointerEvents: "none"
            },
            `\u{1F310} ${stock.country}`
          );
          companyRow.appendChild(countryBadge);
        }
        const reasonEl = AppHelper.createUIElement(
          "div",
          `simStockR_${groupId}_${i}`,
          {
            fontSize: isFullscreen ? "12px" : "11px",
            color: "rgba(180, 210, 255, 0.7)",
            marginTop: "0.3%",
            lineHeight: "1.4",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          stock.reason
        );
        infoCol.appendChild(reasonEl);
        const pctColor = stock.impactDirection === "up" ? "#4ecdc4" : stock.impactDirection === "down" ? "#ff6b6b" : "#ffe66d";
        const pctSign = stock.impactDirection === "up" ? "+" : stock.impactDirection === "down" ? "-" : "\xB1";
        const pctEl = AppHelper.createUIElement(
          "div",
          `simStockP_${groupId}_${i}`,
          {
            fontSize: isFullscreen ? "18px" : "15px",
            fontWeight: "bold",
            color: pctColor,
            textAlign: "right",
            minWidth: "70px",
            flexShrink: "0",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          `${pctSign}${stock.impactPercent.toFixed(1)}%`
        );
        card.appendChild(pctEl);
      }
    };
    renderStockGroup(upStocks, st.simStockUp || "\uC8FC\uAC00 \uC0C1\uC2B9 \uC608\uC0C1", "#4ecdc4", "\u{1F7E2}", "up");
    renderStockGroup(downStocks, st.simStockDown || "\uC8FC\uAC00 \uD558\uB77D \uC608\uC0C1", "#ff6b6b", "\u{1F534}", "down");
    renderStockGroup(volatileStocks, st.simStockVolatile || "\uBCC0\uB3D9\uC131 \uD655\uB300 \uC608\uC0C1", "#ffe66d", "\u{1F7E1}", "volatile");
    const disclaimer = AppHelper.createUIElement(
      "div",
      "simStockDisclaimer",
      {
        fontSize: "11px",
        color: "rgba(180, 210, 255, 0.4)",
        marginTop: "1.5%",
        padding: "1% 1.5%",
        backgroundColor: "rgba(15, 25, 50, 0.5)",
        borderRadius: "6px",
        textAlign: "center",
        lineHeight: "1.5",
        boxSizing: "border-box",
        pointerEvents: "none",
        border: "1px solid rgba(80, 120, 180, 0.15)"
      },
      st.simStockDisclaimer || "\u26A0 \uBCF8 \uBD84\uC11D\uC740 \uC2DC\uBBAC\uB808\uC774\uC158 \uAE30\uBC18\uC758 \uC608\uCE21\uC774\uBA70, \uC2E4\uC81C \uC8FC\uAC00 \uBCC0\uB3D9\uACFC \uB2E4\uB97C \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uD22C\uC790 \uD310\uB2E8\uC758 \uADFC\uAC70\uB85C \uC0AC\uC6A9\uD558\uC9C0 \uB9C8\uC138\uC694."
    );
    stockSection.appendChild(disclaimer);
  }
}
function showSimulationOverlay() {
  if (!textData || !appData || !uiLayer) return;
  const existingOverlay = document.getElementById("simOverlay");
  if (existingOverlay && existingOverlay.parentNode) {
    existingOverlay.parentNode.removeChild(existingOverlay);
    const idx = activeUIElements.indexOf(existingOverlay);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const st = textData;
  const overlay = AppHelper.createUIElement("div", "simOverlay", {
    position: "absolute",
    left: "3%",
    top: "3%",
    width: "94%",
    height: "94%",
    boxSizing: "border-box",
    backgroundColor: "rgba(5, 10, 35, 0.97)",
    borderRadius: "16px",
    padding: "2%",
    border: "2px solid rgba(100, 180, 255, 0.4)",
    pointerEvents: "auto",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    zIndex: "110"
  });
  uiLayer.appendChild(overlay);
  activeUIElements.push(overlay);
  const headerRow = AppHelper.createUIElement("div", "simHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(headerRow);
  const headerTitle = AppHelper.createUIElement(
    "div",
    "simTitle",
    {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#60a5fa",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.simTitle || "\u{1F52C} \uC0DD\uC0B0\uB7C9 \uBCC0\uB3D9 \uC2DC\uBBAC\uB808\uC774\uC158"
  );
  headerRow.appendChild(headerTitle);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "simClose",
    {
      padding: "1% 2%",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box"
    },
    `\u2715 ${textData.closeBtn}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showSimulation = false;
          simResult = null;
          const el = document.getElementById("simOverlay");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
            const idx2 = activeUIElements.indexOf(el);
            if (idx2 >= 0) activeUIElements.splice(idx2, 1);
          }
        }
      }
    ]
  );
  headerRow.appendChild(closeBtn);
  const controlsSection = AppHelper.createUIElement("div", "simControls", {
    display: "flex",
    flexWrap: "wrap",
    gap: "2%",
    marginBottom: "1%",
    padding: "1.5%",
    backgroundColor: "rgba(15, 30, 65, 0.7)",
    borderRadius: "12px",
    boxSizing: "border-box",
    pointerEvents: "none",
    border: "1px solid rgba(80, 150, 255, 0.2)",
    flexShrink: "0"
  });
  overlay.appendChild(controlsSection);
  const countryGroup = AppHelper.createUIElement("div", "simCountryGroup", {
    flex: "1",
    minWidth: "200px",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  controlsSection.appendChild(countryGroup);
  const countryLabel = AppHelper.createUIElement(
    "div",
    "simCountryLabel",
    {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "1%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    st.simSelectCountry || "\u{1F3F3} \uAD6D\uAC00 \uC120\uD0DD"
  );
  countryGroup.appendChild(countryLabel);
  const countryGrid = AppHelper.createUIElement("div", "simCountryGrid", {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    maxHeight: "75px",
    overflowY: "auto",
    boxSizing: "border-box",
    pointerEvents: "auto"
  });
  countryGroup.appendChild(countryGrid);
  for (const c of appData.countries) {
    const cName = textData.countryNames[c.id] || c.id;
    const isSelected = simCountryId === c.id;
    const cBtn = AppHelper.createUIElement(
      "div",
      `simC_${c.id}`,
      {
        padding: "3px 8px",
        fontSize: "12px",
        color: isSelected ? "#ffffff" : "rgba(180, 210, 255, 0.7)",
        backgroundColor: isSelected ? "rgba(60, 140, 255, 0.8)" : "rgba(20, 40, 70, 0.7)",
        borderRadius: "5px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: isSelected ? "1px solid rgba(100, 180, 255, 0.8)" : "1px solid rgba(60, 100, 160, 0.3)",
        whiteSpace: "nowrap"
      },
      cName,
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            simCountryId = c.id;
            simResourceId = null;
            simChangePercent = 0;
            simResult = null;
            showSimulationOverlay();
          }
        }
      ]
    );
    countryGrid.appendChild(cBtn);
  }
  if (simCountryId) {
    const country = appData.countries.find((c) => c.id === simCountryId);
    if (country) {
      const resGroup = AppHelper.createUIElement("div", "simResGroup", {
        flex: "1",
        minWidth: "200px",
        boxSizing: "border-box",
        pointerEvents: "none"
      });
      controlsSection.appendChild(resGroup);
      const resLabel = AppHelper.createUIElement(
        "div",
        "simResLabel",
        {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#4ecdc4",
          marginBottom: "1%",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        st.simSelectResource || "\u{1F48E} \uC790\uC6D0 \uC120\uD0DD"
      );
      resGroup.appendChild(resLabel);
      const resGrid = AppHelper.createUIElement("div", "simResGrid", {
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        maxHeight: "75px",
        overflowY: "auto",
        boxSizing: "border-box",
        pointerEvents: "auto"
      });
      resGroup.appendChild(resGrid);
      for (const cr of country.resources) {
        const res = appData.resources.find((r) => r.id === cr.resourceId);
        if (!res) continue;
        const rName = textData.resourceNames[cr.resourceId] || cr.resourceId;
        const isSelected = simResourceId === cr.resourceId;
        const rBtn = AppHelper.createUIElement(
          "div",
          `simR_${cr.resourceId}`,
          {
            padding: "3px 8px",
            fontSize: "12px",
            color: isSelected ? "#ffffff" : res.color,
            backgroundColor: isSelected ? res.color + "cc" : "rgba(20, 40, 70, 0.7)",
            borderRadius: "5px",
            cursor: "pointer",
            pointerEvents: "auto",
            boxSizing: "border-box",
            border: `1px solid ${res.color}60`,
            whiteSpace: "nowrap"
          },
          `\u25CF ${rName} (${cr.production.toLocaleString()} ${res.unit})`,
          [
            {
              event: "pointerup",
              handler: () => {
                playClickSound();
                simResourceId = cr.resourceId;
                simChangePercent = 0;
                simResult = null;
                showSimulationOverlay();
              }
            }
          ]
        );
        resGrid.appendChild(rBtn);
      }
    }
  }
  if (simCountryId && simResourceId) {
    const sliderSection = AppHelper.createUIElement("div", "simSliderSection", {
      width: "100%",
      marginTop: "1%",
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    controlsSection.appendChild(sliderSection);
    const sliderLabel = AppHelper.createUIElement(
      "div",
      "simSliderLabel",
      {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#ffe66d",
        marginBottom: "1%",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      st.simProductionChange || "\u2699 \uC0DD\uC0B0\uB7C9 \uBCC0\uB3D9"
    );
    sliderSection.appendChild(sliderLabel);
    const sliderRow = AppHelper.createUIElement("div", "simSliderRow", {
      display: "flex",
      alignItems: "center",
      gap: "2%",
      boxSizing: "border-box",
      pointerEvents: "auto"
    });
    sliderSection.appendChild(sliderRow);
    const minLabel = AppHelper.createUIElement(
      "span",
      "simMinLabel",
      {
        fontSize: "12px",
        color: "#ff6b6b",
        boxSizing: "border-box",
        pointerEvents: "none",
        whiteSpace: "nowrap"
      },
      "-100%"
    );
    sliderRow.appendChild(minLabel);
    const slider = AppHelper.createUIElement("input", "simSlider", {
      flex: "1",
      height: "8px",
      boxSizing: "border-box",
      pointerEvents: "auto",
      cursor: "pointer",
      accentColor: simChangePercent < 0 ? "#ff6b6b" : simChangePercent > 0 ? "#4ecdc4" : "#ffe66d"
    });
    slider.type = "range";
    slider.min = "-100";
    slider.max = "100";
    slider.value = String(simChangePercent);
    slider.addEventListener("input", (e) => {
      const target = e.target;
      simChangePercent = parseInt(target.value, 10);
      const changeColor2 = simChangePercent < 0 ? "#ff6b6b" : simChangePercent > 0 ? "#4ecdc4" : "#ffe66d";
      slider.style.accentColor = changeColor2;
      const disp = document.getElementById("simChangeDisplay");
      if (disp) {
        disp.innerText = `${simChangePercent > 0 ? "+" : ""}${simChangePercent}%`;
        disp.style.color = changeColor2;
      }
      const quickValues2 = [-50, -30, -10, 0, 10, 30, 50];
      for (const qv of quickValues2) {
        const qBtn = document.getElementById(`simQ_${qv + 100}`);
        if (qBtn) {
          const isActive = simChangePercent === qv;
          const qColor = qv < 0 ? "#ff6b6b" : qv > 0 ? "#4ecdc4" : "#ffe66d";
          qBtn.style.color = isActive ? "#ffffff" : qColor;
          qBtn.style.backgroundColor = isActive ? qColor + "cc" : "rgba(20, 40, 70, 0.7)";
        }
      }
    });
    sliderRow.appendChild(slider);
    const maxLabel = AppHelper.createUIElement(
      "span",
      "simMaxLabel",
      {
        fontSize: "12px",
        color: "#4ecdc4",
        boxSizing: "border-box",
        pointerEvents: "none",
        whiteSpace: "nowrap"
      },
      "+100%"
    );
    sliderRow.appendChild(maxLabel);
    const quickBtnRow = AppHelper.createUIElement("div", "simQuickBtns", {
      display: "flex",
      gap: "4px",
      marginTop: "1%",
      flexWrap: "wrap",
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    sliderSection.appendChild(quickBtnRow);
    const quickValues = [-50, -30, -10, 0, 10, 30, 50];
    for (const qv of quickValues) {
      const isActive = simChangePercent === qv;
      const qColor = qv < 0 ? "#ff6b6b" : qv > 0 ? "#4ecdc4" : "#ffe66d";
      const qBtn = AppHelper.createUIElement(
        "div",
        `simQ_${qv + 100}`,
        {
          padding: "3px 10px",
          fontSize: "12px",
          fontWeight: "bold",
          color: isActive ? "#ffffff" : qColor,
          backgroundColor: isActive ? qColor + "cc" : "rgba(20, 40, 70, 0.7)",
          borderRadius: "5px",
          cursor: "pointer",
          pointerEvents: "auto",
          boxSizing: "border-box",
          border: `1px solid ${qColor}60`
        },
        `${qv > 0 ? "+" : ""}${qv}%`,
        [
          {
            event: "pointerup",
            handler: () => {
              playClickSound();
              simChangePercent = qv;
              showSimulationOverlay();
            }
          }
        ]
      );
      quickBtnRow.appendChild(qBtn);
    }
    const changeColor = simChangePercent < 0 ? "#ff6b6b" : simChangePercent > 0 ? "#4ecdc4" : "#ffe66d";
    const bottomRow = AppHelper.createUIElement("div", "simBottomRow", {
      display: "flex",
      alignItems: "center",
      gap: "2%",
      marginTop: "1.5%",
      pointerEvents: "auto",
      boxSizing: "border-box"
    });
    sliderSection.appendChild(bottomRow);
    const changeDisplay = AppHelper.createUIElement(
      "div",
      "simChangeDisplay",
      {
        flex: "1",
        fontSize: "24px",
        fontWeight: "bold",
        color: changeColor,
        textAlign: "center",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `${simChangePercent > 0 ? "+" : ""}${simChangePercent}%`
    );
    bottomRow.appendChild(changeDisplay);
    const runBtn = AppHelper.createUIElement(
      "div",
      "simRunBtn",
      {
        flex: "2",
        padding: "1.5% 3%",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "rgba(60, 140, 255, 0.8)",
        borderRadius: "8px",
        cursor: "pointer",
        pointerEvents: "auto",
        textAlign: "center",
        boxSizing: "border-box",
        border: "1px solid rgba(100, 180, 255, 0.6)"
      },
      st.simRunButton || "\u{1F680} \uC2DC\uBBAC\uB808\uC774\uC158 \uC2E4\uD589",
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            runSimulation();
            if (simResult) {
              showSimResultFullscreen = true;
              showSimResultFullscreenModal();
            } else {
              showSimulationOverlay();
            }
          }
        }
      ]
    );
    bottomRow.appendChild(runBtn);
  }
  if (simResult) {
    const resultsWrapper = AppHelper.createUIElement("div", "simResultsWrapper", {
      flex: "1",
      minHeight: "0",
      overflowY: "auto",
      boxSizing: "border-box",
      pointerEvents: "auto",
      borderTop: "1px solid rgba(80, 150, 255, 0.2)",
      marginTop: "1%",
      paddingTop: "1.5%"
    });
    overlay.appendChild(resultsWrapper);
    renderSimulationResults(resultsWrapper, simResult);
  }
}
function runSimulation() {
  if (!appData || !textData || !simCountryId || !simResourceId) {
    simResult = null;
    return;
  }
  const country = appData.countries.find((c) => c.id === simCountryId);
  if (!country) {
    simResult = null;
    return;
  }
  const countryRes = country.resources.find((cr) => cr.resourceId === simResourceId);
  if (!countryRes) {
    simResult = null;
    return;
  }
  const res = appData.resources.find((r) => r.id === simResourceId);
  if (!res) {
    simResult = null;
    return;
  }
  const originalProd = countryRes.production;
  const change = simChangePercent / 100;
  const newProd = Math.max(0, originalProd * (1 + change));
  let totalGlobalProd = 0;
  for (const c of appData.countries) {
    for (const cr of c.resources) {
      if (cr.resourceId === simResourceId) {
        totalGlobalProd += cr.production;
      }
    }
  }
  const supplyShareBefore = totalGlobalProd > 0 ? originalProd / totalGlobalProd * 100 : 0;
  const newTotalGlobal = totalGlobalProd - originalProd + newProd;
  const supplyShareAfter = newTotalGlobal > 0 ? newProd / newTotalGlobal * 100 : 0;
  const priceHist = appData.priceHistory.find((p) => p.resourceId === simResourceId);
  const latestPrice = priceHist && priceHist.data.length > 0 ? priceHist.data[priceHist.data.length - 1].price : 0;
  const supplyChangeRatio = totalGlobalProd > 0 ? (originalProd - newProd) / totalGlobalProd : 0;
  const elasticity = 1.5 + res.strategicImportance / 10 * 2;
  const priceChangePercent = supplyChangeRatio * elasticity * 100;
  const newPrice = latestPrice * (1 + priceChangePercent / 100);
  let severity = "low";
  if (Math.abs(priceChangePercent) > 30) severity = "critical";
  else if (Math.abs(priceChangePercent) > 15) severity = "high";
  else if (Math.abs(priceChangePercent) > 5) severity = "medium";
  const effects = [];
  const countryName = textData.countryNames[simCountryId] || simCountryId;
  const resName = textData.resourceNames[simResourceId] || simResourceId;
  const simTexts = textData;
  if (simChangePercent < 0) {
    if (supplyShareBefore > 50) {
      effects.push(
        (simTexts.simEffectDominant || "").replace("{country}", countryName).replace("{resource}", resName).replace("{share}", supplyShareBefore.toFixed(1))
      );
    }
    if (Math.abs(priceChangePercent) > 20) {
      effects.push((simTexts.simEffectPriceSpike || "").replace("{percent}", Math.abs(priceChangePercent).toFixed(1)));
    }
    if (Math.abs(simChangePercent) > 30) {
      effects.push((simTexts.simEffectSupplyChain || "").replace("{resource}", resName));
    }
    if (res.strategicImportance >= 9) {
      effects.push((simTexts.simEffectStrategic || "").replace("{resource}", resName));
    }
    if (Math.abs(simChangePercent) > 50) {
      effects.push((simTexts.simEffectAlternative || "").replace("{resource}", resName));
    }
    if (supplyShareBefore > 30 && Math.abs(simChangePercent) > 20) {
      effects.push((simTexts.simEffectGeopolitical || "").replace("{country}", countryName));
    }
  } else if (simChangePercent > 0) {
    if (priceChangePercent < -10) {
      effects.push((simTexts.simEffectPriceDrop || "").replace("{percent}", Math.abs(priceChangePercent).toFixed(1)));
    }
    if (simChangePercent > 30) {
      effects.push((simTexts.simEffectOversupply || "").replace("{resource}", resName));
    }
    if (simChangePercent > 20) {
      effects.push((simTexts.simEffectCompetitors || "").replace("{country}", countryName));
    }
    if (supplyShareAfter > supplyShareBefore + 10) {
      effects.push(
        (simTexts.simEffectMarketPower || "").replace("{country}", countryName).replace("{share}", supplyShareAfter.toFixed(1))
      );
    }
    if (simChangePercent > 50 && res.strategicImportance >= 8) {
      effects.push((simTexts.simEffectStockpile || "").replace("{resource}", resName));
    }
  }
  if (effects.length === 0) {
    effects.push(simTexts.simEffectMinimal || "\uBCC0\uD654\uAC00 \uBBF8\uBBF8\uD558\uC5EC \uC138\uACC4 \uC2DC\uC7A5\uC5D0 \uD070 \uC601\uD5A5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  const stockImpacts = generateStockImpacts(simResourceId, priceChangePercent, simChangePercent, severity);
  simResult = {
    countryId: simCountryId,
    resourceId: simResourceId,
    originalProduction: originalProd,
    newProduction: Math.round(newProd),
    changePercent: simChangePercent,
    priceImpact: priceChangePercent,
    newPrice: Math.round(newPrice * 100) / 100,
    originalPrice: latestPrice,
    globalEffects: effects,
    supplyShareBefore,
    supplyShareAfter,
    severity,
    stockImpacts
  };
}
function getTabLabel() {
  if (!textData) return "";
  switch (currentRankingTab) {
    case "production" /* PRODUCTION */:
      return textData.tabProduction;
    case "reserves" /* RESERVES */:
      return textData.tabReserves;
    case "mining" /* MINING */:
      return textData.tabMining;
    case "consumption" /* CONSUMPTION */:
      return textData.tabConsumption || "\uC18C\uBE44\uB7C9";
    default:
      return textData.tabProduction;
  }
}
function getResourceValue(cr) {
  switch (currentRankingTab) {
    case "production" /* PRODUCTION */:
      return cr.production;
    case "reserves" /* RESERVES */:
      return cr.reserves;
    case "mining" /* MINING */:
      return cr.mining;
    case "consumption" /* CONSUMPTION */:
      return cr.consumption || 0;
    default:
      return cr.production;
  }
}
function generateStars(count, width, height) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      brightness: 0.3 + Math.random() * 0.7,
      size: 0.5 + Math.random() * 2
    });
  }
}
function drawStarField(c, w, h, time) {
  const gradient = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.8);
  gradient.addColorStop(0, "#0a0e27");
  gradient.addColorStop(0.5, "#060a1a");
  gradient.addColorStop(1, "#020410");
  c.fillStyle = gradient;
  c.fillRect(0, 0, w, h);
  for (const star of stars) {
    const twinkle = 0.5 + 0.5 * Math.sin(time * 2 + star.x * 0.01 + star.y * 0.01);
    const alpha = star.brightness * twinkle;
    c.beginPath();
    c.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    c.fillStyle = `rgba(200, 220, 255, ${alpha})`;
    c.fill();
  }
}
function latLngTo3D(lat, lng, radius) {
  const latRad = lat * Math.PI / 180;
  const lngRad = lng * Math.PI / 180;
  return {
    x: radius * Math.cos(latRad) * Math.sin(lngRad),
    y: -radius * Math.sin(latRad),
    z: radius * Math.cos(latRad) * Math.cos(lngRad)
  };
}
function rotateY(point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos
  };
}
function rotateX(point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos
  };
}
function project3D(point, cx, cy, fov) {
  const perspective = fov / (fov + point.z);
  return {
    x: cx + point.x * perspective,
    y: cy + point.y * perspective,
    scale: perspective
  };
}
function drawGlobe(c, w, h, time) {
  if (!appData || !textData) return;
  const cx = w / 2;
  const cy = h / 2;
  const baseRadius = appData.globeRadius * zoomLevel;
  const fov = 800;
  c.imageSmoothingEnabled = true;
  c.imageSmoothingQuality = "high";
  const globeGrad = c.createRadialGradient(
    cx - baseRadius * 0.3,
    cy - baseRadius * 0.3,
    baseRadius * 0.1,
    cx,
    cy,
    baseRadius
  );
  globeGrad.addColorStop(0, "#1a3a5c");
  globeGrad.addColorStop(0.4, "#0d2847");
  globeGrad.addColorStop(0.8, "#061a33");
  globeGrad.addColorStop(1, "#030d1a");
  c.beginPath();
  c.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  c.fillStyle = globeGrad;
  c.fill();
  const atmosGrad = c.createRadialGradient(cx, cy, baseRadius * 0.95, cx, cy, baseRadius * 1.15);
  atmosGrad.addColorStop(0, "rgba(60, 140, 255, 0.15)");
  atmosGrad.addColorStop(0.5, "rgba(40, 100, 200, 0.08)");
  atmosGrad.addColorStop(1, "rgba(20, 60, 150, 0)");
  c.beginPath();
  c.arc(cx, cy, baseRadius * 1.15, 0, Math.PI * 2);
  c.fillStyle = atmosGrad;
  c.fill();
  c.strokeStyle = "rgba(60, 130, 200, 0.15)";
  c.lineWidth = 0.5;
  for (let lat = -80; lat <= 80; lat += 20) {
    c.beginPath();
    let started = false;
    for (let lng = -180; lng <= 180; lng += 5) {
      let pt = latLngTo3D(lat, lng, baseRadius);
      pt = rotateY(pt, globeRotation.rotY);
      pt = rotateX(pt, globeRotation.rotX);
      if (pt.z < 0) {
        const proj = project3D(pt, cx, cy, fov);
        if (!started) {
          c.moveTo(proj.x, proj.y);
          started = true;
        } else {
          c.lineTo(proj.x, proj.y);
        }
      } else {
        started = false;
      }
    }
    c.stroke();
  }
  for (let lng = -180; lng < 180; lng += 20) {
    c.beginPath();
    let started = false;
    for (let lat = -90; lat <= 90; lat += 5) {
      let pt = latLngTo3D(lat, lng, baseRadius);
      pt = rotateY(pt, globeRotation.rotY);
      pt = rotateX(pt, globeRotation.rotX);
      if (pt.z < 0) {
        const proj = project3D(pt, cx, cy, fov);
        if (!started) {
          c.moveTo(proj.x, proj.y);
          started = true;
        } else {
          c.lineTo(proj.x, proj.y);
        }
      } else {
        started = false;
      }
    }
    c.stroke();
  }
  drawContinentOutlines(c, cx, cy, baseRadius, fov);
  projectedCountries = [];
  const resMap = /* @__PURE__ */ new Map();
  for (const r of appData.resources) {
    resMap.set(r.id, r);
  }
  let maxProd = 0;
  for (const country of appData.countries) {
    for (const cr of country.resources) {
      if (!selectedResourceId || cr.resourceId === selectedResourceId) {
        const val = getResourceValue(cr);
        if (val > maxProd) maxProd = val;
      }
    }
  }
  for (const country of appData.countries) {
    let pt = latLngTo3D(country.lat, country.lng, baseRadius);
    pt = rotateY(pt, globeRotation.rotY);
    pt = rotateX(pt, globeRotation.rotX);
    const visible = pt.z < 0;
    const proj = project3D(pt, cx, cy, fov);
    let totalProd = 0;
    let primaryColor = "#ffffff";
    let maxResProd = 0;
    for (const cr of country.resources) {
      if (!selectedResourceId || cr.resourceId === selectedResourceId) {
        const val = getResourceValue(cr);
        totalProd += val;
        if (val > maxResProd) {
          maxResProd = val;
          const res = resMap.get(cr.resourceId);
          if (res) {
            primaryColor = res.color;
          }
        }
      }
    }
    if (totalProd === 0) continue;
    const dotRadius = 4 + totalProd / (maxProd || 1) * 20;
    const scaledRadius = dotRadius * proj.scale;
    const safeScaledRadius = Math.max(0.5, scaledRadius);
    projectedCountries.push({
      country,
      x: proj.x,
      y: proj.y,
      z: pt.z,
      radius: safeScaledRadius,
      visible
    });
    if (!visible) continue;
    const isHovered = hoveredCountryId === country.id;
    const isSelected = selectedCountryId === country.id;
    const pulseScale = isHovered ? 1.2 + 0.1 * Math.sin(time * 5) : 1;
    const finalRadius = Math.max(0.5, safeScaledRadius * pulseScale);
    const glowRadius = Math.max(1, finalRadius * 2);
    const glowGrad = c.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, glowRadius);
    glowGrad.addColorStop(0, primaryColor + "60");
    glowGrad.addColorStop(1, primaryColor + "00");
    c.beginPath();
    c.arc(proj.x, proj.y, glowRadius, 0, Math.PI * 2);
    c.fillStyle = glowGrad;
    c.fill();
    const dotGrad = c.createRadialGradient(
      proj.x - finalRadius * 0.2,
      proj.y - finalRadius * 0.2,
      0,
      proj.x,
      proj.y,
      finalRadius
    );
    dotGrad.addColorStop(0, "#ffffff");
    dotGrad.addColorStop(0.3, primaryColor);
    dotGrad.addColorStop(1, primaryColor + "80");
    c.beginPath();
    c.arc(proj.x, proj.y, finalRadius, 0, Math.PI * 2);
    c.fillStyle = dotGrad;
    c.fill();
    if (isSelected) {
      c.strokeStyle = "#ffffff";
      c.lineWidth = 2;
      c.stroke();
    }
    if (finalRadius > 6 || isHovered) {
      const countryName = textData.countryNames[country.id] || country.id;
      const labelFontPx = Math.max(13, Math.min(18, Math.round(finalRadius * 1.05)));
      drawSharpCountryLabel(c, countryName, proj.x, proj.y - finalRadius - 4, labelFontPx);
    }
    if (isSelected && !selectedResourceId) {
      let angle = -Math.PI / 2;
      const segRadius = Math.max(1, finalRadius + 8);
      for (const cr of country.resources) {
        const res = resMap.get(cr.resourceId);
        if (!res) continue;
        const val = getResourceValue(cr);
        const segAngle = val / totalProd * Math.PI * 2;
        c.beginPath();
        c.moveTo(proj.x, proj.y);
        c.arc(proj.x, proj.y, segRadius, angle, angle + segAngle);
        c.closePath();
        c.fillStyle = res.color + "90";
        c.fill();
        c.strokeStyle = res.color;
        c.lineWidth = 1;
        c.stroke();
        angle += segAngle;
      }
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    const alpha = p.life / p.maxLife;
    const particleRadius = Math.max(0.1, 2 * alpha);
    c.beginPath();
    c.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
    c.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
    c.fill();
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  const reflGrad = c.createRadialGradient(cx - baseRadius * 0.4, cy - baseRadius * 0.4, 0, cx, cy, baseRadius);
  reflGrad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
  reflGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.02)");
  reflGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  c.beginPath();
  c.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  c.fillStyle = reflGrad;
  c.fill();
}
function drawContinentOutlines(c, cx, cy, radius, fov) {
  const continents = [
    // North America
    [
      [-168, 65],
      [-160, 70],
      [-156, 71],
      [-140, 70],
      [-130, 70],
      [-120, 70],
      [-110, 68],
      [-100, 68],
      [-90, 65],
      [-82, 63],
      [-90, 60],
      [-85, 55],
      [-80, 52],
      [-78, 60],
      [-75, 62],
      [-65, 60],
      [-60, 58],
      [-56, 53],
      [-60, 46],
      [-65, 43],
      [-70, 42],
      [-74, 40],
      [-75, 35],
      [-80, 26],
      [-82, 25],
      [-82, 28],
      [-84, 30],
      [-88, 30],
      [-90, 29],
      [-95, 28],
      [-97, 27],
      [-97, 22],
      [-90, 21],
      [-87, 21],
      [-88, 16],
      [-84, 15],
      [-82, 10],
      [-80, 9],
      [-83, 8],
      [-85, 10],
      [-88, 13],
      [-95, 16],
      [-100, 17],
      [-105, 20],
      [-107, 23],
      [-110, 23],
      [-114, 28],
      [-117, 32],
      [-120, 34],
      [-122, 37],
      [-124, 40],
      [-124, 45],
      [-125, 48],
      [-123, 49],
      [-128, 51],
      [-130, 54],
      [-135, 57],
      [-140, 60],
      [-150, 60],
      [-152, 57],
      [-160, 55],
      [-165, 60],
      [-168, 65]
    ],
    // South America
    [
      [-80, 9],
      [-74, 11],
      [-71, 12],
      [-65, 10],
      [-60, 8],
      [-52, 4],
      [-50, 1],
      [-44, -2],
      [-35, -5],
      [-35, -9],
      [-39, -14],
      [-40, -20],
      [-41, -22],
      [-48, -27],
      [-56, -35],
      [-62, -39],
      [-65, -43],
      [-68, -50],
      [-68, -54],
      [-67, -56],
      [-70, -55],
      [-75, -50],
      [-73, -40],
      [-73, -36],
      [-71, -30],
      [-70, -20],
      [-75, -15],
      [-77, -12],
      [-81, -4],
      [-79, 1],
      [-77, 4],
      [-78, 7],
      [-80, 9]
    ],
    // Europe & Russia & Asia Main (Connected)
    [
      [-9, 39],
      [-9, 43],
      [-2, 43],
      [-2, 47],
      [-5, 48],
      [-1, 49],
      [2, 51],
      [4, 52],
      [8, 54],
      [8, 57],
      [10, 57],
      [10, 54],
      [12, 54],
      [14, 54],
      [19, 54],
      [24, 57],
      [24, 60],
      [30, 60],
      [28, 65],
      [22, 65],
      [18, 59],
      [16, 56],
      [12, 58],
      [10, 59],
      [5, 59],
      [5, 62],
      [10, 64],
      [14, 67],
      [20, 70],
      [30, 70],
      [40, 66],
      [45, 68],
      [50, 69],
      [60, 70],
      [70, 72],
      [85, 73],
      [105, 76],
      [130, 72],
      [160, 70],
      [170, 68],
      [179, 65],
      [170, 62],
      [163, 60],
      [162, 56],
      [156, 51],
      [155, 60],
      [142, 59],
      [135, 55],
      [140, 50],
      [138, 45],
      [131, 42],
      [130, 42],
      [129, 38],
      [129, 35],
      [126, 34],
      [125, 37],
      [125, 39],
      [124, 40],
      [121, 39],
      [117, 39],
      [119, 38],
      [120, 34],
      [122, 30],
      [119, 25],
      [116, 23],
      [113, 22],
      [110, 20],
      [108, 21],
      [106, 20],
      [108, 16],
      [109, 12],
      [106, 9],
      [104, 8],
      [104, 10],
      [101, 12],
      [101, 7],
      [104, 2],
      [103, 1],
      [100, 4],
      [98, 10],
      [97, 15],
      [94, 16],
      [91, 22],
      [88, 21],
      [85, 19],
      [80, 13],
      [77, 8],
      [76, 10],
      [73, 19],
      [72, 21],
      [67, 25],
      [61, 25],
      [56, 27],
      [51, 28],
      [49, 30],
      [48, 29],
      [51, 25],
      [56, 26],
      [59, 22],
      [55, 17],
      [50, 15],
      [45, 12],
      [43, 13],
      [39, 21],
      [37, 25],
      [35, 29],
      [34, 28],
      [32, 30],
      [30, 31],
      [20, 32],
      [15, 32],
      [10, 37],
      [3, 36],
      [-6, 36],
      [-9, 37],
      [-9, 39]
    ],
    // Africa
    [
      [32, 30],
      [34, 25],
      [37, 20],
      [39, 15],
      [43, 12],
      [45, 11],
      [51, 10],
      [46, 2],
      [39, -5],
      [40, -10],
      [40, -15],
      [35, -20],
      [31, -30],
      [28, -33],
      [20, -35],
      [18, -34],
      [14, -20],
      [12, -15],
      [12, -6],
      [9, 0],
      [9, 4],
      [7, 4],
      [2, 6],
      [-4, 5],
      [-8, 4],
      [-14, 9],
      [-17, 15],
      [-16, 23],
      [-10, 30],
      [-6, 34],
      [-6, 36],
      [3, 36],
      [10, 37],
      [15, 32],
      [20, 32],
      [30, 31],
      [32, 30]
    ],
    // Mediterranean details (Black Sea, Italy, Greece outlines)
    [
      [30, 46],
      [33, 46],
      [34, 44],
      [36, 45],
      [39, 47],
      [37, 44],
      [42, 42],
      [35, 41],
      [28, 43],
      [29, 41],
      [27, 41],
      [24, 40],
      [23, 37],
      [19, 41],
      [16, 43],
      [14, 45],
      [12, 45],
      [18, 41],
      [18, 40],
      [16, 38],
      [14, 41],
      [10, 43],
      [9, 44],
      [5, 43],
      [3, 42],
      [0, 38],
      [-6, 36]
    ],
    // British Isles
    [
      [-5, 50],
      [-6, 51],
      [-5, 52],
      [-4, 53],
      [-5, 55],
      [-6, 56],
      [-5, 58],
      [-3, 59],
      [-2, 57],
      [-1, 55],
      [0, 53],
      [1, 52],
      [1, 51],
      [-3, 51],
      [-5, 50]
    ],
    // Ireland
    [
      [-10, 52],
      [-10, 54],
      [-8, 55],
      [-6, 54],
      [-6, 52],
      [-8, 51],
      [-10, 52]
    ],
    // Japan
    [
      [130, 31],
      [129, 33],
      [131, 34],
      [132, 34],
      [135, 34],
      [137, 34],
      [139, 35],
      [141, 37],
      [142, 40],
      [141, 41],
      [140, 41],
      [139, 38],
      [136, 36],
      [133, 35],
      [130, 33]
    ],
    // Hokkaido
    [
      [140, 41],
      [140, 43],
      [141, 45],
      [143, 44],
      [145, 43],
      [143, 42],
      [141, 42],
      [140, 41]
    ],
    // Australia
    [
      [114, -22],
      [113, -26],
      [114, -28],
      [115, -34],
      [118, -35],
      [122, -34],
      [130, -32],
      [135, -34],
      [138, -35],
      [140, -38],
      [144, -38],
      [147, -39],
      [150, -37],
      [151, -34],
      [153, -28],
      [153, -25],
      [150, -22],
      [147, -19],
      [145, -16],
      [143, -11],
      [141, -12],
      [136, -15],
      [136, -12],
      [130, -12],
      [125, -14],
      [122, -17],
      [119, -20],
      [114, -22]
    ],
    // Madagascar
    [
      [44, -13],
      [47, -13],
      [50, -15],
      [50, -20],
      [47, -25],
      [44, -25],
      [43, -20],
      [44, -15],
      [44, -13]
    ],
    // New Zealand (North & South combined approximation)
    [
      [173, -35],
      [176, -37],
      [178, -38],
      [176, -41],
      [173, -41],
      [171, -42],
      [167, -46],
      [166, -45],
      [171, -40],
      [173, -39],
      [173, -35]
    ],
    // Borneo
    [
      [109, 1],
      [112, 2],
      [114, 3],
      [118, 5],
      [119, 6],
      [117, 7],
      [115, 5],
      [112, 1],
      [110, -2],
      [108, -1],
      [109, 1]
    ],
    // Sumatra
    [
      [95, 6],
      [99, 2],
      [104, -4],
      [106, -6],
      [103, -4],
      [97, 1],
      [95, 6]
    ],
    // Java
    [
      [106, -6],
      [111, -7],
      [114, -8],
      [112, -8],
      [108, -7],
      [106, -6]
    ],
    // Sulawesi
    [
      [119, -2],
      [121, 1],
      [124, 0],
      [122, -2],
      [121, -5],
      [120, -3],
      [119, -2]
    ],
    // Papua New Guinea
    [
      [131, -2],
      [135, -4],
      [141, -6],
      [147, -7],
      [150, -9],
      [146, -8],
      [140, -7],
      [134, -5],
      [131, -3],
      [131, -2]
    ],
    // Philippines
    [
      [117, 7],
      [119, 10],
      [122, 16],
      [122, 18],
      [120, 16],
      [118, 12],
      [117, 7]
    ],
    // Taiwan
    [
      [120, 22],
      [122, 25],
      [120, 24],
      [120, 22]
    ],
    // Iceland
    [
      [-24, 64],
      [-20, 65],
      [-16, 66],
      [-14, 65],
      [-14, 64],
      [-21, 64],
      [-24, 64]
    ],
    // Greenland
    [
      [-55, 60],
      [-48, 61],
      [-40, 64],
      [-30, 68],
      [-20, 74],
      [-20, 78],
      [-30, 80],
      [-50, 81],
      [-60, 73],
      [-55, 68],
      [-50, 64],
      [-55, 60]
    ],
    // Svalbard
    [
      [10, 77],
      [17, 78],
      [22, 80],
      [16, 79],
      [10, 77]
    ],
    // Cuba
    [
      [-85, 22],
      [-81, 23],
      [-75, 20],
      [-80, 21],
      [-85, 22]
    ]
  ];
  c.fillStyle = "rgba(35, 90, 55, 0.12)";
  for (const continent of continents) {
    c.beginPath();
    let started = false;
    let allVisible = true;
    const projPoints = [];
    for (let i = 0; i < continent.length; i++) {
      const coord = continent[i];
      let pt = latLngTo3D(coord[1], coord[0], radius);
      pt = rotateY(pt, globeRotation.rotY);
      pt = rotateX(pt, globeRotation.rotX);
      if (pt.z < 0) {
        const proj = project3D(pt, cx, cy, fov);
        projPoints.push(proj);
        if (!started) {
          c.moveTo(proj.x, proj.y);
          started = true;
        } else {
          c.lineTo(proj.x, proj.y);
        }
      } else {
        allVisible = false;
      }
    }
    if (started && projPoints.length > 2) {
      c.closePath();
      c.fill();
    }
  }
  c.strokeStyle = "rgba(70, 170, 110, 0.5)";
  c.lineWidth = 1.5;
  c.lineJoin = "round";
  c.lineCap = "round";
  for (const continent of continents) {
    c.beginPath();
    let started = false;
    let prevVisible = false;
    for (let i = 0; i < continent.length; i++) {
      const coord = continent[i];
      let pt = latLngTo3D(coord[1], coord[0], radius);
      pt = rotateY(pt, globeRotation.rotY);
      pt = rotateX(pt, globeRotation.rotX);
      const isVisible = pt.z < 0;
      if (isVisible) {
        const proj = project3D(pt, cx, cy, fov);
        if (!started || !prevVisible) {
          c.moveTo(proj.x, proj.y);
          started = true;
        } else {
          c.lineTo(proj.x, proj.y);
        }
      }
      prevVisible = isVisible;
    }
    c.stroke();
  }
  c.strokeStyle = "rgba(50, 140, 90, 0.2)";
  c.lineWidth = 3;
  for (const continent of continents) {
    c.beginPath();
    let started = false;
    let prevVisible = false;
    for (let i = 0; i < continent.length; i++) {
      const coord = continent[i];
      let pt = latLngTo3D(coord[1], coord[0], radius);
      pt = rotateY(pt, globeRotation.rotY);
      pt = rotateX(pt, globeRotation.rotX);
      const isVisible = pt.z < 0;
      if (isVisible) {
        const proj = project3D(pt, cx, cy, fov);
        if (!started || !prevVisible) {
          c.moveTo(proj.x, proj.y);
          started = true;
        } else {
          c.lineTo(proj.x, proj.y);
        }
      }
      prevVisible = isVisible;
    }
    c.stroke();
  }
}
function drawTitleScreen(c, w, h, time) {
  if (!textData) return;
  drawStarField(c, w, h, time);
  const cx = w / 2;
  const cy = h / 2;
  const globeRadius = Math.min(w, h) * 0.7;
  c.save();
  const bgGlow = c.createRadialGradient(cx, cy, 0, cx, cy, globeRadius * 1.2);
  bgGlow.addColorStop(0, "rgba(10, 25, 50, 0.4)");
  bgGlow.addColorStop(1, "rgba(2, 4, 10, 0)");
  c.fillStyle = bgGlow;
  c.fillRect(0, 0, w, h);
  const fov = 1200;
  const rotY = time * 0.05;
  const rotX = 0.2 + Math.sin(time * 0.03) * 0.1;
  c.lineWidth = 1;
  c.strokeStyle = "rgba(80, 140, 220, 0.15)";
  const drawPath = (latStart, latEnd, latStep, lngStart, lngEnd, lngStep, isLatLine) => {
    if (isLatLine) {
      for (let lat = latStart; lat <= latEnd; lat += latStep) {
        c.beginPath();
        let started = false;
        for (let lng = lngStart; lng <= lngEnd; lng += lngStep) {
          let pt = latLngTo3D(lat, lng, globeRadius);
          pt = rotateY(pt, rotY);
          pt = rotateX(pt, rotX);
          if (pt.z < 0) {
            const proj = project3D(pt, cx, cy, fov);
            if (!started) {
              c.moveTo(proj.x, proj.y);
              started = true;
            } else {
              c.lineTo(proj.x, proj.y);
            }
          } else {
            started = false;
          }
        }
        c.stroke();
      }
    } else {
      for (let lng = lngStart; lng <= lngEnd; lng += lngStep) {
        c.beginPath();
        let started = false;
        for (let lat = latStart; lat <= latEnd; lat += latStep) {
          let pt = latLngTo3D(lat, lng, globeRadius);
          pt = rotateY(pt, rotY);
          pt = rotateX(pt, rotX);
          if (pt.z < 0) {
            const proj = project3D(pt, cx, cy, fov);
            if (!started) {
              c.moveTo(proj.x, proj.y);
              started = true;
            } else {
              c.lineTo(proj.x, proj.y);
            }
          } else {
            started = false;
          }
        }
        c.stroke();
      }
    }
  };
  drawPath(-80, 80, 10, -180, 180, 5, true);
  drawPath(-90, 90, 5, -180, 180, 10, false);
  for (let i = 0; i < 50; i++) {
    const lat = -70 + i * 137.5 % 140;
    const lng = -180 + (i * 90 + time * 10) % 360;
    let pt = latLngTo3D(lat, lng, globeRadius);
    pt = rotateY(pt, rotY);
    pt = rotateX(pt, rotX);
    if (pt.z < 0) {
      const proj = project3D(pt, cx, cy, fov);
      const depthAlpha = Math.max(0.1, 1 - Math.abs(pt.z) / globeRadius);
      const twinkle = 0.5 + 0.5 * Math.sin(time * 2 + i);
      const alpha = depthAlpha * twinkle * 0.8;
      c.beginPath();
      c.arc(proj.x, proj.y, 1.5, 0, Math.PI * 2);
      c.fillStyle = `rgba(200, 240, 255, ${alpha})`;
      c.fill();
      c.beginPath();
      c.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
      c.fillStyle = `rgba(100, 180, 255, ${alpha * 0.3})`;
      c.fill();
    }
  }
  const overlayGrad = c.createRadialGradient(cx, cy, 0, cx, cy, w * 0.4);
  overlayGrad.addColorStop(0, "rgba(5, 10, 20, 0.75)");
  overlayGrad.addColorStop(0.6, "rgba(5, 10, 20, 0.4)");
  overlayGrad.addColorStop(1, "rgba(5, 10, 20, 0)");
  c.fillStyle = overlayGrad;
  c.fillRect(0, 0, w, h);
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = `normal ${Math.floor(h * 0.022)}px sans-serif`;
  c.fillStyle = "rgba(160, 210, 255, 0.9)";
  c.fillText(textData.subtitle, cx, cy - h * 0.12);
  c.font = `bold ${Math.floor(h * 0.07)}px sans-serif`;
  c.shadowColor = "rgba(0, 0, 0, 0.9)";
  c.shadowBlur = 15;
  c.shadowOffsetY = 3;
  const titleGrad = c.createLinearGradient(0, cy - h * 0.05, 0, cy + h * 0.05);
  titleGrad.addColorStop(0, "#ffffff");
  titleGrad.addColorStop(1, "#a0c8ff");
  c.fillStyle = titleGrad;
  c.fillText(textData.title, cx, cy);
  c.shadowBlur = 0;
  c.shadowOffsetY = 0;
  const lineW = w * 0.15;
  const lineGrad = c.createLinearGradient(cx - lineW / 2, 0, cx + lineW / 2, 0);
  lineGrad.addColorStop(0, "rgba(100, 180, 255, 0)");
  lineGrad.addColorStop(0.5, "rgba(100, 180, 255, 0.8)");
  lineGrad.addColorStop(1, "rgba(100, 180, 255, 0)");
  c.fillStyle = lineGrad;
  c.fillRect(cx - lineW / 2, cy + h * 0.08, lineW, 1.5);
  const promptAlpha = 0.3 + 0.7 * Math.sin(time * 2.5);
  c.font = `normal ${Math.floor(h * 0.02)}px sans-serif`;
  c.fillStyle = `rgba(255, 255, 255, ${promptAlpha})`;
  c.fillText(textData.startPrompt, cx, cy + h * 0.18);
  c.restore();
}
function clearUI() {
  for (const el of activeUIElements) {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
  activeUIElements = [];
}
function showInstructionsUI() {
  if (!textData || !uiLayer) return;
  clearUI();
  const overlay = AppHelper.createUIElement("div", "instructOverlay", {
    position: "absolute",
    left: "0%",
    top: "0%",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(5, 10, 30, 0.85)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    boxSizing: "border-box"
  });
  uiLayer.appendChild(overlay);
  activeUIElements.push(overlay);
  const title = AppHelper.createUIElement(
    "div",
    "instructTitle",
    {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "3%",
      textAlign: "center",
      pointerEvents: "none",
      boxSizing: "border-box"
    },
    textData.instructionTitle
  );
  overlay.appendChild(title);
  for (let i = 0; i < textData.instructions.length; i++) {
    const line = AppHelper.createUIElement(
      "div",
      `instr_${i}`,
      {
        fontSize: "16px",
        color: "#c0d8ff",
        marginBottom: "1.5%",
        textAlign: "center",
        pointerEvents: "none",
        boxSizing: "border-box"
      },
      textData.instructions[i]
    );
    overlay.appendChild(line);
  }
  const startBtn = AppHelper.createUIElement(
    "div",
    "startBtn",
    {
      marginTop: "4%",
      padding: "1.5% 5%",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(40, 100, 220, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      textAlign: "center",
      boxSizing: "border-box",
      border: "1px solid rgba(100, 170, 255, 0.5)"
    },
    textData.startButton,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          currentState = 2 /* GLOBE */;
          clearUI();
          showGlobeUI();
        }
      }
    ]
  );
  overlay.appendChild(startBtn);
}
function showGlobeUI() {
  if (!textData || !appData || !uiLayer) return;
  clearUI();
  const st = textData;
  const filterPanel = AppHelper.createUIElement("div", "filterPanel", {
    position: "absolute",
    left: "2%",
    top: "2%",
    width: "96%",
    boxSizing: "border-box",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    pointerEvents: "none",
    alignItems: "center"
  });
  uiLayer.appendChild(filterPanel);
  activeUIElements.push(filterPanel);
  const allBtn = AppHelper.createUIElement(
    "div",
    "filterAll",
    {
      padding: "0.8% 2%",
      fontSize: "13px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: selectedResourceId === null ? "rgba(60, 140, 255, 0.8)" : "rgba(30, 50, 80, 0.7)",
      borderRadius: "6px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "1px solid rgba(100, 170, 255, 0.4)"
    },
    textData.allResources,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          selectedResourceId = null;
          selectedCountryId = null;
          showGlobeUI();
        }
      }
    ]
  );
  filterPanel.appendChild(allBtn);
  for (const res of appData.resources) {
    const resName = textData.resourceNames[res.id] || res.id;
    const isActive = selectedResourceId === res.id;
    const btn = AppHelper.createUIElement(
      "div",
      `filter_${res.id}`,
      {
        padding: "0.8% 2%",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: isActive ? res.color + "cc" : "rgba(30, 50, 80, 0.7)",
        borderRadius: "6px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: `1px solid ${res.color}80`
      },
      `\u25CF ${resName}`,
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            selectedResourceId = res.id;
            selectedCountryId = null;
            showGlobeUI();
          }
        }
      ]
    );
    filterPanel.appendChild(btn);
    const infoBtn = AppHelper.createUIElement(
      "div",
      `resInfo_${res.id}`,
      {
        padding: "0.8% 1%",
        fontSize: "12px",
        color: res.color,
        backgroundColor: "rgba(20, 35, 60, 0.8)",
        borderRadius: "4px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: `1px solid ${res.color}40`
      },
      "\u2139",
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            detailResourceId = res.id;
            currentResourceDetailTab = "info" /* INFO */;
            showResourceDetail = true;
            showResourceDetailOverlay();
          }
        }
      ]
    );
    filterPanel.appendChild(infoBtn);
  }
  const rankBtn = AppHelper.createUIElement(
    "div",
    "resRankOpenBtn",
    {
      padding: "0.8% 2%",
      fontSize: "13px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(200, 120, 40, 0.8)",
      borderRadius: "6px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "1px solid rgba(255, 180, 80, 0.6)"
    },
    st.resRankButton || "\u{1F3C6} \uC790\uC6D0\uBCC4 \uC21C\uC704",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showResourceRankingOverlay = true;
          rankingSelectedResourceId = null;
          currentResourceRankingTab = "top_importer" /* TOP_IMPORTER */;
          renderResourceRankingOverlay();
        }
      }
    ]
  );
  filterPanel.appendChild(rankBtn);
  if (appData.currencyValueHistory && appData.currencyValueHistory.length > 0) {
    const currencyBtn = AppHelper.createUIElement(
      "div",
      "currencyFeatureOpenBtn",
      {
        padding: "0.8% 2%",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "rgba(40, 120, 180, 0.85)",
        borderRadius: "6px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: "1px solid rgba(120, 190, 255, 0.55)"
      },
      st.currencyFeatureButton || "\u{1F4B1} \uAE30\uCD95\uD1B5\uD654 \uAC00\uCE58 \uBE44\uAD50",
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            showCurrencyFeature = true;
            hoveredCurrencyYear = null;
            showCurrencyComparisonOverlay();
          }
        }
      ]
    );
    filterPanel.appendChild(currencyBtn);
  }
  const simBtnPulseAnim = `@keyframes simBtnPulse { 0% { box-shadow: 0 0 8px rgba(160, 120, 255, 0.5), 0 0 20px rgba(160, 120, 255, 0.3); } 50% { box-shadow: 0 0 16px rgba(160, 120, 255, 0.8), 0 0 40px rgba(160, 120, 255, 0.5), 0 0 60px rgba(120, 80, 220, 0.3); } 100% { box-shadow: 0 0 8px rgba(160, 120, 255, 0.5), 0 0 20px rgba(160, 120, 255, 0.3); } }`;
  const simBtnShimmerAnim = `@keyframes simBtnShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }`;
  if (!document.getElementById("simBtnAnimStyle")) {
    const styleEl = AppHelper.createUIElement("style", "simBtnAnimStyle", {});
    styleEl.textContent = simBtnPulseAnim + " " + simBtnShimmerAnim;
    document.head.appendChild(styleEl);
  }
  const simBtn = AppHelper.createUIElement(
    "div",
    "simOpenBtn",
    {
      padding: "1.2% 3.5%",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#ffffff",
      background: "linear-gradient(135deg, rgba(120, 60, 220, 0.95) 0%, rgba(80, 40, 180, 0.95) 40%, rgba(160, 100, 255, 0.95) 100%)",
      borderRadius: "10px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "2px solid rgba(180, 140, 255, 0.7)",
      marginLeft: "auto",
      textAlign: "center",
      letterSpacing: "1px",
      animation: "simBtnPulse 2s ease-in-out infinite",
      transition: "transform 0.15s ease, filter 0.15s ease",
      position: "relative",
      textShadow: "0 1px 6px rgba(0,0,0,0.5)",
      minWidth: "180px",
      overflow: "hidden"
    },
    st.simButton || "\u{1F52C} \uC2DC\uBBAC\uB808\uC774\uC158",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showSimulation = true;
          showSimulationOverlay();
        }
      },
      {
        event: "pointerenter",
        handler: (e) => {
          const target = e.currentTarget;
          target.style.transform = "scale(1.08)";
          target.style.filter = "brightness(1.2)";
        }
      },
      {
        event: "pointerleave",
        handler: (e) => {
          const target = e.currentTarget;
          target.style.transform = "scale(1)";
          target.style.filter = "brightness(1)";
        }
      }
    ]
  );
  filterPanel.appendChild(simBtn);
  const shimmerOverlay = AppHelper.createUIElement("div", "simBtnShimmer", {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    pointerEvents: "none",
    boxSizing: "border-box",
    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
    backgroundSize: "200% 100%",
    animation: "simBtnShimmer 3s linear infinite"
  });
  simBtn.appendChild(shimmerOverlay);
  const nationSimBtn = AppHelper.createUIElement(
    "div",
    "nationSimOpenBtn",
    {
      padding: "1.2% 2.5%",
      fontSize: "15px",
      fontWeight: "bold",
      color: "#ffffff",
      background: "linear-gradient(135deg, rgba(220, 80, 80, 0.95) 0%, rgba(180, 40, 40, 0.95) 100%)",
      borderRadius: "10px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box",
      border: "2px solid rgba(255, 120, 120, 0.7)",
      marginLeft: "8px",
      textAlign: "center",
      textShadow: "0 1px 4px rgba(0,0,0,0.5)",
      transition: "transform 0.15s ease, filter 0.15s ease"
    },
    st.nationSimButton || "\u{1F30D} \uAD6D\uAC00 \uD30C\uAE09 \uBD84\uC11D",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showNationSimulation = true;
          showNationSimulationOverlay();
        }
      },
      {
        event: "pointerenter",
        handler: (e) => {
          const target = e.currentTarget;
          target.style.transform = "scale(1.05)";
          target.style.filter = "brightness(1.1)";
        }
      },
      {
        event: "pointerleave",
        handler: (e) => {
          const target = e.currentTarget;
          target.style.transform = "scale(1)";
          target.style.filter = "brightness(1)";
        }
      }
    ]
  );
  filterPanel.appendChild(nationSimBtn);
  if (selectedCountryId) {
    showCountryDetail(selectedCountryId);
  }
  showRankingPanel();
  if (selectedResourceId) {
    const res = appData.resources.find((r) => r.id === selectedResourceId);
    if (res) {
      showResourceSummaryPanel(res);
    }
  }
}
function showCountryDetail(countryId) {
  if (!textData || !appData || !uiLayer) return;
  const country = appData.countries.find((c) => c.id === countryId);
  if (!country) return;
  const panel = AppHelper.createUIElement("div", "detailPanel", {
    position: "absolute",
    right: "2%",
    top: "15%",
    width: "28%",
    minWidth: "200px",
    boxSizing: "border-box",
    backgroundColor: "rgba(10, 20, 50, 0.9)",
    borderRadius: "10px",
    padding: "2%",
    border: "1px solid rgba(80, 150, 255, 0.3)",
    pointerEvents: "auto",
    overflowY: "auto",
    maxHeight: "70%"
  });
  uiLayer.appendChild(panel);
  activeUIElements.push(panel);
  const countryName = textData.countryNames[countryId] || countryId;
  const titleEl = AppHelper.createUIElement(
    "div",
    "detailTitle",
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "3%",
      textAlign: "center",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F3F3} ${countryName}`
  );
  panel.appendChild(titleEl);
  const tabLabel = getTabLabel();
  const tabIndicator = AppHelper.createUIElement(
    "div",
    "detailTabLabel",
    {
      fontSize: "12px",
      color: "rgba(180, 210, 255, 0.7)",
      marginBottom: "2%",
      textAlign: "center",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F4CB} ${tabLabel}`
  );
  panel.appendChild(tabIndicator);
  const sorted = [...country.resources].sort((a, b) => getResourceValue(b) - getResourceValue(a));
  for (const cr of sorted) {
    if (selectedResourceId && cr.resourceId !== selectedResourceId) continue;
    const res = appData.resources.find((r) => r.id === cr.resourceId);
    if (!res) continue;
    const resName = textData.resourceNames[cr.resourceId] || cr.resourceId;
    const val = getResourceValue(cr);
    if (val === 0) continue;
    const row = AppHelper.createUIElement("div", `detail_${cr.resourceId}`, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1.5% 0",
      borderBottom: "1px solid rgba(60, 100, 160, 0.2)",
      boxSizing: "border-box",
      pointerEvents: "auto",
      cursor: "pointer"
    });
    const nameEl = AppHelper.createUIElement(
      "span",
      `detailN_${cr.resourceId}`,
      {
        fontSize: "14px",
        color: res.color,
        fontWeight: "bold",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u25CF ${resName}`
    );
    const valEl = AppHelper.createUIElement(
      "span",
      `detailV_${cr.resourceId}`,
      {
        fontSize: "13px",
        color: "#c0d8ff",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `${val.toLocaleString()} ${res.unit}`
    );
    row.appendChild(nameEl);
    row.appendChild(valEl);
    row.addEventListener("pointerup", () => {
      playClickSound();
      detailResourceId = cr.resourceId;
      currentResourceDetailTab = "info" /* INFO */;
      showResourceDetail = true;
      showResourceDetailOverlay();
    });
    panel.appendChild(row);
  }
  const closeBtn = AppHelper.createUIElement(
    "div",
    "detailClose",
    {
      marginTop: "3%",
      padding: "1.5% 3%",
      fontSize: "13px",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.7)",
      borderRadius: "6px",
      cursor: "pointer",
      pointerEvents: "auto",
      textAlign: "center",
      boxSizing: "border-box"
    },
    "\u2715 " + textData.backButton,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          selectedCountryId = null;
          showGlobeUI();
        }
      }
    ]
  );
  panel.appendChild(closeBtn);
}
function showRankingPanel() {
  if (!textData || !appData || !uiLayer) return;
  const st = textData;
  const panel = AppHelper.createUIElement("div", "rankPanel", {
    position: "absolute",
    left: "2%",
    top: "15%",
    width: isRankingPanelCollapsed ? "auto" : "22%",
    minWidth: isRankingPanelCollapsed ? "auto" : "180px",
    boxSizing: "border-box",
    backgroundColor: "rgba(10, 20, 50, 0.85)",
    borderRadius: "10px",
    padding: "1.5%",
    border: "1px solid rgba(80, 150, 255, 0.25)",
    pointerEvents: "auto",
    overflowY: isRankingPanelCollapsed ? "hidden" : "auto",
    maxHeight: "75%"
  });
  uiLayer.appendChild(panel);
  activeUIElements.push(panel);
  const topControlRow = AppHelper.createUIElement("div", "rankTopControl", {
    display: "flex",
    justifyContent: isRankingPanelCollapsed ? "center" : "flex-end",
    marginBottom: isRankingPanelCollapsed ? "0" : "4%",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  panel.appendChild(topControlRow);
  const toggleBtn = AppHelper.createUIElement(
    "div",
    "rankToggleBtn",
    {
      padding: "3px 6px",
      fontSize: "11px",
      color: "rgba(200, 230, 255, 0.8)",
      backgroundColor: "rgba(40, 80, 150, 0.4)",
      borderRadius: "4px",
      cursor: "pointer",
      pointerEvents: "auto",
      textAlign: "center",
      boxSizing: "border-box",
      border: "1px solid rgba(80, 150, 255, 0.3)",
      fontWeight: "normal"
    },
    isRankingPanelCollapsed ? "\u25B6 \uD3BC\uCE58\uAE30" : "\u25C0 \uC811\uAE30",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          isRankingPanelCollapsed = !isRankingPanelCollapsed;
          showGlobeUI();
        }
      }
    ]
  );
  topControlRow.appendChild(toggleBtn);
  if (isRankingPanelCollapsed) {
    return;
  }
  const tabContainer = AppHelper.createUIElement("div", "rankTabContainer", {
    display: "flex",
    gap: "4px",
    marginBottom: "2%",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  panel.appendChild(tabContainer);
  const tabs = [
    { key: "production" /* PRODUCTION */, label: textData.tabProduction },
    { key: "reserves" /* RESERVES */, label: textData.tabReserves },
    { key: "mining" /* MINING */, label: textData.tabMining },
    { key: "consumption" /* CONSUMPTION */, label: textData.tabConsumption || "\uC18C\uBE44\uB7C9" }
  ];
  for (const tab of tabs) {
    const isActive = currentRankingTab === tab.key;
    const tabBtn = AppHelper.createUIElement(
      "div",
      `rankTab_${tab.key}`,
      {
        flex: "1",
        padding: "1.2% 1%",
        fontSize: "11px",
        fontWeight: "bold",
        color: isActive ? "#ffffff" : "rgba(180, 210, 255, 0.6)",
        backgroundColor: isActive ? "rgba(60, 140, 255, 0.7)" : "rgba(20, 40, 70, 0.6)",
        borderRadius: "5px",
        cursor: "pointer",
        pointerEvents: "auto",
        textAlign: "center",
        boxSizing: "border-box",
        border: isActive ? "1px solid rgba(100, 180, 255, 0.6)" : "1px solid rgba(60, 100, 160, 0.3)"
      },
      tab.label,
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            currentRankingTab = tab.key;
            showGlobeUI();
          }
        }
      ]
    );
    tabContainer.appendChild(tabBtn);
  }
  const infoBtnContainer = AppHelper.createUIElement("div", "rankInfoBtnContainer", {
    marginBottom: "2%",
    boxSizing: "border-box",
    pointerEvents: "none",
    display: "flex",
    gap: "6px",
    flexDirection: "column"
  });
  panel.appendChild(infoBtnContainer);
  const termInfoBtn = AppHelper.createUIElement(
    "div",
    "rankTermInfoBtn",
    {
      padding: "2%",
      fontSize: "11px",
      color: "#ffe66d",
      backgroundColor: "rgba(60, 50, 20, 0.6)",
      borderRadius: "5px",
      cursor: "pointer",
      pointerEvents: "auto",
      textAlign: "center",
      boxSizing: "border-box",
      border: "1px solid rgba(255, 200, 100, 0.4)"
    },
    st.prodVsMiningBtn || "\u{1F4A1} \uC6A9\uC5B4 \uC124\uBA85 (\uC0DD\uC0B0\uB7C9 vs \uCC44\uAD74\uB7C9)",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showTermExplanationModal();
        }
      }
    ]
  );
  infoBtnContainer.appendChild(termInfoBtn);
  const chinaAnalysisBtn = AppHelper.createUIElement(
    "div",
    "chinaAnalysisBtn",
    {
      padding: "2%",
      fontSize: "11px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "rgba(180, 50, 50, 0.6)",
      borderRadius: "5px",
      cursor: "pointer",
      pointerEvents: "auto",
      textAlign: "center",
      boxSizing: "border-box",
      border: "1px solid rgba(255, 100, 100, 0.5)"
    },
    st.chinaConsumptionBtn || "\u{1F1E8}\u{1F1F3} \uC911\uAD6D \uC790\uC6D0 \uC18C\uBE44 \uBD84\uC11D",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showChinaConsumptionModal();
        }
      }
    ]
  );
  infoBtnContainer.appendChild(chinaAnalysisBtn);
  const toggleContainer = AppHelper.createUIElement("div", "rankDisplayToggle", {
    display: "flex",
    gap: "4px",
    marginBottom: "2%",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  panel.appendChild(toggleContainer);
  const isRawMode = currentRankingDisplayMode === "raw" /* RAW */;
  const isPercentMode = currentRankingDisplayMode === "percent" /* PERCENT */;
  const rawBtn = AppHelper.createUIElement(
    "div",
    "rankToggleRaw",
    {
      flex: "1",
      padding: "1% 1%",
      fontSize: "11px",
      fontWeight: "bold",
      color: isRawMode ? "#ffffff" : "rgba(180, 210, 255, 0.6)",
      backgroundColor: isRawMode ? "rgba(80, 160, 80, 0.7)" : "rgba(20, 40, 70, 0.6)",
      borderRadius: "5px",
      cursor: "pointer",
      pointerEvents: "auto",
      textAlign: "center",
      boxSizing: "border-box",
      border: isRawMode ? "1px solid rgba(120, 200, 120, 0.6)" : "1px solid rgba(60, 100, 160, 0.3)"
    },
    st.rankDisplayRaw || "\u{1F522} \uC218\uCE58",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          currentRankingDisplayMode = "raw" /* RAW */;
          showGlobeUI();
        }
      }
    ]
  );
  toggleContainer.appendChild(rawBtn);
  const pctBtn = AppHelper.createUIElement(
    "div",
    "rankTogglePercent",
    {
      flex: "1",
      padding: "1% 1%",
      fontSize: "11px",
      fontWeight: "bold",
      color: isPercentMode ? "#ffffff" : "rgba(180, 210, 255, 0.6)",
      backgroundColor: isPercentMode ? "rgba(200, 140, 40, 0.7)" : "rgba(20, 40, 70, 0.6)",
      borderRadius: "5px",
      cursor: "pointer",
      pointerEvents: "auto",
      textAlign: "center",
      boxSizing: "border-box",
      border: isPercentMode ? "1px solid rgba(255, 200, 80, 0.6)" : "1px solid rgba(60, 100, 160, 0.3)"
    },
    st.rankDisplayPercent || "\u{1F4CA} \uBE44\uC728(%)",
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          currentRankingDisplayMode = "percent" /* PERCENT */;
          showGlobeUI();
        }
      }
    ]
  );
  toggleContainer.appendChild(pctBtn);
  const resLabel = selectedResourceId ? textData.resourceNames[selectedResourceId] || selectedResourceId : textData.allResources;
  const tabLabel = getTabLabel();
  const displayModeLabel = isPercentMode ? st.rankDisplayPercentLabel || "\uC810\uC720\uC728 %" : st.rankDisplayRawLabel || "\uC218\uCE58";
  const titleEl = AppHelper.createUIElement(
    "div",
    "rankTitle",
    {
      fontSize: "15px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "3%",
      textAlign: "center",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F4CA} ${tabLabel} (${resLabel}) \u2014 ${displayModeLabel}`
  );
  panel.appendChild(titleEl);
  const countryTotals = [];
  let globalTotal = 0;
  for (const country of appData.countries) {
    let total = 0;
    for (const cr of country.resources) {
      if (!selectedResourceId || cr.resourceId === selectedResourceId) {
        total += getResourceValue(cr);
      }
    }
    if (total > 0) {
      countryTotals.push({ id: country.id, total });
      globalTotal += total;
    }
  }
  countryTotals.sort((a, b) => b.total - a.total);
  const top10 = countryTotals.slice(0, 10);
  if (top10.length === 0) {
    const noDataEl = AppHelper.createUIElement(
      "div",
      "rankNoData",
      {
        fontSize: "13px",
        color: "rgba(180, 210, 255, 0.5)",
        textAlign: "center",
        padding: "4% 0",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      textData.noData
    );
    panel.appendChild(noDataEl);
    return;
  }
  for (let i = 0; i < top10.length; i++) {
    const entry = top10[i];
    const countryName = textData.countryNames[entry.id] || entry.id;
    const percentValue = globalTotal > 0 ? entry.total / globalTotal * 100 : 0;
    const barWidthPercent = percentValue;
    const row = AppHelper.createUIElement(
      "div",
      `rank_${i}`,
      {
        marginBottom: "2%",
        boxSizing: "border-box",
        pointerEvents: "auto",
        cursor: "pointer"
      },
      "",
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            selectedCountryId = entry.id;
            const country = appData.countries.find((c) => c.id === entry.id);
            if (country) {
              globeRotation.targetRotY = -(country.lng * Math.PI) / 180;
              globeRotation.targetRotX = country.lat * Math.PI / 180 * 0.5 + 0.1;
              globeRotation.autoRotate = false;
            }
            showGlobeUI();
          }
        }
      ]
    );
    const label = AppHelper.createUIElement(
      "div",
      `rankL_${i}`,
      {
        fontSize: "12px",
        color: "#c0d8ff",
        marginBottom: "1%",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `${i + 1}. ${countryName}`
    );
    const barBg = AppHelper.createUIElement("div", `rankBg_${i}`, {
      width: "100%",
      height: "8px",
      backgroundColor: "rgba(30, 50, 80, 0.6)",
      borderRadius: "4px",
      overflow: "hidden",
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    const barColor = selectedResourceId ? appData.resources.find((r) => r.id === selectedResourceId)?.color || "#60a5fa" : currentRankingTab === "reserves" /* RESERVES */ ? "#4ecdc4" : currentRankingTab === "mining" /* MINING */ ? "#ffe66d" : currentRankingTab === "consumption" /* CONSUMPTION */ ? "#f472b6" : "#60a5fa";
    const barFill = AppHelper.createUIElement("div", `rankFill_${i}`, {
      width: `${barWidthPercent}%`,
      height: "100%",
      backgroundColor: barColor,
      borderRadius: "4px",
      boxSizing: "border-box",
      pointerEvents: "none",
      transition: "width 0.3s ease"
    });
    let displayText;
    if (currentRankingDisplayMode === "percent" /* PERCENT */) {
      displayText = `${percentValue.toFixed(1)}%`;
    } else {
      displayText = entry.total.toLocaleString();
    }
    const valEl = AppHelper.createUIElement(
      "div",
      `rankV_${i}`,
      {
        fontSize: "11px",
        color: "rgba(180, 210, 255, 0.7)",
        marginTop: "1%",
        boxSizing: "border-box",
        pointerEvents: "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      },
      ""
    );
    const mainVal = AppHelper.createUIElement(
      "span",
      `rankMV_${i}`,
      {
        fontSize: "11px",
        color: currentRankingDisplayMode === "percent" /* PERCENT */ ? "#fbbf24" : "rgba(180, 210, 255, 0.7)",
        fontWeight: currentRankingDisplayMode === "percent" /* PERCENT */ ? "bold" : "normal",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      displayText
    );
    valEl.appendChild(mainVal);
    const secondaryText = currentRankingDisplayMode === "percent" /* PERCENT */ ? entry.total.toLocaleString() : `${percentValue.toFixed(1)}%`;
    const secVal = AppHelper.createUIElement(
      "span",
      `rankSV_${i}`,
      {
        fontSize: "10px",
        color: "rgba(140, 170, 210, 0.5)",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      secondaryText
    );
    valEl.appendChild(secVal);
    barBg.appendChild(barFill);
    row.appendChild(label);
    row.appendChild(barBg);
    row.appendChild(valEl);
    panel.appendChild(row);
  }
  if (globalTotal > 0) {
    const totalRow = AppHelper.createUIElement(
      "div",
      "rankGlobalTotal",
      {
        marginTop: "2%",
        paddingTop: "2%",
        borderTop: "1px solid rgba(80, 150, 255, 0.2)",
        fontSize: "11px",
        color: "rgba(140, 170, 210, 0.6)",
        textAlign: "center",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `${st.rankGlobalTotal || "\u{1F310} \uC804\uCCB4 \uD569\uACC4"}: ${globalTotal.toLocaleString()}`
    );
    panel.appendChild(totalRow);
  }
}
function showResourceDetailOverlay() {
  if (!textData || !appData || !uiLayer || !detailResourceId) return;
  const existingOverlay = document.getElementById("resDetailOverlay");
  if (existingOverlay && existingOverlay.parentNode) {
    existingOverlay.parentNode.removeChild(existingOverlay);
    const idx = activeUIElements.indexOf(existingOverlay);
    if (idx >= 0) activeUIElements.splice(idx, 1);
  }
  const res = appData.resources.find((r) => r.id === detailResourceId);
  if (!res) return;
  const resName = textData.resourceNames[detailResourceId] || detailResourceId;
  const overlay = AppHelper.createUIElement("div", "resDetailOverlay", {
    position: "absolute",
    left: "5%",
    top: "5%",
    width: "90%",
    height: "90%",
    boxSizing: "border-box",
    backgroundColor: "rgba(8, 15, 40, 0.97)",
    borderRadius: "14px",
    padding: "2%",
    border: `2px solid ${res.color}60`,
    pointerEvents: "auto",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    zIndex: "100"
  });
  uiLayer.appendChild(overlay);
  activeUIElements.push(overlay);
  const headerRow = AppHelper.createUIElement("div", "resDetailHeader", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(headerRow);
  const headerTitle = AppHelper.createUIElement(
    "div",
    "resDetailTitle",
    {
      fontSize: "24px",
      fontWeight: "bold",
      color: res.color,
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u25CF ${resName}`
  );
  headerRow.appendChild(headerTitle);
  const closeBtn = AppHelper.createUIElement(
    "div",
    "resDetailClose",
    {
      padding: "1% 2%",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "rgba(100, 50, 50, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      pointerEvents: "auto",
      boxSizing: "border-box"
    },
    `\u2715 ${textData.closeBtn}`,
    [
      {
        event: "pointerup",
        handler: () => {
          playClickSound();
          showResourceDetail = false;
          detailResourceId = null;
          const el = document.getElementById("resDetailOverlay");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
            const idx2 = activeUIElements.indexOf(el);
            if (idx2 >= 0) activeUIElements.splice(idx2, 1);
          }
        }
      }
    ]
  );
  headerRow.appendChild(closeBtn);
  const tabBar = AppHelper.createUIElement("div", "resDetailTabBar", {
    display: "flex",
    gap: "8px",
    marginBottom: "1.5%",
    boxSizing: "border-box",
    pointerEvents: "none",
    flexShrink: "0"
  });
  overlay.appendChild(tabBar);
  const detailTabs = [
    { key: "info" /* INFO */, label: textData.detailTabInfo, icon: "\u{1F4CB}" },
    { key: "chart" /* CHART */, label: textData.detailTabChart, icon: "\u{1F4C8}" },
    { key: "events" /* EVENTS */, label: textData.detailTabEvents, icon: "\u{1F4F0}" }
  ];
  for (const dt of detailTabs) {
    const isActive = currentResourceDetailTab === dt.key;
    const tabBtn = AppHelper.createUIElement(
      "div",
      `resTab_${dt.key}`,
      {
        padding: "1% 3%",
        fontSize: "14px",
        fontWeight: "bold",
        color: isActive ? "#ffffff" : "rgba(180, 210, 255, 0.6)",
        backgroundColor: isActive ? res.color + "aa" : "rgba(20, 40, 70, 0.7)",
        borderRadius: "8px",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box",
        border: isActive ? `1px solid ${res.color}` : "1px solid rgba(60, 100, 160, 0.3)"
      },
      `${dt.icon} ${dt.label}`,
      [
        {
          event: "pointerup",
          handler: () => {
            playClickSound();
            currentResourceDetailTab = dt.key;
            eventsScrollOffset = 0;
            showResourceDetailOverlay();
          }
        }
      ]
    );
    tabBar.appendChild(tabBtn);
  }
  const contentArea = AppHelper.createUIElement("div", "resDetailContent", {
    flex: "1",
    overflowY: "auto",
    boxSizing: "border-box",
    pointerEvents: "auto"
  });
  overlay.appendChild(contentArea);
  if (currentResourceDetailTab === "info" /* INFO */) {
    renderResourceInfoTab(contentArea, res, resName);
  } else if (currentResourceDetailTab === "chart" /* CHART */) {
    renderResourceChartTab(contentArea, res, resName);
  } else if (currentResourceDetailTab === "events" /* EVENTS */) {
    renderResourceEventsTab(contentArea, res, resName);
  }
}
function renderResourceInfoTab(container, res, resName) {
  if (!textData || !appData) return;
  const st = textData;
  const analogies = generateResourceAnalogies(res.id);
  if (analogies.length > 0) {
    const analogySection = AppHelper.createUIElement("div", "resAnalogySection", {
      marginBottom: "2%",
      padding: "2%",
      backgroundColor: "rgba(25, 50, 90, 0.55)",
      borderRadius: "12px",
      boxSizing: "border-box",
      pointerEvents: "none",
      border: `2px solid ${res.color}40`,
      background: `linear-gradient(135deg, rgba(20, 40, 80, 0.6) 0%, rgba(30, 60, 100, 0.4) 100%)`
    });
    container.appendChild(analogySection);
    const analogyTitle = AppHelper.createUIElement(
      "div",
      "resAnalogyTitle",
      {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#fbbf24",
        marginBottom: "1.5%",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u{1F4A1} ${st.analogySectionTitle || "\uC27D\uAC8C \uC774\uD574\uD558\uAE30"} \u2014 ${resName}`
    );
    analogySection.appendChild(analogyTitle);
    const analogyDesc = AppHelper.createUIElement(
      "div",
      "resAnalogyDesc",
      {
        fontSize: "12px",
        color: "rgba(180, 210, 255, 0.6)",
        marginBottom: "1.5%",
        lineHeight: "1.5",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      st.analogySectionDesc || "\uC22B\uC790\uB9CC \uBCF4\uBA74 \uC5B4\uB824\uC6B8 \uC218 \uC788\uC5B4\uC694. \uC77C\uC0C1\uC801\uC778 \uBE44\uC720\uB85C \uC774 \uC790\uC6D0\uC758 \uADDC\uBAA8\uC640 \uC911\uC694\uC131\uC744 \uB290\uAEF4\uBCF4\uC138\uC694!"
    );
    analogySection.appendChild(analogyDesc);
    const iconList = ["\u2696\uFE0F", "\u{1F4B5}", "\u{1F50C}", "\u{1F50D}", "\u{1F3E6}", "\u{1F310}"];
    const labelList = [
      st.analogyLabelWeight || "\uC0DD\uC0B0\uB7C9 \uADDC\uBAA8",
      st.analogyLabelPrice || "\uAC00\uACA9 \uBE44\uAD50",
      st.analogyLabelUsage || "\uC77C\uC0C1 \uC18D \uC0AC\uC6A9",
      st.analogyLabelScarcity || "\uD76C\uC18C\uC131",
      st.analogyLabelReserve || "\uB9E4\uC7A5\uB7C9 \uC804\uB9DD",
      st.analogyLabelDominance || "\uB3C5\uC810 \uD604\uD669"
    ];
    for (let i = 0; i < analogies.length; i++) {
      const icon = iconList[i] || "\u{1F4CC}";
      const label = labelList[i] || "";
      const analogyCard = AppHelper.createUIElement("div", `resAnalogy_${i}`, {
        padding: "1.5% 2%",
        marginBottom: "1%",
        backgroundColor: "rgba(15, 30, 65, 0.7)",
        borderRadius: "10px",
        boxSizing: "border-box",
        pointerEvents: "none",
        borderLeft: `4px solid ${res.color}80`
      });
      analogySection.appendChild(analogyCard);
      const analogyLabelEl = AppHelper.createUIElement(
        "div",
        `resAnalogyL_${i}`,
        {
          fontSize: "13px",
          fontWeight: "bold",
          color: res.color,
          marginBottom: "0.5%",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        `${icon} ${label}`
      );
      analogyCard.appendChild(analogyLabelEl);
      const analogyText = AppHelper.createUIElement(
        "div",
        `resAnalogyT_${i}`,
        {
          fontSize: "14px",
          color: "#e0e8ff",
          lineHeight: "1.8",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        analogies[i]
      );
      analogyCard.appendChild(analogyText);
    }
  }
  const valueSection = AppHelper.createUIElement("div", "resValueSection", {
    marginBottom: "2%",
    padding: "2%",
    backgroundColor: "rgba(20, 40, 80, 0.5)",
    borderRadius: "10px",
    boxSizing: "border-box",
    pointerEvents: "none",
    border: `1px solid ${res.color}30`
  });
  container.appendChild(valueSection);
  const valueTitle = AppHelper.createUIElement(
    "div",
    "resValueTitle",
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "1.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F48E} ${textData.valueTitle}`
  );
  valueSection.appendChild(valueTitle);
  const valueDesc = AppHelper.createUIElement(
    "div",
    "resValueDesc",
    {
      fontSize: "14px",
      color: "#c0d8ff",
      lineHeight: "1.8",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    res.valueDescription
  );
  valueSection.appendChild(valueDesc);
  const importanceSection = AppHelper.createUIElement("div", "resImportanceSection", {
    marginBottom: "2%",
    padding: "2%",
    backgroundColor: "rgba(20, 40, 80, 0.5)",
    borderRadius: "10px",
    boxSizing: "border-box",
    pointerEvents: "none",
    border: `1px solid ${res.color}30`
  });
  container.appendChild(importanceSection);
  const impTitle = AppHelper.createUIElement(
    "div",
    "resImpTitle",
    {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#ffe66d",
      marginBottom: "1%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u2B50 ${textData.strategicImportance}`
  );
  importanceSection.appendChild(impTitle);
  const impEasyDesc = AppHelper.createUIElement(
    "div",
    "resImpEasyDesc",
    {
      fontSize: "13px",
      color: "rgba(200, 220, 255, 0.7)",
      marginBottom: "1%",
      lineHeight: "1.6",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    res.strategicImportance >= 9 ? st.impEasyDescCritical || "\u26A0\uFE0F \uC774 \uC790\uC6D0\uC774 \uC5C6\uC73C\uBA74 \uC2A4\uB9C8\uD2B8\uD3F0, \uC804\uAE30\uCC28, \uBBF8\uC0AC\uC77C \uAC19\uC740 \uCCA8\uB2E8 \uC81C\uD488\uC744 \uB9CC\uB4E4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uAD6D\uAC00 \uC548\uBCF4\uC640 \uC9C1\uACB0\uB418\uB294 \uCD5C\uACE0 \uC218\uC900\uC758 \uC804\uB7B5 \uC790\uC6D0\uC774\uC5D0\uC694." : res.strategicImportance >= 7 ? st.impEasyDescHigh || "\u{1F536} \uC0B0\uC5C5 \uC804\uBC18\uC5D0 \uB110\uB9AC \uC4F0\uC774\uBA70, \uACF5\uAE09\uC774 \uBD88\uC548\uC815\uD574\uC9C0\uBA74 \uC790\uB3D9\uCC28\xB7\uAC74\uC124\xB7\uC5D0\uB108\uC9C0 \uC0B0\uC5C5\uC5D0 \uD070 \uD30C\uAE09 \uD6A8\uACFC\uB97C \uC90D\uB2C8\uB2E4." : st.impEasyDescMedium || "\u{1F535} \uC911\uC694\uD55C \uC0B0\uC5C5\uC6A9 \uC18C\uC7AC\uC774\uC9C0\uB9CC, \uB300\uCCB4\uC7AC\uAC00 \uC77C\uBD80 \uC874\uC7AC\uD558\uC5EC \uACF5\uAE09 \uB9AC\uC2A4\uD06C\uAC00 \uC0C1\uB300\uC801\uC73C\uB85C \uAD00\uB9AC \uAC00\uB2A5\uD569\uB2C8\uB2E4."
  );
  importanceSection.appendChild(impEasyDesc);
  const impBarBg = AppHelper.createUIElement("div", "resImpBarBg", {
    width: "100%",
    height: "16px",
    backgroundColor: "rgba(30, 50, 80, 0.6)",
    borderRadius: "8px",
    overflow: "hidden",
    boxSizing: "border-box",
    pointerEvents: "none",
    marginTop: "1%"
  });
  importanceSection.appendChild(impBarBg);
  const impBarFill = AppHelper.createUIElement("div", "resImpBarFill", {
    width: `${res.strategicImportance * 10}%`,
    height: "100%",
    borderRadius: "8px",
    boxSizing: "border-box",
    pointerEvents: "none",
    background: `linear-gradient(90deg, ${res.color}80, ${res.color})`
  });
  impBarBg.appendChild(impBarFill);
  const impLabel = AppHelper.createUIElement(
    "div",
    "resImpLabel",
    {
      fontSize: "13px",
      color: "rgba(180, 210, 255, 0.7)",
      marginTop: "0.5%",
      textAlign: "right",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `${res.strategicImportance} / 10`
  );
  importanceSection.appendChild(impLabel);
  if (res.topProducts && res.topProducts.length > 0) {
    const topProdSection = AppHelper.createUIElement("div", "resTopProdSection", {
      padding: "2%",
      marginBottom: "2%",
      backgroundColor: "rgba(20, 40, 80, 0.5)",
      borderRadius: "10px",
      boxSizing: "border-box",
      pointerEvents: "none",
      border: `1px solid ${res.color}30`
    });
    container.appendChild(topProdSection);
    const topProdTitle = AppHelper.createUIElement(
      "div",
      "resTopProdTitle",
      {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#4ecdc4",
        marginBottom: "1.5%",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u{1F3ED} ${st.resTopProductsTitle || "\uC8FC\uC694 \uC0DD\uC0B0 \uBD84\uC57C \uBC0F \uC81C\uD488 Top 5"}`
    );
    topProdSection.appendChild(topProdTitle);
    for (let i = 0; i < res.topProducts.length; i++) {
      const item = AppHelper.createUIElement(
        "div",
        `resTopProd_${i}`,
        {
          fontSize: "13px",
          color: "#c0d8ff",
          padding: "1.2% 2%",
          marginBottom: "0.8%",
          backgroundColor: "rgba(30, 60, 100, 0.4)",
          borderRadius: "6px",
          boxSizing: "border-box",
          pointerEvents: "none",
          borderLeft: `3px solid ${res.color}`
        },
        `${i + 1}. ${res.topProducts[i]}`
      );
      topProdSection.appendChild(item);
    }
  }
  if (res.vulnerableCountries && res.vulnerableCountries.length > 0) {
    const vulCountrySection = AppHelper.createUIElement("div", "resVulCountrySection", {
      padding: "2%",
      marginBottom: "2%",
      backgroundColor: "rgba(60, 20, 20, 0.4)",
      borderRadius: "10px",
      boxSizing: "border-box",
      pointerEvents: "none",
      border: `1px solid #ff6b6b50`
    });
    container.appendChild(vulCountrySection);
    const vulCountryTitle = AppHelper.createUIElement(
      "div",
      "resVulCountryTitle",
      {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#ff6b6b",
        marginBottom: "1.5%",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u26A0\uFE0F ${st.resVulnerableCountriesTitle || "\uC218\uAE09 \uBB38\uC81C \uC2DC \uD0C0\uACA9 \uC785\uB294 \uAD6D\uAC00 Top 5"}`
    );
    vulCountrySection.appendChild(vulCountryTitle);
    const row = AppHelper.createUIElement("div", "resVulCountryRow", {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      boxSizing: "border-box"
    });
    vulCountrySection.appendChild(row);
    for (let i = 0; i < res.vulnerableCountries.length; i++) {
      const badge = AppHelper.createUIElement(
        "span",
        `resVulCountry_${i}`,
        {
          fontSize: "12px",
          color: "#ffffff",
          backgroundColor: "rgba(200, 50, 50, 0.6)",
          padding: "4px 10px",
          borderRadius: "15px",
          boxSizing: "border-box",
          border: "1px solid rgba(255, 100, 100, 0.5)"
        },
        `${i + 1}. ${res.vulnerableCountries[i]}`
      );
      row.appendChild(badge);
    }
  }
  if (res.vulnerableCompanies && res.vulnerableCompanies.length > 0) {
    const vulCompSection = AppHelper.createUIElement("div", "resVulCompSection", {
      padding: "2%",
      marginBottom: "2%",
      backgroundColor: "rgba(60, 40, 20, 0.4)",
      borderRadius: "10px",
      boxSizing: "border-box",
      pointerEvents: "none",
      border: `1px solid #ff9a7650`
    });
    container.appendChild(vulCompSection);
    const vulCompTitle = AppHelper.createUIElement(
      "div",
      "resVulCompTitle",
      {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#ff9a76",
        marginBottom: "1.5%",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u{1F3E2} ${st.resVulnerableCompaniesTitle || "\uC218\uAE09 \uBB38\uC81C \uC2DC \uD0C0\uACA9 \uC785\uB294 \uAE30\uC5C5 Top 5"}`
    );
    vulCompSection.appendChild(vulCompTitle);
    for (let i = 0; i < res.vulnerableCompanies.length; i++) {
      const item = AppHelper.createUIElement(
        "div",
        `resVulComp_${i}`,
        {
          fontSize: "13px",
          color: "#ffecd2",
          padding: "1.2% 2%",
          marginBottom: "0.8%",
          backgroundColor: "rgba(100, 50, 20, 0.3)",
          borderRadius: "6px",
          boxSizing: "border-box",
          pointerEvents: "none",
          borderLeft: `3px solid #ff9a76`
        },
        `${i + 1}. ${res.vulnerableCompanies[i]}`
      );
      vulCompSection.appendChild(item);
    }
  }
  const appSection = AppHelper.createUIElement("div", "resAppSection", {
    padding: "2%",
    backgroundColor: "rgba(20, 40, 80, 0.5)",
    borderRadius: "10px",
    boxSizing: "border-box",
    pointerEvents: "none",
    border: `1px solid ${res.color}30`
  });
  container.appendChild(appSection);
  const appTitle = AppHelper.createUIElement(
    "div",
    "resAppTitle",
    {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#4ecdc4",
      marginBottom: "1.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F527} ${textData.applicationsTitle}`
  );
  appSection.appendChild(appTitle);
  for (let i = 0; i < res.applications.length; i++) {
    const appItem = AppHelper.createUIElement(
      "div",
      `resApp_${i}`,
      {
        fontSize: "14px",
        color: "#c0d8ff",
        padding: "1% 2%",
        marginBottom: "0.8%",
        backgroundColor: "rgba(30, 60, 100, 0.4)",
        borderRadius: "6px",
        boxSizing: "border-box",
        pointerEvents: "none",
        borderLeft: `3px solid ${res.color}`
      },
      `\u25B8 ${res.applications[i]}`
    );
    appSection.appendChild(appItem);
  }
}
function renderResourceChartTab(container, res, resName) {
  if (!textData || !appData) return;
  const priceData = appData.priceHistory.find((p) => p.resourceId === res.id);
  if (!priceData || priceData.data.length === 0) {
    const noData = AppHelper.createUIElement(
      "div",
      "chartNoData",
      {
        fontSize: "16px",
        color: "rgba(180, 210, 255, 0.5)",
        textAlign: "center",
        padding: "10% 0",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      textData.noData
    );
    container.appendChild(noData);
    return;
  }
  const chartTitle = AppHelper.createUIElement(
    "div",
    "chartTitle",
    {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "1%",
      textAlign: "center",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F4C8} ${resName} - ${textData.priceChartTitle} (${priceData.priceUnit})`
  );
  container.appendChild(chartTitle);
  const chartWrapper = AppHelper.createUIElement("div", "chartWrapper", {
    width: "100%",
    height: "50%",
    minHeight: "300px",
    boxSizing: "border-box",
    pointerEvents: "auto",
    position: "relative"
  });
  container.appendChild(chartWrapper);
  const chartCanvas = AppHelper.createUIElement("canvas", "resChartCanvas", {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    borderRadius: "8px",
    backgroundColor: "rgba(10, 20, 45, 0.8)"
  });
  chartCanvas.width = 1e3;
  chartCanvas.height = 400;
  chartWrapper.appendChild(chartCanvas);
  const cctx = chartCanvas.getContext("2d");
  if (!cctx) return;
  drawPriceChart(cctx, chartCanvas.width, chartCanvas.height, priceData, res);
  const relatedEvents = appData.majorEvents.filter((ev) => ev.resourceIds.includes(res.id));
  if (relatedEvents.length > 0) {
    const eventsOnChart = AppHelper.createUIElement("div", "chartEvents", {
      marginTop: "1.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    });
    container.appendChild(eventsOnChart);
    const evTitle = AppHelper.createUIElement(
      "div",
      "chartEvTitle",
      {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#ffe66d",
        marginBottom: "1%",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      `\u{1F4CC} ${textData.eventsTitle} (${relatedEvents.length})`
    );
    eventsOnChart.appendChild(evTitle);
    const sortedEvents = [...relatedEvents].sort((a, b) => a.year - b.year);
    for (let i = 0; i < Math.min(sortedEvents.length, 8); i++) {
      const ev = sortedEvents[i];
      const evDesc = textData.eventDescriptions[String(ev.id)] || "";
      const impactLabel = textData.eventImpactLabels[ev.impact] || ev.impact;
      const impactColor = ev.impact === "up" ? "#4ecdc4" : ev.impact === "down" ? "#ff6b6b" : "#ffe66d";
      const evRow = AppHelper.createUIElement("div", `chartEv_${ev.id}`, {
        fontSize: "12px",
        color: "#c0d8ff",
        padding: "0.8% 1.5%",
        marginBottom: "0.5%",
        backgroundColor: "rgba(25, 45, 80, 0.5)",
        borderRadius: "5px",
        boxSizing: "border-box",
        pointerEvents: "none",
        borderLeft: `3px solid ${impactColor}`,
        display: "flex",
        gap: "8px",
        alignItems: "center"
      });
      const yearBadge = AppHelper.createUIElement(
        "span",
        `chartEvY_${ev.id}`,
        {
          fontSize: "11px",
          fontWeight: "bold",
          color: "#ffffff",
          backgroundColor: "rgba(60, 100, 160, 0.6)",
          padding: "2px 6px",
          borderRadius: "4px",
          boxSizing: "border-box",
          pointerEvents: "none",
          whiteSpace: "nowrap"
        },
        `${ev.year}`
      );
      const evText = AppHelper.createUIElement(
        "span",
        `chartEvT_${ev.id}`,
        {
          fontSize: "12px",
          color: "#c0d8ff",
          flex: "1",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        evDesc
      );
      const impactBadge = AppHelper.createUIElement(
        "span",
        `chartEvI_${ev.id}`,
        {
          fontSize: "11px",
          fontWeight: "bold",
          color: impactColor,
          boxSizing: "border-box",
          pointerEvents: "none",
          whiteSpace: "nowrap"
        },
        impactLabel
      );
      evRow.appendChild(yearBadge);
      evRow.appendChild(evText);
      evRow.appendChild(impactBadge);
      eventsOnChart.appendChild(evRow);
    }
  }
}
function drawPriceChart(c, w, h, priceData, res) {
  if (!appData) return;
  const padding = { top: 30, right: 40, bottom: 50, left: 70 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const data = priceData.data;
  const minYear = data[0].year;
  const maxYear = data[data.length - 1].year;
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  for (const d of data) {
    if (d.price < minPrice) minPrice = d.price;
    if (d.price > maxPrice) maxPrice = d.price;
  }
  const priceRange = maxPrice - minPrice || 1;
  const pricePad = priceRange * 0.1;
  minPrice -= pricePad;
  maxPrice += pricePad;
  c.fillStyle = "rgba(10, 20, 45, 1)";
  c.fillRect(0, 0, w, h);
  c.strokeStyle = "rgba(60, 100, 160, 0.2)";
  c.lineWidth = 1;
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + chartH / gridLines * i;
    c.beginPath();
    c.moveTo(padding.left, y);
    c.lineTo(padding.left + chartW, y);
    c.stroke();
    const priceVal = maxPrice - (maxPrice - minPrice) / gridLines * i;
    c.fillStyle = "rgba(180, 210, 255, 0.6)";
    c.font = "12px sans-serif";
    c.textAlign = "right";
    c.textBaseline = "middle";
    c.fillText(priceVal.toFixed(0), padding.left - 8, y);
  }
  c.fillStyle = "rgba(180, 210, 255, 0.6)";
  c.font = "12px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "top";
  const yearStep = Math.max(1, Math.floor(data.length / 10));
  for (let i = 0; i < data.length; i += yearStep) {
    const x = padding.left + i / (data.length - 1) * chartW;
    c.fillText(String(data[i].year), x, padding.top + chartH + 8);
    c.strokeStyle = "rgba(60, 100, 160, 0.1)";
    c.beginPath();
    c.moveTo(x, padding.top);
    c.lineTo(x, padding.top + chartH);
    c.stroke();
  }
  const areaGrad = c.createLinearGradient(0, padding.top, 0, padding.top + chartH);
  areaGrad.addColorStop(0, res.color + "40");
  areaGrad.addColorStop(1, res.color + "05");
  c.beginPath();
  c.moveTo(padding.left, padding.top + chartH);
  for (let i = 0; i < data.length; i++) {
    const x = padding.left + i / (data.length - 1) * chartW;
    const y = padding.top + chartH - (data[i].price - minPrice) / (maxPrice - minPrice) * chartH;
    c.lineTo(x, y);
  }
  c.lineTo(padding.left + chartW, padding.top + chartH);
  c.closePath();
  c.fillStyle = areaGrad;
  c.fill();
  c.beginPath();
  c.strokeStyle = res.color;
  c.lineWidth = 2.5;
  c.lineJoin = "round";
  c.lineCap = "round";
  for (let i = 0; i < data.length; i++) {
    const x = padding.left + i / (data.length - 1) * chartW;
    const y = padding.top + chartH - (data[i].price - minPrice) / (maxPrice - minPrice) * chartH;
    if (i === 0) {
      c.moveTo(x, y);
    } else {
      c.lineTo(x, y);
    }
  }
  c.stroke();
  for (let i = 0; i < data.length; i++) {
    const x = padding.left + i / (data.length - 1) * chartW;
    const y = padding.top + chartH - (data[i].price - minPrice) / (maxPrice - minPrice) * chartH;
    c.beginPath();
    c.arc(x, y, 3, 0, Math.PI * 2);
    c.fillStyle = res.color;
    c.fill();
    c.strokeStyle = "#ffffff";
    c.lineWidth = 1;
    c.stroke();
  }
  const relatedEvents = appData.majorEvents.filter((ev) => ev.resourceIds.includes(res.id));
  for (const ev of relatedEvents) {
    if (ev.year >= minYear && ev.year <= maxYear) {
      const xPos = padding.left + (ev.year - minYear) / (maxYear - minYear) * chartW;
      const impactColor = ev.impact === "up" ? "#4ecdc4" : ev.impact === "down" ? "#ff6b6b" : "#ffe66d";
      c.strokeStyle = impactColor + "60";
      c.lineWidth = 1;
      c.setLineDash([3, 3]);
      c.beginPath();
      c.moveTo(xPos, padding.top);
      c.lineTo(xPos, padding.top + chartH);
      c.stroke();
      c.setLineDash([]);
      c.beginPath();
      c.moveTo(xPos, padding.top - 6);
      c.lineTo(xPos + 5, padding.top);
      c.lineTo(xPos, padding.top + 6);
      c.lineTo(xPos - 5, padding.top);
      c.closePath();
      c.fillStyle = impactColor;
      c.fill();
    }
  }
  c.fillStyle = "rgba(255, 255, 255, 0.8)";
  c.font = "bold 14px sans-serif";
  c.textAlign = "left";
  c.textBaseline = "top";
  c.fillText(`${priceData.priceUnit}`, padding.left, 8);
}
function renderResourceEventsTab(container, res, resName) {
  if (!textData || !appData) return;
  const relatedEvents = appData.majorEvents.filter((ev) => ev.resourceIds.includes(res.id));
  const allEvents = [...appData.majorEvents].sort((a, b) => a.year - b.year);
  const evTitle = AppHelper.createUIElement(
    "div",
    "evTabTitle",
    {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#60a5fa",
      marginBottom: "1.5%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F4F0} ${textData.eventsTitle} - ${resName} (${relatedEvents.length}\uAC74)`
  );
  container.appendChild(evTitle);
  const sortedRelated = [...relatedEvents].sort((a, b) => b.year - a.year);
  if (sortedRelated.length === 0) {
    const noEv = AppHelper.createUIElement(
      "div",
      "noEvents",
      {
        fontSize: "14px",
        color: "rgba(180, 210, 255, 0.5)",
        textAlign: "center",
        padding: "5% 0",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      textData.noData
    );
    container.appendChild(noEv);
  } else {
    for (let i = 0; i < sortedRelated.length; i++) {
      const ev = sortedRelated[i];
      const evDesc = textData.eventDescriptions[String(ev.id)] || "";
      const impactLabel = textData.eventImpactLabels[ev.impact] || ev.impact;
      const impactColor = ev.impact === "up" ? "#4ecdc4" : ev.impact === "down" ? "#ff6b6b" : "#ffe66d";
      const card = AppHelper.createUIElement("div", `evCard_${ev.id}`, {
        padding: "1.5% 2%",
        marginBottom: "1%",
        backgroundColor: "rgba(20, 40, 75, 0.6)",
        borderRadius: "8px",
        boxSizing: "border-box",
        pointerEvents: "none",
        borderLeft: `4px solid ${impactColor}`
      });
      container.appendChild(card);
      const cardHeader = AppHelper.createUIElement("div", `evCardH_${ev.id}`, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.5%",
        boxSizing: "border-box",
        pointerEvents: "none"
      });
      card.appendChild(cardHeader);
      const yearLabel = AppHelper.createUIElement(
        "span",
        `evYear_${ev.id}`,
        {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#ffffff",
          backgroundColor: "rgba(60, 100, 160, 0.6)",
          padding: "2px 10px",
          borderRadius: "4px",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        `${textData.eventYearPrefix} ${ev.year}`
      );
      cardHeader.appendChild(yearLabel);
      const impBadge = AppHelper.createUIElement(
        "span",
        `evImp_${ev.id}`,
        {
          fontSize: "12px",
          fontWeight: "bold",
          color: impactColor,
          backgroundColor: impactColor + "20",
          padding: "2px 8px",
          borderRadius: "4px",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        impactLabel
      );
      cardHeader.appendChild(impBadge);
      const descEl = AppHelper.createUIElement(
        "div",
        `evDesc_${ev.id}`,
        {
          fontSize: "13px",
          color: "#c0d8ff",
          lineHeight: "1.6",
          boxSizing: "border-box",
          pointerEvents: "none"
        },
        evDesc
      );
      card.appendChild(descEl);
      const resRow = AppHelper.createUIElement("div", `evRes_${ev.id}`, {
        display: "flex",
        gap: "6px",
        marginTop: "0.8%",
        flexWrap: "wrap",
        boxSizing: "border-box",
        pointerEvents: "none"
      });
      card.appendChild(resRow);
      for (const rid of ev.resourceIds) {
        const r = appData.resources.find((rr) => rr.id === rid);
        if (!r) continue;
        const rn = textData.resourceNames[rid] || rid;
        const resBadge = AppHelper.createUIElement(
          "span",
          `evResB_${ev.id}_${rid}`,
          {
            fontSize: "11px",
            color: r.color,
            backgroundColor: r.color + "20",
            padding: "1px 6px",
            borderRadius: "3px",
            boxSizing: "border-box",
            pointerEvents: "none"
          },
          `\u25CF ${rn}`
        );
        resRow.appendChild(resBadge);
      }
    }
  }
  const separator = AppHelper.createUIElement("div", "evSeparator", {
    width: "100%",
    height: "1px",
    backgroundColor: "rgba(80, 150, 255, 0.3)",
    margin: "2% 0",
    boxSizing: "border-box",
    pointerEvents: "none"
  });
  container.appendChild(separator);
  const allTitle = AppHelper.createUIElement(
    "div",
    "evAllTitle",
    {
      fontSize: "15px",
      fontWeight: "bold",
      color: "#ffe66d",
      marginBottom: "1%",
      boxSizing: "border-box",
      pointerEvents: "none"
    },
    `\u{1F4CB} ${textData.viewMoreEvents} (${allEvents.length}\uAC74)`
  );
  container.appendChild(allTitle);
  for (let i = 0; i < allEvents.length; i++) {
    const ev = allEvents[i];
    const evDesc = textData.eventDescriptions[String(ev.id)] || "";
    const impactLabel = textData.eventImpactLabels[ev.impact] || ev.impact;
    const impactColor = ev.impact === "up" ? "#4ecdc4" : ev.impact === "down" ? "#ff6b6b" : "#ffe66d";
    const isRelated = ev.resourceIds.includes(res.id);
    const miniCard = AppHelper.createUIElement("div", `evAll_${ev.id}`, {
      fontSize: "12px",
      color: isRelated ? "#c0d8ff" : "rgba(180, 210, 255, 0.5)",
      padding: "0.8% 1.5%",
      marginBottom: "0.4%",
      backgroundColor: isRelated ? "rgba(25, 50, 90, 0.6)" : "rgba(15, 30, 55, 0.4)",
      borderRadius: "5px",
      boxSizing: "border-box",
      pointerEvents: "none",
      borderLeft: `3px solid ${isRelated ? impactColor : "rgba(80, 120, 180, 0.3)"}`,
      display: "flex",
      gap: "8px",
      alignItems: "center"
    });
    container.appendChild(miniCard);
    const yBadge = AppHelper.createUIElement(
      "span",
      `evAllY_${ev.id}`,
      {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "rgba(50, 80, 130, 0.5)",
        padding: "1px 5px",
        borderRadius: "3px",
        boxSizing: "border-box",
        pointerEvents: "none",
        whiteSpace: "nowrap"
      },
      `${ev.year}`
    );
    miniCard.appendChild(yBadge);
    const descShort = AppHelper.createUIElement(
      "span",
      `evAllD_${ev.id}`,
      {
        fontSize: "12px",
        flex: "1",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      evDesc
    );
    miniCard.appendChild(descShort);
    const impMini = AppHelper.createUIElement(
      "span",
      `evAllI_${ev.id}`,
      {
        fontSize: "10px",
        fontWeight: "bold",
        color: impactColor,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        pointerEvents: "none"
      },
      impactLabel
    );
    miniCard.appendChild(impMini);
  }
}
function initSounds() {
  if (soundLoaded) return;
  soundLoaded = true;
  try {
    const Howl = window.Howl;
    if (Howl && assetList) {
      const bgmAsset = assetList.sounds.find((sound) => sound.id === "bgm" || sound.isBackgroundMusic) || null;
      const clickAsset = assetList.sounds.find((sound) => sound.id === "click" || !sound.isBackgroundMusic) || null;
      if (bgmAsset) {
        bgMusic = new Howl({
          src: [bgmAsset.file_path],
          loop: true,
          volume: bgmAsset.volume
        });
      }
      if (clickAsset) {
        clickSound = new Howl({
          src: [clickAsset.file_path],
          volume: clickAsset.volume
        });
      }
    }
  } catch (e) {
  }
}
function playClickSound() {
  try {
    if (clickSound && clickSound.play) {
      clickSound.play();
    }
  } catch (e) {
  }
}
function playBGM() {
  try {
    if (bgMusic && bgMusic.play && !bgMusic.playing()) {
      bgMusic.play();
    }
  } catch (e) {
  }
}
function renderLoop(timestamp) {
  if (!ctx || !appCanvas || !appData) {
    animFrameId = requestAnimationFrame(renderLoop);
    return;
  }
  const time = timestamp / 1e3;
  titleAnimTime = time;
  const w = appCanvas.width;
  const h = appCanvas.height;
  ctx.clearRect(0, 0, w, h);
  if (currentState === 0 /* TITLE */) {
    drawTitleScreen(ctx, w, h, time);
  } else if (currentState === 1 /* INSTRUCTIONS */) {
    drawStarField(ctx, w, h, time);
  } else if (currentState === 2 /* GLOBE */) {
    if (globeRotation.autoRotate) {
      globeRotation.targetRotY += appData.rotationSpeed;
    }
    globeRotation.rotY += (globeRotation.targetRotY - globeRotation.rotY) * 0.08;
    globeRotation.rotX += (globeRotation.targetRotX - globeRotation.rotX) * 0.08;
    zoomLevel += (targetZoom - zoomLevel) * 0.1;
    moonOrbitAngle += 1e-3;
    issOrbitAngle -= 3e-3;
    drawStarField(ctx, w, h, time);
    calculateMoon(w / 2, h / 2);
    calculateISS(w / 2, h / 2);
    if (moonProjected && moonProjected.z > 0) {
      drawMoon(ctx);
    }
    if (issProjected && issProjected.z > 0) {
      drawISS(ctx, time);
    }
    drawGlobe(ctx, w, h, time);
    if (issProjected && issProjected.z <= 0) {
      drawISS(ctx, time);
    }
    if (moonProjected && moonProjected.z <= 0) {
      drawMoon(ctx);
    }
  } else if (currentState === 3 /* MOON_TRANSITION */) {
    moonZoomProgress += (1 - moonZoomProgress) * 0.05;
    moonOrbitAngle += 3e-4;
    issOrbitAngle -= 3e-3;
    drawStarField(ctx, w, h, time);
    calculateMoon(w / 2, h / 2);
    calculateISS(w / 2, h / 2);
    ctx.save();
    const targetScale = 1 + moonZoomProgress * 15;
    ctx.translate(w / 2, h / 2);
    ctx.scale(targetScale, targetScale);
    ctx.translate(-moonProjected.x, -moonProjected.y);
    if (moonProjected && moonProjected.z > 0) {
      drawMoon(ctx, true);
    }
    if (issProjected && issProjected.z > 0) {
      drawISS(ctx, time);
    }
    drawGlobe(ctx, w, h, time);
    if (issProjected && issProjected.z <= 0) {
      drawISS(ctx, time);
    }
    if (moonProjected && moonProjected.z <= 0) {
      drawMoon(ctx, true);
    }
    ctx.restore();
    if (moonZoomProgress > 0.8) {
      ctx.fillStyle = `rgba(255, 255, 255, ${(moonZoomProgress - 0.8) * 5})`;
      ctx.fillRect(0, 0, w, h);
    }
    if (moonZoomProgress > 0.99) {
      currentState = 4 /* MOON_SIMULATION */;
      showMoonSimulationUI();
    }
  } else if (currentState === 4 /* MOON_SIMULATION */) {
    drawStarField(ctx, w, h, time);
    const mcx = w / 2;
    const mcy = h / 2;
    const mRadius = Math.min(w, h) * 0.8;
    const grad = ctx.createRadialGradient(mcx - mRadius * 0.3, mcy - mRadius * 0.3, 0, mcx, mcy, mRadius);
    grad.addColorStop(0, "#f0f0f0");
    grad.addColorStop(0.5, "#909090");
    grad.addColorStop(1, "#101010");
    ctx.beginPath();
    ctx.arc(mcx, mcy, mRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 2;
    for (let i = 1; i <= 10; i++) {
      ctx.beginPath();
      ctx.arc(mcx, mcy, mRadius * (i / 10), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  animFrameId = requestAnimationFrame(renderLoop);
}
function onCanvasPointerDown(e) {
  if (!appCanvas) return;
  const coords = AppHelper.getRelativeCoordinates(e.clientX, e.clientY, appCanvas);
  if (currentState === 0 /* TITLE */) {
    initSounds();
    playClickSound();
    playBGM();
    currentState = 1 /* INSTRUCTIONS */;
    showInstructionsUI();
    return;
  }
  if (currentState === 2 /* GLOBE */) {
    globeRotation.isDragging = true;
    globeRotation.lastPointerX = coords.x;
    globeRotation.lastPointerY = coords.y;
    globeRotation.autoRotate = false;
  }
}
function onCanvasPointerMove(e) {
  if (!appCanvas || !appData) return;
  const coords = AppHelper.getRelativeCoordinates(e.clientX, e.clientY, appCanvas);
  if (currentState === 2 /* GLOBE */) {
    if (globeRotation.isDragging) {
      const dx = coords.x - globeRotation.lastPointerX;
      const dy = coords.y - globeRotation.lastPointerY;
      globeRotation.targetRotY -= dx * 5e-3;
      globeRotation.targetRotX += dy * 5e-3;
      globeRotation.targetRotX = Math.max(-1.2, Math.min(1.2, globeRotation.targetRotX));
      globeRotation.lastPointerX = coords.x;
      globeRotation.lastPointerY = coords.y;
    } else {
      let found = false;
      if (issProjected && issProjected.z <= appData.globeRadius * zoomLevel * 0.95) {
        const dist = Math.sqrt((coords.x - issProjected.x) ** 2 + (coords.y - issProjected.y) ** 2);
        if (dist < issProjected.radius * 3 + 10) {
          hoveredISS = true;
          found = true;
          appCanvas.style.cursor = "pointer";
        }
      }
      if (!found) hoveredISS = false;
      if (!found) {
        if (moonProjected && moonProjected.z <= appData.globeRadius * zoomLevel * 0.8) {
          const dist = Math.sqrt((coords.x - moonProjected.x) ** 2 + (coords.y - moonProjected.y) ** 2);
          if (dist < moonProjected.radius + 10) {
            hoveredMoon = true;
            found = true;
            appCanvas.style.cursor = "pointer";
          }
        }
      }
      if (!found) hoveredMoon = false;
      if (!found) {
        for (const pc of projectedCountries) {
          if (!pc.visible) continue;
          const dist = Math.sqrt((coords.x - pc.x) ** 2 + (coords.y - pc.y) ** 2);
          if (dist < pc.radius + 5) {
            hoveredCountryId = pc.country.id;
            found = true;
            appCanvas.style.cursor = "pointer";
            break;
          }
        }
      }
      if (!found) {
        hoveredCountryId = null;
        appCanvas.style.cursor = "grab";
      }
    }
  }
}
function onCanvasPointerUp(e) {
  if (!appCanvas) return;
  const coords = AppHelper.getRelativeCoordinates(e.clientX, e.clientY, appCanvas);
  if (currentState === 2 /* GLOBE */) {
    if (globeRotation.isDragging) {
      const dx = Math.abs(coords.x - globeRotation.lastPointerX);
      const dy = Math.abs(coords.y - globeRotation.lastPointerY);
      if (dx < 3 && dy < 3) {
        if (issProjected && issProjected.z <= appData.globeRadius * zoomLevel * 0.95) {
          const dist = Math.sqrt((coords.x - issProjected.x) ** 2 + (coords.y - issProjected.y) ** 2);
          if (dist < issProjected.radius * 3 + 10) {
            playClickSound();
            showISSModal();
            return;
          }
        }
        if (moonProjected && moonProjected.z <= appData.globeRadius * zoomLevel * 0.8) {
          const dist = Math.sqrt((coords.x - moonProjected.x) ** 2 + (coords.y - moonProjected.y) ** 2);
          if (dist < moonProjected.radius + 10) {
            playClickSound();
            currentState = 3 /* MOON_TRANSITION */;
            moonZoomProgress = 0;
            clearUI();
            return;
          }
        }
        for (const pc of projectedCountries) {
          if (!pc.visible) continue;
          const dist = Math.sqrt((coords.x - pc.x) ** 2 + (coords.y - pc.y) ** 2);
          if (dist < pc.radius + 5) {
            playClickSound();
            selectedCountryId = pc.country.id;
            for (let i = 0; i < 15; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 1 + Math.random() * 3;
              const res = appData.resources[Math.floor(Math.random() * appData.resources.length)];
              particles.push({
                x: pc.x,
                y: pc.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 30 + Math.random() * 20,
                maxLife: 50,
                color: res.color
              });
            }
            showGlobeUI();
            break;
          }
        }
      }
      globeRotation.isDragging = false;
    }
  }
}
function onCanvasWheel(e) {
  if (currentState !== 2 /* GLOBE */) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  targetZoom = Math.max(0.5, Math.min(2.5, targetZoom + delta));
}
function onTouchStart(e) {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    lastTouchDist = Math.sqrt(dx * dx + dy * dy);
  }
}
function onTouchMove(e) {
  if (e.touches.length === 2 && currentState === 2 /* GLOBE */) {
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (lastTouchDist > 0) {
      const scale = dist / lastTouchDist;
      targetZoom = Math.max(0.5, Math.min(2.5, targetZoom * scale));
    }
    lastTouchDist = dist;
  }
}
function onTouchEnd(e) {
  if (e.touches.length < 2) {
    lastTouchDist = 0;
  }
}
async function initApp() {
  appCanvas = document.getElementById("appCanvas");
  uiLayer = document.getElementById("uiLayer");
  if (!appCanvas || !uiLayer) return;
  ctx = appCanvas.getContext("2d");
  if (!ctx) return;
  appData = await AppHelper.loadAppData();
  textData = await AppHelper.loadTextData();
  assetList = await AppHelper.loadAssetList();
  appCanvas.width = appData.logicalWidth;
  appCanvas.height = appData.logicalHeight;
  appCanvas.style.width = `${appData.logicalWidth}px`;
  appCanvas.style.height = `${appData.logicalHeight}px`;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  clearCountryLabelTextureCache();
  generateStars(300, appData.logicalWidth, appData.logicalHeight);
  appCanvas.addEventListener("pointerdown", onCanvasPointerDown);
  appCanvas.addEventListener("pointermove", onCanvasPointerMove);
  appCanvas.addEventListener("pointerup", onCanvasPointerUp);
  appCanvas.addEventListener("pointerleave", () => {
    globeRotation.isDragging = false;
  });
  appCanvas.addEventListener("wheel", onCanvasWheel, { passive: false });
  appCanvas.addEventListener("touchstart", onTouchStart, { passive: true });
  appCanvas.addEventListener("touchmove", onTouchMove, { passive: false });
  appCanvas.addEventListener("touchend", onTouchEnd, { passive: true });
  appCanvas.style.cursor = "pointer";
  currentState = 0 /* TITLE */;
  animFrameId = requestAnimationFrame(renderLoop);
}
var isCurrencyReasonPanelExpanded, selectedCurrencyYear, hoveredCurrencyYear, selectedCurrencyIds, showCurrencyFeature, countryLabelTextureCache, LABEL_CACHE_PIXEL_RATIO, LABEL_RENDER_SCALE, LABEL_FONT_WEIGHT, LABEL_FONT_FAMILY, nationSimResult, nationSimReductionPercent, nationSimResourceId, nationSimCountryId, showNationSimulation, isRankingPanelCollapsed, issOrbitAngle, issProjected, hoveredISS, hoveredMoon, moonZoomProgress, moonProjected, moonOrbitAngle, currentRankingDisplayMode, showSimResultFullscreen, rankingSelectedResourceId, showResourceRankingOverlay, currentResourceRankingTab, simResult, simChangePercent, simResourceId, simCountryId, showSimulation, currentRankingTab, currentResourceDetailTab, currentState, appCanvas, ctx, uiLayer, appData, textData, assetList, globeRotation, zoomLevel, targetZoom, selectedResourceId, hoveredCountryId, selectedCountryId, showResourceDetail, detailResourceId, eventsScrollOffset, projectedCountries, animFrameId, titleAnimTime, stars, particles, soundLoaded, bgMusic, clickSound, activeUIElements, lastTouchDist;
var init_app = __esm({
  "public/20260331074210_e5ed62d3-3bb2-4bb6-bcf6-771a5cc1922a/app.ts"() {
    init_appHelper();
    isCurrencyReasonPanelExpanded = true;
    selectedCurrencyYear = null;
    hoveredCurrencyYear = null;
    selectedCurrencyIds = ["usd", "eur", "jpy", "gbp"];
    showCurrencyFeature = false;
    countryLabelTextureCache = /* @__PURE__ */ new Map();
    LABEL_CACHE_PIXEL_RATIO = 1.5;
    LABEL_RENDER_SCALE = 3;
    LABEL_FONT_WEIGHT = "800";
    LABEL_FONT_FAMILY = 'Arial, "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
    nationSimResult = null;
    nationSimReductionPercent = 20;
    nationSimResourceId = null;
    nationSimCountryId = null;
    showNationSimulation = false;
    isRankingPanelCollapsed = false;
    issOrbitAngle = Math.PI;
    issProjected = null;
    hoveredISS = false;
    hoveredMoon = false;
    moonZoomProgress = 0;
    moonProjected = null;
    moonOrbitAngle = 0;
    currentRankingDisplayMode = "raw" /* RAW */;
    showSimResultFullscreen = false;
    rankingSelectedResourceId = null;
    showResourceRankingOverlay = false;
    currentResourceRankingTab = "top_importer" /* TOP_IMPORTER */;
    simResult = null;
    simChangePercent = 0;
    simResourceId = null;
    simCountryId = null;
    showSimulation = false;
    currentRankingTab = "production" /* PRODUCTION */;
    currentResourceDetailTab = "info" /* INFO */;
    currentState = 0 /* TITLE */;
    appCanvas = null;
    ctx = null;
    uiLayer = null;
    appData = null;
    textData = null;
    assetList = null;
    globeRotation = {
      rotY: 0,
      rotX: 0.3,
      targetRotY: 0,
      targetRotX: 0.3,
      isDragging: false,
      lastPointerX: 0,
      lastPointerY: 0,
      autoRotate: true
    };
    zoomLevel = 1;
    targetZoom = 1;
    selectedResourceId = null;
    hoveredCountryId = null;
    selectedCountryId = null;
    showResourceDetail = false;
    detailResourceId = null;
    eventsScrollOffset = 0;
    projectedCountries = [];
    animFrameId = 0;
    titleAnimTime = 0;
    stars = [];
    particles = [];
    soundLoaded = false;
    bgMusic = null;
    clickSound = null;
    activeUIElements = [];
    lastTouchDist = 0;
  }
});

// public/20260331074210_e5ed62d3-3bb2-4bb6-bcf6-771a5cc1922a/main.ts
var require_main = __commonJS({
  "public/20260331074210_e5ed62d3-3bb2-4bb6-bcf6-771a5cc1922a/main.ts"() {
    init_app();
    init_appHelper();
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
  }
});
export default require_main();
