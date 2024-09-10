const students = [];

document.getElementById('addPaymentBtn').addEventListener('click', () => {
    // Open the modal and reset form for new entry
    document.getElementById('paymentModal').style.display = 'flex';
    resetForm();
    document.getElementById('paymentForm').onsubmit = addNewStudent;  // Ensure adding new student
});

function addNewStudent(event) {
    event.preventDefault();

    const student = {
        studentName: document.getElementById('studentName').value,
        studentClass: document.getElementById('studentClass').value,
        paymentType: document.getElementById('paymentType').value,
        paymentAmount: document.getElementById('paymentType').value === 'Full' ? getFullPayment(document.getElementById('studentClass').value) : document.getElementById('paymentAmount').value,
        paymentDate: document.getElementById('paymentDate').value,
        paymentId: generatePaymentID(),
    };

    students.push(student);
    updateStudentList();
    document.getElementById('paymentModal').style.display = 'none';
    resetForm();
}

function getFullPayment(studentClass) {
    switch (studentClass) {
        case 'Primary 1':
            return 20000;
        case 'Primary 2':
            return 23000;
        case 'Primary 3':
            return 25000;
        case 'Primary 4':
            return 27000;
        case 'Primary 5':
            return 30000;
        default:
            return 0;
    }
}

function generatePaymentID() {
    return Math.random().toString(10).substr(2, 9);
}

function resetForm() {
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentAmount').disabled = true;
}

function updateStudentList() {
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${student.studentName}</td>
            <td>${student.studentClass}</td>
            <td class="${student.paymentType === 'Full' ? 'paid' : 'not-paid'}">${student.paymentType}</td>
            <td>₦${student.paymentAmount}</td>
            <td>${student.paymentDate}</td>
            <td>${student.paymentId}</td>
            <td>
                <button onclick="editStudent('${student.paymentId}')">Edit</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    calculateStats();
}



function calculateStats() {
    const totalFees = students.reduce((acc, student) => acc + parseInt(student.paymentAmount), 0);
    const studentsPaid = students.length;
    const totalPending = students.filter(student => student.paymentType !== 'Full').length;

    document.getElementById('totalFees').textContent = `₦${totalFees.toLocaleString()}`;
    document.getElementById('studentsPaid').textContent = studentsPaid;
    document.getElementById('totalPending').textContent = totalPending;
}

// Edit Functionality
function editStudent(paymentId) {
    const student = students.find(student => student.paymentId === paymentId);
    if (student) {
        // Populate modal with existing student details
        document.getElementById('studentName').value = student.studentName;
        document.getElementById('studentClass').value = student.studentClass;
        document.getElementById('paymentType').value = student.paymentType;
        document.getElementById('paymentAmount').value = student.paymentAmount;
        document.getElementById('paymentDate').value = student.paymentDate;

        // Handle payment amount disabling
        if (student.paymentType === 'Full') {
            document.getElementById('paymentAmount').disabled = true;
        } else {
            document.getElementById('paymentAmount').disabled = false;
        }

        // Open modal
        document.getElementById('paymentModal').style.display = 'flex';

        // Modify form submission to update the existing student
        document.getElementById('paymentForm').onsubmit = function(event) {
            event.preventDefault();
            updateStudent(student);
        };
    }
}

function updateStudent(student) {
    student.studentName = document.getElementById('studentName').value;
    student.studentClass = document.getElementById('studentClass').value;
    student.paymentType = document.getElementById('paymentType').value;
    student.paymentAmount = student.paymentType === 'Full' 
        ? getFullPayment(student.studentClass) 
        : document.getElementById('paymentAmount').value;
    student.paymentDate = document.getElementById('paymentDate').value;

    // Refresh the table with updated data
    updateStudentList();
    document.getElementById('paymentModal').style.display = 'none';
    resetForm();
}

// Close Modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target === document.getElementById('paymentModal')) {
        document.getElementById('paymentModal').style.display = 'none';
        resetForm();
    }
});

// Handle Full/Partial Payment Selection
document.getElementById('paymentType').addEventListener('change', function() {
    if (this.value === 'Full') {
        document.getElementById('paymentAmount').disabled = true;
    } else {
        document.getElementById('paymentAmount').disabled = false;
    }
});

// Search Functionality
document.getElementById('searchBar').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.studentName.toLowerCase().includes(searchTerm) || 
        student.paymentId.includes(searchTerm)
    );
    displayFilteredStudents(filteredStudents);
});

// Filter by Class, Type, and Date
function filterPayments(classFilter, typeFilter, dateFilter) {
    let filteredStudents = students;

    if (classFilter) {
        filteredStudents = filteredStudents.filter(student => student.studentClass === classFilter);
    }

    if (typeFilter) {
        filteredStudents = filteredStudents.filter(student => student.paymentType === typeFilter);
    }

    if (dateFilter) {
        filteredStudents = filteredStudents.filter(student => student.paymentDate === dateFilter);
    }

    displayFilteredStudents(filteredStudents);
}

