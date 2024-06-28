
        const users = [
            { username: 'fahd', password: '111', role: 'admin' },
            { username: 'solaiman', password: '111', role: 'admin' },
            { username: 'naief', password: '111', role: 'user' },
            { username: 'turky', password: '111', role: 'user' },
            { username: 'ghanem', password: '111', role: 'user' },
        ];

        let currentUser = null;
        let reportIdCounter = 1;
        const reports = [];

        function login(event) {
            event.preventDefault(); // منع السلوك الافتراضي

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                alert('الرجاء إدخال اسم المستخدم وكلمة المرور');
                return;
            }

            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                currentUser = user;
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('navbar').style.display = 'block';
                document.getElementById('icons-container').style.display = 'flex';
                document.getElementById('main-container').style.display = 'block';
                showHomePage();
                updateIconCounts();
            } else {
                alert('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        }

        

        function logout() {
            currentUser = null;
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('login-container').style.display = 'block';
            document.getElementById('navbar').style.display = 'none';
            document.getElementById('icons-container').style.display = 'none';
            document.getElementById('main-container').style.display = 'none';
            document.getElementById('report-details').style.display = 'none';
            
        }

        function showHomePage() {
            document.getElementById('home-page').style.display = 'block';
            document.getElementById('add-report-form').style.display = 'none';
            document.getElementById('report-details').style.display = 'none';
            renderReportsTable();
        }

        function showAddReportForm() {
            document.getElementById('home-page').style.display = 'none';
            document.getElementById('add-report-form').style.display = 'block';
            document.getElementById('report-details').style.display = 'none';
        }

        function clearForm() {
            document.getElementById('facility-name').value = '';
            document.getElementById('report-text').value = '';
        }

        function closeForm() {
            showHomePage();
        }

        function addReport() {
            const facilityName = document.getElementById('facility-name').value;
            const reportText = document.getElementById('report-text').value;

            if (!facilityName || !reportText) {
                alert('يرجى ملء جميع الحقول');
                return;
            }

            const report = {
                id: reportIdCounter++,
                text: reportText,
                dateTime: new Date().toLocaleString(),
                facilityName: facilityName,
                username: currentUser.username,
                status: 'جديد',
                responses: []
            };

            reports.push(report);
            renderReportsTable();
            updateIconCounts();
            clearForm();
            closeForm();
        }

        function renderReportsTable() {
    const tbody = document.querySelector('#reports-table tbody');
    tbody.innerHTML = '';

    reports.forEach((report, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${report.id}</td>
            <td>${report.text}</td>
            <td>${report.dateTime}</td>
            <td>${report.facilityName}</td>
            <td>${report.username}</td>
            <td>${report.status}</td>
            <td>
                ${report.responses.length > 0 ? `<a href="#" onclick="viewResponses(${report.id})">عرض</a>` : '<p style="color: #065a9e;">لم يتم إضافة ردود</p>'}
            </td>
            <td>
                ${report.responses.length === 0 && report.status !== 'مغلق' ? `<button onclick="addResponse(${report.id})" style="background-color: green; color: white; margin: 7px 7px; font-size: 14px; font-weight: bold;">رد</button>` : ''}
                ${currentUser.role === 'admin' && report.status !== 'مغلق' ? `<button onclick="closeReport(${report.id})" style="background-color: red; color: white; margin: 7px 7px; font-size: 14px; font-weight: bold;">اغلاق</button>` : ''}
                ${report.status === 'مغلق' ? `<p style="color: red;">غير متاح</p>` : ''}
            </td>
        `;

        if (index % 2 === 0) {
            tr.style.backgroundColor = '#f2f2f2';
        }

        tbody.appendChild(tr);
    });
}



        function addResponse(reportId) {
            const response = prompt('أدخل الرد:');
            if (response) {
                const report = reports.find(r => r.id === reportId);
                report.responses.push({ username: currentUser.username, text: response, dateTime: new Date().toLocaleString() });
                report.status = 'تحت الإجراء';
                renderReportsTable();
                updateIconCounts();
            }
        }


        function closeReport(reportId) {
    if (confirm("هل تريد اغلاق البلاغ؟")) {
        const report = reports.find(r => r.id === reportId);
        report.status = 'مغلق';
        renderReportsTable();
        updateIconCounts();
    } else {
        // Optional: You can add any code here that you want to run if the user cancels
        console.log("Report closing cancelled.");
    }
}

function deleteReport(reportId) {
    if (confirm("هل تريد حذف البلاغ؟")) {
        const reportIndex = reports.findIndex(r => r.id === reportId);
        if (reportIndex !== -1) {
            reports.splice(reportIndex, 1);
            renderReportsTable();
            updateIconCounts();
        }
    }
}


        function updateIconCounts() {
            const newCount = reports.filter(report => report.status === 'جديد').length;
            const underProcessCount = reports.filter(report => report.status === 'تحت الإجراء').length;
            const closedCount = reports.filter(report => report.status === 'مغلق').length;

            document.getElementById('new-count').textContent = newCount;
            document.getElementById('under-process-count').textContent = underProcessCount;
            document.getElementById('closed-count').textContent = closedCount;
        }

        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('login-container').style.display = 'block';
        });

        function viewResponses(reportId) {
    const report = reports.find(r => r.id === reportId);
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('add-report-form').style.display = 'none';
    document.getElementById('report-details').style.display = 'block';

    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = `
        <h3>( البلاغ الرئيسي )</h3>
        <p><strong>الرقم :</strong> ${report.id}</p>
        <p><strong>الوصف:</strong> ${report.text}</p>
        <p><strong>التاريخ والوقت:</strong> ${report.dateTime}</p>
        <p><strong>اسم المنشأة:</strong> ${report.facilityName}</p>
        <p><strong>اسم المستخدم:</strong> ${report.username}</p>
        <p><strong>حالة البلاغ:</strong> ${report.status}</p>
        ${report.status !== 'مغلق' ? `
        <div style="display: flex; justify-content: center;">
            <button onclick="addResponseToReport(${report.id})" style="padding: 2px 4px; background-color: Green; color: white;">إضافة رد</button>
        </div>` : ''}
    `;

    const responsesContent = document.getElementById('responses-content');
    responsesContent.innerHTML = '<h4>الردود :</h4>';

    report.responses.forEach(response => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p><span style="color: red;"><strong>اسم المستخدم:</strong> ${response.username}</span></p>
            <p><span style="color: green;"><strong>النص:</strong> ${response.text}</span></p>
            <p><span style="color: blue;"><strong>التاريخ والوقت:</strong> ${response.dateTime}</span></p>
        `;
        responsesContent.appendChild(div);
    });
}

function addResponse(reportId) {
    const response = prompt('أدخل الرد:');
    if (response) {
        const report = reports.find(r => r.id === reportId);
        report.responses.push({ username: currentUser.username, text: response, dateTime: new Date().toLocaleString() });
        report.status = 'تحت الإجراء';
        renderReportsTable();
        updateIconCounts();
    }
}

function renderReportsTable() {
    const tbody = document.querySelector('#reports-table tbody');
    tbody.innerHTML = '';

    // فرز البلاغات حسب الحالة
    const sortedReports = [...reports].sort((a, b) => {
        const statusOrder = {
            'جديد': 1,
            'تحت الإجراء': 2,
            'مغلق': 3
        };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    sortedReports.forEach((report, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${report.id}</td>
            <td>${report.text}</td>
            <td>${report.dateTime}</td>
            <td>${report.facilityName}</td>
            <td>${report.username}</td>
            <td>${report.status}</td>
            <td>
                ${report.responses.length > 0 ? `<a href="#" onclick="viewResponses(${report.id})">عرض</a>` : '<p style="color: #065a9e;">لم يتم إضافة ردود</p>'}
            </td>
            <td>
                ${report.responses.length === 0 && report.status !== 'مغلق' ? `<button onclick="addResponse(${report.id})" style="background-color: green; color: white; margin: 7px 7px; font-size: 14px; font-weight: bold;">رد</button>` : ''}
                ${currentUser.role === 'admin' ? 
                    (report.status !== 'مغلق' ? 
                        `<button onclick="closeReport(${report.id})" style="background-color: gray; color: white; margin: 7px 7px; font-size: 14px; font-weight: bold;">اغلاق</button>` : '') +
                        `<button onclick="deleteReport(${report.id})" style="background-color: red; color: white; margin: 7px 7px; font-size: 14px; font-weight: bold;">حذف</button>`
                : ''}
                
            </td>
        `;

        if (index % 2 === 0) {
            tr.style.backgroundColor = '#f2f2f2';
        }

        tbody.appendChild(tr);
    });
}




    function addResponseToReport(reportId) {
    const response = prompt('أدخل الرد:');
    if (response) {
        const report = reports.find(r => r.id === reportId);
        report.responses.push({ username: currentUser.username, text: response, dateTime: new Date().toLocaleString() });
        report.status = 'تحت الإجراء';
        renderReportsTable();
        updateIconCounts();
        viewResponses(reportId); // Refresh the responses view
    }
}

    function closeReportDetails() {
        document.getElementById('report-details').style.display = 'none';
        showHomePage();
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('login-container').style.display = 'block';
    });
    