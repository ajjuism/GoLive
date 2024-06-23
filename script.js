let tasks = loadFromLocalStorage('tasks') || [];
let resources = loadFromLocalStorage('resources') || [];
let miscData = loadFromLocalStorage('miscData') || [];
let currentFilter = '';
let editingTaskId = null;
let editingResourceId = null;
let editingMiscId = null;

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function addTask() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const deadline = document.getElementById('deadline').value.trim();
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

    if (!title || !description || !deadline) {
        alert('Please fill in all required fields.');
        return;
    }

    const task = {
        id: editingTaskId || Date.now(),
        title,
        description,
        deadline,
        tags: tags.filter(tag => tag),
        status: editingTaskId ? tasks.find(task => task.id === editingTaskId).status : 'Pending Design Assessment'
    };

    if (editingTaskId) {
        tasks = tasks.map(t => t.id === editingTaskId ? task : t);
        editingTaskId = null;
    } else {
        tasks.push(task);
        addMiscFromTask(task);
    }

    saveToLocalStorage('tasks', tasks);
    renderTasks();
    updateDashboard();
    clearInputs();
    closePopup();
}

function addResource() {
    const name = document.getElementById('resource-name').value.trim();
    const url = document.getElementById('resource-url').value.trim();
    const tags = document.getElementById('resource-tags').value.split(',').map(tag => tag.trim());

    if (!name || !url) {
        alert('Please fill in all required fields.');
        return;
    }

    const resource = {
        id: editingResourceId || Date.now(),
        name,
        url,
        tags: tags.filter(tag => tag),
    };

    if (editingResourceId) {
        resources = resources.map(r => r.id === editingResourceId ? resource : r);
        editingResourceId = null;
    } else {
        resources.push(resource);
    }

    saveToLocalStorage('resources', resources);
    renderResources();
    clearResourceInputs();
    closeResourcePopup();
}

function addMisc() {
    const merchantName = document.getElementById('misc-merchant-name').value.trim();
    const accessApple = document.getElementById('misc-access-apple').value;
    const accessFacebook = document.getElementById('misc-access-facebook').value;
    const accessFirebase = document.getElementById('misc-access-firebase').value;
    const accessAndroid = document.getElementById('misc-access-android').value;
    const subscribed = document.getElementById('misc-subscribed').value;
    const receivedAccess = document.getElementById('misc-received-access').value;
    const releaseType = document.getElementById('misc-release-type').value;
    const jksFile = document.getElementById('misc-jks-file').value;
    const firstCutDelivered = document.getElementById('misc-first-cut-delivered').value;
    const accessEmail = document.getElementById('misc-access-email').value;
    const missingData = document.getElementById('misc-missing-data').value;
    const dataAccessScope = document.getElementById('misc-data-access-scope').value;
    const integrationCredentials = document.getElementById('misc-integration-credentials').value;
    const dashboardTraining = document.getElementById('misc-dashboard-training').value;
    const expectedGoLive = document.getElementById('misc-expected-go-live').value;
    const additionalRemarks = document.getElementById('misc-additional-remarks').value.trim();

    if (!merchantName) {
        alert('Please fill in all required fields.');
        return;
    }

    const misc = {
        id: editingMiscId || Date.now(),
        merchantName,
        accessApple,
        accessFacebook,
        accessFirebase,
        accessAndroid,
        subscribed,
        receivedAccess,
        releaseType,
        jksFile,
        firstCutDelivered,
        accessEmail,
        missingData,
        dataAccessScope,
        integrationCredentials,
        dashboardTraining,
        expectedGoLive,
        additionalRemarks
    };

    if (editingMiscId) {
        miscData = miscData.map(m => m.id === editingMiscId ? misc : m);
        editingMiscId = null;
    } else {
        miscData.push(misc);
    }

    saveToLocalStorage('miscData', miscData);
    renderMisc();
    clearMiscInputs();
    closeMiscPopup();
}

