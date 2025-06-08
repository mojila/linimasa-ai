"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for upcoming project deadlines
const mockDeadlines = [
  {
    id: 1,
    title: "Website Redesign Phase 1",
    description: "Complete the homepage and navigation redesign",
    dueDate: new Date("2024-01-15"),
    priority: "high",
    status: "in-progress",
    project: "Corporate Website",
    assignee: "Design Team"
  },
  {
    id: 2,
    title: "API Documentation",
    description: "Finalize REST API documentation for v2.0",
    dueDate: new Date("2024-01-18"),
    priority: "medium",
    status: "pending",
    project: "Backend Services",
    assignee: "Dev Team"
  },
  {
    id: 3,
    title: "User Testing Report",
    description: "Compile and analyze user testing feedback",
    dueDate: new Date("2024-01-22"),
    priority: "high",
    status: "in-progress",
    project: "UX Research",
    assignee: "Research Team"
  },
  {
    id: 4,
    title: "Mobile App Beta Release",
    description: "Deploy beta version to app stores",
    dueDate: new Date("2024-01-25"),
    priority: "critical",
    status: "pending",
    project: "Mobile Development",
    assignee: "Mobile Team"
  },
  {
    id: 5,
    title: "Security Audit",
    description: "Complete quarterly security assessment",
    dueDate: new Date("2024-02-01"),
    priority: "medium",
    status: "not-started",
    project: "Security",
    assignee: "Security Team"
  },
  {
    id: 6,
    title: "Database Migration",
    description: "Migrate legacy database to new infrastructure",
    dueDate: new Date("2024-02-10"),
    priority: "high",
    status: "planning",
    project: "Infrastructure",
    assignee: "DevOps Team"
  }
]

/**
 * Get the number of days until a deadline
 * @param date - The deadline date
 * @returns Number of days until deadline (negative if overdue)
 */
function getDaysUntilDeadline(date: Date): number {
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Format date to readable string
 * @param date - The date to format
 * @returns Formatted date string
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Get priority badge variant based on priority level
 * @param priority - The priority level
 * @returns Badge variant
 */
function getPriorityVariant(priority: string) {
  switch (priority) {
    case 'critical':
      return 'destructive'
    case 'high':
      return 'default'
    case 'medium':
      return 'secondary'
    default:
      return 'outline'
  }
}

/**
 * Get status icon based on status
 * @param status - The status string
 * @returns React icon component
 */
function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'in-progress':
      return <Clock className="h-4 w-4 text-blue-500" />
    case 'pending':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    default:
      return <Calendar className="h-4 w-4 text-gray-500" />
  }
}

export default function ChatPage() {
  // Sort deadlines by due date (nearest first)
  const sortedDeadlines = [...mockDeadlines].sort((a, b) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  )

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Upcoming Project Deadlines
          </h1>
          <p className="text-muted-foreground">
            Track and manage your project deadlines sorted by due date
          </p>
        </div>

        {/* Deadlines Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedDeadlines.map((deadline) => {
            const daysUntil = getDaysUntilDeadline(deadline.dueDate)
            const isOverdue = daysUntil < 0
            const isUrgent = daysUntil <= 3 && daysUntil >= 0

            return (
              <Card 
                key={deadline.id} 
                className={cn(
                  "transition-all duration-200 hover:shadow-lg",
                  isOverdue && "border-destructive bg-destructive/5",
                  isUrgent && "border-yellow-500 bg-yellow-500/5"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight">
                        {deadline.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {deadline.project}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={getPriorityVariant(deadline.priority)}
                      className="ml-2 shrink-0"
                    >
                      {deadline.priority}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {deadline.description}
                  </p>
                  
                  <div className="space-y-2">
                    {/* Due Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={cn(
                        "font-medium",
                        isOverdue && "text-destructive",
                        isUrgent && "text-yellow-600"
                      )}>
                        {formatDate(deadline.dueDate)}
                      </span>
                      <span className={cn(
                        "text-xs",
                        isOverdue && "text-destructive",
                        isUrgent && "text-yellow-600",
                        !isOverdue && !isUrgent && "text-muted-foreground"
                      )}>
                        {isOverdue 
                          ? `${Math.abs(daysUntil)} days overdue`
                          : daysUntil === 0 
                          ? "Due today"
                          : `${daysUntil} days left`
                        }
                      </span>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center gap-2 text-sm">
                      {getStatusIcon(deadline.status)}
                      <span className="capitalize text-muted-foreground">
                        {deadline.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    {/* Assignee */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {deadline.assignee.charAt(0)}
                        </span>
                      </div>
                      <span>{deadline.assignee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {sortedDeadlines.filter(d => getDaysUntilDeadline(d.dueDate) < 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {sortedDeadlines.filter(d => {
                    const days = getDaysUntilDeadline(d.dueDate)
                    return days <= 3 && days >= 0
                  }).length}
                </div>
                <div className="text-sm text-muted-foreground">Due Soon</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {sortedDeadlines.filter(d => d.status === 'in-progress').length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sortedDeadlines.filter(d => d.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
