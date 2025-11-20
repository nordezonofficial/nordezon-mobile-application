const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};
const isVideoFile = (url: string): boolean => {
    return /\.(mp4|mov|avi|mkv|webm)$/i.test(url);
};





const capitalizeFirstLetter = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};



const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING':
            return '#FFB74D';
        case 'SHIPPED':
            return '#42A5F5';
        case 'DELIVERED':
            return '#66BB6A';
        case 'CANCELLED':
            return '#EF5350';
        case "PROCESSING":
            return '#ffa500';
        default:
            return '#999';
    }
};

// For date formatting
const formatDateAndTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    // Format: DD MMM YYYY, hh:mm am/pm
    return (
        date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }) +
        ', ' +
        date
            .toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
            .toLowerCase()
    );
};

function isOptionAvailable(
    key: 'size' | 'color',
    selectedEntity: any
) {
    if (key === 'size')
        return Array.isArray(selectedEntity?.item?.size) && selectedEntity.item.size.length > 0;

    if (key === 'color')
        return Array.isArray(selectedEntity?.item?.color) &&
               selectedEntity.item.color.length > 0;

    return false;
}

function isAllOptionsSelected(
    selectedSize: any,
    color: any,
    quantity: number,
    selectedEntity: any
) {
    return (
        (!isOptionAvailable('size', selectedEntity) || !!selectedSize) &&
        (!isOptionAvailable('color', selectedEntity) || color?.length === 1) &&
        quantity > 0
    );
}


export {
    capitalizeFirstLetter, formatDate, formatDateAndTime, getStatusColor, isAllOptionsSelected, isOptionAvailable, isVideoFile
};



