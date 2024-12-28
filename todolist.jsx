 
import React, { useState, useEffect } from "react";

function ButtonClickEvents() {
  const [tasks, setTasks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [currentTask, setCurrentTask] = useState(null); // State to manage the current task when audio plays
  const [showDialog, setShowDialog] = useState(false); // State to control the dialog visibility
  const [activeTaskIndex, setActiveTaskIndex] = useState(null); // State to track the index of the active task
  const [editingTaskIndex, setEditingTaskIndex] = useState(null); // State to track the task being edited
  const [taskInput, setTaskInput] = useState(""); // Input state for editing task
  const [timeInput, setTimeInput] = useState(""); // Input state for editing task time

  const taskEntering = (taskInput, timeInput) => {
    if (taskInput.trim() !== "" && timeInput) {
      const task = { text: taskInput, time: timeInput };
      setTasks((prevTasks) => [...prevTasks, task]);

      // Calculate the time difference and set a reminder
      const timeDifference = new Date(timeInput).getTime() - new Date().getTime();
      if (timeDifference > 0) {
        setTimeout(() => {
          playAudioReminder(task.text, tasks.length);
        }, timeDifference);
      }
    }
  };

  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));

    // Stop audio if playing
    if (audio) {
      audio.pause();
      setAudio(null);
      setShowDialog(false); // Hide dialog when task is deleted
      setActiveTaskIndex(null); // Reset the active task index when deleted
    }
  };

  const moveTask = (index, direction) => {
    const newTasks = [...tasks];
    const task = newTasks[index];
    // Remove task from the original position
    newTasks.splice(index, 1);
    
    // Insert the task at the new position (up or down)
    if (direction === 'up' && index > 0) {
      newTasks.splice(index - 1, 0, task);
    } else if (direction === 'down' && index < tasks.length - 1) {
      newTasks.splice(index + 1, 0, task);
    }
    setTasks(newTasks);
  };

  const playAudioReminder = (taskName, index) => {
    const newAudio = new Audio("/audio.mp3"); // Ensure you have an audio file in your public folder
    setAudio(newAudio); // Set the new audio to play
    setCurrentTask(taskName); // Set the current task to display the dialog
    setActiveTaskIndex(index); // Set the active task index for highlighting

    newAudio.play();
  };

  // Effect to handle audio playback and dialog visibility
  useEffect(() => {
    if (audio) {
      const handleAudioEnd = () => {
        setShowDialog(false); // Hide the dialog when audio ends
        setAudio(null); // Clear the audio state
        setActiveTaskIndex(null); // Reset active task index when audio ends
      };

      audio.onended = handleAudioEnd;
      setShowDialog(true); // Show the dialog when audio starts playing
    }
  }, [audio]);

  const handleAddTask = () => {
    taskEntering(taskInput, timeInput);
    setTaskInput(""); // Clear task input
    setTimeInput(""); // Clear time input
  };

  const handleEditTask = (index) => {
    setEditingTaskIndex(index);
    setTaskInput(tasks[index].text);
    setTimeInput(tasks[index].time);
  };

  const saveEditedTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingTaskIndex] = { text: taskInput, time: timeInput };
    setTasks(updatedTasks);
    setEditingTaskIndex(null);
    setTaskInput(""); // Clear task input
    setTimeInput(""); // Clear time input
  };

  return (
    <div className="container">
      <h1 className="title">Task Manager with Timer</h1>
      <div className="input-container">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter your task"
          className="task-input"
        />
        <input
          type="datetime-local"
          placeholder="enter time and date"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className="time-input"
        />
        <button
          className="add-btn"
          onClick={editingTaskIndex === null ? handleAddTask : saveEditedTask}
        >
          {editingTaskIndex === null ? "Add Task" : "Save Changes"}
        </button>
      </div>
      <p className="tasks-title">Tasks to be completed:</p>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`task-item ${activeTaskIndex === index ? "active-task" : ""}`}
          >
            <div>
              <span className="task-text">{task.text}</span>
              <span className="task-time">
                {" "} - {new Date(task.time).toLocaleString()}
              </span>
            </div>
            <div className="task-buttons">
              <button
                className="btn move-btn"
                onClick={() => moveTask(index, "up")}
                disabled={index === 0} // Disable "Move Up" if it's the first task
              >
                Move Up
              </button>
              <button
                className="btn move-btn"
                onClick={() => moveTask(index, "down")}
                disabled={index === tasks.length - 1} // Disable "Move Down" if it's the last task
              >
                Move Down
              </button>
              <button className="btn edit-btn" onClick={() => handleEditTask(index)}>
                Edit
              </button>
              <button className="btn delete-btn" onClick={() => deleteTask(index)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Dialog Box for Current Task */}
      {showDialog && currentTask && (
        <div className="dialog">
          <div className="dialog-content">
            <h2 className="dialog-title">{currentTask}</h2>
            <button
              className="btn close-dialog"
              onClick={() => setShowDialog(false)}
            >
              Task Finished
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ButtonClickEvents;

