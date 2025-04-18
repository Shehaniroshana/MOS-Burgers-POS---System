import Swal from "sweetalert2";
import { Router } from '@angular/router';


export async function createAccount(fullName: string, email: string, role: string, password: string, confirmPassword: string, router: Router) {

        if (fullName != '' && email != '' && role != '' && password != '' && confirmPassword != '') {

            if (password === confirmPassword) {
                console.log(fullName, email, role, password, confirmPassword);


                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                    "userName": fullName,
                    "password": password,
                    "role": role,
                    "email": email
                });

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow" as RequestRedirect
                };

                fetch("http://localhost:8080/mos/user/saveUser", requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        console.log(result);
                        if (result === 'true') {
                            Swal.fire('Success!', 'Registration successful', 'success');
                            router.navigate(['/']);
                        } else {
                            Swal.fire('Error!', 'Try another email this email is already registered', 'error');
                        }
                    })
                    .catch((error) => console.error(error));

            } else {
                Swal.fire('Error!', 'Passwords do not match', 'error');
            }

        } else {
            Swal.fire('Error!', 'Please enter all the fields', 'error');
        }

    
}