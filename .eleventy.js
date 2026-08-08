const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Static passthrough
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("admin");

  // Blog post collection, newest first
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Date formatting filter
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("d LLLL yyyy");
  });

  // Issue number filter — oldest post is Vol. 01, counts up
  eleventyConfig.addFilter("volumeNumber", (date, allPosts) => {
    const sorted = [...allPosts].sort((a, b) => a.date - b.date);
    const idx = sorted.findIndex((p) => p.date.getTime() === date.getTime());
    return String(idx + 1).padStart(2, "0");
  });

  // Excerpt filter — first paragraph of content, stripped of tags
  eleventyConfig.addFilter("excerpt", (content, length = 160) => {
    const text = content.replace(/(<([^>]+)>)/gi, "").trim();
    return text.length > length ? text.slice(0, length).trim() + "…" : text;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
