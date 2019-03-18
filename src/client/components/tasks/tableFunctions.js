const addTask = '<button id="addTaskID">Add Task</button>';

const selectFilter = '<select id="filterDisplay">' +
    '<option value="week">Week</option>' +
    '<option value="month">Month</option>' +
    '<option value="working">Still Working On</option>' +
    '<option selected="selected" value="all">All</option>' +
    '</select>';

function getHeader() {
    return '<tr>' +
        '<th>Edit</th>' +
        '<th>Short Description</th>' +
        '<th>Long Description</th>' +
        '<th>Last Access Date</th>' +
        '<th>Status</th>' +
        '</tr>';
}

function getTable( rows ) {
    return `<div>${addTask}${selectFilter}<table id="taskList">${getHeader()}${rows}</table></div>`;
}

function getCell( content, className ) {
    return `<td class="${className}">${content}</td>`;
}

function getButtonCell( id, className ) {
    return getCell( `<button class="edit-task" id="task-${id}">Edit (${id})</button>`, className );
}

export {
    getTable,
    getCell,
    getButtonCell
};
