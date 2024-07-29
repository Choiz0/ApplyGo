// src/api/fetchJobs.js
import axios from "axios";
import cheerio from "cheerio";

const fetchJobs = async (
  dateRange,
  location,
  keyword,
  includeKeywords,
  excludeKeywords
) => {
  const url = `https://www.seek.com.au/${keyword}-jobs/in-All-${location}?daterange=${dateRange}&page=1`;
  try {
    const response = await axios.get(url, {
      proxy: {
        host: "brd.superproxy.io",
        port: 22225,
        auth: {
          username: "brd-customer-hl_67f8a8df-zone-applygo",
          password: "trcyr34w8wg5",
        },
        rejectUnauthorized: false,
      },
    });

    const $ = cheerio.load(response.data);
    let jobs = [];
    $("article").each((index, element) => {
      const title = $(element)
        .find('a[data-automation="jobTitle"]')
        .text()
        .trim();
      const link = $(element)
        .find('a[data-automation="jobTitle"]')
        .attr("href");
      const company = $(element)
        .find('a[data-automation="jobCompany"]')
        .text()
        .trim();
      const location = $(element)
        .find('a[data-automation="jobLocation"]')
        .text()
        .trim();
      const postedDateText = $(element)
        .find('span[data-automation="jobListingDate"]')
        .text()
        .trim();
      const salaryText = $(element)
        .find('span[data-automation="jobSalary"]')
        .text()
        .trim();
      let salary = parseInt(salaryText.replace(/[^0-9]/g, ""), 10);

      const ulElements = [];
      $(element)
        .find("ul")
        .each((i, ul) => {
          const liTexts = [];
          $(ul)
            .find("li")
            .each((j, li) => {
              liTexts.push($(li).text().trim());
            });
          ulElements.push(liTexts);
        });

      // 필터링 적용
      const titleLower = title.toLowerCase();
      const includeKeywordsLower = includeKeywords
        .toLowerCase()
        .split(",")
        .map((kw) => kw.trim())
        .filter(Boolean);
      const excludeKeywordsLower = excludeKeywords
        .toLowerCase()
        .split(",")
        .map((kw) => kw.trim())
        .filter(Boolean);

      const includesAnyKeywords =
        includeKeywordsLower.length === 0 ||
        includeKeywordsLower.some((kw) => titleLower.includes(kw));

      const excludesAnyKeywords =
        excludeKeywordsLower.length === 0 ||
        !excludeKeywordsLower.some((kw) => titleLower.includes(kw));

      if (includesAnyKeywords && excludesAnyKeywords) {
        jobs.push({
          title,
          link: `https://www.seek.com.au${link}`,
          company,
          location,
          salary,
          additionalDetails: ulElements,
          postedDate: postedDateText,
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default fetchJobs;
