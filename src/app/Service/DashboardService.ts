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

const API_BASE_URL = 'http://localhost:8080/mos/dashboard';

// Revenue Functions
export async function getTotalRevenueInCurrentMonth(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/revenue/current-month`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching current month revenue:', error);
        throw error;
    }
}

export async function getRevenueByLast6Month(): Promise<number[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/revenue/last-6-months`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching last 6 months revenue:', error);
        throw error;
    }
}

export async function getTotalRevenueToday(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/revenue/today`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching today revenue:', error);
        throw error;
    }
}

export async function getTotalRevenueYesterday(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/revenue/yesterday`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching yesterday revenue:', error);
        throw error;
    }
}

export async function getTotalRevenue(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/revenue/total`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching total revenue:', error);
        throw error;
    }
}

export async function getRevenuePercentageByTodayVsYesterday(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/revenue/percentage-today-vs-yesterday`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching revenue percentage:', error);
        throw error;
    }
}

// Order Functions
export async function getAllOrderCount(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/count`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching order count:', error);
        throw error;
    }
}

export async function getAllOrderCountByStatus(): Promise<{ [status: string]: number }> {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/count-by-status`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching order count by status:', error);
        throw error;
    }
}

export async function getOrderPercentageByTodayVsYesterday(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/percentage-today-vs-yesterday`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching order percentage:', error);
        throw error;
    }
}

// Item Functions
export async function getItemAllItemCount(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/items/total-count`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching item count:', error);
        throw error;
    }
}

export async function getItemAllItemCountByCategory(): Promise<{ [category: string]: number }> {
    try {
        const response = await fetch(`${API_BASE_URL}/items/count-by-category`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching items by category:', error);
        throw error;
    }
}

// Customer Functions
export async function getAllCustomerCount(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/count`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching customer count:', error);
        throw error;
    }
}

export async function getAllCustomerLoyaltyPoints(): Promise<{ [customerId: string]: number }> {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/loyalty-points`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching loyalty points:', error);
        throw error;
    }
}