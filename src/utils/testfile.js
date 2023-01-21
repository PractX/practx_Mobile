// Paste this code block at the beginning of the JS code file:
const virgilCrypto = new VirgilCrypto.VirgilCrypto();
let channelKeyPair;
// Identity of the pre-defined "signle" user of the chat
const USER_IDENTITY = 'chatengine-demo-e2ee-user';
// The key under which the user's encrypted private key is stored in
// the Virgil Keyknox service
const USER_KEY_ID = 'chatengine-demo-e2ee-user-key';
// Prefix we will prepend to the ciphertext before sending the encrypted
// message to be able to tell the encrypted and plaintext messages apart
const ENC_MESSAGE_PREFIX = 'e2ee_by_virgil';
const initVirgil = async () => {
  // Get the JWT for authentication in Virgil APIs. Makes a request to the
  // server we've deployed for this demo. The Subject of the returned JWT will
  // always be equal to `USER_IDENTITY`
  const fetchVirgilJwt = async () => {
    const res = await fetch(
      'https://virgil-pubnub-demo-chat-server.herokuapp.com/virgil-jwt',
    );
    if (!res.ok) {
      throw new Error('Failed to get Virgil access token');
    }
    return await res.text();
  };
  // Get the pre-defined private key of the Chat Channel encrypted with the
  // user's public key.
  const fetchEncryptedChannelKey = async () => {
    const res = await fetch(
      'https://virgil-pubnub-demo-chat-server.herokuapp.com/channel-private-key',
    );
    if (!res.ok) {
      throw new Error('Failed to get encrypted channel key');
    }
    return await res.text();
  };

  const jwtProvider = new Virgil.CachingJwtProvider(fetchVirgilJwt);
  const brainKey = VirgilPythia.createBrainKey({
    virgilCrypto,
    virgilPythiaCrypto: new VirgilCrypto.VirgilPythiaCrypto(),
    accessTokenProvider: jwtProvider,
  });
  // Derive the key pair from password. The password is hard-coded for demo
  // purposes only, it must be provided by the user in a real app.
  const passwordKeyPair = await brainKey.generateKeyPair('PubNubD3m0o');

  // Setup the private key storage.
  const syncKeyStorage = Keyknox.SyncKeyStorage.create({
    // this key will be used to decrypt the Cloud-stored keys
    privateKey: passwordKeyPair.privateKey,
    // this key is used to encrypt the Cloud-stored keys
    publicKeys: passwordKeyPair.publicKey,
    keyEntryStorage: new Virgil.KeyEntryStorage(),
    accessTokenProvider: jwtProvider,
  });
  // Synchronize the keys between the Virgil Cloud and local storage (IndexedDB)
  await syncKeyStorage.sync();
  // Retrieve the pre-defined private key of the user
  const userPrivateKeyEntry = await syncKeyStorage.retrieveEntry(USER_KEY_ID);
  // Import to make it usable with `virgilCrypto` methods
  const userPrivateKey = virgilCrypto.importPrivateKey(
    userPrivateKeyEntry.value,
  );
  // Retrieve the Chat Channel private key encrypted with the user's public key
  const encryptedChannelPrivateKeyData = await fetchEncryptedChannelKey();
  // Decrypt with user's private key
  const channelPrivateKeyData = virgilCrypto.decrypt(
    encryptedChannelPrivateKeyData,
    userPrivateKey,
  );
  // Import to make it usable with `virgilCrypto` methods
  const channelPrivateKey = virgilCrypto.importPrivateKey(
    channelPrivateKeyData,
  );
  channelKeyPair = {
    privateKey: channelPrivateKey,
    publicKey: virgilCrypto.extractPublicKey(channelPrivateKey),
  };
};
