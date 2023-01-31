import { pb } from '@/utils/pocketbase';

export const fetchList = async() => {
    return await pb.records.getFullList("family_shopping_list", 200, {
        sort: "-created",
    });
}