function addMiscFromTask(task) {
    const misc = {
        id: Date.now(),
        merchantName: task.title,
        accessApple: "No",
        accessFacebook: "No",
        accessFirebase: "No",
        accessAndroid: "No",
        subscribed: "No",
        receivedAccess: "No",
        releaseType: "New App",
        jksFile: "Pending",
        firstCutDelivered: "No",
        accessEmail: "No",
        missingData: "No",
        dataAccessScope: "Pending",
        integrationCredentials: "No",
        dashboardTraining: "No",
        expectedGoLive: "",
        additionalRemarks: ""
    };
    miscData.push(misc);
    saveToLocalStorage('miscData', miscData);
    renderMisc();
}

function renderTasks(filteredTasks = tasks) {
    const taskListContainer = document.getElementById('task-list-container');
    taskListContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
        document.getElementById('no-tasks').style.display = 'block';
        return;
    }

    document.getElementById('no-tasks').style.display = 'none';

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.classList.add(getStatusClass(task.status));
        taskItem.innerHTML = `
            <div class="task-item-details">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Deadline: ${task.deadline}</p>
                <p>${task.tags.length ? 'Tags: ' + task.tags.map(tag => `<span class="tag" style="background-color: ${getColor(tag)}" onclick="filterTasks('${tag}')">${tag}</span>`).join(', ') : ''}</p>
                <p>Status: ${task.status}</p>
            </div>
            <div class="actions">
                <select onchange="updateTaskStatus(${task.id}, this.value)">
                    <option value="Pending Design Assessment" ${task.status === 'Pending Design Assessment' ? 'selected' : ''}>Pending Design Assessment</option>
                    <option value="Pending Development" ${task.status === 'Pending Development' ? 'selected' : ''}>Pending Development</option>
                    <option value="Pending First Cut" ${task.status === 'Pending First Cut' ? 'selected' : ''}>Pending First Cut</option>
                    <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="First Cut Delivered" ${task.status === 'First Cut Delivered' ? 'selected' : ''}>First Cut Delivered</option>
                    <option value="Awaiting Brand Feedback" ${task.status === 'Awaiting Brand Feedback' ? 'selected' : ''}>Awaiting Brand Feedback</option>
                    <option value="Pending Subscription" ${task.status === 'Pending Subscription' ? 'selected' : ''}>Pending Subscription</option>
                    <option value="Subscribed" ${task.status === 'Subscribed' ? 'selected' : ''}>Subscribed</option>
                </select>
                <button class="icon-button" onclick="editTask(${task.id})">✎</button>
                <button class="icon-button" onclick="confirmDeleteTask(${task.id})">🗑</button>
            </div>
        `;
        taskListContainer.appendChild(taskItem);
    });
}

function renderResources(filteredResources = resources) {
    const resourceListContainer = document.getElementById('resource-list-container');
    resourceListContainer.innerHTML = '';

    if (filteredResources.length === 0) {
        document.getElementById('no-resources').style.display = 'block';
        return;
    }

    document.getElementById('no-resources').style.display = 'none';

    filteredResources.forEach(resource => {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        resourceItem.onclick = () => window.open(resource.url, '_blank');
        resourceItem.innerHTML = `
            <div class="resource-item-details">
                <h3>${resource.name}</h3>
                <p>${resource.tags.length ? 'Tags: ' + resource.tags.map(tag => `<span class="tag" style="background-color: ${getColor(tag)}" onclick="filterResources('${tag}')">${tag}</span>`).join(', ') : ''}</p>
            </div>
            <div class="actions">
                <button class="icon-button" onclick="editResource(${resource.id}, event)">✎</button>
                <button class="icon-button" onclick="confirmDeleteResource(${resource.id}, event)">🗑</button>
                <button class="icon-button" onclick="copyUrl('${resource.url}', event)">📋</button>
            </div>
        `;
        resourceListContainer.appendChild(resourceItem);
    });
}

