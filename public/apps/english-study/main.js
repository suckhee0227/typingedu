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

// public/20260508053017_2ffdb212-7698-4a40-bade-c5674c481f01/appHelper.ts
var AppHelper;
var init_appHelper = __esm({
  "public/20260508053017_2ffdb212-7698-4a40-bade-c5674c481f01/appHelper.ts"() {
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
        const textData = data.textData;
        if (!textData?.default_language) {
          return textData;
        }
        const defaultLang = textData.default_language;
        let lang = defaultLang;
        if (textData.supported_multiple_languages) {
          lang = new URLSearchParams(window.location.search).get("lang") || defaultLang;
        }
        const langTexts = textData[lang];
        const texts = langTexts && Object.keys(langTexts).length > 0 ? langTexts : textData[defaultLang] || {};
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

// node_modules/canvas-confetti/dist/confetti.module.mjs
var module, confetti_module_default, create;
var init_confetti_module = __esm({
  "node_modules/canvas-confetti/dist/confetti.module.mjs"() {
    module = {};
    (function main(global, module2, isWorker, workerSize) {
      var canUseWorker = !!(global.Worker && global.Blob && global.Promise && global.OffscreenCanvas && global.OffscreenCanvasRenderingContext2D && global.HTMLCanvasElement && global.HTMLCanvasElement.prototype.transferControlToOffscreen && global.URL && global.URL.createObjectURL);
      var canUsePaths = typeof Path2D === "function" && typeof DOMMatrix === "function";
      var canDrawBitmap = (function() {
        if (!global.OffscreenCanvas) {
          return false;
        }
        var canvas = new OffscreenCanvas(1, 1);
        var ctx = canvas.getContext("2d");
        ctx.fillRect(0, 0, 1, 1);
        var bitmap = canvas.transferToImageBitmap();
        try {
          ctx.createPattern(bitmap, "no-repeat");
        } catch (e) {
          return false;
        }
        return true;
      })();
      function noop() {
      }
      function promise(func) {
        var ModulePromise = module2.exports.Promise;
        var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;
        if (typeof Prom === "function") {
          return new Prom(func);
        }
        func(noop, noop);
        return null;
      }
      var bitmapMapper = /* @__PURE__ */ (function(skipTransform, map) {
        return {
          transform: function(bitmap) {
            if (skipTransform) {
              return bitmap;
            }
            if (map.has(bitmap)) {
              return map.get(bitmap);
            }
            var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(bitmap, 0, 0);
            map.set(bitmap, canvas);
            return canvas;
          },
          clear: function() {
            map.clear();
          }
        };
      })(canDrawBitmap, /* @__PURE__ */ new Map());
      var raf = (function() {
        var TIME = Math.floor(1e3 / 60);
        var frame, cancel;
        var frames = {};
        var lastFrameTime = 0;
        if (typeof requestAnimationFrame === "function" && typeof cancelAnimationFrame === "function") {
          frame = function(cb) {
            var id = Math.random();
            frames[id] = requestAnimationFrame(function onFrame(time) {
              if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
                lastFrameTime = time;
                delete frames[id];
                cb();
              } else {
                frames[id] = requestAnimationFrame(onFrame);
              }
            });
            return id;
          };
          cancel = function(id) {
            if (frames[id]) {
              cancelAnimationFrame(frames[id]);
            }
          };
        } else {
          frame = function(cb) {
            return setTimeout(cb, TIME);
          };
          cancel = function(timer) {
            return clearTimeout(timer);
          };
        }
        return { frame, cancel };
      })();
      var getWorker = /* @__PURE__ */ (function() {
        var worker;
        var prom;
        var resolves = {};
        function decorate2(worker2) {
          function execute(options, callback) {
            worker2.postMessage({ options: options || {}, callback });
          }
          worker2.init = function initWorker(canvas) {
            var offscreen = canvas.transferControlToOffscreen();
            worker2.postMessage({ canvas: offscreen }, [offscreen]);
          };
          worker2.fire = function fireWorker(options, size, done) {
            if (prom) {
              execute(options, null);
              return prom;
            }
            var id = Math.random().toString(36).slice(2);
            prom = promise(function(resolve) {
              function workerDone(msg) {
                if (msg.data.callback !== id) {
                  return;
                }
                delete resolves[id];
                worker2.removeEventListener("message", workerDone);
                prom = null;
                bitmapMapper.clear();
                done();
                resolve();
              }
              worker2.addEventListener("message", workerDone);
              execute(options, id);
              resolves[id] = workerDone.bind(null, { data: { callback: id } });
            });
            return prom;
          };
          worker2.reset = function resetWorker() {
            worker2.postMessage({ reset: true });
            for (var id in resolves) {
              resolves[id]();
              delete resolves[id];
            }
          };
        }
        return function() {
          if (worker) {
            return worker;
          }
          if (!isWorker && canUseWorker) {
            var code = [
              "var CONFETTI, SIZE = {}, module = {};",
              "(" + main.toString() + ")(this, module, true, SIZE);",
              "onmessage = function(msg) {",
              "  if (msg.data.options) {",
              "    CONFETTI(msg.data.options).then(function () {",
              "      if (msg.data.callback) {",
              "        postMessage({ callback: msg.data.callback });",
              "      }",
              "    });",
              "  } else if (msg.data.reset) {",
              "    CONFETTI && CONFETTI.reset();",
              "  } else if (msg.data.resize) {",
              "    SIZE.width = msg.data.resize.width;",
              "    SIZE.height = msg.data.resize.height;",
              "  } else if (msg.data.canvas) {",
              "    SIZE.width = msg.data.canvas.width;",
              "    SIZE.height = msg.data.canvas.height;",
              "    CONFETTI = module.exports.create(msg.data.canvas);",
              "  }",
              "}"
            ].join("\n");
            try {
              worker = new Worker(URL.createObjectURL(new Blob([code])));
            } catch (e) {
              typeof console !== void 0 && typeof console.warn === "function" ? console.warn("\u{1F38A} Could not load worker", e) : null;
              return null;
            }
            decorate2(worker);
          }
          return worker;
        };
      })();
      var defaults = {
        particleCount: 50,
        angle: 90,
        spread: 45,
        startVelocity: 45,
        decay: 0.9,
        gravity: 1,
        drift: 0,
        ticks: 200,
        x: 0.5,
        y: 0.5,
        shapes: ["square", "circle"],
        zIndex: 100,
        colors: [
          "#26ccff",
          "#a25afd",
          "#ff5e7e",
          "#88ff5a",
          "#fcff42",
          "#ffa62d",
          "#ff36ff"
        ],
        // probably should be true, but back-compat
        disableForReducedMotion: false,
        scalar: 1
      };
      function convert(val, transform) {
        return transform ? transform(val) : val;
      }
      function isOk(val) {
        return !(val === null || val === void 0);
      }
      function prop(options, name, transform) {
        return convert(
          options && isOk(options[name]) ? options[name] : defaults[name],
          transform
        );
      }
      function onlyPositiveInt(number) {
        return number < 0 ? 0 : Math.floor(number);
      }
      function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
      function toDecimal(str) {
        return parseInt(str, 16);
      }
      function colorsToRgb(colors) {
        return colors.map(hexToRgb);
      }
      function hexToRgb(str) {
        var val = String(str).replace(/[^0-9a-f]/gi, "");
        if (val.length < 6) {
          val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
        }
        return {
          r: toDecimal(val.substring(0, 2)),
          g: toDecimal(val.substring(2, 4)),
          b: toDecimal(val.substring(4, 6))
        };
      }
      function getOrigin(options) {
        var origin = prop(options, "origin", Object);
        origin.x = prop(origin, "x", Number);
        origin.y = prop(origin, "y", Number);
        return origin;
      }
      function setCanvasWindowSize(canvas) {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
      }
      function setCanvasRectSize(canvas) {
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      function getCanvas(zIndex) {
        var canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = zIndex;
        return canvas;
      }
      function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
        context.save();
        context.translate(x, y);
        context.rotate(rotation);
        context.scale(radiusX, radiusY);
        context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
        context.restore();
      }
      function randomPhysics(opts) {
        var radAngle = opts.angle * (Math.PI / 180);
        var radSpread = opts.spread * (Math.PI / 180);
        return {
          x: opts.x,
          y: opts.y,
          wobble: Math.random() * 10,
          wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
          velocity: opts.startVelocity * 0.5 + Math.random() * opts.startVelocity,
          angle2D: -radAngle + (0.5 * radSpread - Math.random() * radSpread),
          tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
          color: opts.color,
          shape: opts.shape,
          tick: 0,
          totalTicks: opts.ticks,
          decay: opts.decay,
          drift: opts.drift,
          random: Math.random() + 2,
          tiltSin: 0,
          tiltCos: 0,
          wobbleX: 0,
          wobbleY: 0,
          gravity: opts.gravity * 3,
          ovalScalar: 0.6,
          scalar: opts.scalar,
          flat: opts.flat
        };
      }
      function updateFetti(context, fetti) {
        fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
        fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
        fetti.velocity *= fetti.decay;
        if (fetti.flat) {
          fetti.wobble = 0;
          fetti.wobbleX = fetti.x + 10 * fetti.scalar;
          fetti.wobbleY = fetti.y + 10 * fetti.scalar;
          fetti.tiltSin = 0;
          fetti.tiltCos = 0;
          fetti.random = 1;
        } else {
          fetti.wobble += fetti.wobbleSpeed;
          fetti.wobbleX = fetti.x + 10 * fetti.scalar * Math.cos(fetti.wobble);
          fetti.wobbleY = fetti.y + 10 * fetti.scalar * Math.sin(fetti.wobble);
          fetti.tiltAngle += 0.1;
          fetti.tiltSin = Math.sin(fetti.tiltAngle);
          fetti.tiltCos = Math.cos(fetti.tiltAngle);
          fetti.random = Math.random() + 2;
        }
        var progress = fetti.tick++ / fetti.totalTicks;
        var x1 = fetti.x + fetti.random * fetti.tiltCos;
        var y1 = fetti.y + fetti.random * fetti.tiltSin;
        var x2 = fetti.wobbleX + fetti.random * fetti.tiltCos;
        var y2 = fetti.wobbleY + fetti.random * fetti.tiltSin;
        context.fillStyle = "rgba(" + fetti.color.r + ", " + fetti.color.g + ", " + fetti.color.b + ", " + (1 - progress) + ")";
        context.beginPath();
        if (canUsePaths && fetti.shape.type === "path" && typeof fetti.shape.path === "string" && Array.isArray(fetti.shape.matrix)) {
          context.fill(transformPath2D(
            fetti.shape.path,
            fetti.shape.matrix,
            fetti.x,
            fetti.y,
            Math.abs(x2 - x1) * 0.1,
            Math.abs(y2 - y1) * 0.1,
            Math.PI / 10 * fetti.wobble
          ));
        } else if (fetti.shape.type === "bitmap") {
          var rotation = Math.PI / 10 * fetti.wobble;
          var scaleX = Math.abs(x2 - x1) * 0.1;
          var scaleY = Math.abs(y2 - y1) * 0.1;
          var width = fetti.shape.bitmap.width * fetti.scalar;
          var height = fetti.shape.bitmap.height * fetti.scalar;
          var matrix = new DOMMatrix([
            Math.cos(rotation) * scaleX,
            Math.sin(rotation) * scaleX,
            -Math.sin(rotation) * scaleY,
            Math.cos(rotation) * scaleY,
            fetti.x,
            fetti.y
          ]);
          matrix.multiplySelf(new DOMMatrix(fetti.shape.matrix));
          var pattern = context.createPattern(bitmapMapper.transform(fetti.shape.bitmap), "no-repeat");
          pattern.setTransform(matrix);
          context.globalAlpha = 1 - progress;
          context.fillStyle = pattern;
          context.fillRect(
            fetti.x - width / 2,
            fetti.y - height / 2,
            width,
            height
          );
          context.globalAlpha = 1;
        } else if (fetti.shape === "circle") {
          context.ellipse ? context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) : ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
        } else if (fetti.shape === "star") {
          var rot = Math.PI / 2 * 3;
          var innerRadius = 4 * fetti.scalar;
          var outerRadius = 8 * fetti.scalar;
          var x = fetti.x;
          var y = fetti.y;
          var spikes = 5;
          var step = Math.PI / spikes;
          while (spikes--) {
            x = fetti.x + Math.cos(rot) * outerRadius;
            y = fetti.y + Math.sin(rot) * outerRadius;
            context.lineTo(x, y);
            rot += step;
            x = fetti.x + Math.cos(rot) * innerRadius;
            y = fetti.y + Math.sin(rot) * innerRadius;
            context.lineTo(x, y);
            rot += step;
          }
        } else {
          context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
          context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
          context.lineTo(Math.floor(x2), Math.floor(y2));
          context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
        }
        context.closePath();
        context.fill();
        return fetti.tick < fetti.totalTicks;
      }
      function animate(canvas, fettis, resizer, size, done) {
        var animatingFettis = fettis.slice();
        var context = canvas.getContext("2d");
        var animationFrame;
        var destroy;
        var prom = promise(function(resolve) {
          function onDone() {
            animationFrame = destroy = null;
            context.clearRect(0, 0, size.width, size.height);
            bitmapMapper.clear();
            done();
            resolve();
          }
          function update() {
            if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
              size.width = canvas.width = workerSize.width;
              size.height = canvas.height = workerSize.height;
            }
            if (!size.width && !size.height) {
              resizer(canvas);
              size.width = canvas.width;
              size.height = canvas.height;
            }
            context.clearRect(0, 0, size.width, size.height);
            animatingFettis = animatingFettis.filter(function(fetti) {
              return updateFetti(context, fetti);
            });
            if (animatingFettis.length) {
              animationFrame = raf.frame(update);
            } else {
              onDone();
            }
          }
          animationFrame = raf.frame(update);
          destroy = onDone;
        });
        return {
          addFettis: function(fettis2) {
            animatingFettis = animatingFettis.concat(fettis2);
            return prom;
          },
          canvas,
          promise: prom,
          reset: function() {
            if (animationFrame) {
              raf.cancel(animationFrame);
            }
            if (destroy) {
              destroy();
            }
          }
        };
      }
      function confettiCannon(canvas, globalOpts) {
        var isLibCanvas = !canvas;
        var allowResize = !!prop(globalOpts || {}, "resize");
        var hasResizeEventRegistered = false;
        var globalDisableForReducedMotion = prop(globalOpts, "disableForReducedMotion", Boolean);
        var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, "useWorker");
        var worker = shouldUseWorker ? getWorker() : null;
        var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
        var initialized = canvas && worker ? !!canvas.__confetti_initialized : false;
        var preferLessMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion)").matches;
        var animationObj;
        function fireLocal(options, size, done) {
          var particleCount = prop(options, "particleCount", onlyPositiveInt);
          var angle = prop(options, "angle", Number);
          var spread = prop(options, "spread", Number);
          var startVelocity = prop(options, "startVelocity", Number);
          var decay = prop(options, "decay", Number);
          var gravity = prop(options, "gravity", Number);
          var drift = prop(options, "drift", Number);
          var colors = prop(options, "colors", colorsToRgb);
          var ticks = prop(options, "ticks", Number);
          var shapes = prop(options, "shapes");
          var scalar = prop(options, "scalar");
          var flat = !!prop(options, "flat");
          var origin = getOrigin(options);
          var temp = particleCount;
          var fettis = [];
          var startX = canvas.width * origin.x;
          var startY = canvas.height * origin.y;
          while (temp--) {
            fettis.push(
              randomPhysics({
                x: startX,
                y: startY,
                angle,
                spread,
                startVelocity,
                color: colors[temp % colors.length],
                shape: shapes[randomInt(0, shapes.length)],
                ticks,
                decay,
                gravity,
                drift,
                scalar,
                flat
              })
            );
          }
          if (animationObj) {
            return animationObj.addFettis(fettis);
          }
          animationObj = animate(canvas, fettis, resizer, size, done);
          return animationObj.promise;
        }
        function fire(options) {
          var disableForReducedMotion = globalDisableForReducedMotion || prop(options, "disableForReducedMotion", Boolean);
          var zIndex = prop(options, "zIndex", Number);
          if (disableForReducedMotion && preferLessMotion) {
            return promise(function(resolve) {
              resolve();
            });
          }
          if (isLibCanvas && animationObj) {
            canvas = animationObj.canvas;
          } else if (isLibCanvas && !canvas) {
            canvas = getCanvas(zIndex);
            document.body.appendChild(canvas);
          }
          if (allowResize && !initialized) {
            resizer(canvas);
          }
          var size = {
            width: canvas.width,
            height: canvas.height
          };
          if (worker && !initialized) {
            worker.init(canvas);
          }
          initialized = true;
          if (worker) {
            canvas.__confetti_initialized = true;
          }
          function onResize() {
            if (worker) {
              var obj = {
                getBoundingClientRect: function() {
                  if (!isLibCanvas) {
                    return canvas.getBoundingClientRect();
                  }
                }
              };
              resizer(obj);
              worker.postMessage({
                resize: {
                  width: obj.width,
                  height: obj.height
                }
              });
              return;
            }
            size.width = size.height = null;
          }
          function done() {
            animationObj = null;
            if (allowResize) {
              hasResizeEventRegistered = false;
              global.removeEventListener("resize", onResize);
            }
            if (isLibCanvas && canvas) {
              if (document.body.contains(canvas)) {
                document.body.removeChild(canvas);
              }
              canvas = null;
              initialized = false;
            }
          }
          if (allowResize && !hasResizeEventRegistered) {
            hasResizeEventRegistered = true;
            global.addEventListener("resize", onResize, false);
          }
          if (worker) {
            return worker.fire(options, size, done);
          }
          return fireLocal(options, size, done);
        }
        fire.reset = function() {
          if (worker) {
            worker.reset();
          }
          if (animationObj) {
            animationObj.reset();
          }
        };
        return fire;
      }
      var defaultFire;
      function getDefaultFire() {
        if (!defaultFire) {
          defaultFire = confettiCannon(null, { useWorker: true, resize: true });
        }
        return defaultFire;
      }
      function transformPath2D(pathString, pathMatrix, x, y, scaleX, scaleY, rotation) {
        var path2d = new Path2D(pathString);
        var t1 = new Path2D();
        t1.addPath(path2d, new DOMMatrix(pathMatrix));
        var t2 = new Path2D();
        t2.addPath(t1, new DOMMatrix([
          Math.cos(rotation) * scaleX,
          Math.sin(rotation) * scaleX,
          -Math.sin(rotation) * scaleY,
          Math.cos(rotation) * scaleY,
          x,
          y
        ]));
        return t2;
      }
      function shapeFromPath(pathData) {
        if (!canUsePaths) {
          throw new Error("path confetti are not supported in this browser");
        }
        var path, matrix;
        if (typeof pathData === "string") {
          path = pathData;
        } else {
          path = pathData.path;
          matrix = pathData.matrix;
        }
        var path2d = new Path2D(path);
        var tempCanvas = document.createElement("canvas");
        var tempCtx = tempCanvas.getContext("2d");
        if (!matrix) {
          var maxSize = 1e3;
          var minX = maxSize;
          var minY = maxSize;
          var maxX = 0;
          var maxY = 0;
          var width, height;
          for (var x = 0; x < maxSize; x += 2) {
            for (var y = 0; y < maxSize; y += 2) {
              if (tempCtx.isPointInPath(path2d, x, y, "nonzero")) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
              }
            }
          }
          width = maxX - minX;
          height = maxY - minY;
          var maxDesiredSize = 10;
          var scale = Math.min(maxDesiredSize / width, maxDesiredSize / height);
          matrix = [
            scale,
            0,
            0,
            scale,
            -Math.round(width / 2 + minX) * scale,
            -Math.round(height / 2 + minY) * scale
          ];
        }
        return {
          type: "path",
          path,
          matrix
        };
      }
      function shapeFromText(textData) {
        var text, scalar = 1, color = "#000000", fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';
        if (typeof textData === "string") {
          text = textData;
        } else {
          text = textData.text;
          scalar = "scalar" in textData ? textData.scalar : scalar;
          fontFamily = "fontFamily" in textData ? textData.fontFamily : fontFamily;
          color = "color" in textData ? textData.color : color;
        }
        var fontSize = 10 * scalar;
        var font = "" + fontSize + "px " + fontFamily;
        var canvas = new OffscreenCanvas(fontSize, fontSize);
        var ctx = canvas.getContext("2d");
        ctx.font = font;
        var size = ctx.measureText(text);
        var width = Math.ceil(size.actualBoundingBoxRight + size.actualBoundingBoxLeft);
        var height = Math.ceil(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);
        var padding = 2;
        var x = size.actualBoundingBoxLeft + padding;
        var y = size.actualBoundingBoxAscent + padding;
        width += padding + padding;
        height += padding + padding;
        canvas = new OffscreenCanvas(width, height);
        ctx = canvas.getContext("2d");
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        var scale = 1 / scalar;
        return {
          type: "bitmap",
          // TODO these probably need to be transfered for workers
          bitmap: canvas.transferToImageBitmap(),
          matrix: [scale, 0, 0, scale, -width * scale / 2, -height * scale / 2]
        };
      }
      module2.exports = function() {
        return getDefaultFire().apply(this, arguments);
      };
      module2.exports.reset = function() {
        getDefaultFire().reset();
      };
      module2.exports.create = confettiCannon;
      module2.exports.shapeFromPath = shapeFromPath;
      module2.exports.shapeFromText = shapeFromText;
    })((function() {
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof self !== "undefined") {
        return self;
      }
      return this || {};
    })(), module, false);
    confetti_module_default = module.exports;
    create = module.exports.create;
  }
});

