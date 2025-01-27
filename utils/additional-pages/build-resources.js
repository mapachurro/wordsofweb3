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
  return template
    .replace(/{{#(.*?)}}([\s\S]*?){{\/\1}}/g, (_, key, content) => {
      console.log(`Processing section: ${key}`);
      console.log(`Data for ${key}:`, data[key]);

      return (data[key] || []).map(item => {
        if (key === "sections") {
          // Recursively process the nested "links" inside each section
          return content
            .replace(/{{#links}}([\s\S]*?){{\/links}}/g, (_, linkContent) => {
              return (item.links || []).map(link => {
                console.log(`Processing link:`, link);
                return linkContent.replace(/{{(.*?)}}/g, (_, k) => link[k] || "");
              }).join("");
            })
            .replace(/{{(.*?)}}/g, (_, k) => item[k] || "");
        } else {
          return content.replace(/{{(.*?)}}/g, (_, k) => item[k] || "");
        }
      }).join("");
    })
    .replace(/{{(.*?)}}/g, (_, key) => {
      console.log(`Replacing standalone key: ${key} with value: ${data[key]}`);
      return data[key] || "";
    });
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

buildResourcesPage();
