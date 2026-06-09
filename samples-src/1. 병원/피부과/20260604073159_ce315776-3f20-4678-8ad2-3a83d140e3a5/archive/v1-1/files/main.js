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

// public/20260604073159_ce315776-3f20-4678-8ad2-3a83d140e3a5/appHelper.ts
var _AppHelper, AppHelper;
var init_appHelper = __esm({
  "public/20260604073159_ce315776-3f20-4678-8ad2-3a83d140e3a5/appHelper.ts"() {
    init_es();
    _AppHelper = class _AppHelper {
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
    AppHelper = _AppHelper;
  }
});

// public/20260604073159_ce315776-3f20-4678-8ad2-3a83d140e3a5/app.ts
function clearUI() {
  while (uiLayer.firstChild) {
    uiLayer.removeChild(uiLayer.firstChild);
  }
}
function showScreen(state) {
  currentState = state;
  clearUI();
  if (state === "START") {
    renderStartScreen();
  } else if (state === "CHECKLIST") {
    renderChecklistScreen();
  } else if (state === "QUIZ") {
    quizAnswered = false;
    renderQuizScreen();
  } else if (state === "RESULT") {
    renderResultScreen();
  }
}
function renderStartScreen() {
  const container = AppHelper.createUIElement("div", "startContainer", {
    position: "absolute",
    left: "5%",
    top: "45%",
    width: "90%",
    height: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    boxShadow: "0 15px 35px rgba(255, 127, 80, 0.15)",
    pointerEvents: "auto",
    padding: "5%",
    fontFamily: "sans-serif"
  });
  const titleGroup = AppHelper.createUIElement("div", "", { textAlign: "center", marginBottom: "8%" });
  const subTitle = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "40px", color: "#FF7F50", fontWeight: "bold", marginBottom: "15px" },
    textData.startSub
  );
  const mainTitle = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "80px", color: "#333", fontWeight: "900" },
    textData.startTitle
  );
  titleGroup.appendChild(subTitle);
  titleGroup.appendChild(mainTitle);
  const descText = AppHelper.createUIElement(
    "div",
    "",
    {
      fontSize: "45px",
      color: "#666",
      textAlign: "center",
      whiteSpace: "pre-line",
      lineHeight: "1.5",
      marginBottom: "8%"
    },
    textData.startDesc
  );
  const infoGroup = AppHelper.createUIElement("div", "", {
    display: "flex",
    width: "80%",
    justifyContent: "space-between",
    marginBottom: "10%",
    borderTop: "2px solid #EEE",
    paddingTop: "5%"
  });
  const timeInfo = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "35px", color: "#888", fontWeight: "bold" },
    textData.timeInfo
  );
  const quizInfo = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "35px", color: "#888", fontWeight: "bold" },
    textData.quizInfo
  );
  infoGroup.appendChild(timeInfo);
  infoGroup.appendChild(quizInfo);
  const startBtn = AppHelper.createUIElement(
    "button",
    "startBtn",
    {
      width: "80%",
      height: "18%",
      fontSize: "55px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: "#FF7F50",
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(255, 127, 80, 0.3)"
    },
    textData.startBtn,
    [{ event: "click", handler: () => showScreen("CHECKLIST") }]
  );
  container.appendChild(titleGroup);
  container.appendChild(descText);
  container.appendChild(infoGroup);
  container.appendChild(startBtn);
  uiLayer.appendChild(container);
}
function renderChecklistScreen() {
  clearUI();
  const container = AppHelper.createUIElement("div", "checkContainer", {
    position: "absolute",
    left: "5%",
    top: "20%",
    width: "90%",
    height: "75%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    boxShadow: "0 15px 35px rgba(255, 127, 80, 0.15)",
    pointerEvents: "auto",
    padding: "5%",
    fontFamily: "sans-serif"
  });
  const headerGroup = AppHelper.createUIElement("div", "", { textAlign: "center", marginBottom: "5%", width: "100%" });
  const title = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "65px", color: "#FF7F50", fontWeight: "900", marginBottom: "15px" },
    textData.checklistTitle
  );
  const desc = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "35px", color: "#666", whiteSpace: "pre-line" },
    textData.checklistDesc
  );
  headerGroup.appendChild(title);
  headerGroup.appendChild(desc);
  const listContainer = AppHelper.createUIElement("div", "", {
    width: "100%",
    height: "65%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
  });
  for (let i = 0; i < textData.checklistItems.length; i++) {
    const isChecked = checklistStatus[i];
    const itemText = textData.checklistItems[i];
    const item = AppHelper.createUIElement(
      "div",
      "",
      {
        width: "100%",
        height: "16%",
        display: "flex",
        alignItems: "center",
        backgroundColor: isChecked ? "#FFF5F0" : "#F9F9F9",
        borderRadius: "20px",
        padding: "0 5%",
        boxSizing: "border-box",
        cursor: "pointer",
        border: isChecked ? "3px solid #FF7F50" : "3px solid transparent",
        transition: "all 0.2s"
      },
      "",
      [
        {
          event: "click",
          handler: () => {
            checklistStatus[i] = !checklistStatus[i];
            renderChecklistScreen();
          }
        }
      ]
    );
    const checkCircle = AppHelper.createUIElement("div", "", {
      width: "60px",
      height: "60px",
      borderRadius: "30px",
      border: isChecked ? "none" : "4px solid #CCC",
      backgroundColor: isChecked ? "#FF7F50" : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "5%",
      boxSizing: "border-box"
    });
    if (isChecked) {
      const checkMark = AppHelper.createUIElement(
        "div",
        "",
        { color: "#FFF", fontSize: "40px", fontWeight: "bold" },
        "\u2713"
      );
      checkCircle.appendChild(checkMark);
    }
    const label = AppHelper.createUIElement(
      "div",
      "",
      { fontSize: "38px", color: isChecked ? "#333" : "#777", fontWeight: isChecked ? "bold" : "normal", flex: "1" },
      itemText
    );
    item.appendChild(checkCircle);
    item.appendChild(label);
    listContainer.appendChild(item);
  }
  const isAllChecked = checklistStatus.every((s) => s === true);
  const nextBtn = AppHelper.createUIElement(
    "button",
    "checkNextBtn",
    {
      width: "80%",
      height: "12%",
      marginTop: "5%",
      fontSize: "45px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: isAllChecked ? "#FF7F50" : "#DDD",
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: isAllChecked ? "pointer" : "not-allowed",
      boxShadow: isAllChecked ? "0 10px 20px rgba(255, 127, 80, 0.3)" : "none",
      transition: "background-color 0.3s"
    },
    textData.checklistNext,
    [
      {
        event: "click",
        handler: () => {
          if (isAllChecked) showScreen("QUIZ");
        }
      }
    ]
  );
  container.appendChild(headerGroup);
  container.appendChild(listContainer);
  container.appendChild(nextBtn);
  uiLayer.appendChild(container);
}
function renderQuizScreen() {
  const qData = textData.quizItems[quizIndex];
  const container = AppHelper.createUIElement("div", "quizContainer", {
    position: "absolute",
    left: "5%",
    top: "20%",
    width: "90%",
    height: "75%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    boxShadow: "0 15px 35px rgba(255, 127, 80, 0.15)",
    pointerEvents: "auto",
    padding: "5%",
    fontFamily: "sans-serif"
  });
  const headerGroup = AppHelper.createUIElement("div", "", { width: "100%", textAlign: "center", marginBottom: "5%" });
  const badge = AppHelper.createUIElement(
    "div",
    "",
    {
      display: "inline-block",
      backgroundColor: "#FF7F50",
      color: "#FFF",
      fontSize: "35px",
      fontWeight: "bold",
      padding: "10px 30px",
      borderRadius: "30px",
      marginBottom: "25px"
    },
    `Q${quizIndex + 1} / ${textData.quizItems.length}`
  );
  const questionText = AppHelper.createUIElement(
    "div",
    "",
    {
      fontSize: "55px",
      color: "#333",
      fontWeight: "900",
      whiteSpace: "pre-line",
      lineHeight: "1.5"
    },
    qData.q
  );
  headerGroup.appendChild(badge);
  headerGroup.appendChild(questionText);
  const oxContainer = AppHelper.createUIElement("div", "", {
    display: "flex",
    width: "90%",
    height: "25%",
    justifyContent: "space-between",
    marginBottom: "5%"
  });
  const btnO = AppHelper.createUIElement(
    "button",
    "btnO",
    {
      width: "45%",
      height: "100%",
      fontSize: "140px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: "#4CAF50",
      color: "#FFF",
      border: "none",
      borderRadius: "40px",
      boxShadow: "0 10px 20px rgba(76, 175, 80, 0.4)",
      cursor: "pointer",
      transition: "all 0.3s"
    },
    "O"
  );
  const btnX = AppHelper.createUIElement(
    "button",
    "btnX",
    {
      width: "45%",
      height: "100%",
      fontSize: "140px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: "#F44336",
      color: "#FFF",
      border: "none",
      borderRadius: "40px",
      boxShadow: "0 10px 20px rgba(244, 67, 54, 0.4)",
      cursor: "pointer",
      transition: "all 0.3s"
    },
    "X"
  );
  oxContainer.appendChild(btnO);
  oxContainer.appendChild(btnX);
  const feedbackCont = AppHelper.createUIElement("div", "", {
    width: "100%",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    opacity: "0",
    transition: "opacity 0.3s"
  });
  const resultMark = AppHelper.createUIElement("div", "", {
    fontSize: "65px",
    fontWeight: "900",
    marginBottom: "15px"
  });
  const explText = AppHelper.createUIElement("div", "", {
    fontSize: "40px",
    color: "#555",
    textAlign: "center",
    whiteSpace: "pre-line",
    lineHeight: "1.5",
    width: "95%"
  });
  const nextBtn = AppHelper.createUIElement(
    "button",
    "nextBtn",
    {
      width: "80%",
      height: "30%",
      marginTop: "auto",
      fontSize: "45px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: "#FF7F50",
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer"
    },
    textData.nextBtn
  );
  feedbackCont.appendChild(resultMark);
  feedbackCont.appendChild(explText);
  feedbackCont.appendChild(nextBtn);
  container.appendChild(headerGroup);
  container.appendChild(oxContainer);
  container.appendChild(feedbackCont);
  uiLayer.appendChild(container);
  const handleAns = (ans) => {
    if (quizAnswered) return;
    quizAnswered = true;
    const isCorrect = ans === qData.a;
    if (isCorrect) score++;
    btnO.style.opacity = ans === "O" ? "1" : "0.3";
    btnX.style.opacity = ans === "X" ? "1" : "0.3";
    resultMark.textContent = isCorrect ? "\uC815\uB2F5\uC785\uB2C8\uB2E4!" : "\uC544\uC26C\uC6CC\uC694, \uC624\uB2F5\uC785\uB2C8\uB2E4!";
    resultMark.style.color = isCorrect ? "#4CAF50" : "#F44336";
    explText.textContent = qData.expl;
    feedbackCont.style.opacity = "1";
    nextBtn.addEventListener("click", () => {
      quizIndex++;
      if (quizIndex >= textData.quizItems.length) showScreen("RESULT");
      else showScreen("QUIZ");
    });
  };
  btnO.addEventListener("click", () => handleAns("O"));
  btnX.addEventListener("click", () => handleAns("X"));
}
function renderResultScreen() {
  const container = AppHelper.createUIElement("div", "resContainer", {
    position: "absolute",
    left: "5%",
    top: "25%",
    width: "90%",
    height: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    boxSizing: "border-box",
    boxShadow: "0 15px 35px rgba(255, 127, 80, 0.15)",
    pointerEvents: "auto",
    padding: "5%",
    fontFamily: "sans-serif"
  });
  const header = AppHelper.createUIElement("div", "", { textAlign: "center" });
  const title = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "70px", color: "#FF7F50", fontWeight: "900", marginBottom: "30px" },
    textData.resultTitle
  );
  const scoreGroup = AppHelper.createUIElement("div", "", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px"
  });
  const scoreLabel = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "40px", color: "#666", marginBottom: "15px" },
    textData.resultScore
  );
  const scoreBadge = AppHelper.createUIElement(
    "div",
    "",
    {
      display: "inline-block",
      fontSize: "75px",
      color: "#FFF",
      backgroundColor: "#333",
      padding: "20px 60px",
      borderRadius: "50px",
      fontWeight: "bold",
      letterSpacing: "5px"
    },
    `${score} / ${textData.quizItems.length}`
  );
  scoreGroup.appendChild(scoreLabel);
  scoreGroup.appendChild(scoreBadge);
  header.appendChild(title);
  header.appendChild(scoreGroup);
  const desc = AppHelper.createUIElement(
    "div",
    "",
    {
      fontSize: "42px",
      color: "#555",
      textAlign: "center",
      whiteSpace: "pre-line",
      lineHeight: "1.6",
      padding: "0 5%"
    },
    textData.resultDesc
  );
  const restartBtn = AppHelper.createUIElement(
    "button",
    "restartBtn",
    {
      width: "80%",
      height: "15%",
      fontSize: "50px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: "#FF7F50",
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(255, 127, 80, 0.3)"
    },
    textData.restartBtn,
    [
      {
        event: "click",
        handler: () => {
          quizIndex = 0;
          score = 0;
          for (let i = 0; i < checklistStatus.length; i++) {
            checklistStatus[i] = false;
          }
          showScreen("START");
        }
      }
    ]
  );
  container.appendChild(header);
  container.appendChild(desc);
  container.appendChild(restartBtn);
  uiLayer.appendChild(container);
}
function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, appCanvas.height);
  grad.addColorStop(0, "#FFE4E1");
  grad.addColorStop(1, "#FFF0F5");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, appCanvas.width, appCanvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.beginPath();
  ctx.arc(200, 300, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(850, 1400, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(900, 250, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150, 1600, 70, 0, Math.PI * 2);
  ctx.fill();
}
function drawCharacter(t, state) {
  const cx = appData.logicalWidth / 2;
  let cy = 0;
  let scale = 1;
  if (state === "START") {
    cy = 400 + Math.sin(t * 3) * 30;
    scale = 1.3;
  } else if (state === "CHECKLIST") {
    cy = 160 + Math.sin(t * 3) * 15;
    scale = 0.8;
  } else if (state === "QUIZ") {
    cy = 160 + Math.sin(t * 3) * 15;
    scale = 0.8;
  } else if (state === "RESULT") {
    cy = 320 + Math.sin(t * 3) * 30;
    scale = 1.4;
  }
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255, 127, 80, 0.1)";
  ctx.beginPath();
  ctx.ellipse(0, 90, 60, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.bezierCurveTo(50, -30, 90, 30, 90, 60);
  ctx.arc(0, 60, 90, 0, Math.PI, false);
  ctx.bezierCurveTo(-90, 30, -50, -30, 0, -90);
  ctx.closePath();
  const charGrad = ctx.createLinearGradient(0, -90, 0, 150);
  charGrad.addColorStop(0, "#E0F7FA");
  charGrad.addColorStop(1, "#80DEEA");
  ctx.fillStyle = charGrad;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.stroke();
  ctx.fillStyle = "#424242";
  ctx.beginPath();
  ctx.arc(-30, 50, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(30, 50, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(-33, 47, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(27, 47, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  if (state === "RESULT" && score === textData.quizItems.length) {
    ctx.arc(0, 65, 15, 0, Math.PI, false);
    ctx.fillStyle = "#FF7043";
    ctx.fill();
  } else {
    ctx.arc(0, 65, 12, 0, Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#424242";
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 105, 180, 0.4)";
  ctx.beginPath();
  ctx.arc(-55, 65, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(55, 65, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function loop() {
  time += 0.016;
  ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
  drawBackground();
  drawCharacter(time, currentState);
  animationFrameId = requestAnimationFrame(loop);
}
async function initApp() {
  appData = await AppHelper.loadAppData();
  textData = await AppHelper.loadTextData();
  assetList = await AppHelper.loadAssetList();
  appCanvas = document.getElementById("appCanvas");
  uiLayer = document.getElementById("uiLayer");
  appCanvas.width = appData.logicalWidth;
  appCanvas.height = appData.logicalHeight;
  ctx = appCanvas.getContext("2d");
  checklistStatus = new Array(textData.checklistItems.length).fill(false);
  showScreen("START");
  loop();
}
var assetList, appData, textData, appCanvas, ctx, uiLayer, currentState, quizIndex, score, checklistStatus, quizAnswered, time, animationFrameId;
var init_app = __esm({
  "public/20260604073159_ce315776-3f20-4678-8ad2-3a83d140e3a5/app.ts"() {
    init_appHelper();
    currentState = "START";
    quizIndex = 0;
    score = 0;
    checklistStatus = [];
    quizAnswered = false;
    time = 0;
    animationFrameId = 0;
  }
});

// public/20260604073159_ce315776-3f20-4678-8ad2-3a83d140e3a5/main.ts
var require_main = __commonJS({
  "public/20260604073159_ce315776-3f20-4678-8ad2-3a83d140e3a5/main.ts"() {
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
