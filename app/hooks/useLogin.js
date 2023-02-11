import { useMutation, useQueryClient } from "react-query";
import { pb } from '@/utils/pocketbase';

export default function useLogin() {
    const queryClient = useQueryClient();

    const login = async ({email, password}) => {
        try{
            await pb
                .collection('users')
                .authWithPassword(email, password);
        } catch(e) {
            throw new Error('Authentication failed.');
        }
    }

    const onSuccess = () => {
        queryClient.invalidateQueries(['user']);
    }

    return useMutation(login, { onSuccess });
}