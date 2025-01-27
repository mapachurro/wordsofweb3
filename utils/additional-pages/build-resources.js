import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Create equivalent of __dirname for ES Modules context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesTemplatePath = path.join(__dirname, "resources-template.html");
const resourcesDataPath = path.join(__dirname, "resources.json");
const outputPath = path.join(__dirname, "../../build/resources.html");

function renderTemplate(template, data) {
  return template.replace(/{{#(.*?)}}([\s\S]*?){{\/\1}}/g, (_, key, content) =>
    (data[key] || []).map(item => content.replace(/{{(.*?)}}/g, (_, k) => item[k] || "")).join("")
  ).replace(/{{(.*?)}}/g, (_, key) => data[key] || "");
}

export async function buildResourcesPage() {
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