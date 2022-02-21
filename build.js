const fs = require('fs');
const path = require('path');
const groups = require('./emoji.json');
const SVGSpriter = require('svg-sprite');

const config = {
    log: true,
    shape: {
        id: {
            generator: (filepath) => path.basename(filepath).replace('.svg', ''),
        },
        dimension: {},
        spacing: {},
        transform: ['svgo'],
        meta: null,
        align: null
    },
    svg: {},
    variables: {},
    mode: {
        css: false,
        view: false,
        defs: false,
        symbol: false,
        stack: true
    }
}

const compile = (group, emoji) => {
    const spriter = new SVGSpriter({ ...config, dest: `./dist/${group}` });

    emoji.map(name => {
        const file = `./twemoji/assets/svg/${name}.svg`;

        if(fs.existsSync(file)) {
            spriter.add(path.resolve(file), file, fs.readFileSync(path.resolve(file), { encoding: 'utf-8' }));
        } else {
            spriter.add(path.resolve(file), file, fs.readFileSync(path.resolve("./not-found.svg"), { encoding: 'utf-8' }));
        }
    });
    
    spriter.compile((error, result) => {
        for (const mode in result) {
            for (const resource in result[mode]) {
                fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
                fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
            }
        }
    });
}

Object.values(groups).forEach(group => compile(group.name, group.emoji));