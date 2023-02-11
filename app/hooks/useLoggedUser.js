import { pb } from '@/utils/pocketbase';
import { useQuery } from 'react-query';

export default function useLoggedUser() {
    const user = useQuery('user', async () => {
        if(pb.authStore.isValid){
            return await pb.authStore.model;
        }
        return Promise.resolve(null);
    });

    return user;
}