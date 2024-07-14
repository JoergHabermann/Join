document.addEventListener('DOMContentLoaded', async function() {
  await init()
  displayCurrentDate();
});
/**
 * Updates the task counts for each status and displays them.
 * @param {Array} tasks - The array of tasks.
 */
function updateTaskCounts(tasks) {
  const counts = { todo: 0, progress: 0, feedback: 0, done: 0 };
  const taskAmount = tasks.length;

  tasks.forEach(task => {
    if (task.category === 'todo') counts.todo++;
    else if (task.category === 'progress') counts.progress++;
    else if (task.category === 'feedback') counts.feedback++;
    else if (task.category === 'done') counts.done++;
  });

  document.getElementById("toDoAmount").textContent = counts.todo;
  document.getElementById("progressAmount").textContent = counts.progress;
  document.getElementById("feedbackAmount").textContent = counts.feedback;
  document.getElementById("doneAmount").textContent = counts.done;
  document.getElementById("taskAmount").textContent = taskAmount;
}

/**
 * Counts the number of urgent tasks and displays them.
 * @param {Array} tasks - The array of tasks.
 */
function countUrgentTasks() {
  let urgentCount = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].priority === "urgent") {
      urgentCount++;
    }
  }
  const urgentAmountElement = document.getElementById("urgentAmount");
  if (urgentAmountElement) {
    urgentAmountElement.textContent = urgentCount;
  }
  return urgentCount;
}

/**
 * Updates the greeting message based on the current time.
 */
function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();

  let greetingText;

  if (hour < 12) {
    greetingText = "Good morning";
  } else if (hour < 18) {
    greetingText = "Good day";
  } else {
    greetingText = "Good evening";
  }

  const greetElement = document.getElementById('greet');
  if (greetElement) { 
    greetElement.textContent = greetingText;
  }
}

updateGreeting();

/**
 * Displays the current date and updates the urgent task count.
 * If there are urgent tasks, it displays the earliest deadline.
 * @returns {Date | undefined} The earliest deadline date if there are urgent tasks, otherwise undefined.
 */
async function displayCurrentDate() {
  const urgentCount = countUrgentTasks(); 
  const deadlineCountElement = document.getElementById("urgentAmount");

  if (deadlineCountElement) {
    deadlineCountElement.textContent = urgentCount;
  }
  if (urgentCount > 0) {
    const earliestDate = tasks
      .filter(task => task.priority === "urgent") 
      .map(task => new Date(task.date)) 
      .reduce((a, b) => (a < b ? a : b));   
    const deadlineElement = document.getElementById("currentDate");
    deadlineElement.textContent = formatDate(earliestDate);
    
    return earliestDate;
  }
}

/**
 * Formats the given date in a human-readable format.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}


