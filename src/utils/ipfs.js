const ipfsClient = require('ipfs-api');
const ipfs = new ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

export const getImageIpfsHash = async (data) => {
    const result = await ipfs.files.add(data);
    const hash = await result[0].hash;
    return hash;
};
