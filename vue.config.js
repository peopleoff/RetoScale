module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js',
        }
    }
    
}
