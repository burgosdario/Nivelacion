let tasksData = JSON.parse(localStorage.getItem('focusflowTasks')) || {
    todo: [],
    inprogress: [],
    done: []
};

let draggedElement = null;
let sourceColumn = null;

document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
});

function handleDragStart(e) {
    draggedElement = this;
    sourceColumn = this.closest('.kanban-column').dataset.column;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
}

document.querySelectorAll('.tasks-container').forEach(container => {
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragleave', handleDragLeave);
});

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.style.opacity = '0.7';
    return false;
}

function handleDragLeave(e) {
    if (e.target === this) {
        this.style.opacity = '1';
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    this.style.opacity = '1';

    if (draggedElement && draggedElement !== this) {
        const targetColumn = this.closest('.kanban-column').dataset.column;
        const sourceContainer = draggedElement.closest('.tasks-container');
        this.appendChild(draggedElement);
        updateTaskCounters();
    }
}

function updateTaskCounters() {
    document.querySelectorAll('.kanban-column').forEach(column => {
        const taskCount = column.querySelectorAll('.task-card').length;
        column.querySelector('.column-count').textContent = taskCount;
    });
}

function saveTasks() {
    localStorage.setItem('focusflowTasks', JSON.stringify(tasksData));
}

const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.task-card').forEach(card => {
            const title = card.querySelector('.task-title').textContent.toLowerCase();
            const description = card.querySelector('.task-description').textContent.toLowerCase();
            const matches = title.includes(query) || description.includes(query);
            card.style.display = matches ? 'block' : 'none';
        });
    });
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

updateTaskCounters();