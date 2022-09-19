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
      const res = await axios.patch(`http://127.0.0.1:9000/`, details);
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
          message: `Link updated.`,
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
    axios.get("http://127.0.0.1:9000/").then((res) => {
      updateFlow(res.data.links);
      return res.data;
    })
  );
};

export const useAddLink = (link: string) => {
  const { updateFlow } = useStore();

  return useQuery(
    ["addLinks"],
    () => {
      AppToaster.show({
        message: "Adding link.",
        intent: Intent.NONE,
      });
      return axios
        .post("http://127.0.0.1:9000/link", {
          paths: link.split(",").map((i) => i.trim()),
        })
        .then((res) => res.data);
    },
    {
      enabled: false,
      onSuccess(data) {
        updateFlow(data.links);
        AppToaster.show({
          message: data.msg,
          intent: data.msg.includes("Error") ? Intent.WARNING : Intent.SUCCESS,
        });
      },
      onError(err) {
        AppToaster.show({ message: String(err), intent: Intent.WARNING });
      },
    }
  );
};

export const useRemoveLink = (id: string) => {
  const { updateFlow } = useStore();

  return useQuery(
    ["removeLinks"],
    () => {
      AppToaster.show({
        message: "Adding link.",
        intent: Intent.NONE,
      });
      return axios
        .patch("http://127.0.0.1:9000/link", {
          id,
        })
        .then((res) => res.data);
    },
    {
      enabled: false,
      onSuccess(data) {
        updateFlow(data.links);
        AppToaster.show({
          message: data.msg,
          intent: data.msg.includes("Error") ? Intent.WARNING : Intent.SUCCESS,
        });
      },
      onError(err) {
        AppToaster.show({ message: String(err), intent: Intent.WARNING });
      },
    }
  );
};
