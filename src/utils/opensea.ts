/* eslint-disable max-len */
export const getOpenseaTestEvent = async () => {
  const openseaEvent = await fetch('https://testnets-api.opensea.io/api/v1/events?only_opensea=false&limit=20', {
    method: 'GET'
  })
    .then(res => res.json())
    .then(resJson => resJson.asset_events);

  return openseaEvent;
};

export const getBaycData = async () => {
  const baycData = await fetch('https://api.opensea.io/api/v1/collection/boredapeyachtclub/stats', {
    method: 'GET'
  })
    .then(res => res.json())
    .then(resJson => resJson.stats);

  return baycData;
};

export const getBaycFromMainnet = async (address: any) => {
  const mainnetBayc = await fetch(
    `https://api.opensea.io/api/v1/events?only_opensea=false&asset_contract_address=${address}&event_type=successful`,
    {
      method: 'GET',
      headers: {
        'x-api-key': '761a09f3087c4751a55fbabbea352868'
      }
    }
  )
    .then(res => res.json())
    .then(resJson => resJson.asset_events);

  return mainnetBayc;
};

export const getDoodleData = async () => {
  const doodleData = await fetch('https://api.opensea.io/api/v1/collection/doodles-official/stats', {
    method: 'GET'
  })
    .then(res => res.json())
    .then(resJson => resJson.stats);

  return doodleData;
};

export const getCryptopunksData = async () => {
  const cryptopunksData = await fetch('https://api.opensea.io/api/v1/collection/cryptopunks/stats', {
    method: 'GET'
  })
    .then(res => res.json())
    .then(resJson => resJson.stats);

  return cryptopunksData;
};
