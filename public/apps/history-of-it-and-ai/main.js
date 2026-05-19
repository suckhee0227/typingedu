var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

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
      const random3 = () => (
        // eslint-disable-next-line no-bitwise
        `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
      );
      return () => {
        counter += 1;
        return `u${random3()}${counter}`;
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
  const selector3 = `.${className}:${pseudo}`;
  const cssText = style.cssText ? formatCSSText(style) : formatCSSProperties(style, options);
  return document.createTextNode(`${selector3}{${cssText}}`);
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
async function fetchAsDataURL(url, init4, process2) {
  const res = await fetch(url, init4);
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
    const ctx = canvas.getContext("2d");
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
  const context3 = canvas.getContext("2d");
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
    context3.fillStyle = options.backgroundColor;
    context3.fillRect(0, 0, canvas.width, canvas.height);
  }
  context3.drawImage(img, 0, 0, canvas.width, canvas.height);
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

// public/20260316090519_f1625a99-d204-4345-bc98-df5afd09de5f/appHelper.ts
var AppHelper;
var init_appHelper = __esm({
  "public/20260316090519_f1625a99-d204-4345-bc98-df5afd09de5f/appHelper.ts"() {
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
        return data.textData;
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
      static getRelativeCoordinates(clientX, clientY, appCanvas) {
        const rect = appCanvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const scaleX = appCanvas.width / rect.width;
        const scaleY = appCanvas.height / rect.height;
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
        if (textContent) element.innerHTML = this.sanitizeText(textContent);
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
        const appCanvas = document.getElementById("appCanvas");
        const appContainer = document.getElementById("appContainer");
        if (!appCanvas || !appContainer) return null;
        let dataUrl = null;
        try {
          if (includeUILayer) {
            const savedStyle = appContainer.style.cssText;
            appContainer.style.transform = "none";
            appContainer.style.position = "relative";
            appContainer.style.left = "0";
            appContainer.style.top = "0";
            dataUrl = await toPng(appContainer, {
              width: appCanvas.width,
              height: appCanvas.height
            });
            appContainer.style.cssText = savedStyle;
          } else {
            dataUrl = appCanvas.toDataURL("image/png");
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

// node_modules/gsap/gsap-core.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
var _config, _defaults, _suppressOverwrites, _reverting, _context, _bigNum, _tinyNum, _2PI, _HALF_PI, _gsID, _sqrt, _cos, _sin, _isString, _isFunction, _isNumber, _isUndefined, _isObject, _isNotFalse, _windowExists, _isFuncOrString, _isTypedArray, _isArray, _strictNumExp, _numExp, _numWithUnitExp, _complexStringNumExp, _relExp, _delimitedValueExp, _unitExp, _globalTimeline, _win, _coreInitted, _doc, _globals, _installScope, _coreReady, _install, _missingPlugin, _warn, _addGlobal, _emptyFunc, _startAtRevertConfig, _revertConfigNoKill, _revertConfig, _reservedProps, _lazyTweens, _lazyLookup, _lastRenderedFrame, _plugins, _effects, _nextGCFrame, _harnessPlugins, _callbackNames, _harness, _getCache, _getProperty, _forEachName, _round, _roundPrecise, _parseRelative, _arrayContainsAny, _lazyRender, _lazySafeRender, _numericIfPossible, _passThrough, _setDefaults, _setKeyframeDefaults, _merge, _mergeDeep, _copyExcluding, _inheritDefaults, _arraysMatch, _addLinkedListItem, _removeLinkedListItem, _removeFromParent, _uncache, _recacheAncestors, _rewindStartAt, _hasNoPausedAncestors, _elapsedCycleDuration, _animationCycle, _parentToChildTotalTime, _setEnd, _alignPlayhead, _postAddChecks, _addToTimeline, _scrollTrigger, _attemptInitTween, _parentPlayheadIsBeforeStart, _isFromOrFromStart, _renderZeroDurationTween, _findNextPauseTween, _setDuration, _onUpdateTotalDuration, _zeroPosition, _parsePosition, _createTweenType, _conditionalReturn, _clamp, getUnit, clamp, _slice, _isArrayLike, _flatten, toArray2, selector, shuffle, distribute, _roundModifier, snap, random, pipe, unitize, normalize, _wrapArray, wrap, wrapYoyo, _replaceRandom, mapRange, interpolate, _getLabelInDirection, _callback, _interrupt, _quickTween, _registerPluginQueue, _createPlugin, _255, _colorLookup, _hue, splitColor, _colorOrderData, _formatColors, _colorExp, _hslExp, _colorStringFilter, _tickerActive, _ticker, _wake, _easeMap, _customEaseExp, _quotesExp, _parseObjectInString, _valueInParentheses, _configEaseFromString, _invertEase, _propagateYoyoEase, _parseEase, _insertEase, _easeInOutFromOut, _configElastic, _configBack, GSCache, Animation, Timeline, _addComplexStringPropTween, _addPropTween, _processVars, _checkPlugin, _overwritingTween, _forceAllPropTweens, _initTween, _updatePropTweens, _addAliasesToVars, _parseKeyframe, _parseFuncOrString, _staggerTweenProps, _staggerPropsToSkip, Tween, _setterPlain, _setterFunc, _setterFuncWithParam, _setterAttribute, _getSetter, _renderPlain, _renderBoolean, _renderComplexString, _renderPropTweens, _addPluginModifier, _killPropTweensOf, _setterWithModifier, _sortPropTweensByPriority, PropTween, _media, _listeners, _emptyArray, _lastMediaTime, _contextID, _dispatch, _onMediaChange, Context, MatchMedia, _gsap, _getPluginPropTween, _addModifiers, _buildModifierPlugin, gsap, Power0, Power1, Power2, Power3, Power4, Linear, Quad, Cubic, Quart, Quint, Strong, Elastic, Back, SteppedEase, Bounce, Sine, Expo, Circ;
var init_gsap_core = __esm({
  "node_modules/gsap/gsap-core.js"() {
    _config = {
      autoSleep: 120,
      force3D: "auto",
      nullTargetWarn: 1,
      units: {
        lineHeight: ""
      }
    };
    _defaults = {
      duration: 0.5,
      overwrite: false,
      delay: 0
    };
    _bigNum = 1e8;
    _tinyNum = 1 / _bigNum;
    _2PI = Math.PI * 2;
    _HALF_PI = _2PI / 4;
    _gsID = 0;
    _sqrt = Math.sqrt;
    _cos = Math.cos;
    _sin = Math.sin;
    _isString = function _isString2(value) {
      return typeof value === "string";
    };
    _isFunction = function _isFunction2(value) {
      return typeof value === "function";
    };
    _isNumber = function _isNumber2(value) {
      return typeof value === "number";
    };
    _isUndefined = function _isUndefined2(value) {
      return typeof value === "undefined";
    };
    _isObject = function _isObject2(value) {
      return typeof value === "object";
    };
    _isNotFalse = function _isNotFalse2(value) {
      return value !== false;
    };
    _windowExists = function _windowExists2() {
      return typeof window !== "undefined";
    };
    _isFuncOrString = function _isFuncOrString2(value) {
      return _isFunction(value) || _isString(value);
    };
    _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {
    };
    _isArray = Array.isArray;
    _strictNumExp = /(?:-?\.?\d|\.)+/gi;
    _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g;
    _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g;
    _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi;
    _relExp = /[+-]=-?[.\d]+/;
    _delimitedValueExp = /[^,'"\[\]\s]+/gi;
    _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i;
    _globals = {};
    _installScope = {};
    _install = function _install2(scope) {
      return (_installScope = _merge(scope, _globals)) && gsap;
    };
    _missingPlugin = function _missingPlugin2(property, value) {
      return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
    };
    _warn = function _warn2(message, suppress) {
      return !suppress && console.warn(message);
    };
    _addGlobal = function _addGlobal2(name, obj) {
      return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
    };
    _emptyFunc = function _emptyFunc2() {
      return 0;
    };
    _startAtRevertConfig = {
      suppressEvents: true,
      isStart: true,
      kill: false
    };
    _revertConfigNoKill = {
      suppressEvents: true,
      kill: false
    };
    _revertConfig = {
      suppressEvents: true
    };
    _reservedProps = {};
    _lazyTweens = [];
    _lazyLookup = {};
    _plugins = {};
    _effects = {};
    _nextGCFrame = 30;
    _harnessPlugins = [];
    _callbackNames = "";
    _harness = function _harness2(targets) {
      var target = targets[0], harnessPlugin, i;
      _isObject(target) || _isFunction(target) || (targets = [targets]);
      if (!(harnessPlugin = (target._gsap || {}).harness)) {
        i = _harnessPlugins.length;
        while (i-- && !_harnessPlugins[i].targetTest(target)) {
        }
        harnessPlugin = _harnessPlugins[i];
      }
      i = targets.length;
      while (i--) {
        targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
      }
      return targets;
    };
    _getCache = function _getCache2(target) {
      return target._gsap || _harness(toArray2(target))[0]._gsap;
    };
    _getProperty = function _getProperty2(target, property, v) {
      return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
    };
    _forEachName = function _forEachName2(names, func) {
      return (names = names.split(",")).forEach(func) || names;
    };
    _round = function _round2(value) {
      return Math.round(value * 1e5) / 1e5 || 0;
    };
    _roundPrecise = function _roundPrecise2(value) {
      return Math.round(value * 1e7) / 1e7 || 0;
    };
    _parseRelative = function _parseRelative2(start, value) {
      var operator = value.charAt(0), end = parseFloat(value.substr(2));
      start = parseFloat(start);
      return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
    };
    _arrayContainsAny = function _arrayContainsAny2(toSearch, toFind) {
      var l = toFind.length, i = 0;
      for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l; ) {
      }
      return i < l;
    };
    _lazyRender = function _lazyRender2() {
      var l = _lazyTweens.length, a = _lazyTweens.slice(0), i, tween;
      _lazyLookup = {};
      _lazyTweens.length = 0;
      for (i = 0; i < l; i++) {
        tween = a[i];
        tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
      }
    };
    _lazySafeRender = function _lazySafeRender2(animation, time, suppressEvents, force) {
      _lazyTweens.length && !_reverting && _lazyRender();
      animation.render(time, suppressEvents, force || _reverting && time < 0 && (animation._initted || animation._startAt));
      _lazyTweens.length && !_reverting && _lazyRender();
    };
    _numericIfPossible = function _numericIfPossible2(value) {
      var n = parseFloat(value);
      return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
    };
    _passThrough = function _passThrough2(p) {
      return p;
    };
    _setDefaults = function _setDefaults2(obj, defaults2) {
      for (var p in defaults2) {
        p in obj || (obj[p] = defaults2[p]);
      }
      return obj;
    };
    _setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
      return function(obj, defaults2) {
        for (var p in defaults2) {
          p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults2[p]);
        }
      };
    };
    _merge = function _merge2(base, toMerge) {
      for (var p in toMerge) {
        base[p] = toMerge[p];
      }
      return base;
    };
    _mergeDeep = function _mergeDeep2(base, toMerge) {
      for (var p in toMerge) {
        p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep2(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
      }
      return base;
    };
    _copyExcluding = function _copyExcluding2(obj, excluding) {
      var copy = {}, p;
      for (p in obj) {
        p in excluding || (copy[p] = obj[p]);
      }
      return copy;
    };
    _inheritDefaults = function _inheritDefaults2(vars) {
      var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;
      if (_isNotFalse(vars.inherit)) {
        while (parent) {
          func(vars, parent.vars.defaults);
          parent = parent.parent || parent._dp;
        }
      }
      return vars;
    };
    _arraysMatch = function _arraysMatch2(a1, a2) {
      var i = a1.length, match = i === a2.length;
      while (match && i-- && a1[i] === a2[i]) {
      }
      return i < 0;
    };
    _addLinkedListItem = function _addLinkedListItem2(parent, child, firstProp, lastProp, sortBy) {
      if (firstProp === void 0) {
        firstProp = "_first";
      }
      if (lastProp === void 0) {
        lastProp = "_last";
      }
      var prev = parent[lastProp], t;
      if (sortBy) {
        t = child[sortBy];
        while (prev && prev[sortBy] > t) {
          prev = prev._prev;
        }
      }
      if (prev) {
        child._next = prev._next;
        prev._next = child;
      } else {
        child._next = parent[firstProp];
        parent[firstProp] = child;
      }
      if (child._next) {
        child._next._prev = child;
      } else {
        parent[lastProp] = child;
      }
      child._prev = prev;
      child.parent = child._dp = parent;
      return child;
    };
    _removeLinkedListItem = function _removeLinkedListItem2(parent, child, firstProp, lastProp) {
      if (firstProp === void 0) {
        firstProp = "_first";
      }
      if (lastProp === void 0) {
        lastProp = "_last";
      }
      var prev = child._prev, next = child._next;
      if (prev) {
        prev._next = next;
      } else if (parent[firstProp] === child) {
        parent[firstProp] = next;
      }
      if (next) {
        next._prev = prev;
      } else if (parent[lastProp] === child) {
        parent[lastProp] = prev;
      }
      child._next = child._prev = child.parent = null;
    };
    _removeFromParent = function _removeFromParent2(child, onlyIfParentHasAutoRemove) {
      child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
      child._act = 0;
    };
    _uncache = function _uncache2(animation, child) {
      if (animation && (!child || child._end > animation._dur || child._start < 0)) {
        var a = animation;
        while (a) {
          a._dirty = 1;
          a = a.parent;
        }
      }
      return animation;
    };
    _recacheAncestors = function _recacheAncestors2(animation) {
      var parent = animation.parent;
      while (parent && parent.parent) {
        parent._dirty = 1;
        parent.totalDuration();
        parent = parent.parent;
      }
      return animation;
    };
    _rewindStartAt = function _rewindStartAt2(tween, totalTime, suppressEvents, force) {
      return tween._startAt && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
    };
    _hasNoPausedAncestors = function _hasNoPausedAncestors2(animation) {
      return !animation || animation._ts && _hasNoPausedAncestors2(animation.parent);
    };
    _elapsedCycleDuration = function _elapsedCycleDuration2(animation) {
      return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
    };
    _animationCycle = function _animationCycle2(tTime, cycleDuration) {
      var whole = Math.floor(tTime /= cycleDuration);
      return tTime && whole === tTime ? whole - 1 : whole;
    };
    _parentToChildTotalTime = function _parentToChildTotalTime2(parentTime, child) {
      return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
    };
    _setEnd = function _setEnd2(animation) {
      return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
    };
    _alignPlayhead = function _alignPlayhead2(animation, totalTime) {
      var parent = animation._dp;
      if (parent && parent.smoothChildTiming && animation._ts) {
        animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
        _setEnd(animation);
        parent._dirty || _uncache(parent, animation);
      }
      return animation;
    };
    _postAddChecks = function _postAddChecks2(timeline2, child) {
      var t;
      if (child._time || !child._dur && child._initted || child._start < timeline2._time && (child._dur || !child.add)) {
        t = _parentToChildTotalTime(timeline2.rawTime(), child);
        if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
          child.render(t, true);
        }
      }
      if (_uncache(timeline2, child)._dp && timeline2._initted && timeline2._time >= timeline2._dur && timeline2._ts) {
        if (timeline2._dur < timeline2.duration()) {
          t = timeline2;
          while (t._dp) {
            t.rawTime() >= 0 && t.totalTime(t._tTime);
            t = t._dp;
          }
        }
        timeline2._zTime = -_tinyNum;
      }
    };
    _addToTimeline = function _addToTimeline2(timeline2, child, position, skipChecks) {
      child.parent && _removeFromParent(child);
      child._start = _roundPrecise((_isNumber(position) ? position : position || timeline2 !== _globalTimeline ? _parsePosition(timeline2, position, child) : timeline2._time) + child._delay);
      child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
      _addLinkedListItem(timeline2, child, "_first", "_last", timeline2._sort ? "_start" : 0);
      _isFromOrFromStart(child) || (timeline2._recent = child);
      skipChecks || _postAddChecks(timeline2, child);
      timeline2._ts < 0 && _alignPlayhead(timeline2, timeline2._tTime);
      return timeline2;
    };
    _scrollTrigger = function _scrollTrigger2(animation, trigger) {
      return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
    };
    _attemptInitTween = function _attemptInitTween2(tween, time, force, suppressEvents, tTime) {
      _initTween(tween, time, tTime);
      if (!tween._initted) {
        return 1;
      }
      if (!force && tween._pt && !_reverting && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
        _lazyTweens.push(tween);
        tween._lazy = [tTime, suppressEvents];
        return 1;
      }
    };
    _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart2(_ref) {
      var parent = _ref.parent;
      return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart2(parent));
    };
    _isFromOrFromStart = function _isFromOrFromStart2(_ref2) {
      var data = _ref2.data;
      return data === "isFromStart" || data === "isStart";
    };
    _renderZeroDurationTween = function _renderZeroDurationTween2(tween, totalTime, suppressEvents, force) {
      var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
      if (repeatDelay && tween._repeat) {
        tTime = _clamp(0, tween._tDur, totalTime);
        iteration = _animationCycle(tTime, repeatDelay);
        tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
        if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
          prevRatio = 1 - ratio;
          tween.vars.repeatRefresh && tween._initted && tween.invalidate();
        }
      }
      if (ratio !== prevRatio || _reverting || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
        if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
          return;
        }
        prevIteration = tween._zTime;
        tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
        suppressEvents || (suppressEvents = totalTime && !prevIteration);
        tween.ratio = ratio;
        tween._from && (ratio = 1 - ratio);
        tween._time = 0;
        tween._tTime = tTime;
        pt = tween._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
        totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
        tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
        tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
        if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
          ratio && _removeFromParent(tween, 1);
          if (!suppressEvents && !_reverting) {
            _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
            tween._prom && tween._prom();
          }
        }
      } else if (!tween._zTime) {
        tween._zTime = totalTime;
      }
    };
    _findNextPauseTween = function _findNextPauseTween2(animation, prevTime, time) {
      var child;
      if (time > prevTime) {
        child = animation._first;
        while (child && child._start <= time) {
          if (child.data === "isPause" && child._start > prevTime) {
            return child;
          }
          child = child._next;
        }
      } else {
        child = animation._last;
        while (child && child._start >= time) {
          if (child.data === "isPause" && child._start < prevTime) {
            return child;
          }
          child = child._prev;
        }
      }
    };
    _setDuration = function _setDuration2(animation, duration, skipUncache, leavePlayhead) {
      var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
      totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
      animation._dur = dur;
      animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
      totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
      animation.parent && _setEnd(animation);
      skipUncache || _uncache(animation.parent, animation);
      return animation;
    };
    _onUpdateTotalDuration = function _onUpdateTotalDuration2(animation) {
      return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
    };
    _zeroPosition = {
      _start: 0,
      endTime: _emptyFunc,
      totalDuration: _emptyFunc
    };
    _parsePosition = function _parsePosition2(animation, position, percentAnimation) {
      var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur, i, offset, isPercent;
      if (_isString(position) && (isNaN(position) || position in labels)) {
        offset = position.charAt(0);
        isPercent = position.substr(-1) === "%";
        i = position.indexOf("=");
        if (offset === "<" || offset === ">") {
          i >= 0 && (position = position.replace(/=/, ""));
          return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
        }
        if (i < 0) {
          position in labels || (labels[position] = clippedDuration);
          return labels[position];
        }
        offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
        if (isPercent && percentAnimation) {
          offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
        }
        return i > 1 ? _parsePosition2(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
      }
      return position == null ? clippedDuration : +position;
    };
    _createTweenType = function _createTweenType2(type, params, timeline2) {
      var isLegacy = _isNumber(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex], irVars, parent;
      isLegacy && (vars.duration = params[1]);
      vars.parent = timeline2;
      if (type) {
        irVars = vars;
        parent = timeline2;
        while (parent && !("immediateRender" in irVars)) {
          irVars = parent.vars.defaults || {};
          parent = _isNotFalse(parent.vars.inherit) && parent.parent;
        }
        vars.immediateRender = _isNotFalse(irVars.immediateRender);
        type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
      }
      return new Tween(params[0], vars, params[varsIndex + 1]);
    };
    _conditionalReturn = function _conditionalReturn2(value, func) {
      return value || value === 0 ? func(value) : func;
    };
    _clamp = function _clamp2(min, max, value) {
      return value < min ? min : value > max ? max : value;
    };
    getUnit = function getUnit2(value, v) {
      return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
    };
    clamp = function clamp2(min, max, value) {
      return _conditionalReturn(value, function(v) {
        return _clamp(min, max, v);
      });
    };
    _slice = [].slice;
    _isArrayLike = function _isArrayLike2(value, nonEmpty) {
      return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
    };
    _flatten = function _flatten2(ar, leaveStrings, accumulator) {
      if (accumulator === void 0) {
        accumulator = [];
      }
      return ar.forEach(function(value) {
        var _accumulator;
        return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray2(value)) : accumulator.push(value);
      }) || accumulator;
    };
    toArray2 = function toArray3(value, scope, leaveStrings) {
      return _context && !scope && _context.selector ? _context.selector(value) : _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
    };
    selector = function selector2(value) {
      value = toArray2(value)[0] || _warn("Invalid scope") || {};
      return function(v) {
        var el = value.current || value.nativeElement || value;
        return toArray2(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc.createElement("div") : value);
      };
    };
    shuffle = function shuffle2(a) {
      return a.sort(function() {
        return 0.5 - Math.random();
      });
    };
    distribute = function distribute2(v) {
      if (_isFunction(v)) {
        return v;
      }
      var vars = _isObject(v) ? v : {
        each: v
      }, ease = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache2 = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
      if (_isString(from)) {
        ratioX = ratioY = {
          center: 0.5,
          edges: 0.5,
          end: 1
        }[from] || 0;
      } else if (!isDecimal && ratios) {
        ratioX = from[0];
        ratioY = from[1];
      }
      return function(i, target, a) {
        var l = (a || vars).length, distances = cache2[l], originX, originY, x, y, d, j, max, min, wrapAt;
        if (!distances) {
          wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];
          if (!wrapAt) {
            max = -_bigNum;
            while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {
            }
            wrapAt < l && wrapAt--;
          }
          distances = cache2[l] = [];
          originX = ratios ? Math.min(wrapAt, l) * ratioX - 0.5 : from % wrapAt;
          originY = wrapAt === _bigNum ? 0 : ratios ? l * ratioY / wrapAt - 0.5 : from / wrapAt | 0;
          max = 0;
          min = _bigNum;
          for (j = 0; j < l; j++) {
            x = j % wrapAt - originX;
            y = originY - (j / wrapAt | 0);
            distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
            d > max && (max = d);
            d < min && (min = d);
          }
          from === "random" && shuffle(distances);
          distances.max = max - min;
          distances.min = min;
          distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
          distances.b = l < 0 ? base - l : base;
          distances.u = getUnit(vars.amount || vars.each) || 0;
          ease = ease && l < 0 ? _invertEase(ease) : ease;
        }
        l = (distances[i] - distances.min) / distances.max || 0;
        return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
      };
    };
    _roundModifier = function _roundModifier2(v) {
      var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
      return function(raw) {
        var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
        return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw));
      };
    };
    snap = function snap2(snapTo, value) {
      var isArray = _isArray(snapTo), radius, is2D;
      if (!isArray && _isObject(snapTo)) {
        radius = isArray = snapTo.radius || _bigNum;
        if (snapTo.values) {
          snapTo = toArray2(snapTo.values);
          if (is2D = !_isNumber(snapTo[0])) {
            radius *= radius;
          }
        } else {
          snapTo = _roundModifier(snapTo.increment);
        }
      }
      return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function(raw) {
        is2D = snapTo(raw);
        return Math.abs(is2D - raw) <= radius ? is2D : raw;
      } : function(raw) {
        var x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min = _bigNum, closest = 0, i = snapTo.length, dx, dy;
        while (i--) {
          if (is2D) {
            dx = snapTo[i].x - x;
            dy = snapTo[i].y - y;
            dx = dx * dx + dy * dy;
          } else {
            dx = Math.abs(snapTo[i] - x);
          }
          if (dx < min) {
            min = dx;
            closest = i;
          }
        }
        closest = !radius || min <= radius ? snapTo[closest] : raw;
        return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
      });
    };
    random = function random2(min, max, roundingIncrement, returnFunction) {
      return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function() {
        return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * 0.99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
      });
    };
    pipe = function pipe2() {
      for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
        functions[_key] = arguments[_key];
      }
      return function(value) {
        return functions.reduce(function(v, f) {
          return f(v);
        }, value);
      };
    };
    unitize = function unitize2(func, unit) {
      return function(value) {
        return func(parseFloat(value)) + (unit || getUnit(value));
      };
    };
    normalize = function normalize2(min, max, value) {
      return mapRange(min, max, 0, 1, value);
    };
    _wrapArray = function _wrapArray2(a, wrapper, value) {
      return _conditionalReturn(value, function(index) {
        return a[~~wrapper(index)];
      });
    };
    wrap = function wrap2(min, max, value) {
      var range = max - min;
      return _isArray(min) ? _wrapArray(min, wrap2(0, min.length), max) : _conditionalReturn(value, function(value2) {
        return (range + (value2 - min) % range) % range + min;
      });
    };
    wrapYoyo = function wrapYoyo2(min, max, value) {
      var range = max - min, total = range * 2;
      return _isArray(min) ? _wrapArray(min, wrapYoyo2(0, min.length - 1), max) : _conditionalReturn(value, function(value2) {
        value2 = (total + (value2 - min) % total) % total || 0;
        return min + (value2 > range ? total - value2 : value2);
      });
    };
    _replaceRandom = function _replaceRandom2(value) {
      var prev = 0, s = "", i, nums, end, isArray;
      while (~(i = value.indexOf("random(", prev))) {
        end = value.indexOf(")", i);
        isArray = value.charAt(i + 7) === "[";
        nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
        s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
        prev = end + 1;
      }
      return s + value.substr(prev, value.length - prev);
    };
    mapRange = function mapRange2(inMin, inMax, outMin, outMax, value) {
      var inRange = inMax - inMin, outRange = outMax - outMin;
      return _conditionalReturn(value, function(value2) {
        return outMin + ((value2 - inMin) / inRange * outRange || 0);
      });
    };
    interpolate = function interpolate2(start, end, progress, mutate) {
      var func = isNaN(start + end) ? 0 : function(p2) {
        return (1 - p2) * start + p2 * end;
      };
      if (!func) {
        var isString = _isString(start), master = {}, p, i, interpolators, l, il;
        progress === true && (mutate = 1) && (progress = null);
        if (isString) {
          start = {
            p: start
          };
          end = {
            p: end
          };
        } else if (_isArray(start) && !_isArray(end)) {
          interpolators = [];
          l = start.length;
          il = l - 2;
          for (i = 1; i < l; i++) {
            interpolators.push(interpolate2(start[i - 1], start[i]));
          }
          l--;
          func = function func2(p2) {
            p2 *= l;
            var i2 = Math.min(il, ~~p2);
            return interpolators[i2](p2 - i2);
          };
          progress = end;
        } else if (!mutate) {
          start = _merge(_isArray(start) ? [] : {}, start);
        }
        if (!interpolators) {
          for (p in end) {
            _addPropTween.call(master, start, p, "get", end[p]);
          }
          func = function func2(p2) {
            return _renderPropTweens(p2, master) || (isString ? start.p : start);
          };
        }
      }
      return _conditionalReturn(progress, func);
    };
    _getLabelInDirection = function _getLabelInDirection2(timeline2, fromTime, backward) {
      var labels = timeline2.labels, min = _bigNum, p, distance, label;
      for (p in labels) {
        distance = labels[p] - fromTime;
        if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
          label = p;
          min = distance;
        }
      }
      return label;
    };
    _callback = function _callback2(animation, type, executeLazyFirst) {
      var v = animation.vars, callback = v[type], prevContext = _context, context3 = animation._ctx, params, scope, result;
      if (!callback) {
        return;
      }
      params = v[type + "Params"];
      scope = v.callbackScope || animation;
      executeLazyFirst && _lazyTweens.length && _lazyRender();
      context3 && (_context = context3);
      result = params ? callback.apply(scope, params) : callback.call(scope);
      _context = prevContext;
      return result;
    };
    _interrupt = function _interrupt2(animation) {
      _removeFromParent(animation);
      animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting);
      animation.progress() < 1 && _callback(animation, "onInterrupt");
      return animation;
    };
    _registerPluginQueue = [];
    _createPlugin = function _createPlugin2(config3) {
      if (!config3) return;
      config3 = !config3.name && config3["default"] || config3;
      if (_windowExists() || config3.headless) {
        var name = config3.name, isFunc = _isFunction(config3), Plugin = name && !isFunc && config3.init ? function() {
          this._props = [];
        } : config3, instanceDefaults = {
          init: _emptyFunc,
          render: _renderPropTweens,
          add: _addPropTween,
          kill: _killPropTweensOf,
          modifier: _addPluginModifier,
          rawVars: 0
        }, statics = {
          targetTest: 0,
          get: 0,
          getSetter: _getSetter,
          aliases: {},
          register: 0
        };
        _wake();
        if (config3 !== Plugin) {
          if (_plugins[name]) {
            return;
          }
          _setDefaults(Plugin, _setDefaults(_copyExcluding(config3, instanceDefaults), statics));
          _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config3, statics)));
          _plugins[Plugin.prop = name] = Plugin;
          if (config3.targetTest) {
            _harnessPlugins.push(Plugin);
            _reservedProps[name] = 1;
          }
          name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
        }
        _addGlobal(name, Plugin);
        config3.register && config3.register(gsap, Plugin, PropTween);
      } else {
        _registerPluginQueue.push(config3);
      }
    };
    _255 = 255;
    _colorLookup = {
      aqua: [0, _255, _255],
      lime: [0, _255, 0],
      silver: [192, 192, 192],
      black: [0, 0, 0],
      maroon: [128, 0, 0],
      teal: [0, 128, 128],
      blue: [0, 0, _255],
      navy: [0, 0, 128],
      white: [_255, _255, _255],
      olive: [128, 128, 0],
      yellow: [_255, _255, 0],
      orange: [_255, 165, 0],
      gray: [128, 128, 128],
      purple: [128, 0, 128],
      green: [0, 128, 0],
      red: [_255, 0, 0],
      pink: [_255, 192, 203],
      cyan: [0, _255, _255],
      transparent: [_255, _255, _255, 0]
    };
    _hue = function _hue2(h, m1, m2) {
      h += h < 0 ? 1 : h > 1 ? -1 : 0;
      return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < 0.5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + 0.5 | 0;
    };
    splitColor = function splitColor2(v, toHSL, forceAlpha) {
      var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0, r, g, b, h, s, l, max, min, d, wasHSL;
      if (!a) {
        if (v.substr(-1) === ",") {
          v = v.substr(0, v.length - 1);
        }
        if (_colorLookup[v]) {
          a = _colorLookup[v];
        } else if (v.charAt(0) === "#") {
          if (v.length < 6) {
            r = v.charAt(1);
            g = v.charAt(2);
            b = v.charAt(3);
            v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
          }
          if (v.length === 9) {
            a = parseInt(v.substr(1, 6), 16);
            return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
          }
          v = parseInt(v.substr(1), 16);
          a = [v >> 16, v >> 8 & _255, v & _255];
        } else if (v.substr(0, 3) === "hsl") {
          a = wasHSL = v.match(_strictNumExp);
          if (!toHSL) {
            h = +a[0] % 360 / 360;
            s = +a[1] / 100;
            l = +a[2] / 100;
            g = l <= 0.5 ? l * (s + 1) : l + s - l * s;
            r = l * 2 - g;
            a.length > 3 && (a[3] *= 1);
            a[0] = _hue(h + 1 / 3, r, g);
            a[1] = _hue(h, r, g);
            a[2] = _hue(h - 1 / 3, r, g);
          } else if (~v.indexOf("=")) {
            a = v.match(_numExp);
            forceAlpha && a.length < 4 && (a[3] = 1);
            return a;
          }
        } else {
          a = v.match(_strictNumExp) || _colorLookup.transparent;
        }
        a = a.map(Number);
      }
      if (toHSL && !wasHSL) {
        r = a[0] / _255;
        g = a[1] / _255;
        b = a[2] / _255;
        max = Math.max(r, g, b);
        min = Math.min(r, g, b);
        l = (max + min) / 2;
        if (max === min) {
          h = s = 0;
        } else {
          d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
          h *= 60;
        }
        a[0] = ~~(h + 0.5);
        a[1] = ~~(s * 100 + 0.5);
        a[2] = ~~(l * 100 + 0.5);
      }
      forceAlpha && a.length < 4 && (a[3] = 1);
      return a;
    };
    _colorOrderData = function _colorOrderData2(v) {
      var values = [], c = [], i = -1;
      v.split(_colorExp).forEach(function(v2) {
        var a = v2.match(_numWithUnitExp) || [];
        values.push.apply(values, a);
        c.push(i += a.length + 1);
      });
      values.c = c;
      return values;
    };
    _formatColors = function _formatColors2(s, toHSL, orderMatchData) {
      var result = "", colors = (s + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i = 0, c, shell, d, l;
      if (!colors) {
        return s;
      }
      colors = colors.map(function(color) {
        return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
      });
      if (orderMatchData) {
        d = _colorOrderData(s);
        c = orderMatchData.c;
        if (c.join(result) !== d.c.join(result)) {
          shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
          l = shell.length - 1;
          for (; i < l; i++) {
            result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
          }
        }
      }
      if (!shell) {
        shell = s.split(_colorExp);
        l = shell.length - 1;
        for (; i < l; i++) {
          result += shell[i] + colors[i];
        }
      }
      return result + shell[l];
    };
    _colorExp = (function() {
      var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p;
      for (p in _colorLookup) {
        s += "|" + p + "\\b";
      }
      return new RegExp(s + ")", "gi");
    })();
    _hslExp = /hsl[a]?\(/;
    _colorStringFilter = function _colorStringFilter2(a) {
      var combined = a.join(" "), toHSL;
      _colorExp.lastIndex = 0;
      if (_colorExp.test(combined)) {
        toHSL = _hslExp.test(combined);
        a[1] = _formatColors(a[1], toHSL);
        a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
        return true;
      }
    };
    _ticker = (function() {
      var _getTime = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners2 = [], _id, _req, _raf, _self, _delta, _i, _tick = function _tick2(v) {
        var elapsed = _getTime() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame;
        (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
        _lastUpdate += elapsed;
        time = _lastUpdate - _startTime;
        overlap = time - _nextTime;
        if (overlap > 0 || manual) {
          frame = ++_self.frame;
          _delta = time - _self.time * 1e3;
          _self.time = time = time / 1e3;
          _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
          dispatch = 1;
        }
        manual || (_id = _req(_tick2));
        if (dispatch) {
          for (_i = 0; _i < _listeners2.length; _i++) {
            _listeners2[_i](time, _delta, frame, v);
          }
        }
      };
      _self = {
        time: 0,
        frame: 0,
        tick: function tick() {
          _tick(true);
        },
        deltaRatio: function deltaRatio(fps) {
          return _delta / (1e3 / (fps || 60));
        },
        wake: function wake() {
          if (_coreReady) {
            if (!_coreInitted && _windowExists()) {
              _win = _coreInitted = window;
              _doc = _win.document || {};
              _globals.gsap = gsap;
              (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);
              _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});
              _registerPluginQueue.forEach(_createPlugin);
            }
            _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
            _id && _self.sleep();
            _req = _raf || function(f) {
              return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
            };
            _tickerActive = 1;
            _tick(2);
          }
        },
        sleep: function sleep() {
          (_raf ? cancelAnimationFrame : clearTimeout)(_id);
          _tickerActive = 0;
          _req = _emptyFunc;
        },
        lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
          _lagThreshold = threshold || Infinity;
          _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
        },
        fps: function fps(_fps) {
          _gap = 1e3 / (_fps || 240);
          _nextTime = _self.time * 1e3 + _gap;
        },
        add: function add(callback, once, prioritize) {
          var func = once ? function(t, d, f, v) {
            callback(t, d, f, v);
            _self.remove(func);
          } : callback;
          _self.remove(callback);
          _listeners2[prioritize ? "unshift" : "push"](func);
          _wake();
          return func;
        },
        remove: function remove(callback, i) {
          ~(i = _listeners2.indexOf(callback)) && _listeners2.splice(i, 1) && _i >= i && _i--;
        },
        _listeners: _listeners2
      };
      return _self;
    })();
    _wake = function _wake2() {
      return !_tickerActive && _ticker.wake();
    };
    _easeMap = {};
    _customEaseExp = /^[\d.\-M][\d.\-,\s]/;
    _quotesExp = /["']/g;
    _parseObjectInString = function _parseObjectInString2(value) {
      var obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i = 1, l = split.length, index, val, parsedVal;
      for (; i < l; i++) {
        val = split[i];
        index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
        parsedVal = val.substr(0, index);
        obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
        key = val.substr(index + 1).trim();
      }
      return obj;
    };
    _valueInParentheses = function _valueInParentheses2(value) {
      var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
      return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
    };
    _configEaseFromString = function _configEaseFromString2(name) {
      var split = (name + "").split("("), ease = _easeMap[split[0]];
      return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
    };
    _invertEase = function _invertEase2(ease) {
      return function(p) {
        return 1 - ease(1 - p);
      };
    };
    _propagateYoyoEase = function _propagateYoyoEase2(timeline2, isYoyo) {
      var child = timeline2._first, ease;
      while (child) {
        if (child instanceof Timeline) {
          _propagateYoyoEase2(child, isYoyo);
        } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
          if (child.timeline) {
            _propagateYoyoEase2(child.timeline, isYoyo);
          } else {
            ease = child._ease;
            child._ease = child._yEase;
            child._yEase = ease;
            child._yoyo = isYoyo;
          }
        }
        child = child._next;
      }
    };
    _parseEase = function _parseEase2(ease, defaultEase) {
      return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
    };
    _insertEase = function _insertEase2(names, easeIn, easeOut, easeInOut) {
      if (easeOut === void 0) {
        easeOut = function easeOut2(p) {
          return 1 - easeIn(1 - p);
        };
      }
      if (easeInOut === void 0) {
        easeInOut = function easeInOut2(p) {
          return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
        };
      }
      var ease = {
        easeIn,
        easeOut,
        easeInOut
      }, lowercaseName;
      _forEachName(names, function(name) {
        _easeMap[name] = _globals[name] = ease;
        _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
        for (var p in ease) {
          _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
        }
      });
      return ease;
    };
    _easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
      return function(p) {
        return p < 0.5 ? (1 - easeOut(1 - p * 2)) / 2 : 0.5 + easeOut((p - 0.5) * 2) / 2;
      };
    };
    _configElastic = function _configElastic2(type, amplitude, period) {
      var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut2(p) {
        return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
      }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
        return 1 - easeOut(1 - p);
      } : _easeInOutFromOut(easeOut);
      p2 = _2PI / p2;
      ease.config = function(amplitude2, period2) {
        return _configElastic2(type, amplitude2, period2);
      };
      return ease;
    };
    _configBack = function _configBack2(type, overshoot) {
      if (overshoot === void 0) {
        overshoot = 1.70158;
      }
      var easeOut = function easeOut2(p) {
        return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
      }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
        return 1 - easeOut(1 - p);
      } : _easeInOutFromOut(easeOut);
      ease.config = function(overshoot2) {
        return _configBack2(type, overshoot2);
      };
      return ease;
    };
    _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function(name, i) {
      var power = i < 5 ? i + 1 : i;
      _insertEase(name + ",Power" + (power - 1), i ? function(p) {
        return Math.pow(p, power);
      } : function(p) {
        return p;
      }, function(p) {
        return 1 - Math.pow(1 - p, power);
      }, function(p) {
        return p < 0.5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
      });
    });
    _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
    _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
    (function(n, c) {
      var n1 = 1 / c, n2 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut2(p) {
        return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + 0.75 : p < n3 ? n * (p -= 2.25 / c) * p + 0.9375 : n * Math.pow(p - 2.625 / c, 2) + 0.984375;
      };
      _insertEase("Bounce", function(p) {
        return 1 - easeOut(1 - p);
      }, easeOut);
    })(7.5625, 2.75);
    _insertEase("Expo", function(p) {
      return p ? Math.pow(2, 10 * (p - 1)) : 0;
    });
    _insertEase("Circ", function(p) {
      return -(_sqrt(1 - p * p) - 1);
    });
    _insertEase("Sine", function(p) {
      return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
    });
    _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
    _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
      config: function config(steps, immediateStart) {
        if (steps === void 0) {
          steps = 1;
        }
        var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
        return function(p) {
          return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
        };
      }
    };
    _defaults.ease = _easeMap["quad.out"];
    _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(name) {
      return _callbackNames += name + "," + name + "Params,";
    });
    GSCache = function GSCache2(target, harness) {
      this.id = _gsID++;
      target._gsap = this;
      this.target = target;
      this.harness = harness;
      this.get = harness ? harness.get : _getProperty;
      this.set = harness ? harness.getSetter : _getSetter;
    };
    Animation = /* @__PURE__ */ (function() {
      function Animation2(vars) {
        this.vars = vars;
        this._delay = +vars.delay || 0;
        if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
          this._rDelay = vars.repeatDelay || 0;
          this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
        }
        this._ts = 1;
        _setDuration(this, +vars.duration, 1, 1);
        this.data = vars.data;
        if (_context) {
          this._ctx = _context;
          _context.data.push(this);
        }
        _tickerActive || _ticker.wake();
      }
      var _proto = Animation2.prototype;
      _proto.delay = function delay(value) {
        if (value || value === 0) {
          this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
          this._delay = value;
          return this;
        }
        return this._delay;
      };
      _proto.duration = function duration(value) {
        return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
      };
      _proto.totalDuration = function totalDuration(value) {
        if (!arguments.length) {
          return this._tDur;
        }
        this._dirty = 0;
        return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
      };
      _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
        _wake();
        if (!arguments.length) {
          return this._tTime;
        }
        var parent = this._dp;
        if (parent && parent.smoothChildTiming && this._ts) {
          _alignPlayhead(this, _totalTime);
          !parent._dp || parent.parent || _postAddChecks(parent, this);
          while (parent && parent.parent) {
            if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
              parent.totalTime(parent._tTime, true);
            }
            parent = parent.parent;
          }
          if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
            _addToTimeline(this._dp, this, this._start - this._delay);
          }
        }
        if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
          this._ts || (this._pTime = _totalTime);
          _lazySafeRender(this, _totalTime, suppressEvents);
        }
        return this;
      };
      _proto.time = function time(value, suppressEvents) {
        return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
      };
      _proto.totalProgress = function totalProgress(value, suppressEvents) {
        return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0;
      };
      _proto.progress = function progress(value, suppressEvents) {
        return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
      };
      _proto.iteration = function iteration(value, suppressEvents) {
        var cycleDuration = this.duration() + this._rDelay;
        return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
      };
      _proto.timeScale = function timeScale(value, suppressEvents) {
        if (!arguments.length) {
          return this._rts === -_tinyNum ? 0 : this._rts;
        }
        if (this._rts === value) {
          return this;
        }
        var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
        this._rts = +value || 0;
        this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
        this.totalTime(_clamp(-Math.abs(this._delay), this._tDur, tTime), suppressEvents !== false);
        _setEnd(this);
        return _recacheAncestors(this);
      };
      _proto.paused = function paused(value) {
        if (!arguments.length) {
          return this._ps;
        }
        if (this._ps !== value) {
          this._ps = value;
          if (value) {
            this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
            this._ts = this._act = 0;
          } else {
            _wake();
            this._ts = this._rts;
            this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
          }
        }
        return this;
      };
      _proto.startTime = function startTime(value) {
        if (arguments.length) {
          this._start = value;
          var parent = this.parent || this._dp;
          parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
          return this;
        }
        return this._start;
      };
      _proto.endTime = function endTime(includeRepeats) {
        return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
      };
      _proto.rawTime = function rawTime(wrapRepeats) {
        var parent = this.parent || this._dp;
        return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
      };
      _proto.revert = function revert(config3) {
        if (config3 === void 0) {
          config3 = _revertConfig;
        }
        var prevIsReverting = _reverting;
        _reverting = config3;
        if (this._initted || this._startAt) {
          this.timeline && this.timeline.revert(config3);
          this.totalTime(-0.01, config3.suppressEvents);
        }
        this.data !== "nested" && config3.kill !== false && this.kill();
        _reverting = prevIsReverting;
        return this;
      };
      _proto.globalTime = function globalTime(rawTime) {
        var animation = this, time = arguments.length ? rawTime : animation.rawTime();
        while (animation) {
          time = animation._start + time / (Math.abs(animation._ts) || 1);
          animation = animation._dp;
        }
        return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time;
      };
      _proto.repeat = function repeat(value) {
        if (arguments.length) {
          this._repeat = value === Infinity ? -2 : value;
          return _onUpdateTotalDuration(this);
        }
        return this._repeat === -2 ? Infinity : this._repeat;
      };
      _proto.repeatDelay = function repeatDelay(value) {
        if (arguments.length) {
          var time = this._time;
          this._rDelay = value;
          _onUpdateTotalDuration(this);
          return time ? this.time(time) : this;
        }
        return this._rDelay;
      };
      _proto.yoyo = function yoyo(value) {
        if (arguments.length) {
          this._yoyo = value;
          return this;
        }
        return this._yoyo;
      };
      _proto.seek = function seek(position, suppressEvents) {
        return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
      };
      _proto.restart = function restart(includeDelay, suppressEvents) {
        return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
      };
      _proto.play = function play(from, suppressEvents) {
        from != null && this.seek(from, suppressEvents);
        return this.reversed(false).paused(false);
      };
      _proto.reverse = function reverse(from, suppressEvents) {
        from != null && this.seek(from || this.totalDuration(), suppressEvents);
        return this.reversed(true).paused(false);
      };
      _proto.pause = function pause(atTime, suppressEvents) {
        atTime != null && this.seek(atTime, suppressEvents);
        return this.paused(true);
      };
      _proto.resume = function resume() {
        return this.paused(false);
      };
      _proto.reversed = function reversed(value) {
        if (arguments.length) {
          !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
          return this;
        }
        return this._rts < 0;
      };
      _proto.invalidate = function invalidate() {
        this._initted = this._act = 0;
        this._zTime = -_tinyNum;
        return this;
      };
      _proto.isActive = function isActive() {
        var parent = this.parent || this._dp, start = this._start, rawTime;
        return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
      };
      _proto.eventCallback = function eventCallback(type, callback, params) {
        var vars = this.vars;
        if (arguments.length > 1) {
          if (!callback) {
            delete vars[type];
          } else {
            vars[type] = callback;
            params && (vars[type + "Params"] = params);
            type === "onUpdate" && (this._onUpdate = callback);
          }
          return this;
        }
        return vars[type];
      };
      _proto.then = function then(onFulfilled) {
        var self = this;
        return new Promise(function(resolve) {
          var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough, _resolve = function _resolve2() {
            var _then = self.then;
            self.then = null;
            _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
            resolve(f);
            self.then = _then;
          };
          if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
            _resolve();
          } else {
            self._prom = _resolve;
          }
        });
      };
      _proto.kill = function kill() {
        _interrupt(this);
      };
      return Animation2;
    })();
    _setDefaults(Animation.prototype, {
      _time: 0,
      _start: 0,
      _end: 0,
      _tTime: 0,
      _tDur: 0,
      _dirty: 0,
      _repeat: 0,
      _yoyo: false,
      parent: null,
      _initted: false,
      _rDelay: 0,
      _ts: 1,
      _dp: 0,
      ratio: 0,
      _zTime: -_tinyNum,
      _prom: 0,
      _ps: false,
      _rts: 1
    });
    Timeline = /* @__PURE__ */ (function(_Animation) {
      _inheritsLoose(Timeline2, _Animation);
      function Timeline2(vars, position) {
        var _this;
        if (vars === void 0) {
          vars = {};
        }
        _this = _Animation.call(this, vars) || this;
        _this.labels = {};
        _this.smoothChildTiming = !!vars.smoothChildTiming;
        _this.autoRemoveChildren = !!vars.autoRemoveChildren;
        _this._sort = _isNotFalse(vars.sortChildren);
        _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
        vars.reversed && _this.reverse();
        vars.paused && _this.paused(true);
        vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
        return _this;
      }
      var _proto2 = Timeline2.prototype;
      _proto2.to = function to(targets, vars, position) {
        _createTweenType(0, arguments, this);
        return this;
      };
      _proto2.from = function from(targets, vars, position) {
        _createTweenType(1, arguments, this);
        return this;
      };
      _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
        _createTweenType(2, arguments, this);
        return this;
      };
      _proto2.set = function set(targets, vars, position) {
        vars.duration = 0;
        vars.parent = this;
        _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
        vars.immediateRender = !!vars.immediateRender;
        new Tween(targets, vars, _parsePosition(this, position), 1);
        return this;
      };
      _proto2.call = function call(callback, params, position) {
        return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
      };
      _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
        vars.duration = duration;
        vars.stagger = vars.stagger || stagger;
        vars.onComplete = onCompleteAll;
        vars.onCompleteParams = onCompleteAllParams;
        vars.parent = this;
        new Tween(targets, vars, _parsePosition(this, position));
        return this;
      };
      _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
        vars.runBackwards = 1;
        _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
        return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
      };
      _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
        toVars.startAt = fromVars;
        _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
        return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
      };
      _proto2.render = function render3(totalTime, suppressEvents, force) {
        var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
        this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
        if (tTime !== this._tTime || force || crossingStart) {
          if (prevTime !== this._time && dur) {
            tTime += this._time - prevTime;
            totalTime += this._time - prevTime;
          }
          time = tTime;
          prevStart = this._start;
          timeScale = this._ts;
          prevPaused = !timeScale;
          if (crossingStart) {
            dur || (prevTime = this._zTime);
            (totalTime || !suppressEvents) && (this._zTime = totalTime);
          }
          if (this._repeat) {
            yoyo = this._yoyo;
            cycleDuration = dur + this._rDelay;
            if (this._repeat < -1 && totalTime < 0) {
              return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
            }
            time = _roundPrecise(tTime % cycleDuration);
            if (tTime === tDur) {
              iteration = this._repeat;
              time = dur;
            } else {
              iteration = ~~(tTime / cycleDuration);
              if (iteration && iteration === tTime / cycleDuration) {
                time = dur;
                iteration--;
              }
              time > dur && (time = dur);
            }
            prevIteration = _animationCycle(this._tTime, cycleDuration);
            !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
            if (yoyo && iteration & 1) {
              time = dur - time;
              isYoyo = 1;
            }
            if (iteration !== prevIteration && !this._lock) {
              var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
              iteration < prevIteration && (rewinding = !rewinding);
              prevTime = rewinding ? 0 : tTime % dur ? dur : tTime;
              this._lock = 1;
              this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
              this._tTime = tTime;
              !suppressEvents && this.parent && _callback(this, "onRepeat");
              this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
              if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
                return this;
              }
              dur = this._dur;
              tDur = this._tDur;
              if (doesWrap) {
                this._lock = 2;
                prevTime = rewinding ? dur : -1e-4;
                this.render(prevTime, true);
                this.vars.repeatRefresh && !isYoyo && this.invalidate();
              }
              this._lock = 0;
              if (!this._ts && !prevPaused) {
                return this;
              }
              _propagateYoyoEase(this, isYoyo);
            }
          }
          if (this._hasPause && !this._forcing && this._lock < 2) {
            pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
            if (pauseTween) {
              tTime -= time - (time = pauseTween._start);
            }
          }
          this._tTime = tTime;
          this._time = time;
          this._act = !timeScale;
          if (!this._initted) {
            this._onUpdate = this.vars.onUpdate;
            this._initted = 1;
            this._zTime = totalTime;
            prevTime = 0;
          }
          if (!prevTime && time && !suppressEvents && !iteration) {
            _callback(this, "onStart");
            if (this._tTime !== tTime) {
              return this;
            }
          }
          if (time >= prevTime && totalTime >= 0) {
            child = this._first;
            while (child) {
              next = child._next;
              if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
                if (child.parent !== this) {
                  return this.render(totalTime, suppressEvents, force);
                }
                child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
                if (time !== this._time || !this._ts && !prevPaused) {
                  pauseTween = 0;
                  next && (tTime += this._zTime = -_tinyNum);
                  break;
                }
              }
              child = next;
            }
          } else {
            child = this._last;
            var adjustedTime = totalTime < 0 ? totalTime : time;
            while (child) {
              next = child._prev;
              if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
                if (child.parent !== this) {
                  return this.render(totalTime, suppressEvents, force);
                }
                child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting && (child._initted || child._startAt));
                if (time !== this._time || !this._ts && !prevPaused) {
                  pauseTween = 0;
                  next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
                  break;
                }
              }
              child = next;
            }
          }
          if (pauseTween && !suppressEvents) {
            this.pause();
            pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
            if (this._ts) {
              this._start = prevStart;
              _setEnd(this);
              return this.render(totalTime, suppressEvents, force);
            }
          }
          this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
          if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
            if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
              if (!this._lock) {
                (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
                if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
                  _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
                  this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
                }
              }
            }
          }
        }
        return this;
      };
      _proto2.add = function add(child, position) {
        var _this2 = this;
        _isNumber(position) || (position = _parsePosition(this, position, child));
        if (!(child instanceof Animation)) {
          if (_isArray(child)) {
            child.forEach(function(obj) {
              return _this2.add(obj, position);
            });
            return this;
          }
          if (_isString(child)) {
            return this.addLabel(child, position);
          }
          if (_isFunction(child)) {
            child = Tween.delayedCall(0, child);
          } else {
            return this;
          }
        }
        return this !== child ? _addToTimeline(this, child, position) : this;
      };
      _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
        if (nested === void 0) {
          nested = true;
        }
        if (tweens === void 0) {
          tweens = true;
        }
        if (timelines === void 0) {
          timelines = true;
        }
        if (ignoreBeforeTime === void 0) {
          ignoreBeforeTime = -_bigNum;
        }
        var a = [], child = this._first;
        while (child) {
          if (child._start >= ignoreBeforeTime) {
            if (child instanceof Tween) {
              tweens && a.push(child);
            } else {
              timelines && a.push(child);
              nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
            }
          }
          child = child._next;
        }
        return a;
      };
      _proto2.getById = function getById2(id) {
        var animations = this.getChildren(1, 1, 1), i = animations.length;
        while (i--) {
          if (animations[i].vars.id === id) {
            return animations[i];
          }
        }
      };
      _proto2.remove = function remove(child) {
        if (_isString(child)) {
          return this.removeLabel(child);
        }
        if (_isFunction(child)) {
          return this.killTweensOf(child);
        }
        _removeLinkedListItem(this, child);
        if (child === this._recent) {
          this._recent = this._last;
        }
        return _uncache(this);
      };
      _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
        if (!arguments.length) {
          return this._tTime;
        }
        this._forcing = 1;
        if (!this._dp && this._ts) {
          this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
        }
        _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
        this._forcing = 0;
        return this;
      };
      _proto2.addLabel = function addLabel(label, position) {
        this.labels[label] = _parsePosition(this, position);
        return this;
      };
      _proto2.removeLabel = function removeLabel(label) {
        delete this.labels[label];
        return this;
      };
      _proto2.addPause = function addPause(position, callback, params) {
        var t = Tween.delayedCall(0, callback || _emptyFunc, params);
        t.data = "isPause";
        this._hasPause = 1;
        return _addToTimeline(this, t, _parsePosition(this, position));
      };
      _proto2.removePause = function removePause(position) {
        var child = this._first;
        position = _parsePosition(this, position);
        while (child) {
          if (child._start === position && child.data === "isPause") {
            _removeFromParent(child);
          }
          child = child._next;
        }
      };
      _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
        var tweens = this.getTweensOf(targets, onlyActive), i = tweens.length;
        while (i--) {
          _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
        }
        return this;
      };
      _proto2.getTweensOf = function getTweensOf2(targets, onlyActive) {
        var a = [], parsedTargets = toArray2(targets), child = this._first, isGlobalTime = _isNumber(onlyActive), children;
        while (child) {
          if (child instanceof Tween) {
            if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
              a.push(child);
            }
          } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
            a.push.apply(a, children);
          }
          child = child._next;
        }
        return a;
      };
      _proto2.tweenTo = function tweenTo(position, vars) {
        vars = vars || {};
        var tl = this, endTime = _parsePosition(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl, _setDefaults({
          ease: vars.ease || "none",
          lazy: false,
          immediateRender: false,
          time: endTime,
          overwrite: "auto",
          duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
          onStart: function onStart() {
            tl.pause();
            if (!initted) {
              var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
              tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
              initted = 1;
            }
            _onStart && _onStart.apply(tween, onStartParams || []);
          }
        }, vars));
        return immediateRender ? tween.render(0) : tween;
      };
      _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
        return this.tweenTo(toPosition, _setDefaults({
          startAt: {
            time: _parsePosition(this, fromPosition)
          }
        }, vars));
      };
      _proto2.recent = function recent() {
        return this._recent;
      };
      _proto2.nextLabel = function nextLabel(afterTime) {
        if (afterTime === void 0) {
          afterTime = this._time;
        }
        return _getLabelInDirection(this, _parsePosition(this, afterTime));
      };
      _proto2.previousLabel = function previousLabel(beforeTime) {
        if (beforeTime === void 0) {
          beforeTime = this._time;
        }
        return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
      };
      _proto2.currentLabel = function currentLabel(value) {
        return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
      };
      _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
        if (ignoreBeforeTime === void 0) {
          ignoreBeforeTime = 0;
        }
        var child = this._first, labels = this.labels, p;
        while (child) {
          if (child._start >= ignoreBeforeTime) {
            child._start += amount;
            child._end += amount;
          }
          child = child._next;
        }
        if (adjustLabels) {
          for (p in labels) {
            if (labels[p] >= ignoreBeforeTime) {
              labels[p] += amount;
            }
          }
        }
        return _uncache(this);
      };
      _proto2.invalidate = function invalidate(soft) {
        var child = this._first;
        this._lock = 0;
        while (child) {
          child.invalidate(soft);
          child = child._next;
        }
        return _Animation.prototype.invalidate.call(this, soft);
      };
      _proto2.clear = function clear(includeLabels) {
        if (includeLabels === void 0) {
          includeLabels = true;
        }
        var child = this._first, next;
        while (child) {
          next = child._next;
          this.remove(child);
          child = next;
        }
        this._dp && (this._time = this._tTime = this._pTime = 0);
        includeLabels && (this.labels = {});
        return _uncache(this);
      };
      _proto2.totalDuration = function totalDuration(value) {
        var max = 0, self = this, child = self._last, prevStart = _bigNum, prev, start, parent;
        if (arguments.length) {
          return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
        }
        if (self._dirty) {
          parent = self.parent;
          while (child) {
            prev = child._prev;
            child._dirty && child.totalDuration();
            start = child._start;
            if (start > prevStart && self._sort && child._ts && !self._lock) {
              self._lock = 1;
              _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
            } else {
              prevStart = start;
            }
            if (start < 0 && child._ts) {
              max -= start;
              if (!parent && !self._dp || parent && parent.smoothChildTiming) {
                self._start += start / self._ts;
                self._time -= start;
                self._tTime -= start;
              }
              self.shiftChildren(-start, false, -Infinity);
              prevStart = 0;
            }
            child._end > max && child._ts && (max = child._end);
            child = prev;
          }
          _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);
          self._dirty = 0;
        }
        return self._tDur;
      };
      Timeline2.updateRoot = function updateRoot(time) {
        if (_globalTimeline._ts) {
          _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
          _lastRenderedFrame = _ticker.frame;
        }
        if (_ticker.frame >= _nextGCFrame) {
          _nextGCFrame += _config.autoSleep || 120;
          var child = _globalTimeline._first;
          if (!child || !child._ts) {
            if (_config.autoSleep && _ticker._listeners.length < 2) {
              while (child && !child._ts) {
                child = child._next;
              }
              child || _ticker.sleep();
            }
          }
        }
      };
      return Timeline2;
    })(Animation);
    _setDefaults(Timeline.prototype, {
      _lock: 0,
      _hasPause: 0,
      _forcing: 0
    });
    _addComplexStringPropTween = function _addComplexStringPropTween2(target, prop, start, end, setter, stringFilter, funcParam) {
      var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a;
      pt.b = start;
      pt.e = end;
      start += "";
      end += "";
      if (hasRandom = ~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }
      if (stringFilter) {
        a = [start, end];
        stringFilter(a, target, prop);
        start = a[0];
        end = a[1];
      }
      startNums = start.match(_complexStringNumExp) || [];
      while (result = _complexStringNumExp.exec(end)) {
        endNum = result[0];
        chunk = end.substring(index, result.index);
        if (color) {
          color = (color + 1) % 5;
        } else if (chunk.substr(-5) === "rgba(") {
          color = 1;
        }
        if (endNum !== startNums[matchIndex++]) {
          startNum = parseFloat(startNums[matchIndex - 1]) || 0;
          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
            s: startNum,
            c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
            m: color && color < 4 ? Math.round : 0
          };
          index = _complexStringNumExp.lastIndex;
        }
      }
      pt.c = index < end.length ? end.substring(index, end.length) : "";
      pt.fp = funcParam;
      if (_relExp.test(end) || hasRandom) {
        pt.e = 0;
      }
      this._pt = pt;
      return pt;
    };
    _addPropTween = function _addPropTween2(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
      _isFunction(end) && (end = end(index || 0, target, targets));
      var currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
      if (_isString(end)) {
        if (~end.indexOf("random(")) {
          end = _replaceRandom(end);
        }
        if (end.charAt(1) === "=") {
          pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
          if (pt || pt === 0) {
            end = pt;
          }
        }
      }
      if (!optional || parsedStart !== end || _forceAllPropTweens) {
        if (!isNaN(parsedStart * end) && end !== "") {
          pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
          funcParam && (pt.fp = funcParam);
          modifier && pt.modifier(modifier, this, target);
          return this._pt = pt;
        }
        !currentValue && !(prop in target) && _missingPlugin(prop, end);
        return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
      }
    };
    _processVars = function _processVars2(vars, index, target, targets, tween) {
      _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
      if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
        return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
      }
      var copy = {}, p;
      for (p in vars) {
        copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
      }
      return copy;
    };
    _checkPlugin = function _checkPlugin2(property, vars, tween, index, target, targets) {
      var plugin, pt, ptLookup, i;
      if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
        if (tween !== _quickTween) {
          ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
          i = plugin._props.length;
          while (i--) {
            ptLookup[plugin._props[i]] = pt;
          }
        }
      }
      return plugin;
    };
    _initTween = function _initTween2(tween, time, tTime) {
      var vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites, tl = tween.timeline, cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
      tl && (!keyframes || !ease) && (ease = "none");
      tween._ease = _parseEase(ease, _defaults.ease);
      tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
      if (yoyoEase && tween._yoyo && !tween._repeat) {
        yoyoEase = tween._yEase;
        tween._yEase = tween._ease;
        tween._ease = yoyoEase;
      }
      tween._from = !tl && !!vars.runBackwards;
      if (!tl || keyframes && !vars.stagger) {
        harness = targets[0] ? _getCache(targets[0]).harness : 0;
        harnessVars = harness && vars[harness.prop];
        cleanVars = _copyExcluding(vars, _reservedProps);
        if (prevStartAt) {
          prevStartAt._zTime < 0 && prevStartAt.progress(1);
          time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
          prevStartAt._lazy = 0;
        }
        if (startAt) {
          _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
            data: "isStart",
            overwrite: false,
            parent,
            immediateRender: true,
            lazy: !prevStartAt && _isNotFalse(lazy),
            startAt: null,
            delay: 0,
            onUpdate: onUpdate && function() {
              return _callback(tween, "onUpdate");
            },
            stagger: 0
          }, startAt)));
          tween._startAt._dp = 0;
          tween._startAt._sat = tween;
          time < 0 && (_reverting || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
          if (immediateRender) {
            if (dur && time <= 0 && tTime <= 0) {
              time && (tween._zTime = time);
              return;
            }
          }
        } else if (runBackwards && dur) {
          if (!prevStartAt) {
            time && (immediateRender = false);
            p = _setDefaults({
              overwrite: false,
              data: "isFromStart",
              //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
              lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
              immediateRender,
              //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
              stagger: 0,
              parent
              //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
            }, cleanVars);
            harnessVars && (p[harness.prop] = harnessVars);
            _removeFromParent(tween._startAt = Tween.set(targets, p));
            tween._startAt._dp = 0;
            tween._startAt._sat = tween;
            time < 0 && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
            tween._zTime = time;
            if (!immediateRender) {
              _initTween2(tween._startAt, _tinyNum, _tinyNum);
            } else if (!time) {
              return;
            }
          }
        }
        tween._pt = tween._ptCache = 0;
        lazy = dur && _isNotFalse(lazy) || lazy && !dur;
        for (i = 0; i < targets.length; i++) {
          target = targets[i];
          gsData = target._gsap || _harness(targets)[i]._gsap;
          tween._ptLookup[i] = ptLookup = {};
          _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
          index = fullTargets === targets ? i : fullTargets.indexOf(target);
          if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
            tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
            plugin._props.forEach(function(name) {
              ptLookup[name] = pt;
            });
            plugin.priority && (hasPriority = 1);
          }
          if (!harness || harnessVars) {
            for (p in cleanVars) {
              if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
                plugin.priority && (hasPriority = 1);
              } else {
                ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
              }
            }
          }
          tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
          if (autoOverwrite && tween._pt) {
            _overwritingTween = tween;
            _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
            overwritten = !tween.parent;
            _overwritingTween = 0;
          }
          tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
        }
        hasPriority && _sortPropTweensByPriority(tween);
        tween._onInit && tween._onInit(tween);
      }
      tween._onUpdate = onUpdate;
      tween._initted = (!tween._op || tween._pt) && !overwritten;
      keyframes && time <= 0 && tl.render(_bigNum, true, true);
    };
    _updatePropTweens = function _updatePropTweens2(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
      var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i;
      if (!ptCache) {
        ptCache = tween._ptCache[property] = [];
        lookup = tween._ptLookup;
        i = tween._targets.length;
        while (i--) {
          pt = lookup[i][property];
          if (pt && pt.d && pt.d._pt) {
            pt = pt.d._pt;
            while (pt && pt.p !== property && pt.fp !== property) {
              pt = pt._next;
            }
          }
          if (!pt) {
            _forceAllPropTweens = 1;
            tween.vars[property] = "+=0";
            _initTween(tween, time);
            _forceAllPropTweens = 0;
            return skipRecursion ? _warn(property + " not eligible for reset") : 1;
          }
          ptCache.push(pt);
        }
      }
      i = ptCache.length;
      while (i--) {
        rootPT = ptCache[i];
        pt = rootPT._pt || rootPT;
        pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
        pt.c = value - pt.s;
        rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e));
        rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
      }
    };
    _addAliasesToVars = function _addAliasesToVars2(targets, vars) {
      var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy, p, i, aliases;
      if (!propertyAliases) {
        return vars;
      }
      copy = _merge({}, vars);
      for (p in propertyAliases) {
        if (p in copy) {
          aliases = propertyAliases[p].split(",");
          i = aliases.length;
          while (i--) {
            copy[aliases[i]] = copy[p];
          }
        }
      }
      return copy;
    };
    _parseKeyframe = function _parseKeyframe2(prop, obj, allProps, easeEach) {
      var ease = obj.ease || easeEach || "power1.inOut", p, a;
      if (_isArray(obj)) {
        a = allProps[prop] || (allProps[prop] = []);
        obj.forEach(function(value, i) {
          return a.push({
            t: i / (obj.length - 1) * 100,
            v: value,
            e: ease
          });
        });
      } else {
        for (p in obj) {
          a = allProps[p] || (allProps[p] = []);
          p === "ease" || a.push({
            t: parseFloat(prop),
            v: obj[p],
            e: ease
          });
        }
      }
    };
    _parseFuncOrString = function _parseFuncOrString2(value, tween, i, target, targets) {
      return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
    };
    _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert";
    _staggerPropsToSkip = {};
    _forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function(name) {
      return _staggerPropsToSkip[name] = 1;
    });
    Tween = /* @__PURE__ */ (function(_Animation2) {
      _inheritsLoose(Tween2, _Animation2);
      function Tween2(targets, vars, position, skipInherit) {
        var _this3;
        if (typeof vars === "number") {
          position.duration = vars;
          vars = position;
          position = null;
        }
        _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
        var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults2 = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, yoyoEase = _this3$vars.yoyoEase, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray2(targets), tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
        _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
        _this3._ptLookup = [];
        _this3._overwrite = overwrite;
        if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
          vars = _this3.vars;
          tl = _this3.timeline = new Timeline({
            data: "nested",
            defaults: defaults2 || {},
            targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
          });
          tl.kill();
          tl.parent = tl._dp = _assertThisInitialized(_this3);
          tl._start = 0;
          if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
            l = parsedTargets.length;
            staggerFunc = stagger && distribute(stagger);
            if (_isObject(stagger)) {
              for (p in stagger) {
                if (~_staggerTweenProps.indexOf(p)) {
                  staggerVarsToMerge || (staggerVarsToMerge = {});
                  staggerVarsToMerge[p] = stagger[p];
                }
              }
            }
            for (i = 0; i < l; i++) {
              copy = _copyExcluding(vars, _staggerPropsToSkip);
              copy.stagger = 0;
              yoyoEase && (copy.yoyoEase = yoyoEase);
              staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
              curTarget = parsedTargets[i];
              copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
              copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
              if (!stagger && l === 1 && copy.delay) {
                _this3._delay = delay = copy.delay;
                _this3._start += delay;
                copy.delay = 0;
              }
              tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
              tl._ease = _easeMap.none;
            }
            tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
          } else if (keyframes) {
            _inheritDefaults(_setDefaults(tl.vars.defaults, {
              ease: "none"
            }));
            tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
            var time = 0, a, kf, v;
            if (_isArray(keyframes)) {
              keyframes.forEach(function(frame) {
                return tl.to(parsedTargets, frame, ">");
              });
              tl.duration();
            } else {
              copy = {};
              for (p in keyframes) {
                p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
              }
              for (p in copy) {
                a = copy[p].sort(function(a2, b) {
                  return a2.t - b.t;
                });
                time = 0;
                for (i = 0; i < a.length; i++) {
                  kf = a[i];
                  v = {
                    ease: kf.e,
                    duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
                  };
                  v[p] = kf.v;
                  tl.to(parsedTargets, v, time);
                  time += v.duration;
                }
              }
              tl.duration() < duration && tl.to({}, {
                duration: duration - tl.duration()
              });
            }
          }
          duration || _this3.duration(duration = tl.duration());
        } else {
          _this3.timeline = 0;
        }
        if (overwrite === true && !_suppressOverwrites) {
          _overwritingTween = _assertThisInitialized(_this3);
          _globalTimeline.killTweensOf(parsedTargets);
          _overwritingTween = 0;
        }
        _addToTimeline(parent, _assertThisInitialized(_this3), position);
        vars.reversed && _this3.reverse();
        vars.paused && _this3.paused(true);
        if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
          _this3._tTime = -_tinyNum;
          _this3.render(Math.max(0, -delay) || 0);
        }
        scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
        return _this3;
      }
      var _proto3 = Tween2.prototype;
      _proto3.render = function render3(totalTime, suppressEvents, force) {
        var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline2, yoyoEase;
        if (!dur) {
          _renderZeroDurationTween(this, totalTime, suppressEvents, force);
        } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative) {
          time = tTime;
          timeline2 = this.timeline;
          if (this._repeat) {
            cycleDuration = dur + this._rDelay;
            if (this._repeat < -1 && isNegative) {
              return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
            }
            time = _roundPrecise(tTime % cycleDuration);
            if (tTime === tDur) {
              iteration = this._repeat;
              time = dur;
            } else {
              iteration = ~~(tTime / cycleDuration);
              if (iteration && iteration === _roundPrecise(tTime / cycleDuration)) {
                time = dur;
                iteration--;
              }
              time > dur && (time = dur);
            }
            isYoyo = this._yoyo && iteration & 1;
            if (isYoyo) {
              yoyoEase = this._yEase;
              time = dur - time;
            }
            prevIteration = _animationCycle(this._tTime, cycleDuration);
            if (time === prevTime && !force && this._initted && iteration === prevIteration) {
              this._tTime = tTime;
              return this;
            }
            if (iteration !== prevIteration) {
              timeline2 && this._yEase && _propagateYoyoEase(timeline2, isYoyo);
              if (this.vars.repeatRefresh && !isYoyo && !this._lock && this._time !== cycleDuration && this._initted) {
                this._lock = force = 1;
                this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
              }
            }
          }
          if (!this._initted) {
            if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
              this._tTime = 0;
              return this;
            }
            if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
              return this;
            }
            if (dur !== this._dur) {
              return this.render(totalTime, suppressEvents, force);
            }
          }
          this._tTime = tTime;
          this._time = time;
          if (!this._act && this._ts) {
            this._act = 1;
            this._lazy = 0;
          }
          this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
          if (this._from) {
            this.ratio = ratio = 1 - ratio;
          }
          if (time && !prevTime && !suppressEvents && !iteration) {
            _callback(this, "onStart");
            if (this._tTime !== tTime) {
              return this;
            }
          }
          pt = this._pt;
          while (pt) {
            pt.r(ratio, pt.d);
            pt = pt._next;
          }
          timeline2 && timeline2.render(totalTime < 0 ? totalTime : timeline2._dur * timeline2._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
          if (this._onUpdate && !suppressEvents) {
            isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
            _callback(this, "onUpdate");
          }
          this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
          if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
            isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
            (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
            if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
              _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
              this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
            }
          }
        }
        return this;
      };
      _proto3.targets = function targets() {
        return this._targets;
      };
      _proto3.invalidate = function invalidate(soft) {
        (!soft || !this.vars.runBackwards) && (this._startAt = 0);
        this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
        this._ptLookup = [];
        this.timeline && this.timeline.invalidate(soft);
        return _Animation2.prototype.invalidate.call(this, soft);
      };
      _proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
        _tickerActive || _ticker.wake();
        this._ts || this.play();
        var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
        this._initted || _initTween(this, time);
        ratio = this._ease(time / this._dur);
        if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) {
          return this.resetTo(property, value, start, startIsRelative, 1);
        }
        _alignPlayhead(this, 0);
        this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
        return this.render(0);
      };
      _proto3.kill = function kill(targets, vars) {
        if (vars === void 0) {
          vars = "all";
        }
        if (!targets && (!vars || vars === "all")) {
          this._lazy = this._pt = 0;
          return this.parent ? _interrupt(this) : this;
        }
        if (this.timeline) {
          var tDur = this.timeline.totalDuration();
          this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
          this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
          return this;
        }
        var parsedTargets = this._targets, killingTargets = targets ? toArray2(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
        if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
          vars === "all" && (this._pt = 0);
          return _interrupt(this);
        }
        overwrittenProps = this._op = this._op || [];
        if (vars !== "all") {
          if (_isString(vars)) {
            p = {};
            _forEachName(vars, function(name) {
              return p[name] = 1;
            });
            vars = p;
          }
          vars = _addAliasesToVars(parsedTargets, vars);
        }
        i = parsedTargets.length;
        while (i--) {
          if (~killingTargets.indexOf(parsedTargets[i])) {
            curLookup = propTweenLookup[i];
            if (vars === "all") {
              overwrittenProps[i] = vars;
              props = curLookup;
              curOverwriteProps = {};
            } else {
              curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
              props = vars;
            }
            for (p in props) {
              pt = curLookup && curLookup[p];
              if (pt) {
                if (!("kill" in pt.d) || pt.d.kill(p) === true) {
                  _removeLinkedListItem(this, pt, "_pt");
                }
                delete curLookup[p];
              }
              if (curOverwriteProps !== "all") {
                curOverwriteProps[p] = 1;
              }
            }
          }
        }
        this._initted && !this._pt && firstPT && _interrupt(this);
        return this;
      };
      Tween2.to = function to(targets, vars) {
        return new Tween2(targets, vars, arguments[2]);
      };
      Tween2.from = function from(targets, vars) {
        return _createTweenType(1, arguments);
      };
      Tween2.delayedCall = function delayedCall(delay, callback, params, scope) {
        return new Tween2(callback, 0, {
          immediateRender: false,
          lazy: false,
          overwrite: false,
          delay,
          onComplete: callback,
          onReverseComplete: callback,
          onCompleteParams: params,
          onReverseCompleteParams: params,
          callbackScope: scope
        });
      };
      Tween2.fromTo = function fromTo(targets, fromVars, toVars) {
        return _createTweenType(2, arguments);
      };
      Tween2.set = function set(targets, vars) {
        vars.duration = 0;
        vars.repeatDelay || (vars.repeat = 0);
        return new Tween2(targets, vars);
      };
      Tween2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
        return _globalTimeline.killTweensOf(targets, props, onlyActive);
      };
      return Tween2;
    })(Animation);
    _setDefaults(Tween.prototype, {
      _targets: [],
      _lazy: 0,
      _startAt: 0,
      _op: 0,
      _onInit: 0
    });
    _forEachName("staggerTo,staggerFrom,staggerFromTo", function(name) {
      Tween[name] = function() {
        var tl = new Timeline(), params = _slice.call(arguments, 0);
        params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
        return tl[name].apply(tl, params);
      };
    });
    _setterPlain = function _setterPlain2(target, property, value) {
      return target[property] = value;
    };
    _setterFunc = function _setterFunc2(target, property, value) {
      return target[property](value);
    };
    _setterFuncWithParam = function _setterFuncWithParam2(target, property, value, data) {
      return target[property](data.fp, value);
    };
    _setterAttribute = function _setterAttribute2(target, property, value) {
      return target.setAttribute(property, value);
    };
    _getSetter = function _getSetter2(target, property) {
      return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
    };
    _renderPlain = function _renderPlain2(ratio, data) {
      return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
    };
    _renderBoolean = function _renderBoolean2(ratio, data) {
      return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
    };
    _renderComplexString = function _renderComplexString2(ratio, data) {
      var pt = data._pt, s = "";
      if (!ratio && data.b) {
        s = data.b;
      } else if (ratio === 1 && data.e) {
        s = data.e;
      } else {
        while (pt) {
          s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s;
          pt = pt._next;
        }
        s += data.c;
      }
      data.set(data.t, data.p, s, data);
    };
    _renderPropTweens = function _renderPropTweens2(ratio, data) {
      var pt = data._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
    };
    _addPluginModifier = function _addPluginModifier2(modifier, tween, target, property) {
      var pt = this._pt, next;
      while (pt) {
        next = pt._next;
        pt.p === property && pt.modifier(modifier, tween, target);
        pt = next;
      }
    };
    _killPropTweensOf = function _killPropTweensOf2(property) {
      var pt = this._pt, hasNonDependentRemaining, next;
      while (pt) {
        next = pt._next;
        if (pt.p === property && !pt.op || pt.op === property) {
          _removeLinkedListItem(this, pt, "_pt");
        } else if (!pt.dep) {
          hasNonDependentRemaining = 1;
        }
        pt = next;
      }
      return !hasNonDependentRemaining;
    };
    _setterWithModifier = function _setterWithModifier2(target, property, value, data) {
      data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
    };
    _sortPropTweensByPriority = function _sortPropTweensByPriority2(parent) {
      var pt = parent._pt, next, pt2, first, last;
      while (pt) {
        next = pt._next;
        pt2 = first;
        while (pt2 && pt2.pr > pt.pr) {
          pt2 = pt2._next;
        }
        if (pt._prev = pt2 ? pt2._prev : last) {
          pt._prev._next = pt;
        } else {
          first = pt;
        }
        if (pt._next = pt2) {
          pt2._prev = pt;
        } else {
          last = pt;
        }
        pt = next;
      }
      parent._pt = first;
    };
    PropTween = /* @__PURE__ */ (function() {
      function PropTween2(next, target, prop, start, change, renderer, data, setter, priority) {
        this.t = target;
        this.s = start;
        this.c = change;
        this.p = prop;
        this.r = renderer || _renderPlain;
        this.d = data || this;
        this.set = setter || _setterPlain;
        this.pr = priority || 0;
        this._next = next;
        if (next) {
          next._prev = this;
        }
      }
      var _proto4 = PropTween2.prototype;
      _proto4.modifier = function modifier(func, tween, target) {
        this.mSet = this.mSet || this.set;
        this.set = _setterWithModifier;
        this.m = func;
        this.mt = target;
        this.tween = tween;
      };
      return PropTween2;
    })();
    _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(name) {
      return _reservedProps[name] = 1;
    });
    _globals.TweenMax = _globals.TweenLite = Tween;
    _globals.TimelineLite = _globals.TimelineMax = Timeline;
    _globalTimeline = new Timeline({
      sortChildren: false,
      defaults: _defaults,
      autoRemoveChildren: true,
      id: "root",
      smoothChildTiming: true
    });
    _config.stringFilter = _colorStringFilter;
    _media = [];
    _listeners = {};
    _emptyArray = [];
    _lastMediaTime = 0;
    _contextID = 0;
    _dispatch = function _dispatch2(type) {
      return (_listeners[type] || _emptyArray).map(function(f) {
        return f();
      });
    };
    _onMediaChange = function _onMediaChange2() {
      var time = Date.now(), matches = [];
      if (time - _lastMediaTime > 2) {
        _dispatch("matchMediaInit");
        _media.forEach(function(c) {
          var queries = c.queries, conditions = c.conditions, match, p, anyMatch, toggled;
          for (p in queries) {
            match = _win.matchMedia(queries[p]).matches;
            match && (anyMatch = 1);
            if (match !== conditions[p]) {
              conditions[p] = match;
              toggled = 1;
            }
          }
          if (toggled) {
            c.revert();
            anyMatch && matches.push(c);
          }
        });
        _dispatch("matchMediaRevert");
        matches.forEach(function(c) {
          return c.onMatch(c, function(func) {
            return c.add(null, func);
          });
        });
        _lastMediaTime = time;
        _dispatch("matchMedia");
      }
    };
    Context = /* @__PURE__ */ (function() {
      function Context2(func, scope) {
        this.selector = scope && selector(scope);
        this.data = [];
        this._r = [];
        this.isReverted = false;
        this.id = _contextID++;
        func && this.add(func);
      }
      var _proto5 = Context2.prototype;
      _proto5.add = function add(name, func, scope) {
        if (_isFunction(name)) {
          scope = func;
          func = name;
          name = _isFunction;
        }
        var self = this, f = function f2() {
          var prev = _context, prevSelector = self.selector, result;
          prev && prev !== self && prev.data.push(self);
          scope && (self.selector = selector(scope));
          _context = self;
          result = func.apply(self, arguments);
          _isFunction(result) && self._r.push(result);
          _context = prev;
          self.selector = prevSelector;
          self.isReverted = false;
          return result;
        };
        self.last = f;
        return name === _isFunction ? f(self, function(func2) {
          return self.add(null, func2);
        }) : name ? self[name] = f : f;
      };
      _proto5.ignore = function ignore(func) {
        var prev = _context;
        _context = null;
        func(this);
        _context = prev;
      };
      _proto5.getTweens = function getTweens() {
        var a = [];
        this.data.forEach(function(e) {
          return e instanceof Context2 ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
        });
        return a;
      };
      _proto5.clear = function clear() {
        this._r.length = this.data.length = 0;
      };
      _proto5.kill = function kill(revert, matchMedia2) {
        var _this4 = this;
        if (revert) {
          (function() {
            var tweens = _this4.getTweens(), i2 = _this4.data.length, t;
            while (i2--) {
              t = _this4.data[i2];
              if (t.data === "isFlip") {
                t.revert();
                t.getChildren(true, true, false).forEach(function(tween) {
                  return tweens.splice(tweens.indexOf(tween), 1);
                });
              }
            }
            tweens.map(function(t2) {
              return {
                g: t2._dur || t2._delay || t2._sat && !t2._sat.vars.immediateRender ? t2.globalTime(0) : -Infinity,
                t: t2
              };
            }).sort(function(a, b) {
              return b.g - a.g || -Infinity;
            }).forEach(function(o) {
              return o.t.revert(revert);
            });
            i2 = _this4.data.length;
            while (i2--) {
              t = _this4.data[i2];
              if (t instanceof Timeline) {
                if (t.data !== "nested") {
                  t.scrollTrigger && t.scrollTrigger.revert();
                  t.kill();
                }
              } else {
                !(t instanceof Tween) && t.revert && t.revert(revert);
              }
            }
            _this4._r.forEach(function(f) {
              return f(revert, _this4);
            });
            _this4.isReverted = true;
          })();
        } else {
          this.data.forEach(function(e) {
            return e.kill && e.kill();
          });
        }
        this.clear();
        if (matchMedia2) {
          var i = _media.length;
          while (i--) {
            _media[i].id === this.id && _media.splice(i, 1);
          }
        }
      };
      _proto5.revert = function revert(config3) {
        this.kill(config3 || {});
      };
      return Context2;
    })();
    MatchMedia = /* @__PURE__ */ (function() {
      function MatchMedia2(scope) {
        this.contexts = [];
        this.scope = scope;
        _context && _context.data.push(this);
      }
      var _proto6 = MatchMedia2.prototype;
      _proto6.add = function add(conditions, func, scope) {
        _isObject(conditions) || (conditions = {
          matches: conditions
        });
        var context3 = new Context(0, scope || this.scope), cond = context3.conditions = {}, mq, p, active;
        _context && !context3.selector && (context3.selector = _context.selector);
        this.contexts.push(context3);
        func = context3.add("onMatch", func);
        context3.queries = conditions;
        for (p in conditions) {
          if (p === "all") {
            active = 1;
          } else {
            mq = _win.matchMedia(conditions[p]);
            if (mq) {
              _media.indexOf(context3) < 0 && _media.push(context3);
              (cond[p] = mq.matches) && (active = 1);
              mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
            }
          }
        }
        active && func(context3, function(f) {
          return context3.add(null, f);
        });
        return this;
      };
      _proto6.revert = function revert(config3) {
        this.kill(config3 || {});
      };
      _proto6.kill = function kill(revert) {
        this.contexts.forEach(function(c) {
          return c.kill(revert, true);
        });
      };
      return MatchMedia2;
    })();
    _gsap = {
      registerPlugin: function registerPlugin() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        args.forEach(function(config3) {
          return _createPlugin(config3);
        });
      },
      timeline: function timeline(vars) {
        return new Timeline(vars);
      },
      getTweensOf: function getTweensOf(targets, onlyActive) {
        return _globalTimeline.getTweensOf(targets, onlyActive);
      },
      getProperty: function getProperty(target, property, unit, uncache) {
        _isString(target) && (target = toArray2(target)[0]);
        var getter = _getCache(target || {}).get, format = unit ? _passThrough : _numericIfPossible;
        unit === "native" && (unit = "");
        return !target ? target : !property ? function(property2, unit2, uncache2) {
          return format((_plugins[property2] && _plugins[property2].get || getter)(target, property2, unit2, uncache2));
        } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
      },
      quickSetter: function quickSetter(target, property, unit) {
        target = toArray2(target);
        if (target.length > 1) {
          var setters = target.map(function(t) {
            return gsap.quickSetter(t, property, unit);
          }), l = setters.length;
          return function(value) {
            var i = l;
            while (i--) {
              setters[i](value);
            }
          };
        }
        target = target[0] || {};
        var Plugin = _plugins[property], cache2 = _getCache(target), p = cache2.harness && (cache2.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
          var p2 = new Plugin();
          _quickTween._pt = 0;
          p2.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
          p2.render(1, p2);
          _quickTween._pt && _renderPropTweens(1, _quickTween);
        } : cache2.set(target, p);
        return Plugin ? setter : function(value) {
          return setter(target, p, unit ? value + unit : value, cache2, 1);
        };
      },
      quickTo: function quickTo(target, property, vars) {
        var _merge22;
        var tween = gsap.to(target, _merge((_merge22 = {}, _merge22[property] = "+=0.1", _merge22.paused = true, _merge22), vars || {})), func = function func2(value, start, startIsRelative) {
          return tween.resetTo(property, value, start, startIsRelative);
        };
        func.tween = tween;
        return func;
      },
      isTweening: function isTweening(targets) {
        return _globalTimeline.getTweensOf(targets, true).length > 0;
      },
      defaults: function defaults(value) {
        value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
        return _mergeDeep(_defaults, value || {});
      },
      config: function config2(value) {
        return _mergeDeep(_config, value || {});
      },
      registerEffect: function registerEffect(_ref3) {
        var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults2 = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
        (plugins || "").split(",").forEach(function(pluginName) {
          return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
        });
        _effects[name] = function(targets, vars, tl) {
          return effect(toArray2(targets), _setDefaults(vars || {}, defaults2), tl);
        };
        if (extendTimeline) {
          Timeline.prototype[name] = function(targets, vars, position) {
            return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
          };
        }
      },
      registerEase: function registerEase(name, ease) {
        _easeMap[name] = _parseEase(ease);
      },
      parseEase: function parseEase(ease, defaultEase) {
        return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
      },
      getById: function getById(id) {
        return _globalTimeline.getById(id);
      },
      exportRoot: function exportRoot(vars, includeDelayedCalls) {
        if (vars === void 0) {
          vars = {};
        }
        var tl = new Timeline(vars), child, next;
        tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
        _globalTimeline.remove(tl);
        tl._dp = 0;
        tl._time = tl._tTime = _globalTimeline._time;
        child = _globalTimeline._first;
        while (child) {
          next = child._next;
          if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
            _addToTimeline(tl, child, child._start - child._delay);
          }
          child = next;
        }
        _addToTimeline(_globalTimeline, tl, 0);
        return tl;
      },
      context: function context(func, scope) {
        return func ? new Context(func, scope) : _context;
      },
      matchMedia: function matchMedia(scope) {
        return new MatchMedia(scope);
      },
      matchMediaRefresh: function matchMediaRefresh() {
        return _media.forEach(function(c) {
          var cond = c.conditions, found, p;
          for (p in cond) {
            if (cond[p]) {
              cond[p] = false;
              found = 1;
            }
          }
          found && c.revert();
        }) || _onMediaChange();
      },
      addEventListener: function addEventListener(type, callback) {
        var a = _listeners[type] || (_listeners[type] = []);
        ~a.indexOf(callback) || a.push(callback);
      },
      removeEventListener: function removeEventListener(type, callback) {
        var a = _listeners[type], i = a && a.indexOf(callback);
        i >= 0 && a.splice(i, 1);
      },
      utils: {
        wrap,
        wrapYoyo,
        distribute,
        random,
        snap,
        normalize,
        getUnit,
        clamp,
        splitColor,
        toArray: toArray2,
        selector,
        mapRange,
        pipe,
        unitize,
        interpolate,
        shuffle
      },
      install: _install,
      effects: _effects,
      ticker: _ticker,
      updateRoot: Timeline.updateRoot,
      plugins: _plugins,
      globalTimeline: _globalTimeline,
      core: {
        PropTween,
        globals: _addGlobal,
        Tween,
        Timeline,
        Animation,
        getCache: _getCache,
        _removeLinkedListItem,
        reverting: function reverting() {
          return _reverting;
        },
        context: function context2(toAdd) {
          if (toAdd && _context) {
            _context.data.push(toAdd);
            toAdd._ctx = _context;
          }
          return _context;
        },
        suppressOverwrites: function suppressOverwrites(value) {
          return _suppressOverwrites = value;
        }
      }
    };
    _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function(name) {
      return _gsap[name] = Tween[name];
    });
    _ticker.add(Timeline.updateRoot);
    _quickTween = _gsap.to({}, {
      duration: 0
    });
    _getPluginPropTween = function _getPluginPropTween2(plugin, prop) {
      var pt = plugin._pt;
      while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
        pt = pt._next;
      }
      return pt;
    };
    _addModifiers = function _addModifiers2(tween, modifiers) {
      var targets = tween._targets, p, i, pt;
      for (p in modifiers) {
        i = targets.length;
        while (i--) {
          pt = tween._ptLookup[i][p];
          if (pt && (pt = pt.d)) {
            if (pt._pt) {
              pt = _getPluginPropTween(pt, p);
            }
            pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
          }
        }
      }
    };
    _buildModifierPlugin = function _buildModifierPlugin2(name, modifier) {
      return {
        name,
        rawVars: 1,
        //don't pre-process function-based values or "random()" strings.
        init: function init4(target, vars, tween) {
          tween._onInit = function(tween2) {
            var temp, p;
            if (_isString(vars)) {
              temp = {};
              _forEachName(vars, function(name2) {
                return temp[name2] = 1;
              });
              vars = temp;
            }
            if (modifier) {
              temp = {};
              for (p in vars) {
                temp[p] = modifier(vars[p]);
              }
              vars = temp;
            }
            _addModifiers(tween2, vars);
          };
        }
      };
    };
    gsap = _gsap.registerPlugin({
      name: "attr",
      init: function init(target, vars, tween, index, targets) {
        var p, pt, v;
        this.tween = tween;
        for (p in vars) {
          v = target.getAttribute(p) || "";
          pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
          pt.op = p;
          pt.b = v;
          this._props.push(p);
        }
      },
      render: function render(ratio, data) {
        var pt = data._pt;
        while (pt) {
          _reverting ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
          pt = pt._next;
        }
      }
    }, {
      name: "endArray",
      init: function init2(target, value) {
        var i = value.length;
        while (i--) {
          this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
        }
      }
    }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
    Tween.version = Timeline.version = gsap.version = "3.12.5";
    _coreReady = 1;
    _windowExists() && _wake();
    Power0 = _easeMap.Power0;
    Power1 = _easeMap.Power1;
    Power2 = _easeMap.Power2;
    Power3 = _easeMap.Power3;
    Power4 = _easeMap.Power4;
    Linear = _easeMap.Linear;
    Quad = _easeMap.Quad;
    Cubic = _easeMap.Cubic;
    Quart = _easeMap.Quart;
    Quint = _easeMap.Quint;
    Strong = _easeMap.Strong;
    Elastic = _easeMap.Elastic;
    Back = _easeMap.Back;
    SteppedEase = _easeMap.SteppedEase;
    Bounce = _easeMap.Bounce;
    Sine = _easeMap.Sine;
    Expo = _easeMap.Expo;
    Circ = _easeMap.Circ;
  }
});

// node_modules/gsap/CSSPlugin.js
var _win2, _doc2, _docElement, _pluginInitted, _tempDiv, _tempDivStyler, _recentSetterPlugin, _reverting2, _windowExists3, _transformProps, _RAD2DEG, _DEG2RAD, _atan2, _bigNum2, _capsExp, _horizontalExp, _complexExp, _propertyAliases, _renderCSSProp, _renderPropWithEnd, _renderCSSPropWithBeginning, _renderRoundedCSSProp, _renderNonTweeningValue, _renderNonTweeningValueOnlyAtEnd, _setterCSSStyle, _setterCSSProp, _setterTransform, _setterScale, _setterScaleWithRender, _setterTransformWithRender, _transformProp, _transformOriginProp, _saveStyle, _removeIndependentTransforms, _revertStyle, _getStyleSaver, _supports3D, _createElement, _getComputedProperty, _prefixes, _checkPropPrefix, _initCore, _getBBoxHack, _getAttributeFallbacks, _getBBox, _isSVG, _removeProperty, _addNonTweeningPT, _nonConvertibleUnits, _nonStandardLayouts, _convertToUnit, _get, _tweenComplexCSSString, _keywordToPercent, _convertKeywordsToPercentages, _renderClearProps, _specialProps, _identity2DMatrix, _rotationalProperties, _isNullTransform, _getComputedTransformMatrixAsArray, _getMatrix, _applySVGOrigin, _parseTransform, _firstTwoOnly, _addPxTranslate, _renderNon3DTransforms, _zeroDeg, _zeroPx, _endParenthesis, _renderCSSTransforms, _renderSVGTransforms, _addRotationalPropTween, _assign, _addRawTransformPTs, CSSPlugin;
var init_CSSPlugin = __esm({
  "node_modules/gsap/CSSPlugin.js"() {
    init_gsap_core();
    _windowExists3 = function _windowExists4() {
      return typeof window !== "undefined";
    };
    _transformProps = {};
    _RAD2DEG = 180 / Math.PI;
    _DEG2RAD = Math.PI / 180;
    _atan2 = Math.atan2;
    _bigNum2 = 1e8;
    _capsExp = /([A-Z])/g;
    _horizontalExp = /(left|right|width|margin|padding|x)/i;
    _complexExp = /[\s,\(]\S/;
    _propertyAliases = {
      autoAlpha: "opacity,visibility",
      scale: "scaleX,scaleY",
      alpha: "opacity"
    };
    _renderCSSProp = function _renderCSSProp2(ratio, data) {
      return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
    };
    _renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
      return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
    };
    _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(ratio, data) {
      return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
    };
    _renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
      var value = data.s + data.c * ratio;
      data.set(data.t, data.p, ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u, data);
    };
    _renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
      return data.set(data.t, data.p, ratio ? data.e : data.b, data);
    };
    _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(ratio, data) {
      return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
    };
    _setterCSSStyle = function _setterCSSStyle2(target, property, value) {
      return target.style[property] = value;
    };
    _setterCSSProp = function _setterCSSProp2(target, property, value) {
      return target.style.setProperty(property, value);
    };
    _setterTransform = function _setterTransform2(target, property, value) {
      return target._gsap[property] = value;
    };
    _setterScale = function _setterScale2(target, property, value) {
      return target._gsap.scaleX = target._gsap.scaleY = value;
    };
    _setterScaleWithRender = function _setterScaleWithRender2(target, property, value, data, ratio) {
      var cache2 = target._gsap;
      cache2.scaleX = cache2.scaleY = value;
      cache2.renderTransform(ratio, cache2);
    };
    _setterTransformWithRender = function _setterTransformWithRender2(target, property, value, data, ratio) {
      var cache2 = target._gsap;
      cache2[property] = value;
      cache2.renderTransform(ratio, cache2);
    };
    _transformProp = "transform";
    _transformOriginProp = _transformProp + "Origin";
    _saveStyle = function _saveStyle2(property, isNotCSS) {
      var _this = this;
      var target = this.target, style = target.style, cache2 = target._gsap;
      if (property in _transformProps && style) {
        this.tfm = this.tfm || {};
        if (property !== "transform") {
          property = _propertyAliases[property] || property;
          ~property.indexOf(",") ? property.split(",").forEach(function(a) {
            return _this.tfm[a] = _get(target, a);
          }) : this.tfm[property] = cache2.x ? cache2[property] : _get(target, property);
          property === _transformOriginProp && (this.tfm.zOrigin = cache2.zOrigin);
        } else {
          return _propertyAliases.transform.split(",").forEach(function(p) {
            return _saveStyle2.call(_this, p, isNotCSS);
          });
        }
        if (this.props.indexOf(_transformProp) >= 0) {
          return;
        }
        if (cache2.svg) {
          this.svgo = target.getAttribute("data-svg-origin");
          this.props.push(_transformOriginProp, isNotCSS, "");
        }
        property = _transformProp;
      }
      (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
    };
    _removeIndependentTransforms = function _removeIndependentTransforms2(style) {
      if (style.translate) {
        style.removeProperty("translate");
        style.removeProperty("scale");
        style.removeProperty("rotate");
      }
    };
    _revertStyle = function _revertStyle2() {
      var props = this.props, target = this.target, style = target.style, cache2 = target._gsap, i, p;
      for (i = 0; i < props.length; i += 3) {
        props[i + 1] ? target[props[i]] = props[i + 2] : props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp, "-$1").toLowerCase());
      }
      if (this.tfm) {
        for (p in this.tfm) {
          cache2[p] = this.tfm[p];
        }
        if (cache2.svg) {
          cache2.renderTransform();
          target.setAttribute("data-svg-origin", this.svgo || "");
        }
        i = _reverting2();
        if ((!i || !i.isStart) && !style[_transformProp]) {
          _removeIndependentTransforms(style);
          if (cache2.zOrigin && style[_transformOriginProp]) {
            style[_transformOriginProp] += " " + cache2.zOrigin + "px";
            cache2.zOrigin = 0;
            cache2.renderTransform();
          }
          cache2.uncache = 1;
        }
      }
    };
    _getStyleSaver = function _getStyleSaver2(target, properties) {
      var saver = {
        target,
        props: [],
        revert: _revertStyle,
        save: _saveStyle
      };
      target._gsap || gsap.core.getCache(target);
      properties && properties.split(",").forEach(function(p) {
        return saver.save(p);
      });
      return saver;
    };
    _createElement = function _createElement2(type, ns) {
      var e = _doc2.createElementNS ? _doc2.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc2.createElement(type);
      return e && e.style ? e : _doc2.createElement(type);
    };
    _getComputedProperty = function _getComputedProperty2(target, property, skipPrefixFallback) {
      var cs = getComputedStyle(target);
      return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty2(target, _checkPropPrefix(property) || property, 1) || "";
    };
    _prefixes = "O,Moz,ms,Ms,Webkit".split(",");
    _checkPropPrefix = function _checkPropPrefix2(property, element, preferPrefix) {
      var e = element || _tempDiv, s = e.style, i = 5;
      if (property in s && !preferPrefix) {
        return property;
      }
      property = property.charAt(0).toUpperCase() + property.substr(1);
      while (i-- && !(_prefixes[i] + property in s)) {
      }
      return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
    };
    _initCore = function _initCore2() {
      if (_windowExists3() && window.document) {
        _win2 = window;
        _doc2 = _win2.document;
        _docElement = _doc2.documentElement;
        _tempDiv = _createElement("div") || {
          style: {}
        };
        _tempDivStyler = _createElement("div");
        _transformProp = _checkPropPrefix(_transformProp);
        _transformOriginProp = _transformProp + "Origin";
        _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
        _supports3D = !!_checkPropPrefix("perspective");
        _reverting2 = gsap.core.reverting;
        _pluginInitted = 1;
      }
    };
    _getBBoxHack = function _getBBoxHack2(swapIfPossible) {
      var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), oldParent = this.parentNode, oldSibling = this.nextSibling, oldCSS = this.style.cssText, bbox;
      _docElement.appendChild(svg);
      svg.appendChild(this);
      this.style.display = "block";
      if (swapIfPossible) {
        try {
          bbox = this.getBBox();
          this._gsapBBox = this.getBBox;
          this.getBBox = _getBBoxHack2;
        } catch (e) {
        }
      } else if (this._gsapBBox) {
        bbox = this._gsapBBox();
      }
      if (oldParent) {
        if (oldSibling) {
          oldParent.insertBefore(this, oldSibling);
        } else {
          oldParent.appendChild(this);
        }
      }
      _docElement.removeChild(svg);
      this.style.cssText = oldCSS;
      return bbox;
    };
    _getAttributeFallbacks = function _getAttributeFallbacks2(target, attributesArray) {
      var i = attributesArray.length;
      while (i--) {
        if (target.hasAttribute(attributesArray[i])) {
          return target.getAttribute(attributesArray[i]);
        }
      }
    };
    _getBBox = function _getBBox2(target) {
      var bounds;
      try {
        bounds = target.getBBox();
      } catch (error) {
        bounds = _getBBoxHack.call(target, true);
      }
      bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true));
      return bounds && !bounds.width && !bounds.x && !bounds.y ? {
        x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
        y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
        width: 0,
        height: 0
      } : bounds;
    };
    _isSVG = function _isSVG2(e) {
      return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
    };
    _removeProperty = function _removeProperty2(target, property) {
      if (property) {
        var style = target.style, first2Chars;
        if (property in _transformProps && property !== _transformOriginProp) {
          property = _transformProp;
        }
        if (style.removeProperty) {
          first2Chars = property.substr(0, 2);
          if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
            property = "-" + property;
          }
          style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp, "-$1").toLowerCase());
        } else {
          style.removeAttribute(property);
        }
      }
    };
    _addNonTweeningPT = function _addNonTweeningPT2(plugin, target, property, beginning, end, onlySetAtEnd) {
      var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
      plugin._pt = pt;
      pt.b = beginning;
      pt.e = end;
      plugin._props.push(property);
      return pt;
    };
    _nonConvertibleUnits = {
      deg: 1,
      rad: 1,
      turn: 1
    };
    _nonStandardLayouts = {
      grid: 1,
      flex: 1
    };
    _convertToUnit = function _convertToUnit2(target, property, value, unit) {
      var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%", px2, parent, cache2, isSVG;
      if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
        return curValue;
      }
      curUnit !== "px" && !toPixels && (curValue = _convertToUnit2(target, property, value, "px"));
      isSVG = target.getCTM && _isSVG(target);
      if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
        px2 = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
        return _round(toPercent ? curValue / px2 * amount : curValue / 100 * px2);
      }
      style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
      parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
      if (isSVG) {
        parent = (target.ownerSVGElement || {}).parentNode;
      }
      if (!parent || parent === _doc2 || !parent.appendChild) {
        parent = _doc2.body;
      }
      cache2 = parent._gsap;
      if (cache2 && toPercent && cache2.width && horizontal && cache2.time === _ticker.time && !cache2.uncache) {
        return _round(curValue / cache2.width * amount);
      } else {
        if (toPercent && (property === "height" || property === "width")) {
          var v = target.style[property];
          target.style[property] = amount + unit;
          px2 = target[measureProperty];
          v ? target.style[property] = v : _removeProperty(target, property);
        } else {
          (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
          parent === target && (style.position = "static");
          parent.appendChild(_tempDiv);
          px2 = _tempDiv[measureProperty];
          parent.removeChild(_tempDiv);
          style.position = "absolute";
        }
        if (horizontal && toPercent) {
          cache2 = _getCache(parent);
          cache2.time = _ticker.time;
          cache2.width = parent[measureProperty];
        }
      }
      return _round(toPixels ? px2 * curValue / amount : px2 && curValue ? amount / px2 * curValue : 0);
    };
    _get = function _get2(target, property, unit, uncache) {
      var value;
      _pluginInitted || _initCore();
      if (property in _propertyAliases && property !== "transform") {
        property = _propertyAliases[property];
        if (~property.indexOf(",")) {
          property = property.split(",")[0];
        }
      }
      if (_transformProps[property] && property !== "transform") {
        value = _parseTransform(target, uncache);
        value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
      } else {
        value = target.style[property];
        if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
          value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
        }
      }
      return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
    };
    _tweenComplexCSSString = function _tweenComplexCSSString2(target, prop, start, end) {
      if (!start || start === "none") {
        var p = _checkPropPrefix(prop, target, 1), s = p && _getComputedProperty(target, p, 1);
        if (s && s !== start) {
          prop = p;
          start = s;
        } else if (prop === "borderColor") {
          start = _getComputedProperty(target, "borderTopColor");
        }
      }
      var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index = 0, matchIndex = 0, a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
      pt.b = start;
      pt.e = end;
      start += "";
      end += "";
      if (end === "auto") {
        startValue = target.style[prop];
        target.style[prop] = end;
        end = _getComputedProperty(target, prop) || end;
        startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
      }
      a = [start, end];
      _colorStringFilter(a);
      start = a[0];
      end = a[1];
      startValues = start.match(_numWithUnitExp) || [];
      endValues = end.match(_numWithUnitExp) || [];
      if (endValues.length) {
        while (result = _numWithUnitExp.exec(end)) {
          endValue = result[0];
          chunk = end.substring(index, result.index);
          if (color) {
            color = (color + 1) % 5;
          } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
            color = 1;
          }
          if (endValue !== (startValue = startValues[matchIndex++] || "")) {
            startNum = parseFloat(startValue) || 0;
            startUnit = startValue.substr((startNum + "").length);
            endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
            endNum = parseFloat(endValue);
            endUnit = endValue.substr((endNum + "").length);
            index = _numWithUnitExp.lastIndex - endUnit.length;
            if (!endUnit) {
              endUnit = endUnit || _config.units[prop] || startUnit;
              if (index === end.length) {
                end += endUnit;
                pt.e += endUnit;
              }
            }
            if (startUnit !== endUnit) {
              startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
            }
            pt._pt = {
              _next: pt._pt,
              p: chunk || matchIndex === 1 ? chunk : ",",
              //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
              s: startNum,
              c: endNum - startNum,
              m: color && color < 4 || prop === "zIndex" ? Math.round : 0
            };
          }
        }
        pt.c = index < end.length ? end.substring(index, end.length) : "";
      } else {
        pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
      }
      _relExp.test(end) && (pt.e = 0);
      this._pt = pt;
      return pt;
    };
    _keywordToPercent = {
      top: "0%",
      bottom: "100%",
      left: "0%",
      right: "100%",
      center: "50%"
    };
    _convertKeywordsToPercentages = function _convertKeywordsToPercentages2(value) {
      var split = value.split(" "), x = split[0], y = split[1] || "50%";
      if (x === "top" || x === "bottom" || y === "left" || y === "right") {
        value = x;
        x = y;
        y = value;
      }
      split[0] = _keywordToPercent[x] || x;
      split[1] = _keywordToPercent[y] || y;
      return split.join(" ");
    };
    _renderClearProps = function _renderClearProps2(ratio, data) {
      if (data.tween && data.tween._time === data.tween._dur) {
        var target = data.t, style = target.style, props = data.u, cache2 = target._gsap, prop, clearTransforms, i;
        if (props === "all" || props === true) {
          style.cssText = "";
          clearTransforms = 1;
        } else {
          props = props.split(",");
          i = props.length;
          while (--i > -1) {
            prop = props[i];
            if (_transformProps[prop]) {
              clearTransforms = 1;
              prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
            }
            _removeProperty(target, prop);
          }
        }
        if (clearTransforms) {
          _removeProperty(target, _transformProp);
          if (cache2) {
            cache2.svg && target.removeAttribute("transform");
            _parseTransform(target, 1);
            cache2.uncache = 1;
            _removeIndependentTransforms(style);
          }
        }
      }
    };
    _specialProps = {
      clearProps: function clearProps(plugin, target, property, endValue, tween) {
        if (tween.data !== "isFromStart") {
          var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
          pt.u = endValue;
          pt.pr = -10;
          pt.tween = tween;
          plugin._props.push(property);
          return 1;
        }
      }
      /* className feature (about 0.4kb gzipped).
      , className(plugin, target, property, endValue, tween) {
      	let _renderClassName = (ratio, data) => {
      			data.css.render(ratio, data.css);
      			if (!ratio || ratio === 1) {
      				let inline = data.rmv,
      					target = data.t,
      					p;
      				target.setAttribute("class", ratio ? data.e : data.b);
      				for (p in inline) {
      					_removeProperty(target, p);
      				}
      			}
      		},
      		_getAllStyles = (target) => {
      			let styles = {},
      				computed = getComputedStyle(target),
      				p;
      			for (p in computed) {
      				if (isNaN(p) && p !== "cssText" && p !== "length") {
      					styles[p] = computed[p];
      				}
      			}
      			_setDefaults(styles, _parseTransform(target, 1));
      			return styles;
      		},
      		startClassList = target.getAttribute("class"),
      		style = target.style,
      		cssText = style.cssText,
      		cache = target._gsap,
      		classPT = cache.classPT,
      		inlineToRemoveAtEnd = {},
      		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
      		changingVars = {},
      		startVars = _getAllStyles(target),
      		transformRelated = /(transform|perspective)/i,
      		endVars, p;
      	if (classPT) {
      		classPT.r(1, classPT.d);
      		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
      	}
      	target.setAttribute("class", data.e);
      	endVars = _getAllStyles(target, true);
      	target.setAttribute("class", startClassList);
      	for (p in endVars) {
      		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
      			changingVars[p] = endVars[p];
      			if (!style[p] && style[p] !== "0") {
      				inlineToRemoveAtEnd[p] = 1;
      			}
      		}
      	}
      	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
      	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
      		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
      	}
      	_parseTransform(target, true); //to clear the caching of transforms
      	data.css = new gsap.plugins.css();
      	data.css.init(target, changingVars, tween);
      	plugin._props.push(...data.css._props);
      	return 1;
      }
      */
    };
    _identity2DMatrix = [1, 0, 0, 1, 0, 0];
    _rotationalProperties = {};
    _isNullTransform = function _isNullTransform2(value) {
      return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
    };
    _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray2(target) {
      var matrixString = _getComputedProperty(target, _transformProp);
      return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
    };
    _getMatrix = function _getMatrix2(target, force2D) {
      var cache2 = target._gsap || _getCache(target), style = target.style, matrix = _getComputedTransformMatrixAsArray(target), parent, nextSibling, temp, addedToDOM;
      if (cache2.svg && target.getAttribute("transform")) {
        temp = target.transform.baseVal.consolidate().matrix;
        matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
        return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
      } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache2.svg) {
        temp = style.display;
        style.display = "block";
        parent = target.parentNode;
        if (!parent || !target.offsetParent) {
          addedToDOM = 1;
          nextSibling = target.nextElementSibling;
          _docElement.appendChild(target);
        }
        matrix = _getComputedTransformMatrixAsArray(target);
        temp ? style.display = temp : _removeProperty(target, "display");
        if (addedToDOM) {
          nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
        }
      }
      return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
    };
    _applySVGOrigin = function _applySVGOrigin2(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
      var cache2 = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache2.xOrigin || 0, yOriginOld = cache2.yOrigin || 0, xOffsetOld = cache2.xOffset || 0, yOffsetOld = cache2.yOffset || 0, a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant, x, y;
      if (!originIsAbsolute) {
        bounds = _getBBox(target);
        xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
        yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
      } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
        x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
        y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
        xOrigin = x;
        yOrigin = y;
      }
      if (smooth || smooth !== false && cache2.smooth) {
        tx = xOrigin - xOriginOld;
        ty = yOrigin - yOriginOld;
        cache2.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
        cache2.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
      } else {
        cache2.xOffset = cache2.yOffset = 0;
      }
      cache2.xOrigin = xOrigin;
      cache2.yOrigin = yOrigin;
      cache2.smooth = !!smooth;
      cache2.origin = origin;
      cache2.originIsAbsolute = !!originIsAbsolute;
      target.style[_transformOriginProp] = "0px 0px";
      if (pluginToAddPropTweensTo) {
        _addNonTweeningPT(pluginToAddPropTweensTo, cache2, "xOrigin", xOriginOld, xOrigin);
        _addNonTweeningPT(pluginToAddPropTweensTo, cache2, "yOrigin", yOriginOld, yOrigin);
        _addNonTweeningPT(pluginToAddPropTweensTo, cache2, "xOffset", xOffsetOld, cache2.xOffset);
        _addNonTweeningPT(pluginToAddPropTweensTo, cache2, "yOffset", yOffsetOld, cache2.yOffset);
      }
      target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
    };
    _parseTransform = function _parseTransform2(target, uncache) {
      var cache2 = target._gsap || new GSCache(target);
      if ("x" in cache2 && !uncache && !cache2.uncache) {
        return cache2;
      }
      var style = target.style, invertedScaleX = cache2.scaleX < 0, px2 = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0", x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
      x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
      scaleX = scaleY = 1;
      cache2.svg = !!(target.getCTM && _isSVG(target));
      if (cs.translate) {
        if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
          style[_transformProp] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
        }
        style.scale = style.rotate = style.translate = "none";
      }
      matrix = _getMatrix(target, cache2.svg);
      if (cache2.svg) {
        if (cache2.uncache) {
          t2 = target.getBBox();
          origin = cache2.xOrigin - t2.x + "px " + (cache2.yOrigin - t2.y) + "px";
          t1 = "";
        } else {
          t1 = !uncache && target.getAttribute("data-svg-origin");
        }
        _applySVGOrigin(target, t1 || origin, !!t1 || cache2.originIsAbsolute, cache2.smooth !== false, matrix);
      }
      xOrigin = cache2.xOrigin || 0;
      yOrigin = cache2.yOrigin || 0;
      if (matrix !== _identity2DMatrix) {
        a = matrix[0];
        b = matrix[1];
        c = matrix[2];
        d = matrix[3];
        x = a12 = matrix[4];
        y = a22 = matrix[5];
        if (matrix.length === 6) {
          scaleX = Math.sqrt(a * a + b * b);
          scaleY = Math.sqrt(d * d + c * c);
          rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
          skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
          skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
          if (cache2.svg) {
            x -= xOrigin - (xOrigin * a + yOrigin * c);
            y -= yOrigin - (xOrigin * b + yOrigin * d);
          }
        } else {
          a32 = matrix[6];
          a42 = matrix[7];
          a13 = matrix[8];
          a23 = matrix[9];
          a33 = matrix[10];
          a43 = matrix[11];
          x = matrix[12];
          y = matrix[13];
          z = matrix[14];
          angle = _atan2(a32, a33);
          rotationX = angle * _RAD2DEG;
          if (angle) {
            cos = Math.cos(-angle);
            sin = Math.sin(-angle);
            t1 = a12 * cos + a13 * sin;
            t2 = a22 * cos + a23 * sin;
            t3 = a32 * cos + a33 * sin;
            a13 = a12 * -sin + a13 * cos;
            a23 = a22 * -sin + a23 * cos;
            a33 = a32 * -sin + a33 * cos;
            a43 = a42 * -sin + a43 * cos;
            a12 = t1;
            a22 = t2;
            a32 = t3;
          }
          angle = _atan2(-c, a33);
          rotationY = angle * _RAD2DEG;
          if (angle) {
            cos = Math.cos(-angle);
            sin = Math.sin(-angle);
            t1 = a * cos - a13 * sin;
            t2 = b * cos - a23 * sin;
            t3 = c * cos - a33 * sin;
            a43 = d * sin + a43 * cos;
            a = t1;
            b = t2;
            c = t3;
          }
          angle = _atan2(b, a);
          rotation = angle * _RAD2DEG;
          if (angle) {
            cos = Math.cos(angle);
            sin = Math.sin(angle);
            t1 = a * cos + b * sin;
            t2 = a12 * cos + a22 * sin;
            b = b * cos - a * sin;
            a22 = a22 * cos - a12 * sin;
            a = t1;
            a12 = t2;
          }
          if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
            rotationX = rotation = 0;
            rotationY = 180 - rotationY;
          }
          scaleX = _round(Math.sqrt(a * a + b * b + c * c));
          scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
          angle = _atan2(a12, a22);
          skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
          perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
        }
        if (cache2.svg) {
          t1 = target.getAttribute("transform");
          cache2.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
          t1 && target.setAttribute("transform", t1);
        }
      }
      if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
        if (invertedScaleX) {
          scaleX *= -1;
          skewX += rotation <= 0 ? 180 : -180;
          rotation += rotation <= 0 ? 180 : -180;
        } else {
          scaleY *= -1;
          skewX += skewX <= 0 ? 180 : -180;
        }
      }
      uncache = uncache || cache2.uncache;
      cache2.x = x - ((cache2.xPercent = x && (!uncache && cache2.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache2.xPercent / 100 : 0) + px2;
      cache2.y = y - ((cache2.yPercent = y && (!uncache && cache2.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache2.yPercent / 100 : 0) + px2;
      cache2.z = z + px2;
      cache2.scaleX = _round(scaleX);
      cache2.scaleY = _round(scaleY);
      cache2.rotation = _round(rotation) + deg;
      cache2.rotationX = _round(rotationX) + deg;
      cache2.rotationY = _round(rotationY) + deg;
      cache2.skewX = skewX + deg;
      cache2.skewY = skewY + deg;
      cache2.transformPerspective = perspective + px2;
      if (cache2.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache2.zOrigin || 0) {
        style[_transformOriginProp] = _firstTwoOnly(origin);
      }
      cache2.xOffset = cache2.yOffset = 0;
      cache2.force3D = _config.force3D;
      cache2.renderTransform = cache2.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
      cache2.uncache = 0;
      return cache2;
    };
    _firstTwoOnly = function _firstTwoOnly2(value) {
      return (value = value.split(" "))[0] + " " + value[1];
    };
    _addPxTranslate = function _addPxTranslate2(target, start, value) {
      var unit = getUnit(start);
      return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
    };
    _renderNon3DTransforms = function _renderNon3DTransforms2(ratio, cache2) {
      cache2.z = "0px";
      cache2.rotationY = cache2.rotationX = "0deg";
      cache2.force3D = 0;
      _renderCSSTransforms(ratio, cache2);
    };
    _zeroDeg = "0deg";
    _zeroPx = "0px";
    _endParenthesis = ") ";
    _renderCSSTransforms = function _renderCSSTransforms2(ratio, cache2) {
      var _ref = cache2 || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
      if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
        var angle = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle), a33 = Math.cos(angle), cos;
        angle = parseFloat(rotationX) * _DEG2RAD;
        cos = Math.cos(angle);
        x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
        y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
        z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
      }
      if (transformPerspective !== _zeroPx) {
        transforms += "perspective(" + transformPerspective + _endParenthesis;
      }
      if (xPercent || yPercent) {
        transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
      }
      if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
        transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
      }
      if (rotation !== _zeroDeg) {
        transforms += "rotate(" + rotation + _endParenthesis;
      }
      if (rotationY !== _zeroDeg) {
        transforms += "rotateY(" + rotationY + _endParenthesis;
      }
      if (rotationX !== _zeroDeg) {
        transforms += "rotateX(" + rotationX + _endParenthesis;
      }
      if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
        transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
      }
      if (scaleX !== 1 || scaleY !== 1) {
        transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
      }
      target.style[_transformProp] = transforms || "translate(0, 0)";
    };
    _renderSVGTransforms = function _renderSVGTransforms2(ratio, cache2) {
      var _ref2 = cache2 || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y), a11, a21, a12, a22, temp;
      rotation = parseFloat(rotation);
      skewX = parseFloat(skewX);
      skewY = parseFloat(skewY);
      if (skewY) {
        skewY = parseFloat(skewY);
        skewX += skewY;
        rotation += skewY;
      }
      if (rotation || skewX) {
        rotation *= _DEG2RAD;
        skewX *= _DEG2RAD;
        a11 = Math.cos(rotation) * scaleX;
        a21 = Math.sin(rotation) * scaleX;
        a12 = Math.sin(rotation - skewX) * -scaleY;
        a22 = Math.cos(rotation - skewX) * scaleY;
        if (skewX) {
          skewY *= _DEG2RAD;
          temp = Math.tan(skewX - skewY);
          temp = Math.sqrt(1 + temp * temp);
          a12 *= temp;
          a22 *= temp;
          if (skewY) {
            temp = Math.tan(skewY);
            temp = Math.sqrt(1 + temp * temp);
            a11 *= temp;
            a21 *= temp;
          }
        }
        a11 = _round(a11);
        a21 = _round(a21);
        a12 = _round(a12);
        a22 = _round(a22);
      } else {
        a11 = scaleX;
        a22 = scaleY;
        a21 = a12 = 0;
      }
      if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
        tx = _convertToUnit(target, "x", x, "px");
        ty = _convertToUnit(target, "y", y, "px");
      }
      if (xOrigin || yOrigin || xOffset || yOffset) {
        tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
        ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
      }
      if (xPercent || yPercent) {
        temp = target.getBBox();
        tx = _round(tx + xPercent / 100 * temp.width);
        ty = _round(ty + yPercent / 100 * temp.height);
      }
      temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
      target.setAttribute("transform", temp);
      forceCSS && (target.style[_transformProp] = temp);
    };
    _addRotationalPropTween = function _addRotationalPropTween2(plugin, target, property, startNum, endValue) {
      var cap = 360, isString = _isString(endValue), endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1), change = endNum - startNum, finalValue = startNum + change + "deg", direction, pt;
      if (isString) {
        direction = endValue.split("_")[1];
        if (direction === "short") {
          change %= cap;
          if (change !== change % (cap / 2)) {
            change += change < 0 ? cap : -cap;
          }
        }
        if (direction === "cw" && change < 0) {
          change = (change + cap * _bigNum2) % cap - ~~(change / cap) * cap;
        } else if (direction === "ccw" && change > 0) {
          change = (change - cap * _bigNum2) % cap - ~~(change / cap) * cap;
        }
      }
      plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
      pt.e = finalValue;
      pt.u = "deg";
      plugin._props.push(property);
      return pt;
    };
    _assign = function _assign2(target, source) {
      for (var p in source) {
        target[p] = source[p];
      }
      return target;
    };
    _addRawTransformPTs = function _addRawTransformPTs2(plugin, transforms, target) {
      var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style = target.style, endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
      if (startCache.svg) {
        startValue = target.getAttribute("transform");
        target.setAttribute("transform", "");
        style[_transformProp] = transforms;
        endCache = _parseTransform(target, 1);
        _removeProperty(target, _transformProp);
        target.setAttribute("transform", startValue);
      } else {
        startValue = getComputedStyle(target)[_transformProp];
        style[_transformProp] = transforms;
        endCache = _parseTransform(target, 1);
        style[_transformProp] = startValue;
      }
      for (p in _transformProps) {
        startValue = startCache[p];
        endValue = endCache[p];
        if (startValue !== endValue && exclude.indexOf(p) < 0) {
          startUnit = getUnit(startValue);
          endUnit = getUnit(endValue);
          startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
          endNum = parseFloat(endValue);
          plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
          plugin._pt.u = endUnit || 0;
          plugin._props.push(p);
        }
      }
      _assign(endCache, startCache);
    };
    _forEachName("padding,margin,Width,Radius", function(name, index) {
      var t = "Top", r = "Right", b = "Bottom", l = "Left", props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function(side) {
        return index < 2 ? name + side : "border" + side + name;
      });
      _specialProps[index > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
        var a, vars;
        if (arguments.length < 4) {
          a = props.map(function(prop) {
            return _get(plugin, prop, property);
          });
          vars = a.join(" ");
          return vars.split(a[0]).length === 5 ? a[0] : vars;
        }
        a = (endValue + "").split(" ");
        vars = {};
        props.forEach(function(prop, i) {
          return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
        });
        plugin.init(target, vars, tween);
      };
    });
    CSSPlugin = {
      name: "css",
      register: _initCore,
      targetTest: function targetTest(target) {
        return target.style && target.nodeType;
      },
      init: function init3(target, vars, tween, index, targets) {
        var props = this._props, style = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache2, smooth, hasPriority, inlineProps;
        _pluginInitted || _initCore();
        this.styles = this.styles || _getStyleSaver(target);
        inlineProps = this.styles.props;
        this.tween = tween;
        for (p in vars) {
          if (p === "autoRound") {
            continue;
          }
          endValue = vars[p];
          if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
            continue;
          }
          type = typeof endValue;
          specialProp = _specialProps[p];
          if (type === "function") {
            endValue = endValue.call(tween, index, target, targets);
            type = typeof endValue;
          }
          if (type === "string" && ~endValue.indexOf("random(")) {
            endValue = _replaceRandom(endValue);
          }
          if (specialProp) {
            specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
          } else if (p.substr(0, 2) === "--") {
            startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
            endValue += "";
            _colorExp.lastIndex = 0;
            if (!_colorExp.test(startValue)) {
              startUnit = getUnit(startValue);
              endUnit = getUnit(endValue);
            }
            endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
            this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
            props.push(p);
            inlineProps.push(p, 0, style[p]);
          } else if (type !== "undefined") {
            if (startAt && p in startAt) {
              startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
              _isString(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
              getUnit(startValue + "") || startValue === "auto" || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
              (startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
            } else {
              startValue = _get(target, p);
            }
            startNum = parseFloat(startValue);
            relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
            relative && (endValue = endValue.substr(2));
            endNum = parseFloat(endValue);
            if (p in _propertyAliases) {
              if (p === "autoAlpha") {
                if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                  startNum = 0;
                }
                inlineProps.push("visibility", 0, style.visibility);
                _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
              }
              if (p !== "scale" && p !== "transform") {
                p = _propertyAliases[p];
                ~p.indexOf(",") && (p = p.split(",")[0]);
              }
            }
            isTransformRelated = p in _transformProps;
            if (isTransformRelated) {
              this.styles.save(p);
              if (!transformPropTween) {
                cache2 = target._gsap;
                cache2.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
                smooth = vars.smoothOrigin !== false && cache2.smooth;
                transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache2.renderTransform, cache2, 0, -1);
                transformPropTween.dep = 1;
              }
              if (p === "scale") {
                this._pt = new PropTween(this._pt, cache2, "scaleY", cache2.scaleY, (relative ? _parseRelative(cache2.scaleY, relative + endNum) : endNum) - cache2.scaleY || 0, _renderCSSProp);
                this._pt.u = 0;
                props.push("scaleY", p);
                p += "X";
              } else if (p === "transformOrigin") {
                inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
                endValue = _convertKeywordsToPercentages(endValue);
                if (cache2.svg) {
                  _applySVGOrigin(target, endValue, 0, smooth, 0, this);
                } else {
                  endUnit = parseFloat(endValue.split(" ")[2]) || 0;
                  endUnit !== cache2.zOrigin && _addNonTweeningPT(this, cache2, "zOrigin", cache2.zOrigin, endUnit);
                  _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
                }
                continue;
              } else if (p === "svgOrigin") {
                _applySVGOrigin(target, endValue, 1, smooth, 0, this);
                continue;
              } else if (p in _rotationalProperties) {
                _addRotationalPropTween(this, cache2, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
                continue;
              } else if (p === "smoothOrigin") {
                _addNonTweeningPT(this, cache2, "smooth", cache2.smooth, endValue);
                continue;
              } else if (p === "force3D") {
                cache2[p] = endValue;
                continue;
              } else if (p === "transform") {
                _addRawTransformPTs(this, endValue, target);
                continue;
              }
            } else if (!(p in style)) {
              p = _checkPropPrefix(p) || p;
            }
            if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
              startUnit = (startValue + "").substr((startNum + "").length);
              endNum || (endNum = 0);
              endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
              startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
              this._pt = new PropTween(this._pt, isTransformRelated ? cache2 : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
              this._pt.u = endUnit || 0;
              if (startUnit !== endUnit && endUnit !== "%") {
                this._pt.b = startValue;
                this._pt.r = _renderCSSPropWithBeginning;
              }
            } else if (!(p in style)) {
              if (p in target) {
                this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
              } else if (p !== "parseTransform") {
                _missingPlugin(p, endValue);
                continue;
              }
            } else {
              _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
            }
            isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : inlineProps.push(p, 1, startValue || target[p]));
            props.push(p);
          }
        }
        hasPriority && _sortPropTweensByPriority(this);
      },
      render: function render2(ratio, data) {
        if (data.tween._time || !_reverting2()) {
          var pt = data._pt;
          while (pt) {
            pt.r(ratio, pt.d);
            pt = pt._next;
          }
        } else {
          data.styles.revert();
        }
      },
      get: _get,
      aliases: _propertyAliases,
      getSetter: function getSetter(target, property, plugin) {
        var p = _propertyAliases[property];
        p && p.indexOf(",") < 0 && (property = p);
        return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
      },
      core: {
        _removeProperty,
        _getMatrix
      }
    };
    gsap.utils.checkPrefix = _checkPropPrefix;
    gsap.core.getStyleSaver = _getStyleSaver;
    (function(positionAndScale, rotation, others, aliases) {
      var all = _forEachName(positionAndScale + "," + rotation + "," + others, function(name) {
        _transformProps[name] = 1;
      });
      _forEachName(rotation, function(name) {
        _config.units[name] = "deg";
        _rotationalProperties[name] = 1;
      });
      _propertyAliases[all[13]] = positionAndScale + "," + rotation;
      _forEachName(aliases, function(name) {
        var split = name.split(":");
        _propertyAliases[split[1]] = all[split[0]];
      });
    })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
    _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(name) {
      _config.units[name] = "px";
    });
    gsap.registerPlugin(CSSPlugin);
  }
});

// node_modules/gsap/index.js
var gsapWithCSS, TweenMaxWithCSS;
var init_gsap = __esm({
  "node_modules/gsap/index.js"() {
    init_gsap_core();
    init_CSSPlugin();
    gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap;
    TweenMaxWithCSS = gsapWithCSS.core.Tween;
  }
});

// node_modules/howler/dist/howler.js
var require_howler = __commonJS({
  "node_modules/howler/dist/howler.js"(exports) {
    (function() {
      "use strict";
      var HowlerGlobal2 = function() {
        this.init();
      };
      HowlerGlobal2.prototype = {
        /**
         * Initialize the global Howler object.
         * @return {Howler}
         */
        init: function() {
          var self = this || Howler2;
          self._counter = 1e3;
          self._html5AudioPool = [];
          self.html5PoolSize = 10;
          self._codecs = {};
          self._howls = [];
          self._muted = false;
          self._volume = 1;
          self._canPlayEvent = "canplaythrough";
          self._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
          self.masterGain = null;
          self.noAudio = false;
          self.usingWebAudio = true;
          self.autoSuspend = true;
          self.ctx = null;
          self.autoUnlock = true;
          self._setup();
          return self;
        },
        /**
         * Get/set the global volume for all sounds.
         * @param  {Float} vol Volume from 0.0 to 1.0.
         * @return {Howler/Float}     Returns self or current volume.
         */
        volume: function(vol) {
          var self = this || Howler2;
          vol = parseFloat(vol);
          if (!self.ctx) {
            setupAudioContext();
          }
          if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
            self._volume = vol;
            if (self._muted) {
              return self;
            }
            if (self.usingWebAudio) {
              self.masterGain.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (!self._howls[i]._webAudio) {
                var ids = self._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self._howls[i]._soundById(ids[j]);
                  if (sound && sound._node) {
                    sound._node.volume = sound._volume * vol;
                  }
                }
              }
            }
            return self;
          }
          return self._volume;
        },
        /**
         * Handle muting and unmuting globally.
         * @param  {Boolean} muted Is muted or not.
         */
        mute: function(muted) {
          var self = this || Howler2;
          if (!self.ctx) {
            setupAudioContext();
          }
          self._muted = muted;
          if (self.usingWebAudio) {
            self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler2.ctx.currentTime);
          }
          for (var i = 0; i < self._howls.length; i++) {
            if (!self._howls[i]._webAudio) {
              var ids = self._howls[i]._getSoundIds();
              for (var j = 0; j < ids.length; j++) {
                var sound = self._howls[i]._soundById(ids[j]);
                if (sound && sound._node) {
                  sound._node.muted = muted ? true : sound._muted;
                }
              }
            }
          }
          return self;
        },
        /**
         * Handle stopping all sounds globally.
         */
        stop: function() {
          var self = this || Howler2;
          for (var i = 0; i < self._howls.length; i++) {
            self._howls[i].stop();
          }
          return self;
        },
        /**
         * Unload and destroy all currently loaded Howl objects.
         * @return {Howler}
         */
        unload: function() {
          var self = this || Howler2;
          for (var i = self._howls.length - 1; i >= 0; i--) {
            self._howls[i].unload();
          }
          if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== "undefined") {
            self.ctx.close();
            self.ctx = null;
            setupAudioContext();
          }
          return self;
        },
        /**
         * Check for codec support of specific extension.
         * @param  {String} ext Audio file extention.
         * @return {Boolean}
         */
        codecs: function(ext) {
          return (this || Howler2)._codecs[ext.replace(/^x-/, "")];
        },
        /**
         * Setup various state values for global tracking.
         * @return {Howler}
         */
        _setup: function() {
          var self = this || Howler2;
          self.state = self.ctx ? self.ctx.state || "suspended" : "suspended";
          self._autoSuspend();
          if (!self.usingWebAudio) {
            if (typeof Audio !== "undefined") {
              try {
                var test = new Audio();
                if (typeof test.oncanplaythrough === "undefined") {
                  self._canPlayEvent = "canplay";
                }
              } catch (e) {
                self.noAudio = true;
              }
            } else {
              self.noAudio = true;
            }
          }
          try {
            var test = new Audio();
            if (test.muted) {
              self.noAudio = true;
            }
          } catch (e) {
          }
          if (!self.noAudio) {
            self._setupCodecs();
          }
          return self;
        },
        /**
         * Check for browser support for various codecs and cache the results.
         * @return {Howler}
         */
        _setupCodecs: function() {
          var self = this || Howler2;
          var audioTest = null;
          try {
            audioTest = typeof Audio !== "undefined" ? new Audio() : null;
          } catch (err) {
            return self;
          }
          if (!audioTest || typeof audioTest.canPlayType !== "function") {
            return self;
          }
          var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
          var ua = self._navigator ? self._navigator.userAgent : "";
          var checkOpera = ua.match(/OPR\/(\d+)/g);
          var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
          var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
          var safariVersion = ua.match(/Version\/(.*?) /);
          var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
          self._codecs = {
            mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
            mpeg: !!mpegTest,
            opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
            ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
            aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
            caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
            m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
            m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
            mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
            weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
            webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
            dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
            flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
          };
          return self;
        },
        /**
         * Some browsers/devices will only allow audio to be played after a user interaction.
         * Attempt to automatically unlock audio on the first user interaction.
         * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
         * @return {Howler}
         */
        _unlockAudio: function() {
          var self = this || Howler2;
          if (self._audioUnlocked || !self.ctx) {
            return;
          }
          self._audioUnlocked = false;
          self.autoUnlock = false;
          if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
            self._mobileUnloaded = true;
            self.unload();
          }
          self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);
          var unlock = function(e) {
            while (self._html5AudioPool.length < self.html5PoolSize) {
              try {
                var audioNode = new Audio();
                audioNode._unlocked = true;
                self._releaseHtml5Audio(audioNode);
              } catch (e2) {
                self.noAudio = true;
                break;
              }
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (!self._howls[i]._webAudio) {
                var ids = self._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self._howls[i]._soundById(ids[j]);
                  if (sound && sound._node && !sound._node._unlocked) {
                    sound._node._unlocked = true;
                    sound._node.load();
                  }
                }
              }
            }
            self._autoResume();
            var source = self.ctx.createBufferSource();
            source.buffer = self._scratchBuffer;
            source.connect(self.ctx.destination);
            if (typeof source.start === "undefined") {
              source.noteOn(0);
            } else {
              source.start(0);
            }
            if (typeof self.ctx.resume === "function") {
              self.ctx.resume();
            }
            source.onended = function() {
              source.disconnect(0);
              self._audioUnlocked = true;
              document.removeEventListener("touchstart", unlock, true);
              document.removeEventListener("touchend", unlock, true);
              document.removeEventListener("click", unlock, true);
              document.removeEventListener("keydown", unlock, true);
              for (var i2 = 0; i2 < self._howls.length; i2++) {
                self._howls[i2]._emit("unlock");
              }
            };
          };
          document.addEventListener("touchstart", unlock, true);
          document.addEventListener("touchend", unlock, true);
          document.addEventListener("click", unlock, true);
          document.addEventListener("keydown", unlock, true);
          return self;
        },
        /**
         * Get an unlocked HTML5 Audio object from the pool. If none are left,
         * return a new Audio object and throw a warning.
         * @return {Audio} HTML5 Audio object.
         */
        _obtainHtml5Audio: function() {
          var self = this || Howler2;
          if (self._html5AudioPool.length) {
            return self._html5AudioPool.pop();
          }
          var testPlay = new Audio().play();
          if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
            testPlay.catch(function() {
              console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
            });
          }
          return new Audio();
        },
        /**
         * Return an activated HTML5 Audio object to the pool.
         * @return {Howler}
         */
        _releaseHtml5Audio: function(audio) {
          var self = this || Howler2;
          if (audio._unlocked) {
            self._html5AudioPool.push(audio);
          }
          return self;
        },
        /**
         * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
         * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
         * @return {Howler}
         */
        _autoSuspend: function() {
          var self = this;
          if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === "undefined" || !Howler2.usingWebAudio) {
            return;
          }
          for (var i = 0; i < self._howls.length; i++) {
            if (self._howls[i]._webAudio) {
              for (var j = 0; j < self._howls[i]._sounds.length; j++) {
                if (!self._howls[i]._sounds[j]._paused) {
                  return self;
                }
              }
            }
          }
          if (self._suspendTimer) {
            clearTimeout(self._suspendTimer);
          }
          self._suspendTimer = setTimeout(function() {
            if (!self.autoSuspend) {
              return;
            }
            self._suspendTimer = null;
            self.state = "suspending";
            var handleSuspension = function() {
              self.state = "suspended";
              if (self._resumeAfterSuspend) {
                delete self._resumeAfterSuspend;
                self._autoResume();
              }
            };
            self.ctx.suspend().then(handleSuspension, handleSuspension);
          }, 3e4);
          return self;
        },
        /**
         * Automatically resume the Web Audio AudioContext when a new sound is played.
         * @return {Howler}
         */
        _autoResume: function() {
          var self = this;
          if (!self.ctx || typeof self.ctx.resume === "undefined" || !Howler2.usingWebAudio) {
            return;
          }
          if (self.state === "running" && self.ctx.state !== "interrupted" && self._suspendTimer) {
            clearTimeout(self._suspendTimer);
            self._suspendTimer = null;
          } else if (self.state === "suspended" || self.state === "running" && self.ctx.state === "interrupted") {
            self.ctx.resume().then(function() {
              self.state = "running";
              for (var i = 0; i < self._howls.length; i++) {
                self._howls[i]._emit("resume");
              }
            });
            if (self._suspendTimer) {
              clearTimeout(self._suspendTimer);
              self._suspendTimer = null;
            }
          } else if (self.state === "suspending") {
            self._resumeAfterSuspend = true;
          }
          return self;
        }
      };
      var Howler2 = new HowlerGlobal2();
      var Howl3 = function(o) {
        var self = this;
        if (!o.src || o.src.length === 0) {
          console.error("An array of source files must be passed with any new Howl.");
          return;
        }
        self.init(o);
      };
      Howl3.prototype = {
        /**
         * Initialize a new Howl group object.
         * @param  {Object} o Passed in properties for this group.
         * @return {Howl}
         */
        init: function(o) {
          var self = this;
          if (!Howler2.ctx) {
            setupAudioContext();
          }
          self._autoplay = o.autoplay || false;
          self._format = typeof o.format !== "string" ? o.format : [o.format];
          self._html5 = o.html5 || false;
          self._muted = o.mute || false;
          self._loop = o.loop || false;
          self._pool = o.pool || 5;
          self._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
          self._rate = o.rate || 1;
          self._sprite = o.sprite || {};
          self._src = typeof o.src !== "string" ? o.src : [o.src];
          self._volume = o.volume !== void 0 ? o.volume : 1;
          self._xhr = {
            method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
            headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
            withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
          };
          self._duration = 0;
          self._state = "unloaded";
          self._sounds = [];
          self._endTimers = {};
          self._queue = [];
          self._playLock = false;
          self._onend = o.onend ? [{ fn: o.onend }] : [];
          self._onfade = o.onfade ? [{ fn: o.onfade }] : [];
          self._onload = o.onload ? [{ fn: o.onload }] : [];
          self._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
          self._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
          self._onpause = o.onpause ? [{ fn: o.onpause }] : [];
          self._onplay = o.onplay ? [{ fn: o.onplay }] : [];
          self._onstop = o.onstop ? [{ fn: o.onstop }] : [];
          self._onmute = o.onmute ? [{ fn: o.onmute }] : [];
          self._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
          self._onrate = o.onrate ? [{ fn: o.onrate }] : [];
          self._onseek = o.onseek ? [{ fn: o.onseek }] : [];
          self._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
          self._onresume = [];
          self._webAudio = Howler2.usingWebAudio && !self._html5;
          if (typeof Howler2.ctx !== "undefined" && Howler2.ctx && Howler2.autoUnlock) {
            Howler2._unlockAudio();
          }
          Howler2._howls.push(self);
          if (self._autoplay) {
            self._queue.push({
              event: "play",
              action: function() {
                self.play();
              }
            });
          }
          if (self._preload && self._preload !== "none") {
            self.load();
          }
          return self;
        },
        /**
         * Load the audio file.
         * @return {Howler}
         */
        load: function() {
          var self = this;
          var url = null;
          if (Howler2.noAudio) {
            self._emit("loaderror", null, "No audio support.");
            return;
          }
          if (typeof self._src === "string") {
            self._src = [self._src];
          }
          for (var i = 0; i < self._src.length; i++) {
            var ext, str;
            if (self._format && self._format[i]) {
              ext = self._format[i];
            } else {
              str = self._src[i];
              if (typeof str !== "string") {
                self._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                continue;
              }
              ext = /^data:audio\/([^;,]+);/i.exec(str);
              if (!ext) {
                ext = /\.([^.]+)$/.exec(str.split("?", 1)[0]);
              }
              if (ext) {
                ext = ext[1].toLowerCase();
              }
            }
            if (!ext) {
              console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
            }
            if (ext && Howler2.codecs(ext)) {
              url = self._src[i];
              break;
            }
          }
          if (!url) {
            self._emit("loaderror", null, "No codec support for selected audio sources.");
            return;
          }
          self._src = url;
          self._state = "loading";
          if (window.location.protocol === "https:" && url.slice(0, 5) === "http:") {
            self._html5 = true;
            self._webAudio = false;
          }
          new Sound2(self);
          if (self._webAudio) {
            loadBuffer(self);
          }
          return self;
        },
        /**
         * Play a sound or resume previous playback.
         * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
         * @param  {Boolean} internal Internal Use: true prevents event firing.
         * @return {Number}          Sound ID.
         */
        play: function(sprite, internal) {
          var self = this;
          var id = null;
          if (typeof sprite === "number") {
            id = sprite;
            sprite = null;
          } else if (typeof sprite === "string" && self._state === "loaded" && !self._sprite[sprite]) {
            return null;
          } else if (typeof sprite === "undefined") {
            sprite = "__default";
            if (!self._playLock) {
              var num = 0;
              for (var i = 0; i < self._sounds.length; i++) {
                if (self._sounds[i]._paused && !self._sounds[i]._ended) {
                  num++;
                  id = self._sounds[i]._id;
                }
              }
              if (num === 1) {
                sprite = null;
              } else {
                id = null;
              }
            }
          }
          var sound = id ? self._soundById(id) : self._inactiveSound();
          if (!sound) {
            return null;
          }
          if (id && !sprite) {
            sprite = sound._sprite || "__default";
          }
          if (self._state !== "loaded") {
            sound._sprite = sprite;
            sound._ended = false;
            var soundId = sound._id;
            self._queue.push({
              event: "play",
              action: function() {
                self.play(soundId);
              }
            });
            return soundId;
          }
          if (id && !sound._paused) {
            if (!internal) {
              self._loadQueue("play");
            }
            return sound._id;
          }
          if (self._webAudio) {
            Howler2._autoResume();
          }
          var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1e3);
          var duration = Math.max(0, (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3 - seek);
          var timeout = duration * 1e3 / Math.abs(sound._rate);
          var start = self._sprite[sprite][0] / 1e3;
          var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3;
          sound._sprite = sprite;
          sound._ended = false;
          var setParams = function() {
            sound._paused = false;
            sound._seek = seek;
            sound._start = start;
            sound._stop = stop;
            sound._loop = !!(sound._loop || self._sprite[sprite][2]);
          };
          if (seek >= stop) {
            self._ended(sound);
            return;
          }
          var node = sound._node;
          if (self._webAudio) {
            var playWebAudio = function() {
              self._playLock = false;
              setParams();
              self._refreshBuffer(sound);
              var vol = sound._muted || self._muted ? 0 : sound._volume;
              node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
              sound._playStart = Howler2.ctx.currentTime;
              if (typeof node.bufferSource.start === "undefined") {
                sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
              } else {
                sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
              }
              if (timeout !== Infinity) {
                self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
              }
              if (!internal) {
                setTimeout(function() {
                  self._emit("play", sound._id);
                  self._loadQueue();
                }, 0);
              }
            };
            if (Howler2.state === "running" && Howler2.ctx.state !== "interrupted") {
              playWebAudio();
            } else {
              self._playLock = true;
              self.once("resume", playWebAudio);
              self._clearTimer(sound._id);
            }
          } else {
            var playHtml5 = function() {
              node.currentTime = seek;
              node.muted = sound._muted || self._muted || Howler2._muted || node.muted;
              node.volume = sound._volume * Howler2.volume();
              node.playbackRate = sound._rate;
              try {
                var play = node.play();
                if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                  self._playLock = true;
                  setParams();
                  play.then(function() {
                    self._playLock = false;
                    node._unlocked = true;
                    if (!internal) {
                      self._emit("play", sound._id);
                    } else {
                      self._loadQueue();
                    }
                  }).catch(function() {
                    self._playLock = false;
                    self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                    sound._ended = true;
                    sound._paused = true;
                  });
                } else if (!internal) {
                  self._playLock = false;
                  setParams();
                  self._emit("play", sound._id);
                }
                node.playbackRate = sound._rate;
                if (node.paused) {
                  self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                  return;
                }
                if (sprite !== "__default" || sound._loop) {
                  self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
                } else {
                  self._endTimers[sound._id] = function() {
                    self._ended(sound);
                    node.removeEventListener("ended", self._endTimers[sound._id], false);
                  };
                  node.addEventListener("ended", self._endTimers[sound._id], false);
                }
              } catch (err) {
                self._emit("playerror", sound._id, err);
              }
            };
            if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
              node.src = self._src;
              node.load();
            }
            var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler2._navigator.isCocoonJS;
            if (node.readyState >= 3 || loadedNoReadyState) {
              playHtml5();
            } else {
              self._playLock = true;
              self._state = "loading";
              var listener = function() {
                self._state = "loaded";
                playHtml5();
                node.removeEventListener(Howler2._canPlayEvent, listener, false);
              };
              node.addEventListener(Howler2._canPlayEvent, listener, false);
              self._clearTimer(sound._id);
            }
          }
          return sound._id;
        },
        /**
         * Pause playback and save current position.
         * @param  {Number} id The sound ID (empty to pause all in group).
         * @return {Howl}
         */
        pause: function(id) {
          var self = this;
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "pause",
              action: function() {
                self.pause(id);
              }
            });
            return self;
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            self._clearTimer(ids[i]);
            var sound = self._soundById(ids[i]);
            if (sound && !sound._paused) {
              sound._seek = self.seek(ids[i]);
              sound._rateSeek = 0;
              sound._paused = true;
              self._stopFade(ids[i]);
              if (sound._node) {
                if (self._webAudio) {
                  if (!sound._node.bufferSource) {
                    continue;
                  }
                  if (typeof sound._node.bufferSource.stop === "undefined") {
                    sound._node.bufferSource.noteOff(0);
                  } else {
                    sound._node.bufferSource.stop(0);
                  }
                  self._cleanBuffer(sound._node);
                } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                  sound._node.pause();
                }
              }
            }
            if (!arguments[1]) {
              self._emit("pause", sound ? sound._id : null);
            }
          }
          return self;
        },
        /**
         * Stop playback and reset to start.
         * @param  {Number} id The sound ID (empty to stop all in group).
         * @param  {Boolean} internal Internal Use: true prevents event firing.
         * @return {Howl}
         */
        stop: function(id, internal) {
          var self = this;
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "stop",
              action: function() {
                self.stop(id);
              }
            });
            return self;
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            self._clearTimer(ids[i]);
            var sound = self._soundById(ids[i]);
            if (sound) {
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              sound._paused = true;
              sound._ended = true;
              self._stopFade(ids[i]);
              if (sound._node) {
                if (self._webAudio) {
                  if (sound._node.bufferSource) {
                    if (typeof sound._node.bufferSource.stop === "undefined") {
                      sound._node.bufferSource.noteOff(0);
                    } else {
                      sound._node.bufferSource.stop(0);
                    }
                    self._cleanBuffer(sound._node);
                  }
                } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                  sound._node.currentTime = sound._start || 0;
                  sound._node.pause();
                  if (sound._node.duration === Infinity) {
                    self._clearSound(sound._node);
                  }
                }
              }
              if (!internal) {
                self._emit("stop", sound._id);
              }
            }
          }
          return self;
        },
        /**
         * Mute/unmute a single sound or all sounds in this Howl group.
         * @param  {Boolean} muted Set to true to mute and false to unmute.
         * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
         * @return {Howl}
         */
        mute: function(muted, id) {
          var self = this;
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "mute",
              action: function() {
                self.mute(muted, id);
              }
            });
            return self;
          }
          if (typeof id === "undefined") {
            if (typeof muted === "boolean") {
              self._muted = muted;
            } else {
              return self._muted;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              sound._muted = muted;
              if (sound._interval) {
                self._stopFade(sound._id);
              }
              if (self._webAudio && sound._node) {
                sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler2.ctx.currentTime);
              } else if (sound._node) {
                sound._node.muted = Howler2._muted ? true : muted;
              }
              self._emit("mute", sound._id);
            }
          }
          return self;
        },
        /**
         * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
         *   volume() -> Returns the group's volume value.
         *   volume(id) -> Returns the sound id's current volume.
         *   volume(vol) -> Sets the volume of all sounds in this Howl group.
         *   volume(vol, id) -> Sets the volume of passed sound id.
         * @return {Howl/Number} Returns self or current volume.
         */
        volume: function() {
          var self = this;
          var args = arguments;
          var vol, id;
          if (args.length === 0) {
            return self._volume;
          } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
            var ids = self._getSoundIds();
            var index = ids.indexOf(args[0]);
            if (index >= 0) {
              id = parseInt(args[0], 10);
            } else {
              vol = parseFloat(args[0]);
            }
          } else if (args.length >= 2) {
            vol = parseFloat(args[0]);
            id = parseInt(args[1], 10);
          }
          var sound;
          if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "volume",
                action: function() {
                  self.volume.apply(self, args);
                }
              });
              return self;
            }
            if (typeof id === "undefined") {
              self._volume = vol;
            }
            id = self._getSoundIds(id);
            for (var i = 0; i < id.length; i++) {
              sound = self._soundById(id[i]);
              if (sound) {
                sound._volume = vol;
                if (!args[2]) {
                  self._stopFade(id[i]);
                }
                if (self._webAudio && sound._node && !sound._muted) {
                  sound._node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                } else if (sound._node && !sound._muted) {
                  sound._node.volume = vol * Howler2.volume();
                }
                self._emit("volume", sound._id);
              }
            }
          } else {
            sound = id ? self._soundById(id) : self._sounds[0];
            return sound ? sound._volume : 0;
          }
          return self;
        },
        /**
         * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
         * @param  {Number} from The value to fade from (0.0 to 1.0).
         * @param  {Number} to   The volume to fade to (0.0 to 1.0).
         * @param  {Number} len  Time in milliseconds to fade.
         * @param  {Number} id   The sound id (omit to fade all sounds).
         * @return {Howl}
         */
        fade: function(from, to, len, id) {
          var self = this;
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "fade",
              action: function() {
                self.fade(from, to, len, id);
              }
            });
            return self;
          }
          from = Math.min(Math.max(0, parseFloat(from)), 1);
          to = Math.min(Math.max(0, parseFloat(to)), 1);
          len = parseFloat(len);
          self.volume(from, id);
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              if (!id) {
                self._stopFade(ids[i]);
              }
              if (self._webAudio && !sound._muted) {
                var currentTime = Howler2.ctx.currentTime;
                var end = currentTime + len / 1e3;
                sound._volume = from;
                sound._node.gain.setValueAtTime(from, currentTime);
                sound._node.gain.linearRampToValueAtTime(to, end);
              }
              self._startFadeInterval(sound, from, to, len, ids[i], typeof id === "undefined");
            }
          }
          return self;
        },
        /**
         * Starts the internal interval to fade a sound.
         * @param  {Object} sound Reference to sound to fade.
         * @param  {Number} from The value to fade from (0.0 to 1.0).
         * @param  {Number} to   The volume to fade to (0.0 to 1.0).
         * @param  {Number} len  Time in milliseconds to fade.
         * @param  {Number} id   The sound id to fade.
         * @param  {Boolean} isGroup   If true, set the volume on the group.
         */
        _startFadeInterval: function(sound, from, to, len, id, isGroup) {
          var self = this;
          var vol = from;
          var diff = to - from;
          var steps = Math.abs(diff / 0.01);
          var stepLen = Math.max(4, steps > 0 ? len / steps : len);
          var lastTick = Date.now();
          sound._fadeTo = to;
          sound._interval = setInterval(function() {
            var tick = (Date.now() - lastTick) / len;
            lastTick = Date.now();
            vol += diff * tick;
            vol = Math.round(vol * 100) / 100;
            if (diff < 0) {
              vol = Math.max(to, vol);
            } else {
              vol = Math.min(to, vol);
            }
            if (self._webAudio) {
              sound._volume = vol;
            } else {
              self.volume(vol, sound._id, true);
            }
            if (isGroup) {
              self._volume = vol;
            }
            if (to < from && vol <= to || to > from && vol >= to) {
              clearInterval(sound._interval);
              sound._interval = null;
              sound._fadeTo = null;
              self.volume(to, sound._id);
              self._emit("fade", sound._id);
            }
          }, stepLen);
        },
        /**
         * Internal method that stops the currently playing fade when
         * a new fade starts, volume is changed or the sound is stopped.
         * @param  {Number} id The sound id.
         * @return {Howl}
         */
        _stopFade: function(id) {
          var self = this;
          var sound = self._soundById(id);
          if (sound && sound._interval) {
            if (self._webAudio) {
              sound._node.gain.cancelScheduledValues(Howler2.ctx.currentTime);
            }
            clearInterval(sound._interval);
            sound._interval = null;
            self.volume(sound._fadeTo, id);
            sound._fadeTo = null;
            self._emit("fade", id);
          }
          return self;
        },
        /**
         * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
         *   loop() -> Returns the group's loop value.
         *   loop(id) -> Returns the sound id's loop value.
         *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
         *   loop(loop, id) -> Sets the loop value of passed sound id.
         * @return {Howl/Boolean} Returns self or current loop value.
         */
        loop: function() {
          var self = this;
          var args = arguments;
          var loop, id, sound;
          if (args.length === 0) {
            return self._loop;
          } else if (args.length === 1) {
            if (typeof args[0] === "boolean") {
              loop = args[0];
              self._loop = loop;
            } else {
              sound = self._soundById(parseInt(args[0], 10));
              return sound ? sound._loop : false;
            }
          } else if (args.length === 2) {
            loop = args[0];
            id = parseInt(args[1], 10);
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            sound = self._soundById(ids[i]);
            if (sound) {
              sound._loop = loop;
              if (self._webAudio && sound._node && sound._node.bufferSource) {
                sound._node.bufferSource.loop = loop;
                if (loop) {
                  sound._node.bufferSource.loopStart = sound._start || 0;
                  sound._node.bufferSource.loopEnd = sound._stop;
                  if (self.playing(ids[i])) {
                    self.pause(ids[i], true);
                    self.play(ids[i], true);
                  }
                }
              }
            }
          }
          return self;
        },
        /**
         * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
         *   rate() -> Returns the first sound node's current playback rate.
         *   rate(id) -> Returns the sound id's current playback rate.
         *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
         *   rate(rate, id) -> Sets the playback rate of passed sound id.
         * @return {Howl/Number} Returns self or the current playback rate.
         */
        rate: function() {
          var self = this;
          var args = arguments;
          var rate, id;
          if (args.length === 0) {
            id = self._sounds[0]._id;
          } else if (args.length === 1) {
            var ids = self._getSoundIds();
            var index = ids.indexOf(args[0]);
            if (index >= 0) {
              id = parseInt(args[0], 10);
            } else {
              rate = parseFloat(args[0]);
            }
          } else if (args.length === 2) {
            rate = parseFloat(args[0]);
            id = parseInt(args[1], 10);
          }
          var sound;
          if (typeof rate === "number") {
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "rate",
                action: function() {
                  self.rate.apply(self, args);
                }
              });
              return self;
            }
            if (typeof id === "undefined") {
              self._rate = rate;
            }
            id = self._getSoundIds(id);
            for (var i = 0; i < id.length; i++) {
              sound = self._soundById(id[i]);
              if (sound) {
                if (self.playing(id[i])) {
                  sound._rateSeek = self.seek(id[i]);
                  sound._playStart = self._webAudio ? Howler2.ctx.currentTime : sound._playStart;
                }
                sound._rate = rate;
                if (self._webAudio && sound._node && sound._node.bufferSource) {
                  sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler2.ctx.currentTime);
                } else if (sound._node) {
                  sound._node.playbackRate = rate;
                }
                var seek = self.seek(id[i]);
                var duration = (self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1e3 - seek;
                var timeout = duration * 1e3 / Math.abs(sound._rate);
                if (self._endTimers[id[i]] || !sound._paused) {
                  self._clearTimer(id[i]);
                  self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
                }
                self._emit("rate", sound._id);
              }
            }
          } else {
            sound = self._soundById(id);
            return sound ? sound._rate : self._rate;
          }
          return self;
        },
        /**
         * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
         *   seek() -> Returns the first sound node's current seek position.
         *   seek(id) -> Returns the sound id's current seek position.
         *   seek(seek) -> Sets the seek position of the first sound node.
         *   seek(seek, id) -> Sets the seek position of passed sound id.
         * @return {Howl/Number} Returns self or the current seek position.
         */
        seek: function() {
          var self = this;
          var args = arguments;
          var seek, id;
          if (args.length === 0) {
            if (self._sounds.length) {
              id = self._sounds[0]._id;
            }
          } else if (args.length === 1) {
            var ids = self._getSoundIds();
            var index = ids.indexOf(args[0]);
            if (index >= 0) {
              id = parseInt(args[0], 10);
            } else if (self._sounds.length) {
              id = self._sounds[0]._id;
              seek = parseFloat(args[0]);
            }
          } else if (args.length === 2) {
            seek = parseFloat(args[0]);
            id = parseInt(args[1], 10);
          }
          if (typeof id === "undefined") {
            return 0;
          }
          if (typeof seek === "number" && (self._state !== "loaded" || self._playLock)) {
            self._queue.push({
              event: "seek",
              action: function() {
                self.seek.apply(self, args);
              }
            });
            return self;
          }
          var sound = self._soundById(id);
          if (sound) {
            if (typeof seek === "number" && seek >= 0) {
              var playing = self.playing(id);
              if (playing) {
                self.pause(id, true);
              }
              sound._seek = seek;
              sound._ended = false;
              self._clearTimer(id);
              if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
                sound._node.currentTime = seek;
              }
              var seekAndEmit = function() {
                if (playing) {
                  self.play(id, true);
                }
                self._emit("seek", id);
              };
              if (playing && !self._webAudio) {
                var emitSeek = function() {
                  if (!self._playLock) {
                    seekAndEmit();
                  } else {
                    setTimeout(emitSeek, 0);
                  }
                };
                setTimeout(emitSeek, 0);
              } else {
                seekAndEmit();
              }
            } else {
              if (self._webAudio) {
                var realTime = self.playing(id) ? Howler2.ctx.currentTime - sound._playStart : 0;
                var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
                return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
              } else {
                return sound._node.currentTime;
              }
            }
          }
          return self;
        },
        /**
         * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
         * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
         * @return {Boolean} True if playing and false if not.
         */
        playing: function(id) {
          var self = this;
          if (typeof id === "number") {
            var sound = self._soundById(id);
            return sound ? !sound._paused : false;
          }
          for (var i = 0; i < self._sounds.length; i++) {
            if (!self._sounds[i]._paused) {
              return true;
            }
          }
          return false;
        },
        /**
         * Get the duration of this sound. Passing a sound id will return the sprite duration.
         * @param  {Number} id The sound id to check. If none is passed, return full source duration.
         * @return {Number} Audio duration in seconds.
         */
        duration: function(id) {
          var self = this;
          var duration = self._duration;
          var sound = self._soundById(id);
          if (sound) {
            duration = self._sprite[sound._sprite][1] / 1e3;
          }
          return duration;
        },
        /**
         * Returns the current loaded state of this Howl.
         * @return {String} 'unloaded', 'loading', 'loaded'
         */
        state: function() {
          return this._state;
        },
        /**
         * Unload and destroy the current Howl object.
         * This will immediately stop all sound instances attached to this group.
         */
        unload: function() {
          var self = this;
          var sounds = self._sounds;
          for (var i = 0; i < sounds.length; i++) {
            if (!sounds[i]._paused) {
              self.stop(sounds[i]._id);
            }
            if (!self._webAudio) {
              self._clearSound(sounds[i]._node);
              sounds[i]._node.removeEventListener("error", sounds[i]._errorFn, false);
              sounds[i]._node.removeEventListener(Howler2._canPlayEvent, sounds[i]._loadFn, false);
              sounds[i]._node.removeEventListener("ended", sounds[i]._endFn, false);
              Howler2._releaseHtml5Audio(sounds[i]._node);
            }
            delete sounds[i]._node;
            self._clearTimer(sounds[i]._id);
          }
          var index = Howler2._howls.indexOf(self);
          if (index >= 0) {
            Howler2._howls.splice(index, 1);
          }
          var remCache = true;
          for (i = 0; i < Howler2._howls.length; i++) {
            if (Howler2._howls[i]._src === self._src || self._src.indexOf(Howler2._howls[i]._src) >= 0) {
              remCache = false;
              break;
            }
          }
          if (cache2 && remCache) {
            delete cache2[self._src];
          }
          Howler2.noAudio = false;
          self._state = "unloaded";
          self._sounds = [];
          self = null;
          return null;
        },
        /**
         * Listen to a custom event.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
         * @return {Howl}
         */
        on: function(event, fn, id, once) {
          var self = this;
          var events = self["_on" + event];
          if (typeof fn === "function") {
            events.push(once ? { id, fn, once } : { id, fn });
          }
          return self;
        },
        /**
         * Remove a custom event. Call without parameters to remove all events.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to remove. Leave empty to remove all.
         * @param  {Number}   id    (optional) Only remove events for this sound.
         * @return {Howl}
         */
        off: function(event, fn, id) {
          var self = this;
          var events = self["_on" + event];
          var i = 0;
          if (typeof fn === "number") {
            id = fn;
            fn = null;
          }
          if (fn || id) {
            for (i = 0; i < events.length; i++) {
              var isId = id === events[i].id;
              if (fn === events[i].fn && isId || !fn && isId) {
                events.splice(i, 1);
                break;
              }
            }
          } else if (event) {
            self["_on" + event] = [];
          } else {
            var keys = Object.keys(self);
            for (i = 0; i < keys.length; i++) {
              if (keys[i].indexOf("_on") === 0 && Array.isArray(self[keys[i]])) {
                self[keys[i]] = [];
              }
            }
          }
          return self;
        },
        /**
         * Listen to a custom event and remove it once fired.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @return {Howl}
         */
        once: function(event, fn, id) {
          var self = this;
          self.on(event, fn, id, 1);
          return self;
        },
        /**
         * Emit all events of a specific type and pass the sound id.
         * @param  {String} event Event name.
         * @param  {Number} id    Sound ID.
         * @param  {Number} msg   Message to go with event.
         * @return {Howl}
         */
        _emit: function(event, id, msg) {
          var self = this;
          var events = self["_on" + event];
          for (var i = events.length - 1; i >= 0; i--) {
            if (!events[i].id || events[i].id === id || event === "load") {
              setTimeout(function(fn) {
                fn.call(this, id, msg);
              }.bind(self, events[i].fn), 0);
              if (events[i].once) {
                self.off(event, events[i].fn, events[i].id);
              }
            }
          }
          self._loadQueue(event);
          return self;
        },
        /**
         * Queue of actions initiated before the sound has loaded.
         * These will be called in sequence, with the next only firing
         * after the previous has finished executing (even if async like play).
         * @return {Howl}
         */
        _loadQueue: function(event) {
          var self = this;
          if (self._queue.length > 0) {
            var task = self._queue[0];
            if (task.event === event) {
              self._queue.shift();
              self._loadQueue();
            }
            if (!event) {
              task.action();
            }
          }
          return self;
        },
        /**
         * Fired when playback ends at the end of the duration.
         * @param  {Sound} sound The sound object to work with.
         * @return {Howl}
         */
        _ended: function(sound) {
          var self = this;
          var sprite = sound._sprite;
          if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
            setTimeout(self._ended.bind(self, sound), 100);
            return self;
          }
          var loop = !!(sound._loop || self._sprite[sprite][2]);
          self._emit("end", sound._id);
          if (!self._webAudio && loop) {
            self.stop(sound._id, true).play(sound._id);
          }
          if (self._webAudio && loop) {
            self._emit("play", sound._id);
            sound._seek = sound._start || 0;
            sound._rateSeek = 0;
            sound._playStart = Howler2.ctx.currentTime;
            var timeout = (sound._stop - sound._start) * 1e3 / Math.abs(sound._rate);
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }
          if (self._webAudio && !loop) {
            sound._paused = true;
            sound._ended = true;
            sound._seek = sound._start || 0;
            sound._rateSeek = 0;
            self._clearTimer(sound._id);
            self._cleanBuffer(sound._node);
            Howler2._autoSuspend();
          }
          if (!self._webAudio && !loop) {
            self.stop(sound._id, true);
          }
          return self;
        },
        /**
         * Clear the end timer for a sound playback.
         * @param  {Number} id The sound ID.
         * @return {Howl}
         */
        _clearTimer: function(id) {
          var self = this;
          if (self._endTimers[id]) {
            if (typeof self._endTimers[id] !== "function") {
              clearTimeout(self._endTimers[id]);
            } else {
              var sound = self._soundById(id);
              if (sound && sound._node) {
                sound._node.removeEventListener("ended", self._endTimers[id], false);
              }
            }
            delete self._endTimers[id];
          }
          return self;
        },
        /**
         * Return the sound identified by this ID, or return null.
         * @param  {Number} id Sound ID
         * @return {Object}    Sound object or null.
         */
        _soundById: function(id) {
          var self = this;
          for (var i = 0; i < self._sounds.length; i++) {
            if (id === self._sounds[i]._id) {
              return self._sounds[i];
            }
          }
          return null;
        },
        /**
         * Return an inactive sound from the pool or create a new one.
         * @return {Sound} Sound playback object.
         */
        _inactiveSound: function() {
          var self = this;
          self._drain();
          for (var i = 0; i < self._sounds.length; i++) {
            if (self._sounds[i]._ended) {
              return self._sounds[i].reset();
            }
          }
          return new Sound2(self);
        },
        /**
         * Drain excess inactive sounds from the pool.
         */
        _drain: function() {
          var self = this;
          var limit = self._pool;
          var cnt = 0;
          var i = 0;
          if (self._sounds.length < limit) {
            return;
          }
          for (i = 0; i < self._sounds.length; i++) {
            if (self._sounds[i]._ended) {
              cnt++;
            }
          }
          for (i = self._sounds.length - 1; i >= 0; i--) {
            if (cnt <= limit) {
              return;
            }
            if (self._sounds[i]._ended) {
              if (self._webAudio && self._sounds[i]._node) {
                self._sounds[i]._node.disconnect(0);
              }
              self._sounds.splice(i, 1);
              cnt--;
            }
          }
        },
        /**
         * Get all ID's from the sounds pool.
         * @param  {Number} id Only return one ID if one is passed.
         * @return {Array}    Array of IDs.
         */
        _getSoundIds: function(id) {
          var self = this;
          if (typeof id === "undefined") {
            var ids = [];
            for (var i = 0; i < self._sounds.length; i++) {
              ids.push(self._sounds[i]._id);
            }
            return ids;
          } else {
            return [id];
          }
        },
        /**
         * Load the sound back into the buffer source.
         * @param  {Sound} sound The sound object to work with.
         * @return {Howl}
         */
        _refreshBuffer: function(sound) {
          var self = this;
          sound._node.bufferSource = Howler2.ctx.createBufferSource();
          sound._node.bufferSource.buffer = cache2[self._src];
          if (sound._panner) {
            sound._node.bufferSource.connect(sound._panner);
          } else {
            sound._node.bufferSource.connect(sound._node);
          }
          sound._node.bufferSource.loop = sound._loop;
          if (sound._loop) {
            sound._node.bufferSource.loopStart = sound._start || 0;
            sound._node.bufferSource.loopEnd = sound._stop || 0;
          }
          sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler2.ctx.currentTime);
          return self;
        },
        /**
         * Prevent memory leaks by cleaning up the buffer source after playback.
         * @param  {Object} node Sound's audio node containing the buffer source.
         * @return {Howl}
         */
        _cleanBuffer: function(node) {
          var self = this;
          var isIOS = Howler2._navigator && Howler2._navigator.vendor.indexOf("Apple") >= 0;
          if (!node.bufferSource) {
            return self;
          }
          if (Howler2._scratchBuffer && node.bufferSource) {
            node.bufferSource.onended = null;
            node.bufferSource.disconnect(0);
            if (isIOS) {
              try {
                node.bufferSource.buffer = Howler2._scratchBuffer;
              } catch (e) {
              }
            }
          }
          node.bufferSource = null;
          return self;
        },
        /**
         * Set the source to a 0-second silence to stop any downloading (except in IE).
         * @param  {Object} node Audio node to clear.
         */
        _clearSound: function(node) {
          var checkIE = /MSIE |Trident\//.test(Howler2._navigator && Howler2._navigator.userAgent);
          if (!checkIE) {
            node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
          }
        }
      };
      var Sound2 = function(howl) {
        this._parent = howl;
        this.init();
      };
      Sound2.prototype = {
        /**
         * Initialize a new Sound object.
         * @return {Sound}
         */
        init: function() {
          var self = this;
          var parent = self._parent;
          self._muted = parent._muted;
          self._loop = parent._loop;
          self._volume = parent._volume;
          self._rate = parent._rate;
          self._seek = 0;
          self._paused = true;
          self._ended = true;
          self._sprite = "__default";
          self._id = ++Howler2._counter;
          parent._sounds.push(self);
          self.create();
          return self;
        },
        /**
         * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
         * @return {Sound}
         */
        create: function() {
          var self = this;
          var parent = self._parent;
          var volume = Howler2._muted || self._muted || self._parent._muted ? 0 : self._volume;
          if (parent._webAudio) {
            self._node = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
            self._node.gain.setValueAtTime(volume, Howler2.ctx.currentTime);
            self._node.paused = true;
            self._node.connect(Howler2.masterGain);
          } else if (!Howler2.noAudio) {
            self._node = Howler2._obtainHtml5Audio();
            self._errorFn = self._errorListener.bind(self);
            self._node.addEventListener("error", self._errorFn, false);
            self._loadFn = self._loadListener.bind(self);
            self._node.addEventListener(Howler2._canPlayEvent, self._loadFn, false);
            self._endFn = self._endListener.bind(self);
            self._node.addEventListener("ended", self._endFn, false);
            self._node.src = parent._src;
            self._node.preload = parent._preload === true ? "auto" : parent._preload;
            self._node.volume = volume * Howler2.volume();
            self._node.load();
          }
          return self;
        },
        /**
         * Reset the parameters of this sound to the original state (for recycle).
         * @return {Sound}
         */
        reset: function() {
          var self = this;
          var parent = self._parent;
          self._muted = parent._muted;
          self._loop = parent._loop;
          self._volume = parent._volume;
          self._rate = parent._rate;
          self._seek = 0;
          self._rateSeek = 0;
          self._paused = true;
          self._ended = true;
          self._sprite = "__default";
          self._id = ++Howler2._counter;
          return self;
        },
        /**
         * HTML5 Audio error listener callback.
         */
        _errorListener: function() {
          var self = this;
          self._parent._emit("loaderror", self._id, self._node.error ? self._node.error.code : 0);
          self._node.removeEventListener("error", self._errorFn, false);
        },
        /**
         * HTML5 Audio canplaythrough listener callback.
         */
        _loadListener: function() {
          var self = this;
          var parent = self._parent;
          parent._duration = Math.ceil(self._node.duration * 10) / 10;
          if (Object.keys(parent._sprite).length === 0) {
            parent._sprite = { __default: [0, parent._duration * 1e3] };
          }
          if (parent._state !== "loaded") {
            parent._state = "loaded";
            parent._emit("load");
            parent._loadQueue();
          }
          self._node.removeEventListener(Howler2._canPlayEvent, self._loadFn, false);
        },
        /**
         * HTML5 Audio ended listener callback.
         */
        _endListener: function() {
          var self = this;
          var parent = self._parent;
          if (parent._duration === Infinity) {
            parent._duration = Math.ceil(self._node.duration * 10) / 10;
            if (parent._sprite.__default[1] === Infinity) {
              parent._sprite.__default[1] = parent._duration * 1e3;
            }
            parent._ended(self);
          }
          self._node.removeEventListener("ended", self._endFn, false);
        }
      };
      var cache2 = {};
      var loadBuffer = function(self) {
        var url = self._src;
        if (cache2[url]) {
          self._duration = cache2[url].duration;
          loadSound(self);
          return;
        }
        if (/^data:[^;]+;base64,/.test(url)) {
          var data = atob(url.split(",")[1]);
          var dataView = new Uint8Array(data.length);
          for (var i = 0; i < data.length; ++i) {
            dataView[i] = data.charCodeAt(i);
          }
          decodeAudioData(dataView.buffer, self);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open(self._xhr.method, url, true);
          xhr.withCredentials = self._xhr.withCredentials;
          xhr.responseType = "arraybuffer";
          if (self._xhr.headers) {
            Object.keys(self._xhr.headers).forEach(function(key) {
              xhr.setRequestHeader(key, self._xhr.headers[key]);
            });
          }
          xhr.onload = function() {
            var code = (xhr.status + "")[0];
            if (code !== "0" && code !== "2" && code !== "3") {
              self._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
              return;
            }
            decodeAudioData(xhr.response, self);
          };
          xhr.onerror = function() {
            if (self._webAudio) {
              self._html5 = true;
              self._webAudio = false;
              self._sounds = [];
              delete cache2[url];
              self.load();
            }
          };
          safeXhrSend(xhr);
        }
      };
      var safeXhrSend = function(xhr) {
        try {
          xhr.send();
        } catch (e) {
          xhr.onerror();
        }
      };
      var decodeAudioData = function(arraybuffer, self) {
        var error = function() {
          self._emit("loaderror", null, "Decoding audio data failed.");
        };
        var success = function(buffer) {
          if (buffer && self._sounds.length > 0) {
            cache2[self._src] = buffer;
            loadSound(self, buffer);
          } else {
            error();
          }
        };
        if (typeof Promise !== "undefined" && Howler2.ctx.decodeAudioData.length === 1) {
          Howler2.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
        } else {
          Howler2.ctx.decodeAudioData(arraybuffer, success, error);
        }
      };
      var loadSound = function(self, buffer) {
        if (buffer && !self._duration) {
          self._duration = buffer.duration;
        }
        if (Object.keys(self._sprite).length === 0) {
          self._sprite = { __default: [0, self._duration * 1e3] };
        }
        if (self._state !== "loaded") {
          self._state = "loaded";
          self._emit("load");
          self._loadQueue();
        }
      };
      var setupAudioContext = function() {
        if (!Howler2.usingWebAudio) {
          return;
        }
        try {
          if (typeof AudioContext !== "undefined") {
            Howler2.ctx = new AudioContext();
          } else if (typeof webkitAudioContext !== "undefined") {
            Howler2.ctx = new webkitAudioContext();
          } else {
            Howler2.usingWebAudio = false;
          }
        } catch (e) {
          Howler2.usingWebAudio = false;
        }
        if (!Howler2.ctx) {
          Howler2.usingWebAudio = false;
        }
        var iOS = /iP(hone|od|ad)/.test(Howler2._navigator && Howler2._navigator.platform);
        var appVersion = Howler2._navigator && Howler2._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
        var version = appVersion ? parseInt(appVersion[1], 10) : null;
        if (iOS && version && version < 9) {
          var safari = /safari/.test(Howler2._navigator && Howler2._navigator.userAgent.toLowerCase());
          if (Howler2._navigator && !safari) {
            Howler2.usingWebAudio = false;
          }
        }
        if (Howler2.usingWebAudio) {
          Howler2.masterGain = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
          Howler2.masterGain.gain.setValueAtTime(Howler2._muted ? 0 : Howler2._volume, Howler2.ctx.currentTime);
          Howler2.masterGain.connect(Howler2.ctx.destination);
        }
        Howler2._setup();
      };
      if (typeof define === "function" && define.amd) {
        define([], function() {
          return {
            Howler: Howler2,
            Howl: Howl3
          };
        });
      }
      if (typeof exports !== "undefined") {
        exports.Howler = Howler2;
        exports.Howl = Howl3;
      }
      if (typeof global !== "undefined") {
        global.HowlerGlobal = HowlerGlobal2;
        global.Howler = Howler2;
        global.Howl = Howl3;
        global.Sound = Sound2;
      } else if (typeof window !== "undefined") {
        window.HowlerGlobal = HowlerGlobal2;
        window.Howler = Howler2;
        window.Howl = Howl3;
        window.Sound = Sound2;
      }
    })();
    (function() {
      "use strict";
      HowlerGlobal.prototype._pos = [0, 0, 0];
      HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
      HowlerGlobal.prototype.stereo = function(pan) {
        var self = this;
        if (!self.ctx || !self.ctx.listener) {
          return self;
        }
        for (var i = self._howls.length - 1; i >= 0; i--) {
          self._howls[i].stereo(pan);
        }
        return self;
      };
      HowlerGlobal.prototype.pos = function(x, y, z) {
        var self = this;
        if (!self.ctx || !self.ctx.listener) {
          return self;
        }
        y = typeof y !== "number" ? self._pos[1] : y;
        z = typeof z !== "number" ? self._pos[2] : z;
        if (typeof x === "number") {
          self._pos = [x, y, z];
          if (typeof self.ctx.listener.positionX !== "undefined") {
            self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
            self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
            self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
          } else {
            self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
          }
        } else {
          return self._pos;
        }
        return self;
      };
      HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
        var self = this;
        if (!self.ctx || !self.ctx.listener) {
          return self;
        }
        var or = self._orientation;
        y = typeof y !== "number" ? or[1] : y;
        z = typeof z !== "number" ? or[2] : z;
        xUp = typeof xUp !== "number" ? or[3] : xUp;
        yUp = typeof yUp !== "number" ? or[4] : yUp;
        zUp = typeof zUp !== "number" ? or[5] : zUp;
        if (typeof x === "number") {
          self._orientation = [x, y, z, xUp, yUp, zUp];
          if (typeof self.ctx.listener.forwardX !== "undefined") {
            self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
          } else {
            self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
          }
        } else {
          return or;
        }
        return self;
      };
      Howl.prototype.init = /* @__PURE__ */ (function(_super) {
        return function(o) {
          var self = this;
          self._orientation = o.orientation || [1, 0, 0];
          self._stereo = o.stereo || null;
          self._pos = o.pos || null;
          self._pannerAttr = {
            coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
            coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
            coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
            distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
            maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
            panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
            refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
            rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
          };
          self._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
          self._onpos = o.onpos ? [{ fn: o.onpos }] : [];
          self._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
          return _super.call(this, o);
        };
      })(Howl.prototype.init);
      Howl.prototype.stereo = function(pan, id) {
        var self = this;
        if (!self._webAudio) {
          return self;
        }
        if (self._state !== "loaded") {
          self._queue.push({
            event: "stereo",
            action: function() {
              self.stereo(pan, id);
            }
          });
          return self;
        }
        var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
        if (typeof id === "undefined") {
          if (typeof pan === "number") {
            self._stereo = pan;
            self._pos = [pan, 0, 0];
          } else {
            return self._stereo;
          }
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self._soundById(ids[i]);
          if (sound) {
            if (typeof pan === "number") {
              sound._stereo = pan;
              sound._pos = [pan, 0, 0];
              if (sound._node) {
                sound._pannerAttr.panningModel = "equalpower";
                if (!sound._panner || !sound._panner.pan) {
                  setupPanner(sound, pannerType);
                }
                if (pannerType === "spatial") {
                  if (typeof sound._panner.positionX !== "undefined") {
                    sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                    sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                    sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setPosition(pan, 0, 0);
                  }
                } else {
                  sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
                }
              }
              self._emit("stereo", sound._id);
            } else {
              return sound._stereo;
            }
          }
        }
        return self;
      };
      Howl.prototype.pos = function(x, y, z, id) {
        var self = this;
        if (!self._webAudio) {
          return self;
        }
        if (self._state !== "loaded") {
          self._queue.push({
            event: "pos",
            action: function() {
              self.pos(x, y, z, id);
            }
          });
          return self;
        }
        y = typeof y !== "number" ? 0 : y;
        z = typeof z !== "number" ? -0.5 : z;
        if (typeof id === "undefined") {
          if (typeof x === "number") {
            self._pos = [x, y, z];
          } else {
            return self._pos;
          }
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self._soundById(ids[i]);
          if (sound) {
            if (typeof x === "number") {
              sound._pos = [x, y, z];
              if (sound._node) {
                if (!sound._panner || sound._panner.pan) {
                  setupPanner(sound, "spatial");
                }
                if (typeof sound._panner.positionX !== "undefined") {
                  sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
                  sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
                  sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
                } else {
                  sound._panner.setPosition(x, y, z);
                }
              }
              self._emit("pos", sound._id);
            } else {
              return sound._pos;
            }
          }
        }
        return self;
      };
      Howl.prototype.orientation = function(x, y, z, id) {
        var self = this;
        if (!self._webAudio) {
          return self;
        }
        if (self._state !== "loaded") {
          self._queue.push({
            event: "orientation",
            action: function() {
              self.orientation(x, y, z, id);
            }
          });
          return self;
        }
        y = typeof y !== "number" ? self._orientation[1] : y;
        z = typeof z !== "number" ? self._orientation[2] : z;
        if (typeof id === "undefined") {
          if (typeof x === "number") {
            self._orientation = [x, y, z];
          } else {
            return self._orientation;
          }
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self._soundById(ids[i]);
          if (sound) {
            if (typeof x === "number") {
              sound._orientation = [x, y, z];
              if (sound._node) {
                if (!sound._panner) {
                  if (!sound._pos) {
                    sound._pos = self._pos || [0, 0, -0.5];
                  }
                  setupPanner(sound, "spatial");
                }
                if (typeof sound._panner.orientationX !== "undefined") {
                  sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
                  sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
                  sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
                } else {
                  sound._panner.setOrientation(x, y, z);
                }
              }
              self._emit("orientation", sound._id);
            } else {
              return sound._orientation;
            }
          }
        }
        return self;
      };
      Howl.prototype.pannerAttr = function() {
        var self = this;
        var args = arguments;
        var o, id, sound;
        if (!self._webAudio) {
          return self;
        }
        if (args.length === 0) {
          return self._pannerAttr;
        } else if (args.length === 1) {
          if (typeof args[0] === "object") {
            o = args[0];
            if (typeof id === "undefined") {
              if (!o.pannerAttr) {
                o.pannerAttr = {
                  coneInnerAngle: o.coneInnerAngle,
                  coneOuterAngle: o.coneOuterAngle,
                  coneOuterGain: o.coneOuterGain,
                  distanceModel: o.distanceModel,
                  maxDistance: o.maxDistance,
                  refDistance: o.refDistance,
                  rolloffFactor: o.rolloffFactor,
                  panningModel: o.panningModel
                };
              }
              self._pannerAttr = {
                coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
                coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
                coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
                distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self._distanceModel,
                maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self._maxDistance,
                refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self._refDistance,
                rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
                panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self._panningModel
              };
            }
          } else {
            sound = self._soundById(parseInt(args[0], 10));
            return sound ? sound._pannerAttr : self._pannerAttr;
          }
        } else if (args.length === 2) {
          o = args[0];
          id = parseInt(args[1], 10);
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          sound = self._soundById(ids[i]);
          if (sound) {
            var pa = sound._pannerAttr;
            pa = {
              coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
              coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
              coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
              distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
              maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
              refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
              rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
              panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
            };
            var panner = sound._panner;
            if (!panner) {
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }
              setupPanner(sound, "spatial");
              panner = sound._panner;
            }
            panner.coneInnerAngle = pa.coneInnerAngle;
            panner.coneOuterAngle = pa.coneOuterAngle;
            panner.coneOuterGain = pa.coneOuterGain;
            panner.distanceModel = pa.distanceModel;
            panner.maxDistance = pa.maxDistance;
            panner.refDistance = pa.refDistance;
            panner.rolloffFactor = pa.rolloffFactor;
            panner.panningModel = pa.panningModel;
          }
        }
        return self;
      };
      Sound.prototype.init = /* @__PURE__ */ (function(_super) {
        return function() {
          var self = this;
          var parent = self._parent;
          self._orientation = parent._orientation;
          self._stereo = parent._stereo;
          self._pos = parent._pos;
          self._pannerAttr = parent._pannerAttr;
          _super.call(this);
          if (self._stereo) {
            parent.stereo(self._stereo);
          } else if (self._pos) {
            parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
          }
        };
      })(Sound.prototype.init);
      Sound.prototype.reset = /* @__PURE__ */ (function(_super) {
        return function() {
          var self = this;
          var parent = self._parent;
          self._orientation = parent._orientation;
          self._stereo = parent._stereo;
          self._pos = parent._pos;
          self._pannerAttr = parent._pannerAttr;
          if (self._stereo) {
            parent.stereo(self._stereo);
          } else if (self._pos) {
            parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
          } else if (self._panner) {
            self._panner.disconnect(0);
            self._panner = void 0;
            parent._refreshBuffer(self);
          }
          return _super.call(this);
        };
      })(Sound.prototype.reset);
      var setupPanner = function(sound, type) {
        type = type || "spatial";
        if (type === "spatial") {
          sound._panner = Howler.ctx.createPanner();
          sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
          sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
          sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
          sound._panner.distanceModel = sound._pannerAttr.distanceModel;
          sound._panner.maxDistance = sound._pannerAttr.maxDistance;
          sound._panner.refDistance = sound._pannerAttr.refDistance;
          sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
          sound._panner.panningModel = sound._pannerAttr.panningModel;
          if (typeof sound._panner.positionX !== "undefined") {
            sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
            sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
            sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
          } else {
            sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
          }
          if (typeof sound._panner.orientationX !== "undefined") {
            sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
            sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
            sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
          } else {
            sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
          }
        } else {
          sound._panner = Howler.ctx.createStereoPanner();
          sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
        }
        sound._panner.connect(sound._node);
        if (!sound._paused) {
          sound._parent.pause(sound._id, true).play(sound._id, true);
        }
      };
    })();
  }
});

// public/20260316090519_f1625a99-d204-4345-bc98-df5afd09de5f/app.ts
async function initApp() {
  const app = new ITHistoryApp();
  await app.initialize();
}
var import_howler, Particle, ITHistoryApp;
var init_app = __esm({
  "public/20260316090519_f1625a99-d204-4345-bc98-df5afd09de5f/app.ts"() {
    init_appHelper();
    init_gsap();
    import_howler = __toESM(require_howler());
    Particle = class {
      // 배경 입자의 초기 위치, 속도 및 색상을 설정 (초록색 계열로 단일화하여 시각적 복잡도 감소)
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2.5 + 0.5;
        this.color = "rgba(0, 255, 212, 0.6)";
        this.pulse = Math.random() * Math.PI;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }
      update(w, h) {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw(ctx) {
        const opacity = 0.3 + Math.sin(this.pulse) * 0.3;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace("0.6", opacity.toString());
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    };
    ITHistoryApp = class {
      constructor() {
        // 메인 연표 배경 장식용 별자리 카드의 위치/애니메이션 설정 데이터 배열
        this.constellationDecorData = [];
        // 메인 연표의 빈 공간에 배치되는 은은한 별자리 정보 카드 DOM 배열
        this.constellationDecorNodes = [];
        // 메인 연표 화면의 사건 검색 버튼 엘리먼트 참조
        this.searchButtonElement = null;
        // 메인 연표에서 'AWS 클라우드 출시' 카드의 인덱스 (AWS 특수 효과 적용 대상)
        this.awsCardIndex = -1;
        // 메인 연표에서 '유튜브 창립' 카드의 인덱스 (유튜브 특수 효과 적용 대상)
        this.youtubeCardIndex = -1;
        // 메인 연표에서 '아이폰 공개' 카드의 인덱스 (애플 특수 효과 적용 대상)
        this.iphoneCardIndex = -1;
        // 은하계 시각 효과 적용 대상 이벤트 인덱스 배열 (GPT-1 발표, 이세돌 바둑)
        this.galaxyIndices = [];
        // 기업 창립 이벤트 카드들의 인덱스 및 시각 효과 설정 배열 (특수 시각 효과 적용 대상)
        this.msFoundationIndex = [];
        // 산업 트렌드를 바꾼 초대형 사건들의 인덱스 배열 (AI가 선별한 '제우스 번개' 대상)
        this.lightningIndices = [];
        // 2024년 3월 할루시네이션 감소 전환점 시각화 효과를 위한 별자리 구성 데이터
        this.reductionConstellationStars = [];
        // 메인 연표상에 배치될 개별 할루시네이션 사례 노드 배열
        this.hallucinationCaseNodes = [];
        // 메인 연표상에 배치될 할루시네이션 감소 흐름 연도별 카드 배열
        this.hallucinationTimelineCards = [];
        // AI 패권 변화 시기별 순위 카드를 담는 엘리먼트 배열
        this.hegemonyCards = [];
        // 각 이벤트 카드의 필터링 상태 (애니메이션용)
        this.eventFilterStates = [];
        // AI 기술 발전 필터 활성화 여부
        this.isAiFilterActive = false;
        // 미지의 미래 영역을 상징하는 포털 애니메이션 회전 각도
        this.portalAngle = 0;
        // 레이아웃 레이블 엘리먼트 배열
        this.rowLabelElements = [];
        // 사운드 인스턴스 맵
        this.sounds = /* @__PURE__ */ new Map();
        // 배경 파티클 배열
        this.particles = [];
        // 현재 화면 상태
        this.currentScreen = "title";
        // 현재 스크롤 위치
        this.scrollX = 0;
        // 목표 스크롤 위치 (보간용)
        this.targetScrollX = 0;
        // 드래그 상태 플래그
        this.isDragging = false;
        // 마지막 마우스 X 좌표
        this.lastMouseX = 0;
        // 이벤트 노드 물리 좌표 배열
        this.eventNodePositions = [];
        this.canvas = document.getElementById("appCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.uiLayer = document.getElementById("uiLayer");
      }
      // 메인 연표의 비어 있는 공간에 은은한 별자리 정보 카드와 장식 클러스터를 생성
      createConstellationDecorations() {
        const wrapper = document.getElementById("timeline-wrapper");
        if (!wrapper) return;
        this.constellationDecorNodes = [];
        this.constellationDecorData = [];
        const facts = this.appData.constellationFacts || [];
        if (facts.length === 0) return;
        const placements = [
          { baseX: 2450, baseY: 170, drift: 18, phase: 0.3 },
          { baseX: 5850, baseY: 860, drift: 22, phase: 1.4 },
          { baseX: 9350, baseY: 190, drift: 20, phase: 2.1 },
          { baseX: 13250, baseY: 850, drift: 17, phase: 3.2 },
          { baseX: 17150, baseY: 210, drift: 21, phase: 4.1 },
          { baseX: 20950, baseY: 845, drift: 19, phase: 5 }
        ];
        facts.slice(0, placements.length).forEach((fact, idx) => {
          const placement = placements[idx];
          const accent = fact.accent || "rgba(155, 210, 255, 0.85)";
          const card = AppHelper.createUIElement(
            "div",
            `constellation-decor-card-${idx}`,
            {
              position: "absolute",
              left: "0%",
              top: "0%",
              width: "220px",
              minHeight: "92px",
              padding: "14px 16px 14px 16px",
              backgroundColor: "rgba(7, 15, 28, 0.34)",
              border: "1px solid rgba(160, 210, 255, 0.14)",
              borderRadius: "16px",
              color: "rgba(255,255,255,0.78)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
              pointerEvents: "none",
              zIndex: "4",
              boxSizing: "border-box",
              overflow: "hidden",
              transition: "opacity 0.25s ease"
            },
            ""
          );
          const glow = AppHelper.createUIElement("div", "", {
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "70%",
            height: "80%",
            background: `radial-gradient(circle, ${accent.replace("0.85", "0.14")}, transparent 70%)`,
            opacity: "0.9",
            pointerEvents: "none",
            boxSizing: "border-box"
          });
          const overline = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "10px",
              fontWeight: "900",
              letterSpacing: "2px",
              color: "rgba(170, 215, 255, 0.72)",
              marginBottom: "7px",
              textTransform: "uppercase",
              pointerEvents: "none",
              boxSizing: "border-box"
            },
            "CONSTELLATION NOTE"
          );
          const title = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "13px",
              fontWeight: "900",
              color: "#dff6ff",
              marginBottom: "6px",
              lineHeight: "1.35",
              pointerEvents: "none",
              boxSizing: "border-box"
            },
            fact.title
          );
          const body = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "12px",
              lineHeight: "1.5",
              color: "rgba(255,255,255,0.62)",
              pointerEvents: "none",
              boxSizing: "border-box"
            },
            fact.body
          );
          const starBadge = AppHelper.createUIElement(
            "div",
            "",
            {
              position: "absolute",
              top: "10px",
              right: "12px",
              fontSize: "12px",
              color: "rgba(220,245,255,0.55)",
              pointerEvents: "none",
              boxSizing: "border-box"
            },
            "\u2726"
          );
          card.appendChild(glow);
          card.appendChild(overline);
          card.appendChild(title);
          card.appendChild(body);
          card.appendChild(starBadge);
          wrapper.appendChild(card);
          this.constellationDecorNodes.push(card);
          const cluster = [
            { x: -56, y: 18, s: 1.8 },
            { x: -18, y: -6, s: 2.2 },
            { x: 16, y: 14, s: 1.7 },
            { x: 54, y: -10, s: 2 },
            { x: 86, y: 16, s: 1.4 },
            { x: 122, y: -4, s: 1.9 },
            { x: 146, y: 24, s: 1.3 }
          ];
          const links = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [2, 5],
            [5, 6]
          ];
          this.constellationDecorData.push({
            baseX: placement.baseX,
            baseY: placement.baseY,
            drift: placement.drift,
            phase: placement.phase,
            cluster,
            links
          });
        });
      }
      // 메인 연표 화면용 사건 검색 오버레이를 열고 검색 결과 카드로 이동
      openTimelineSearch() {
        const existing = document.getElementById("timeline-search-overlay");
        if (existing) {
          existing.remove();
        }
        const overlay = AppHelper.createUIElement(
          "div",
          "timeline-search-overlay",
          {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(2, 8, 18, 0.72)",
            backdropFilter: "blur(14px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "12%",
            zIndex: "2100",
            pointerEvents: "auto",
            boxSizing: "border-box"
          },
          "",
          [
            {
              event: "click",
              handler: (e) => {
                if (e.target === overlay) {
                  this.playSound("click");
                  overlay.remove();
                }
              }
            },
            { event: "wheel", handler: (e) => e.stopPropagation() },
            { event: "pointerdown", handler: (e) => e.stopPropagation() },
            { event: "pointermove", handler: (e) => e.stopPropagation() }
          ]
        );
        const modal = AppHelper.createUIElement("div", "", {
          width: "440px",
          maxWidth: "90%",
          padding: "22px 22px 18px 22px",
          backgroundColor: "rgba(8, 18, 32, 0.96)",
          border: "1px solid rgba(0, 255, 212, 0.45)",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.45), 0 0 24px rgba(0,255,212,0.18)",
          pointerEvents: "auto",
          boxSizing: "border-box"
        });
        const title = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "18px",
            fontWeight: "900",
            color: "#00ffd4",
            marginBottom: "14px",
            letterSpacing: "1px"
          },
          this.textData.mainSearchTitle
        );
        const input = AppHelper.createUIElement("input", "timeline-search-input", {
          width: "100%",
          height: "50px",
          padding: "0 16px",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "12px",
          color: "#ffffff",
          fontSize: "16px",
          outline: "none",
          pointerEvents: "auto",
          boxSizing: "border-box"
        });
        input.placeholder = this.textData.mainSearchPlaceholder;
        const feedback = AppHelper.createUIElement("div", "", {
          minHeight: "20px",
          marginTop: "10px",
          fontSize: "13px",
          color: "rgba(255,255,255,0.72)",
          boxSizing: "border-box"
        });
        const closeRow = AppHelper.createUIElement("div", "", {
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "14px"
        });
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            padding: "10px 18px",
            backgroundColor: "transparent",
            color: "#00ffd4",
            border: "1px solid rgba(0,255,212,0.5)",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            pointerEvents: "auto",
            boxSizing: "border-box"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                overlay.remove();
              }
            }
          ]
        );
        const executeSearch = () => {
          const keyword = input.value.trim();
          if (!keyword) {
            feedback.textContent = this.textData.mainSearchEmpty;
            feedback.style.color = "#ffcc00";
            return;
          }
          const normalizedKeyword = keyword.toLowerCase();
          const matchIndex = this.appData.events.findIndex((event, idx) => {
            const el = document.getElementById(`event-${idx}`);
            if (!el) return false;
            const combined = `${event.title} ${event.description}`.toLowerCase();
            return combined.includes(normalizedKeyword);
          });
          if (matchIndex < 0) {
            feedback.textContent = this.textData.mainSearchNotFound;
            feedback.style.color = "#ff5e3a";
            return;
          }
          this.playSound("click");
          const pos = this.eventNodePositions[matchIndex];
          if (pos) {
            this.targetScrollX = -(pos.x - this.canvas.width / 2);
          }
          const targetCard = document.getElementById(`event-${matchIndex}`);
          if (targetCard) {
            setTimeout(() => {
              this.triggerSparkle(targetCard, "#00ffd4");
            }, 450);
          }
          overlay.remove();
        };
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            executeSearch();
          } else if (e.key === "Escape") {
            this.playSound("click");
            overlay.remove();
          }
        });
        closeRow.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(input);
        modal.appendChild(feedback);
        modal.appendChild(closeRow);
        overlay.appendChild(modal);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(modal, { opacity: 0, y: -10, scale: 0.96, duration: 0.25, ease: "power2.out" });
        setTimeout(() => {
          input.focus();
        }, 30);
      }
      // 메인 연표의 'AWS 클라우드 출시' 카드에 적용되는 AWS 브랜드 특수 시각 효과 렌더링 (오렌지 스마일, 클라우드 네트워크, 서버 인프라 글로우)
      drawAWSEffect(ctx, x, y) {
        const time = Date.now() * 1e-3;
        ctx.save();
        ctx.translate(x, y);
        const awsOrange = { r: 255, g: 153, b: 0 };
        const awsNavy = { r: 35, g: 47, b: 62 };
        const awsBlue = { r: 20, g: 110, b: 180 };
        const awsLight = { r: 254, g: 189, b: 105 };
        for (let aura = 0; aura < 6; aura++) {
          const radius = 210 + aura * 38 + Math.sin(time * 1.1 + aura * 0.7) * 10;
          const alpha = 0.07 - aura * 9e-3;
          const grad = ctx.createRadialGradient(0, 0, radius * 0.08, 0, 0, radius);
          grad.addColorStop(0, `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, ${alpha + 0.03})`);
          grad.addColorStop(0.3, `rgba(${awsLight.r}, ${awsLight.g}, ${awsLight.b}, ${alpha})`);
          grad.addColorStop(0.62, `rgba(${awsBlue.r}, ${awsBlue.g}, ${awsBlue.b}, ${alpha * 0.65})`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        const towerXs = [-130, -75, -20, 40, 95];
        towerXs.forEach((tx, idx) => {
          const maxH = 90 + idx * 10 + Math.sin(time * 1.4 + idx) * 8;
          const width = idx % 2 === 0 ? 34 : 42;
          const topY = 52 - maxH;
          const bodyGrad = ctx.createLinearGradient(tx, topY, tx + width, 52);
          bodyGrad.addColorStop(0, `rgba(${awsBlue.r}, ${awsBlue.g}, ${awsBlue.b}, 0.28)`);
          bodyGrad.addColorStop(0.5, `rgba(${awsNavy.r}, ${awsNavy.g}, ${awsNavy.b}, 0.65)`);
          bodyGrad.addColorStop(1, `rgba(${awsNavy.r}, ${awsNavy.g}, ${awsNavy.b}, 0.18)`);
          ctx.fillStyle = bodyGrad;
          ctx.strokeStyle = `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, ${0.22 + Math.sin(time * 2 + idx) * 0.07})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(tx, topY, width, maxH, [5, 5, 0, 0]);
          ctx.fill();
          ctx.stroke();
          for (let r = 0; r < 5; r++) {
            const yy = topY + 10 + r * 14;
            const pulse = 0.25 + Math.sin(time * 3 + idx * 0.8 + r * 0.6) * 0.18;
            ctx.fillStyle = `rgba(${awsLight.r}, ${awsLight.g}, ${awsLight.b}, ${pulse})`;
            ctx.fillRect(tx + 6, yy, width - 12, 3);
          }
        });
        const logoY = -112 + Math.sin(time * 1.6) * 5;
        ctx.save();
        ctx.translate(0, logoY);
        ctx.scale(1.02 + Math.sin(time * 2.8) * 0.04, 1.02 + Math.sin(time * 2.8) * 0.04);
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(255,153,0,0.45)";
        ctx.fillStyle = "rgba(255,255,255,0.96)";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("aws", 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, 0.95)`;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.arc(2, 10, 28, 0.18 * Math.PI, 0.88 * Math.PI, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(24, 30);
        ctx.lineTo(35, 26);
        ctx.lineTo(29, 18);
        ctx.strokeStyle = `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, 0.95)`;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
        const cloudPulse = 1 + Math.sin(time * 2.2) * 0.05;
        ctx.save();
        ctx.translate(0, -10);
        ctx.scale(cloudPulse, cloudPulse);
        const cloudGlow = ctx.createRadialGradient(0, 0, 20, 0, 0, 140);
        cloudGlow.addColorStop(0, "rgba(255,255,255,0.22)");
        cloudGlow.addColorStop(0.4, "rgba(255,153,0,0.12)");
        cloudGlow.addColorStop(1, "transparent");
        ctx.fillStyle = cloudGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 140, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(245, 248, 252, 0.95)";
        ctx.strokeStyle = `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, 0.9)`;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 28;
        ctx.shadowColor = "rgba(255,153,0,0.4)";
        ctx.beginPath();
        ctx.arc(-30, 4, 24, Math.PI * 0.9, Math.PI * 1.95);
        ctx.arc(-6, -7, 30, Math.PI * 1, Math.PI * 1.95);
        ctx.arc(28, 2, 22, Math.PI * 1.1, Math.PI * 1.95);
        ctx.roundRect(-62, 2, 124, 34, 16);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
        const nodes = [
          { x: -34, y: 6 },
          { x: -4, y: -4 },
          { x: 28, y: 5 },
          { x: -15, y: 18 },
          { x: 14, y: 18 }
        ];
        ctx.save();
        ctx.translate(0, -8);
        ctx.strokeStyle = "rgba(20,110,180,0.45)";
        ctx.lineWidth = 1.6;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (dist < 42) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
        nodes.forEach((n, idx) => {
          const alpha = 0.55 + Math.sin(time * 3.5 + idx) * 0.2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 3.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, ${alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, 0.8)`;
          ctx.fill();
        });
        ctx.shadowBlur = 0;
        ctx.restore();
        for (let ring = 0; ring < 4; ring++) {
          ctx.save();
          ctx.rotate(time * (0.35 + ring * 0.08) * (ring % 2 === 0 ? 1 : -1));
          ctx.strokeStyle = ring % 2 === 0 ? `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, ${0.18 + Math.sin(time * 2 + ring) * 0.06})` : `rgba(${awsBlue.r}, ${awsBlue.g}, ${awsBlue.b}, ${0.16 + Math.sin(time * 1.7 + ring) * 0.05})`;
          ctx.lineWidth = 1.3 + ring * 0.2;
          ctx.setLineDash([18 + ring * 6, 16 + ring * 7]);
          ctx.beginPath();
          ctx.ellipse(0, 4, 150 - ring * 18, 86 - ring * 10, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        for (let p = 0; p < 18; p++) {
          const lane = p % 6 - 2.5;
          const px2 = lane * 22 + Math.sin(time * 1.6 + p) * 4;
          const travel = (time * 60 + p * 18) % 220 - 110;
          const py = travel;
          const alpha = 0.18 + (1 - Math.min(1, Math.abs(py) / 120)) * 0.42;
          ctx.fillStyle = p % 2 === 0 ? `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, ${alpha})` : `rgba(255,255,255,${alpha * 0.8})`;
          ctx.beginPath();
          ctx.roundRect(px2 - 3, py - 6, 6, 12, 2);
          ctx.fill();
        }
        const serviceLabels = ["EC2", "S3", "Lambda", "AI", "DB"];
        for (let i = 0; i < 5; i++) {
          const angle = time * 0.28 + i / 5 * Math.PI * 2;
          const dist = 122 + Math.sin(time * 1.2 + i) * 16;
          const sx = Math.cos(angle) * dist;
          const sy = Math.sin(angle) * dist * 0.58;
          const alpha = 0.3 + Math.sin(time * 2 + i) * 0.12;
          ctx.fillStyle = `rgba(${awsNavy.r}, ${awsNavy.g}, ${awsNavy.b}, 0.92)`;
          ctx.strokeStyle = `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, ${alpha + 0.25})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(sx - 22, sy - 11, 44, 22, 8);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = `rgba(255,255,255,${alpha + 0.45})`;
          ctx.font = "bold 8px Arial";
          ctx.textAlign = "center";
          ctx.fillText(serviceLabels[i], sx, sy + 3);
        }
        ctx.save();
        ctx.translate(0, 72);
        ctx.strokeStyle = `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, 0.9)`;
        ctx.lineWidth = 4.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-78, 0);
        ctx.quadraticCurveTo(0, 40 + Math.sin(time * 2.5) * 4, 78, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(62, 5);
        ctx.lineTo(77, 0);
        ctx.lineTo(69, -10);
        ctx.stroke();
        ctx.restore();
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255,153,0,0.55)";
        ctx.fillStyle = "rgba(255,255,255,0.96)";
        ctx.font = "bold 17px Arial";
        ctx.textAlign = "center";
        ctx.fillText("CLOUD INFRA REVOLUTION", 0, 118);
        ctx.shadowBlur = 6;
        ctx.fillStyle = `rgba(${awsLight.r}, ${awsLight.g}, ${awsLight.b}, 0.92)`;
        ctx.font = "12px Arial";
        ctx.fillText("2006.03.14 \u2014 AWS LAUNCHED", 0, 136);
        for (let s = 0; s < 24; s++) {
          const ang = time * (0.55 + s * 0.015) + s * 0.47;
          const dist = 70 + Math.sin(time * 2.1 + s) * 58;
          const px2 = Math.cos(ang) * dist;
          const py = Math.sin(ang) * dist * 0.72;
          const size = 0.8 + Math.abs(Math.sin(time * 3 + s)) * 1.3;
          const alpha = 0.22 + Math.sin(time * 2.4 + s) * 0.16;
          ctx.beginPath();
          ctx.arc(px2, py, size, 0, Math.PI * 2);
          ctx.fillStyle = s % 3 === 0 ? `rgba(${awsOrange.r}, ${awsOrange.g}, ${awsOrange.b}, ${alpha})` : s % 3 === 1 ? `rgba(${awsLight.r}, ${awsLight.g}, ${awsLight.b}, ${alpha})` : `rgba(255,255,255,${alpha})`;
          ctx.fill();
        }
        ctx.restore();
      }
      // 메인 연표의 '유튜브 창립' 카드에 적용되는 화려한 유튜브 특수 시각 효과 렌더링 (재생 버튼, 로고, 동영상 재생 애니메이션, 구독자 카운터, 댓글 스트림, 트렌딩 불꽃)
      drawYouTubeEffect(ctx, x, y) {
        const time = Date.now() * 1e-3;
        ctx.save();
        ctx.translate(x, y);
        const pulse = 1 + Math.sin(time * 2.4) * 0.04;
        for (let aura = 0; aura < 8; aura++) {
          const auraR = 220 + aura * 40 + Math.sin(time * 1.2 + aura * 0.75) * 14;
          const auraGrad = ctx.createRadialGradient(0, 0, auraR * 0.08, 0, 0, auraR);
          const alpha = 0.085 - aura * 8e-3;
          auraGrad.addColorStop(0, `rgba(255, 0, 0, ${alpha + 0.05})`);
          auraGrad.addColorStop(0.25, `rgba(255, 35, 35, ${alpha + 0.02})`);
          auraGrad.addColorStop(0.55, `rgba(255, 80, 80, ${alpha * 0.7})`);
          auraGrad.addColorStop(0.82, `rgba(255, 0, 0, ${alpha * 0.35})`);
          auraGrad.addColorStop(1, "transparent");
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, auraR, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let ray = 0; ray < 18; ray++) {
          const rayAngle = ray / 18 * Math.PI * 2 + time * 0.18;
          const rayLen = 250 + Math.sin(time * 1.7 + ray * 0.6) * 45;
          const rayW = 4 + Math.sin(time * 3 + ray * 0.7) * 1.5;
          const rayAlpha = 0.035 + Math.sin(time * 2.2 + ray) * 0.015;
          const grad = ctx.createLinearGradient(0, 0, Math.cos(rayAngle) * rayLen, Math.sin(rayAngle) * rayLen);
          grad.addColorStop(0, `rgba(255, 0, 0, ${rayAlpha * 3})`);
          grad.addColorStop(0.35, `rgba(255, 90, 90, ${rayAlpha * 1.4})`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(
            Math.cos(rayAngle) * rayLen + Math.cos(rayAngle + Math.PI / 2) * rayW,
            Math.sin(rayAngle) * rayLen + Math.sin(rayAngle + Math.PI / 2) * rayW
          );
          ctx.lineTo(
            Math.cos(rayAngle) * rayLen + Math.cos(rayAngle - Math.PI / 2) * rayW,
            Math.sin(rayAngle) * rayLen + Math.sin(rayAngle - Math.PI / 2) * rayW
          );
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.save();
        ctx.globalAlpha = 0.18;
        for (let sprocket = -150; sprocket <= 150; sprocket += 32) {
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.beginPath();
          ctx.roundRect(sprocket - 10, -118, 20, 10, 2);
          ctx.fill();
          ctx.beginPath();
          ctx.roundRect(sprocket - 10, 104, 20, 10, 2);
          ctx.fill();
        }
        ctx.restore();
        const playerW = 164;
        const playerH = 98;
        const playerX = -playerW / 2;
        const playerY = -playerH / 2 + 12;
        const bodyGlow = ctx.createRadialGradient(0, playerY + playerH / 2, 25, 0, playerY + playerH / 2, 180);
        bodyGlow.addColorStop(0, "rgba(255, 0, 0, 0.25)");
        bodyGlow.addColorStop(0.5, "rgba(255, 0, 0, 0.08)");
        bodyGlow.addColorStop(1, "transparent");
        ctx.fillStyle = bodyGlow;
        ctx.beginPath();
        ctx.arc(0, playerY + playerH / 2, 180, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 35;
        ctx.shadowColor = "rgba(255, 0, 0, 0.65)";
        ctx.fillStyle = "rgba(12, 12, 16, 0.97)";
        ctx.strokeStyle = `rgba(255, 0, 0, ${0.62 + Math.sin(time * 2) * 0.18})`;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.roundRect(playerX, playerY, playerW, playerH, 14);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        const screenMargin = 5;
        const screenX = playerX + screenMargin;
        const screenY = playerY + screenMargin;
        const screenW = playerW - screenMargin * 2;
        const screenH = playerH - screenMargin * 2 - 16;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(screenX, screenY, screenW, screenH, 7);
        ctx.clip();
        const hueBase = time * 38 % 360;
        const videoGrad = ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY + screenH);
        videoGrad.addColorStop(0, `hsla(${hueBase}, 70%, 28%, 0.96)`);
        videoGrad.addColorStop(0.35, `hsla(${(hueBase + 120) % 360}, 60%, 24%, 0.96)`);
        videoGrad.addColorStop(0.72, `hsla(${(hueBase + 220) % 360}, 55%, 20%, 0.96)`);
        videoGrad.addColorStop(1, "rgba(6, 6, 10, 0.98)");
        ctx.fillStyle = videoGrad;
        ctx.fillRect(screenX, screenY, screenW, screenH);
        for (let obj = 0; obj < 10; obj++) {
          const seed = obj * 8.17 + 2.5;
          const ox = screenX + (Math.sin(time * 0.8 + seed) * 0.5 + 0.5) * screenW;
          const oy = screenY + (Math.cos(time * 0.65 + seed * 1.3) * 0.5 + 0.5) * screenH;
          const size = 4 + Math.abs(Math.sin(seed * 2.1)) * 4;
          const alpha = 0.25 + Math.sin(time * 2.1 + obj) * 0.12;
          const hue = (hueBase + obj * 31) % 360;
          ctx.fillStyle = `hsla(${hue}, 85%, 62%, ${alpha})`;
          ctx.beginPath();
          if (obj % 4 === 0) {
            ctx.arc(ox, oy, size, 0, Math.PI * 2);
          } else if (obj % 4 === 1) {
            ctx.roundRect(ox - size, oy - size * 0.65, size * 2.2, size * 1.3, 3);
          } else if (obj % 4 === 2) {
            ctx.moveTo(ox, oy - size);
            ctx.lineTo(ox + size, oy + size);
            ctx.lineTo(ox - size, oy + size);
            ctx.closePath();
          } else {
            ctx.fillRect(ox - size, oy - size, size * 1.7, size * 1.7);
          }
          ctx.fill();
        }
        const sweepX = screenX - 40 + time * 90 % (screenW + 80);
        const sweepGrad = ctx.createLinearGradient(sweepX, screenY, sweepX + 28, screenY);
        sweepGrad.addColorStop(0, "transparent");
        sweepGrad.addColorStop(0.5, "rgba(255,255,255,0.14)");
        sweepGrad.addColorStop(1, "transparent");
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(sweepX, screenY, 28, screenH);
        for (let sy = screenY; sy < screenY + screenH; sy += 2.5) {
          const alpha = 0.02 + Math.sin(sy * 0.45 + time * 11) * 0.01;
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillRect(screenX, sy, screenW, 1);
        }
        const centralPulse = 1 + Math.sin(time * 2.8) * 0.1;
        ctx.save();
        ctx.translate(screenX + screenW / 2, screenY + screenH / 2);
        ctx.scale(centralPulse, centralPulse);
        const playAura = ctx.createRadialGradient(0, 0, 0, 0, 0, 28);
        playAura.addColorStop(0, "rgba(255, 0, 0, 0.4)");
        playAura.addColorStop(0.6, "rgba(255, 0, 0, 0.14)");
        playAura.addColorStop(1, "transparent");
        ctx.fillStyle = playAura;
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 0, 0, 0.88)";
        ctx.beginPath();
        ctx.arc(0, 0, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(-5, -8);
        ctx.lineTo(-5, 8);
        ctx.lineTo(9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        for (let r = 0; r < 3; r++) {
          const progress = (time * 0.8 + r * 0.33) % 1;
          const radius = 20 + progress * 38;
          const alpha = (1 - progress) * 0.22;
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(screenX + screenW / 2, screenY + screenH / 2, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        const progressY = screenY + screenH - 5;
        const playProgress = time * 0.12 % 1;
        const buffered = Math.min(1, playProgress + 0.18 + Math.sin(time * 0.6) * 0.06);
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        ctx.fillRect(screenX, progressY, screenW, 3.5);
        ctx.fillStyle = "rgba(255,255,255,0.24)";
        ctx.fillRect(screenX, progressY, screenW * buffered, 3.5);
        ctx.fillStyle = "rgba(255, 0, 0, 0.96)";
        ctx.fillRect(screenX, progressY, screenW * playProgress, 3.5);
        const knobX = screenX + screenW * playProgress;
        ctx.beginPath();
        ctx.arc(knobX, progressY + 1.75, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 0, 1)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();
        const totalSec = 360;
        const currentSec = Math.floor(totalSec * playProgress);
        const curM = Math.floor(currentSec / 60);
        const curS = currentSec % 60;
        ctx.font = "bold 6px Arial";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillText(`${curM}:${curS.toString().padStart(2, "0")} / 6:00`, screenX + 4, progressY - 3);
        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(255,255,255,0.56)";
        ctx.fillText("LIVE HD", screenX + screenW - 4, progressY - 3);
        ctx.restore();
        const controlY = playerY + playerH - 15;
        ctx.fillStyle = "rgba(24, 24, 30, 0.97)";
        ctx.beginPath();
        ctx.roundRect(playerX, controlY, playerW, 15, [0, 0, 14, 14]);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "7px Arial";
        ctx.textAlign = "center";
        ctx.fillText("\u25B6  1.2M likes   \u{1F4AC} 52K   \u2197 Share   \u23FA Live", 0, controlY + 10);
        const logoY = -92 + Math.sin(time * 1.8) * 6;
        ctx.save();
        ctx.translate(0, logoY);
        ctx.scale(1.02 + Math.sin(time * 3) * 0.05, 1.02 + Math.sin(time * 3) * 0.05);
        ctx.rotate(Math.sin(time * 0.9) * 0.03);
        const logoW = 78;
        const logoH = 52;
        const logoGrad = ctx.createLinearGradient(-logoW / 2, -logoH / 2, logoW / 2, logoH / 2);
        logoGrad.addColorStop(0, "rgba(255, 20, 20, 0.98)");
        logoGrad.addColorStop(0.55, "rgba(225, 0, 0, 0.96)");
        logoGrad.addColorStop(1, "rgba(255, 65, 65, 0.98)");
        ctx.shadowBlur = 40;
        ctx.shadowColor = "rgba(255, 0, 0, 0.88)";
        ctx.fillStyle = logoGrad;
        ctx.beginPath();
        ctx.roundRect(-logoW / 2, -logoH / 2, logoW, logoH, 18);
        ctx.fill();
        const shineGrad = ctx.createLinearGradient(0, -logoH / 2, 0, 0);
        shineGrad.addColorStop(0, "rgba(255,255,255,0.24)");
        shineGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = shineGrad;
        ctx.beginPath();
        ctx.roundRect(-logoW / 2 + 4, -logoH / 2 + 3, logoW - 8, logoH / 2 - 5, [12, 12, 0, 0]);
        ctx.fill();
        ctx.shadowBlur = 14;
        ctx.shadowColor = "rgba(255,255,255,0.65)";
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(-12, -16);
        ctx.lineTo(-12, 16);
        ctx.lineTo(18, 0);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,${0.78 + Math.sin(time * 2.3) * 0.12})`;
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255,0,0,0.45)";
        ctx.fillText("YouTube", 0, logoY + 41);
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.shadowBlur = 12;
        for (let p = 0; p < 34; p++) {
          const angle = time * (0.7 + p * 0.045) + p * 0.31;
          const dist = 52 + Math.sin(time * 2.4 + p * 0.6) * 24;
          const px2 = Math.cos(angle) * dist;
          const py = logoY + Math.sin(angle) * dist * 0.62;
          const alpha = 0.38 + Math.sin(time * 3 + p * 0.4) * 0.22;
          const size = 1 + Math.abs(Math.sin(p * 0.8 + time * 2)) * 1.2;
          const c = p % 4 === 0 ? `rgba(255,0,0,${alpha})` : p % 4 === 1 ? `rgba(255,255,255,${alpha})` : p % 4 === 2 ? `rgba(255,120,120,${alpha})` : `rgba(255,210,210,${alpha * 0.7})`;
          ctx.shadowColor = c;
          if (p % 5 === 0) {
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.moveTo(px2 - 2, py - 3);
            ctx.lineTo(px2 - 2, py + 3);
            ctx.lineTo(px2 + 3, py);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.arc(px2, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.shadowBlur = 0;
        for (let ring = 0; ring < 4; ring++) {
          ctx.save();
          ctx.rotate(time * (0.45 + ring * 0.11) * (ring % 2 === 0 ? 1 : -1));
          const alpha = 0.18 + Math.sin(time * 2 + ring * 1.3) * 0.07;
          const stroke = ring === 0 ? `rgba(255,0,0,${alpha})` : ring === 1 ? `rgba(255,255,255,${alpha * 0.65})` : ring === 2 ? `rgba(255,110,110,${alpha})` : `rgba(255,180,80,${alpha * 0.65})`;
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 1.4 + ring * 0.2;
          ctx.setLineDash([24 + ring * 5, 15 + ring * 7]);
          ctx.beginPath();
          ctx.ellipse(0, 2, 178 - ring * 18, 103 - ring * 10, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        for (let thumb = 0; thumb < 8; thumb++) {
          const angle = time * 0.22 + thumb * (Math.PI * 2 / 8);
          const dist = 152 + Math.sin(time * 1.3 + thumb) * 26;
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist * 0.52;
          const tw = 30;
          const th = 18;
          const alpha = 0.28 + Math.sin(time * 1.9 + thumb) * 0.12;
          ctx.fillStyle = `rgba(0,0,0,${alpha * 0.4})`;
          ctx.beginPath();
          ctx.roundRect(tx - tw / 2 + 2, ty - th / 2 + 2, tw, th, 3);
          ctx.fill();
          const thumbGrad = ctx.createLinearGradient(tx - tw / 2, ty - th / 2, tx + tw / 2, ty + th / 2);
          thumbGrad.addColorStop(0, `rgba(255, 65, 65, ${alpha})`);
          thumbGrad.addColorStop(1, `rgba(45, 20, 20, ${alpha})`);
          ctx.fillStyle = thumbGrad;
          ctx.strokeStyle = `rgba(255,0,0,${alpha * 0.65})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.roundRect(tx - tw / 2, ty - th / 2, tw, th, 3);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
          ctx.beginPath();
          ctx.moveTo(tx - 3, ty - 3.6);
          ctx.lineTo(tx - 3, ty + 3.6);
          ctx.lineTo(tx + 5, ty);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = `rgba(0,0,0,${alpha * 0.7})`;
          ctx.fillRect(tx + tw / 2 - 14, ty + th / 2 - 6, 12, 5);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.82})`;
          ctx.font = "bold 3.5px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`${thumb + 1}:${(thumb * 11 % 60).toString().padStart(2, "0")}`, tx + tw / 2 - 8, ty + th / 2 - 2);
        }
        const reactions = ["\u{1F525}", "\u2764\uFE0F", "\u{1F44F}", "\u{1F602}", "\u{1F44D}", "\u{1F4AF}", "\u{1F389}", "\u{1F60D}", "\u26A1", "\u25B6"];
        for (let c = 0; c < 12; c++) {
          const seed = c * 12.7 + 3.1;
          const cx = -138 + c / 11 * 276 + Math.sin(time * 1.6 + seed) * 5;
          const travel = (time * 22 + seed * 18) % 130;
          const cy = 76 - travel;
          const alpha = Math.max(0, 0.5 - travel / 130 * 0.5);
          if (alpha <= 0.01) continue;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(cx, cy);
          ctx.scale(0.85 + Math.sin(seed) * 0.25, 0.85 + Math.sin(seed) * 0.25);
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.beginPath();
          ctx.roundRect(-10, -9, 20, 18, 8);
          ctx.fill();
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillText(reactions[c % reactions.length], 0, 3);
          ctx.restore();
        }
        const counterY = 80;
        const subCount = Math.floor(1e6 + time * 9e4 % 999999999);
        const viewCount = Math.floor(5e7 + time * 25e4 % 999999999);
        ctx.fillStyle = "rgba(18,18,24,0.92)";
        ctx.strokeStyle = `rgba(255,0,0,${0.55 + Math.sin(time * 2.8) * 0.18})`;
        ctx.lineWidth = 1.4;
        ctx.shadowBlur = 16;
        ctx.shadowColor = "rgba(255,0,0,0.35)";
        ctx.beginPath();
        ctx.roundRect(-106, counterY - 15, 212, 28, 9);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,0,0,0.98)";
        ctx.beginPath();
        ctx.roundRect(-101, counterY - 11, 78, 20, 6);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px Arial";
        ctx.textAlign = "center";
        ctx.fillText("\u25B6 SUBSCRIBE", -62, counterY + 3);
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.font = "bold 10px Arial";
        ctx.fillText(subCount.toLocaleString(), 44, counterY + 3);
        for (let f = 0; f < 9; f++) {
          const seed = f * 5.4 + 1.2;
          const fx = -102 + f * 12;
          const rise = (time * 38 + seed * 14) % 28;
          const fy = counterY - 15 - rise;
          const alpha = Math.max(0, 0.42 - rise / 28 * 0.42);
          const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 7);
          grad.addColorStop(0, `rgba(255,220,90,${alpha})`);
          grad.addColorStop(0.45, `rgba(255,110,20,${alpha * 0.7})`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(fx, fy, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.save();
        ctx.translate(0, -140);
        ctx.rotate(Math.sin(time * 0.7) * 0.03);
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.beginPath();
        ctx.roundRect(-68, -12, 136, 24, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.stroke();
        ctx.fillStyle = "rgba(255,0,0,0.7)";
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center";
        ctx.fillText("\u25B6 VIRAL VIDEO ERA", 0, 4);
        ctx.restore();
        const flash = Math.sin(time * 5.2);
        if (flash > 0.8) {
          const radius = 70 + (flash - 0.8) * 360;
          const flashGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
          flashGrad.addColorStop(0, `rgba(255,255,255,${(flash - 0.8) * 2.4})`);
          flashGrad.addColorStop(0.28, `rgba(255,0,0,${(flash - 0.8) * 1.1})`);
          flashGrad.addColorStop(0.58, `rgba(255,80,80,${(flash - 0.8) * 0.4})`);
          flashGrad.addColorStop(1, "transparent");
          ctx.fillStyle = flashGrad;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "rgba(255,255,255,0.48)";
        ctx.font = "bold 7px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`\u{1F441} ${viewCount.toLocaleString()} views`, 0, counterY + 20);
        ctx.save();
        ctx.translate(104, -10);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = "rgba(255,0,0,0.92)";
        ctx.beginPath();
        ctx.roundRect(-18, -8, 36, 16, 6);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px Arial";
        ctx.textAlign = "center";
        ctx.fillText("LIVE", 0, 3);
        ctx.restore();
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255,0,0,0.82)";
        ctx.fillStyle = "rgba(255,255,255,0.96)";
        ctx.font = "bold 17px Arial";
        ctx.textAlign = "center";
        ctx.fillText("VIDEO REVOLUTION", 0, 112);
        ctx.font = "12px Arial";
        ctx.fillStyle = "rgba(255,95,95,0.82)";
        ctx.shadowBlur = 6;
        ctx.fillText("2005.02.14 \u2014 YOUTUBE FOUNDED", 0, 130);
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255,0,0,${0.06 + Math.sin(time * 1.4) * 0.02})`;
        ctx.font = "italic bold 30px Arial";
        ctx.fillText("Broadcast Yourself", 0, -168);
        ctx.save();
        ctx.translate(0, -8);
        for (let wave = 0; wave < 3; wave++) {
          const t = (time * 0.95 + wave * 0.28) % 1;
          const scale = 1 + t * 1.8;
          const alpha = (1 - t) * 0.16;
          ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-18 * scale, -22 * scale);
          ctx.lineTo(-18 * scale, 22 * scale);
          ctx.lineTo(24 * scale, 0);
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
        ctx.restore();
      }
      // 메인 연표의 '아이폰 공개' 카드에 적용되는 화려한 애플 특수 시각 효과 렌더링 (사과 로고, 홈 화면 스와이프, 발광 효과)
      drawAppleIPhoneEffect(ctx, x, y) {
        const time = Date.now() * 1e-3;
        ctx.save();
        ctx.translate(x, y);
        for (let aura = 0; aura < 4; aura++) {
          const auraR = 230 + aura * 45 + Math.sin(time * 1 + aura * 0.9) * 10;
          const auraGrad = ctx.createRadialGradient(0, 0, auraR * 0.05, 0, 0, auraR);
          const aAlpha = 0.05 - aura * 0.01;
          auraGrad.addColorStop(0, `rgba(200, 200, 210, ${aAlpha + 0.03})`);
          auraGrad.addColorStop(0.3, `rgba(120, 120, 140, ${aAlpha})`);
          auraGrad.addColorStop(0.6, `rgba(180, 180, 200, ${aAlpha * 0.7})`);
          auraGrad.addColorStop(1, "transparent");
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, auraR, 0, Math.PI * 2);
          ctx.fill();
        }
        const phoneW = 70;
        const phoneH = 140;
        const phoneX = -phoneW / 2;
        const phoneY = -phoneH / 2;
        const phoneGlow = ctx.createRadialGradient(0, 0, 30, 0, 0, 160);
        phoneGlow.addColorStop(0, "rgba(200, 200, 220, 0.15)");
        phoneGlow.addColorStop(0.5, "rgba(150, 150, 170, 0.05)");
        phoneGlow.addColorStop(1, "transparent");
        ctx.fillStyle = phoneGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 160, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(20, 20, 25, 0.95)";
        ctx.strokeStyle = `rgba(180, 180, 200, ${0.5 + Math.sin(time * 2) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 30;
        ctx.shadowColor = "rgba(150, 150, 200, 0.5)";
        ctx.beginPath();
        ctx.roundRect(phoneX, phoneY, phoneW, phoneH, 12);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        const screenMargin = 5;
        const screenX = phoneX + screenMargin;
        const screenY = phoneY + 18;
        const screenW = phoneW - screenMargin * 2;
        const screenH = phoneH - 36;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(screenX, screenY, screenW, screenH, 4);
        ctx.clip();
        const swipePhase = time * 0.3 % 3;
        const swipeOffset = Math.sin(swipePhase * Math.PI * 2) * screenW * 0.6;
        const bg1Grad = ctx.createLinearGradient(
          screenX + swipeOffset,
          screenY,
          screenX + screenW + swipeOffset,
          screenY + screenH
        );
        bg1Grad.addColorStop(0, `rgba(60, 80, 200, 0.9)`);
        bg1Grad.addColorStop(0.5, `rgba(120, 60, 180, 0.9)`);
        bg1Grad.addColorStop(1, `rgba(200, 80, 140, 0.9)`);
        ctx.fillStyle = bg1Grad;
        ctx.fillRect(screenX, screenY, screenW, screenH);
        const bg2X = screenX + screenW - swipeOffset * 0.5;
        const bg2Grad = ctx.createLinearGradient(bg2X, screenY, bg2X + screenW, screenY + screenH);
        bg2Grad.addColorStop(0, `rgba(255, 150, 50, ${Math.max(0, Math.sin(swipePhase))})`);
        bg2Grad.addColorStop(1, `rgba(255, 80, 120, ${Math.max(0, Math.sin(swipePhase))})`);
        ctx.fillStyle = bg2Grad;
        ctx.fillRect(screenX, screenY, screenW, screenH);
        const iconSize = 8;
        const iconGap = 4;
        const iconCols = 4;
        const iconRows = 5;
        const gridStartX = screenX + (screenW - (iconCols * (iconSize + iconGap) - iconGap)) / 2;
        const gridStartY = screenY + 8;
        const iconColors = [
          "rgba(0, 200, 80, 0.9)",
          "rgba(50, 150, 255, 0.9)",
          "rgba(255, 100, 50, 0.9)",
          "rgba(255, 220, 0, 0.9)",
          "rgba(200, 50, 200, 0.9)",
          "rgba(0, 180, 220, 0.9)",
          "rgba(255, 60, 80, 0.9)",
          "rgba(100, 200, 50, 0.9)",
          "rgba(50, 100, 255, 0.9)",
          "rgba(255, 150, 0, 0.9)",
          "rgba(180, 80, 255, 0.9)",
          "rgba(0, 220, 180, 0.9)",
          "rgba(255, 50, 120, 0.9)",
          "rgba(80, 180, 255, 0.9)",
          "rgba(220, 200, 0, 0.9)",
          "rgba(100, 100, 255, 0.9)",
          "rgba(255, 80, 80, 0.9)",
          "rgba(0, 200, 150, 0.9)",
          "rgba(200, 100, 50, 0.9)",
          "rgba(150, 50, 255, 0.9)"
        ];
        const iconSwipeX = Math.sin(swipePhase * Math.PI) * 3;
        for (let row = 0; row < iconRows; row++) {
          for (let col = 0; col < iconCols; col++) {
            const ix = gridStartX + col * (iconSize + iconGap) + iconSwipeX;
            const iy = gridStartY + row * (iconSize + iconGap + 1);
            const iconIdx = row * iconCols + col;
            const flicker = 0.7 + Math.sin(time * 2 + iconIdx * 0.8) * 0.3;
            ctx.fillStyle = iconColors[iconIdx % iconColors.length].replace("0.9", flicker.toString());
            ctx.beginPath();
            ctx.roundRect(ix, iy, iconSize, iconSize, 2);
            ctx.fill();
          }
        }
        const dockY = screenY + screenH - 14;
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.roundRect(screenX + 2, dockY, screenW - 4, 12, 4);
        ctx.fill();
        const dockColors = [
          "rgba(0, 200, 80, 0.9)",
          "rgba(50, 150, 255, 0.9)",
          "rgba(255, 150, 0, 0.9)",
          "rgba(0, 200, 220, 0.9)"
        ];
        for (let d = 0; d < 4; d++) {
          const dx = screenX + 6 + d * 14;
          ctx.fillStyle = dockColors[d];
          ctx.beginPath();
          ctx.roundRect(dx, dockY + 2, 8, 8, 2);
          ctx.fill();
        }
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "bold 4px Arial";
        ctx.textAlign = "left";
        ctx.fillText("9:41", screenX + 3, screenY + 5);
        ctx.textAlign = "right";
        ctx.fillText("\u25CF\u25CF\u25CF", screenX + screenW - 3, screenY + 5);
        const dotCount = 3;
        const activeDot = Math.floor(swipePhase) % dotCount;
        for (let dot = 0; dot < dotCount; dot++) {
          const dotX = screenX + screenW / 2 + (dot - 1) * 6;
          const dotY = dockY - 4;
          ctx.beginPath();
          ctx.arc(dotX, dotY, dot === activeDot ? 1.5 : 1, 0, Math.PI * 2);
          ctx.fillStyle = dot === activeDot ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.3)";
          ctx.fill();
        }
        ctx.restore();
        ctx.fillStyle = "rgba(20, 20, 25, 1)";
        ctx.beginPath();
        ctx.roundRect(phoneX + phoneW / 2 - 12, phoneY + 2, 24, 5, 3);
        ctx.fill();
        ctx.fillStyle = "rgba(200, 200, 210, 0.6)";
        ctx.beginPath();
        ctx.roundRect(phoneX + phoneW / 2 - 10, phoneY + phoneH - 6, 20, 2, 1);
        ctx.fill();
        const logoY = -105 + Math.sin(time * 1.5) * 5;
        const logoScale = 1 + Math.sin(time * 3) * 0.05;
        ctx.save();
        ctx.translate(0, logoY);
        ctx.scale(logoScale, logoScale);
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.bezierCurveTo(-14, -18, -20, -8, -20, 2);
        ctx.bezierCurveTo(-20, 14, -12, 22, -4, 26);
        ctx.quadraticCurveTo(0, 22, 4, 26);
        ctx.bezierCurveTo(12, 22, 20, 14, 20, 2);
        ctx.bezierCurveTo(20, -8, 14, -18, 0, -18);
        ctx.closePath();
        const appleHue = time * 30 % 360;
        const saturation = 10 + Math.sin(time * 0.5) * 10;
        const appleGrad = ctx.createLinearGradient(-20, -18, 20, 26);
        appleGrad.addColorStop(0, `hsla(${appleHue}, ${saturation}%, 85%, 0.9)`);
        appleGrad.addColorStop(0.5, `hsla(${(appleHue + 30) % 360}, ${saturation + 5}%, 80%, 0.85)`);
        appleGrad.addColorStop(1, `hsla(${(appleHue + 60) % 360}, ${saturation}%, 75%, 0.8)`);
        ctx.fillStyle = appleGrad;
        ctx.shadowBlur = 25;
        ctx.shadowColor = `hsla(${appleHue}, 20%, 80%, 0.7)`;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(2, -18);
        ctx.quadraticCurveTo(8, -30, 14, -26);
        ctx.quadraticCurveTo(10, -20, 2, -18);
        ctx.fillStyle = `rgba(120, 200, 80, ${0.7 + Math.sin(time * 2) * 0.2})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(100, 200, 60, 0.5)";
        ctx.fill();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(22, -4, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.shadowBlur = 8;
        for (let p = 0; p < 16; p++) {
          const pAngle = time * (0.8 + p * 0.15) + p * 0.4;
          const pDist = 35 + Math.sin(time * 2 + p * 0.9) * 15;
          const px2 = Math.cos(pAngle) * pDist;
          const py = logoY + Math.sin(pAngle) * pDist * 0.6;
          const pSize = 1 + Math.sin(time * 3 + p * 0.7) * 0.6;
          const pAlpha = 0.4 + Math.sin(time * 2.5 + p * 0.5) * 0.3;
          const pColor = p % 3 === 0 ? `rgba(200, 200, 220, ${pAlpha})` : p % 3 === 1 ? `rgba(150, 200, 255, ${pAlpha})` : `rgba(255, 255, 255, ${pAlpha})`;
          ctx.shadowColor = pColor;
          ctx.fillStyle = pColor;
          ctx.beginPath();
          ctx.arc(px2, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let ring = 0; ring < 3; ring++) {
          ctx.save();
          ctx.rotate(time * (0.5 + ring * 0.2) * (ring % 2 === 0 ? 1 : -1));
          const ringAlpha = 0.18 + Math.sin(time * 2 + ring * 1.5) * 0.08;
          const ringColor = ring === 0 ? `rgba(180, 180, 210, ${ringAlpha})` : ring === 1 ? `rgba(100, 160, 255, ${ringAlpha})` : `rgba(200, 200, 230, ${ringAlpha})`;
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([20 + ring * 5, 15 + ring * 8]);
          ctx.beginPath();
          ctx.ellipse(0, 0, 160 - ring * 20, 90 - ring * 12, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.shadowBlur = 0;
        for (let beam = 0; beam < 12; beam++) {
          const beamAngle = beam / 12 * Math.PI * 2 + time * 0.2;
          const beamLength = 130 + Math.sin(time * 2 + beam * 0.8) * 30;
          const beamAlpha = 0.06 + Math.sin(time * 3 + beam * 0.6) * 0.03;
          const beamGrad = ctx.createLinearGradient(
            0,
            0,
            Math.cos(beamAngle) * beamLength,
            Math.sin(beamAngle) * beamLength
          );
          beamGrad.addColorStop(0, `rgba(180, 180, 210, ${beamAlpha * 2})`);
          beamGrad.addColorStop(0.5, `rgba(150, 160, 200, ${beamAlpha})`);
          beamGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const perpAngle1 = beamAngle + Math.PI / 2;
          const perpAngle2 = beamAngle - Math.PI / 2;
          const width = 2 + Math.sin(time * 4 + beam) * 1;
          ctx.lineTo(
            Math.cos(beamAngle) * beamLength + Math.cos(perpAngle1) * width,
            Math.sin(beamAngle) * beamLength + Math.sin(perpAngle1) * width
          );
          ctx.lineTo(
            Math.cos(beamAngle) * beamLength + Math.cos(perpAngle2) * width,
            Math.sin(beamAngle) * beamLength + Math.sin(perpAngle2) * width
          );
          ctx.closePath();
          ctx.fillStyle = beamGrad;
          ctx.fill();
        }
        const flashPulse = Math.sin(time * 5);
        if (flashPulse > 0.85) {
          const flashR = 50 + (flashPulse - 0.85) * 300;
          const flashGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, flashR);
          flashGrad.addColorStop(0, `rgba(255, 255, 255, ${(flashPulse - 0.85) * 3})`);
          flashGrad.addColorStop(0.4, `rgba(180, 180, 220, ${(flashPulse - 0.85) * 1})`);
          flashGrad.addColorStop(1, "transparent");
          ctx.fillStyle = flashGrad;
          ctx.beginPath();
          ctx.arc(0, 0, flashR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(180, 180, 220, 0.7)";
        ctx.fillStyle = "rgba(220, 220, 240, 0.9)";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("MOBILE REVOLUTION", 0, 100);
        ctx.font = "11px Arial";
        ctx.fillStyle = "rgba(150, 150, 180, 0.7)";
        ctx.shadowBlur = 0;
        ctx.fillText("2007.01.09 \u2014 iPHONE UNVEILED", 0, 117);
        ctx.restore();
      }
      // 기업별 경쟁 연표에서 세부 모델 노드 클릭 시 해당 모델의 상세 정보를 모달 팝업으로 표시
      showCompetitionModelDetail(model, brandName, brandIcon, brandColor) {
        const overlay = AppHelper.createUIElement(
          "div",
          "comp-model-detail-overlay",
          {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.92)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "2500",
            pointerEvents: "auto",
            backdropFilter: "blur(30px)"
          },
          "",
          [
            { event: "wheel", handler: (e) => e.stopPropagation() },
            { event: "pointerdown", handler: (e) => e.stopPropagation() },
            { event: "pointermove", handler: (e) => e.stopPropagation() }
          ]
        );
        const modal = AppHelper.createUIElement("div", "", {
          width: "580px",
          maxWidth: "90%",
          padding: "45px",
          backgroundColor: "rgba(10, 20, 40, 0.98)",
          border: `2px solid ${brandColor}`,
          borderRadius: "30px",
          color: "white",
          boxShadow: `0 0 80px ${brandColor}33, 0 40px 80px rgba(0,0,0,0.6)`,
          overflowY: "auto",
          maxHeight: "85%",
          boxSizing: "border-box",
          position: "relative"
        });
        const bgIcon = AppHelper.createUIElement(
          "div",
          "",
          {
            position: "absolute",
            top: "20px",
            right: "30px",
            fontSize: "80px",
            opacity: "0.06",
            pointerEvents: "none"
          },
          brandIcon
        );
        modal.appendChild(bgIcon);
        const brandTag = AppHelper.createUIElement(
          "div",
          "",
          {
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            backgroundColor: `${brandColor}18`,
            border: `1px solid ${brandColor}55`,
            borderRadius: "20px",
            marginBottom: "20px",
            fontSize: "13px",
            fontWeight: "900",
            color: brandColor,
            letterSpacing: "1px"
          },
          `${brandIcon} ${brandName}`
        );
        modal.appendChild(brandTag);
        const modelName = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "32px",
            fontWeight: "900",
            color: "#ffffff",
            marginBottom: "8px",
            lineHeight: "1.2",
            textShadow: `0 0 20px ${brandColor}44`
          },
          model.name
        );
        modal.appendChild(modelName);
        const dateLabel = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: "25px",
            letterSpacing: "2px"
          },
          `${this.textData.releaseDateLabel}: ${model.date}`
        );
        modal.appendChild(dateLabel);
        if (model.highlight) {
          const badge = AppHelper.createUIElement(
            "div",
            "",
            {
              display: "inline-block",
              padding: "5px 14px",
              backgroundColor: brandColor,
              color: "#000",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "900",
              marginBottom: "25px",
              boxShadow: `0 0 15px ${brandColor}66`
            },
            "\u2605 KEY RELEASE"
          );
          modal.appendChild(badge);
        }
        const divider = AppHelper.createUIElement("div", "", {
          width: "100%",
          height: "1px",
          background: `linear-gradient(to right, transparent, ${brandColor}44, transparent)`,
          marginBottom: "25px"
        });
        modal.appendChild(divider);
        const descBox = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "18px",
            lineHeight: "1.8",
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "30px",
            fontWeight: "300",
            wordBreak: "keep-all"
          },
          model.desc
        );
        modal.appendChild(descBox);
        let matchedDetail = null;
        for (const series of this.appData.aiModels) {
          for (const aiModel of series.models) {
            if (aiModel.name === model.name || aiModel.name.includes(model.name.split(" ")[0]) && aiModel.date === model.date) {
              matchedDetail = aiModel;
              break;
            }
          }
          if (matchedDetail) break;
        }
        if (!matchedDetail) {
          for (const cm of this.appData.codingModelRanking) {
            if (cm.name === model.name || cm.name.includes(model.name.split(" ")[0])) {
              matchedDetail = cm;
              break;
            }
          }
        }
        if (matchedDetail) {
          const statsSection = AppHelper.createUIElement("div", "", {
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderRadius: "16px",
            border: `1px solid ${brandColor}22`,
            marginBottom: "25px"
          });
          const statsTitle = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "12px",
              fontWeight: "900",
              color: brandColor,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "15px"
            },
            "PERFORMANCE METRICS"
          );
          statsSection.appendChild(statsTitle);
          const scoreRow = AppHelper.createUIElement("div", "", { marginBottom: "12px" });
          const scoreLabelRow = AppHelper.createUIElement("div", "", {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
            fontSize: "13px",
            fontWeight: "bold",
            color: "rgba(255,255,255,0.8)"
          });
          scoreLabelRow.appendChild(AppHelper.createUIElement("span", "", {}, this.textData.techScoreLabel));
          scoreLabelRow.appendChild(
            AppHelper.createUIElement("span", "", { color: brandColor }, `${matchedDetail.techScore}%`)
          );
          const scoreBarBg = AppHelper.createUIElement("div", "", {
            width: "100%",
            height: "6px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "3px",
            overflow: "hidden"
          });
          const scoreBarFill = AppHelper.createUIElement("div", "", {
            width: "0%",
            height: "100%",
            background: `linear-gradient(to right, ${brandColor}, ${brandColor}aa)`,
            borderRadius: "3px",
            boxShadow: `0 0 10px ${brandColor}`,
            transition: "width 1s ease-out"
          });
          scoreBarBg.appendChild(scoreBarFill);
          scoreRow.appendChild(scoreLabelRow);
          scoreRow.appendChild(scoreBarBg);
          statsSection.appendChild(scoreRow);
          setTimeout(() => {
            scoreBarFill.style.width = `${matchedDetail.techScore}%`;
          }, 100);
          const userRow = AppHelper.createUIElement("div", "", {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "8px"
          });
          userRow.appendChild(AppHelper.createUIElement("span", "", { color: brandColor, fontSize: "8px" }, "\u25CF"));
          userRow.appendChild(AppHelper.createUIElement("span", "", {}, `${this.textData.userCountLabel}:`));
          userRow.appendChild(
            AppHelper.createUIElement(
              "span",
              "",
              { fontWeight: "900", color: "#fff" },
              this.formatKoreanUnit(matchedDetail.userCount)
            )
          );
          statsSection.appendChild(userRow);
          if (matchedDetail.codingScore !== void 0) {
            const codingRow = AppHelper.createUIElement("div", "", {
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "8px"
            });
            codingRow.appendChild(AppHelper.createUIElement("span", "", { color: brandColor, fontSize: "8px" }, "\u25CF"));
            codingRow.appendChild(AppHelper.createUIElement("span", "", {}, `${this.textData.sweBenchLabel}:`));
            codingRow.appendChild(
              AppHelper.createUIElement("span", "", { fontWeight: "900", color: "#fff" }, `${matchedDetail.codingScore}%`)
            );
            statsSection.appendChild(codingRow);
          }
          if (matchedDetail.terminalScore !== void 0) {
            const termRow = AppHelper.createUIElement("div", "", {
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              color: "rgba(255,255,255,0.8)"
            });
            termRow.appendChild(AppHelper.createUIElement("span", "", { color: brandColor, fontSize: "8px" }, "\u25CF"));
            termRow.appendChild(AppHelper.createUIElement("span", "", {}, `${this.textData.terminalBenchLabel}:`));
            termRow.appendChild(
              AppHelper.createUIElement(
                "span",
                "",
                { fontWeight: "900", color: "#fff" },
                `${matchedDetail.terminalScore}%`
              )
            );
            statsSection.appendChild(termRow);
          }
          modal.appendChild(statsSection);
          if (matchedDetail.features && matchedDetail.features.length > 0) {
            const featureTitle = AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: "13px",
                fontWeight: "900",
                color: brandColor,
                marginBottom: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase"
              },
              this.textData.featureLabel
            );
            modal.appendChild(featureTitle);
            const featureList = AppHelper.createUIElement("ul", "", {
              paddingLeft: "20px",
              fontSize: "15px",
              lineHeight: "1.8",
              color: "rgba(255, 255, 255, 0.85)",
              marginBottom: "25px"
            });
            matchedDetail.features.forEach((f) => {
              const li = AppHelper.createUIElement("li", "", { marginBottom: "4px" }, f);
              featureList.appendChild(li);
            });
            modal.appendChild(featureList);
          }
          if (matchedDetail.details) {
            const detailsBox = AppHelper.createUIElement(
              "div",
              "",
              {
                padding: "18px",
                backgroundColor: `${brandColor}08`,
                borderRadius: "12px",
                border: `1px solid ${brandColor}22`,
                fontSize: "14px",
                lineHeight: "1.7",
                color: "rgba(255,255,255,0.75)",
                marginBottom: "25px"
              },
              matchedDetail.details
            );
            modal.appendChild(detailsBox);
          }
        }
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            width: "100%",
            padding: "16px",
            backgroundColor: "transparent",
            color: brandColor,
            border: `2px solid ${brandColor}`,
            borderRadius: "16px",
            cursor: "pointer",
            fontWeight: "900",
            fontSize: "16px",
            transition: "all 0.3s",
            marginTop: "10px"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                gsapWithCSS.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => overlay.remove() });
              }
            },
            {
              event: "mouseenter",
              handler: (e) => {
                const t = e.currentTarget;
                t.style.backgroundColor = `${brandColor}15`;
                t.style.boxShadow = `0 0 20px ${brandColor}33`;
              }
            },
            {
              event: "mouseleave",
              handler: (e) => {
                const t = e.currentTarget;
                t.style.backgroundColor = "transparent";
                t.style.boxShadow = "none";
              }
            }
          ]
        );
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(modal, { opacity: 0, y: 30, scale: 0.95, duration: 0.4, ease: "back.out(1.7)" });
      }
      // 메인 연표의 결정적 사건(GPT-1 발표, 이세돌 바둑)에 적용되는 은하계 시각 효과 렌더링
      drawGalaxyEffect(ctx, x, y) {
        const time = Date.now() * 1e-3;
        ctx.save();
        ctx.translate(x, y);
        for (let halo = 0; halo < 4; halo++) {
          const haloR = 240 + halo * 50 + Math.sin(time * 0.6 + halo * 1.1) * 10;
          const haloGrad = ctx.createRadialGradient(0, 0, haloR * 0.1, 0, 0, haloR);
          const hAlpha = 0.04 - halo * 7e-3;
          haloGrad.addColorStop(0, `rgba(120, 80, 220, ${hAlpha + 0.02})`);
          haloGrad.addColorStop(0.25, `rgba(60, 100, 255, ${hAlpha})`);
          haloGrad.addColorStop(0.5, `rgba(0, 200, 255, ${hAlpha * 0.7})`);
          haloGrad.addColorStop(0.8, `rgba(180, 120, 255, ${hAlpha * 0.3})`);
          haloGrad.addColorStop(1, "transparent");
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(0, 0, haloR, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let arm = 0; arm < 3; arm++) {
          const armOffset = arm / 3 * Math.PI * 2;
          ctx.save();
          ctx.rotate(time * 0.08);
          for (let s = 0; s < 80; s++) {
            const t = s / 80;
            const spiralAngle = armOffset + t * Math.PI * 3.5;
            const spiralR = 30 + t * 200;
            const jitterX = Math.sin(s * 7.3 + time * 0.5) * (8 + t * 15);
            const jitterY = Math.cos(s * 5.1 + time * 0.5) * (8 + t * 15);
            const sx = Math.cos(spiralAngle) * spiralR + jitterX;
            const sy = Math.sin(spiralAngle) * spiralR * 0.45 + jitterY;
            const starSize = 0.5 + Math.abs(Math.sin(s * 2.7)) * 2;
            const starAlpha = (0.3 + Math.sin(time * 2 + s * 0.5) * 0.2) * (1 - t * 0.4);
            const colorChoice = s % 4;
            let starColor;
            if (colorChoice === 0) starColor = `rgba(180, 160, 255, ${starAlpha})`;
            else if (colorChoice === 1) starColor = `rgba(100, 180, 255, ${starAlpha})`;
            else if (colorChoice === 2) starColor = `rgba(0, 255, 212, ${starAlpha * 0.7})`;
            else starColor = `rgba(255, 255, 255, ${starAlpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
            ctx.fillStyle = starColor;
            ctx.shadowBlur = starSize * 4;
            ctx.shadowColor = starColor;
            ctx.fill();
          }
          ctx.restore();
        }
        ctx.save();
        ctx.rotate(time * 0.05);
        for (let dust = 0; dust < 5; dust++) {
          const dustAngle = dust / 5 * Math.PI * 2 + time * 0.03;
          const dustR = 80 + dust * 30;
          const dx = Math.cos(dustAngle) * dustR;
          const dy = Math.sin(dustAngle) * dustR * 0.4;
          const dustSize = 40 + Math.sin(time + dust * 1.5) * 10;
          const dustGrad = ctx.createRadialGradient(dx, dy, 0, dx, dy, dustSize);
          const dAlpha = 0.06 + Math.sin(time * 0.8 + dust) * 0.02;
          dustGrad.addColorStop(0, `rgba(100, 60, 180, ${dAlpha})`);
          dustGrad.addColorStop(0.5, `rgba(60, 80, 200, ${dAlpha * 0.5})`);
          dustGrad.addColorStop(1, "transparent");
          ctx.fillStyle = dustGrad;
          ctx.beginPath();
          ctx.arc(dx, dy, dustSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        const corePulse = 1 + Math.sin(time * 3) * 0.08;
        const outerCoreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 60 * corePulse);
        outerCoreGrad.addColorStop(0, "rgba(255, 255, 255, 0.7)");
        outerCoreGrad.addColorStop(0.2, "rgba(200, 180, 255, 0.4)");
        outerCoreGrad.addColorStop(0.5, "rgba(100, 120, 255, 0.15)");
        outerCoreGrad.addColorStop(1, "transparent");
        ctx.shadowBlur = 40;
        ctx.shadowColor = "rgba(150, 130, 255, 0.8)";
        ctx.fillStyle = outerCoreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 60 * corePulse, 0, Math.PI * 2);
        ctx.fill();
        const innerCoreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 25 * corePulse);
        innerCoreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        innerCoreGrad.addColorStop(0.4, "rgba(220, 200, 255, 0.6)");
        innerCoreGrad.addColorStop(1, "transparent");
        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(200, 180, 255, 0.9)";
        ctx.fillStyle = innerCoreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 25 * corePulse, 0, Math.PI * 2);
        ctx.fill();
        for (let ring = 0; ring < 3; ring++) {
          ctx.save();
          ctx.rotate(time * (0.12 + ring * 0.04) * (ring % 2 === 0 ? 1 : -1));
          const ringR = 120 + ring * 40;
          const ringAlpha = 0.12 + Math.sin(time * 1.5 + ring) * 0.05;
          ctx.strokeStyle = ring % 2 === 0 ? `rgba(120, 100, 255, ${ringAlpha})` : `rgba(0, 200, 255, ${ringAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([15 + ring * 5, 25 + ring * 10]);
          ctx.beginPath();
          ctx.ellipse(0, 0, ringR, ringR * 0.35, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.shadowBlur = 0;
        for (let bs = 0; bs < 20; bs++) {
          const bsSeed = bs * 11.37 + 1.7;
          const bsAngle = time * (0.02 + Math.sin(bsSeed) * 0.02) + bsSeed;
          const bsDist = 50 + Math.abs(Math.sin(bsSeed * 1.9)) * 180;
          const bsx = Math.cos(bsAngle) * bsDist;
          const bsy = Math.sin(bsAngle) * bsDist * (0.3 + Math.abs(Math.sin(bsSeed * 0.7)) * 0.3);
          const bsSize = 1 + Math.abs(Math.sin(bsSeed * 3.3)) * 2.5;
          const bsAlpha = 0.4 + Math.sin(time * 3 + bsSeed) * 0.3;
          if (bsSize > 2) {
            const crossLen = bsSize * 3;
            const crossAlpha = bsAlpha * 0.4;
            ctx.strokeStyle = `rgba(200, 200, 255, ${crossAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(bsx - crossLen, bsy);
            ctx.lineTo(bsx + crossLen, bsy);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bsx, bsy - crossLen);
            ctx.lineTo(bsx, bsy + crossLen);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(bsx, bsy, bsSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${bsAlpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(180, 160, 255, 0.6)";
          ctx.fill();
        }
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(120, 100, 255, 0.7)";
        ctx.fillStyle = "rgba(200, 180, 255, 0.85)";
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";
        ctx.fillText("\u2726 GALACTIC MILESTONE \u2726", 0, 90);
        ctx.font = "11px Arial";
        ctx.fillStyle = "rgba(150, 140, 255, 0.6)";
        ctx.shadowBlur = 0;
        ctx.fillText("A Decisive Moment in History", 0, 107);
        ctx.restore();
      }
      // 기업 창립 카드에 적용되는 화려한 로고 에너지 효과 렌더링 (기업별 고유 색상 및 라벨 적용) + 본사 건설 애니메이션 배경
      drawMSFoundationEffect(ctx, x, y, config3) {
        const time = Date.now() * 1e-3;
        ctx.save();
        ctx.translate(x, y);
        const msColors = config3 ? config3.colors : [
          { r: 242, g: 80, b: 34 },
          { r: 127, g: 186, b: 0 },
          { r: 0, g: 120, b: 215 },
          { r: 255, g: 185, b: 0 }
        ];
        const labelText = config3 ? config3.label : "SOFTWARE REVOLUTION";
        const sublabelText = config3 ? config3.sublabel : "1975.04.04 \u2014 MICROSOFT FOUNDED";
        const groundY = 40;
        const groundGrad = ctx.createLinearGradient(0, groundY, 0, groundY + 60);
        groundGrad.addColorStop(0, `rgba(${msColors[2].r}, ${msColors[2].g}, ${msColors[2].b}, 0.15)`);
        groundGrad.addColorStop(1, "transparent");
        ctx.fillStyle = groundGrad;
        ctx.fillRect(-220, groundY, 440, 60);
        const buildProgress = Math.sin(time * 0.4) * 0.5 + 0.5;
        const buildPhase = time * 0.15 % 1;
        const buildingBlocks = [
          { bx: -160, bw: 50, maxH: 180, delay: 0 },
          { bx: -100, bw: 65, maxH: 220, delay: 0.1 },
          { bx: -25, bw: 80, maxH: 280, delay: 0.2 },
          { bx: 65, bw: 60, maxH: 200, delay: 0.15 },
          { bx: 135, bw: 45, maxH: 160, delay: 0.05 }
        ];
        buildingBlocks.forEach((block, bi) => {
          const phaseOffset = (time * 0.3 + block.delay * 10) % 4;
          const rawProgress = Math.min(1, phaseOffset < 3 ? phaseOffset / 3 : 1);
          const currentH = block.maxH * rawProgress;
          if (currentH < 2) return;
          const by = groundY - currentH;
          const c = msColors[bi % msColors.length];
          const bldGrad = ctx.createLinearGradient(block.bx, by, block.bx + block.bw, groundY);
          bldGrad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.25)`);
          bldGrad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.12)`);
          bldGrad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0.06)`);
          ctx.fillStyle = bldGrad;
          ctx.beginPath();
          ctx.roundRect(block.bx, by, block.bw, currentH, [3, 3, 0, 0]);
          ctx.fill();
          ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.3 + Math.sin(time * 2 + bi) * 0.1})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(block.bx, by, block.bw, currentH, [3, 3, 0, 0]);
          ctx.stroke();
          const floorH = 18;
          const windowMargin = 6;
          const windowW = 8;
          const windowH = 10;
          const floors = Math.floor(currentH / floorH);
          for (let f = 0; f < floors; f++) {
            const floorY = groundY - (f + 1) * floorH + 4;
            const windowsPerFloor = Math.floor((block.bw - windowMargin * 2) / (windowW + 4));
            for (let w = 0; w < windowsPerFloor; w++) {
              const wx = block.bx + windowMargin + w * (windowW + 4);
              const litSeed = Math.sin(bi * 7 + f * 3.7 + w * 11.3 + Math.floor(time * 0.8) * 0.5);
              const isLit = litSeed > -0.3;
              const litAlpha = isLit ? 0.4 + Math.sin(time * 1.5 + f * 0.5 + w * 0.3) * 0.2 : 0.05;
              ctx.fillStyle = isLit ? `rgba(${c.r}, ${c.g}, ${c.b}, ${litAlpha})` : `rgba(255, 255, 255, 0.03)`;
              ctx.fillRect(wx, floorY, windowW, windowH);
              if (isLit && litAlpha > 0.3) {
                ctx.shadowBlur = 6;
                ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, 0.5)`;
                ctx.fillRect(wx, floorY, windowW, windowH);
                ctx.shadowBlur = 0;
              }
            }
          }
          if (rawProgress < 0.95) {
            const scaffoldY = by;
            ctx.strokeStyle = `rgba(255, 200, 50, ${0.3 + Math.sin(time * 4 + bi) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(block.bx - 5, scaffoldY);
            ctx.lineTo(block.bx + block.bw + 5, scaffoldY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(block.bx - 5, scaffoldY + 8);
            ctx.lineTo(block.bx + block.bw + 5, scaffoldY + 8);
            ctx.stroke();
            for (let s = 0; s < 3; s++) {
              const sx = block.bx + block.bw / 3 * s + block.bw / 6;
              ctx.beginPath();
              ctx.moveTo(sx, scaffoldY - 5);
              ctx.lineTo(sx, scaffoldY + 12);
              ctx.stroke();
            }
            if (bi === 2) {
              const craneBaseX = block.bx + block.bw / 2;
              const craneTopY = scaffoldY - 45;
              const craneArmLen = 70;
              const craneSwing = Math.sin(time * 0.6) * 0.3;
              ctx.strokeStyle = `rgba(255, 200, 50, 0.4)`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(craneBaseX, scaffoldY);
              ctx.lineTo(craneBaseX, craneTopY);
              ctx.stroke();
              ctx.save();
              ctx.translate(craneBaseX, craneTopY);
              ctx.rotate(craneSwing);
              ctx.beginPath();
              ctx.moveTo(-craneArmLen * 0.3, 0);
              ctx.lineTo(craneArmLen * 0.7, 0);
              ctx.stroke();
              const wireLen = 20 + Math.sin(time * 1.2) * 8;
              ctx.beginPath();
              ctx.moveTo(craneArmLen * 0.5, 0);
              ctx.lineTo(craneArmLen * 0.5, wireLen);
              ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              const blockC = msColors[(Math.floor(time * 2) + bi) % msColors.length];
              ctx.fillStyle = `rgba(${blockC.r}, ${blockC.g}, ${blockC.b}, 0.6)`;
              ctx.fillRect(craneArmLen * 0.5 - 5, wireLen, 10, 8);
              ctx.restore();
            }
          }
          if (rawProgress > 0.9) {
            const glowAlpha = (rawProgress - 0.9) * 10 * 0.3 * (0.5 + Math.sin(time * 3 + bi) * 0.5);
            const topGlow = ctx.createRadialGradient(block.bx + block.bw / 2, by, 0, block.bx + block.bw / 2, by, 30);
            topGlow.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${glowAlpha})`);
            topGlow.addColorStop(1, "transparent");
            ctx.fillStyle = topGlow;
            ctx.beginPath();
            ctx.arc(block.bx + block.bw / 2, by, 30, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        for (let cp = 0; cp < 15; cp++) {
          const cpSeed = cp * 9.17 + 4.3;
          const cpX = Math.sin(cpSeed * 2.3 + time * 0.5) * 200;
          const cpBaseY = groundY - Math.abs(Math.sin(cpSeed * 1.7)) * 250;
          const cpY = cpBaseY - (time * 20 + cpSeed * 30) % 80;
          const cpSize = 0.5 + Math.abs(Math.sin(cpSeed * 3.1)) * 1.5;
          const cpAlpha = 0.15 + Math.sin(time * 2 + cpSeed) * 0.1;
          const cpColor = msColors[cp % msColors.length];
          ctx.fillStyle = `rgba(${cpColor.r}, ${cpColor.g}, ${cpColor.b}, ${cpAlpha})`;
          ctx.beginPath();
          ctx.arc(cpX, cpY, cpSize, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let aura = 0; aura < 5; aura++) {
          const auraR = 200 + aura * 45 + Math.sin(time * 1.2 + aura * 0.8) * 12;
          const auraGrad = ctx.createRadialGradient(0, 0, auraR * 0.05, 0, 0, auraR);
          const aAlpha = 0.05 - aura * 8e-3;
          auraGrad.addColorStop(0, `rgba(${msColors[2].r}, ${msColors[2].g}, ${msColors[2].b}, ${aAlpha + 0.03})`);
          auraGrad.addColorStop(0.3, `rgba(${msColors[1].r}, ${msColors[1].g}, ${msColors[1].b}, ${aAlpha})`);
          auraGrad.addColorStop(0.6, `rgba(${msColors[3].r}, ${msColors[3].g}, ${msColors[3].b}, ${aAlpha * 0.8})`);
          auraGrad.addColorStop(0.85, `rgba(${msColors[0].r}, ${msColors[0].g}, ${msColors[0].b}, ${aAlpha * 0.4})`);
          auraGrad.addColorStop(1, "transparent");
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, auraR, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let ring = 0; ring < 4; ring++) {
          ctx.save();
          const ringSpeed = 0.6 + ring * 0.15;
          ctx.rotate(time * ringSpeed * (ring % 2 === 0 ? 1 : -1) + ring * Math.PI * 0.25);
          const c = msColors[ring];
          const ringAlpha = 0.25 + Math.sin(time * 2 + ring * 1.5) * 0.1;
          ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${ringAlpha})`;
          ctx.lineWidth = 2 + ring * 0.3;
          ctx.setLineDash([20 + ring * 5, 15 + ring * 8]);
          ctx.beginPath();
          ctx.ellipse(0, 0, 150 - ring * 20, 90 - ring * 12, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        const logoScale = 1 + Math.sin(time * 3) * 0.08;
        const logoRotation = Math.sin(time * 0.5) * 0.15;
        ctx.save();
        ctx.rotate(logoRotation);
        ctx.scale(logoScale, logoScale);
        const quadSize = 28;
        const gap = 4;
        const quads = [
          { x: -quadSize - gap / 2, y: -quadSize - gap / 2, color: msColors[0] },
          { x: gap / 2, y: -quadSize - gap / 2, color: msColors[1] },
          { x: -quadSize - gap / 2, y: gap / 2, color: msColors[2] },
          { x: gap / 2, y: gap / 2, color: msColors[3] }
        ];
        quads.forEach((q, qi) => {
          const pulse = Math.sin(time * 4 + qi * 1.5) * 0.2;
          const alpha = 0.7 + pulse;
          const glowGrad = ctx.createRadialGradient(
            q.x + quadSize / 2,
            q.y + quadSize / 2,
            0,
            q.x + quadSize / 2,
            q.y + quadSize / 2,
            quadSize * 2
          );
          glowGrad.addColorStop(0, `rgba(${q.color.r}, ${q.color.g}, ${q.color.b}, ${alpha * 0.5})`);
          glowGrad.addColorStop(0.5, `rgba(${q.color.r}, ${q.color.g}, ${q.color.b}, ${alpha * 0.15})`);
          glowGrad.addColorStop(1, "transparent");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(q.x + quadSize / 2, q.y + quadSize / 2, quadSize * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 25;
          ctx.shadowColor = `rgba(${q.color.r}, ${q.color.g}, ${q.color.b}, 0.9)`;
          ctx.fillStyle = `rgba(${q.color.r}, ${q.color.g}, ${q.color.b}, ${alpha})`;
          ctx.beginPath();
          ctx.roundRect(q.x, q.y, quadSize, quadSize, 3);
          ctx.fill();
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + pulse * 0.3})`;
          ctx.beginPath();
          ctx.roundRect(q.x + 3, q.y + 3, quadSize * 0.4, quadSize * 0.3, 2);
          ctx.fill();
        });
        ctx.restore();
        ctx.shadowBlur = 0;
        for (let beam = 0; beam < 16; beam++) {
          const beamAngle = beam / 16 * Math.PI * 2 + time * 0.3;
          const beamLength = 120 + Math.sin(time * 2.5 + beam * 0.9) * 40;
          const beamColor = msColors[beam % 4];
          const beamAlpha = 0.12 + Math.sin(time * 3 + beam * 0.7) * 0.06;
          const beamGrad = ctx.createLinearGradient(
            0,
            0,
            Math.cos(beamAngle) * beamLength,
            Math.sin(beamAngle) * beamLength
          );
          beamGrad.addColorStop(0, `rgba(${beamColor.r}, ${beamColor.g}, ${beamColor.b}, ${beamAlpha * 2})`);
          beamGrad.addColorStop(0.5, `rgba(${beamColor.r}, ${beamColor.g}, ${beamColor.b}, ${beamAlpha})`);
          beamGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const perpAngle1 = beamAngle + Math.PI / 2;
          const perpAngle2 = beamAngle - Math.PI / 2;
          const width = 3 + Math.sin(time * 4 + beam) * 1.5;
          ctx.lineTo(
            Math.cos(beamAngle) * beamLength + Math.cos(perpAngle1) * width,
            Math.sin(beamAngle) * beamLength + Math.sin(perpAngle1) * width
          );
          ctx.lineTo(
            Math.cos(beamAngle) * beamLength + Math.cos(perpAngle2) * width,
            Math.sin(beamAngle) * beamLength + Math.sin(perpAngle2) * width
          );
          ctx.closePath();
          ctx.fillStyle = beamGrad;
          ctx.fill();
        }
        ctx.shadowBlur = 6;
        for (let p = 0; p < 30; p++) {
          const pSeed = p * 5.71 + 2.3;
          const pAngle = time * (0.5 + Math.sin(pSeed) * 0.3) + pSeed;
          const pDist = 50 + Math.abs(Math.sin(pSeed * 2.1)) * 150;
          const px2 = Math.cos(pAngle) * pDist;
          const py = Math.sin(pAngle) * pDist * 0.7;
          const pSize = 1 + Math.abs(Math.sin(pSeed * 1.3)) * 2;
          const pAlpha = 0.4 + Math.sin(time * 3 + pSeed) * 0.3;
          const pColor = msColors[p % 4];
          ctx.shadowColor = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, 0.8)`;
          ctx.fillStyle = `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${pAlpha})`;
          ctx.beginPath();
          ctx.arc(px2, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        for (let b = 0; b < 12; b++) {
          const bAngle = time * 0.4 + b * (Math.PI * 2 / 12);
          const bDist = 130 + Math.sin(time * 1.5 + b) * 20;
          const bx = Math.cos(bAngle) * bDist;
          const by = Math.sin(bAngle) * bDist * 0.6;
          const bColor = msColors[b % 4];
          const bAlpha = 0.3 + Math.sin(time * 2 + b * 0.8) * 0.2;
          const char = Math.floor(time * 3 + b * 7) % 2 === 0 ? "0" : "1";
          ctx.fillStyle = `rgba(${bColor.r}, ${bColor.g}, ${bColor.b}, ${bAlpha})`;
          ctx.fillText(char, bx, by);
        }
        const flashPulse = Math.sin(time * 5);
        if (flashPulse > 0.8) {
          const flashR = 60 + (flashPulse - 0.8) * 200;
          const flashGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, flashR);
          flashGrad.addColorStop(0, `rgba(255, 255, 255, ${(flashPulse - 0.8) * 1.5})`);
          flashGrad.addColorStop(
            0.4,
            `rgba(${msColors[2].r}, ${msColors[2].g}, ${msColors[2].b}, ${(flashPulse - 0.8) * 0.5})`
          );
          flashGrad.addColorStop(1, "transparent");
          ctx.fillStyle = flashGrad;
          ctx.beginPath();
          ctx.arc(0, 0, flashR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${msColors[2].r}, ${msColors[2].g}, ${msColors[2].b}, 0.7)`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(labelText, 0, 85);
        ctx.font = "11px Arial";
        ctx.fillStyle = `rgba(${msColors[2].r}, ${msColors[2].g}, ${msColors[2].b}, 0.7)`;
        ctx.shadowBlur = 0;
        ctx.fillText(sublabelText, 0, 102);
        ctx.restore();
      }
      // 메인 연표 중간 지점에 현실적이고 압도적인 블랙홀 시각 효과 렌더링
      drawBlackHoleEffect(ctx, x, y) {
        const time = Date.now() * 1e-3;
        ctx.save();
        ctx.translate(x, y);
        for (let gl = 0; gl < 5; gl++) {
          const glRadius = 220 + gl * 35 + Math.sin(time * 0.8 + gl * 1.2) * 8;
          const glAlpha = 0.03 - gl * 4e-3;
          const glGrad = ctx.createRadialGradient(0, 0, glRadius - 20, 0, 0, glRadius + 20);
          glGrad.addColorStop(0, "transparent");
          glGrad.addColorStop(0.3, `rgba(255, 140, 50, ${glAlpha})`);
          glGrad.addColorStop(0.5, `rgba(255, 200, 100, ${glAlpha * 1.5})`);
          glGrad.addColorStop(0.7, `rgba(255, 140, 50, ${glAlpha})`);
          glGrad.addColorStop(1, "transparent");
          ctx.fillStyle = glGrad;
          ctx.beginPath();
          ctx.arc(0, 0, glRadius + 20, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let disk = 0; disk < 4; disk++) {
          ctx.save();
          const diskSpeed = 0.15 + disk * 0.08;
          const diskTilt = 0.35 + disk * 0.05;
          ctx.rotate(time * diskSpeed * (disk % 2 === 0 ? 1 : -1));
          const innerR = 80 + disk * 25;
          const outerR = innerR + 50 - disk * 5;
          for (let seg = 0; seg < 72; seg++) {
            const segAngle = seg / 72 * Math.PI * 2;
            const nextAngle = (seg + 1) / 72 * Math.PI * 2;
            const dopplerPhase = Math.sin(segAngle + time * diskSpeed * 2);
            const rCol = Math.floor(255 - dopplerPhase * 80);
            const gCol = Math.floor(120 + dopplerPhase * 60 + disk * 15);
            const bCol = Math.floor(30 + Math.max(0, dopplerPhase) * 120);
            const segAlpha = (0.15 - disk * 0.025) * (0.6 + Math.sin(segAngle * 3 + time * 2) * 0.4);
            ctx.beginPath();
            ctx.arc(0, 0, outerR, segAngle, nextAngle);
            ctx.arc(0, 0, innerR, nextAngle, segAngle, true);
            ctx.closePath();
            ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${segAlpha})`;
            ctx.fill();
          }
          for (let hs = 0; hs < 3; hs++) {
            const hsAngle = time * (diskSpeed * 1.5) + hs * (Math.PI * 2 / 3) + disk * 0.5;
            const hsR = (innerR + outerR) / 2 + Math.sin(time * 3 + hs) * 10;
            const hsx = Math.cos(hsAngle) * hsR;
            const hsy = Math.sin(hsAngle) * hsR * diskTilt;
            const hsSize = 6 + Math.sin(time * 5 + hs * 2) * 3;
            const hsGrad = ctx.createRadialGradient(hsx, hsy, 0, hsx, hsy, hsSize * 3);
            hsGrad.addColorStop(0, `rgba(255, 255, 220, ${0.8 - disk * 0.15})`);
            hsGrad.addColorStop(0.3, `rgba(255, 200, 100, ${0.4 - disk * 0.08})`);
            hsGrad.addColorStop(1, "transparent");
            ctx.fillStyle = hsGrad;
            ctx.beginPath();
            ctx.arc(hsx, hsy, hsSize * 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        for (let jet = 0; jet < 2; jet++) {
          const jetDir = jet === 0 ? -1 : 1;
          ctx.save();
          const jetLength = 300 + Math.sin(time * 1.5) * 30;
          const jetGrad = ctx.createLinearGradient(0, 0, 0, jetDir * jetLength);
          jetGrad.addColorStop(0, "rgba(100, 150, 255, 0.6)");
          jetGrad.addColorStop(0.2, "rgba(150, 180, 255, 0.3)");
          jetGrad.addColorStop(0.5, "rgba(120, 160, 255, 0.12)");
          jetGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.moveTo(-8, 0);
          ctx.lineTo(-25, jetDir * jetLength * 0.7);
          ctx.lineTo(0, jetDir * jetLength);
          ctx.lineTo(25, jetDir * jetLength * 0.7);
          ctx.lineTo(8, 0);
          ctx.closePath();
          ctx.fillStyle = jetGrad;
          ctx.fill();
          for (let fil = 0; fil < 5; fil++) {
            ctx.beginPath();
            const filPhase = time * 3 + fil * 1.2;
            const filY1 = jetDir * (20 + fil * 40);
            const filY2 = jetDir * (60 + fil * 40);
            const jitter = Math.sin(filPhase) * (5 + fil * 2);
            ctx.moveTo(jitter, filY1);
            ctx.quadraticCurveTo(jitter + Math.sin(filPhase + 1) * 10, (filY1 + filY2) / 2, -jitter, filY2);
            ctx.strokeStyle = `rgba(180, 200, 255, ${0.3 - fil * 0.04})`;
            ctx.lineWidth = 1.5 - fil * 0.2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(100, 150, 255, 0.5)";
            ctx.stroke();
          }
          ctx.restore();
        }
        ctx.save();
        const photonR = 72 + Math.sin(time * 2) * 3;
        const photonGrad = ctx.createRadialGradient(0, 0, photonR - 5, 0, 0, photonR + 8);
        photonGrad.addColorStop(0, "transparent");
        photonGrad.addColorStop(0.3, "rgba(255, 200, 120, 0.25)");
        photonGrad.addColorStop(0.5, "rgba(255, 255, 200, 0.5)");
        photonGrad.addColorStop(0.7, "rgba(255, 200, 120, 0.25)");
        photonGrad.addColorStop(1, "transparent");
        ctx.fillStyle = photonGrad;
        ctx.beginPath();
        ctx.arc(0, 0, photonR + 8, 0, Math.PI * 2);
        ctx.fill();
        for (let ph = 0; ph < 24; ph++) {
          const phAngle = time * 2.5 + ph / 24 * Math.PI * 2;
          const phR = photonR + Math.sin(time * 6 + ph * 0.5) * 3;
          const phx = Math.cos(phAngle) * phR;
          const phy = Math.sin(phAngle) * phR;
          const phAlpha = 0.4 + Math.sin(time * 8 + ph) * 0.3;
          const phSize = 1 + Math.sin(time * 4 + ph * 0.8) * 0.5;
          ctx.beginPath();
          ctx.arc(phx, phy, phSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 240, 180, ${phAlpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(255, 220, 120, 0.8)";
          ctx.fill();
        }
        ctx.restore();
        const ehRadius = 55 + Math.sin(time * 1.5) * 2;
        for (let hr = 0; hr < 12; hr++) {
          const hrAngle = time * 0.8 + hr / 12 * Math.PI * 2;
          const hrDist = ehRadius + 3 + Math.random() * 8;
          const hrx = Math.cos(hrAngle) * hrDist;
          const hry = Math.sin(hrAngle) * hrDist;
          const hrSize = 0.5 + Math.random() * 1;
          const hrAlpha = 0.2 + Math.random() * 0.3;
          ctx.beginPath();
          ctx.arc(hrx, hry, hrSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${hrAlpha})`;
          ctx.shadowBlur = 5;
          ctx.shadowColor = "rgba(180, 200, 255, 0.5)";
          ctx.fill();
        }
        const ehGlow = ctx.createRadialGradient(0, 0, ehRadius - 3, 0, 0, ehRadius + 12);
        ehGlow.addColorStop(0, "rgba(0, 0, 0, 1)");
        ehGlow.addColorStop(0.5, "rgba(20, 10, 5, 0.9)");
        ehGlow.addColorStop(0.7, "rgba(255, 120, 50, 0.15)");
        ehGlow.addColorStop(0.85, "rgba(255, 80, 20, 0.05)");
        ehGlow.addColorStop(1, "transparent");
        ctx.fillStyle = ehGlow;
        ctx.beginPath();
        ctx.arc(0, 0, ehRadius + 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, ehRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.shadowBlur = 0;
        ctx.fill();
        for (let stream = 0; stream < 6; stream++) {
          const sAngle = time * 0.3 + stream * (Math.PI / 3);
          const spiralTurns = 1.5;
          ctx.beginPath();
          for (let t = 0; t <= 1; t += 0.01) {
            const angle = sAngle + t * Math.PI * 2 * spiralTurns;
            const dist = 250 * (1 - t * 0.75);
            const sx = Math.cos(angle) * dist;
            const sy = Math.sin(angle) * dist * 0.5;
            if (t === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          const streamAlpha = 0.08 + Math.sin(time * 2 + stream) * 0.04;
          ctx.strokeStyle = `rgba(255, 160, 80, ${streamAlpha})`;
          ctx.lineWidth = 2 - Math.sin(time + stream) * 0.5;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(255, 130, 50, 0.3)";
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        for (let db = 0; db < 30; db++) {
          const dbSeed = db * 7.13 + 3.7;
          const dbAngle = time * (0.1 + Math.sin(dbSeed) * 0.15) + dbSeed;
          const dbDist = 120 + Math.abs(Math.sin(dbSeed * 2.3)) * 180;
          const dbx = Math.cos(dbAngle) * dbDist;
          const dby = Math.sin(dbAngle) * dbDist * (0.3 + Math.abs(Math.sin(dbSeed * 1.7)) * 0.4);
          const dbSize = 0.5 + Math.abs(Math.sin(dbSeed * 3.1)) * 1.5;
          const dbAlpha = 0.15 + Math.sin(time * 2 + dbSeed) * 0.1;
          const distFactor = 1 - Math.max(0, Math.min(1, (dbDist - 120) / 180));
          const rr = Math.floor(180 + distFactor * 75);
          const rg = Math.floor(100 + distFactor * 60);
          const rb = Math.floor(50 + (1 - distFactor) * 100);
          ctx.beginPath();
          ctx.arc(dbx, dby, dbSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rr}, ${rg}, ${rb}, ${dbAlpha + distFactor * 0.2})`;
          ctx.fill();
        }
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 160, 80, 0.6)";
        ctx.fillStyle = "rgba(255, 200, 140, 0.8)";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SINGULARITY", 0, ehRadius + 50);
        ctx.font = "12px Arial";
        ctx.fillStyle = "rgba(255, 200, 140, 0.5)";
        ctx.shadowBlur = 0;
        ctx.fillText("Gravitational Lensing Active", 0, ehRadius + 70);
        ctx.restore();
      }
      // 산업 패러다임을 바꾼 초대형 사건에 적용되는 '제우스 번개' 특수 시각 효과 렌더링
      drawPsionicStorm(ctx, x, y) {
        const time = Date.now() * 1e-3;
        ctx.save();
        ctx.translate(x, y);
        for (let aura = 0; aura < 4; aura++) {
          const auraR = 260 + aura * 40 + Math.sin(time * 1.5 + aura) * 15;
          const auraGrad = ctx.createRadialGradient(0, 0, auraR * 0.05, 0, 0, auraR);
          const aAlpha = 0.06 - aura * 0.012;
          auraGrad.addColorStop(0, `rgba(180, 160, 255, ${aAlpha + 0.04})`);
          auraGrad.addColorStop(0.25, `rgba(120, 80, 255, ${aAlpha})`);
          auraGrad.addColorStop(0.5, `rgba(255, 220, 80, ${aAlpha * 0.7})`);
          auraGrad.addColorStop(0.8, `rgba(255, 180, 50, ${aAlpha * 0.3})`);
          auraGrad.addColorStop(1, "transparent");
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, auraR, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let ring = 0; ring < 3; ring++) {
          ctx.save();
          ctx.rotate(time * (ring === 0 ? 1 : ring === 1 ? -0.7 : 0.4) + ring * Math.PI * 0.33);
          const ringAlpha = 0.2 + Math.sin(time * 2.5 + ring * 1.5) * 0.1;
          const ringColor = ring === 0 ? `rgba(180, 140, 255, ${ringAlpha})` : ring === 1 ? `rgba(255, 220, 80, ${ringAlpha})` : `rgba(100, 180, 255, ${ringAlpha})`;
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = 1.5 + ring * 0.3;
          ctx.setLineDash([25 - ring * 5, 12 + ring * 8]);
          ctx.beginPath();
          ctx.ellipse(0, 0, 170 - ring * 25, 95 - ring * 18, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        const lightningPhase = Math.floor(time * 10);
        const flashIntensity = Math.sin(lightningPhase * 1.3);
        const stormActive = flashIntensity > -0.3;
        if (stormActive) {
          const branchCount = 7 + Math.floor(Math.abs(Math.sin(lightningPhase * 0.7)) * 5);
          for (let i = 0; i < branchCount; i++) {
            const seed = lightningPhase + i * 13.7;
            if (Math.abs(Math.sin(seed * 0.5)) < 0.25) continue;
            const angle = Math.PI * 2 * i / branchCount + Math.sin(seed * 0.8) * 0.5;
            const reach = 130 + Math.abs(Math.sin(seed * 2.3)) * 90;
            for (let pass = 0; pass < 3; pass++) {
              ctx.beginPath();
              ctx.moveTo(0, 0);
              let cx = 0;
              let cy = 0;
              const segs = 7 + Math.floor(Math.abs(Math.sin(seed * 1.5)) * 4);
              for (let s = 1; s <= segs; s++) {
                const t = s / segs;
                const dist = reach * t;
                const jitter = 30 - t * 15;
                const jx = Math.sin(seed * s * 4.7 + time * 3) * jitter;
                const jy = Math.cos(seed * s * 6.3 + time * 3) * jitter;
                cx = Math.cos(angle) * dist + jx;
                cy = Math.sin(angle) * dist + jy;
                if (s === 1) {
                  ctx.lineTo(cx, cy);
                } else {
                  const prevDist = reach * ((s - 1) / segs);
                  const midX = (Math.cos(angle) * prevDist + cx) / 2 + Math.sin(seed * s * 1.3) * 10;
                  const midY = (Math.sin(angle) * prevDist + cy) / 2 + Math.cos(seed * s * 1.3) * 10;
                  ctx.quadraticCurveTo(midX, midY, cx, cy);
                }
              }
              if (pass === 0) {
                ctx.strokeStyle = `rgba(160, 100, 255, ${0.2 + flashIntensity * 0.1})`;
                ctx.lineWidth = 8;
                ctx.shadowBlur = 40;
                ctx.shadowColor = "rgba(140, 80, 255, 0.8)";
              } else if (pass === 1) {
                ctx.strokeStyle = `rgba(255, 230, 80, ${0.35 + flashIntensity * 0.15})`;
                ctx.lineWidth = 3.5;
                ctx.shadowBlur = 25;
                ctx.shadowColor = "rgba(255, 210, 60, 0.9)";
              } else {
                ctx.strokeStyle = `rgba(255, 255, 240, ${0.85 + flashIntensity * 0.15})`;
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 12;
                ctx.shadowColor = "rgba(255, 255, 220, 1.0)";
              }
              ctx.stroke();
            }
            for (let br = 0; br < 2; br++) {
              if (Math.abs(Math.sin(seed * (11 + br * 7))) < 0.45) continue;
              const branchPoint = 0.3 + br * 0.25 + Math.abs(Math.sin(seed * (5 + br))) * 0.15;
              const bx = Math.cos(angle) * reach * branchPoint;
              const by = Math.sin(angle) * reach * branchPoint;
              const bAngle = angle + (Math.sin(seed * (3 + br)) > 0 ? 0.7 : -0.7);
              const bReach = reach * (0.3 + br * 0.1);
              for (let bPass = 0; bPass < 2; bPass++) {
                ctx.beginPath();
                ctx.moveTo(bx, by);
                let endBx = bx;
                let endBy = by;
                const bSegs = 3 + Math.floor(Math.abs(Math.sin(seed * br * 3)) * 2);
                for (let bs = 1; bs <= bSegs; bs++) {
                  const bt = bs / bSegs;
                  const bdist = bReach * bt;
                  const bjx = Math.sin(seed * bs * 8 + time * 2) * (15 - bt * 8);
                  const bjy = Math.cos(seed * bs * 9 + time * 2) * (15 - bt * 8);
                  endBx = bx + Math.cos(bAngle) * bdist + bjx;
                  endBy = by + Math.sin(bAngle) * bdist + bjy;
                  ctx.lineTo(endBx, endBy);
                }
                if (bPass === 0) {
                  ctx.strokeStyle = `rgba(180, 140, 255, ${0.3 + flashIntensity * 0.1})`;
                  ctx.lineWidth = 2.5;
                  ctx.shadowBlur = 15;
                  ctx.shadowColor = "rgba(160, 100, 255, 0.7)";
                } else {
                  ctx.strokeStyle = `rgba(255, 245, 180, ${0.6 + flashIntensity * 0.15})`;
                  ctx.lineWidth = 0.8;
                  ctx.shadowBlur = 8;
                  ctx.shadowColor = "rgba(255, 240, 120, 0.8)";
                }
                ctx.stroke();
              }
            }
          }
          if (flashIntensity > 0.7) {
            const flashGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 200);
            flashGrad.addColorStop(0, `rgba(255, 255, 255, ${(flashIntensity - 0.7) * 0.4})`);
            flashGrad.addColorStop(0.5, `rgba(180, 160, 255, ${(flashIntensity - 0.7) * 0.15})`);
            flashGrad.addColorStop(1, "transparent");
            ctx.fillStyle = flashGrad;
            ctx.beginPath();
            ctx.arc(0, 0, 200, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        const corePulse = Math.sin(time * 6) * 5;
        const coreR = 16 + corePulse;
        const outerCore = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR + 35);
        outerCore.addColorStop(0, "rgba(200, 170, 255, 0.6)");
        outerCore.addColorStop(0.4, "rgba(140, 80, 255, 0.3)");
        outerCore.addColorStop(1, "transparent");
        ctx.shadowBlur = 40;
        ctx.shadowColor = "rgba(140, 80, 255, 0.9)";
        ctx.fillStyle = outerCore;
        ctx.beginPath();
        ctx.arc(0, 0, coreR + 35, 0, Math.PI * 2);
        ctx.fill();
        const innerCore = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR + 10);
        innerCore.addColorStop(0, "rgba(255, 255, 255, 0.98)");
        innerCore.addColorStop(0.3, "rgba(255, 240, 140, 0.8)");
        innerCore.addColorStop(0.7, "rgba(255, 200, 60, 0.3)");
        innerCore.addColorStop(1, "transparent");
        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(255, 230, 80, 0.9)";
        ctx.fillStyle = innerCore;
        ctx.beginPath();
        ctx.arc(0, 0, coreR + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 8;
        for (let p = 0; p < 18; p++) {
          const pAngle = time * (1.2 + p * 0.25) + p * 0.35;
          const pDist = 35 + Math.sin(time * 2.5 + p * 0.9) * 25;
          const px2 = Math.cos(pAngle) * pDist;
          const py = Math.sin(pAngle) * pDist;
          const pSize = 1.2 + Math.sin(time * 5 + p * 0.7) * 0.8;
          const pAlpha = 0.5 + Math.sin(time * 3.5 + p * 0.6) * 0.3;
          const pColor = p % 3 === 0 ? `rgba(180, 140, 255, ${pAlpha})` : p % 3 === 1 ? `rgba(255, 230, 120, ${pAlpha})` : `rgba(255, 255, 255, ${pAlpha})`;
          ctx.shadowColor = pColor;
          ctx.fillStyle = pColor;
          ctx.beginPath();
          ctx.arc(px2, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }
        if (Math.sin(time * 7) > 0.3) {
          for (let arc = 0; arc < 3; arc++) {
            const arcSeed = Math.floor(time * 5) + arc * 31;
            const arcAngle = Math.PI * 2 * arc / 3 + Math.sin(arcSeed) * 0.8;
            const arcStart = 180 + Math.sin(arcSeed * 2) * 20;
            const arcEnd = arcStart + 40 + Math.abs(Math.sin(arcSeed * 3)) * 30;
            ctx.beginPath();
            const segments = 5;
            for (let s = 0; s <= segments; s++) {
              const t = s / segments;
              const d = arcStart + (arcEnd - arcStart) * t;
              const jx = Math.sin(arcSeed * s * 5 + time) * 15;
              const jy = Math.cos(arcSeed * s * 7 + time) * 15;
              const ax = Math.cos(arcAngle + t * 0.3) * d + jx;
              const ay = Math.sin(arcAngle + t * 0.3) * d + jy;
              if (s === 0) ctx.moveTo(ax, ay);
              else ctx.lineTo(ax, ay);
            }
            ctx.strokeStyle = `rgba(160, 120, 255, ${0.3 + Math.sin(time * 8 + arc) * 0.2})`;
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(140, 100, 255, 0.6)";
            ctx.stroke();
          }
        }
        const symbolY = -55 + Math.sin(time * 2) * 5;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255, 220, 60, 0.9)";
        ctx.fillStyle = "rgba(255, 230, 80, 0.9)";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("\u26A1", 0, symbolY);
        ctx.restore();
      }
      // 2024년 3월 기업들의 할루시네이션 감소 노력을 상징하는 신비로운 별자리 효과 렌더링
      drawHallucinationReductionEffect(ctx, centerX, centerY, alpha) {
        if (alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        const time = Date.now() * 1e-3;
        const points = [];
        this.reductionConstellationStars.forEach((s) => {
          const x = centerX + s.ox + Math.cos(time * s.speed * 50 + s.phase) * 15;
          const y = centerY + s.oy + Math.sin(time * s.speed * 50 + s.phase) * 15;
          points.push({ x, y });
          ctx.beginPath();
          ctx.arc(x, y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#00ffd4";
          ctx.fill();
        });
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 255, 212, 0.4)";
        ctx.lineWidth = 0.8;
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dist = Math.sqrt(Math.pow(points[i].x - points[j].x, 2) + Math.pow(points[i].y - points[j].y, 2));
            if (dist < 130) {
              ctx.moveTo(points[i].x, points[i].y);
              ctx.lineTo(points[j].x, points[j].y);
            }
          }
        }
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.font = "900 24px Arial";
        ctx.fillStyle = "#00ffd4";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(0, 255, 212, 0.8)";
        ctx.fillText("2024.03 MILESTONE", centerX, centerY - 160);
        ctx.font = "18px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = 5;
        ctx.fillText(this.textData.hallucinationReductionMsg, centerX, centerY - 130);
        ctx.font = "20px Arial";
        ctx.fillText("\u25BC", centerX, centerY - 100);
        ctx.restore();
      }
      // AI 할루시네이션 개별 사례들을 메인 연표의 특정 시점에 경고 노드 형태로 생성
      createHallucinationCaseNodes() {
        const wrapper = document.getElementById("timeline-wrapper");
        if (!wrapper || !this.appData.hallucinationData) return;
        this.hallucinationCaseNodes = [];
        this.appData.hallucinationData.cases.forEach((c, idx) => {
          const cleanDate = c.date.split("~")[0];
          const dateParts = cleanDate.split(".");
          const year = parseInt(dateParts[0]);
          const month = dateParts[1] ? parseInt(dateParts[1]) : 1;
          const container = AppHelper.createUIElement(
            "div",
            `hallucination-case-node-${idx}`,
            {
              position: "absolute",
              top: "70%",
              width: "40px",
              height: "40px",
              backgroundColor: "rgba(40, 15, 10, 0.9)",
              border: "2px solid #ff5e3a",
              borderRadius: "50%",
              cursor: "pointer",
              zIndex: "28",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "auto",
              boxShadow: "0 0 15px rgba(255, 94, 58, 0.4)",
              transition: "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
              transform: "translate(-50%, -50%)"
            },
            "\u26A0\uFE0F",
            [
              {
                event: "click",
                handler: () => {
                  this.playSound("click");
                  this.showHallucinationCaseDetail(c);
                }
              },
              {
                event: "mouseenter",
                handler: (e) => {
                  const t = e.currentTarget;
                  t.style.transform = "translate(-50%, -50%) scale(1.3)";
                  t.style.backgroundColor = "rgba(255, 94, 58, 0.8)";
                  t.style.boxShadow = "0 0 30px #ff5e3a";
                  this.playSound("pop");
                }
              },
              {
                event: "mouseleave",
                handler: (e) => {
                  const t = e.currentTarget;
                  t.style.transform = "translate(-50%, -50%) scale(1)";
                  t.style.backgroundColor = "rgba(40, 15, 10, 0.9)";
                  t.style.boxShadow = "0 0 15px rgba(255, 94, 58, 0.4)";
                }
              }
            ]
          );
          gsapWithCSS.to(container, {
            opacity: 0.6,
            duration: 0.8 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
          wrapper.appendChild(container);
          this.hallucinationCaseNodes.push(container);
        });
      }
      // 선택한 할루시네이션 사례의 상세 내용을 경고 테마의 팝업으로 표시
      showHallucinationCaseDetail(c) {
        const overlay = AppHelper.createUIElement("div", "case-detail-overlay", {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(10, 5, 0, 0.96)",
          backdropFilter: "blur(40px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "2300",
          pointerEvents: "auto"
        });
        const modal = AppHelper.createUIElement("div", "", {
          width: "550px",
          padding: "50px",
          backgroundColor: "rgba(30, 10, 5, 0.95)",
          border: "2px solid #ff5e3a",
          borderRadius: "30px",
          textAlign: "center",
          color: "white",
          boxShadow: "0 0 80px rgba(255, 94, 58, 0.2)",
          position: "relative"
        });
        const icon = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "60px",
            marginBottom: "20px",
            filter: "drop-shadow(0 0 10px #ff5e3a)"
          },
          "\u26A0\uFE0F"
        );
        const title = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "28px",
            color: "#ff5e3a",
            marginBottom: "10px",
            fontWeight: "900"
          },
          c.title
        );
        const date = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: "30px",
            letterSpacing: "2px"
          },
          `REPORTED: ${c.date}`
        );
        const desc = AppHelper.createUIElement(
          "p",
          "",
          {
            fontSize: "18px",
            lineHeight: "1.7",
            color: "rgba(255, 255, 255, 0.8)",
            marginBottom: "40px",
            wordBreak: "keep-all"
          },
          c.description
        );
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            padding: "15px 50px",
            backgroundColor: "transparent",
            color: "#ff5e3a",
            border: "1px solid #ff5e3a",
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                gsapWithCSS.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => overlay.remove() });
              }
            }
          ]
        );
        modal.appendChild(icon);
        modal.appendChild(title);
        modal.appendChild(date);
        modal.appendChild(desc);
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(modal, { opacity: 0, y: 30, scale: 0.95, duration: 0.5, ease: "back.out(1.7)" });
      }
      // 특정 시점의 할루시네이션 개선 사항을 화려한 효과와 함께 상세 팝업으로 표시
      showHallucinationTrendDetail(t) {
        const overlay = AppHelper.createUIElement("div", "trend-detail-overlay", {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(5, 2, 0, 0.97)",
          backdropFilter: "blur(60px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "2200",
          pointerEvents: "auto"
        });
        const modal = AppHelper.createUIElement("div", "", {
          width: "650px",
          padding: "60px",
          backgroundColor: "rgba(25, 10, 5, 0.98)",
          border: "1px solid rgba(255, 94, 58, 0.4)",
          borderRadius: "40px",
          textAlign: "center",
          color: "white",
          boxShadow: "0 0 120px rgba(255, 94, 58, 0.25)",
          position: "relative",
          overflow: "hidden"
        });
        const bgYear = AppHelper.createUIElement(
          "div",
          "",
          {
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "180px",
            fontWeight: "900",
            color: "rgba(255, 94, 58, 0.03)",
            pointerEvents: "none",
            zIndex: "0"
          },
          t.year
        );
        modal.appendChild(bgYear);
        const content = AppHelper.createUIElement("div", "", { position: "relative", zIndex: "1" });
        const title = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "36px",
            color: "#ff5e3a",
            marginBottom: "15px",
            fontWeight: "900",
            letterSpacing: "1px"
          },
          t.phase
        );
        const sub = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: "40px",
            letterSpacing: "4px",
            textTransform: "uppercase"
          },
          `Evolution Phase : ${t.year}`
        );
        const desc = AppHelper.createUIElement(
          "p",
          "",
          {
            fontSize: "20px",
            lineHeight: "1.8",
            color: "rgba(255, 255, 255, 0.85)",
            marginBottom: "50px",
            fontWeight: "300",
            wordBreak: "keep-all"
          },
          t.details
        );
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            padding: "18px 60px",
            backgroundColor: "transparent",
            color: "#ff5e3a",
            border: "2px solid #ff5e3a",
            borderRadius: "40px",
            fontSize: "18px",
            fontWeight: "900",
            cursor: "pointer",
            transition: "all 0.3s"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                gsapWithCSS.to(overlay, { opacity: 0, scale: 1.05, duration: 0.4, onComplete: () => overlay.remove() });
              }
            }
          ]
        );
        content.appendChild(title);
        content.appendChild(sub);
        content.appendChild(desc);
        content.appendChild(closeBtn);
        modal.appendChild(content);
        overlay.appendChild(modal);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(modal, { opacity: 0, y: 40, scale: 0.9, duration: 0.6, ease: "expo.out" });
      }
      // 2023~2026 할루시네이션 감소 트렌드 데이터를 연표 하단에 시각적으로 화려한 '발광 노드' 형태로 생성
      createHallucinationTimelineCards() {
        const wrapper = document.getElementById("timeline-wrapper");
        if (!wrapper || !this.appData.hallucinationData) return;
        this.hallucinationTimelineCards = [];
        this.appData.hallucinationData.timeline.forEach((trend, idx) => {
          const container = AppHelper.createUIElement(
            "div",
            `hallucination-trend-node-${idx}`,
            {
              position: "absolute",
              top: "76%",
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(35, 10, 5, 0.9)",
              border: "2px solid #ff5e3a",
              borderRadius: "50%",
              color: "white",
              pointerEvents: "auto",
              zIndex: "30",
              boxShadow: "0 0 25px rgba(255, 94, 58, 0.5), inset 0 0 10px rgba(255, 94, 58, 0.3)",
              backdropFilter: "blur(15px)",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
              transform: "translate(-50%, -50%)"
            },
            "",
            [
              {
                event: "click",
                handler: () => {
                  this.playSound("click");
                  this.showHallucinationTrendDetail(trend);
                }
              },
              {
                event: "mouseenter",
                handler: (e) => {
                  const t = e.currentTarget;
                  const label = t.querySelector(".floating-phase-label");
                  const guide = t.querySelector(".hover-guide");
                  t.style.transform = "translate(-50%, -50%) scale(1.2)";
                  t.style.boxShadow = "0 0 45px rgba(255, 94, 58, 0.8), inset 0 0 20px rgba(255, 94, 58, 0.4)";
                  if (label) {
                    label.style.opacity = "1";
                    label.style.transform = "translate(-50%, -20px)";
                  }
                  if (guide) guide.style.opacity = "1";
                  this.playSound("pop");
                }
              },
              {
                event: "mouseleave",
                handler: (e) => {
                  const t = e.currentTarget;
                  const label = t.querySelector(".floating-phase-label");
                  const guide = t.querySelector(".hover-guide");
                  t.style.transform = "translate(-50%, -50%) scale(1)";
                  t.style.boxShadow = "0 0 25px rgba(255, 94, 58, 0.5), inset 0 0 10px rgba(255, 94, 58, 0.3)";
                  if (label) {
                    label.style.opacity = "0";
                    label.style.transform = "translate(-50%, 0px)";
                  }
                  if (guide) guide.style.opacity = "0";
                }
              }
            ]
          );
          const statusLabel = AppHelper.createUIElement(
            "div",
            "",
            {
              position: "absolute",
              top: "-28px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(255, 94, 58, 0.9)",
              color: "white",
              fontSize: "10px",
              fontWeight: "900",
              padding: "3px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 10px rgba(255, 94, 58, 0.4)",
              pointerEvents: "none",
              zIndex: "35",
              letterSpacing: "0.5px"
            },
            this.textData.hallucinationNodeLabel
          );
          const icon = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "24px", filter: "drop-shadow(0 0 5px #ff5e3a)" },
            "\u{1F4C9}"
          );
          const yearLabel = AppHelper.createUIElement(
            "div",
            "",
            {
              position: "absolute",
              bottom: "-35px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "16px",
              fontWeight: "900",
              color: "#ff5e3a",
              textShadow: "0 0 10px rgba(255, 94, 58, 0.6)",
              whiteSpace: "nowrap",
              pointerEvents: "none"
            },
            trend.year
          );
          const phaseLabel = AppHelper.createUIElement(
            "div",
            "floating-phase-label",
            {
              position: "absolute",
              bottom: "75px",
              left: "50%",
              transform: "translate(-50%, 0px)",
              padding: "8px 20px",
              backgroundColor: "#ff5e3a",
              color: "#000",
              fontSize: "14px",
              fontWeight: "900",
              borderRadius: "8px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.5), 0 0 15px rgba(255, 94, 58, 0.4)",
              opacity: "0",
              whiteSpace: "nowrap",
              transition: "all 0.3s ease",
              pointerEvents: "none",
              zIndex: "40"
            },
            trend.phase
          );
          const hoverGuide = AppHelper.createUIElement(
            "div",
            "hover-guide",
            {
              position: "absolute",
              bottom: "115px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.6)",
              whiteSpace: "nowrap",
              opacity: "0",
              transition: "opacity 0.3s",
              pointerEvents: "none"
            },
            this.textData.trendClickGuide
          );
          container.appendChild(statusLabel);
          container.appendChild(icon);
          container.appendChild(yearLabel);
          container.appendChild(phaseLabel);
          container.appendChild(hoverGuide);
          gsapWithCSS.to(container, {
            boxShadow: "0 0 40px rgba(255, 94, 58, 0.8), inset 0 0 15px rgba(255, 94, 58, 0.5)",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
          wrapper.appendChild(container);
          this.hallucinationTimelineCards.push(container);
        });
      }
      // AI 할루시네이션(환각) 사례 및 감소 트렌드 정보를 보여주는 전용 섹션(오버레이) 구현
      showHallucinationInfo() {
        const data = this.appData.hallucinationData;
        if (!data) return;
        const overlay = AppHelper.createUIElement("div", "hallucination-overlay", {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(5, 10, 20, 0.98)",
          backdropFilter: "blur(50px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "50px 30px",
          zIndex: "1600",
          pointerEvents: "auto",
          boxSizing: "border-box"
        });
        const container = AppHelper.createUIElement("div", "", {
          width: "100%",
          maxWidth: "1100px",
          flex: "1",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          overflowY: "auto",
          paddingRight: "15px",
          boxSizing: "border-box"
        });
        const header = AppHelper.createUIElement("div", "", { textAlign: "center", marginBottom: "20px" });
        const title = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "46px",
            fontWeight: "900",
            color: "#ff5e3a",
            letterSpacing: "2px",
            textShadow: "0 0 30px rgba(255, 94, 58, 0.4)",
            marginBottom: "10px"
          },
          this.textData.hallucinationTitle
        );
        header.appendChild(title);
        container.appendChild(header);
        const casesSection = AppHelper.createUIElement("div", "");
        const casesTitle = AppHelper.createUIElement(
          "h3",
          "",
          {
            fontSize: "24px",
            color: "#fff",
            borderLeft: "5px solid #ff5e3a",
            paddingLeft: "15px",
            marginBottom: "25px"
          },
          this.textData.hallucinationCaseLabel
        );
        casesSection.appendChild(casesTitle);
        data.cases.forEach((c, idx) => {
          const card = AppHelper.createUIElement("div", "", {
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "20px 25px",
            marginBottom: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          });
          const cardTop = AppHelper.createUIElement("div", "", { display: "flex", gap: "15px", alignItems: "center" });
          const dateTag = AppHelper.createUIElement(
            "span",
            "",
            {
              fontSize: "13px",
              color: "#ff5e3a",
              fontWeight: "900",
              padding: "4px 10px",
              backgroundColor: "rgba(255, 94, 58, 0.15)",
              borderRadius: "4px"
            },
            c.date
          );
          const cardTitle = AppHelper.createUIElement(
            "span",
            "",
            {
              fontSize: "18px",
              fontWeight: "bold",
              color: "#fff"
            },
            c.title
          );
          cardTop.appendChild(dateTag);
          cardTop.appendChild(cardTitle);
          const cardDesc = AppHelper.createUIElement(
            "p",
            "",
            {
              fontSize: "15px",
              lineHeight: "1.7",
              color: "rgba(255,255,255,0.75)",
              margin: "0"
            },
            `\u2022 ${c.description}`
          );
          card.appendChild(cardTop);
          card.appendChild(cardDesc);
          casesSection.appendChild(card);
          gsapWithCSS.from(card, { opacity: 0, y: 20, delay: idx * 0.1, duration: 0.5 });
        });
        container.appendChild(casesSection);
        container.appendChild(
          AppHelper.createUIElement("div", "", {
            width: "100%",
            height: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            margin: "20px 0"
          })
        );
        const trendSection = AppHelper.createUIElement("div", "");
        const trendTitle = AppHelper.createUIElement(
          "h3",
          "",
          {
            fontSize: "24px",
            color: "#fff",
            borderLeft: "5px solid #00ffd4",
            paddingLeft: "15px",
            marginBottom: "25px"
          },
          this.textData.hallucinationTrendLabel
        );
        trendSection.appendChild(trendTitle);
        data.timeline.forEach((t, idx) => {
          const row = AppHelper.createUIElement("div", "", {
            display: "grid",
            gridTemplateColumns: "120px 200px 1fr",
            gap: "20px",
            padding: "20px",
            alignItems: "center",
            borderBottom: idx === data.timeline.length - 1 ? "none" : "1px dashed rgba(255,255,255,0.1)"
          });
          const year = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "24px", fontWeight: "900", color: "#00ffd4" },
            t.year
          );
          const phase = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "16px", fontWeight: "bold", color: "#fff" },
            t.phase
          );
          const details = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" },
            t.details
          );
          row.appendChild(year);
          row.appendChild(phase);
          row.appendChild(details);
          trendSection.appendChild(row);
          gsapWithCSS.from(row, { opacity: 0, x: -30, delay: 0.5 + idx * 0.1, duration: 0.5 });
        });
        container.appendChild(trendSection);
        const conclusionBox = AppHelper.createUIElement("div", "", {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid #ff5e3a",
          borderRadius: "20px",
          padding: "30px",
          marginTop: "20px"
        });
        const conclusionTitle = AppHelper.createUIElement(
          "h4",
          "",
          {
            fontSize: "18px",
            color: "#ff5e3a",
            marginBottom: "15px",
            fontWeight: "900"
          },
          this.textData.hallucinationConclusionLabel
        );
        const conclusionText = AppHelper.createUIElement(
          "p",
          "",
          {
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#fff",
            margin: "0"
          },
          data.conclusion
        );
        conclusionBox.appendChild(conclusionTitle);
        conclusionBox.appendChild(conclusionText);
        container.appendChild(conclusionBox);
        overlay.appendChild(container);
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            marginTop: "40px",
            padding: "15px 80px",
            backgroundColor: "transparent",
            color: "#ff5e3a",
            border: "2px solid #ff5e3a",
            borderRadius: "40px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
            pointerEvents: "auto"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                gsapWithCSS.to(overlay, { opacity: 0, scale: 0.98, duration: 0.3, onComplete: () => overlay.remove() });
              }
            }
          ]
        );
        overlay.appendChild(closeBtn);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(overlay, { opacity: 0, duration: 0.5 });
      }
      // 2023~2026 AI 패권 변화 데이터를 메인 연표의 특정 시점에 카드 형태로 추가 생성
      createHegemonyCards() {
        const wrapper = document.getElementById("timeline-wrapper");
        if (!wrapper || !this.appData.hegemonyTimeline) return;
        this.hegemonyCards = [];
        this.appData.hegemonyTimeline.forEach((period, idx) => {
          const isLeaderFocus = period.period.includes("2026") || period.period.includes("2025\uB144 \uD558\uBC18\uAE30");
          const container = AppHelper.createUIElement("div", `hegemony-card-${idx}`, {
            position: "absolute",
            top: isLeaderFocus ? "15%" : "18%",
            width: isLeaderFocus ? "450px" : "380px",
            padding: "30px",
            backgroundColor: isLeaderFocus ? "rgba(10, 30, 60, 0.95)" : "rgba(5, 15, 30, 0.92)",
            border: isLeaderFocus ? "2px solid #00ffd4" : "1px solid rgba(0, 255, 212, 0.4)",
            borderRadius: "24px",
            color: "white",
            pointerEvents: "auto",
            zIndex: isLeaderFocus ? "25" : "20",
            boxShadow: isLeaderFocus ? "0 0 50px rgba(0, 255, 212, 0.3), inset 0 0 20px rgba(0, 255, 212, 0.1)" : "0 20px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(25px)",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            transition: "transform 0.3s ease"
          });
          const header = AppHelper.createUIElement("div", "", {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px"
          });
          const periodLabel = AppHelper.createUIElement(
            "span",
            "",
            {
              fontSize: "22px",
              fontWeight: "900",
              color: "#00ffd4",
              letterSpacing: "1px"
            },
            period.period
          );
          header.appendChild(periodLabel);
          if (isLeaderFocus) {
            const badge = AppHelper.createUIElement(
              "span",
              "",
              {
                padding: "4px 12px",
                backgroundColor: "#00ffd4",
                color: "#000",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "900"
              },
              "TOP TIER LEADERS"
            );
            header.appendChild(badge);
          }
          container.appendChild(header);
          period.rankings.forEach((r) => {
            const row = AppHelper.createUIElement("div", "", {
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "12px 15px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: r.rank === 1 ? "1px solid rgba(0, 255, 212, 0.3)" : "1px solid transparent"
            });
            const rankBox = AppHelper.createUIElement(
              "div",
              "",
              {
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: r.rank === 1 ? "#ffcc00" : r.rank === 2 ? "#e0e0e0" : "#cd7f32",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#000",
                fontWeight: "900",
                fontSize: "14px"
              },
              r.rank.toString()
            );
            const modelInfo = AppHelper.createUIElement("div", "", { flex: "1" });
            const name = AppHelper.createUIElement("div", "", { fontSize: "16px", fontWeight: "bold" }, r.name);
            const model = AppHelper.createUIElement(
              "div",
              "",
              { fontSize: "12px", color: r.color || "#00ffd4", opacity: "0.8" },
              r.model
            );
            modelInfo.appendChild(name);
            modelInfo.appendChild(model);
            const changeIcon = r.change === "up" ? "\u25B2" : r.change === "down" ? "\u25BC" : r.change === "new" ? "NEW" : "\u2022";
            const changeColor = r.change === "up" ? "#00ffd4" : r.change === "down" ? "#ff5e3a" : r.change === "new" ? "#00aaff" : "rgba(255,255,255,0.3)";
            const changeTag = AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: r.change === "new" ? "10px" : "12px",
                color: changeColor,
                fontWeight: "bold"
              },
              changeIcon
            );
            row.appendChild(rankBox);
            row.appendChild(modelInfo);
            row.appendChild(changeTag);
            container.appendChild(row);
          });
          const summary = AppHelper.createUIElement(
            "p",
            "",
            {
              fontSize: "14px",
              lineHeight: "1.6",
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: "10px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "15px"
            },
            period.summary
          );
          container.appendChild(summary);
          wrapper.appendChild(container);
          this.hegemonyCards.push(container);
        });
      }
      // 연도별/시기별 AI 기업들의 경쟁 구도 변화를 시각적으로 보여주는 탭 UI 생성 (탭 겹침 현상 해결을 위한 레이아웃 조정)
      showHegemonyTimeline() {
        const overlay = AppHelper.createUIElement("div", "hegemony-overlay", {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(2, 6, 15, 0.98)",
          backdropFilter: "blur(50px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px",
          zIndex: "1500",
          pointerEvents: "auto",
          boxSizing: "border-box"
        });
        const header = AppHelper.createUIElement("div", "", {
          width: "100%",
          textAlign: "center",
          marginBottom: "30px"
        });
        const title = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "42px",
            fontWeight: "900",
            color: "#fff",
            letterSpacing: "4px",
            textShadow: "0 0 30px rgba(0, 255, 212, 0.4)"
          },
          this.textData.hegemonyTitle
        );
        header.appendChild(title);
        overlay.appendChild(header);
        const tabContainer = AppHelper.createUIElement("div", "hegemony-tabs", {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
          padding: "10px 25px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          maxWidth: "90%"
        });
        const contentArea = AppHelper.createUIElement("div", "hegemony-content", {
          width: "100%",
          maxWidth: "1150px",
          flex: "1",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflowY: "auto",
          paddingRight: "10px",
          boxSizing: "border-box"
        });
        const renderContent = (periodData, btn) => {
          gsapWithCSS.to(contentArea, {
            opacity: 0,
            y: 15,
            duration: 0.25,
            onComplete: () => {
              contentArea.replaceChildren();
              contentArea.scrollTop = 0;
              if (!periodData || !periodData.rankings) return;
              const mainGrid = AppHelper.createUIElement("div", "", {
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: "30px",
                width: "100%",
                boxSizing: "border-box"
              });
              const rankSection = AppHelper.createUIElement("div", "", {
                backgroundColor: "rgba(10, 25, 45, 0.5)",
                padding: "30px",
                borderRadius: "24px",
                border: "1px solid rgba(0, 255, 212, 0.2)",
                boxSizing: "border-box"
              });
              const rankTitle = AppHelper.createUIElement(
                "h3",
                "",
                {
                  fontSize: "20px",
                  color: "#00ffd4",
                  marginBottom: "25px",
                  borderLeft: "4px solid #00ffd4",
                  paddingLeft: "15px"
                },
                this.textData.hegemonyRankLabel
              );
              rankSection.appendChild(rankTitle);
              periodData.rankings.forEach((r, idx) => {
                const item = AppHelper.createUIElement("div", "", {
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "18px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "16px",
                  marginBottom: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  boxSizing: "border-box"
                });
                const rankNum = AppHelper.createUIElement(
                  "div",
                  "",
                  {
                    fontSize: "28px",
                    fontWeight: "900",
                    color: r.rank === 1 ? "#ffcc00" : r.rank === 2 ? "#e0e0e0" : "#cd7f32",
                    minWidth: "45px"
                  },
                  `0${r.rank}`
                );
                const info = AppHelper.createUIElement("div", "", { flex: "1" });
                const name = AppHelper.createUIElement(
                  "div",
                  "",
                  { fontSize: "19px", fontWeight: "900", color: "#fff" },
                  r.name
                );
                const model = AppHelper.createUIElement(
                  "div",
                  "",
                  { fontSize: "13px", color: r.color || "#00ffd4", marginTop: "4px", fontWeight: "bold" },
                  r.model
                );
                info.appendChild(name);
                info.appendChild(model);
                let changeIcon = "\u2022";
                let changeColor = "rgba(255,255,255,0.3)";
                if (r.change === "up") {
                  changeIcon = "\u25B2";
                  changeColor = "#00ffd4";
                } else if (r.change === "down") {
                  changeIcon = "\u25BC";
                  changeColor = "#ff5e3a";
                } else if (r.change === "new") {
                  changeIcon = "NEW";
                  changeColor = "#00aaff";
                }
                const status = AppHelper.createUIElement(
                  "div",
                  "",
                  {
                    fontSize: r.change === "new" ? "11px" : "18px",
                    fontWeight: "900",
                    color: changeColor,
                    padding: "6px 12px",
                    backgroundColor: `${changeColor}15`,
                    borderRadius: "8px",
                    minWidth: "40px",
                    textAlign: "center"
                  },
                  changeIcon
                );
                item.appendChild(rankNum);
                item.appendChild(info);
                item.appendChild(status);
                rankSection.appendChild(item);
                gsapWithCSS.from(item, { opacity: 0, x: -30, delay: idx * 0.1, duration: 0.6, ease: "power2.out" });
              });
              const eventSection = AppHelper.createUIElement("div", "", {
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxSizing: "border-box"
              });
              const eventBox = AppHelper.createUIElement("div", "", {
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                padding: "30px",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                flex: "1",
                boxSizing: "border-box"
              });
              const eventTitle = AppHelper.createUIElement(
                "h3",
                "",
                {
                  fontSize: "20px",
                  color: "#00aaff",
                  marginBottom: "20px",
                  borderLeft: "4px solid #00aaff",
                  paddingLeft: "15px"
                },
                this.textData.hegemonyEventLabel
              );
              eventBox.appendChild(eventTitle);
              if (periodData.majorEvents) {
                periodData.majorEvents.forEach((ev, idx) => {
                  const evItem = AppHelper.createUIElement(
                    "div",
                    "",
                    {
                      fontSize: "15px",
                      lineHeight: "1.6",
                      marginBottom: "12px",
                      color: "rgba(255, 255, 255, 0.9)",
                      display: "flex",
                      gap: "12px"
                    },
                    `\u2726 ${ev}`
                  );
                  eventBox.appendChild(evItem);
                  gsapWithCSS.from(evItem, { opacity: 0, x: 30, delay: 0.2 + idx * 0.1, duration: 0.6, ease: "power2.out" });
                });
              }
              const summaryBox = AppHelper.createUIElement(
                "div",
                "",
                {
                  padding: "25px",
                  backgroundColor: "rgba(0, 255, 212, 0.05)",
                  borderRadius: "20px",
                  border: "1px solid rgba(0, 255, 212, 0.2)",
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#f0f0f0",
                  boxSizing: "border-box"
                },
                periodData.summary
              );
              eventSection.appendChild(eventBox);
              eventSection.appendChild(summaryBox);
              mainGrid.appendChild(rankSection);
              mainGrid.appendChild(eventSection);
              contentArea.appendChild(mainGrid);
              gsapWithCSS.to(contentArea, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
            }
          });
          const allBtns = tabContainer.querySelectorAll("button");
          allBtns.forEach((b) => {
            const btnEl = b;
            btnEl.style.backgroundColor = "transparent";
            btnEl.style.color = "rgba(255, 255, 255, 0.5)";
            btnEl.style.boxShadow = "none";
            btnEl.style.transform = "scale(1)";
          });
          btn.style.backgroundColor = "#00ffd4";
          btn.style.color = "#000";
          btn.style.boxShadow = "0 0 25px rgba(0, 255, 212, 0.4)";
          btn.style.transform = "scale(1.05)";
        };
        if (this.appData.hegemonyTimeline && this.appData.hegemonyTimeline.length > 0) {
          this.appData.hegemonyTimeline.forEach((period, idx) => {
            const tabBtn = AppHelper.createUIElement(
              "button",
              "",
              {
                padding: "12px 28px",
                fontSize: "15px",
                fontWeight: "900",
                color: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "40px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                pointerEvents: "auto",
                flexShrink: "0"
                // 탭 너비가 압축되어 겹치지 않도록 방지
              },
              period.period,
              [
                {
                  event: "click",
                  handler: (e) => {
                    this.playSound("click");
                    renderContent(period, e.currentTarget);
                  }
                }
              ]
            );
            tabContainer.appendChild(tabBtn);
            if (idx === 0) {
              setTimeout(() => renderContent(period, tabBtn), 150);
            }
          });
        }
        overlay.appendChild(tabContainer);
        overlay.appendChild(contentArea);
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            marginTop: "30px",
            padding: "15px 70px",
            backgroundColor: "transparent",
            color: "#00ffd4",
            border: "2px solid #00ffd4",
            borderRadius: "40px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
            pointerEvents: "auto"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                gsapWithCSS.to(overlay, { opacity: 0, scale: 0.98, duration: 0.3, onComplete: () => overlay.remove() });
              }
            }
          ]
        );
        overlay.appendChild(closeBtn);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(overlay, { opacity: 0, duration: 0.5 });
      }
      // 영문 단위(B, M, K)로 구성된 이용자 수 문자열을 한글 단위(억, 만)로 변환하는 함수
      formatKoreanUnit(valStr) {
        const num = parseFloat(valStr);
        if (isNaN(num)) return valStr;
        let factor = 1;
        if (valStr.includes("B")) factor = 1e9;
        else if (valStr.includes("M")) factor = 1e6;
        else if (valStr.includes("K")) factor = 1e3;
        const total = num * factor;
        if (total >= 1e8) {
          return `${Number((total / 1e8).toFixed(2))}${this.textData.unitEok}`;
        } else if (total >= 1e4) {
          return `${Number((total / 1e4).toFixed(2))}${this.textData.unitMan}`;
        } else {
          return `${total.toLocaleString()}${this.textData.unitPerson}`;
        }
      }
      // AI 기술 발전 이벤트를 제외한 나머지 카드를 숨기거나 보여주며, AI 관련 카드에 은은한 발광(Glow) 효과를 부여하는 기능
      toggleAiFilter(btn) {
        this.isAiFilterActive = !this.isAiFilterActive;
        this.playSound("click");
        if (this.isAiFilterActive) {
          btn.style.backgroundColor = "rgba(0, 255, 212, 0.8)";
          btn.style.color = "#000";
          btn.style.boxShadow = "0 0 30px #00ffd4";
          const aiStartIdx = 53;
          const targetX = aiStartIdx * 550 + 600;
          this.targetScrollX = -(targetX - this.canvas.width / 2);
        } else {
          btn.style.backgroundColor = "rgba(0, 255, 212, 0.15)";
          btn.style.color = "#00ffd4";
          btn.style.boxShadow = "none";
        }
        this.appData.events.forEach((event, idx) => {
          const isAiTheme = event.theme === "ai";
          const targetFactor = this.isAiFilterActive ? isAiTheme ? 1 : 0 : 1;
          if (this.eventFilterStates[idx]) {
            gsapWithCSS.to(this.eventFilterStates[idx], {
              factor: targetFactor,
              duration: 1.2,
              ease: "expo.out"
            });
          }
          const el = document.getElementById(`event-${idx}`);
          if (el) {
            if (this.isAiFilterActive) {
              if (isAiTheme) {
                gsapWithCSS.to(el, {
                  scale: 1.05,
                  boxShadow: "0 0 50px rgba(0, 255, 212, 0.4), inset 0 0 15px rgba(0, 255, 212, 0.15)",
                  borderColor: "rgba(0, 255, 212, 0.7)",
                  zIndex: 10,
                  duration: 0.8,
                  ease: "power2.out"
                });
              } else {
                gsapWithCSS.to(el, {
                  scale: 0.7,
                  filter: "blur(10px)",
                  zIndex: 1,
                  duration: 0.8,
                  ease: "power2.inOut"
                });
              }
            } else {
              gsapWithCSS.to(el, {
                scale: 1,
                filter: "blur(0px)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
                borderColor: "rgba(255, 255, 255, 0.08)",
                zIndex: 2,
                duration: 0.8,
                ease: "back.out(1.5)"
              });
            }
          }
        });
      }
      // 대상 엘리먼트에 강렬한 글로우와 반짝임 시각 효과를 부여하는 함수
      triggerSparkle(el, color) {
        gsapWithCSS.killTweensOf(el);
        gsapWithCSS.timeline().to(el, {
          scale: 1.1,
          boxShadow: `0 0 80px ${color}, 0 0 30px #ffffff`,
          borderColor: "#ffffff",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          duration: 0.15,
          ease: "power2.out"
        }).to(el, {
          scale: 1,
          boxShadow: `0 8px 20px rgba(0, 0, 0, 0.4)`,
          borderColor: "rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(10, 20, 35, 0.85)",
          duration: 0.6,
          ease: "elastic.out(1, 0.5)"
        });
        const shine = AppHelper.createUIElement("div", "", {
          position: "absolute",
          top: "0",
          left: "-150%",
          width: "100%",
          height: "100%",
          background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)",
          transform: "skewX(-25deg)",
          pointerEvents: "none",
          zIndex: "5"
        });
        el.appendChild(shine);
        gsapWithCSS.to(shine, {
          left: "150%",
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => shine.remove()
        });
        for (let i = 0; i < 6; i++) {
          const particle = AppHelper.createUIElement("div", "", {
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "6px",
            height: "6px",
            backgroundColor: color,
            borderRadius: "50%",
            boxShadow: `0 0 10px ${color}`,
            pointerEvents: "none",
            zIndex: "10"
          });
          el.appendChild(particle);
          const angle = Math.PI * 2 / 6 * i;
          const dist = 60 + Math.random() * 40;
          gsapWithCSS.to(particle, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: "power4.out",
            onComplete: () => particle.remove()
          });
        }
      }
      // 특정 위젯이나 컴포넌트를 화면 가득 확대하여 상세 정보를 보여주는 기능
      showEnlargedComponent(title, renderFn, color) {
        const overlay = AppHelper.createUIElement("div", "zoom-overlay", {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(2, 5, 12, 0.98)",
          zIndex: "2000",
          pointerEvents: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(30px)"
        });
        const modal = AppHelper.createUIElement("div", "", {
          width: "85%",
          maxWidth: "1200px",
          minHeight: "50%",
          padding: "60px",
          backgroundColor: "rgba(10, 20, 40, 0.95)",
          border: `1px solid ${color}66`,
          borderRadius: "40px",
          color: "white",
          boxShadow: `0 0 100px ${color}22`,
          maxHeight: "85%",
          overflowY: "auto",
          boxSizing: "border-box"
        });
        const header = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "42px",
            color,
            marginBottom: "40px",
            fontWeight: "900",
            letterSpacing: "2px",
            borderLeft: `8px solid ${color}`,
            paddingLeft: "25px"
          },
          title
        );
        modal.appendChild(header);
        const grid = AppHelper.createUIElement("div", "", {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px"
        });
        renderFn(grid);
        modal.appendChild(grid);
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            marginTop: "50px",
            padding: "18px 60px",
            backgroundColor: "transparent",
            color,
            border: `2px solid ${color}`,
            borderRadius: "40px",
            fontSize: "18px",
            fontWeight: "900",
            cursor: "pointer",
            transition: "all 0.3s"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                gsapWithCSS.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => overlay.remove() });
              }
            }
          ]
        );
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(modal, { opacity: 0, y: 50, scale: 0.95, duration: 0.5, ease: "power4.out" });
      }
      // 2023년 이후 데이터를 바탕으로 한 이용자 수, 성능 랭킹, 그리고 AI 이미지 및 코딩 모델 랭킹 섹션 생성
      createMilestoneSections() {
        const wrapper = document.getElementById("timeline-wrapper");
        if (!wrapper) return;
        const allModels2023 = this.appData.aiModels.flatMap(
          (series) => series.models.filter((m) => {
            const year = parseInt(m.date.split(".")[0]);
            return year >= 2023;
          })
        );
        const userToNum = (s) => {
          const val = parseFloat(s);
          if (s.includes("B")) return val * 1e3;
          if (s.includes("M")) return val;
          if (s.includes("K")) return val / 1e3;
          return val;
        };
        const topUsers = [...allModels2023].sort((a, b) => userToNum(b.userCount) - userToNum(a.userCount)).slice(0, 3);
        const topTech = [...allModels2023].sort((a, b) => b.techScore - a.techScore).slice(0, 3);
        const topImage = this.appData.imageModelRanking.slice(0, 7);
        const topCoding = this.appData.codingModelRanking.slice(0, 6);
        const createRankingBox = (id, titleText, models, color) => {
          const container = AppHelper.createUIElement(
            "div",
            id,
            {
              position: "absolute",
              top: "12%",
              width: "380px",
              padding: "20px",
              backgroundColor: "rgba(5, 15, 30, 0.95)",
              border: `1px solid ${color}66`,
              borderRadius: "16px",
              color: "white",
              pointerEvents: "auto",
              zIndex: "5",
              boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px ${color}11`,
              maxHeight: "75%",
              overflowY: "auto",
              cursor: "zoom-in",
              transition: "all 0.3s"
            },
            "",
            [
              {
                event: "mouseenter",
                handler: (e) => {
                  const t = e.currentTarget;
                  t.style.transform = "translateY(-5px)";
                  t.style.borderColor = color;
                }
              },
              {
                event: "mouseleave",
                handler: (e) => {
                  const t = e.currentTarget;
                  t.style.transform = "translateY(0)";
                  t.style.borderColor = `${color}66`;
                }
              },
              {
                event: "click",
                handler: () => {
                  this.playSound("click");
                  this.showEnlargedComponent(
                    titleText,
                    (grid) => {
                      models.forEach((m, idx) => {
                        const card = AppHelper.createUIElement("div", "", {
                          padding: "30px",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderRadius: "24px",
                          border: `2px solid ${idx === 0 ? color : "rgba(255,255,255,0.1)"}`,
                          position: "relative"
                        });
                        let valText = "";
                        if (id === "milestone-users") {
                          valText = this.textData.userCountLabel + ": " + this.formatKoreanUnit(m.userCount);
                        } else if (id === "milestone-coding") {
                          valText = `${this.textData.sweBenchLabel}: ${m.codingScore}% / ${this.textData.terminalBenchLabel}: ${m.terminalScore}%`;
                        } else {
                          valText = this.textData.techScoreLabel + ": " + m.techScore;
                        }
                        const rankIndicator = AppHelper.createUIElement(
                          "div",
                          "",
                          {
                            fontSize: "48px",
                            fontWeight: "900",
                            color,
                            opacity: "0.2",
                            position: "absolute",
                            right: "20px",
                            top: "10px"
                          },
                          `#0${idx + 1}`
                        );
                        const cardTitle = AppHelper.createUIElement(
                          "h3",
                          "",
                          {
                            fontSize: "24px",
                            marginBottom: "10px"
                          },
                          m.name
                        );
                        const cardVal = AppHelper.createUIElement(
                          "p",
                          "",
                          {
                            fontSize: "18px",
                            color,
                            fontWeight: "bold"
                          },
                          valText
                        );
                        const cardDesc = AppHelper.createUIElement(
                          "p",
                          "",
                          {
                            marginTop: "15px",
                            fontSize: "14px",
                            opacity: "0.7",
                            lineHeight: "1.5"
                          },
                          m.desc
                        );
                        card.appendChild(rankIndicator);
                        card.appendChild(cardTitle);
                        card.appendChild(cardVal);
                        card.appendChild(cardDesc);
                        grid.appendChild(card);
                      });
                      if (id === "milestone-coding") {
                        const summaryBox = AppHelper.createUIElement(
                          "div",
                          "",
                          {
                            gridColumn: "1 / -1",
                            padding: "25px",
                            backgroundColor: `${color}11`,
                            borderRadius: "15px",
                            border: `1px solid ${color}33`,
                            marginTop: "20px",
                            fontSize: "16px",
                            lineHeight: "1.6",
                            color: "#fff"
                          },
                          `\u{1F4A1} \uD55C \uC904 \uC694\uC57D: ${this.appData.finalSummary.codingSummary}`
                        );
                        grid.appendChild(summaryBox);
                      }
                    },
                    color
                  );
                }
              }
            ]
          );
          const header = AppHelper.createUIElement(
            "h2",
            "",
            { fontSize: "20px", color, marginBottom: "20px", borderLeft: `4px solid ${color}`, paddingLeft: "12px" },
            titleText
          );
          container.appendChild(header);
          models.forEach((m, idx) => {
            const item = AppHelper.createUIElement("div", "", {
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "12px",
              marginBottom: "8px",
              backgroundColor: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.05)"
            });
            const rankNum = AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: "24px",
                fontWeight: "900",
                color: idx === 0 ? "#ffcc00" : idx === 1 ? "#cccccc" : "#cd7f32",
                minWidth: "30px"
              },
              (idx + 1).toString()
            );
            const info = AppHelper.createUIElement("div", "", { flex: "1" });
            const name = AppHelper.createUIElement(
              "div",
              "",
              { fontSize: "16px", fontWeight: "bold", color: "#fff" },
              m.name
            );
            let valLabel = "";
            if (id === "milestone-users")
              valLabel = `${this.textData.userCountLabel}: ${this.formatKoreanUnit(m.userCount)}`;
            else if (id === "milestone-coding") valLabel = `SWE: ${m.codingScore}%`;
            else valLabel = `${this.textData.techScoreLabel}: ${m.techScore}`;
            const val = AppHelper.createUIElement(
              "div",
              "",
              { fontSize: "13px", color, marginTop: "2px" },
              valLabel
            );
            info.appendChild(name);
            info.appendChild(val);
            item.appendChild(rankNum);
            item.appendChild(info);
            container.appendChild(item);
          });
          const zoomHint = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "11px",
              color,
              opacity: "0.5",
              marginTop: "10px",
              textAlign: "right",
              fontStyle: "italic"
            },
            `\u{1F50D} ${this.textData.zoomHint}`
          );
          container.appendChild(zoomHint);
          return container;
        };
        const userBox = createRankingBox("milestone-users", this.textData.milestoneUserTitle, topUsers, "#00ffd4");
        const techBox = createRankingBox("milestone-tech", this.textData.milestoneTechTitle, topTech, "#00aaff");
        const imageBox = createRankingBox("milestone-image", this.textData.milestoneImageTitle, topImage, "#ffcc00");
        const codingBox = createRankingBox("milestone-coding", this.textData.milestoneCodingTitle, topCoding, "#ff5e3a");
        wrapper.appendChild(userBox);
        wrapper.appendChild(techBox);
        wrapper.appendChild(imageBox);
        wrapper.appendChild(codingBox);
      }
      // 전략 로드맵을 '파노라믹 테크 아키텍처' 형식의 가로 스크롤 그래프로 재구성 (레이아웃 사이즈 축소)
      showRoadmapVisualGraph() {
        if (!this.appData.llmRoadmap || this.appData.llmRoadmap.length === 0) return;
        const overlay = AppHelper.createUIElement("div", "roadmap-graph-overlay", {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "#020617",
          display: "flex",
          flexDirection: "column",
          zIndex: "500",
          pointerEvents: "auto",
          overflow: "hidden",
          boxSizing: "border-box"
        });
        const bgEffect = AppHelper.createUIElement("div", "", {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundImage: `
        linear-gradient(to right, rgba(0, 255, 212, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 255, 212, 0.05) 1px, transparent 1px)
      `,
          backgroundSize: "80px 80px",
          zIndex: "-1"
        });
        overlay.appendChild(bgEffect);
        const header = AppHelper.createUIElement("div", "", {
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 255, 212, 0.2)",
          backgroundColor: "rgba(2, 6, 23, 0.8)",
          backdropFilter: "blur(10px)"
        });
        const titleGroup = AppHelper.createUIElement("div", "");
        const mainTitle = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "32px",
            fontWeight: "900",
            color: "#fff",
            letterSpacing: "2px",
            margin: "0"
          },
          this.textData.roadmapGraphTitle
        );
        const subTitle = AppHelper.createUIElement(
          "p",
          "",
          {
            fontSize: "14px",
            color: "#00ffd4",
            opacity: "0.7",
            margin: "5px 0 0 0",
            letterSpacing: "1px"
          },
          this.textData.roadmapGuidance
        );
        titleGroup.appendChild(mainTitle);
        titleGroup.appendChild(subTitle);
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            padding: "10px 30px",
            backgroundColor: "transparent",
            color: "#00ffd4",
            border: "1px solid #00ffd4",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "all 0.3s"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                gsapWithCSS.to(overlay, { opacity: 0, duration: 0.4, onComplete: () => overlay.remove() });
              }
            }
          ]
        );
        header.appendChild(titleGroup);
        header.appendChild(closeBtn);
        overlay.appendChild(header);
        const scrollContainer = AppHelper.createUIElement("div", "roadmap-scroll-container", {
          flex: "1",
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "0 50px",
          cursor: "grab",
          scrollbarWidth: "none"
        });
        const track = AppHelper.createUIElement("div", "", {
          display: "flex",
          alignItems: "center",
          gap: "100px",
          height: "100%",
          position: "relative",
          padding: "0 150px"
        });
        const midline = AppHelper.createUIElement("div", "", {
          position: "absolute",
          top: "50%",
          left: "0",
          width: "100%",
          height: "2px",
          background: "linear-gradient(to right, #00ffd4, #00aaff, #00ffd4)",
          opacity: "0.3",
          zIndex: "0"
        });
        track.appendChild(midline);
        this.appData.llmRoadmap.forEach((item, idx) => {
          const isEven = idx % 2 === 0;
          const nodeWrapper = AppHelper.createUIElement("div", "", {
            position: "relative",
            minWidth: "380px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: isEven ? "flex-end" : "flex-start",
            paddingBottom: isEven ? "52%" : "0",
            paddingTop: isEven ? "0" : "52%",
            zIndex: "1"
          });
          const connector = AppHelper.createUIElement("div", "", {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "2px",
            height: "80px",
            backgroundColor: "#00ffd4",
            transform: `translateX(-50%) ${isEven ? "translateY(-100%)" : ""}`,
            opacity: "0.5"
          });
          const dot = AppHelper.createUIElement("div", "", {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "10px",
            height: "10px",
            backgroundColor: "#00ffd4",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 10px #00ffd4"
          });
          const card = AppHelper.createUIElement("div", "", {
            backgroundColor: "rgba(10, 25, 47, 0.8)",
            border: "1px solid rgba(0, 255, 212, 0.3)",
            borderRadius: "12px",
            padding: "20px",
            color: "#fff",
            boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
            backdropFilter: "blur(15px)",
            transition: "all 0.4s",
            position: "relative",
            overflow: "hidden"
          });
          const phaseLabel = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "11px",
              color: "#00ffd4",
              fontWeight: "800",
              letterSpacing: "2px",
              marginBottom: "8px"
            },
            `PHASE 0${idx + 1}`
          );
          const yearRow = AppHelper.createUIElement("div", "", {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "15px"
          });
          yearRow.appendChild(
            AppHelper.createUIElement("span", "", { fontSize: "32px", fontWeight: "900", color: "#fff" }, item.year)
          );
          yearRow.appendChild(
            AppHelper.createUIElement(
              "span",
              "",
              {
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "2px 8px",
                borderRadius: "4px"
              },
              `RANKING: ${item.ranking.split(":")[1] || item.ranking}`
            )
          );
          const roadmapTitle = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "18px",
              fontWeight: "700",
              color: "#00aaff",
              marginBottom: "15px",
              lineHeight: "1.2"
            },
            item.title
          );
          const eventBox = AppHelper.createUIElement("div", "", {
            padding: "12px",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "8px",
            marginBottom: "15px"
          });
          eventBox.appendChild(
            AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: "11px",
                color: "rgba(0, 255, 212, 0.6)",
                marginBottom: "5px",
                fontWeight: "bold"
              },
              "KEY EVENTS"
            )
          );
          eventBox.appendChild(
            AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: "13px",
                lineHeight: "1.5",
                color: "rgba(255,255,255,0.9)"
              },
              item.events
            )
          );
          const infoGrid = AppHelper.createUIElement("div", "", {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px"
          });
          const scaleInfo = AppHelper.createUIElement("div", "");
          scaleInfo.appendChild(
            AppHelper.createUIElement(
              "div",
              "",
              { fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "3px", textTransform: "uppercase" },
              "Scale Impact"
            )
          );
          scaleInfo.appendChild(AppHelper.createUIElement("div", "", { fontSize: "12px", color: "#fff" }, item.scale));
          const featureInfo = AppHelper.createUIElement("div", "");
          featureInfo.appendChild(
            AppHelper.createUIElement(
              "div",
              "",
              { fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "3px", textTransform: "uppercase" },
              "Core Features"
            )
          );
          featureInfo.appendChild(AppHelper.createUIElement("div", "", { fontSize: "12px", color: "#fff" }, item.features));
          infoGrid.appendChild(scaleInfo);
          infoGrid.appendChild(featureInfo);
          card.appendChild(phaseLabel);
          card.appendChild(yearRow);
          card.appendChild(roadmapTitle);
          card.appendChild(eventBox);
          card.appendChild(infoGrid);
          nodeWrapper.appendChild(connector);
          nodeWrapper.appendChild(dot);
          nodeWrapper.appendChild(card);
          track.appendChild(nodeWrapper);
          gsapWithCSS.from(nodeWrapper, {
            opacity: 0,
            y: isEven ? 60 : -60,
            duration: 0.8,
            delay: 0.2 + idx * 0.1,
            ease: "power2.out"
          });
        });
        scrollContainer.appendChild(track);
        overlay.appendChild(scrollContainer);
        let isDown = false;
        let startX;
        let scrollLeft;
        scrollContainer.addEventListener("mousedown", (e) => {
          isDown = true;
          scrollContainer.style.cursor = "grabbing";
          startX = e.pageX - scrollContainer.offsetLeft;
          scrollLeft = scrollContainer.scrollLeft;
        });
        scrollContainer.addEventListener("mouseleave", () => {
          isDown = false;
          scrollContainer.style.cursor = "grab";
        });
        scrollContainer.addEventListener("mouseup", () => {
          isDown = false;
          scrollContainer.style.cursor = "grab";
        });
        scrollContainer.addEventListener("mousemove", (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - scrollContainer.offsetLeft;
          const walk = (x - startX) * 2;
          scrollContainer.scrollLeft = scrollLeft - walk;
        });
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(overlay, { opacity: 0, scale: 1.05, duration: 0.4 });
      }
      // 2023~2026 LLM 전략 로드맵을 '미래 지향적 데이터 모듈' 인터페이스로 구현 (사이즈 정규화)
      showLLMRoadmap() {
        if (!this.appData.llmRoadmap || this.appData.llmRoadmap.length === 0) return;
        const overlay = AppHelper.createUIElement("div", "roadmap-overlay", {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 2, 5, 0.98)",
          backdropFilter: "blur(40px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "4% 3%",
          zIndex: "350",
          pointerEvents: "auto",
          overflowY: "auto",
          boxSizing: "border-box"
        });
        const header = AppHelper.createUIElement("div", "", {
          width: "90%",
          maxWidth: "1300px",
          textAlign: "left",
          marginBottom: "40px",
          flexShrink: "0"
        });
        const categoryLabel = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "13px",
            color: "#00ffd4",
            fontWeight: "bold",
            letterSpacing: "4px",
            marginBottom: "10px",
            textTransform: "uppercase"
          },
          "Strategic Analysis Phase"
        );
        const title = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "48px",
            color: "#fff",
            fontWeight: "900",
            lineHeight: "1.2",
            letterSpacing: "-1px"
          },
          this.textData.roadmapTitle
        );
        header.appendChild(categoryLabel);
        header.appendChild(title);
        overlay.appendChild(header);
        const grid = AppHelper.createUIElement("div", "", {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(40%, 1fr))",
          gap: "25px",
          width: "90%",
          maxWidth: "1300px",
          flexShrink: "0"
        });
        this.appData.llmRoadmap.forEach((item, idx) => {
          const card = AppHelper.createUIElement("div", "", {
            position: "relative",
            padding: "30px",
            minHeight: "380px",
            height: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            borderLeft: "5px solid #00ffd4",
            borderRadius: "0 20px 20px 0",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflow: "hidden",
            boxSizing: "border-box"
          });
          const bgNum = AppHelper.createUIElement(
            "div",
            "",
            {
              position: "absolute",
              bottom: "-10px",
              right: "10px",
              fontSize: "100px",
              fontWeight: "900",
              color: "rgba(255, 255, 255, 0.02)",
              pointerEvents: "none"
            },
            `0${idx + 1}`
          );
          card.appendChild(bgNum);
          const topRow = AppHelper.createUIElement("div", "", {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "10px"
          });
          const year = AppHelper.createUIElement(
            "span",
            "",
            { fontSize: "32px", fontWeight: "900", color: "#00ffd4" },
            item.year
          );
          const titleText = AppHelper.createUIElement(
            "span",
            "",
            { fontSize: "22px", fontWeight: "600", color: "#fff", opacity: "0.9" },
            item.title
          );
          topRow.appendChild(year);
          topRow.appendChild(titleText);
          card.appendChild(topRow);
          const contentGrid = AppHelper.createUIElement("div", "", {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          });
          const createInfoBox = (label, value, icon) => {
            const box = AppHelper.createUIElement("div", "");
            const l = AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
                fontWeight: "bold",
                marginBottom: "6px",
                textTransform: "uppercase"
              },
              `${icon} ${label}`
            );
            const v = AppHelper.createUIElement("div", "", { fontSize: "14px", color: "#fff", lineHeight: "1.5" }, value);
            box.appendChild(l);
            box.appendChild(v);
            return box;
          };
          contentGrid.appendChild(createInfoBox(this.textData.roadmapColEvent, item.events, "\u2726"));
          contentGrid.appendChild(createInfoBox(this.textData.roadmapColRank, item.ranking, "\u2726"));
          contentGrid.appendChild(createInfoBox(this.textData.roadmapColScale, item.scale, "\u2726"));
          contentGrid.appendChild(createInfoBox(this.textData.roadmapColFeature, item.features, "\u2726"));
          card.appendChild(contentGrid);
          grid.appendChild(card);
        });
        overlay.appendChild(grid);
        const summary = AppHelper.createUIElement("div", "", {
          marginTop: "50px",
          width: "90%",
          maxWidth: "1300px",
          padding: "35px",
          backgroundColor: "rgba(0, 255, 212, 0.05)",
          borderRadius: "24px",
          border: "1px solid rgba(0, 255, 212, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          boxSizing: "border-box",
          flexShrink: "0"
        });
        const sumTitle = AppHelper.createUIElement(
          "h3",
          "",
          { fontSize: "24px", fontWeight: "bold", color: "#00ffd4" },
          "EXECUTIVE SUMMARY"
        );
        const sumBody = AppHelper.createUIElement(
          "p",
          "",
          { fontSize: "16px", lineHeight: "1.7", color: "rgba(255,255,255,0.85)", whiteSpace: "pre-line" },
          `${this.appData.finalSummary.hegemony}

${this.appData.finalSummary.structure}`
        );
        summary.appendChild(sumTitle);
        summary.appendChild(sumBody);
        overlay.appendChild(summary);
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            margin: "50px 0",
            padding: "15px 70px",
            backgroundColor: "#00ffd4",
            color: "#000",
            border: "none",
            borderRadius: "40px",
            fontSize: "16px",
            fontWeight: "900",
            cursor: "pointer",
            transition: "transform 0.3s",
            flexShrink: "0"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                gsapWithCSS.to(overlay, { opacity: 0, y: 30, duration: 0.4, onComplete: () => overlay.remove() });
              }
            }
          ]
        );
        overlay.appendChild(closeBtn);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(overlay, { opacity: 0, duration: 0.5 });
      }
      // 주요 AI 기업 간의 경쟁 구도를 가로 연표 형태로 시각화 (2023~2026년 전체 범위, 중간 모델 및 마일스톤 포함, 세부모델 클릭 시 상세 팝업)
      showCompetitionTimeline() {
        const overlay = AppHelper.createUIElement(
          "div",
          "comp-timeline-overlay",
          {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(2, 5, 12, 0.98)",
            display: "flex",
            flexDirection: "column",
            padding: "20px 40px",
            zIndex: "250",
            pointerEvents: "auto",
            backdropFilter: "blur(40px)",
            overflow: "hidden"
          },
          "",
          [
            { event: "wheel", handler: (e) => e.stopPropagation() },
            { event: "pointerdown", handler: (e) => e.stopPropagation() },
            { event: "pointermove", handler: (e) => e.stopPropagation() }
          ]
        );
        const header = AppHelper.createUIElement("div", "", {
          textAlign: "center",
          marginBottom: "10px",
          flexShrink: "0"
        });
        const title = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "32px",
            color: "#ffffff",
            fontWeight: "900",
            letterSpacing: "1px",
            background: "linear-gradient(45deg, #00ffd4, #00aaff)",
            webkitBackgroundClip: "text",
            webkitTextFillColor: "transparent"
          },
          this.textData.compTimelineTitle
        );
        header.appendChild(title);
        const subtitle = AppHelper.createUIElement(
          "p",
          "",
          {
            fontSize: "13px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "5px",
            letterSpacing: "2px"
          },
          this.textData.compTimelineHoverGuide
        );
        header.appendChild(subtitle);
        overlay.appendChild(header);
        const infoBar = AppHelper.createUIElement("div", "", {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "10px",
          flexShrink: "0",
          flexWrap: "wrap",
          gap: "10px"
        });
        const legendContainer = AppHelper.createUIElement("div", "", {
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap"
        });
        const legendTitle = AppHelper.createUIElement(
          "span",
          "",
          { fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "bold", letterSpacing: "2px" },
          this.textData.compTimelineLegendTitle
        );
        legendContainer.appendChild(legendTitle);
        const timelineData = this.appData.competitionTimelineModels || [];
        let totalModels = 0;
        timelineData.forEach((series) => {
          totalModels += series.models.length;
          const item = AppHelper.createUIElement("div", "", {
            display: "flex",
            alignItems: "center",
            gap: "6px"
          });
          const dot = AppHelper.createUIElement("div", "", {
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: series.color,
            boxShadow: `0 0 6px ${series.color}`
          });
          const label = AppHelper.createUIElement(
            "span",
            "",
            { fontSize: "12px", color: "#fff", fontWeight: "bold" },
            `${series.icon} ${series.brand}`
          );
          const count = AppHelper.createUIElement(
            "span",
            "",
            { fontSize: "11px", color: "rgba(255,255,255,0.4)" },
            `(${series.models.length})`
          );
          item.appendChild(dot);
          item.appendChild(label);
          item.appendChild(count);
          legendContainer.appendChild(item);
        });
        const totalLabel = AppHelper.createUIElement(
          "div",
          "",
          {
            fontSize: "13px",
            color: "#00ffd4",
            fontWeight: "bold",
            padding: "6px 16px",
            backgroundColor: "rgba(0,255,212,0.1)",
            borderRadius: "20px",
            border: "1px solid rgba(0,255,212,0.3)"
          },
          `${this.textData.compTimelineModelCountLabel}: ${totalModels}`
        );
        infoBar.appendChild(legendContainer);
        infoBar.appendChild(totalLabel);
        overlay.appendChild(infoBar);
        const scrollContainer = AppHelper.createUIElement(
          "div",
          "comp-scroll-area",
          {
            flex: "1",
            width: "100%",
            overflowX: "auto",
            overflowY: "auto",
            position: "relative",
            padding: "15px 0",
            pointerEvents: "auto",
            cursor: "grab",
            scrollbarWidth: "thin",
            scrollbarColor: "#00ffd4 rgba(255,255,255,0.1)",
            touchAction: "pan-x"
          },
          "",
          [
            {
              event: "wheel",
              handler: (e) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                  const target = e.currentTarget;
                  target.scrollLeft += e.deltaY;
                  if (e.cancelable) e.preventDefault();
                }
              }
            }
          ]
        );
        const pxPerYear = 1200;
        const startYear = 2023;
        const endYear = 2026;
        const paddingLeft = 200;
        const paddingRight = 300;
        const timelineWidth = (endYear - startYear) * pxPerYear + paddingLeft + paddingRight;
        const timelineInner = AppHelper.createUIElement("div", "", {
          width: `${timelineWidth}px`,
          minHeight: "100%",
          position: "relative"
        });
        const eras = this.appData.competitionEras || [];
        eras.forEach((era) => {
          const x1 = (era.startYear - startYear) * pxPerYear + paddingLeft;
          const x2 = (era.endYear - startYear) * pxPerYear + paddingLeft;
          const band = AppHelper.createUIElement("div", "", {
            position: "absolute",
            left: `${x1}px`,
            top: "0",
            width: `${x2 - x1}px`,
            height: "100%",
            backgroundColor: `${era.color}08`,
            borderLeft: `2px dashed ${era.color}30`,
            borderRight: `2px dashed ${era.color}30`,
            zIndex: "0",
            pointerEvents: "none"
          });
          const eraLabel = AppHelper.createUIElement(
            "div",
            "",
            {
              position: "absolute",
              top: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "11px",
              color: era.color,
              fontWeight: "900",
              letterSpacing: "3px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              opacity: "0.7",
              pointerEvents: "none"
            },
            `${this.textData.compTimelineEraLabel}: ${era.label}`
          );
          band.appendChild(eraLabel);
          timelineInner.appendChild(band);
        });
        for (let year = startYear; year <= endYear; year++) {
          const xPos = (year - startYear) * pxPerYear + paddingLeft;
          const yearLine = AppHelper.createUIElement("div", "", {
            position: "absolute",
            left: `${xPos}px`,
            top: "0",
            bottom: "0",
            width: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            zIndex: "1"
          });
          const yearLabel = AppHelper.createUIElement(
            "div",
            "",
            {
              position: "absolute",
              left: `${xPos}px`,
              bottom: "10px",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "22px",
              fontWeight: "900",
              transform: "translateX(-50%)",
              zIndex: "3"
            },
            year.toString()
          );
          timelineInner.appendChild(yearLine);
          timelineInner.appendChild(yearLabel);
          if (year < endYear) {
            for (let q = 1; q <= 3; q++) {
              const qX = xPos + pxPerYear / 4 * q;
              const qLine = AppHelper.createUIElement("div", "", {
                position: "absolute",
                left: `${qX}px`,
                top: "0",
                bottom: "0",
                width: "1px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                zIndex: "1"
              });
              const qLabel = AppHelper.createUIElement(
                "div",
                "",
                {
                  position: "absolute",
                  left: `${qX}px`,
                  bottom: "35px",
                  color: "rgba(255, 255, 255, 0.2)",
                  fontSize: "10px",
                  fontWeight: "bold",
                  transform: "translateX(-50%)",
                  zIndex: "2"
                },
                `Q${q + 1}`
              );
              timelineInner.appendChild(qLine);
              timelineInner.appendChild(qLabel);
            }
            const q1Label = AppHelper.createUIElement(
              "div",
              "",
              {
                position: "absolute",
                left: `${xPos + 10}px`,
                bottom: "35px",
                color: "rgba(255, 255, 255, 0.2)",
                fontSize: "10px",
                fontWeight: "bold",
                zIndex: "2"
              },
              "Q1"
            );
            timelineInner.appendChild(q1Label);
          }
        }
        const milestones = this.appData.competitionMilestones || [];
        milestones.forEach((ms) => {
          const dateParts = ms.date.split(".");
          const y = parseInt(dateParts[0]);
          const m = dateParts[1] ? parseInt(dateParts[1]) : 1;
          const d = dateParts[2] ? parseInt(dateParts[2]) : 1;
          const yearFraction = (m - 1) / 12 + (d - 1) / 365;
          const xPos = (y - startYear + yearFraction) * pxPerYear + paddingLeft;
          const msLine = AppHelper.createUIElement("div", "", {
            position: "absolute",
            left: `${xPos}px`,
            top: "30px",
            bottom: "55px",
            width: "2px",
            background: `linear-gradient(to bottom, ${ms.color}80, ${ms.color}10)`,
            zIndex: "4",
            pointerEvents: "none"
          });
          timelineInner.appendChild(msLine);
          const msMarker = AppHelper.createUIElement(
            "div",
            "",
            {
              position: "absolute",
              left: `${xPos}px`,
              top: "30px",
              transform: "translateX(-50%)",
              padding: "4px 12px",
              backgroundColor: `${ms.color}22`,
              border: `1px solid ${ms.color}66`,
              borderRadius: "6px",
              color: ms.color,
              fontSize: "10px",
              fontWeight: "900",
              whiteSpace: "nowrap",
              zIndex: "15",
              cursor: "pointer",
              pointerEvents: "auto",
              transition: "all 0.3s",
              letterSpacing: "0.5px"
            },
            `\u26A1 ${ms.label}`,
            [
              {
                event: "mouseenter",
                handler: (e) => {
                  const t = e.currentTarget;
                  t.style.backgroundColor = `${ms.color}44`;
                  t.style.boxShadow = `0 0 15px ${ms.color}44`;
                  const tooltip2 = t.querySelector(".ms-tooltip");
                  if (tooltip2) tooltip2.style.opacity = "1";
                }
              },
              {
                event: "mouseleave",
                handler: (e) => {
                  const t = e.currentTarget;
                  t.style.backgroundColor = `${ms.color}22`;
                  t.style.boxShadow = "none";
                  const tooltip2 = t.querySelector(".ms-tooltip");
                  if (tooltip2) tooltip2.style.opacity = "0";
                }
              }
            ]
          );
          const tooltip = AppHelper.createUIElement(
            "div",
            "ms-tooltip",
            {
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: "8px",
              padding: "10px 16px",
              backgroundColor: "rgba(10,15,30,0.97)",
              border: `1px solid ${ms.color}55`,
              borderRadius: "10px",
              color: "#fff",
              fontSize: "12px",
              lineHeight: "1.5",
              whiteSpace: "nowrap",
              opacity: "0",
              transition: "opacity 0.3s",
              pointerEvents: "none",
              zIndex: "20",
              boxShadow: `0 8px 25px rgba(0,0,0,0.6)`,
              maxWidth: "280px"
            },
            ""
          );
          const tooltipDate = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "10px", color: ms.color, fontWeight: "bold", marginBottom: "4px" },
            ms.date
          );
          const tooltipDesc = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "12px", color: "rgba(255,255,255,0.85)", whiteSpace: "normal" },
            ms.desc
          );
          tooltip.appendChild(tooltipDate);
          tooltip.appendChild(tooltipDesc);
          msMarker.appendChild(tooltip);
          timelineInner.appendChild(msMarker);
        });
        timelineData.forEach((series, sIdx) => {
          const color = series.color;
          const trackY = 90 + sIdx * 110;
          const trackLine = AppHelper.createUIElement("div", "", {
            position: "absolute",
            top: `${trackY}px`,
            left: `${paddingLeft - 20}px`,
            width: `${timelineWidth - paddingLeft - paddingRight + 40}px`,
            height: "2px",
            background: `linear-gradient(to right, transparent, ${color}44, ${color}22, transparent)`,
            zIndex: "2"
          });
          timelineInner.appendChild(trackLine);
          const brandName = AppHelper.createUIElement(
            "div",
            "",
            {
              position: "absolute",
              top: `${trackY - 30}px`,
              left: "30px",
              color,
              fontSize: "14px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "2px",
              textShadow: `0 0 10px ${color}44`,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: "5"
            },
            `${series.icon} ${series.brand}`
          );
          timelineInner.appendChild(brandName);
          const sortedModels = [...series.models].sort((a, b) => {
            const pa = a.date.split(".").map(Number);
            const pb = b.date.split(".").map(Number);
            return pa[0] * 1e4 + (pa[1] || 0) * 100 + (pa[2] || 0) - (pb[0] * 1e4 + (pb[1] || 0) * 100 + (pb[2] || 0));
          });
          for (let i = 0; i < sortedModels.length - 1; i++) {
            const m1 = sortedModels[i];
            const m2 = sortedModels[i + 1];
            const getX = (d) => {
              const parts = d.split(".");
              const yr = parseInt(parts[0]);
              const mo = parts[1] ? parseInt(parts[1]) : 1;
              const da = parts[2] ? parseInt(parts[2]) : 1;
              return (yr - startYear + (mo - 1) / 12 + (da - 1) / 365) * pxPerYear + paddingLeft;
            };
            const x1 = getX(m1.date);
            const x2 = getX(m2.date);
            const connLine = AppHelper.createUIElement("div", "", {
              position: "absolute",
              left: `${x1}px`,
              top: `${trackY}px`,
              width: `${x2 - x1}px`,
              height: "2px",
              background: `linear-gradient(to right, ${color}66, ${color}33)`,
              zIndex: "3",
              pointerEvents: "none"
            });
            timelineInner.appendChild(connLine);
          }
          series.models.forEach((m) => {
            const dateParts = m.date.split(".");
            const year = parseInt(dateParts[0]);
            const month = dateParts[1] ? parseInt(dateParts[1]) : 1;
            const day = dateParts[2] ? parseInt(dateParts[2]) : 1;
            const yearFraction = (month - 1) / 12 + (day - 1) / 365;
            const xPos = (year - startYear + yearFraction) * pxPerYear + paddingLeft;
            const isHighlight = m.highlight === true;
            const nodeSize = isHighlight ? 18 : 12;
            const node = AppHelper.createUIElement(
              "div",
              "",
              {
                position: "absolute",
                left: `${xPos}px`,
                top: `${trackY}px`,
                width: `${nodeSize}px`,
                height: `${nodeSize}px`,
                backgroundColor: isHighlight ? "#fff" : color,
                border: isHighlight ? `3px solid ${color}` : "none",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: isHighlight ? `0 0 20px ${color}, 0 0 8px #fff` : `0 0 10px ${color}88`,
                cursor: "pointer",
                zIndex: "12",
                transition: "transform 0.3s, box-shadow 0.3s",
                pointerEvents: "auto"
              },
              "",
              [
                {
                  event: "mouseenter",
                  handler: (e) => {
                    const t = e.currentTarget;
                    t.style.transform = "translate(-50%, -50%) scale(1.6)";
                    t.style.boxShadow = `0 0 30px ${color}`;
                    const tip = t.querySelector(".node-tip");
                    if (tip) tip.style.opacity = "1";
                    this.playSound("pop");
                  }
                },
                {
                  event: "mouseleave",
                  handler: (e) => {
                    const t = e.currentTarget;
                    t.style.transform = "translate(-50%, -50%) scale(1)";
                    t.style.boxShadow = isHighlight ? `0 0 20px ${color}, 0 0 8px #fff` : `0 0 10px ${color}88`;
                    const tip = t.querySelector(".node-tip");
                    if (tip) tip.style.opacity = "0";
                  }
                },
                {
                  event: "click",
                  handler: () => {
                    this.playSound("click");
                    this.showCompetitionModelDetail(m, series.brand, series.icon, color);
                  }
                }
              ]
            );
            const nodeTip = AppHelper.createUIElement(
              "div",
              "node-tip",
              {
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginBottom: "12px",
                padding: "12px 18px",
                backgroundColor: "rgba(8, 12, 28, 0.97)",
                border: `1px solid ${color}66`,
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
                lineHeight: "1.5",
                whiteSpace: "nowrap",
                opacity: "0",
                transition: "opacity 0.3s",
                pointerEvents: "none",
                zIndex: "30",
                boxShadow: `0 10px 30px rgba(0,0,0,0.7), 0 0 10px ${color}22`,
                minWidth: "200px",
                maxWidth: "320px"
              },
              ""
            );
            const tipName = AppHelper.createUIElement(
              "div",
              "",
              { fontSize: "14px", fontWeight: "900", color, marginBottom: "4px" },
              m.name
            );
            const tipDate = AppHelper.createUIElement(
              "div",
              "",
              { fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "6px", letterSpacing: "1px" },
              `RELEASED: ${m.date}`
            );
            const tipDesc = AppHelper.createUIElement(
              "div",
              "",
              { fontSize: "12px", color: "rgba(255,255,255,0.8)", whiteSpace: "normal", lineHeight: "1.5" },
              m.desc
            );
            nodeTip.appendChild(tipName);
            nodeTip.appendChild(tipDate);
            nodeTip.appendChild(tipDesc);
            if (isHighlight) {
              const highlightBadge = AppHelper.createUIElement(
                "div",
                "",
                {
                  fontSize: "9px",
                  color: "#000",
                  backgroundColor: color,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "900",
                  marginTop: "4px",
                  display: "inline-block"
                },
                "\u2605 KEY RELEASE"
              );
              nodeTip.appendChild(highlightBadge);
            }
            const clickGuide = AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: "10px",
                color: `${color}`,
                marginTop: "6px",
                fontStyle: "italic",
                opacity: "0.8"
              },
              this.textData.compTimelineClickGuide
            );
            nodeTip.appendChild(clickGuide);
            node.appendChild(nodeTip);
            const label = AppHelper.createUIElement(
              "div",
              "",
              {
                position: "absolute",
                left: `${xPos}px`,
                top: `${trackY + (isHighlight ? 18 : 14)}px`,
                transform: "translateX(-50%) rotate(-25deg)",
                transformOrigin: "top left",
                color: isHighlight ? "#ffffff" : "rgba(255,255,255,0.7)",
                fontSize: isHighlight ? "11px" : "10px",
                fontWeight: isHighlight ? "900" : "bold",
                whiteSpace: "nowrap",
                textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                pointerEvents: "none",
                zIndex: "6"
              },
              m.name
            );
            timelineInner.appendChild(node);
            timelineInner.appendChild(label);
          });
        });
        scrollContainer.appendChild(timelineInner);
        overlay.appendChild(scrollContainer);
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            alignSelf: "center",
            margin: "15px 0",
            padding: "12px 60px",
            backgroundColor: "transparent",
            color: "#00ffd4",
            border: "1px solid #00ffd4",
            borderRadius: "25px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            flexShrink: "0",
            transition: "all 0.3s"
          },
          this.textData.detailClose,
          [
            { event: "click", handler: () => overlay.remove() },
            {
              event: "mouseenter",
              handler: (e) => {
                const t = e.target;
                t.style.backgroundColor = "rgba(0, 255, 212, 0.1)";
                t.style.boxShadow = "0 0 20px rgba(0, 255, 212, 0.3)";
              }
            },
            {
              event: "mouseleave",
              handler: (e) => {
                const t = e.target;
                t.style.backgroundColor = "transparent";
                t.style.boxShadow = "none";
              }
            }
          ]
        );
        overlay.appendChild(closeBtn);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(overlay, { opacity: 0, scale: 1.02, duration: 0.4, ease: "power2.out" });
        let isDown = false;
        let sStartX;
        let sScrollLeft;
        scrollContainer.addEventListener("mousedown", (e) => {
          isDown = true;
          scrollContainer.style.cursor = "grabbing";
          sStartX = e.pageX - scrollContainer.offsetLeft;
          sScrollLeft = scrollContainer.scrollLeft;
        });
        scrollContainer.addEventListener("mouseleave", () => {
          isDown = false;
          scrollContainer.style.cursor = "grab";
        });
        scrollContainer.addEventListener("mouseup", () => {
          isDown = false;
          scrollContainer.style.cursor = "grab";
        });
        scrollContainer.addEventListener("mousemove", (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - scrollContainer.offsetLeft;
          const walk = (x - sStartX) * 2;
          scrollContainer.scrollLeft = sScrollLeft - walk;
        });
      }
      // AI 기술의 도약을 상징하는 더욱 화려하고 입체적인 에볼루션 포털 시각화
      drawEvolutionPortal(ctx, x, y, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = alpha;
        const time = Date.now() * 1e-3;
        const pulseScale = 1 + Math.sin(time * 2) * 0.05;
        const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, 350);
        aura.addColorStop(0, "rgba(0, 255, 212, 0.2)");
        aura.addColorStop(1, "transparent");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, 350, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 24; i++) {
          const orbitRadius = (200 + Math.sin(time + i) * 50) * pulseScale;
          const angle = this.portalAngle * 1.5 + i * Math.PI * 2 / 24;
          const px2 = Math.cos(angle) * orbitRadius;
          const py = Math.sin(angle) * orbitRadius;
          ctx.beginPath();
          ctx.arc(px2, py, 3 + Math.sin(time * 3 + i) * 2, 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#00ffd4" : "#00aaff";
          ctx.shadowBlur = 20;
          ctx.shadowColor = ctx.fillStyle;
          ctx.fill();
        }
        for (let j = 0; j < 7; j++) {
          ctx.save();
          ctx.rotate(this.portalAngle * (j % 2 === 0 ? 1 : -1) * (0.2 + j * 0.08));
          ctx.strokeStyle = j % 2 === 0 ? "rgba(0, 255, 212, 0.3)" : "rgba(0, 170, 255, 0.3)";
          ctx.lineWidth = 1 + j * 0.5;
          ctx.setLineDash([60 - j * 5, 30 + j * 10]);
          ctx.beginPath();
          ctx.arc(0, 0, (140 + j * 30) * pulseScale, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 110);
        coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        coreGrad.addColorStop(0.4, "rgba(0, 255, 212, 0.6)");
        coreGrad.addColorStop(1, "transparent");
        ctx.fillStyle = coreGrad;
        ctx.shadowBlur = 40;
        ctx.shadowColor = "#00ffd4";
        ctx.beginPath();
        ctx.arc(0, 0, 110 * pulseScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00ffd4";
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.textData.portalTitle, 0, -320);
        ctx.shadowBlur = 0;
        ctx.font = "italic 18px Arial";
        ctx.fillStyle = "rgba(0, 255, 212, 0.8)";
        ctx.fillText(this.textData.portalSubtitle, 0, -285);
        const boxW = 420;
        const boxH = 140;
        const boxX = -boxW / 2;
        const boxY = 260;
        ctx.fillStyle = "rgba(0, 10, 25, 0.9)";
        ctx.strokeStyle = "rgba(0, 255, 212, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 20);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 255, 212, 0.2)";
        ctx.moveTo(boxX + 20, boxY + 50);
        ctx.lineTo(boxX + boxW - 20, boxY + 50);
        ctx.stroke();
        ctx.fillStyle = "#00ffd4";
        ctx.font = "900 20px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`\u25B6 ${this.textData.explosionReasonTitle}`, boxX + 25, boxY + 38);
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "15px Arial";
        const words = this.textData.explosionReasonDesc.split(" ");
        let line = "";
        let lineY = boxY + 78;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > boxW - 50 && n > 0) {
            ctx.fillText(line, boxX + 25, lineY);
            line = words[n] + " ";
            lineY += 24;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, boxX + 25, lineY);
        ctx.restore();
      }
      // 타임라인 끝자락에 나타나는 미지의 영역(포털) 시각화
      drawFuturePortal(ctx, x, y, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = alpha;
        const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 400);
        outerGlow.addColorStop(0, "rgba(0, 255, 212, 0.15)");
        outerGlow.addColorStop(0.5, "rgba(0, 170, 255, 0.05)");
        outerGlow.addColorStop(1, "transparent");
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 400, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate(this.portalAngle * (i % 2 === 0 ? 1 : -1) * (0.5 + i * 0.2));
          ctx.strokeStyle = i % 2 === 0 ? "rgba(0, 255, 212, 0.4)" : "rgba(0, 170, 255, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([30, 20 + i * 10]);
          ctx.beginPath();
          ctx.ellipse(0, 0, 120 + i * 40, 70 + i * 25, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
        const pulse = Math.sin(this.portalAngle * 3) * 10;
        coreGradient.addColorStop(0, "#ffffff");
        coreGradient.addColorStop(0.3, "#00ffd4");
        coreGradient.addColorStop(0.6, "rgba(0, 170, 255, 0.5)");
        coreGradient.addColorStop(1, "transparent");
        ctx.fillStyle = coreGradient;
        ctx.shadowBlur = 30 + pulse;
        ctx.shadowColor = "#00ffd4";
        ctx.beginPath();
        ctx.arc(0, 0, 50 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0, 255, 212, 0.8)";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.textData.futureTitle, 0, 160);
        ctx.font = "14px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillText(this.textData.futureSubtitle, 0, 185);
        ctx.restore();
      }
      // AI 모델 상세 팝업창 생성 (컴팩트 사이즈 적용)
      showModelDetail(model) {
        const detailOverlay = AppHelper.createUIElement(
          "div",
          "model-detail-overlay",
          {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "600",
            pointerEvents: "auto",
            backdropFilter: "blur(20px)"
          },
          "",
          [
            { event: "wheel", handler: (e) => e.stopPropagation() },
            { event: "pointerdown", handler: (e) => e.stopPropagation() }
          ]
        );
        const modal = AppHelper.createUIElement("div", "", {
          width: "600px",
          padding: "35px",
          backgroundColor: "rgba(10, 25, 45, 0.98)",
          border: "2px solid #00ffd4",
          borderRadius: "24px",
          color: "white",
          boxShadow: "0 0 50px rgba(0, 255, 212, 0.3)",
          overflowY: "auto",
          maxHeight: "85%",
          boxSizing: "border-box",
          scrollbarWidth: "thin",
          scrollbarColor: "#00ffd4 rgba(255,255,255,0.1)"
        });
        const title = AppHelper.createUIElement(
          "h3",
          "",
          { fontSize: "28px", color: "#00ffd4", marginBottom: "10px", fontWeight: "900" },
          model.name
        );
        const date = AppHelper.createUIElement(
          "div",
          "",
          { fontSize: "16px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "20px" },
          `${this.textData.releaseDateLabel}: ${model.date}`
        );
        const info = AppHelper.createUIElement(
          "p",
          "",
          { fontSize: "17px", lineHeight: "1.7", color: "#f0f0f0", marginBottom: "25px", whiteSpace: "pre-line" },
          model.details || model.desc
        );
        const featureTitle = AppHelper.createUIElement(
          "div",
          "",
          { fontSize: "15px", fontWeight: "bold", color: "#00aaff", marginBottom: "10px", textTransform: "uppercase" },
          this.textData.featureLabel
        );
        const featureList = AppHelper.createUIElement("ul", "", {
          paddingLeft: "20px",
          fontSize: "15px",
          lineHeight: "1.6",
          color: "#00ffd4"
        });
        model.features.forEach((f) => {
          const li = AppHelper.createUIElement("li", "", { marginBottom: "5px" }, f);
          featureList.appendChild(li);
        });
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            width: "100%",
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "transparent",
            color: "#00ffd4",
            border: "1px solid #00ffd4",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "900",
            fontSize: "16px",
            transition: "all 0.3s"
          },
          this.textData.detailClose,
          [{ event: "click", handler: () => detailOverlay.remove() }]
        );
        modal.appendChild(title);
        modal.appendChild(date);
        modal.appendChild(info);
        modal.appendChild(featureTitle);
        modal.appendChild(featureList);
        modal.appendChild(closeBtn);
        detailOverlay.appendChild(modal);
        this.uiLayer.appendChild(detailOverlay);
        gsapWithCSS.from(modal, { opacity: 0, scale: 0.9, duration: 0.3 });
      }
      // 주요 AI 기업들의 강력한 모델들을 '반격' 테마로 시각화 (이용자 수 한글 표기 적용)
      showModelComparison() {
        if (!this.appData.aiModels || this.appData.aiModels.length === 0) return;
        const overlay = AppHelper.createUIElement(
          "div",
          "compare-overlay",
          {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(2, 4, 10, 0.98)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "50px 30px",
            zIndex: "400",
            pointerEvents: "auto",
            overflowY: "auto",
            backdropFilter: "blur(40px)",
            boxSizing: "border-box"
          },
          "",
          [
            { event: "wheel", handler: (e) => e.stopPropagation() },
            { event: "pointerdown", handler: (e) => e.stopPropagation() }
          ]
        );
        const headerBox = AppHelper.createUIElement("div", "", {
          textAlign: "center",
          marginBottom: "60px",
          flexShrink: "0",
          width: "100%"
        });
        const title = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "52px",
            color: "#ffffff",
            marginBottom: "15px",
            fontWeight: "900",
            letterSpacing: "4px",
            textShadow: "0 0 30px rgba(0, 255, 212, 0.5)"
          },
          this.textData.battleModeTitle
        );
        const subTitle = AppHelper.createUIElement(
          "p",
          "",
          {
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "2px"
          },
          "GLOBAL AI TITANS: THE ERA OF REVENGE"
        );
        headerBox.appendChild(title);
        headerBox.appendChild(subTitle);
        overlay.appendChild(headerBox);
        const arena = AppHelper.createUIElement("div", "battle-arena", {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
          width: "100%",
          maxWidth: "1600px",
          paddingBottom: "60px",
          boxSizing: "border-box",
          flexShrink: "0"
        });
        const brandColors = {
          GPT: "#00ffd4",
          OpenAI: "#00ffd4",
          Claude: "#d97757",
          Gemini: "#4285f4",
          Google: "#4285f4",
          xAI: "#ffffff",
          DeepSeek: "#0052cc",
          Perplexity: "#1db954"
        };
        this.appData.aiModels.forEach((series, sIdx) => {
          const brandBase = series.brand.split(" ")[0].replace("(", "").replace(")", "");
          const brandColor = brandColors[brandBase] || "#00ffd4";
          const column = AppHelper.createUIElement("div", "", {
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            boxSizing: "border-box"
          });
          const counterTitle = AppHelper.createUIElement("div", "", {
            fontSize: "26px",
            fontWeight: "900",
            color: brandColor,
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderLeft: `6px solid ${brandColor}`,
            borderRadius: "4px 16px 16px 4px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            boxShadow: `inset 10px 0 20px ${brandColor}11`
          });
          counterTitle.appendChild(AppHelper.createUIElement("span", "", { fontSize: "32px" }, series.icon));
          counterTitle.appendChild(
            AppHelper.createUIElement("span", "", {}, ` ${brandBase}${this.textData.counterAttackSuffix}`)
          );
          column.appendChild(counterTitle);
          const latestModel = series.models[series.models.length - 1];
          const card = AppHelper.createUIElement(
            "div",
            "",
            {
              padding: "30px",
              background: `linear-gradient(135deg, rgba(20,20,30,0.95) 0%, rgba(10,10,15,0.98) 100%)`,
              borderRadius: "24px",
              border: `1px solid ${brandColor}44`,
              position: "relative",
              cursor: "pointer",
              pointerEvents: "auto",
              transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
              boxSizing: "border-box",
              overflow: "hidden"
            },
            "",
            [
              {
                event: "click",
                handler: () => {
                  this.playSound("click");
                  this.showModelDetail(latestModel);
                }
              },
              {
                event: "mouseenter",
                handler: (e) => {
                  const t = e.currentTarget;
                  t.style.transform = "translateY(-10px) scale(1.02)";
                  t.style.borderColor = brandColor;
                  t.style.boxShadow = `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${brandColor}33`;
                }
              },
              {
                event: "mouseleave",
                handler: (e) => {
                  const t = e.currentTarget;
                  t.style.transform = "translateY(0) scale(1)";
                  t.style.borderColor = `${brandColor}44`;
                  t.style.boxShadow = "none";
                }
              }
            ]
          );
          const mName = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "28px", fontWeight: "900", color: "#fff", marginBottom: "15px", letterSpacing: "1px" },
            latestModel.name
          );
          const mDesc = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "25px", lineHeight: "1.6" },
            latestModel.desc
          );
          const stats = AppHelper.createUIElement("div", "", {
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          });
          const scoreRow = AppHelper.createUIElement("div", "");
          const scoreLabelRow = AppHelper.createUIElement("div", "", {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
            fontSize: "12px",
            fontWeight: "bold",
            color: brandColor
          });
          scoreLabelRow.appendChild(AppHelper.createUIElement("span", "", {}, "INTELLIGENCE INDEX"));
          scoreLabelRow.appendChild(AppHelper.createUIElement("span", "", {}, `${latestModel.techScore}%`));
          const scoreBarBg = AppHelper.createUIElement("div", "", {
            width: "100%",
            height: "6px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "3px",
            overflow: "hidden"
          });
          scoreBarBg.appendChild(
            AppHelper.createUIElement("div", "", {
              width: `${latestModel.techScore}%`,
              height: "100%",
              background: brandColor,
              boxShadow: `0 0 10px ${brandColor}`
            })
          );
          scoreRow.appendChild(scoreLabelRow);
          scoreRow.appendChild(scoreBarBg);
          const userRow = AppHelper.createUIElement("div", "", {
            marginTop: "10px",
            fontSize: "13px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          });
          userRow.appendChild(AppHelper.createUIElement("span", "", { color: brandColor }, "\u25CF"));
          userRow.appendChild(AppHelper.createUIElement("span", "", { marginLeft: "8px" }, `ACTIVE USERS: `));
          userRow.appendChild(
            AppHelper.createUIElement("span", "", { fontWeight: "900" }, this.formatKoreanUnit(latestModel.userCount))
          );
          stats.appendChild(scoreRow);
          stats.appendChild(userRow);
          card.appendChild(mName);
          card.appendChild(mDesc);
          card.appendChild(stats);
          column.appendChild(card);
          arena.appendChild(column);
          gsapWithCSS.from(column, { opacity: 0, y: 40, duration: 0.6, delay: sIdx * 0.1 });
        });
        overlay.appendChild(arena);
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            margin: "40px 0",
            padding: "18px 80px",
            backgroundColor: "transparent",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "40px",
            fontSize: "18px",
            fontWeight: "900",
            cursor: "pointer",
            transition: "all 0.3s",
            flexShrink: "0"
          },
          this.textData.detailClose,
          [{ event: "click", handler: () => overlay.remove() }]
        );
        overlay.appendChild(closeBtn);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(overlay, { opacity: 0, duration: 0.5 });
      }
      // 앱 초기화 및 데이터 로드, 배경 별자리 입자 설정 (MS Azure 카드에 대한 기업 창립 효과 매칭 제외 처리)
      async initialize() {
        this.appData = await AppHelper.loadAppData();
        this.textData = await AppHelper.loadTextData();
        this.assetList = await AppHelper.loadAssetList();
        this.lightningIndices = [];
        this.appData.events.forEach((e, idx) => {
          if (e.title.includes("\uC560\uB2C8\uC545") || e.title.includes("ChatGPT") && e.title.includes("\uBC1C\uD45C")) {
            this.lightningIndices.push(idx);
          }
        });
        this.galaxyIndices = [];
        this.appData.events.forEach((e, idx) => {
          if (e.title.includes("GPT-1") || e.title.includes("AlphaGo") && e.title.includes("\uC774\uC138\uB3CC")) {
            this.galaxyIndices.push(idx);
          }
        });
        this.iphoneCardIndex = -1;
        this.appData.events.forEach((e, idx) => {
          if (e.title.includes("iPhone") && e.title.includes("\uACF5\uAC1C")) {
            this.iphoneCardIndex = idx;
          }
        });
        this.youtubeCardIndex = -1;
        this.appData.events.forEach((e, idx) => {
          if (e.title.includes("YouTube") && e.title.includes("\uCC3D\uB9BD")) {
            this.youtubeCardIndex = idx;
          }
        });
        this.awsCardIndex = -1;
        this.appData.events.forEach((e, idx) => {
          if (e.title.includes("AWS") && e.title.includes("\uD074\uB77C\uC6B0\uB4DC \uCD9C\uC2DC")) {
            this.awsCardIndex = idx;
          }
        });
        this.msFoundationIndex = [];
        const companyThemes = [
          {
            keywords: ["\uC778\uD154", "Intel"],
            colors: [
              { r: 0, g: 113, b: 197 },
              { r: 0, g: 174, b: 239 },
              { r: 0, g: 75, b: 135 },
              { r: 255, g: 255, b: 255 }
            ],
            label: "SEMICONDUCTOR REVOLUTION",
            foundedName: "INTEL FOUNDED"
          },
          {
            keywords: ["\uB9C8\uC774\uD06C\uB85C\uC18C\uD504\uD2B8"],
            colors: [
              { r: 242, g: 80, b: 34 },
              { r: 127, g: 186, b: 0 },
              { r: 0, g: 120, b: 215 },
              { r: 255, g: 185, b: 0 }
            ],
            label: "SOFTWARE REVOLUTION",
            foundedName: "MICROSOFT FOUNDED"
          },
          {
            keywords: ["\uC560\uD50C", "Apple"],
            colors: [
              { r: 162, g: 170, b: 173 },
              { r: 83, g: 86, b: 90 },
              { r: 183, g: 110, b: 121 },
              { r: 201, g: 176, b: 55 }
            ],
            label: "PERSONAL COMPUTING REVOLUTION",
            foundedName: "APPLE FOUNDED"
          },
          {
            keywords: ["\uC5D4\uBE44\uB514\uC544", "NVIDIA"],
            colors: [
              { r: 118, g: 185, b: 0 },
              { r: 26, g: 26, b: 46 },
              { r: 168, g: 214, b: 0 },
              { r: 255, g: 255, b: 255 }
            ],
            label: "GPU COMPUTING REVOLUTION",
            foundedName: "NVIDIA FOUNDED"
          },
          {
            keywords: ["\uC544\uB9C8\uC874", "Amazon"],
            colors: [
              { r: 255, g: 153, b: 0 },
              { r: 35, g: 47, b: 62 },
              { r: 254, g: 189, b: 105 },
              { r: 20, g: 110, b: 180 }
            ],
            label: "E-COMMERCE REVOLUTION",
            foundedName: "AMAZON FOUNDED"
          },
          {
            keywords: ["\uAD6C\uAE00", "Google"],
            colors: [
              { r: 66, g: 133, b: 244 },
              { r: 234, g: 67, b: 53 },
              { r: 251, g: 188, b: 4 },
              { r: 52, g: 168, b: 83 }
            ],
            label: "SEARCH & DATA REVOLUTION",
            foundedName: "GOOGLE FOUNDED"
          },
          {
            keywords: ["\uD14C\uC2AC\uB77C", "Tesla"],
            colors: [
              { r: 204, g: 0, b: 0 },
              { r: 255, g: 255, b: 255 },
              { r: 192, g: 192, b: 192 },
              { r: 28, g: 28, b: 28 }
            ],
            label: "ELECTRIC MOBILITY REVOLUTION",
            foundedName: "TESLA FOUNDED"
          },
          {
            keywords: ["\uD398\uC774\uC2A4\uBD81", "Facebook"],
            colors: [
              { r: 24, g: 119, b: 242 },
              { r: 69, g: 153, b: 255 },
              { r: 10, g: 93, b: 194 },
              { r: 255, g: 255, b: 255 }
            ],
            label: "SOCIAL NETWORK REVOLUTION",
            foundedName: "FACEBOOK LAUNCHED"
          }
        ];
        this.appData.events.forEach((e, idx) => {
          if (e.theme !== "corporate") return;
          const isFoundingEvent = e.title.includes("\uCC3D\uB9BD") || e.title.includes("\uC124\uB9BD") || e.title.includes("\uCD9C\uBC94");
          if (!isFoundingEvent) return;
          if (e.title.includes("MS Azure") && e.title.includes("\uC815\uC2DD \uCD9C\uC2DC")) return;
          for (const theme of companyThemes) {
            const matched = theme.keywords.some((kw) => e.title.includes(kw));
            if (matched) {
              this.msFoundationIndex.push({
                idx,
                colors: theme.colors,
                label: theme.label,
                sublabel: `${e.year} \u2014 ${theme.foundedName}`
              });
              break;
            }
          }
        });
        this.canvas.width = this.appData.config.canvasWidth;
        this.canvas.height = this.appData.config.canvasHeight;
        for (let i = 0; i < this.appData.config.particleCount; i++) {
          this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
        this.reductionConstellationStars = Array.from({ length: 15 }, () => ({
          ox: Math.random() * 400 - 200,
          oy: Math.random() * 250 - 125,
          size: Math.random() * 2.5 + 1,
          speed: Math.random() * 15e-4 + 5e-4,
          phase: Math.random() * Math.PI * 2
        }));
        this.setupEventListeners();
        this.showTitleScreen();
        this.render();
      }
      // 사운드 초기화
      initSounds() {
        this.assetList.sounds.forEach((s) => {
          const howl = new import_howler.Howl({
            src: [s.file_path],
            loop: s.isBackgroundMusic,
            volume: s.isBackgroundMusic ? 0.2 : 0.5
          });
          this.sounds.set(s.id, howl);
        });
        const bgm = this.sounds.get("ambient_bgm");
        if (bgm && !bgm.playing()) bgm.play();
      }
      // 마우스 및 터치 조작, 휠 스크롤 이벤트를 관리하며 UI 요소 위에서도 스크롤이 작동하도록 처리
      setupEventListeners() {
        this.canvas.addEventListener("pointerdown", (e) => {
          const coords = AppHelper.getRelativeCoordinates(e.clientX, e.clientY, this.canvas);
          this.isDragging = true;
          this.lastMouseX = coords.x;
        });
        window.addEventListener("pointermove", (e) => {
          if (!this.isDragging || this.currentScreen !== "main") return;
          if (document.querySelector(".detail-overlay") || document.querySelector(".model-detail-overlay") || document.querySelector(".compare-overlay") || document.querySelector(".comp-timeline-overlay") || document.getElementById("timeline-search-overlay")) {
            return;
          }
          const coords = AppHelper.getRelativeCoordinates(e.clientX, e.clientY, this.canvas);
          const delta = coords.x - this.lastMouseX;
          this.targetScrollX += delta;
          this.lastMouseX = coords.x;
        });
        window.addEventListener("pointerup", () => {
          this.isDragging = false;
        });
        window.addEventListener("keydown", (e) => {
          if (this.currentScreen !== "main") return;
          if (e.key === "/" || (e.key === "f" || e.key === "F") && (e.ctrlKey || e.metaKey)) {
            const active = document.activeElement;
            const tagName = active && active instanceof HTMLElement ? active.tagName : "";
            if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
              e.preventDefault();
              this.openTimelineSearch();
            }
          }
        });
        window.addEventListener(
          "wheel",
          (e) => {
            if (this.currentScreen !== "main") return;
            const hasOverlay = document.querySelector(".detail-overlay") || document.querySelector(".model-detail-overlay") || document.querySelector(".compare-overlay") || document.querySelector(".comp-timeline-overlay") || document.getElementById("timeline-search-overlay");
            if (hasOverlay) return;
            this.targetScrollX -= e.deltaY;
          },
          { passive: true }
        );
      }
      // 신비롭고 화려한 효과가 적용된 타이틀 화면 구성
      showTitleScreen() {
        this.clearUI();
        this.currentScreen = "title";
        const container = AppHelper.createUIElement("div", "title-container", {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          pointerEvents: "none"
        });
        const title = AppHelper.createUIElement(
          "h1",
          "",
          {
            fontSize: "96px",
            marginBottom: "20px",
            fontWeight: "900",
            letterSpacing: "12px",
            textAlign: "center",
            background: "linear-gradient(45deg, #00ffd4, #00aaff, #ffffff, #00ffd4)",
            backgroundSize: "300% auto",
            webkitBackgroundClip: "text",
            webkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 40px rgba(0,255,212,0.8))"
          },
          this.textData.title
        );
        const subtitle = AppHelper.createUIElement(
          "p",
          "",
          {
            fontSize: "28px",
            marginBottom: "80px",
            opacity: "0",
            letterSpacing: "4px",
            textAlign: "center",
            fontWeight: "300",
            textShadow: "0 0 10px rgba(255,255,255,0.5)"
          },
          this.textData.subtitle
        );
        const startBtn = AppHelper.createUIElement(
          "button",
          "start-btn",
          {
            padding: "25px 80px",
            fontSize: "26px",
            fontWeight: "bold",
            cursor: "pointer",
            pointerEvents: "auto",
            backgroundColor: "transparent",
            color: "#00ffd4",
            border: "2px solid rgba(0, 255, 212, 0.5)",
            borderRadius: "60px",
            boxShadow: "0 0 20px rgba(0, 255, 212, 0.2), inset 0 0 20px rgba(0, 255, 212, 0.1)",
            transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
            opacity: "0",
            transform: "translateY(30px)"
          },
          this.textData.startButton,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                this.initSounds();
                this.showInstructionScreen();
              }
            },
            {
              event: "mouseenter",
              handler: (e) => {
                const t = e.target;
                t.style.backgroundColor = "rgba(0, 255, 212, 0.1)";
                t.style.borderColor = "#00ffd4";
                t.style.boxShadow = "0 0 40px rgba(0, 255, 212, 0.5), inset 0 0 10px rgba(0, 255, 212, 0.3)";
                t.style.letterSpacing = "4px";
              }
            },
            {
              event: "mouseleave",
              handler: (e) => {
                const t = e.target;
                t.style.backgroundColor = "transparent";
                t.style.borderColor = "rgba(0, 255, 212, 0.5)";
                t.style.boxShadow = "0 0 20px rgba(0, 255, 212, 0.2), inset 0 0 20px rgba(0, 255, 212, 0.1)";
                t.style.letterSpacing = "normal";
              }
            }
          ]
        );
        container.appendChild(title);
        container.appendChild(subtitle);
        container.appendChild(startBtn);
        this.uiLayer.appendChild(container);
        gsapWithCSS.to(subtitle, { opacity: 0.8, delay: 0.5, duration: 1.5 });
        gsapWithCSS.to(startBtn, { opacity: 1, y: 0, delay: 1, duration: 1.2, ease: "power4.out" });
        gsapWithCSS.to(title, { backgroundPosition: "300% center", duration: 8, repeat: -1, ease: "none" });
      }
      // 안내 화면 구성
      showInstructionScreen() {
        this.clearUI();
        this.currentScreen = "instructions";
        const container = AppHelper.createUIElement("div", "instruction-container", {
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 5, 15, 0.8)",
          backdropFilter: "blur(10px)"
        });
        const box = AppHelper.createUIElement("div", "", {
          width: "50%",
          padding: "50px",
          backgroundColor: "rgba(20, 30, 50, 0.95)",
          border: "1px solid rgba(0, 170, 255, 0.3)",
          borderRadius: "30px",
          textAlign: "center",
          color: "white"
        });
        const iTitle = AppHelper.createUIElement(
          "h2",
          "",
          { fontSize: "32px", color: "#00aaff", marginBottom: "30px" },
          this.textData.instructionTitle
        );
        const iText = AppHelper.createUIElement(
          "p",
          "",
          { fontSize: "19px", lineHeight: "1.8", marginBottom: "40px", whiteSpace: "pre-line" },
          this.textData.instructionContent
        );
        const nextBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            padding: "14px 40px",
            fontSize: "18px",
            cursor: "pointer",
            pointerEvents: "auto",
            backgroundColor: "#00aaff",
            color: "white",
            border: "none",
            borderRadius: "10px"
          },
          this.textData.instructionButton,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                this.startMainApp();
              }
            }
          ]
        );
        box.appendChild(iTitle);
        box.appendChild(iText);
        box.appendChild(nextBtn);
        container.appendChild(box);
        this.uiLayer.appendChild(container);
      }
      // 메인 연표 시작 및 레이아웃 초기화 (패권 타임라인, 할루시네이션 카드 및 사례 노드 포함)
      startMainApp() {
        this.clearUI();
        this.currentScreen = "main";
        this.scrollX = 0;
        this.targetScrollX = 0;
        this.rowLabelElements = [];
        this.isAiFilterActive = false;
        this.searchButtonElement = null;
        const wrapper = AppHelper.createUIElement("div", "timeline-wrapper", {
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden"
        });
        const labelConfigs = [
          { text: this.textData.rowLabelCorporate, id: "label-corp" },
          { text: this.textData.rowLabelHistorical, id: "label-hist" },
          { text: this.textData.rowLabelAI, id: "label-ai" }
        ];
        labelConfigs.forEach((config3) => {
          const label = AppHelper.createUIElement(
            "div",
            config3.id,
            {
              position: "absolute",
              left: "2%",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(0, 255, 212, 0.7)",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "8px 20px",
              borderLeft: "3px solid #00ffd4",
              zIndex: "10",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(5px)",
              borderRadius: "0 15px 15px 0",
              pointerEvents: "none",
              transition: "opacity 0.5s ease"
            },
            config3.text
          );
          wrapper.appendChild(label);
          this.rowLabelElements.push(label);
        });
        const searchGuide = AppHelper.createUIElement(
          "div",
          "main-timeline-search-guide",
          {
            position: "absolute",
            top: "3.3%",
            right: "4.8%",
            height: "42px",
            display: "flex",
            alignItems: "center",
            color: "rgba(255,255,255,0.78)",
            fontSize: "14px",
            fontWeight: "700",
            letterSpacing: "0.2px",
            pointerEvents: "none",
            zIndex: "21",
            textShadow: "0 0 10px rgba(0,0,0,0.35)",
            whiteSpace: "nowrap"
          },
          this.textData.mainSearchHint
        );
        wrapper.appendChild(searchGuide);
        const searchBtn = AppHelper.createUIElement(
          "button",
          "main-timeline-search-btn",
          {
            position: "absolute",
            top: "3%",
            right: "2%",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "1px solid rgba(0,255,212,0.5)",
            backgroundColor: "rgba(0, 255, 212, 0.12)",
            color: "#00ffd4",
            fontSize: "18px",
            fontWeight: "900",
            cursor: "pointer",
            pointerEvents: "auto",
            zIndex: "22",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 16px rgba(0,255,212,0.15)",
            transition: "all 0.25s ease",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          },
          "\u{1F50D}",
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                this.openTimelineSearch();
              }
            },
            {
              event: "mouseenter",
              handler: (e) => {
                const t = e.currentTarget;
                t.style.transform = "scale(1.08)";
                t.style.backgroundColor = "rgba(0, 255, 212, 0.22)";
                t.style.boxShadow = "0 0 24px rgba(0,255,212,0.3)";
              }
            },
            {
              event: "mouseleave",
              handler: (e) => {
                const t = e.currentTarget;
                t.style.transform = "scale(1)";
                t.style.backgroundColor = "rgba(0, 255, 212, 0.12)";
                t.style.boxShadow = "0 0 16px rgba(0,255,212,0.15)";
              }
            }
          ]
        );
        searchBtn.setAttribute("title", this.textData.mainSearchBtn);
        this.searchButtonElement = searchBtn;
        wrapper.appendChild(searchBtn);
        const navContainer = AppHelper.createUIElement("div", "nav-controls", {
          position: "absolute",
          bottom: "40px",
          left: "40px",
          display: "flex",
          gap: "15px",
          zIndex: "20",
          pointerEvents: "auto"
        });
        const totalDistance = (this.appData.events.length - 1) * 550 + 4e3;
        const navConfigs = [
          { text: this.textData.navStart, target: 0 },
          { text: this.textData.navMid, target: -totalDistance / 2.5 },
          { text: this.textData.navEnd, target: -totalDistance + 800 }
        ];
        navConfigs.forEach((n) => {
          const btn = AppHelper.createUIElement(
            "button",
            "",
            {
              padding: "12px 25px",
              backgroundColor: "rgba(0, 170, 255, 0.1)",
              border: "1px solid rgba(0, 170, 255, 0.5)",
              borderRadius: "15px",
              color: "#00aaff",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s"
            },
            n.text,
            [
              {
                event: "click",
                handler: () => {
                  this.playSound("click");
                  this.targetScrollX = n.target;
                }
              }
            ]
          );
          navContainer.appendChild(btn);
        });
        const aiFilterBtn = AppHelper.createUIElement(
          "button",
          "ai-filter-toggle",
          {
            padding: "12px 25px",
            backgroundColor: "rgba(0, 255, 212, 0.15)",
            border: "2px solid #00ffd4",
            borderRadius: "15px",
            color: "#00ffd4",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          },
          this.textData.highlightAiBtn,
          [
            {
              event: "click",
              handler: (e) => {
                this.toggleAiFilter(e.currentTarget);
              }
            }
          ]
        );
        navContainer.appendChild(aiFilterBtn);
        wrapper.appendChild(navContainer);
        const actionBtnGroup = AppHelper.createUIElement("div", "action-btn-group", {
          position: "absolute",
          bottom: "40px",
          right: "40px",
          display: "flex",
          gap: "12px",
          zIndex: "20",
          pointerEvents: "auto"
        });
        const hegemonyBtn = AppHelper.createUIElement(
          "button",
          "hegemony-timeline-btn",
          {
            padding: "15px 30px",
            backgroundColor: "rgba(0, 255, 212, 0.2)",
            border: "2px solid #00ffd4",
            borderRadius: "30px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "900",
            cursor: "pointer",
            transition: "all 0.3s",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 20px rgba(0, 255, 212, 0.2)"
          },
          this.textData.hegemonyTabBtn,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                this.showHegemonyTimeline();
              }
            }
          ]
        );
        const hallucinationBtn = AppHelper.createUIElement(
          "button",
          "hallucination-toggle-btn",
          {
            padding: "15px 25px",
            backgroundColor: "rgba(255, 94, 58, 0.15)",
            border: "2px solid #ff5e3a",
            borderRadius: "30px",
            color: "#ff5e3a",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
            backdropFilter: "blur(10px)"
          },
          this.textData.hallucinationBtn,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                this.showHallucinationInfo();
              }
            }
          ]
        );
        const roadmapGraphBtn = AppHelper.createUIElement(
          "button",
          "roadmap-graph-btn",
          {
            padding: "15px 25px",
            backgroundColor: "rgba(255, 212, 0, 0.15)",
            border: "2px solid #ffcc00",
            borderRadius: "30px",
            color: "#ffcc00",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
            backdropFilter: "blur(10px)"
          },
          this.textData.roadmapGraphBtn,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                this.showRoadmapVisualGraph();
              }
            }
          ]
        );
        const roadmapBtn = AppHelper.createUIElement(
          "button",
          "roadmap-toggle-btn",
          {
            padding: "15px 25px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "2px solid #ffffff",
            borderRadius: "30px",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
            backdropFilter: "blur(10px)"
          },
          this.textData.roadmapBtn,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                this.showLLMRoadmap();
              }
            }
          ]
        );
        const compTimelineBtn = AppHelper.createUIElement(
          "button",
          "comp-timeline-toggle-btn",
          {
            padding: "15px 25px",
            backgroundColor: "rgba(0, 170, 255, 0.15)",
            border: "2px solid #00aaff",
            borderRadius: "30px",
            color: "#00aaff",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
            backdropFilter: "blur(10px)"
          },
          this.textData.compTimelineBtn,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                this.showCompetitionTimeline();
              }
            }
          ]
        );
        const compareBtn = AppHelper.createUIElement(
          "button",
          "compare-toggle-btn",
          {
            padding: "15px 25px",
            backgroundColor: "rgba(0, 255, 212, 0.15)",
            border: "2px solid #00ffd4",
            borderRadius: "30px",
            color: "#00ffd4",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
            backdropFilter: "blur(10px)"
          },
          this.textData.compareBtn,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                this.showModelComparison();
              }
            }
          ]
        );
        actionBtnGroup.appendChild(hegemonyBtn);
        actionBtnGroup.appendChild(hallucinationBtn);
        actionBtnGroup.appendChild(roadmapGraphBtn);
        actionBtnGroup.appendChild(roadmapBtn);
        actionBtnGroup.appendChild(compTimelineBtn);
        actionBtnGroup.appendChild(compareBtn);
        wrapper.appendChild(actionBtnGroup);
        this.uiLayer.appendChild(wrapper);
        this.createEventNodes();
        this.createConstellationDecorations();
        this.createMilestoneSections();
        this.createHegemonyCards();
        this.createHallucinationTimelineCards();
        this.createHallucinationCaseNodes();
      }
      // 타임라인 이벤트 노드 생성 및 등장 애니메이션 적용 (아이폰 및 AI 주요 사건 강조 효과 추가, MS Azure 카드 블랙홀 효과 제거, 유튜브 카드 특수 효과 추가)
      createEventNodes() {
        const wrapper = document.getElementById("timeline-wrapper");
        if (!wrapper) return;
        const categoryColors = {
          hardware: "#ff5e3a",
          software: "#00aaff",
          network: "#00ffd4",
          economy: "#ffcc00"
        };
        this.eventNodePositions = [];
        this.eventFilterStates = [];
        this.appData.events.forEach((event, idx) => {
          const color = categoryColors[event.category] || "#ffffff";
          this.eventFilterStates.push({ factor: 1 });
          const isMSAzure = event.title.includes("MS Azure") && event.title.includes("\uC815\uC2DD \uCD9C\uC2DC");
          const isYouTube = event.title.includes("YouTube") && event.title.includes("\uCC3D\uB9BD");
          const isAWS = event.title.includes("AWS") && event.title.includes("\uD074\uB77C\uC6B0\uB4DC \uCD9C\uC2DC");
          const isHighlighted = !isMSAzure && (event.theme === "ai" && parseInt(event.year.split(".")[0]) >= 2023 || event.title.includes("iPhone") || isYouTube || isAWS);
          const node = AppHelper.createUIElement(
            "div",
            `event-${idx}`,
            {
              position: "absolute",
              top: "50%",
              width: "280px",
              backgroundColor: isAWS ? "rgba(12, 18, 28, 0.9)" : "rgba(10, 20, 35, 0.85)",
              border: isHighlighted ? `2px solid ${isYouTube ? "#ff0000" : isAWS ? "#ff9900" : "#00ffd4"}` : `1px solid rgba(255, 255, 255, 0.08)`,
              borderTop: `3px solid ${isYouTube ? "#ff0000" : isAWS ? "#ff9900" : color}`,
              borderRadius: "12px",
              padding: "0",
              color: "white",
              cursor: "pointer",
              pointerEvents: "auto",
              backdropFilter: "blur(20px)",
              boxShadow: isYouTube ? `0 0 40px rgba(255, 0, 0, 0.5), 0 0 15px rgba(255, 0, 0, 0.3)` : isAWS ? `0 0 40px rgba(255, 153, 0, 0.45), 0 0 16px rgba(20, 110, 180, 0.25)` : isHighlighted ? `0 0 30px rgba(0, 255, 212, 0.4)` : `0 8px 20px rgba(0, 0, 0, 0.4)`,
              transition: "transform 0.4s ease, border-color 0.4s, box-shadow 0.4s",
              zIndex: isHighlighted ? "5" : "2",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            },
            "",
            [
              {
                event: "click",
                handler: (e) => {
                  const target = e.currentTarget;
                  this.playSound("click");
                  if (!isMSAzure) {
                    this.triggerSparkle(target, isYouTube ? "#ff0000" : isAWS ? "#ff9900" : color);
                  }
                  setTimeout(() => this.showDetail(event), isMSAzure ? 0 : 200);
                }
              },
              {
                event: "mouseenter",
                handler: (e) => {
                  if (isMSAzure) return;
                  const t = e.currentTarget;
                  t.style.transform = "translate(-50%, -55%) scale(1.05)";
                  t.style.borderColor = isYouTube ? "#ff0000" : isAWS ? "#ff9900" : color;
                  t.style.boxShadow = isYouTube ? `0 15px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 0, 0, 0.6)` : isAWS ? `0 15px 40px rgba(0, 0, 0, 0.72), 0 0 34px rgba(255, 153, 0, 0.55), 0 0 20px rgba(20, 110, 180, 0.35)` : `0 15px 40px rgba(0, 0, 0, 0.7), 0 0 20px ${color}44`;
                  this.playSound("pop");
                }
              },
              {
                event: "mouseleave",
                handler: (e) => {
                  if (isMSAzure) return;
                  const t = e.currentTarget;
                  t.style.transform = "translate(-50%, -50%) scale(1)";
                  t.style.borderColor = isYouTube ? "#ff0000" : isAWS ? "#ff9900" : isHighlighted ? "#00ffd4" : "rgba(255, 255, 255, 0.08)";
                  t.style.boxShadow = isYouTube ? `0 0 40px rgba(255, 0, 0, 0.5), 0 0 15px rgba(255, 0, 0, 0.3)` : isAWS ? `0 0 40px rgba(255, 153, 0, 0.45), 0 0 16px rgba(20, 110, 180, 0.25)` : isHighlighted ? `0 0 30px rgba(0, 255, 212, 0.4)` : `0 8px 20px rgba(0, 0, 0, 0.4)`;
                }
              }
            ]
          );
          if (isHighlighted) {
            if (isYouTube) {
              gsapWithCSS.to(node, {
                boxShadow: "0 0 60px rgba(255, 0, 0, 0.7), 0 0 25px rgba(255, 0, 0, 0.4), inset 0 0 15px rgba(255, 0, 0, 0.2)",
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
              });
            } else if (isAWS) {
              gsapWithCSS.to(node, {
                boxShadow: "0 0 58px rgba(255, 153, 0, 0.65), 0 0 22px rgba(20, 110, 180, 0.35), inset 0 0 18px rgba(255, 189, 105, 0.16)",
                duration: 1.7,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
              });
            } else {
              gsapWithCSS.to(node, {
                boxShadow: "0 0 50px rgba(0, 255, 212, 0.6), inset 0 0 15px rgba(0, 255, 212, 0.3)",
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
              });
            }
          }
          const currentEvent = this.appData.events[idx];
          const visualArea = AppHelper.createUIElement(
            "div",
            "",
            {
              width: "100%",
              height: "70px",
              background: isYouTube ? `linear-gradient(135deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0.08))` : isAWS ? `linear-gradient(135deg, rgba(255, 153, 0, 0.26), rgba(20, 110, 180, 0.18), rgba(35, 47, 62, 0.25))` : isHighlighted ? `linear-gradient(135deg, #00ffd433, #00ffd411)` : `linear-gradient(135deg, ${color}22, ${color}08)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "36px",
              borderBottom: "1px solid rgba(255,255,255,0.05)"
            },
            currentEvent.icon
          );
          const textArea = AppHelper.createUIElement("div", "", { padding: "15px" });
          const yearTag = AppHelper.createUIElement(
            "div",
            "",
            {
              fontSize: "12px",
              fontWeight: "900",
              color: isYouTube ? "#ff0000" : isAWS ? "#ffb347" : isHighlighted ? "#00ffd4" : color,
              marginBottom: "6px",
              letterSpacing: "1px"
            },
            currentEvent.year
          );
          const titleTag = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "16px", fontWeight: "800", marginBottom: "8px", lineHeight: "1.3", color: "#ffffff" },
            currentEvent.title
          );
          const descTag = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "13px", opacity: "0.7", lineHeight: "1.5", fontWeight: "300" },
            currentEvent.description
          );
          textArea.appendChild(yearTag);
          textArea.appendChild(titleTag);
          textArea.appendChild(descTag);
          node.appendChild(visualArea);
          node.appendChild(textArea);
          wrapper.appendChild(node);
          this.eventNodePositions.push({ x: idx * 550 + 600, y: 500 });
          gsapWithCSS.from(node, {
            opacity: 0,
            scale: 0.8,
            y: 50,
            duration: 0.6,
            delay: idx * 0.03
          });
        });
      }
      // 특정 사건의 상세 정보를 별도의 세련된 모달 창으로 표시하여 풍부한 역사적 맥락을 전달
      showDetail(event) {
        const overlay = AppHelper.createUIElement(
          "div",
          "detail-overlay",
          {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 3, 10, 0.96)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "100",
            pointerEvents: "auto",
            backdropFilter: "blur(35px)"
          },
          "",
          [
            { event: "wheel", handler: (e) => e.stopPropagation() },
            { event: "pointerdown", handler: (e) => e.stopPropagation() }
          ]
        );
        const modal = AppHelper.createUIElement("div", "", {
          width: "80%",
          maxWidth: "960px",
          padding: "60px",
          backgroundColor: "rgba(15, 30, 55, 0.99)",
          border: "1px solid rgba(0, 255, 212, 0.4)",
          borderRadius: "40px",
          color: "white",
          position: "relative",
          overflowY: "auto",
          maxHeight: "85%",
          boxSizing: "border-box",
          scrollbarWidth: "thin",
          scrollbarColor: "#00ffd4 rgba(255,255,255,0.1)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8)"
        });
        const iconDeco = AppHelper.createUIElement(
          "div",
          "",
          { fontSize: "120px", position: "absolute", top: "40px", right: "60px", opacity: "0.08", pointerEvents: "none" },
          event.icon
        );
        const year = AppHelper.createUIElement(
          "div",
          "",
          { color: "#00ffd4", fontSize: "26px", fontWeight: "900", letterSpacing: "2px" },
          event.year
        );
        const title = AppHelper.createUIElement(
          "h2",
          "",
          {
            fontSize: "44px",
            margin: "20px 0 35px",
            fontWeight: "900",
            lineHeight: "1.2",
            letterSpacing: "-1px",
            textShadow: "0 0 25px rgba(0, 255, 212, 0.4)"
          },
          event.title
        );
        const bodyContainer = AppHelper.createUIElement("div", "", {
          display: "flex",
          flexDirection: "column",
          gap: "0px"
        });
        const detailText = event.details;
        const sections = detailText.split("\u25A0").filter((s) => s.trim().length > 0);
        if (sections.length >= 3) {
          const sectionColors = {
            \uC6D0\uC778: "#ff5e3a",
            "\uC9C1\uC811 \uACB0\uACFC": "#00ffd4",
            "\uAC04\uC811 \uC601\uD5A5": "#00aaff",
            "\uB2E4\uC74C \uC0AC\uAC74\uC73C\uB85C \uC774\uC5B4\uC9D0": "#ffcc00",
            "\uB2E4\uC74C \uC0AC\uAC74\uC73C\uB85C\uC758 \uC5F0\uACB0": "#ffcc00",
            "\uB2E4\uC74C \uC0AC\uAC74 \uC5F0\uACB0": "#ffcc00",
            "\uB2E4\uC74C \uC0AC\uAC74": "#ffcc00",
            "\uD6C4\uC18D \uC0AC\uAC74": "#ffcc00",
            "\uD6C4\uC18D \uC0AC\uAC74 \uBC0F \uC720\uC0B0": "#ffcc00",
            "\uC774\uD6C4\uC758 \uD750\uB984": "#ffcc00",
            "\uD5A5\uD6C4 \uC5F0\uACB0\uC131": "#ffcc00",
            "\uD5A5\uD6C4 \uD750\uB984": "#ffcc00",
            "\uC5F0\uACB0\uB418\uB294 \uC0AC\uAC74": "#ffcc00",
            "\uC5F0\uACC4 \uC0AC\uAC74": "#ffcc00",
            "\uC5ED\uC0AC\uC801 \uC5F0\uACB0": "#ffcc00",
            "\uC5ED\uC0AC\uC801 \uAC00\uCE58": "#ffcc00",
            "\uC774\uC5B4\uC9C0\uB294 \uC0AC\uAC74": "#ffcc00",
            \uC5F0\uACB0\uC131: "#ffcc00",
            "\uB4F1\uC7A5 \uC6D0\uC778": "#ff5e3a",
            "\uB4F1\uC7A5 \uBC30\uACBD": "#ff5e3a",
            "\uBC1C\uC0DD \uC6D0\uC778": "#ff5e3a",
            "\uAC1C\uBC1C \uC6D0\uC778": "#ff5e3a",
            "\uC5ED\uC0AC\uC801 \uBC30\uACBD": "#ff5e3a",
            "\uBC30\uACBD \uBC0F \uC6D0\uC778": "#ff5e3a",
            "\uC9C1\uC811\uC801\uC778 \uACB0\uACFC": "#00ffd4",
            "\uAC04\uC811\uC801\uC778 \uC601\uD5A5": "#00aaff",
            "\uACC4\uBCF4 \uBC0F \uD655\uC0B0": "#ffcc00"
          };
          const sectionIcons = {
            \uC6D0\uC778: "\u{1F50D}",
            "\uC9C1\uC811 \uACB0\uACFC": "\u26A1",
            "\uAC04\uC811 \uC601\uD5A5": "\u{1F30A}",
            "\uB2E4\uC74C \uC0AC\uAC74\uC73C\uB85C \uC774\uC5B4\uC9D0": "\u27A1\uFE0F",
            "\uB2E4\uC74C \uC0AC\uAC74\uC73C\uB85C\uC758 \uC5F0\uACB0": "\u27A1\uFE0F",
            "\uB2E4\uC74C \uC0AC\uAC74 \uC5F0\uACB0": "\u27A1\uFE0F",
            "\uB2E4\uC74C \uC0AC\uAC74": "\u27A1\uFE0F",
            "\uD6C4\uC18D \uC0AC\uAC74": "\u27A1\uFE0F",
            "\uD6C4\uC18D \uC0AC\uAC74 \uBC0F \uC720\uC0B0": "\u27A1\uFE0F",
            "\uC774\uD6C4\uC758 \uD750\uB984": "\u27A1\uFE0F",
            "\uD5A5\uD6C4 \uC5F0\uACB0\uC131": "\u27A1\uFE0F",
            "\uD5A5\uD6C4 \uD750\uB984": "\u27A1\uFE0F",
            "\uC5F0\uACB0\uB418\uB294 \uC0AC\uAC74": "\u27A1\uFE0F",
            "\uC5F0\uACC4 \uC0AC\uAC74": "\u27A1\uFE0F",
            "\uC5ED\uC0AC\uC801 \uC5F0\uACB0": "\u27A1\uFE0F",
            "\uC5ED\uC0AC\uC801 \uAC00\uCE58": "\u{1F3C6}",
            "\uC774\uC5B4\uC9C0\uB294 \uC0AC\uAC74": "\u27A1\uFE0F",
            \uC5F0\uACB0\uC131: "\u27A1\uFE0F",
            "\uB4F1\uC7A5 \uC6D0\uC778": "\u{1F50D}",
            "\uB4F1\uC7A5 \uBC30\uACBD": "\u{1F50D}",
            "\uBC1C\uC0DD \uC6D0\uC778": "\u{1F50D}",
            "\uAC1C\uBC1C \uC6D0\uC778": "\u{1F50D}",
            "\uC5ED\uC0AC\uC801 \uBC30\uACBD": "\u{1F50D}",
            "\uBC30\uACBD \uBC0F \uC6D0\uC778": "\u{1F50D}",
            "\uC9C1\uC811\uC801\uC778 \uACB0\uACFC": "\u26A1",
            "\uAC04\uC811\uC801\uC778 \uC601\uD5A5": "\u{1F30A}",
            "\uACC4\uBCF4 \uBC0F \uD655\uC0B0": "\u27A1\uFE0F"
          };
          sections.forEach((section) => {
            const lines = section.trim().split("\n");
            const headerLine = lines[0].trim();
            let sectionTitle = headerLine;
            let sectionColor = "#00ffd4";
            let sectionIcon = "\u{1F4CC}";
            for (const key of Object.keys(sectionColors)) {
              if (headerLine.includes(key)) {
                sectionTitle = key;
                sectionColor = sectionColors[key];
                sectionIcon = sectionIcons[key] || "\u{1F4CC}";
                break;
              }
            }
            const sectionBlock = AppHelper.createUIElement("div", "", {
              padding: "25px",
              marginBottom: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderLeft: `4px solid ${sectionColor}`,
              borderRadius: "0 16px 16px 0"
            });
            const sectionHeader = AppHelper.createUIElement(
              "div",
              "",
              {
                fontSize: "18px",
                fontWeight: "900",
                color: sectionColor,
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              },
              `${sectionIcon} ${sectionTitle}`
            );
            sectionBlock.appendChild(sectionHeader);
            const contentLines = lines.slice(1).filter((l) => l.trim().length > 0);
            contentLines.forEach((line) => {
              const trimmed = line.trim();
              const lineEl = AppHelper.createUIElement(
                "div",
                "",
                {
                  fontSize: "17px",
                  lineHeight: "1.8",
                  color: "rgba(255, 255, 255, 0.85)",
                  marginBottom: "6px",
                  paddingLeft: trimmed.startsWith("\u2022") || trimmed.startsWith("-") || trimmed.startsWith("\u2192") ? "10px" : "0",
                  fontWeight: "300"
                },
                trimmed
              );
              sectionBlock.appendChild(lineEl);
            });
            bodyContainer.appendChild(sectionBlock);
          });
        } else {
          const body = AppHelper.createUIElement(
            "div",
            "",
            { fontSize: "20px", lineHeight: "1.8", color: "#f0f0f0", whiteSpace: "pre-line", fontWeight: "300" },
            detailText
          );
          bodyContainer.appendChild(body);
        }
        const closeBtn = AppHelper.createUIElement(
          "button",
          "",
          {
            marginTop: "50px",
            padding: "18px 60px",
            fontSize: "18px",
            cursor: "pointer",
            backgroundColor: "#00ffd4",
            color: "#0a101a",
            border: "none",
            borderRadius: "15px",
            fontWeight: "900",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 30px rgba(0, 255, 212, 0.3)"
          },
          this.textData.detailClose,
          [
            {
              event: "click",
              handler: () => {
                this.playSound("click");
                gsapWithCSS.to(overlay, { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => overlay.remove() });
              }
            }
          ]
        );
        modal.appendChild(iconDeco);
        modal.appendChild(year);
        modal.appendChild(title);
        modal.appendChild(bodyContainer);
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        this.uiLayer.appendChild(overlay);
        gsapWithCSS.from(modal, { opacity: 0, scale: 0.9, y: 40, duration: 0.5, ease: "expo.out" });
      }
      // UI 레이어 초기화
      clearUI() {
        while (this.uiLayer.firstChild) {
          this.uiLayer.removeChild(this.uiLayer.firstChild);
        }
      }
      // 특정 사운드 재생
      playSound(id) {
        const s = this.sounds.get(id);
        if (s) s.play();
      }
      // 미래적이고 신비로운 분위기의 동적 배경 및 타임라인 렌더링 루프 (MS Azure 카드 뒤 블랙홀 효과 제거, 아이폰 애플 효과 추가, 유튜브 효과 추가)
      render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const time = Date.now() * 5e-4;
        const bgGrad = this.ctx.createRadialGradient(
          this.canvas.width / 2,
          this.canvas.height / 2,
          0,
          this.canvas.width / 2,
          this.canvas.height / 2,
          this.canvas.width
        );
        bgGrad.addColorStop(0, "#0a1a35");
        bgGrad.addColorStop(0.5, "#050d1a");
        bgGrad.addColorStop(1, "#000000");
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.strokeStyle = "rgba(0, 255, 212, 0.05)";
        this.ctx.lineWidth = 1;
        const gridSize = 100;
        const gridOffset = this.scrollX % gridSize;
        for (let x = gridOffset; x < this.canvas.width; x += gridSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, 0);
          this.ctx.lineTo(x, this.canvas.height);
          this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += gridSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, y);
          this.ctx.lineTo(this.canvas.width, y);
          this.ctx.stroke();
        }
        this.ctx.restore();
        this.particles.forEach((p, i) => {
          p.update(this.canvas.width, this.canvas.height);
          p.draw(this.ctx);
          for (let j = i + 1; j < this.particles.length; j++) {
            const p2 = this.particles[j];
            const dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
            if (dist < 90) {
              this.ctx.beginPath();
              this.ctx.strokeStyle = `rgba(0, 255, 212, ${0.1 * (1 - dist / 90)})`;
              this.ctx.moveTo(p.x, p.y);
              this.ctx.lineTo(p2.x, p2.y);
              this.ctx.stroke();
            }
          }
        });
        if (this.currentScreen === "main") {
          const totalDist = (this.appData.events.length - 1) * 550 + 5e3;
          this.targetScrollX = Math.max(-totalDist, Math.min(0, this.targetScrollX));
          this.scrollX += (this.targetScrollX - this.scrollX) * 0.08;
          const aiStartIdx = 53;
          const evolutionIdx = 64;
          const stargateIdx = 73;
          const transitionWidth = 550 * 5;
          const currentViewX = -this.scrollX + this.canvas.width / 2;
          const aiFactor = Math.max(
            0,
            Math.min(1, (currentViewX - (aiStartIdx * 550 + 600 - transitionWidth)) / transitionWidth)
          );
          const stargateFactor = Math.max(
            0,
            Math.min(1, (currentViewX - (stargateIdx * 550 + 600 - transitionWidth)) / transitionWidth)
          );
          const getDynamicY = (theme, fAI, fStar) => {
            if (theme === "corporate") return (35 * (1 - fAI) + 20 * fAI) * (1 - fStar) + 5 * fStar;
            if (theme === "ai") return (120 * (1 - fAI) + 80 * fAI) * (1 - fStar) + 70 * fStar;
            return (65 * (1 - fAI) + 50 * fAI) * (1 - fStar) + 30 * fStar;
          };
          if (this.rowLabelElements.length === 3) {
            this.rowLabelElements[0].style.top = `${getDynamicY("corporate", aiFactor, stargateFactor)}%`;
            this.rowLabelElements[0].style.opacity = `${(1 - stargateFactor) * (this.isAiFilterActive ? 0.3 : 1)}`;
            this.rowLabelElements[1].style.top = `${getDynamicY("historical", aiFactor, stargateFactor)}%`;
            this.rowLabelElements[1].style.opacity = `${this.isAiFilterActive ? 0.3 : 1}`;
            this.rowLabelElements[2].style.top = `${getDynamicY("ai", aiFactor, stargateFactor)}%`;
            this.rowLabelElements[2].style.opacity = `${aiFactor}`;
          }
          this.appData.events.forEach((event, idx) => {
            const yPos = getDynamicY(event.theme, aiFactor, stargateFactor) / 100 * this.canvas.height;
            this.eventNodePositions[idx].y = yPos;
          });
          this.ctx.save();
          this.ctx.beginPath();
          const lineAlpha = (0.15 + aiFactor * 0.25) * (this.isAiFilterActive ? 0.6 : 1);
          this.ctx.strokeStyle = `rgba(0, 255, 212, ${lineAlpha})`;
          this.ctx.lineWidth = 6;
          this.ctx.lineCap = "round";
          this.ctx.shadowBlur = this.isAiFilterActive ? 30 : 20;
          this.ctx.shadowColor = "#00ffd4";
          this.eventNodePositions.forEach((pos, i) => {
            const curX = pos.x + this.scrollX;
            if (i === 0) this.ctx.moveTo(curX, pos.y);
            else {
              const prevPos = this.eventNodePositions[i - 1];
              const prevX = prevPos.x + this.scrollX;
              const cpX = (prevX + curX) / 2;
              this.ctx.bezierCurveTo(cpX, prevPos.y, cpX, pos.y, curX, pos.y);
            }
          });
          const lastNodePos = this.eventNodePositions[this.eventNodePositions.length - 1];
          const portalX = lastNodePos.x + 1200;
          const portalY = getDynamicY("ai", aiFactor, stargateFactor) / 100 * this.canvas.height;
          const extCpX = (lastNodePos.x + portalX) / 2 + this.scrollX;
          this.ctx.bezierCurveTo(extCpX, lastNodePos.y, extCpX, portalY, portalX + this.scrollX, portalY);
          this.ctx.stroke();
          this.ctx.restore();
          this.constellationDecorData.forEach((item, idx) => {
            const node = this.constellationDecorNodes[idx];
            if (!node) return;
            const fx = item.baseX + this.scrollX;
            const fy = item.baseY + Math.sin(time * 1.8 + item.phase) * item.drift;
            const nearestEventDist = this.eventNodePositions.reduce((min, pos) => {
              const dx = fx - (pos.x + this.scrollX);
              const dy = fy - pos.y;
              return Math.min(min, Math.sqrt(dx * dx + dy * dy));
            }, Number.MAX_VALUE);
            const safeFactor = Math.max(0, Math.min(1, (nearestEventDist - 180) / 280));
            const viewportFactor = fx < -280 || fx > this.canvas.width + 280 ? 0 : 1;
            const decorAlpha = safeFactor * viewportFactor * (this.isAiFilterActive ? 0.42 : 0.72);
            if (decorAlpha > 0.02) {
              this.ctx.save();
              this.ctx.globalAlpha = decorAlpha * 0.9;
              const points = item.cluster.map((s, starIdx) => ({
                x: fx + s.x + Math.sin(time * 2.1 + item.phase + starIdx * 0.7) * 3,
                y: fy + s.y + Math.cos(time * 1.7 + item.phase + starIdx * 0.6) * 3,
                s: s.s
              }));
              item.links.forEach((link) => {
                const a = points[link[0]];
                const b = points[link[1]];
                if (!a || !b) return;
                this.ctx.beginPath();
                this.ctx.moveTo(a.x, a.y);
                this.ctx.lineTo(b.x, b.y);
                this.ctx.strokeStyle = "rgba(150, 215, 255, 0.18)";
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
              });
              points.forEach((p, starIdx) => {
                const pulse = 0.55 + Math.sin(time * 3.5 + item.phase + starIdx) * 0.2;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(220, 245, 255, ${pulse})`;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = "rgba(170, 230, 255, 0.5)";
                this.ctx.fill();
              });
              this.ctx.restore();
            }
            node.style.left = `${fx / this.canvas.width * 100}%`;
            node.style.top = `${fy / this.canvas.height * 100}%`;
            node.style.transform = "translate(-50%, -50%)";
            node.style.opacity = decorAlpha.toFixed(3);
            node.style.display = decorAlpha <= 0.03 ? "none" : "block";
          });
          this.lightningIndices.forEach((idx) => {
            const nodePos = this.eventNodePositions[idx];
            if (nodePos) {
              const tx = nodePos.x + this.scrollX;
              const ty = nodePos.y;
              if (tx > -300 && tx < this.canvas.width + 300) {
                this.drawPsionicStorm(this.ctx, tx, ty);
              }
            }
          });
          this.galaxyIndices.forEach((idx) => {
            const nodePos = this.eventNodePositions[idx];
            if (nodePos) {
              const tx = nodePos.x + this.scrollX;
              const ty = nodePos.y;
              if (tx > -400 && tx < this.canvas.width + 400) {
                this.drawGalaxyEffect(this.ctx, tx, ty);
              }
            }
          });
          this.msFoundationIndex.forEach((config3) => {
            const ev = this.appData.events[config3.idx];
            if (ev && ev.title.includes("MS Azure") && ev.title.includes("\uC815\uC2DD \uCD9C\uC2DC")) return;
            const nodePos = this.eventNodePositions[config3.idx];
            if (nodePos) {
              const tx = nodePos.x + this.scrollX;
              const ty = nodePos.y;
              if (tx > -400 && tx < this.canvas.width + 400) {
                this.drawMSFoundationEffect(this.ctx, tx, ty, config3);
              }
            }
          });
          if (this.iphoneCardIndex >= 0) {
            const iphoneNodePos = this.eventNodePositions[this.iphoneCardIndex];
            if (iphoneNodePos) {
              const tx = iphoneNodePos.x + this.scrollX;
              const ty = iphoneNodePos.y;
              if (tx > -400 && tx < this.canvas.width + 400) {
                this.drawAppleIPhoneEffect(this.ctx, tx, ty);
              }
            }
          }
          if (this.youtubeCardIndex >= 0) {
            const ytNodePos = this.eventNodePositions[this.youtubeCardIndex];
            if (ytNodePos) {
              const tx = ytNodePos.x + this.scrollX;
              const ty = ytNodePos.y;
              if (tx > -400 && tx < this.canvas.width + 400) {
                this.drawYouTubeEffect(this.ctx, tx, ty);
              }
            }
          }
          if (this.awsCardIndex >= 0) {
            const awsNodePos = this.eventNodePositions[this.awsCardIndex];
            if (awsNodePos) {
              const tx = awsNodePos.x + this.scrollX;
              const ty = awsNodePos.y;
              if (tx > -420 && tx < this.canvas.width + 420) {
                this.drawAWSEffect(this.ctx, tx, ty);
              }
            }
          }
          const evoScreenX = evolutionIdx * 550 + 600 + this.scrollX;
          const evoY = getDynamicY("ai", aiFactor, stargateFactor) / 100 * this.canvas.height;
          if (evoScreenX > -800 && evoScreenX < this.canvas.width + 800) {
            this.drawEvolutionPortal(
              this.ctx,
              evoScreenX,
              evoY,
              Math.max(0, Math.min(1, aiFactor * 1.5)) * (this.isAiFilterActive ? 1 : 0.7)
            );
          }
          const portalScreenX = portalX + this.scrollX;
          if (portalScreenX > -800 && portalScreenX < this.canvas.width + 800) {
            this.drawFuturePortal(this.ctx, portalScreenX, portalY, Math.max(0, Math.min(1, (portalScreenX + 800) / 1600)));
          }
          const bhIdx = Math.floor(this.appData.events.length / 2);
          const bhEvent = this.appData.events[bhIdx];
          const isBhOnAzure = bhEvent && bhEvent.title.includes("MS Azure") && bhEvent.title.includes("\uC815\uC2DD \uCD9C\uC2DC");
          if (!isBhOnAzure) {
            const bhNodePos = this.eventNodePositions[bhIdx];
            if (bhNodePos) {
              const bhScreenX = bhNodePos.x + this.scrollX;
              const bhScreenY = bhNodePos.y;
              if (bhScreenX > -600 && bhScreenX < this.canvas.width + 600) {
                this.drawBlackHoleEffect(this.ctx, bhScreenX, bhScreenY);
              }
            }
          }
          const reductionX = 78 * 550 + 900 + this.scrollX;
          const reductionY = 220;
          const rDistFromCenter = Math.abs(reductionX - this.canvas.width / 2);
          const rAlpha = Math.max(0, Math.min(1, 1 - rDistFromCenter / 800)) * aiFactor;
          this.drawHallucinationReductionEffect(this.ctx, reductionX, reductionY, rAlpha);
          this.appData.events.forEach((_, idx) => {
            const el = document.getElementById(`event-${idx}`);
            if (el) {
              const pos = this.eventNodePositions[idx];
              const currentX = pos.x + this.scrollX;
              el.style.left = `${currentX / this.canvas.width * 100}%`;
              el.style.top = `${pos.y / this.canvas.height * 100}%`;
              el.style.transform = `translate(-50%, -50%)`;
              const evTheme = this.appData.events[idx].theme;
              const baseOpacity = evTheme === "ai" ? aiFactor : evTheme === "corporate" ? 1 - stargateFactor : 1;
              const finalOpacity = baseOpacity * (this.eventFilterStates[idx]?.factor ?? 1);
              el.style.opacity = finalOpacity.toString();
              el.style.display = currentX < -600 || currentX > this.canvas.width + 600 || finalOpacity <= 0 ? "none" : "flex";
            }
          });
          this.hegemonyCards.forEach((card, idx) => {
            const periodX = (64 + idx * 4) * 550 + 1e3 + this.scrollX;
            card.style.left = `${periodX / this.canvas.width * 100}%`;
            card.style.display = periodX < -800 || periodX > this.canvas.width + 800 || !this.isAiFilterActive && aiFactor < 0.3 ? "none" : "flex";
            card.style.opacity = aiFactor.toString();
          });
          this.hallucinationTimelineCards.forEach((card, idx) => {
            const tYear = parseInt(this.appData.hallucinationData.timeline[idx].year);
            const yBase = tYear === 2023 ? 66 : tYear === 2024 ? 76 : tYear === 2025 ? 82 : 85;
            const tX = yBase * 550 + 900 + this.scrollX;
            card.style.left = `${tX / this.canvas.width * 100}%`;
            card.style.display = tX > -500 && tX < this.canvas.width + 500 && aiFactor > 0.4 ? "flex" : "none";
            card.style.opacity = aiFactor.toString();
          });
          this.hallucinationCaseNodes.forEach((node, idx) => {
            const c = this.appData.hallucinationData.cases[idx];
            const dateParts = c.date.split("~")[0].split(".");
            const yOffset = (parseInt(dateParts[0]) - 2023) * 12 + (parseInt(dateParts[1] || "1") - 1);
            const cX = (65 + yOffset * 0.7) * 550 + 600 + this.scrollX;
            node.style.left = `${cX / this.canvas.width * 100}%`;
            node.style.display = cX > -200 && cX < this.canvas.width + 200 && aiFactor > 0.5 ? "flex" : "none";
            node.style.opacity = aiFactor.toString();
          });
          const mBase = this.appData.events.length * 550 + 1e3;
          ["milestone-users", "milestone-tech", "milestone-image", "milestone-coding"].forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) {
              const x = mBase + 600 * (i + 1) + this.scrollX;
              el.style.left = `${x / this.canvas.width * 100}%`;
              el.style.display = x < -600 || x > this.canvas.width + 600 || this.isAiFilterActive ? "none" : "block";
            }
          });
        }
        this.ctx.fillStyle = "rgba(0, 255, 212, 0.02)";
        this.ctx.fillRect(0, Date.now() % 4e3 / 4e3 * this.canvas.height, this.canvas.width, 2);
        this.portalAngle += 0.012;
        requestAnimationFrame(() => this.render());
      }
    };
  }
});

// public/20260316090519_f1625a99-d204-4345-bc98-df5afd09de5f/main.ts
var require_main = __commonJS({
  "public/20260316090519_f1625a99-d204-4345-bc98-df5afd09de5f/main.ts"() {
    init_app();
    init_appHelper();
    var logicalWidth = 0;
    var logicalHeight = 0;
    var appCanvas = document.getElementById("appCanvas");
    var uiLayer = document.getElementById("uiLayer");
    var appContainer = document.getElementById("appContainer");
    var isCanvasLayoutUpdating = false;
    function UpdateCanvasLayout() {
      if (!isCanvasLayoutUpdating) {
        window.requestAnimationFrame(() => {
          isCanvasLayoutUpdating = true;
          if (appCanvas.width !== 1 && appCanvas.height !== 1) {
            if (logicalWidth === 0 && logicalHeight === 0) {
              logicalWidth = appCanvas.width;
              logicalHeight = appCanvas.height;
            }
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            appContainer.style.cssText = "";
            appCanvas.style.cssText = "";
            uiLayer.style.cssText = "";
            const aspectCanvas = appCanvas.width / appCanvas.height;
            let displayWidth;
            let displayHeight;
            if (vw / vh > aspectCanvas) {
              displayHeight = vh;
              displayWidth = vh * aspectCanvas;
            } else {
              displayWidth = vw;
              displayHeight = vw / aspectCanvas;
            }
            const appContainerScale = displayWidth / appCanvas.width;
            appContainer.style.position = "absolute";
            appContainer.style.width = appCanvas.width + "px";
            appContainer.style.height = appCanvas.height + "px";
            appContainer.style.transformOrigin = "top left";
            appContainer.style.transform = `scale(${appContainerScale})`;
            appContainer.style.left = (vw - displayWidth) / 2 + "px";
            appContainer.style.top = (vh - displayHeight) / 2 + "px";
            appCanvas.style.position = "absolute";
            appCanvas.style.width = appCanvas.width + "px";
            appCanvas.style.height = "auto";
            appCanvas.style.top = "0";
            appCanvas.style.left = "0";
            appCanvas.style.touchAction = "none";
            const uiLayerScale = appCanvas.width / logicalWidth;
            ;
            uiLayer.style.position = "absolute";
            uiLayer.style.width = logicalWidth + "px";
            uiLayer.style.height = logicalHeight + "px";
            uiLayer.style.transformOrigin = "top left";
            uiLayer.style.transform = `scale(${uiLayerScale})`;
            uiLayer.style.top = "0";
            uiLayer.style.left = "0";
          }
          isCanvasLayoutUpdating = false;
        });
      }
    }
    function SetCanvasFocus() {
      if (document.activeElement !== appCanvas) {
        window.focus();
        appCanvas.focus();
      }
    }
    var resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === appCanvas) {
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
          payload: { width: appCanvas.width, height: appCanvas.height }
        }, "*");
      }
    });
    window.addEventListener("resize", UpdateCanvasLayout);
    appCanvas.addEventListener("pointerdown", SetCanvasFocus);
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        resizeObserver.observe(appCanvas);
        initApp();
        SetCanvasFocus();
        UpdateCanvasLayout();
      }, 0);
    });
  }
});
export default require_main();
/*! Bundled license information:

gsap/gsap-core.js:
  (*!
   * GSAP 3.12.5
   * https://gsap.com
   *
   * @license Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/CSSPlugin.js:
  (*!
   * CSSPlugin 3.12.5
   * https://gsap.com
   *
   * Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)

howler/dist/howler.js:
  (*!
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
  (*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
*/