function renderMisc(filteredMisc = miscData) {
    const miscListContainer = document.getElementById('misc-list-container');
    miscListContainer.innerHTML = '';

    if (filteredMisc.length === 0) {
        document.getElementById('no-misc').style.display = 'block';
        return;
    }

    document.getElementById('no-misc').style.display = 'none';

    filteredMisc.forEach(misc => {
        const miscItem = document.createElement('div');
        miscItem.className = 'misc-item';
        miscItem.innerHTML = `
            <div class="misc-item-details" onclick="showMiscDetail(${misc.id})">
                <h3>${misc.merchantName}</h3>
            </div>
            <div class="actions">
                <button class="icon-button" onclick="editMisc(${misc.id}, event)">✎</button>
                <button class="icon-button" onclick="confirmDeleteMisc(${misc.id}, event)">🗑</button>
            </div>
        `;
        miscListContainer.appendChild(miscItem);
    });
}

function showMiscDetail(id) {
    const misc = miscData.find(m => m.id === id);
    const detailTable = document.getElementById('misc-detail-table');
    detailTable.innerHTML = `
        <tr><td>Merchant Name</td><td>${misc.merchantName}</td></tr>
        <tr><td>Apple Developer Account</td><td>${misc.accessApple}</td></tr>
        <tr><td>Facebook Developer Account</td><td>${misc.accessFacebook}</td></tr>
        <tr><td>Firebase</td><td>${misc.accessFirebase}</td></tr>
        <tr><td>Android Developer Account</td><td>${misc.accessAndroid}</td></tr>
        <tr><td>Subscribed</td><td>${misc.subscribed}</td></tr>
        <tr><td>Received Access</td><td>${misc.receivedAccess}</td></tr>
        <tr><td>Release Type</td><td>${misc.releaseType}</td></tr>
        <tr><td>JKS File</td><td>${misc.jksFile}</td></tr>
        <tr><td>First Cut Delivered</td><td>${misc.firstCutDelivered}</td></tr>
        <tr><td>Access Email</td><td>${misc.accessEmail}</td></tr>
        <tr><td>Missing Data</td><td>${misc.missingData}</td></tr>
        <tr><td>Data Access Scope</td><td>${misc.dataAccessScope}</td></tr>
        <tr><td>Integration Credentials</td><td>${misc.integrationCredentials}</td></tr>
        <tr><td>Dashboard Training</td><td>${misc.dashboardTraining}</td></tr>
        <tr><td>Expected Go Live</td><td>${misc.expectedGoLive}</td></tr>
        <tr><td>Additional Remarks</td><td>${misc.additionalRemarks}</td></tr>
    `;
    document.getElementById('misc-detail-popup').style.display = 'block';
}

function updateTaskStatus(id, status) {
    tasks = tasks.map(task => task.id === id ? { ...task, status } : task);
    saveToLocalStorage('tasks', tasks);
    renderTasks();
    updateDashboard();
}

function confirmDeleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(id);
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage('tasks', tasks);
    renderTasks();
    updateDashboard();
}

function confirmDeleteResource(id, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this resource?')) {
        deleteResource(id, event);
    }
}

function deleteResource(id, event) {
    event.stopPropagation();
    resources = resources.filter(resource => resource.id !== id);
    saveToLocalStorage('resources', resources);
    renderResources();
}

function confirmDeleteMisc(id, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this information?')) {
        deleteMisc(id, event);
    }
}

function deleteMisc(id, event) {
    event.stopPropagation();
    miscData = miscData.filter(misc => misc.id !== id);
    saveToLocalStorage('miscData', miscData);
    renderMisc();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('deadline').value = task.deadline;
    document.getElementById('tags').value = task.tags.join(', ');
    editingTaskId = id;
    openPopup();
}