// public/20260508053017_2ffdb212-7698-4a40-bade-c5674c481f01/app.ts
function createInitialState() {
  return {
    phase: "start",
    currentCategory: "",
    questions: [],
    currentIndex: 0,
    score: 0,
    stars: 0,
    choices: [],
    selectedIdx: null,
    correctIdx: null,
    sentencePool: [],
    sentenceSlots: [],
    sentenceFeedbackIndices: [],
    feedbackText: "",
    isProcessing: false,
    uiIds: []
  };
}
function clearUI() {
  appState.uiIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  appState.uiIds = [];
}
function setupStartUI() {
  clearUI();
  const categories = Object.entries(cachedTextData.categories);
  categories.forEach(([key, value], index) => {
    const btn = AppHelper.createUIElement(
      "button",
      `modeBtn_${key}`,
      {
        position: "absolute",
        left: "30%",
        top: `${30 + index * 15}%`,
        width: "40%",
        height: "10%",
        backgroundColor: "#FFFFFF",
        color: "#333333",
        fontSize: "28px",
        fontWeight: "bold",
        borderRadius: "16px",
        border: "none",
        boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        cursor: "pointer",
        pointerEvents: "auto",
        transition: "transform 0.1s"
      },
      value.label,
      [{ event: "click", handler: () => startQuiz(key) }]
    );
    uiLayer.appendChild(btn);
    appState.uiIds.push(`modeBtn_${key}`);
  });
}
function startQuiz(categoryKey) {
  const categoryData = cachedTextData.categories[categoryKey];
  const shuffledQuestions = [...categoryData.items].sort(() => Math.random() - 0.5);
  appState.phase = "quiz";
  appState.currentCategory = categoryKey;
  appState.questions = shuffledQuestions.slice(0, 8);
  appState.currentIndex = 0;
  appState.score = 0;
  appState.stars = 0;
  prepareQuestion();
}
function prepareQuestion() {
  clearUI();
  appState.feedbackText = "";
  appState.isProcessing = false;
  appState.sentenceFeedbackIndices = [];
  if (appState.currentCategory === "sentence") {
    prepareSentenceQuestion();
  } else {
    prepareWordQuestion();
  }
}
function prepareWordQuestion() {
  const currentItem = appState.questions[appState.currentIndex];
  const categoryData = cachedTextData.categories[appState.currentCategory];
  const allMeans = categoryData.items.map((i) => i.mean);
  const otherMeans = allMeans.filter((m) => m !== currentItem.mean).sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [currentItem.mean, ...otherMeans].sort(() => Math.random() - 0.5);
  appState.choices = choices;
  appState.correctIdx = choices.indexOf(currentItem.mean);
  appState.selectedIdx = null;
  setupWordQuizUI();
}
function prepareSentenceQuestion() {
  const currentItem = appState.questions[appState.currentIndex];
  const words = currentItem.english.split(" ");
  appState.sentenceSlots = [];
  appState.sentencePool = words.map((w, idx) => ({ word: w, isUsed: false, originalIndex: idx })).sort(() => Math.random() - 0.5);
  setupSentenceUI();
}
function setupWordQuizUI() {
  appState.choices.forEach((choice, index) => {
    const btn = AppHelper.createUIElement(
      "button",
      `choiceBtn_${index}`,
      {
        position: "absolute",
        left: index % 2 === 0 ? "15%" : "55%",
        top: index < 2 ? "50%" : "65%",
        width: "30%",
        height: "12%",
        backgroundColor: "#FFFFFF",
        color: "#333333",
        fontSize: "24px",
        fontWeight: "bold",
        borderRadius: "12px",
        border: "none",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
        pointerEvents: "auto",
        boxSizing: "border-box"
      },
      choice,
      [{ event: "click", handler: () => handleWordAnswer(index) }]
    );
    uiLayer.appendChild(btn);
    appState.uiIds.push(`choiceBtn_${index}`);
  });
}
function setupSentenceUI() {
  clearUI();
  const currentItem = appState.questions[appState.currentIndex];
  const targetWords = currentItem.english.split(" ");
  const slotCount = targetWords.length;
  const slotWidth = 12;
  const startX = 50 - slotCount * slotWidth / 2;
  appState.sentenceSlots.forEach((word, idx) => {
    const slotBtn = AppHelper.createUIElement(
      "button",
      `slotBtn_${idx}`,
      {
        position: "absolute",
        left: `${startX + idx * slotWidth}%`,
        top: "40%",
        width: `${slotWidth - 1}%`,
        height: "8%",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        pointerEvents: "auto"
      },
      "",
      [{ event: "click", handler: () => handleRemoveWord(idx) }]
    );
    uiLayer.appendChild(slotBtn);
    appState.uiIds.push(`slotBtn_${idx}`);
  });
  appState.sentencePool.forEach((item, index) => {
    const btn = AppHelper.createUIElement(
      "button",
      `poolBtn_${index}`,
      {
        position: "absolute",
        left: `${10 + index % 5 * 16}%`,
        top: `${65 + Math.floor(index / 5) * 10}%`,
        width: "14%",
        height: "8%",
        backgroundColor: item.isUsed ? "#E0E0E0" : "#FFFFFF",
        color: item.isUsed ? "#9E9E9E" : "#333333",
        fontSize: "20px",
        fontWeight: "bold",
        borderRadius: "8px",
        border: "2px solid #42A5F5",
        boxShadow: item.isUsed ? "none" : "0 4px 6px rgba(0,0,0,0.1)",
        cursor: item.isUsed ? "default" : "pointer",
        pointerEvents: item.isUsed ? "none" : "auto",
        transition: "transform 0.1s"
      },
      item.word,
      [{ event: "click", handler: () => handleAddWord(index) }]
    );
    uiLayer.appendChild(btn);
    appState.uiIds.push(`poolBtn_${index}`);
  });
  const isFull = appState.sentenceSlots.length === targetWords.length;
  const checkBtn = AppHelper.createUIElement(
    "button",
    "checkBtn",
    {
      position: "absolute",
      left: "40%",
      top: "85%",
      width: "20%",
      height: "10%",
      backgroundColor: isFull ? "#4CAF50" : "#CCCCCC",
      color: "#FFFFFF",
      fontSize: "24px",
      fontWeight: "bold",
      borderRadius: "12px",
      border: "none",
      cursor: isFull ? "pointer" : "default",
      pointerEvents: isFull ? "auto" : "none"
    },
    "\u2705 \uC815\uB2F5 \uD655\uC778",
    [{ event: "click", handler: () => checkSentenceAnswer() }]
  );
  uiLayer.appendChild(checkBtn);
  appState.uiIds.push("checkBtn");
}
function handleAddWord(poolIdx) {
  if (appState.isProcessing) return;
  const item = appState.sentencePool[poolIdx];
  appState.sentenceSlots.push(item.word);
  item.isUsed = true;
  setupSentenceUI();
}
function handleRemoveWord(slotIdx) {
  if (appState.isProcessing) return;
  const removedWord = appState.sentenceSlots.splice(slotIdx, 1)[0];
  const poolItem = appState.sentencePool.find((it) => it.word === removedWord && it.isUsed);
  if (poolItem) poolItem.isUsed = false;
  setupSentenceUI();
}
function handleWordAnswer(index) {
  if (appState.isProcessing) return;
  appState.isProcessing = true;
  appState.selectedIdx = index;
  const isCorrect = index === appState.correctIdx;
  if (isCorrect) {
    appState.score += 10;
    appState.stars += 1;
    appState.feedbackText = cachedTextData.feedbackCorrect;
    confetti_module_default({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  } else {
    const currentItem = appState.questions[appState.currentIndex];
    appState.feedbackText = cachedTextData.feedbackWrong.replace("[\uC815\uB2F5]", currentItem.mean);
  }
  setTimeout(() => nextQuestion(), 1500);
}
function checkSentenceAnswer() {
  if (appState.isProcessing) return;
  const currentItem = appState.questions[appState.currentIndex];
  const targetWords = currentItem.english.split(" ");
  const userWords = appState.sentenceSlots;
  let allMatch = true;
  appState.sentenceFeedbackIndices = [];
  for (let i = 0; i < targetWords.length; i++) {
    if (userWords[i] !== targetWords[i]) {
      allMatch = false;
      appState.sentenceFeedbackIndices.push(i);
    }
  }
  if (allMatch) {
    appState.isProcessing = true;
    appState.score += 20;
    appState.stars += 1;
    appState.feedbackText = cachedTextData.feedbackCorrect;
    confetti_module_default({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => nextQuestion(), 1500);
  } else {
    showSentenceRetryUI();
  }
}
function showSentenceRetryUI() {
  clearUI();
  const retryBtn = AppHelper.createUIElement(
    "button",
    "retryBtn",
    {
      position: "absolute",
      left: "30%",
      top: "85%",
      width: "18%",
      height: "8%",
      backgroundColor: "#FF9800",
      color: "#FFFFFF",
      fontSize: "22px",
      fontWeight: "bold",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      pointerEvents: "auto"
    },
    "\u{1F504} \uB2E4\uC2DC \uD558\uAE30",
    [
      {
        event: "click",
        handler: () => {
          const currentItem = appState.questions[appState.currentIndex];
          const words = currentItem.english.split(" ");
          appState.sentenceSlots = [];
          appState.sentencePool = words.map((w, idx) => ({ word: w, isUsed: false, originalIndex: idx })).sort(() => Math.random() - 0.5);
          appState.sentenceFeedbackIndices = [];
          setupSentenceUI();
        }
      }
    ]
  );
  uiLayer.appendChild(retryBtn);
  appState.uiIds.push("retryBtn");
  const skipBtn = AppHelper.createUIElement(
    "button",
    "skipBtn",
    {
      position: "absolute",
      left: "52%",
      top: "85%",
      width: "18%",
      height: "8%",
      backgroundColor: "#9E9E9E",
      color: "#FFFFFF",
      fontSize: "22px",
      fontWeight: "bold",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      pointerEvents: "auto"
    },
    "\u27A1\uFE0F \uAC74\uB108\uB6F0\uAE30",
    [{ event: "click", handler: () => nextQuestion() }]
  );
  uiLayer.appendChild(skipBtn);
  appState.uiIds.push("skipBtn");
}
function nextQuestion() {
  appState.currentIndex++;
  if (appState.currentIndex < appState.questions.length) {
    prepareQuestion();
  } else {
    showResult();
  }
}
function showResult() {
  appState.phase = "result";
  clearUI();
  const homeBtn = AppHelper.createUIElement(
    "button",
    "homeBtn",
    {
      position: "absolute",
      left: "40%",
      top: "75%",
      width: "20%",
      height: "10%",
      backgroundColor: "#2196F3",
      color: "#FFFFFF",
      fontSize: "24px",
      fontWeight: "bold",
      borderRadius: "12px",
      border: "none",
      boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
      cursor: "pointer",
      pointerEvents: "auto"
    },
    "\u{1F3E0} \uCC98\uC74C\uC73C\uB85C",
    [
      {
        event: "click",
        handler: () => {
          appState.phase = "start";
          setupStartUI();
        }
      }
    ]
  );
  uiLayer.appendChild(homeBtn);
  appState.uiIds.push("homeBtn");
}
function renderFrame() {
  const w = appCanvas.width;
  const h = appCanvas.height;
  appContext.fillStyle = "#E3F2FD";
  appContext.fillRect(0, 0, w, h);
  if (appState.phase === "start") {
    drawTitleArea(w, h);
  } else if (appState.phase === "quiz") {
    drawQuizHeader(w, h);
    drawQuizContent(w, h);
    drawFeedbackArea(w, h);
  } else if (appState.phase === "result") {
    drawResultScreen(w, h);
  }
  requestAnimationFrame(renderFrame);
}
function drawTitleArea(w, h) {
  appContext.textAlign = "center";
  appContext.fillStyle = "#1E88E5";
  appContext.font = "bold 80px sans-serif";
  appContext.fillText(cachedTextData.title, w / 2, h * 0.2);
}
function drawQuizHeader(w, h) {
  const hh = h * 0.15;
  appContext.fillStyle = "rgba(255, 255, 255, 0.7)";
  appContext.fillRect(0, 0, w, hh);
  const progress = appState.currentIndex / 8;
  appContext.fillStyle = "#BBDEFB";
  appContext.beginPath();
  appContext.roundRect(w * 0.25, hh * 0.65, w * 0.5, 20, 10);
  appContext.fill();
  appContext.fillStyle = "#42A5F5";
  appContext.beginPath();
  appContext.roundRect(w * 0.25, hh * 0.65, w * 0.5 * progress, 20, 10);
  appContext.fill();
  appContext.fillStyle = "#333333";
  appContext.font = "bold 24px sans-serif";
  appContext.textAlign = "center";
  appContext.fillText(`${appState.currentIndex}/8`, w / 2, hh * 0.88);
  appContext.textAlign = "left";
  appContext.fillText(`\uC810\uC218: ${appState.score}`, w * 0.05, hh * 0.45);
  appContext.textAlign = "right";
  appContext.fillText(`\u2B50 ${appState.stars}`, w * 0.95, hh * 0.45);
  appContext.textAlign = "center";
  appContext.font = "bold 32px sans-serif";
  appContext.fillText(cachedTextData.title, w / 2, hh * 0.45);
}
function drawQuizContent(w, h) {
  const currentItem = appState.questions[appState.currentIndex];
  if (!currentItem) return;
  if (appState.currentCategory === "sentence") {
    const sentenceItem = currentItem;
    appContext.textAlign = "center";
    appContext.fillStyle = "#333333";
    appContext.font = "bold 36px sans-serif";
    appContext.fillText(`${sentenceItem.emoji} ${sentenceItem.korean}`, w / 2, h * 0.3);
    const words = sentenceItem.english.split(" ");
    const slotCount = words.length;
    const slotW = w * 0.11;
    const slotH = h * 0.08;
    const gap = w * 0.01;
    const totalW = slotCount * slotW + (slotCount - 1) * gap;
    const startX = (w - totalW) / 2;
    for (let i = 0; i < slotCount; i++) {
      const curX = startX + i * (slotW + gap);
      const curY = h * 0.4;
      appContext.setLineDash([5, 5]);
      appContext.strokeStyle = "#42A5F5";
      appContext.lineWidth = 2;
      appContext.strokeRect(curX, curY, slotW, slotH);
      appContext.setLineDash([]);
      if (appState.sentenceSlots[i]) {
        const isWrong = appState.sentenceFeedbackIndices.includes(i);
        appContext.fillStyle = isWrong ? "#FFCDD2" : "#E3F2FD";
        appContext.fillRect(curX, curY, slotW, slotH);
        appContext.fillStyle = isWrong ? "#D32F2F" : "#1E88E5";
        appContext.font = "bold 24px sans-serif";
        appContext.fillText(appState.sentenceSlots[i], curX + slotW / 2, curY + slotH / 2 + 10);
      }
    }
  } else {
    const wordItem = currentItem;
    appContext.textAlign = "center";
    appContext.font = "120px sans-serif";
    appContext.fillText(wordItem.emoji, w / 2, h * 0.3);
    appContext.fillStyle = "#333333";
    appContext.font = "bold 60px sans-serif";
    appContext.fillText(wordItem.word, w / 2, h * 0.45);
  }
}
function drawFeedbackArea(w, h) {
  if (!appState.feedbackText) return;
  appContext.textAlign = "center";
  appContext.fillStyle = appState.feedbackText.includes("\uC815\uB2F5") ? "#4CAF50" : "#F44336";
  appContext.font = "bold 44px sans-serif";
  appContext.fillText(appState.feedbackText, w / 2, h * 0.82);
}
function drawResultScreen(w, h) {
  appContext.textAlign = "center";
  appContext.fillStyle = "#333333";
  appContext.font = "bold 60px sans-serif";
  appContext.fillText("\uCC38 \uC798\uD588\uC5B4\uC694!", w / 2, h * 0.25);
  appContext.font = "bold 40px sans-serif";
  appContext.fillText(`\uCD5C\uC885 \uC810\uC218: ${appState.score}\uC810`, w / 2, h * 0.4);
  appContext.fillText(`\uD68D\uB4DD\uD55C \uBCC4: \u2B50 ${appState.stars}`, w / 2, h * 0.5);
  const msg = appState.stars >= 7 ? cachedTextData.resultMessages[0] : appState.stars >= 4 ? cachedTextData.resultMessages[1] : cachedTextData.resultMessages[2];
  appContext.fillStyle = "#1E88E5";
  appContext.fillText(msg, w / 2, h * 0.65);
}
async function initApp() {
  appCanvas = document.getElementById("appCanvas");
  uiLayer = document.getElementById("uiLayer");
  const context = appCanvas.getContext("2d");
  if (!appCanvas || !uiLayer || !context) return;
  appContext = context;
  const appData = await AppHelper.loadAppData().catch(() => FALLBACK_APP_DATA);
  cachedTextData = await AppHelper.loadTextData();
  await AppHelper.loadAssetList();
  appCanvas.width = appData.logicalWidth;
  appCanvas.height = appData.logicalHeight;
  appState = createInitialState();
  setupStartUI();
  requestAnimationFrame(renderFrame);
}
var FALLBACK_APP_DATA, appState, appCanvas, appContext, uiLayer, cachedTextData;
var init_app = __esm({
  "public/20260508053017_2ffdb212-7698-4a40-bade-c5674c481f01/app.ts"() {
    init_appHelper();
    init_confetti_module();
    FALLBACK_APP_DATA = {
      logicalWidth: 1280,
      logicalHeight: 720,
      titleDisplayTimeMs: 1500
    };
  }
});

// public/20260508053017_2ffdb212-7698-4a40-bade-c5674c481f01/main.ts
var require_main = __commonJS({
  "public/20260508053017_2ffdb212-7698-4a40-bade-c5674c481f01/main.ts"() {
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
