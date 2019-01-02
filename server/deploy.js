const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();
const _cliProgress = require('cli-progress');
const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_grey);
//Create auth.json in root folder of client for deploy variables.
const auth = require('./auth.json');

const config = {
    user: auth.FTP_User,
    password: auth.FTP_Password,
	host: auth.FTP_Host,
	port:  auth.FTP_Port,
	localRoot: __dirname + auth.FTP_Local_Dest,
	remoteRoot: auth.FTP_Remote_Dest,
    include: ['*', '**/*'],      // this would upload everything except dot files
    exclude: ['node_modules/**'],
	forcePasv: true
}
	
// use with callback
ftpDeploy.deploy(config, function(err) {
	if (err) console.log(err)
	else bar.stop();
});


ftpDeploy.on('uploaded', function(data) {
    if(data.transferredFileCount == 2){
        bar.start(data.totalFilesCount, 2);
    }
	bar.update(data.transferredFileCount);
});