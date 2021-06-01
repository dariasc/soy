const fs = require('fs');
const fetch = require('node-fetch');

fetch('https://raw.githubusercontent.com/manami-project/anime-offline-database/master/anime-offline-database.json')
    .then(res => res.json())
    .then(json => {
        let output = [];
        for (let anime of json.data) {
            let anidb, anilist;
            for (let source of anime.sources) {
                if (source.includes("anidb.net")) {
                    anidb = parseInt(source.split('/').pop())
                } else if (source.includes("anilist.co")) {
                    anilist = parseInt(source.split('/').pop());
                }
            }

            if (anidb && anilist) {
                output.push(anidb);
                output.push(anilist);
            }
        }

        console.log(`[+] created ${output.length/2} entries`);
        let arr = new Uint32Array(output);
        let buffer = Buffer.from(arr.buffer);
        fs.writeFileSync('mappings.blob', buffer, 'binary')
        console.log(`[+] ${buffer.length} bytes written to mappings.blob`);
    });
