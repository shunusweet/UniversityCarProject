const Client = require('ssh2-sftp-client');

async function uploadFileSftp(localPath, remotePath) {
  const sftp = new Client();
  try {
    await sftp.connect({
     host:process.env.SFTP_HOST || 'localhost', 
      port: 22,
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS
    });
    await sftp.put(localPath, remotePath);
    console.log('✅ File uploaded successfully:', remotePath);
  } finally {
    await sftp.end();
  }
}

module.exports = uploadFileSftp; // ✅ Correct export
