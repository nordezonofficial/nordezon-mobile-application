import { getStatusColor } from "@/helpers";

const STATUSES_BASE = [
    {
        key: 'PENDING',
        label: 'Pending',
        icon: 'time-outline',
        description: 'Waiting for confirmation.',
    },
    {
        key: 'PROCESSING',
        label: 'Processing',
        icon: 'settings-outline',
        description: 'The order is being prepared.',
    },
    {
        key: 'SHIPPED',
        label: 'Shipped',
        icon: 'car-outline',
        description: 'Your order is on the way.',
    },
    {
        key: 'DELIVERED',
        label: 'Delivered',
        icon: 'checkmark-done-circle-outline',
        description: 'Order delivered to you.',
    },
];


const CANCELLED_STATUS = {
    key: 'CANCELLED',
    label: 'Cancelled',
    icon: 'close-circle-outline',
    description: 'Order has been cancelled.',
};



const getOrderStatuses = (status: string) => {
    const upperStatus = (status || '').toString().toUpperCase();
    // Only show "Cancelled" if order is actually cancelled
    if (upperStatus === 'CANCELLED') {
        return [CANCELLED_STATUS];
    }
    // Default: show normal statuses, but DO NOT show "Completed"
    return STATUSES_BASE;
};


const statusToObj = (status: any) => {
    const upperStatus = (status || '').toString().toUpperCase();
    // Only show cancelled status if status is actually cancelled, else base
    let relevantStatuses = getOrderStatuses(upperStatus);
    const found = relevantStatuses.find(s => s.key === upperStatus) || relevantStatuses[0];
    return {
        ...found,
        color: getStatusColor(upperStatus)
    }
};

export {
    CANCELLED_STATUS, getOrderStatuses,
    STATUSES_BASE, statusToObj
};
