import { createStore } from "vuex";
import satellites from "./satellites";

export const store = createStore({
  modules: {
    satellites,
  },
});
