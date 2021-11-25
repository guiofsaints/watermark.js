const Jimp = require("jimp");
const { readdir } = require('fs');
const { execSync } = require("child_process");

const LOGO = "assets/logo.png";
const DIR_INPUT = 'assets/input';
const DIR_OUTPUT = 'assets/output';

const generate = async (imageName) => {
    const FILENAME = `${DIR_INPUT}/${imageName}`;
    const OUTPUT_FILENAME = `${DIR_OUTPUT}/${imageName}`;

    console.log(`Reading image: ${FILENAME}`);

    const [image, logo] = await Promise.all([
        Jimp.read(FILENAME),
        Jimp.read(LOGO)
    ]);

    logo.resize(image.bitmap.width / 5, Jimp.AUTO);
    logo.opacity(0.2);

    const X = (image.bitmap.width - logo.bitmap.width) / 2;
    const Y = (image.bitmap.height - logo.bitmap.height) / 2;

    console.log(`Generating image: ${FILENAME}`);

    const result = await image
        .composite(logo, X, Y, [
            {
                mode: Jimp.BLEND_SCREEN,
                opacitySource: 0.1,
                opacityDest: 1
            }
        ]);

    result.write(OUTPUT_FILENAME);
};


readdir(DIR_INPUT, (err, files) => {
    if (err) {
        throw err;
    }

    for (file of files) {
        generate(file);
    }


});





// execSync(`open ${FILENAME}`);
