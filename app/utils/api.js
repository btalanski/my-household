import { pb } from '@/utils/pocketbase';

export const fetchShoppingList = async() => {
    const data = await pb.collection("shopping_list").getFullList(200, {
        sort: "-created",
    });

    return data;
}