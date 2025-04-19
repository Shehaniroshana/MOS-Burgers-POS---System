import { Router } from "@angular/router";
import Swal from "sweetalert2";

export function logout(router: Router) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Logged out!',
                'You have been logged out successfully.',
                'success'
            ).then(() => {
                router.navigate(["/"]);
            });
        }
    });
}