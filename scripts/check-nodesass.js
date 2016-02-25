var exec = require('child_process').exec;

var currentSite = process.env.npm_config_sass_binary_site;

var newSite = 'http://ci.dev.its/node/node-sass-binaries';
var setNpmSassBinarySiteCmd = 'npm config set sass_binary_site=' + newSite;

function makeRed(text) {
    return '\x1B[31m' + text + '\x1B[39m';
}
function makeGreen(text) {
    return '\x1B[32m' + text + '\x1B[39m';
}
function makeMagenta(text) {
    return '\x1B[35m' + text + '\x1B[39m';
}

function setNpmSassBinarySiteConfig() {
    exec(setNpmSassBinarySiteCmd, function (err, stdout, stderr) {
        if (err !== null) {
            console.error(makeRed('sass_binary_site 设置失败: '), err, stderr);
        } else {
            console.info(makeMagenta('sass_binary_site 设置成功，cnpm install...'));
            exec('cnpm install --verbose', function (err2, stdout2, stderr2) {
                if (err2 !== null) {
                    console.error(makeRed('cnpm install 失败: '), err2, stderr2);
                } else {
                    console.error(makeGreen('cnpm install 成功'));
                }
            });
        }
    });
}

if (!currentSite) {
    console.info(makeMagenta('sass_binary_site 未配置，正在设置...'));
    setNpmSassBinarySiteConfig();
} else if (currentSite !== newSite) {
    console.info(makeMagenta('sass_binary_site 变更，正在重新设置...'));
    setNpmSassBinarySiteConfig();
} else {
    console.info(makeGreen('sass_binary_site 已设置：') + currentSite);
}
