import { useMutation } from "react-query";
import { pb } from '@/utils/pocketbase';

export default function useLogin() {
    async function login({email, password}) {
        try{
            const authData = await pb
                .collection('users')
                .authWithPassword(email, password);
        } catch(e) {
            throw new Error('Authentication failed.');
        }
    }

    return useMutation(login)
}