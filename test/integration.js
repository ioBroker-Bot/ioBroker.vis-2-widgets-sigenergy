const path = require('path');
const { tests } = require('@iobroker/testing');

// Run integration tests - this starts the adapter and verifies it doesn't crash
tests.integration(path.join(__dirname, '..'), {
    //            ~~~~~~~~~~~~~~~~~~~~~~~~~
    // This should be the adapter's root directory

    // If the adapter may call process.exit during startup, define here which exit codes are allowed.
    // By default, adapters are not allowed to call process.exit() during the startup phase,
    // but some adapters need to.
    // allowedExitCodes: [11],

    // To test against a different version of JS-Controller, you can change the version or the repository:
    // controllerVersion: 'v2.0.0', // NPM version
    // controllerRepo: 'https://github.com/ioBroker/ioBroker.js-controller', // GitHub URL

    // Define your own tests inside defineAdditionalTests
    // If you need predefined objects etc. here, you need to take care of it yourself
    defineAdditionalTests() {
        // none
    },
});
