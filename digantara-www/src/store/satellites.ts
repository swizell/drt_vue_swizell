import axios from "axios";
import type { ActionContext } from "vuex";
import type { Satellite } from "../models/satellite";

interface State {
  satelliteData: Satellite[];
  loading: boolean;
  error: string | null;
}

const state: State = {
  satelliteData: [],
  loading: false,
  error: null,
};

const mutations = {
  setLoading(state: State, status: boolean) {
    state.loading = status;
  },
  setSatellitesData(state: State, satellites: Satellite[]) {
    state.satelliteData = satellites;
  },
  setError(state: State, error: string | null) {
    state.error = error;
  },
};

const actions = {
  async fetchSatellites(
    { commit }: ActionContext<State, any>,
    params: { objectTypes?: string[]; attributes?: string[] }
  ) {
    commit("setLoading", true);
    commit("setError", null);

    try {
      const url = buildSatelliteUrl(params);
      const satellites = await fetchSatelliteData(url);
      commit("setSatellitesData", satellites);
    } catch (error: any) {
      const message = extractErrorMessage(error);
      commit("setError", message);
    } finally {
      commit("setLoading", false);
    }
  },
};

const getters = {
  allSatellites(state: State) {
    return state.satelliteData;
  },
  isLoading(state: State) {
    return state.loading;
  },
  error(state: State) {
    return state.error;
  },
};

function buildSatelliteUrl(params: {
  objectTypes?: string[];
  attributes?: string[];
}): string {
  const defaultObjectTypes = ["ROCKET BODY", "DEBRIS", "UNKNOWN", "PAYLOAD"];
  const defaultAttributes = ["noradCatId", "intlDes", "name"];

  const query = new URLSearchParams();
  query.set(
    "objectTypes",
    (params.objectTypes ?? defaultObjectTypes).join(",")
  );
  query.set("attributes", (params.attributes ?? defaultAttributes).join(","));

  return `https://backend.digantara.dev/v1/satellites?${query.toString()}`;
}

async function fetchSatelliteData(url: string) {
  const response = await axios.get(url, {
    headers: { accept: "application/json" },
  });
  if (response.status === 200 && Array.isArray(response.data?.data)) {
    return response.data.data;
  }
  throw new Error("Unexpected response from server");
}

function extractErrorMessage(error: any): string {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch satellite data."
  );
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
