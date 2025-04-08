import Swal from "sweetalert2";

interface Order {
    status: string;
    totalAmount: number;
}

export async function loadBestCustomers(): Promise<Order[]> {
    try {
        const response = await fetch('http://localhost:8080/order/getAllOrders');
        const data: Order[] = await response.json();

        const bestCustomerOrders = data
            .filter((order) => order.status !== 'Cancelled')
            .sort((a, b) => b.totalAmount - a.totalAmount);

        console.log(bestCustomerOrders);
        return bestCustomerOrders;
    } catch (error) {
        console.error('Error fetching order details:', error);
        Swal.fire('Error!', 'Failed to load order details. Please try again.', 'error');
        return [];
    }
}