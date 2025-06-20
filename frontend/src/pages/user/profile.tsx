"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit3,
  Save,
  X,
  Star,
  Trophy,
  Target,
  Activity,
  Heart,
  Brain,
} from "lucide-react"

const achievements = [
  { title: "First Steps", description: "Completed your first session", icon: Target, earned: true },
  { title: "Consistent Learner", description: "7-day streak achieved", icon: Trophy, earned: true },
  { title: "Mindful Master", description: "Completed 10 mindfulness exercises", icon: Brain, earned: true },
  { title: "Wellness Warrior", description: "Completed 25 total exercises", icon: Heart, earned: false },
]

const stats = [
  { label: "Total Sessions", value: "26", change: "+3 this week" },
  { label: "Current Streak", value: "7 days", change: "Personal best!" },
  { label: "Wellness Score", value: "8.2/10", change: "+0.5 this month" },
  { label: "Time Invested", value: "4.2 hours", change: "This month" },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    bio: "Focused on improving mental wellness through mindfulness and stress management techniques.",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600">Manage your account and track your wellness journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 ring-4 ring-blue-100">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">Wellness Enthusiast</Badge>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.0 Rating</span>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">Member Since</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{profileData.joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Achievements
              </CardTitle>
              <CardDescription>Your wellness milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned ? "border-yellow-200 bg-yellow-50" : "border-gray-200 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${achievement.earned ? "bg-yellow-200" : "bg-gray-200"}`}>
                        <achievement.icon
                          className={`h-5 w-5 ${achievement.earned ? "text-yellow-700" : "text-gray-500"}`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Your Stats
              </CardTitle>
              <CardDescription>Track your wellness progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                    <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-xs text-green-600">{stat.change}</p>
                  {stat.label === "Wellness Score" && <Progress value={82} className="h-2" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Weekly Goal</CardTitle>
              <CardDescription>Complete 5 sessions this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">3 of 5</span>
                </div>
                <Progress value={60} className="h-3" />
                <p className="text-xs text-gray-500">2 more sessions to reach your goal!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
