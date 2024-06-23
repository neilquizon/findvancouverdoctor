import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name: "loader",
    initialState: {
        loading: false,
    },
    reducers: {
        ShowLoader(payload) {
            state.loading = payload
        },

    },

});

export const { ShowLoader } = loaderSlice.actions;