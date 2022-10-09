declare type Action<Payload> = { type: string; payload: Payload };

declare interface Actor<InPayload, OutPayload> {
  (arg0: string, arg1: InPayload): Action<OutPayload>;
}