function displayFilteredStudents(filteredStudents) {
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';

    filteredStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.studentName}</td>
            <td>${student.studentClass}</td>
            <td class="${student.paymentType === 'Full' ? 'paid' : 'not-paid'}">${student.paymentType}</td>
            <td>₦${student.paymentAmount}</td>
            <td>${student.paymentDate}</td>
            <td>${student.paymentId}</td>
            <td><button onclick="editStudent('${student.paymentId}')">Edit</button></td>
        `;

        tableBody.appendChild(row);
    });
}

document.getElementById('classFilter').addEventListener('change', function() {
    filterPayments(this.value, document.getElementById('typeFilter').value, document.getElementById('dateFilter').value);
});

document.getElementById('typeFilter').addEventListener('change', function() {
    filterPayments(document.getElementById('classFilter').value, this.value, document.getElementById('dateFilter').value);
});

document.getElementById('dateFilter').addEventListener('change', function() {
    filterPayments(document.getElementById('classFilter').value, document.getElementById('typeFilter').value, this.value);
});


function filterPayments(classFilter, typeFilter, dateFilter) {
    let filteredStudents = students;

    if (classFilter) {
        filteredStudents = filteredStudents.filter(student => student.studentClass === classFilter);
    }

    if (typeFilter) {
        filteredStudents = filteredStudents.filter(student => student.paymentType === typeFilter);
    }

    if (dateFilter) {
        filteredStudents = filteredStudents.filter(student => student.paymentDate === dateFilter);
    }

    return filteredStudents;
}

function displayReport(filteredStudents) {
    const reportTableBody = document.getElementById('reportTableBody');
    const printTableBody = document.getElementById('printTable').querySelector('tbody');
    reportTableBody.innerHTML = '';
    printTableBody.innerHTML = '';

    let totalStudents = 0;
    let grandTotalAmount = 0;

    
    filteredStudents.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${student.studentName}</td>
    <td>${student.studentClass}</td>
    <td>${student.paymentType}</td>
    <td>₦${student.paymentAmount}</td>
    <td>${student.paymentDate}</td>
    <td>${student.paymentId}</td>
    `;
    reportTableBody.appendChild(row);
    
    totalStudents++;
    grandTotalAmount += parseInt(student.paymentAmount);
    });
document.getElementById('totalReportStudents').textContent = totalStudents;
    document.getElementById('grandTotalReport').textContent = grandTotalAmount.toLocaleString();
    document.getElementById('totalPrintStudents').textContent = totalStudents;
    document.getElementById('grandTotalPrint').textContent = grandTotalAmount.toLocaleString();
}

document.getElementById('generateReportBtn').addEventListener('click', function () {
    const classFilter = document.getElementById('reportClassFilter').value;
    const typeFilter = document.getElementById('reportTypeFilter').value;
    const dateFilter = document.getElementById('reportDateFilter').value;

    const filteredStudents = filterPayments(classFilter, typeFilter, dateFilter);
    displayReport(filteredStudents);
});

document.getElementById('printReportBt').addEventListener('click', function () {
    const filteredStudents = filterPayments(
        document.getElementById('reportClassFilter').value,
        document.getElementById('reportTypeFilter').value,
        document.getElementById('reportDateFilter').value
    );

    populatePrintArea(filteredStudents);  // Populate print area with the report data

    // Temporarily show the print area, then print, then hide it again
    document.getElementById('printArea').style.display = 'block';  // Show the print area
    window.print();  // Trigger the print dialog
    document.getElementById('printArea').style.display = 'none';  // Hide the print area after printing
});

function populatePrintArea(filteredStudents) {
    const printTableBody = document.querySelector('#printTable tbody');
    printTableBody.innerHTML = '';  // Clear any previous content

    // Populate the table with filtered student data
    filteredStudents.forEach(student => {
        const row = `<tr>
            <td>${student.studentName}</td>
            <td>${student.studentClass}</td>
            <td>${student.paymentType}</td>
            <td>₦${student.paymentAmount}</td>
            <td>${student.paymentDate}</td>
            <td>${student.paymentId}</td>
        </tr>`;
        printTableBody.innerHTML += row;
    });

    // Update totals in the print area
    document.getElementById('totalPrintStudents').textContent = filteredStudents.length;
    const grandTotal = filteredStudents.reduce((total, student) => total + parseInt(student.paymentAmount), 0);
    document.getElementById('grandTotalPrint').textContent = `₦${grandTotal.toLocaleString()}`;
}