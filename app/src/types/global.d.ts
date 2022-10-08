import type { SWRResponse } from "swr";
import type { MaybeData } from "./maybe-data.d";

declare type MaybeResponse<T, E = any> = SWRResponse<T, E> | MaybeData<T, E>;

declare type Action<Payload> = { type: string; payload: Payload };

declare interface Actor<InPayload, OutPayload> {
  (arg0: string, arg1: InPayload): Action<OutPayload>;
}
