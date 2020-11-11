import yargs from "yargs/yargs";

var args = yargs(process.argv.slice(2))
    .options({
        "string": {
            alias: "s",
            demandOption: true,
            description: "Set the string to search",
            type: "string"
        },
        "number-of-images" : {
            alias: "n",
            demandOption: true,
            description: "Set the number of images to download",
            type: "number",
        }
    })
    .help('h')
    .alias('h', 'help')
        .epilog('luiz henrique freire barros 2020')
    .argv

export default args;