function editResource(id, event) {
    event.stopPropagation();
    const resource = resources.find(resource => resource.id === id);
    document.getElementById('resource-name').value = resource.name;
    document.getElementById('resource-url').value = resource.url;
    document.getElementById('resource-tags').value = resource.tags.join(', ');
    editingResourceId = id;
    openResourcePopup();
}

function editMisc(id, event) {
    event.stopPropagation();
    const misc = miscData.find(m => m.id === id);
    document.getElementById('misc-merchant-name').value = misc.merchantName;
    document.getElementById('misc-access-apple').value = misc.accessApple;
    document.getElementById('misc-access-facebook').value = misc.accessFacebook;
    document.getElementById('misc-access-firebase').value = misc.accessFirebase;
    document.getElementById('misc-access-android').value = misc.accessAndroid;
    document.getElementById('misc-subscribed').value = misc.subscribed;
    document.getElementById('misc-received-access').value = misc.receivedAccess;
    document.getElementById('misc-release-type').value = misc.releaseType;
    document.getElementById('misc-jks-file').value = misc.jksFile;
    document.getElementById('misc-first-cut-delivered').value = misc.firstCutDelivered;
    document.getElementById('misc-access-email').value = misc.accessEmail;
    document.getElementById('misc-missing-data').value = misc.missingData;
    document.getElementById('misc-data-access-scope').value = misc.dataAccessScope;
    document.getElementById('misc-integration-credentials').value = misc.integrationCredentials;
    document.getElementById('misc-dashboard-training').value = misc.dashboardTraining;
    document.getElementById('misc-expected-go-live').value = misc.expectedGoLive;
    document.getElementById('misc-additional-remarks').value = misc.additionalRemarks;
    editingMiscId = id;
    openMiscPopup();
}

function filterTasks(tag) {
    currentFilter = tag;
    const filteredTasks = tasks.filter(task => task.tags.includes(tag));
    renderTasks(filteredTasks);
}

function filterResources(tag) {
    currentFilter = tag;
    const filteredResources = resources.filter(resource => resource.tags.includes(tag));
    renderResources(filteredResources);
}

function filterStatus(status) {
    const filteredTasks = tasks.filter(task => task.status === status);
    renderTasks(filteredTasks);
}

function clearFilter() {
    currentFilter = '';
    renderTasks();
    renderResources();
    renderMisc();
}

function searchResources() {
    const searchTerm = document.getElementById('search-resources').value.toLowerCase();
    const filteredResources = resources.filter(resource => 
        resource.name.toLowerCase().includes(searchTerm) || 
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    renderResources(filteredResources);
}

function searchMisc() {
    const searchTerm = document.getElementById('search-misc').value.toLowerCase();
    const filteredMisc = miscData.filter(misc =>
        misc.merchantName.toLowerCase().includes(searchTerm)
    );
    renderMisc(filteredMisc);
}

function updateDashboard() {
    const statusCounts = {
        'Pending Design Assessment': 0,
        'Pending Development': 0,
        'Pending First Cut': 0,
        'In Progress': 0,
        'First Cut Delivered': 0,
        'Awaiting Brand Feedback': 0,
        'Pending Subscription': 0,
        'Subscribed': 0
    };

    tasks.forEach(task => {
        statusCounts[task.status]++;
    });

    document.getElementById('pending-design-count').innerText = statusCounts['Pending Design Assessment'];
    document.getElementById('pending-dev-count').innerText = statusCounts['Pending Development'];
    document.getElementById('pending-first-cut-count').innerText = statusCounts['Pending First Cut'];
    document.getElementById('in-progress-count').innerText = statusCounts['In Progress'];
    document.getElementById('first-cut-count').innerText = statusCounts['First Cut Delivered'];
    document.getElementById('awaiting-feedback-count').innerText = statusCounts['Awaiting Brand Feedback'];
    document.getElementById('pending-subscription-count').innerText = statusCounts['Pending Subscription'];
    document.getElementById('subscribed-count').innerText = statusCounts['Subscribed'];

    const tagSummary = {};
    tasks.forEach(task => {
        task.tags.forEach(tag => {
            tagSummary[tag] = (tagSummary[tag] || 0) + 1;
        });
    });

    const tagsSummaryContainer = document.getElementById('tags-summary');
    tagsSummaryContainer.innerHTML = '';
    for (const tag in tagSummary) {
        const tagItem = document.createElement('span');
        tagItem.className = 'tag';
        tagItem.innerText = `${tag}: ${tagSummary[tag]}`;
        tagItem.style.backgroundColor = getColor(tag);
        tagItem.onclick = () => filterTasks(tag);
        tagsSummaryContainer.appendChild(tagItem);
    }
}

function updateAnalytics() {
    const totalTasks = tasks.length;
    const subscribedTasks = tasks.filter(task => task.status === 'Subscribed').length;
    const totalResources = resources.length;
    const totalMisc = miscData.length;

    document.getElementById('total-tasks').innerText = `Total Tasks: ${totalTasks}`;
    document.getElementById('total-subscribed-tasks').innerText = `Subscribed Tasks: ${subscribedTasks}`;
    document.getElementById('total-resources').innerText = `Total Resources: ${totalResources}`;
    document.getElementById('total-misc').innerText = `Total Miscellaneous Info: ${totalMisc}`;
}

function clearInputs() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('tags').value = '';
}

