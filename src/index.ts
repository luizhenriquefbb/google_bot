import { Builder, By, Key, until, WebElement, } from "selenium-webdriver";
import { writeFileSync } from "fs";
import download from "./download";
import args from "./yargsConfig";
import { sleep } from "./sleep";


async function openGooglePage() {
    let driver = await new Builder()
        .forBrowser('firefox')
        .build();

    await driver.get('https://www.google.com.br/');

    return driver;
};

async function main(string:string, numberOfImages:number) {
    // open googles page
    const driver = await openGooglePage();

    // search string
    await driver.findElement(By.name('q')).sendKeys(string, Key.RETURN);
    await driver.wait(until.titleContains('Pesquisa Google'), 2000);

    // change to image's tab
    const imageSearchButton = By.css('#hdtb-msb-vis > div:nth-child(3) > a');
    await driver.wait(until.elementLocated(imageSearchButton), 2000);
    await (await driver.findElement(imageSearchButton)).click();


    // select images
    let images = await driver.findElements(By.css("img.rg_i.Q4LuWd"));
    let images_before: WebElement[] = [];

    // scroll down
    while (images.length < numberOfImages || images.length === images_before.length) {
        images_before = await driver.findElements(By.css("img.rg_i.Q4LuWd"));
        await driver.findElement(By.css("body")).sendKeys(Key.PAGE_DOWN);

        // check if we need to click in "more images"
        try {
            await (await driver.findElement(By.css(".mye4qd"))).click();
            await sleep(2000);
        } catch (error) { }


        images = await driver.findElements(By.css("img.rg_i.Q4LuWd"));
    }

    // download images
    let imagesData:string[] = [];
    for (const index in images.slice(0, numberOfImages)) {
        const image = images[index];
        const imageName = `image-${parseInt(index)+1}.png`;
        const imageSrc = await image.getAttribute("src");
        if (imageSrc) {
            imagesData.push(imageSrc);
            download(imageSrc, `images/${imageName}`, () => {});
        }

    }

    // saving files urls
    await writeFileSync("images.json", JSON.stringify(imagesData));

    driver.close();
}


main(args["string"], args["number-of-images"]);