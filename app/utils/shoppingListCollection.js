import { pb } from '@/utils/pocketbase';

export const fetchList = async() => {
    const data = await pb.collection("shopping_list").getFullList(200, {
        sort: "-created",
    });

    console.log('fetchList', data);

    return data;
}