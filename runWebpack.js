global.styleVars = require('./styleVars')

const runWebpack = () => new Promise(function (resolve, reject) {
    delete require.cache[require.resolve('./webpack.config')]
    const config = require('./webpack.config'),
        webpack = require('webpack'),
        compiler = webpack(config)

    compiler.run((err, stats) => {
        console.log(err)
        resolve()
    })
})

const changeVarsSide = side => {
    const isRtl = side == 'right'
    Object.assign(styleVars, {
        side,
        opSide: isRtl ? 'left' : 'right',
        direction: isRtl ? 'rtl' : 'ltr'
    })
}

changeVarsSide('right')

runWebpack()
    .then(() => {
        if (styleVars.side != 'right') {
            changeVarsSide('right')
            runWebpack()
                .then(() => console.log('Done :)'))
                .catch(err => console.log('seconde runWebpack err', err))
        }

    })
    .catch(err => console.log('first runWebpack err', err))