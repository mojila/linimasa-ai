import React from 'react';
import { Gantt, Task } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import './App.css';

const tasks = [
  {
    start: new Date(2024, 6, 1),
    end: new Date(2024, 6, 10),
    name: 'Objective 1',
    id: 'Task 0',
    type: 'task',
    progress: 45,
    isDisabled: true,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  },
  {
    start: new Date(2024, 6, 5),
    end: new Date(2024, 6, 15),
    name: 'Objective 2',
    id: 'Task 1',
    type: 'task',
    progress: 25,
    dependencies: ['Task 0'],
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  },
  {
    start: new Date(2024, 6, 12),
    end: new Date(2024, 6, 20),
    name: 'Objective 3',
    id: 'Task 2',
    type: 'task',
    progress: 10,
    dependencies: ['Task 1'],
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  },
];

function App() {
  return (
    <div className="App">
      <h1>Project Timeline</h1>
      <Gantt tasks={tasks} />
    </div>
  );
}

export default App;
