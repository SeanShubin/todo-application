var require = {
    baseUrl: '.',
    paths: {
        'qunit': 'qunit-1.23.1'
    },
    shim: {
        'qunit': {
            exports: 'QUnit',
            init: () => {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
};
