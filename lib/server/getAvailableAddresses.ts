import os from 'os';

export default function () {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const name in interfaces) {
    const array = interfaces[name];
    if (Array.isArray(array)) {
      array.forEach((info) => {
        if (info.family === 'IPv4') {
          addresses.push(info.address);
        }
      });
    }
  }

  if (addresses[0] !== '127.0.0.1') {
    addresses.reverse();
  }

  return addresses;
}
