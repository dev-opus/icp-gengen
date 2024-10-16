const baseurl =
  'http://' + import.meta.env.CANISTER_ID_BACKEND + '.localhost:4943';

export const httpClient = {
  /**
   *
   * @description create a context object on the ICP blockchain via the REST API
   *
   */
  async createContext({ userId, imageUrl, text }) {
    try {
      const response = await fetch(baseurl + '/contexts', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, imageUrl, text }),
      });

      if (!response.ok) {
        const res = await response.json();
        const msg = res.msg;

        return { err: msg, data: null };
      }

      const data = await response.json();
      return {
        err: null,
        data: data.context,
      };
    } catch (error) {
      console.error(error);
    }
  },

  /**
   *
   * @description get a user's context objects from the ICP blockchain via the REST API
   *
   */
  async getUserContexts({ userId }) {
    try {
      const response = await fetch(`${baseurl}/contexts/${userId}`, {
        method: 'get',
      });

      if (!response.ok) {
        const res = await response.json();
        const msg = res.msg;

        return { err: msg, data: null };
      }

      const data = await response.json();
      return { err: null, data: data.contexts };
    } catch (error) {
      console.error(error);
    }
  },

  /**
   *
   * @description get other users context objects from the ICP blockchain via the REST API
   *
   */
  async getOthersContexts({ userId }) {
    try {
      const response = await fetch(`${baseurl}/contexts/?userId=${userId}`, {
        method: 'get',
      });

      if (!response.ok) {
        const res = await response.json();
        const msg = res.msg;

        return { err: msg, data: null };
      }

      const data = await response.json();
      return { err: null, data: data.contexts };
    } catch (error) {
      console.error(error);
    }
  },

  /**
   *
   * @description delete a user's context object from the ICP blockchain via the REST API
   *
   */
  async deleteContext({ userId, id }) {
    try {
      const response = await fetch(baseurl + '/contexts', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, contextId: id }),
      });

      if (!response.ok) {
        const res = await response.json();
        const msg = res.msg;

        return { err: msg, data: null };
      }

      const data = await response.json();
      return { err: null, data };
    } catch (error) {
      console.error(error);
    }
  },
};
