"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus, Users, Filter, Download } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"

interface Task {
  id: string
  name: string
  startDate: Date
  endDate: Date
  progress: number
  assignee: string
  priority: "Low" | "Medium" | "High"
  status: "Not Started" | "In Progress" | "Completed"
}

export default function ProjectTimeline() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Project Planning",
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 0, 7),
      progress: 100,
      assignee: "John Doe",
      priority: "High",
      status: "Completed",
    },
    {
      id: "2",
      name: "Design Phase",
      startDate: new Date(2024, 0, 8),
      endDate: new Date(2024, 0, 21),
      progress: 75,
      assignee: "Jane Smith",
      priority: "High",
      status: "In Progress",
    },
    {
      id: "3",
      name: "Development",
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 1, 15),
      progress: 30,
      assignee: "Mike Johnson",
      priority: "Medium",
      status: "In Progress",
    },
    {
      id: "4",
      name: "Testing",
      startDate: new Date(2024, 1, 10),
      endDate: new Date(2024, 1, 25),
      progress: 0,
      assignee: "Sarah Wilson",
      priority: "Medium",
      status: "Not Started",
    },
    {
      id: "5",
      name: "Deployment",
      startDate: new Date(2024, 1, 20),
      endDate: new Date(2024, 1, 28),
      progress: 0,
      assignee: "Tom Brown",
      priority: "High",
      status: "Not Started",
    },
  ])

  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1))
  const [viewMode, setViewMode] = useState<"days" | "weeks" | "months">("days")

  // Generate date range for timeline
  const generateDateRange = () => {
    const dates = []
    const start = new Date(currentDate)
    const daysToShow = viewMode === "days" ? 30 : viewMode === "weeks" ? 84 : 365

    for (let i = 0; i < daysToShow; i += viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const dateRange = generateDateRange()

  // Calculate position and width for Gantt bars
  const getTaskBarStyle = (task: Task) => {
    const startDate = new Date(currentDate)
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)

    const daysDiff = Math.floor((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const duration = Math.floor((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24))

    const cellWidth = viewMode === "days" ? 40 : viewMode === "weeks" ? 80 : 128
    const left = Math.max(0, daysDiff * (cellWidth / (viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30)))
    const width = duration * (cellWidth / (viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30))

    return {
      left: `${left}px`,
      width: `${Math.max(width, 20)}px`,
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-50"
      case "In Progress":
        return "text-purple-600 bg-purple-50"
      case "Not Started":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <ScrollArea className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Timeline</h1>
            <p className="text-gray-600 mt-1">Linimasa Project</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" disabled>
              <Filter className="w-4 h-4 mr-2" />
              Filter 🚧
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Download className="w-4 h-4 mr-2" />
              Export 🚧
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Users className="w-4 h-4 mr-2" />
              Team 🚧
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-name">Task Name</Label>
                    <Input id="task-name" placeholder="Enter task name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">Assignee</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john">John Doe</SelectItem>
                          <SelectItem value="jane">Jane Smith</SelectItem>
                          <SelectItem value="mike">Mike Johnson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full text-white">Add Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setMonth(newDate.getMonth() - 1)
                  setCurrentDate(newDate)
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center text-primary">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setMonth(newDate.getMonth() + 1)
                  setCurrentDate(newDate)
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: "days" | "weeks" | "months") => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks" disabled>Weeks 🚧</SelectItem>
                <SelectItem value="months" disabled>Months 🚧</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="flex">
        {/* Task List */}
        <div className="w-80 bg-white border-r border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-900">Tasks</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div key={task.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{task.name}</h4>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>{task.assignee}</span>
                  <Badge variant="secondary" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {task.startDate.toLocaleDateString()} - {task.endDate.toLocaleDateString()}
                  </span>
                  <span>{task.progress}%</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-max">
            {/* Timeline Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="flex">
                {dateRange.map((date, index) => (
                  <div
                    key={index}
                    className={`text-center text-xs font-medium text-gray-600 border-r border-gray-200 last:border-r-0 ${viewMode === "days" ? "w-10" : viewMode === "weeks" ? "w-20" : "w-32 px-4"
                      }`}
                  >
                    {viewMode === "days"
                      ? date.getDate()
                      : viewMode === "weeks"
                        ? `W${Math.ceil(date.getDate() / 7)}`
                        : date.toLocaleDateString("en-US", { month: "short" })}
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt Bars */}
            <div className="relative">
              {tasks.map((task, taskIndex) => (
                <div key={task.id} className="relative h-16 border-b border-gray-100 hover:bg-gray-50">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {dateRange.map((_, index) => (
                      <div
                        key={index}
                        className={`border-r border-gray-100 ${viewMode === "days" ? "w-10" : viewMode === "weeks" ? "w-20" : "w-32"
                          }`}
                      />
                    ))}
                  </div>

                  {/* Task bar */}
                  <div
                    className="absolute top-4 h-8 bg-purple-600 rounded-md shadow-sm flex items-center px-2 cursor-pointer hover:bg-purple-700 transition-colors"
                    style={getTaskBarStyle(task)}
                  >
                    <div className="text-white text-xs font-medium truncate">{task.name}</div>
                    <div className="ml-auto text-white text-xs">{task.progress}%</div>
                  </div>

                  {/* Progress overlay */}
                  <div
                    className="absolute top-4 h-8 bg-purple-800 rounded-md"
                    style={{
                      ...getTaskBarStyle(task),
                      width: `${Number.parseFloat(getTaskBarStyle(task).width) * (task.progress / 100)}px`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="grid grid-cols-4 gap-6">
          <Card className="bg-purple-700 border-none">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm">Total Tasks</div>
            </CardContent>
          </Card>
          <Card className="bg-green-700 border-none text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">1</div>
              <div className="text-sm">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-700 border-none text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm">In Progress</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-none text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm">Not Started</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  )
}
