import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://192.168.2.5:8880');

// you can place this helper in a separate file so that it can be reused
export async function initPocketBase(req, res) {
  const pb = new PocketBase('http://192.168.2.5:8880');

  // load the store data from the request cookie string
  pb.authStore.loadFromCookie(req?.headers?.cookie || '');

  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    res?.setHeader('set-cookie', pb.authStore.exportToCookie());
  });

  try {
      // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
      pb.authStore.isValid && await pb.collection('users').authRefresh();
  } catch (_) {
      // clear the auth store on failed refresh
      pb.authStore.clear();
  }

  return pb
}