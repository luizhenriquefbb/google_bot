import { createWriteStream, writeFileSync }  from "fs";
import request from "request";

var download = function (uri:string, filename:string, callback: () => void) {

    // se for base 64
    if (uri.match(/^data:image\/().+?;base64,/)){
        var base64Data = uri.replace(/^data:image\/().+?;base64,/, "");

        writeFileSync(filename, base64Data, 'base64');
    }

    // se for url
    else {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(createWriteStream(filename)).on('close', callback);
        });
    }


};

// download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function () {
//     console.log('done');
// });

export default download;