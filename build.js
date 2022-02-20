const fs = require('fs');
const path = require('path');
const emoji = require('./emoji.json');
const SVGSpriter = require('svg-sprite');

const config = {
    dest: './dist',
    log: true,
    shape: {
        id: {
            generator: (filepath) => path.basename(filepath).replace('emoji_u', '').replace('.svg', ''),
        },
        dimension: {},
        spacing: {},
        transform: ['svgo'],
        meta: null,
        align: null,
        dest: 'svg'
    },
    svg: {},
    variables: {},
    mode: {
        css: true,
        view: true,
        defs: true,
        symbol: true,
        stack: true
    }
}

const compile = (group, emoji) => {
    const spriter = new SVGSpriter({ ...config, dest: `./dist/${group}` });

    emoji.map(name => {
        const file = `./emoji/${name}.svg`;
        if(fs.existsSync(file)) {
            spriter.add(path.resolve(file), file, fs.readFileSync(path.resolve(file), { encoding: 'utf-8' }));
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

Object.values(emoji.groups).forEach(group => compile(group.name, group.emoji));