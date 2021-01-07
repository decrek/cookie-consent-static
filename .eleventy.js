const htmlmin = require("html-minifier")

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./_tmp/styles.css");

  eleventyConfig.addPassthroughCopy({ "./_tmp/styles.css": "./styles.css" });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  }
};
