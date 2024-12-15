import { CONFIG } from "./config";
import { JSDOM } from "jsdom";

export async function getPackages(user: string) {
  try {
    const response = await fetch(`${CONFIG.BASE_URL}/~${user}`, CONFIG.HEADERS);
    if (response.status != 200) {
      throw new Error(`Packages Retrieval Error! ${response.status}`);
    }

    const result = await response.text();
    const dom = new JSDOM(result);
    const script = dom.window.document.scripts.item(0)?.text!;
    const scriptObject = JSON.parse(script.slice(script.indexOf("{")));
    let packages = scriptObject.context.packages.objects;
    console.log({
      total: packages.length,
      packages,
    });
    // TODO pagination
    return;
    packages = packages
      .map((e: any) => {
        return {
          id: e.id,
          title: e.name,
          link: `${CONFIG.BASE_URL}/package/${e.name}`,
        };
      })
      .reverse();
    return packages;
  } catch (e) {
    console.log("packages erorr", e);
    return [];
  }
}

await getPackages("bangjelkoski");
