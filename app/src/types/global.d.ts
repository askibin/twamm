import type { SWRResponse } from "swr";
import type { MaybeData } from "./maybe-data.d";

declare type MaybeResponse<T, E = any> = SWRResponse<T, E> | MaybeData<T, E>;
