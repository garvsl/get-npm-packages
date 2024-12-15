import { CONFIG } from "./config";
import { JSDOM } from "jsdom";
import { UserPackages } from "./types";

export async function getPackages(
  user: string,
  page = 0,
  packages = { total: 0, packages: [] }
): Promise<UserPackages> {
  try {
    const response = await fetch(
      `${CONFIG.BASE_URL}/~${user}?page=${page}`,
      CONFIG.HEADERS
    );
    if (response.status != 200) {
      throw new Error(`Packages Retrieval Error! ${response.status}`);
    }

    const result = await response.text();
    const dom = new JSDOM(result);

    const script = dom.window.document.scripts.item(0)?.text!;
    const scriptObject = JSON.parse(script.slice(script.indexOf("{")));
    let curPackages = scriptObject.context.packages.objects;

    curPackages = curPackages
      .map((e: any) => {
        return {
          id: e.id,
          title: e.name,
          description: e.description || "",
          version: e.version,
          updated: e.date.rel,
          link: `${CONFIG.BASE_URL}/package/${e.name}`,
        };
      })
      .reverse()
      .concat(packages.packages);

    const paginate = dom.window.document.querySelector(
      `a[href='?page=${page + 1}']`
    );

    let res = {
      total: curPackages.length,
      username: user,
      packages: curPackages,
    };

    if (paginate) {
      res = await getPackages(user, page + 1, res);
    }

    return res;
  } catch (e) {
    console.error(e);
    return {
      total: 0,
      username: user,
      packages: [],
    };
  }
}
