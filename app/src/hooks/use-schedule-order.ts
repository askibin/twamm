import { useProgram } from "./use-program";

export const useScheduleOrder = () => {
  const { program } = useProgram();

  async function execute() {
    console.log(program);

    await program.rpc.placeOrder();
  }

  return { execute };
};
