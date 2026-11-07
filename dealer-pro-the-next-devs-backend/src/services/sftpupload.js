const Client = require('ssh2-sftp-client');

async function uploadFileSftp(localPath, remotePath) {
  const sftp = new Client();
  try {
    await sftp.connect({
      host: 'sftp.bytbil.com',
      port: 2222,
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
      // or use privateKey
    });
    await sftp.put(localPath, remotePath);
    console.log('Uploaded:', remotePath);
  } finally {
    await sftp.end();
  }
}
module.exports = uploadFileSftp;