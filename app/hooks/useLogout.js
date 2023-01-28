import { useMutation } from "react-query";
import { pb } from '@/utils/pocketbase';

export default function useLogout() {
    async function useLogout() {
        await pb.authStore.clear();
    }

    return useMutation(useLogout)
}