module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/taxu-app/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "build/chunks/36ec8_8f1a9e12._.js",
  "build/chunks/[root-of-the-server]__ee0efe27._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/taxu-app/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];