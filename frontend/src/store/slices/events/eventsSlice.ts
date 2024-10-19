import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import Event from "../../../interfaces/event/eventInterface";
import { fetchEventsFromMonth } from "../../asyncThunks";

export interface EventsSliceState {
  events: Array<Event>;
  status: "idle" | "loading" | "failed";
}

const initialState: EventsSliceState = {
  events: [],
  status: "idle",
};


export const eventsSlice = createAppSlice({
  name: "events",
  initialState,
  reducers: (create) => ({
    addEvent: create.reducer((state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsFromMonth.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(
        fetchEventsFromMonth.fulfilled,
        (state, action: PayloadAction<Array<Event>>) => {
          state.events = action.payload;
          state.status = "idle";
        }
      );
  },
  selectors: {
    selectEvents: (event) => event.events,
    selectStatus: (event) => event.status,
  },
});

export const { addEvent } = eventsSlice.actions;

export const { selectEvents, selectStatus } = eventsSlice.selectors;
