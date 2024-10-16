export async function pinImageToPinata(file) {
  try {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));
    formData.append('pinataMetadata', JSON.stringify({ name: file.name }));

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${import.meta.env.CANISTER_PINATA_JWT_KEY}`,
      },
      body: formData,
    });

    const { IpfsHash } = await res.json();
    return (
      'https://' + import.meta.env.CANISTER_PINATA_GATEWAY + '/ipfs/' + IpfsHash
    );
  } catch (error) {
    console.log(error);
  }
}

export async function fileToGenerativePart(file) {
  const data = await fileToBase64(file);

  return {
    inlineData: { data, mimeType: file.type },
  };
}

function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
}
