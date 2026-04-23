
$(document).ready(function () {
     $("#btn-login").click(function () {
        const emailInput = $("#login-email").val().trim();
        const passInput = $("#login-pass").val().trim();

         if (currentRole === 'admin') {
            if (emailInput === 'admin.com' && passInput === 'admin123') {
                window.location.href = "dashborad.html";
            } else {
                alert("Invalid Admin Credentials!");
            }
        } else {
             const employees = JSON.parse(localStorage.getItem('employees') || '[]');
            const found = employees.find(e => e.email === emailInput && e.password === passInput);

            if (found) {
                localStorage.setItem('currentEmployee', JSON.stringify(found));
                alert("Login Successful! Welcome " + found.name);
                window.location.href = "employee-slip.html";
            } else {
                alert("Invalid Employee Email or Password!");
            }
        }
    });

     $(".dash-tab").click(function () {
        $(".dash-tab").removeClass("active");
        $(this).addClass("active");
        $(".tab-pane").hide().removeClass("active");
        let tabName = $(this).attr("data-tab");
        $("#tab-" + tabName).fadeIn(300).addClass("active");
    });

     $("#btn-add-employee").click(function () {
        const name = $("#ae-name").val().trim();
        const email = $("#ae-email").val().trim();
        const password = $("#ae-password").val().trim();
        const post = $("#ae-post").val();
        const salary = parseFloat($("#ae-salary").val());

         const editIndex = $(this).data("edit-index");

        if (name && email && password && post && salary > 0) {
            const hra = Math.round(salary * 0.03);
            const da = Math.round(salary * 0.03);
            const ta = Math.round(salary * 0.02);
            const pf = Math.round(salary * 0.02);
            const it = Math.round(salary * 0.02);
            const net = salary + hra + da + ta - pf - it;

            let employees = JSON.parse(localStorage.getItem('employees') || '[]');

            const empData = {
                name: name,
                email: email,
                password: password,
                post: post,
                salary: salary,
                net: net
            };

            if (editIndex !== undefined && editIndex !== null && editIndex !== "") {
                 employees[editIndex] = empData;
                $(this).text("Add Employee →").removeData("edit-index");
                alert("Employee updated successfully!");
            } else {
                 employees.push(empData);
                alert("Employee added successfully!");
            }

            localStorage.setItem('employees', JSON.stringify(employees));

             $("#ae-name, #ae-email, #ae-password, #ae-salary").val("");
            $("#ae-post").val("");
            location.reload();
        } else {
            alert("Please fill all details correctly!");
        }
    });

    function updateDashboard() {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const tbody = $("#emp-tbody");
        tbody.empty();

        let totalPay = 0;
        let managerCount = 0;

        employees.forEach((emp, index) => {
            totalPay += emp.net;
            if (emp.post === "Manager") managerCount++;

            let badgeClass = "badge-default";
            if (emp.post === "Manager") badgeClass = "badge-manager";
            else if (emp.post.includes("Developer")) badgeClass = "badge-developer";
            else if (emp.post === "Designer") badgeClass = "badge-designer";

            tbody.append(`
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${emp.name}</strong></td>
                    <td>${emp.email}</td>
                    <td><span class="badge ${badgeClass}">${emp.post}</span></td>
                    <td>₹${emp.salary.toLocaleString()}</td>
                    <td style="color:#2e7d5e;">+₹${Math.round(emp.salary * 0.03)}</td>
                    <td style="color:#2e7d5e;">+₹${Math.round(emp.salary * 0.03)}</td>
                    <td style="color:#2e7d5e;">+₹${Math.round(emp.salary * 0.02)}</td>
                    <td style="color:#c8421a;">-₹${Math.round(emp.salary * 0.02)}</td>
                    <td style="color:#c8421a;">-₹${Math.round(emp.salary * 0.02)}</td>
                    <td><strong>₹${emp.net.toLocaleString()}</strong></td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-sm btn-delete btn-del-emp" data-index="${index}">Delete</button>
                            <button class="btn-sm btn-edit   btn-edt-emp" data-index="${index}">Edit</button>
                        </div>
                    </td>
                </tr>
            `);
        });

        $("#total").text(employees.length);
        $("#manager").text(managerCount);
        $("#pending").text(employees.length - managerCount);
        $("#pay").text("₹" + Math.round(totalPay).toLocaleString('en-IN'));
    }

    $(document).on("click", ".btn-del-emp", function () {
        if (confirm("Are you sure you want to delete this employee?")) {
            const index = $(this).data("index");
            let employees = JSON.parse(localStorage.getItem('employees') || '[]');
            employees.splice(index, 1);
            localStorage.setItem('employees', JSON.stringify(employees));
            updateDashboard();
        }
    });

    $(document).on("click", ".btn-edt-emp", function () {
        const index = $(this).data("index");
        let employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const emp = employees[index];
        $("#ae-name").val(emp.name);
        $("#ae-email").val(emp.email);
        $("#ae-password").val(emp.password);
        $("#ae-post").val(emp.post);
        $("#ae-salary").val(emp.salary);
        $("#btn-add-employee").text("Update Employee").data("edit-index", index);
        $(".dash-tab[data-tab='add-employee']").click();
    });

    if ($("#emp-tbody").length > 0) {
        updateDashboard();
    }
});