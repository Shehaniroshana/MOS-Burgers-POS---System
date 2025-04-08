import Swal from "sweetalert2";

export async function getBestSellingItems(orders: any[]): Promise<{ 
    itemId: number, 
    itemName: string, 
    itemImage: string, 
    totalQuantity: number 
}[]> {
    const itemMap = new Map<number, {
        itemId: number,
        itemName: string,
        itemImage: string,
        totalQuantity: number
    }>();

    orders.forEach(order => {
        order.itemDetails.forEach((item: any) => {
            const existing = itemMap.get(item.itemId);
            if (existing) {
                existing.totalQuantity += item.quantity;
            } else {
                itemMap.set(item.itemId, {
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemImage: item.itemImage,
                    totalQuantity: item.quantity
                });
            }
        });
    });

    // Sort and return
    return Array.from(itemMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);
}

export async function loadOrderDetails(status: string): Promise<any[]> {
    let details: any[] = [];

    let categoryUrl = status === 'All' ? 'http://localhost:8080/order/getAllOrders' : `http://localhost:8080/order/searchOrderStatus/${status}`;

    try {
        const response = await fetch(categoryUrl);
        details = await response.json();
        console.log(details);
    } catch (error) {
        console.error('Error fetching order details:', error);
        Swal.fire('Error!', 'Failed to load order details. Please try again.', 'error');
    }

    return details;
}
