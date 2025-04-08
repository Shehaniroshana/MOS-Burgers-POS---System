import Swal from "sweetalert2";

export async function addCustomerService(name: string, contact: string, points: string): Promise<void> {
    try {
        // Validate input fields
        if (!name || !contact || !points) {
            Swal.fire("Error!", "Please fill in all fields!", "error");
            return;
        }

        const contactNo = Number.parseInt(contact);
        const loyaltyPoints = Number.parseFloat(points);

        // Validate contact number and loyalty points
        if (contact.length !== 10 || isNaN(contactNo) || loyaltyPoints < 0) {
            Swal.fire("Error!", "Please enter valid details!", "error");
            return;
        }

        // Prepare request payload
        const payload = {
            name,
            contact: String(contactNo),
            loyaltyPoints,
        };

        // Make API request
        const response = await fetch('http://localhost:8080/mos/customer/saveCustomer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        // Handle API response
        if (data) {
            Swal.fire("Success!", "Customer added successfully!", "success");
        } else {
            Swal.fire("Error!", "Something went wrong", "error");
        }
    } catch (error) {
        // Handle unexpected errors
        Swal.fire("Error!", "An unexpected error occurred!", "error");
        console.error("Error adding customer:", error);
    }
}
