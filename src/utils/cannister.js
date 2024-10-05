import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as gengenIDL } from '../declarations/backend';

const GENGEN_CANISTER_ID = 'bw4dl-smaaa-aaaaa-qaacq-cai';

export async function getGengenCanister() {
  return await getCannister(GENGEN_CANISTER_ID, gengenIDL);
}

async function getCannister(canisterId, idl) {
  const authClient = window.auth.client;
  const agent = new HttpAgent({
    identity: authClient.getIdentity(),
  });

  await agent.fetchRootKey();
  return Actor.createActor(idl, { agent, canisterId });
}
