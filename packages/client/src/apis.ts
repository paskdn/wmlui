import { Intent } from "@blueprintjs/core";
import {
  useQueryClient,
  useMutation,
  QueryKey,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import useStore from "./store";
import { AppToaster } from "./toaster";
import { Details, GetLinksResponse, Links } from "./types";

export const useUpdateLink = () => {
  const queryClient = useQueryClient();
  const { set } = useStore();

  return useMutation(
    async (details: Details) => {
      set((state) => {
        const edge = state.edges.find((edge) => edge.data.key === details.key)!;
        edge.data.enabled = !edge.data.enabled;
      });
      const res = await axios.patch(`http://127.0.0.1:8080/ping`, details);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.setQueryData<GetLinksResponse>(["getLinks"], (data) => {
          return data;
        });
        AppToaster.show({
          icon: "console",
          intent: Intent.SUCCESS,
          message: `Updated the link.`,
        });
      },
      onError(error, variables, context) {
        set((state) => {
          const edge = state.edges.find(
            (edge) => edge.data.key === variables.key
          )!;
          edge.data.enabled = !edge.data.enabled;
        });
        AppToaster.show({
          icon: "console",
          intent: Intent.WARNING,
          message: `Failed to update the link.`,
        });
      },
    }
  );
};

export const useLinks = () => {
  const queryClient = useQueryClient();
  const { links } = queryClient.getQueryData<GetLinksResponse>(["getLinks"])!;
  console.log("useLinks", links);
  return { links };
};

export const useGetLinks = () => {
  const { updateFlow } = useStore();
  return useQuery(["getLinks"], () =>
    axios.get("http://127.0.0.1:8080/ping").then((res) => {
      updateFlow(res.data.links);
      return res.data;
    })
  );
};