function clearResourceInputs() {
    document.getElementById('resource-name').value = '';
    document.getElementById('resource-url').value = '';
    document.getElementById('resource-tags').value = '';
}

function clearMiscInputs() {
    document.getElementById('misc-merchant-name').value = '';
    document.getElementById('misc-access-apple').value = 'No';
    document.getElementById('misc-access-facebook').value = 'No';
    document.getElementById('misc-access-firebase').value = 'No';
    document.getElementById('misc-access-android').value = 'No';
    document.getElementById('misc-subscribed').value = 'No';
    document.getElementById('misc-received-access').value = 'No';
    document.getElementById('misc-release-type').value = 'New App';
    document.getElementById('misc-jks-file').value = 'Pending';
    document.getElementById('misc-first-cut-delivered').value = 'No';
    document.getElementById('misc-access-email').value = 'No';
    document.getElementById('misc-missing-data').value = 'No';
    document.getElementById('misc-data-access-scope').value = 'Pending';
    document.getElementById('misc-integration-credentials').value = 'No';
    document.getElementById('misc-dashboard-training').value = 'No';
    document.getElementById('misc-expected-go-live').value = '';
    document.getElementById('misc-additional-remarks').value = '';
}

function exportToCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Title,Description,Deadline,Tags,Status\n';

    tasks.forEach(task => {
        csvContent += `${task.title},${task.description},${task.deadline},"${task.tags.join(', ')}",${task.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importCSV() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const csv = event.target.result;
            const rows = csv.split('\n').slice(1);
            tasks = rows.map(row => {
                const cols = row.split(',');
                return {
                    id: Date.now(),
                    title: cols[0],
                    description: cols[1],
                    deadline: cols[2],
                    tags: cols[3] ? cols[3].split(';') : [],
                    status: cols[4]
                };
            });
            saveToLocalStorage('tasks', tasks);
            renderTasks();
            updateDashboard();
            updateAnalytics();
        };
        reader.readAsText(file);
    }
}

function exportResourcesToCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Name,URL,Tags\n';

    resources.forEach(resource => {
        csvContent += `${resource.name},${resource.url},"${resource.tags.join(', ')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'resources.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importResourcesCSV() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const csv = event.target.result;
            const rows = csv.split('\n').slice(1);
            resources = rows.map(row => {
                const cols = row.split(',');
                return {
                    id: Date.now(),
                    name: cols[0],
                    url: cols[1],
                    tags: cols[2] ? cols[2].split(';') : []
                };
            });
            saveToLocalStorage('resources', resources);
            renderResources();
            updateAnalytics();
        };
        reader.readAsText(file);
    }
}

function exportMiscToCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Merchant Name,Apple Developer Account,Facebook Developer Account,Firebase,Android Developer Account,Subscribed,Received Access,Release Type,JKS File,First Cut Delivered,Access Email,Missing Data,Data Access Scope,Integration Credentials,Dashboard Training,Expected Go Live,Additional Remarks\n';

    miscData.forEach(misc => {
        csvContent += `${misc.merchantName},${misc.accessApple},${misc.accessFacebook},${misc.accessFirebase},${misc.accessAndroid},${misc.subscribed},${misc.receivedAccess},${misc.releaseType},${misc.jksFile},${misc.firstCutDelivered},${misc.accessEmail},${misc.missingData},${misc.dataAccessScope},${misc.integrationCredentials},${misc.dashboardTraining},${misc.expectedGoLive},${misc.additionalRemarks}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'misc.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importMiscCSV() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const csv = event.target.result;
            const rows = csv.split('\n').slice(1);
            miscData = rows.map(row => {
                const cols = row.split(',');
                return {
                    id: Date.now(),
                    merchantName: cols[0],
                    accessApple: cols[1],
                    accessFacebook: cols[2],
                    accessFirebase: cols[3],
                    accessAndroid: cols[4],
                    subscribed: cols[5],
                    receivedAccess: cols[6],
                    releaseType: cols[7],
                    jksFile: cols[8],
                    firstCutDelivered: cols[9],
                    accessEmail: cols[10],
                    missingData: cols[11],
                    dataAccessScope: cols[12],
                    integrationCredentials: cols[13],
                    dashboardTraining: cols[14],
                    expectedGoLive: cols[15],
                    additionalRemarks: cols[16]
                };
            });
            saveToLocalStorage('miscData', miscData);
            renderMisc();
            updateAnalytics();
        };
        reader.readAsText(file);
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'Awaiting Brand Feedback':
        case 'Pending Subscription':
            return 'task-status-orange';
        case 'Pending First Cut':
        case 'In Progress':
        case 'Pending Development':
            return 'task-status-blue';
        case 'Subscribed':
            return 'task-status-green';
        default:
            return 'task-status-blue';
    }
}

function getColor(tag) {
    const colors = [
        '#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb',
        '#64b5f6', '#4fc3f7', '#4db6ac', '#81c784', '#aed581'
    ];
    const index = [...new Set(tasks.flatMap(task => task.tags))].indexOf(tag);
    return colors[index % colors.length];
}

function openPopup() {
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    editingTaskId = null;
    clearInputs();
    document.getElementById('popup').style.display = 'none';
}

function openResourcePopup() {
    document.getElementById('resource-popup').style.display = 'block';
}

function closeResourcePopup() {
    editingResourceId = null;
    clearResourceInputs();
    document.getElementById('resource-popup').style.display = 'none';
}

function openMiscPopup() {
    document.getElementById('misc-popup').style.display = 'block';
}

function closeMiscPopup() {
    editingMiscId = null;
    clearMiscInputs();
    document.getElementById('misc-popup').style.display = 'none';
}

function closeMiscDetailPopup() {
    document.getElementById('misc-detail-popup').style.display = 'none';
}

function showTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (const tab of tabs) {
        tab.style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'flex';
    const navItems = document.getElementsByClassName('nav-item');
    for (const navItem of navItems) {
        navItem.classList.remove('active');
    }
    document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');

    if (tabId === 'analytics') {
        updateAnalytics();
    }
}

function copyUrl(url, event) {
    event.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard');
    }, (err) => {
        alert('Failed to copy URL');
    });
}

// Initial render
renderTasks();
renderResources();
renderMisc();
updateDashboard();
