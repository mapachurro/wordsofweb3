import fs from "fs";
import path from "path";

const resourcesTemplatePath = path.join(__dirname, "resources-template.html");
const resourcesDataPath = path.join(__dirname, "resources.json");
const outputPath = path.join(__dirname, "../../build/resources.html");

function renderTemplate(template, data) {
  return template.replace(/{{#(.*?)}}([\s\S]*?){{\/\1}}/g, (_, key, content) =>
    (data[key] || []).map(item => content.replace(/{{(.*?)}}/g, (_, k) => item[k] || "")).join("")
  ).replace(/{{(.*?)}}/g, (_, key) => data[key] || "");
}

function buildResourcesPage() {
  try {
    const template = fs.readFileSync(resourcesTemplatePath, "utf-8");
    const data = JSON.parse(fs.readFileSync(resourcesDataPath, "utf-8"));
    const renderedPage = renderTemplate(template, data);

    fs.writeFileSync(outputPath, renderedPage, "utf-8");
    console.log("Resources page generated successfully!");
  } catch (err) {
    console.error("Error building resources page:", err);
  }
}

buildResourcesPage();
